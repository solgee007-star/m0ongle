/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoutineCategory = 'core' | 'health' | 'mind' | 'life';

export interface RoutineItem {
  id: string;
  title: string;
  isCore: boolean; // Core routines: 밥 챙겨 먹기, 잠자리에 들고 일어나기, 사람과 대화하기
  category: RoutineCategory;
  coinReward: number; // e.g. 10 for core, 5 for secondary
  hint?: string;
  isCustom?: boolean;
}

export type RoutineRecordMap = Record<string, Record<string, boolean>>; // date (YYYY-MM-DD) -> { routineId: boolean }

export type MoodLevel = 1 | 2 | 3 | 4 | 5; // 1: 🌧️ 많이 힘들어요, 2: 😔 지쳐요, 3: 😐 보통이에요, 4: 🙂 좋아요, 5: 😊 아주 좋아요

export interface DailyMoodRecord {
  mood: MoodLevel;
  note?: string;
  timestamp: number;
}

export type DailyMoodMap = Record<string, DailyMoodRecord>; // date (YYYY-MM-DD) -> DailyMoodRecord

export interface CognitiveTrap {
  id: string;
  name: string;
  summary: string;
  description: string;
  example: string;
}

export interface MindRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  title: string; // 지금 불안한 일은 뭐야?
  fact: string; // 객관적 사실 (카메라로 찍으면 보이는 것만)
  emotions: string[]; // 선택된 감정들
  initialIntensity: number; // 0 ~ 10
  thought: string; // 내 생각(해석)
  trapIds: string[]; // 생각 함정들
  friendReframe: string; // 다시 바라보기: 친한 친구에게 해줄 말
  finalIntensity: number; // 0 ~ 10 재평가
}

export interface HappinessItem {
  id: string;
  date: string;
  timestamp: number;
  content: string;
}

export type CloudStage = 1 | 2 | 3 | 4; // 1: 아기 구름, 2: 작은 구름, 3: 큰 구름, 4: 무지개 구름

export interface ShopItem {
  id: string;
  name: string;
  category: 'clothes' | 'accessory' | 'wallpaper' | 'floor' | 'furniture' | 'plant' | 'lighting';
  price: number;
  stageRequired: CloudStage;
  description: string;
  previewColor?: string;
  iconName: string;
}

export interface CloudState {
  coins: number;
  totalEarnedCoins: number;
  equippedClothes: string | null;
  equippedAccessory: string | null;
  equippedWallpaper: string | null;
  equippedFloor: string | null;
  equippedFurniture: string | null;
  equippedPlant: string | null;
  equippedLighting: string | null;
  unlockedItemIds: string[];
}

export interface HealingQuote {
  id: string;
  text: string;
  category: 'anxiety' | 'depression' | 'unmotivated' | 'bedtime' | 'cheer';
}

export interface SavedVideo {
  id: string;
  title: string;
  channelName?: string;
  url: string;
  memo?: string;
  addedAt: number;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  memo: string;
}

export type TabType = 'today' | 'mind' | 'calm' | 'room' | 'more';
