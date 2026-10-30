/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CloudState,
  DailyMoodMap,
  HappinessItem,
  HealingQuote,
  MoodLevel,
  RoutineItem,
  RoutineRecordMap,
} from '../types.ts';
import { CloudCharacter } from './CloudCharacter.tsx';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  TrendingUp,
  Bookmark,
  Check,
  Coins,
} from 'lucide-react';
import { calculateCloudStage } from '../utils/storage.ts';

interface TodayTabProps {
  routines: RoutineItem[];
  routineChecks: RoutineRecordMap;
  moods: DailyMoodMap;
  cloudState: CloudState;
  dailyQuote: HealingQuote;
  happinessItems: HappinessItem[];
  bookmarkedQuoteIds: string[];
  onToggleRoutine: (date: string, routineId: string) => void;
  onSetMood: (date: string, mood: MoodLevel) => void;
  onToggleBookmarkQuote: (quoteId: string) => void;
  onOpenRoutineEdit: () => void;
  onOpenHappinessModal: () => void;
  onOpenTrendsModal: () => void;
  onOpenHospitalGuide: () => void;
  onOpenCounseling: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  routines,
  routineChecks,
  moods,
  cloudState,
  dailyQuote,
  happinessItems,
  bookmarkedQuoteIds,
  onToggleRoutine,
  onSetMood,
  onToggleBookmarkQuote,
  onOpenRoutineEdit,
  onOpenHappinessModal,
  onOpenTrendsModal,
  onOpenCounseling,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sparkleActive, setSparkleActive] = useState(false);
  const [recentCheerSpeech, setRecentCheerSpeech] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === todayStr;

  const currentDayChecks = routineChecks[selectedDate] || {};
  const currentMood = moods[selectedDate]?.mood || null;

  // Change date
  const changeDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  // Cloud stage
  const currentStage = calculateCloudStage(cloudState.totalEarnedCoins);

  // Compute checked count
  const coreRoutines = routines.filter((r) => r.isCore);
  const secondaryRoutines = routines.filter((r) => !r.isCore);

  const completedCount = routines.filter((r) => currentDayChecks[r.id]).length;
  const progressPercent = routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

  // Handling Routine Check with cute celebration
  const handleRoutineCheck = (routine: RoutineItem) => {
    const willBeChecked = !currentDayChecks[routine.id];
    onToggleRoutine(selectedDate, routine.id);

    if (willBeChecked) {
      setSparkleActive(true);
      setTimeout(() => setSparkleActive(false), 900);

      // Warm encouraging speech based on what was checked
      const cheers = [
        '정말 잘했어! 널 위해 해낸 작은 선물이야.',
        '천천히 하나씩 해내는 네 모습이 참 멋져.',
        '고마워, 네가 건강해지면 나도 몽실몽실 기뻐!',
        '오늘의 소중한 한 걸음, 내가 기억할게.',
        '무리하지 않고 해낸 것만으로도 충분해.',
      ];
      const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
      setRecentCheerSpeech(randomCheer);
      setTimeout(() => setRecentCheerSpeech(null), 3500);
    }
  };

  // Default cloud speech
  const defaultSpeech =
    recentCheerSpeech ||
    (completedCount === 0
      ? '오늘 이곳에 와준 것만으로도 충분해.'
      : completedCount >= 4
      ? '와, 오늘 일상 리듬을 포근하게 가꾸고 있구나!'
      : '작은 발걸음 하나씩, 천천히 가면 돼.');

  // Mood options
  const moodOptions: { level: MoodLevel; emoji: string; label: string }[] = [
    { level: 5, emoji: '😊', label: '아주 좋아요' },
    { level: 4, emoji: '🙂', label: '좋아요' },
    { level: 3, emoji: '😐', label: '보통이에요' },
    { level: 2, emoji: '😔', label: '지쳐요' },
    { level: 1, emoji: '🌧️', label: '많이 힘들어요' },
  ];

  const isQuoteBookmarked = bookmarkedQuoteIds.includes(dailyQuote.id);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Bar: Date Navigation & Trend Trigger */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeDate(-1)}
            aria-label="어제 보기"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-emerald-100/50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center px-1">
            <span className="text-xs font-semibold text-slate-800">
              {selectedDate} {isToday ? '(오늘)' : ''}
            </span>
          </div>
          <button
            onClick={() => changeDate(1)}
            disabled={isToday}
            aria-label="내일 보기"
            className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-xl hover:bg-emerald-100/50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Quick Actions: Trends & Coins */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTrendsModal}
            aria-label="기분 및 루틴 추이 그래프"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-emerald-200/90 rounded-xl text-xs font-medium text-emerald-800 shadow-2xs hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <TrendingUp size={14} />
            <span>리듬 그래프</span>
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-800">
            <Coins size={14} className="text-amber-500" />
            <span className="tabular-nums">{cloudState.coins}</span>
          </div>
        </div>
      </div>

      {/* Cloud Hero Section */}
      <div className="relative p-4 rounded-3xl bg-gradient-to-b from-white via-white to-emerald-50/50 border border-emerald-100/80 shadow-xs flex flex-col items-center">
        <CloudCharacter
          stage={currentStage}
          equippedClothes={cloudState.equippedClothes}
          equippedAccessory={cloudState.equippedAccessory}
          speechText={defaultSpeech}
          size="md"
          sparkle={sparkleActive}
          showStageBadge
        />

        {/* Progress bar */}
        <div className="w-full max-w-xs mt-3">
          <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1">
            <span>오늘의 일상 리듬</span>
            <span className="font-semibold text-emerald-800">{progressPercent}% ({completedCount}/{routines.length})</span>
          </div>
          <div className="w-full h-2 bg-emerald-100/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mood Logging Strip */}
      <section
        aria-label="오늘의 기분 기록"
        className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            {isToday ? '오늘 너의 마음 날씨는 어때?' : `${selectedDate}의 마음 날씨`}
          </span>
          {currentMood && (
            <span className="text-[11px] text-emerald-700 font-medium">
              기록 완료: {moodOptions.find((m) => m.level === currentMood)?.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {moodOptions.map((opt) => {
            const isSelected = currentMood === opt.level;
            return (
              <button
                key={opt.level}
                onClick={() => onSetMood(selectedDate, opt.level)}
                aria-label={opt.label}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-amber-100/90 border border-amber-300 scale-105 shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-slate-100/80 border border-transparent'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[10px] text-slate-600 mt-1 leading-tight text-center">
                  {opt.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Quote of the Day */}
      <section
        aria-label="오늘의 힐링 한 줄"
        className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100/90 shadow-2xs flex items-start gap-3"
      >
        <span className="text-xl">🌿</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-emerald-900">오늘의 마음 한 줄</span>
            <button
              onClick={() => onToggleBookmarkQuote(dailyQuote.id)}
              aria-label={isQuoteBookmarked ? '즐겨찾기 해제' : '문구 즐겨찾기'}
              className="text-emerald-700 hover:text-emerald-900 p-0.5"
            >
              <Bookmark
                size={14}
                className={isQuoteBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}
              />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            &ldquo;{dailyQuote.text}&rdquo;
          </p>
        </div>
      </section>

      {/* 몽글이 상담소 Shortcut Card */}
      <div
        onClick={onOpenCounseling}
        role="button"
        tabIndex={0}
        aria-label="몽글이 상담소 열기"
        className="p-3.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-blue-50/60 rounded-2xl border border-emerald-200/90 shadow-2xs flex items-center justify-between cursor-pointer active:scale-98 transition-all hover:border-emerald-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-2xs border border-emerald-100 shrink-0">
            💬
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-800">몽글이 상담소</h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                AI 비밀 상담
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">혼자 앓고 있는 고민이 있다면 편하게 털어놔 봐</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-white/90 border border-emerald-200 px-2.5 py-1 rounded-xl shadow-2xs">
          상담하기 &rarr;
        </span>
      </div>

      {/* Happiness Piggy Bank Shortcut Card */}
      <div
        onClick={onOpenHappinessModal}
        role="button"
        tabIndex={0}
        aria-label="행복 저금통 열기"
        className="p-3.5 bg-gradient-to-r from-amber-50/90 to-yellow-50/80 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between cursor-pointer active:scale-98 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍯</span>
          <div>
            <h4 className="text-xs font-bold text-amber-950">행복 저금통 ({happinessItems.length}개 모임)</h4>
            <p className="text-[11px] text-amber-800">오늘 있었던 작은 행복을 넣거나, 힘든 날 꺼내봐</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-xl">
          열어보기 &rarr;
        </span>
      </div>

      {/* Routine Checklists */}
      <div className="space-y-3">
        {/* Core Routines Section */}
        <section aria-label="핵심 생활 루틴" className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 font-bold text-xs">⭐</span>
              <h3 className="text-xs font-bold text-slate-800">핵심 일상 리듬 (기본 지킴이)</h3>
            </div>
            <span className="text-[10px] text-slate-400">코인 +12</span>
          </div>

          <div className="space-y-2">
            {coreRoutines.map((routine) => {
              const isChecked = Boolean(currentDayChecks[routine.id]);
              return (
                <div
                  key={routine.id}
                  onClick={() => handleRoutineCheck(routine)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                    isChecked
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                      : 'bg-white border-slate-200/90 hover:border-emerald-200 shadow-2xs'
                  }`}
                >
                  {/* Custom Checkbox circle */}
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 bg-slate-50'
                    }`}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>

                  {/* Routine Text */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-colors block ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {routine.title}
                    </span>
                    {routine.hint && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {routine.hint}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Secondary Routines Section */}
        <section aria-label="보조 생활 루틴" className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold text-xs">🌱</span>
              <h3 className="text-xs font-bold text-slate-800">보조 일상 루틴</h3>
            </div>
            <button
              onClick={onOpenRoutineEdit}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
            >
              <Settings size={12} />
              <span>루틴 수정/추가</span>
            </button>
          </div>

          <div className="space-y-2">
            {secondaryRoutines.map((routine) => {
              const isChecked = Boolean(currentDayChecks[routine.id]);
              return (
                <div
                  key={routine.id}
                  onClick={() => handleRoutineCheck(routine)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-white border-slate-200/80 hover:border-emerald-200 shadow-2xs'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 bg-slate-50'
                    }`}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-medium transition-colors block ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {routine.title}
                    </span>
                    {routine.hint && (
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {routine.hint}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Gentle Reassurance Footer Note */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
        <p className="text-xs text-slate-500 leading-relaxed">
          못 지킨 항목이 많아도 전혀 괜찮아. 내일 아침이 오면 언제든 다시 시작할 수 있어.
        </p>
      </div>
    </div>
  );
};
