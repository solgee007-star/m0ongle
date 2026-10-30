/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChatMessage,
  CloudState,
  DailyMoodMap,
  EmergencyContact,
  HappinessItem,
  HealingQuote,
  MindRecord,
  MoodLevel,
  RoutineItem,
  RoutineRecordMap,
  SavedVideo,
  ShopItem,
  TabType,
} from './types.ts';
import {
  clearAllMongleData,
  isOnboardingCompleted,
  loadBookmarkedQuotes,
  loadCloudState,
  loadEmergencyContact,
  loadHappinessItems,
  loadMindRecords,
  loadMoods,
  loadRoutineChecks,
  loadRoutines,
  loadSavedVideos,
  loadChatMessages,
  saveBookmarkedQuotes,
  saveCloudState,
  saveEmergencyContact,
  saveHappinessItems,
  saveMindRecords,
  saveMoods,
  saveRoutineChecks,
  saveRoutines,
  saveSavedVideos,
  saveChatMessages,
  setOnboardingCompleted,
  setHospitalBannerDismissedDate,
  DEFAULT_INITIAL_CHAT_MESSAGE,
  calculateCloudStage,
} from './utils/storage.ts';
import { HEALING_QUOTES } from './data/quotes.ts';
import { checkHospitalSignal } from './utils/hospitalSignal.ts';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { HospitalAlertBanner } from './components/HospitalAlertBanner.tsx';
import { HospitalGuideModal } from './components/HospitalGuideModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { HappinessPiggyBankModal } from './components/HappinessPiggyBankModal.tsx';
import { RoutineEditModal } from './components/RoutineEditModal.tsx';
import { MoodTrendsModal } from './components/MoodTrendsModal.tsx';
import { MongleCounselingModal } from './components/MongleCounselingModal.tsx';
import { TodayTab } from './components/TodayTab.tsx';
import { MindRecordTab } from './components/MindRecordTab.tsx';
import { CalmKitTab } from './components/CalmKitTab.tsx';
import { CloudRoomTab } from './components/CloudRoomTab.tsx';
import { MoreTab } from './components/MoreTab.tsx';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('today');

  // Core Persistent State
  const [routines, setRoutines] = useState<RoutineItem[]>(() => loadRoutines());
  const [routineChecks, setRoutineChecks] = useState<RoutineRecordMap>(() => loadRoutineChecks());
  const [moods, setMoods] = useState<DailyMoodMap>(() => loadMoods());
  const [mindRecords, setMindRecords] = useState<MindRecord[]>(() => loadMindRecords());
  const [happinessItems, setHappinessItems] = useState<HappinessItem[]>(() => loadHappinessItems());
  const [cloudState, setCloudState] = useState<CloudState>(() => loadCloudState());
  const [bookmarkedQuoteIds, setBookmarkedQuoteIds] = useState<string[]>(() =>
    loadBookmarkedQuotes()
  );
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>(() => loadSavedVideos());
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>(() =>
    loadEmergencyContact()
  );

  // Modals & Counseling
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !isOnboardingCompleted());
  const [isHospitalGuideOpen, setIsHospitalGuideOpen] = useState(false);
  const [isHappinessModalOpen, setIsHappinessModalOpen] = useState(false);
  const [isRoutineEditOpen, setIsRoutineEditOpen] = useState(false);
  const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
  const [isBannerDismissedLocally, setIsBannerDismissedLocally] = useState(false);
  const [isCounselingOpen, setIsCounselingOpen] = useState(false);

  // 몽글이 상담소 Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadChatMessages());
  const [isChatLoading, setIsChatLoading] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Sync to localStorage
  useEffect(() => {
    saveChatMessages(chatMessages);
  }, [chatMessages]);

  // Sync to localStorage
  useEffect(() => {
    saveRoutines(routines);
  }, [routines]);

  useEffect(() => {
    saveRoutineChecks(routineChecks);
  }, [routineChecks]);

  useEffect(() => {
    saveMoods(moods);
  }, [moods]);

  useEffect(() => {
    saveMindRecords(mindRecords);
  }, [mindRecords]);

  useEffect(() => {
    saveHappinessItems(happinessItems);
  }, [happinessItems]);

  useEffect(() => {
    saveCloudState(cloudState);
  }, [cloudState]);

  useEffect(() => {
    saveBookmarkedQuotes(bookmarkedQuoteIds);
  }, [bookmarkedQuoteIds]);

  useEffect(() => {
    saveSavedVideos(savedVideos);
  }, [savedVideos]);

  useEffect(() => {
    saveEmergencyContact(emergencyContact);
  }, [emergencyContact]);

  // Featured Daily Quote calculation (day-of-year deterministic pick)
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const index = dayOfYear % HEALING_QUOTES.length;
    return HEALING_QUOTES[index] || HEALING_QUOTES[0];
  }, []);

  // Hospital Signal check
  const hospitalSignal = useMemo(() => {
    if (isBannerDismissedLocally) return { shouldShowBanner: false, brokenDaysCount: 0 };
    return checkHospitalSignal(routines, routineChecks, todayStr);
  }, [routines, routineChecks, todayStr, isBannerDismissedLocally]);

  // Routine Check Handler
  const handleToggleRoutine = (date: string, routineId: string) => {
    const dayChecks = { ...(routineChecks[date] || {}) };
    const willBeChecked = !dayChecks[routineId];
    dayChecks[routineId] = willBeChecked;

    const nextChecks = { ...routineChecks, [date]: dayChecks };
    setRoutineChecks(nextChecks);

    // If checked, award coins! (Never deduct on uncheck - no penalties)
    if (willBeChecked) {
      const routine = routines.find((r) => r.id === routineId);
      const reward = routine ? routine.coinReward : 6;

      // Count checked routines today to see if daily bonus should be awarded
      const checkedCount = Object.values(dayChecks).filter(Boolean).length;
      const isDailyBonusEligible = checkedCount === 4;
      const bonus = isDailyBonusEligible ? 10 : 0;

      const totalGain = reward + bonus;

      setCloudState((prev) => ({
        ...prev,
        coins: prev.coins + totalGain,
        totalEarnedCoins: prev.totalEarnedCoins + totalGain,
      }));
    }
  };

  // Set Mood
  const handleSetMood = (date: string, mood: MoodLevel) => {
    setMoods((prev) => ({
      ...prev,
      [date]: {
        mood,
        timestamp: Date.now(),
      },
    }));

    // Award +5 coins for logging mood if first time today
    if (!moods[date]) {
      setCloudState((prev) => ({
        ...prev,
        coins: prev.coins + 5,
        totalEarnedCoins: prev.totalEarnedCoins + 5,
      }));
    }
  };

  // Bookmark Quote
  const handleToggleBookmarkQuote = (quoteId: string) => {
    if (bookmarkedQuoteIds.includes(quoteId)) {
      setBookmarkedQuoteIds(bookmarkedQuoteIds.filter((id) => id !== quoteId));
    } else {
      setBookmarkedQuoteIds([...bookmarkedQuoteIds, quoteId]);
    }
  };

  // Save Mind Record
  const handleSaveMindRecord = (record: MindRecord) => {
    setMindRecords([record, ...mindRecords]);
    // Reward +15 coins
    setCloudState((prev) => ({
      ...prev,
      coins: prev.coins + 15,
      totalEarnedCoins: prev.totalEarnedCoins + 15,
    }));
  };

  // Update Mind Record
  const handleUpdateMindRecord = (record: MindRecord) => {
    setMindRecords(mindRecords.map((r) => (r.id === record.id ? record : r)));
  };

  // Delete Mind Record
  const handleDeleteMindRecord = (id: string) => {
    setMindRecords(mindRecords.filter((r) => r.id !== id));
  };

  // Add Happiness Item
  const handleAddHappinessItem = (content: string) => {
    const newItem: HappinessItem = {
      id: `happy-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
      content,
    };
    setHappinessItems([newItem, ...happinessItems]);
    // Reward +5 coins
    setCloudState((prev) => ({
      ...prev,
      coins: prev.coins + 5,
      totalEarnedCoins: prev.totalEarnedCoins + 5,
    }));
  };

  // Routine Edit Actions
  const handleAddRoutine = (title: string, hint?: string) => {
    const newRoutine: RoutineItem = {
      id: `custom_${Date.now()}`,
      title,
      isCore: false,
      category: 'life',
      coinReward: 6,
      hint,
      isCustom: true,
    };
    setRoutines([...routines, newRoutine]);
  };

  const handleUpdateRoutine = (id: string, title: string, hint?: string) => {
    setRoutines(
      routines.map((r) => (r.id === id ? { ...r, title, hint: hint || undefined } : r))
    );
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(routines.filter((r) => r.id !== id));
  };

  // Cloud Room: Buy Item
  const handleBuyItem = (item: ShopItem): boolean => {
    if (cloudState.coins < item.price) return false;

    setCloudState((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      unlockedItemIds: [...prev.unlockedItemIds, item.id],
      // auto equip
      ...(item.category === 'clothes' ? { equippedClothes: item.id } : {}),
      ...(item.category === 'accessory' ? { equippedAccessory: item.id } : {}),
      ...(item.category === 'wallpaper' ? { equippedWallpaper: item.id } : {}),
      ...(item.category === 'floor' ? { equippedFloor: item.id } : {}),
      ...(item.category === 'furniture' ? { equippedFurniture: item.id } : {}),
      ...(item.category === 'plant' ? { equippedPlant: item.id } : {}),
      ...(item.category === 'lighting' ? { equippedLighting: item.id } : {}),
    }));

    return true;
  };

  // Cloud Room: Equip / Unequip
  const handleToggleEquip = (item: ShopItem) => {
    setCloudState((prev) => {
      const isCurrentlyEquipped =
        (item.category === 'clothes' && prev.equippedClothes === item.id) ||
        (item.category === 'accessory' && prev.equippedAccessory === item.id) ||
        (item.category === 'wallpaper' && prev.equippedWallpaper === item.id) ||
        (item.category === 'floor' && prev.equippedFloor === item.id) ||
        (item.category === 'furniture' && prev.equippedFurniture === item.id) ||
        (item.category === 'plant' && prev.equippedPlant === item.id) ||
        (item.category === 'lighting' && prev.equippedLighting === item.id);

      if (isCurrentlyEquipped) {
        // Unequip
        if (item.category === 'clothes') return { ...prev, equippedClothes: null };
        if (item.category === 'accessory') return { ...prev, equippedAccessory: null };
        if (item.category === 'wallpaper') return { ...prev, equippedWallpaper: null };
        if (item.category === 'floor') return { ...prev, equippedFloor: null };
        if (item.category === 'furniture') return { ...prev, equippedFurniture: null };
        if (item.category === 'plant') return { ...prev, equippedPlant: null };
        if (item.category === 'lighting') return { ...prev, equippedLighting: null };
      } else {
        // Equip
        if (item.category === 'clothes') return { ...prev, equippedClothes: item.id };
        if (item.category === 'accessory') return { ...prev, equippedAccessory: item.id };
        if (item.category === 'wallpaper') return { ...prev, equippedWallpaper: item.id };
        if (item.category === 'floor') return { ...prev, equippedFloor: item.id };
        if (item.category === 'furniture') return { ...prev, equippedFurniture: item.id };
        if (item.category === 'plant') return { ...prev, equippedPlant: item.id };
        if (item.category === 'lighting') return { ...prev, equippedLighting: item.id };
      }
      return prev;
    });
  };

  // Saved Videos
  const handleAddVideo = (videoData: Omit<SavedVideo, 'id' | 'addedAt'>) => {
    const newVideo: SavedVideo = {
      ...videoData,
      id: `vid-${Date.now()}`,
      addedAt: Date.now(),
    };
    setSavedVideos([newVideo, ...savedVideos]);
  };

  const handleDeleteVideo = (id: string) => {
    setSavedVideos(savedVideos.filter((v) => v.id !== id));
  };

  // Clear all data
  const handleClearAll = () => {
    clearAllMongleData();
    window.location.reload();
  };

  // Dismiss hospital banner for today
  const handleDismissBanner = () => {
    setHospitalBannerDismissedDate(todayStr);
    setIsBannerDismissedLocally(true);
  };

  // 몽글이 상담소 Chat Handlers
  const handleSendChatMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/counseling/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyText =
        data.text || data.fallbackText || '내가 언제나 네 곁에 머물며 귀 기울이고 있어. ☁️';

      const mongleMsg: ChatMessage = {
        id: `mongle-${Date.now()}`,
        sender: 'mongle',
        text: replyText,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, mongleMsg]);

      // Give a small coin reward for opening up (+3 coins)
      setCloudState((prev) => ({
        ...prev,
        coins: prev.coins + 3,
        totalEarnedCoins: prev.totalEarnedCoins + 3,
      }));
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `mongle-fallback-${Date.now()}`,
        sender: 'mongle',
        text: '지금 바람이 조금 세게 불어서 내 목소리가 잘 안 닿았나 봐. 잠깐 심호흡하고 다시 편하게 말해줄래? 언제든 네 곁에 있을게. ☁️',
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([DEFAULT_INITIAL_CHAT_MESSAGE]);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F3] text-slate-800 flex justify-center selection:bg-emerald-200">
      {/* Mobile-first Container: centered, clean padding */}
      <div className="w-full max-w-lg min-h-screen bg-[#F9FCF8] shadow-sm flex flex-col relative border-x border-emerald-100/60">
        {/* Hospital Warning Banner (Triggered when 4+ days of broken core routines in past 7 days) */}
        {hospitalSignal.shouldShowBanner && (
          <HospitalAlertBanner
            onOpenGuide={() => setIsHospitalGuideOpen(true)}
            onDismiss={handleDismissBanner}
          />
        )}

        {/* Top App Bar Header */}
        <header className="sticky top-0 z-30 bg-[#F9FCF8]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <span className="text-xl">☁️</span>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight">몽글</h1>
              <p className="text-[10px] text-emerald-800 font-medium">마음 돌봄과 일상 회복</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCounselingOpen(true)}
              aria-label="몽글이 상담소 열기"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-100/90 hover:bg-emerald-200/90 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold shadow-2xs active:scale-95 transition-all"
            >
              <span>💬</span>
              <span>상담소</span>
            </button>
            <span className="text-[11px] text-slate-500 block">
              {new Date().toLocaleDateString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
          </div>
        </header>

        {/* Main Body per Active Tab */}
        <main className="flex-1 px-4 pt-3">
          {currentTab === 'today' && (
            <TodayTab
              routines={routines}
              routineChecks={routineChecks}
              moods={moods}
              cloudState={cloudState}
              dailyQuote={dailyQuote}
              happinessItems={happinessItems}
              bookmarkedQuoteIds={bookmarkedQuoteIds}
              onToggleRoutine={handleToggleRoutine}
              onSetMood={handleSetMood}
              onToggleBookmarkQuote={handleToggleBookmarkQuote}
              onOpenRoutineEdit={() => setIsRoutineEditOpen(true)}
              onOpenHappinessModal={() => setIsHappinessModalOpen(true)}
              onOpenTrendsModal={() => setIsTrendsModalOpen(true)}
              onOpenHospitalGuide={() => setIsHospitalGuideOpen(true)}
              onOpenCounseling={() => setIsCounselingOpen(true)}
            />
          )}

          {currentTab === 'mind' && (
            <MindRecordTab
              records={mindRecords}
              onSaveRecord={handleSaveMindRecord}
              onUpdateRecord={handleUpdateMindRecord}
              onDeleteRecord={handleDeleteMindRecord}
            />
          )}

          {currentTab === 'calm' && (
            <CalmKitTab
              bookmarkedQuoteIds={bookmarkedQuoteIds}
              onToggleBookmarkQuote={handleToggleBookmarkQuote}
              savedVideos={savedVideos}
              onAddVideo={handleAddVideo}
              onDeleteVideo={handleDeleteVideo}
              onOpenCounseling={() => setIsCounselingOpen(true)}
            />
          )}

          {currentTab === 'room' && (
            <CloudRoomTab
              cloudState={cloudState}
              onBuyItem={handleBuyItem}
              onToggleEquip={handleToggleEquip}
            />
          )}

          {currentTab === 'more' && (
            <MoreTab
              contact={emergencyContact}
              onUpdateContact={setEmergencyContact}
              onClearAllData={handleClearAll}
              onOpenHospitalGuide={() => setIsHospitalGuideOpen(true)}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>

        {/* Floating Quick Action Button for 몽글이 상담소 */}
        <button
          onClick={() => setIsCounselingOpen(true)}
          aria-label="몽글이와 1:1 상담하기"
          className="fixed bottom-20 right-4 sm:right-[max(1rem,calc((100vw-32rem)/2+1rem))] z-30 flex items-center gap-2 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg border border-emerald-500/30 active:scale-95 transition-all animate-gentle-float"
        >
          <span className="text-base">☁️</span>
          <span className="text-xs font-bold tracking-tight">상담소 💬</span>
        </button>

        {/* Bottom Tab Bar */}
        <BottomNavBar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Modals */}
        <MongleCounselingModal
          isOpen={isCounselingOpen}
          onClose={() => setIsCounselingOpen(false)}
          messages={chatMessages}
          onSendMessage={handleSendChatMessage}
          onResetChat={handleResetChat}
          isLoading={isChatLoading}
          cloudStage={calculateCloudStage(cloudState.totalEarnedCoins)}
          onOpenHospitalGuide={() => setIsHospitalGuideOpen(true)}
        />

        <OnboardingModal
          isOpen={isOnboardingOpen}
          onFinish={() => {
            setOnboardingCompleted();
            setIsOnboardingOpen(false);
          }}
        />

        <HospitalGuideModal
          isOpen={isHospitalGuideOpen}
          onClose={() => setIsHospitalGuideOpen(false)}
          routines={routines}
          checks={routineChecks}
          moods={moods}
          mindRecords={mindRecords}
        />

        <HappinessPiggyBankModal
          isOpen={isHappinessModalOpen}
          onClose={() => setIsHappinessModalOpen(false)}
          items={happinessItems}
          onAddItem={handleAddHappinessItem}
        />

        <RoutineEditModal
          isOpen={isRoutineEditOpen}
          onClose={() => setIsRoutineEditOpen(false)}
          routines={routines}
          onAddRoutine={handleAddRoutine}
          onUpdateRoutine={handleUpdateRoutine}
          onDeleteRoutine={handleDeleteRoutine}
        />

        <MoodTrendsModal
          isOpen={isTrendsModalOpen}
          onClose={() => setIsTrendsModalOpen(false)}
          moods={moods}
          checks={routineChecks}
          routines={routines}
        />
      </div>
    </div>
  );
}
