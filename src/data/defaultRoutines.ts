/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoutineItem } from '../types.ts';

export const DEFAULT_ROUTINES: RoutineItem[] = [
  // 핵심 루틴 3종 (고정, 병원 신호 판단 기준)
  {
    id: 'core_meal',
    title: '밥 챙겨 먹기',
    isCore: true,
    category: 'core',
    coinReward: 12,
    hint: '거창하지 않아도 돼. 바나나 한 개, 따뜻한 밥 한 숟갈이라도 좋아.',
  },
  {
    id: 'core_sleep',
    title: '잠자리에 들고 일어나기 (수면)',
    isCore: true,
    category: 'core',
    coinReward: 12,
    hint: '잠이 잘 안 와도 누워서 몸을 뉘인 것만으로도 쉬어간 거야.',
  },
  {
    id: 'core_talk',
    title: '사람과 대화하기',
    isCore: true,
    category: 'core',
    coinReward: 12,
    hint: '가족, 친구와의 짧은 안부나 편의점 사장님과의 "감사합니다" 인사도 충분해.',
  },

  // 보조 루틴 (추가/수정/삭제 가능)
  {
    id: 'sub_wash',
    title: '씻기 (세수나 양치, 가벼운 샤워)',
    isCore: false,
    category: 'life',
    coinReward: 6,
    hint: '따뜻한 물로 손만 씻거나 입만 헹궈도 개운해져.',
  },
  {
    id: 'sub_sunlight',
    title: '바깥 공기 쐬기 / 햇빛 보기',
    isCore: false,
    category: 'health',
    coinReward: 6,
    hint: '창문을 활짝 열고 1분간 깊게 숨 쉬어보자.',
  },
  {
    id: 'sub_water',
    title: '물 한 잔 천천히 마시기',
    isCore: false,
    category: 'health',
    coinReward: 5,
    hint: '목을 축이며 몸의 감각에 살며시 집중해봐.',
  },
  {
    id: 'sub_medicine',
    title: '처방받은 약 챙기기 (해당 시)',
    isCore: false,
    category: 'health',
    coinReward: 8,
    hint: '의사 선생님과 약속한 시간을 다정하게 지켜줘.',
  },
  {
    id: 'sub_small_win',
    title: '작은 일 하나 해내기',
    isCore: false,
    category: 'mind',
    coinReward: 6,
    hint: '이부자리 털기, 컵 씻기, 책 한 쪽 읽기처럼 1분짜리 작은 일.',
  },
];
