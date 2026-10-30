/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChatMessage,
  CloudStage,
  CloudState,
  DailyMoodMap,
  EmergencyContact,
  HappinessItem,
  MindRecord,
  RoutineItem,
  RoutineRecordMap,
  SavedVideo,
} from '../types.ts';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines.ts';

const KEYS = {
  ROUTINES: 'mongle_routines_list',
  ROUTINE_CHECKS: 'mongle_routine_checks',
  MOODS: 'mongle_moods',
  MIND_RECORDS: 'mongle_mind_records',
  HAPPINESS_ITEMS: 'mongle_happiness_items',
  CLOUD_STATE: 'mongle_cloud_state',
  BOOKMARKED_QUOTES: 'mongle_bookmarked_quotes',
  SAVED_VIDEOS: 'mongle_saved_videos',
  EMERGENCY_CONTACT: 'mongle_emergency_contact',
  HOSPITAL_BANNER_DISMISSED: 'mongle_hospital_banner_dismissed',
  ONBOARDING_DONE: 'mongle_onboarding_done',
  CHAT_MESSAGES: 'mongle_chat_messages',
};

// Safe JSON get
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return defaultValue;
  }
}

// Safe JSON set
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

// 1. Routines
export function loadRoutines(): RoutineItem[] {
  return getStorageItem<RoutineItem[]>(KEYS.ROUTINES, DEFAULT_ROUTINES);
}

export function saveRoutines(routines: RoutineItem[]): void {
  setStorageItem(KEYS.ROUTINES, routines);
}

// 2. Routine Checks (Date -> RoutineId -> checked)
export function loadRoutineChecks(): RoutineRecordMap {
  return getStorageItem<RoutineRecordMap>(KEYS.ROUTINE_CHECKS, {});
}

export function saveRoutineChecks(checks: RoutineRecordMap): void {
  setStorageItem(KEYS.ROUTINE_CHECKS, checks);
}

// 3. Moods
export function loadMoods(): DailyMoodMap {
  return getStorageItem<DailyMoodMap>(KEYS.MOODS, {});
}

export function saveMoods(moods: DailyMoodMap): void {
  setStorageItem(KEYS.MOODS, moods);
}

// 4. Mind Records
export function loadMindRecords(): MindRecord[] {
  return getStorageItem<MindRecord[]>(KEYS.MIND_RECORDS, []);
}

export function saveMindRecords(records: MindRecord[]): void {
  setStorageItem(KEYS.MIND_RECORDS, records);
}

// 5. Happiness Items
export function loadHappinessItems(): HappinessItem[] {
  return getStorageItem<HappinessItem[]>(KEYS.HAPPINESS_ITEMS, [
    {
      id: 'default-welcome-happy',
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now() - 3600000,
      content: '햇살이 따스하게 들어오는 창가에서 마신 차가 참 향긋했어.',
    },
  ]);
}

export function saveHappinessItems(items: HappinessItem[]): void {
  setStorageItem(KEYS.HAPPINESS_ITEMS, items);
}

// 6. Cloud State & Stage Calculator
export function calculateCloudStage(totalEarned: number): CloudStage {
  if (totalEarned >= 350) return 4; // 무지개 구름
  if (totalEarned >= 150) return 3; // 큰 구름
  if (totalEarned >= 50) return 2;  // 작은 구름
  return 1; // 아기 구름
}

const DEFAULT_CLOUD_STATE: CloudState = {
  coins: 30, // Start with a welcome gift of 30 coins!
  totalEarnedCoins: 30,
  equippedClothes: null,
  equippedAccessory: null,
  equippedWallpaper: null,
  equippedFloor: null,
  equippedFurniture: null,
  equippedPlant: null,
  equippedLighting: null,
  unlockedItemIds: [],
};

export function loadCloudState(): CloudState {
  const loaded = getStorageItem<CloudState>(KEYS.CLOUD_STATE, DEFAULT_CLOUD_STATE);
  return loaded;
}

export function saveCloudState(state: CloudState): void {
  setStorageItem(KEYS.CLOUD_STATE, state);
}

// 7. Bookmarked Quotes
export function loadBookmarkedQuotes(): string[] {
  return getStorageItem<string[]>(KEYS.BOOKMARKED_QUOTES, ['anx-1', 'dep-2', 'bed-1']);
}

export function saveBookmarkedQuotes(quoteIds: string[]): void {
  setStorageItem(KEYS.BOOKMARKED_QUOTES, quoteIds);
}

// 8. Saved Videos
export function loadSavedVideos(): SavedVideo[] {
  return getStorageItem<SavedVideo[]>(KEYS.SAVED_VIDEOS, []);
}

export function saveSavedVideos(videos: SavedVideo[]): void {
  setStorageItem(KEYS.SAVED_VIDEOS, videos);
}

// 9. Emergency Contact
const DEFAULT_CONTACT: EmergencyContact = {
  name: '가장 편한 친구나 가족',
  phone: '',
  memo: '힘들 땐 언제든 전화해줘, 언제든 들어줄게.',
};

export function loadEmergencyContact(): EmergencyContact {
  return getStorageItem<EmergencyContact>(KEYS.EMERGENCY_CONTACT, DEFAULT_CONTACT);
}

export function saveEmergencyContact(contact: EmergencyContact): void {
  setStorageItem(KEYS.EMERGENCY_CONTACT, contact);
}

// 10. Hospital Alert Banner Dismiss Date
export function getHospitalBannerDismissedDate(): string | null {
  return localStorage.getItem(KEYS.HOSPITAL_BANNER_DISMISSED);
}

export function setHospitalBannerDismissedDate(dateStr: string): void {
  localStorage.setItem(KEYS.HOSPITAL_BANNER_DISMISSED, dateStr);
}

// 11. Onboarding Flag
export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true';
}

export function setOnboardingCompleted(): void {
  localStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
}

// 12. Chat Messages for 몽글이 상담소
export const DEFAULT_INITIAL_CHAT_MESSAGE: ChatMessage = {
  id: 'mongle-welcome-chat',
  sender: 'mongle',
  text: '안녕! 난 네 곁에 머무는 구름 친구 몽글이야 ☁️\n오늘 마음에 걸리거나 불안하고 힘든 일이 있었니? 아무리 사소한 것이라도 좋으니 편하게 털어놓아 줘. 난 언제나 네 편이야.',
  timestamp: Date.now(),
};

export function loadChatMessages(): ChatMessage[] {
  return getStorageItem<ChatMessage[]>(KEYS.CHAT_MESSAGES, [DEFAULT_INITIAL_CHAT_MESSAGE]);
}

export function saveChatMessages(messages: ChatMessage[]): void {
  setStorageItem(KEYS.CHAT_MESSAGES, messages);
}

// Helper: Clear all user data
export function clearAllMongleData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

// Helper: Export all data as JSON
export function exportAllDataAsJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    routines: loadRoutines(),
    routineChecks: loadRoutineChecks(),
    moods: loadMoods(),
    mindRecords: loadMindRecords(),
    happinessItems: loadHappinessItems(),
    cloudState: loadCloudState(),
    bookmarkedQuotes: loadBookmarkedQuotes(),
    savedVideos: loadSavedVideos(),
    emergencyContact: loadEmergencyContact(),
    chatMessages: loadChatMessages(),
  };
  return JSON.stringify(data, null, 2);
}
