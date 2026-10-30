/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyMoodMap, MindRecord, RoutineItem, RoutineRecordMap } from '../types.ts';
import { getHospitalBannerDismissedDate } from './storage.ts';

/**
 * Returns date strings in YYYY-MM-DD format for the past N days ending today
 */
export function getPastDateStrings(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/**
 * Check if hospital warning banner should be displayed
 */
export function checkHospitalSignal(
  routines: RoutineItem[],
  checks: RoutineRecordMap,
  todayStr: string
): { shouldShowBanner: boolean; brokenDaysCount: number } {
  // If user already dismissed the banner today, don't nag
  const dismissedDate = getHospitalBannerDismissedDate();
  const isDismissedToday = dismissedDate === todayStr;

  const coreRoutineIds = routines.filter((r) => r.isCore).map((r) => r.id);
  const past7Days = getPastDateStrings(7);

  let brokenDaysCount = 0;

  for (const date of past7Days) {
    const dayChecks = checks[date] || {};
    // Count how many core routines were completed
    let completedCoreCount = 0;
    for (const coreId of coreRoutineIds) {
      if (dayChecks[coreId]) {
        completedCoreCount++;
      }
    }

    // "핵심 루틴이 무너진 날": 3개 중 2개 이상을 못 지킨 날 (즉 지킨 개수가 1개 이하)
    const missedCoreCount = coreRoutineIds.length - completedCoreCount;
    if (missedCoreCount >= 2) {
      brokenDaysCount++;
    }
  }

  const triggered = brokenDaysCount >= 4;

  return {
    shouldShowBanner: triggered && !isDismissedToday,
    brokenDaysCount,
  };
}

/**
 * Generate 2-week summary report for medical/counseling consultation
 */
export function generateHospitalSummaryReport(
  routines: RoutineItem[],
  checks: RoutineRecordMap,
  moods: DailyMoodMap,
  mindRecords: MindRecord[]
): {
  daysAnalyzed: number;
  routineRate: number;
  coreRoutineRate: number;
  moodCounts: Record<number, number>;
  anxietyRecordsCount: number;
  reportText: string;
} {
  const past14Days = getPastDateStrings(14);
  const coreRoutineIds = routines.filter((r) => r.isCore).map((r) => r.id);

  let totalRoutinesPossible = 0;
  let totalRoutinesDone = 0;
  let totalCorePossible = past14Days.length * coreRoutineIds.length;
  let totalCoreDone = 0;

  const moodCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const date of past14Days) {
    const dayChecks = checks[date] || {};
    totalRoutinesPossible += routines.length;

    routines.forEach((r) => {
      if (dayChecks[r.id]) totalRoutinesDone++;
    });

    coreRoutineIds.forEach((cId) => {
      if (dayChecks[cId]) totalCoreDone++;
    });

    if (moods[date]?.mood) {
      moodCounts[moods[date].mood] = (moodCounts[moods[date].mood] || 0) + 1;
    }
  }

  // Count mind records within past 14 days
  const twoWeeksAgoTimestamp = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const recentMindRecords = mindRecords.filter((r) => r.timestamp >= twoWeeksAgoTimestamp);

  const overallRoutineRate =
    totalRoutinesPossible > 0 ? Math.round((totalRoutinesDone / totalRoutinesPossible) * 100) : 0;
  const coreRoutineRate =
    totalCorePossible > 0 ? Math.round((totalCoreDone / totalCorePossible) * 100) : 0;

  const moodLabels: Record<number, string> = {
    1: '🌧️ 많이 힘들어요',
    2: '😔 지쳐요',
    3: '😐 보통이에요',
    4: '🙂 좋아요',
    5: '😊 아주 좋아요',
  };

  const reportText = `[몽글 마음 돌봄 - 지난 2주간의 일상 리듬 및 마음 기록 요약]
분석 기간: ${past14Days[0]} ~ ${past14Days[past14Days.length - 1]} (14일간)

1. 생활 리듬 달성 현황
- 핵심 생활 루틴 (식사/수면/대화) 달성률: ${coreRoutineRate}%
- 전체 생활 루틴 평균 달성률: ${overallRoutineRate}%
- 관찰: 일상 기본 리듬(식사, 수면, 대화)이 평소보다 다소 흔들린 날이 있었습니다.

2. 기분 기록 분포
${Object.entries(moodCounts)
  .map(([lvl, count]) => `- ${moodLabels[Number(lvl)]}: ${count}일`)
  .join('\n')}

3. 불안 및 생각 기록 (CBT 마음기록)
- 최근 2주간 마음기록 작성 횟수: 총 ${recentMindRecords.length}회
${
  recentMindRecords.length > 0
    ? `- 주요 감정 키워드: ${Array.from(new Set(recentMindRecords.flatMap((r) => r.emotions)))
        .slice(0, 6)
        .join(', ') || '없음'}`
    : '- 작성된 기록 없음'
}

* 본 리포트는 의료적 진단이 아니며, 상담이나 진료 시 일상 패턴 참고용으로 환자 본인이 기록한 내용입니다.`;

  return {
    daysAnalyzed: 14,
    routineRate: overallRoutineRate,
    coreRoutineRate,
    moodCounts,
    anxietyRecordsCount: recentMindRecords.length,
    reportText,
  };
}
