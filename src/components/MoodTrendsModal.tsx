/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, TrendingUp, Calendar, Heart } from 'lucide-react';
import { DailyMoodMap, RoutineItem, RoutineRecordMap } from '../types.ts';
import { getPastDateStrings } from '../utils/hospitalSignal.ts';

interface MoodTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  moods: DailyMoodMap;
  checks: RoutineRecordMap;
  routines: RoutineItem[];
}

export const MoodTrendsModal: React.FC<MoodTrendsModalProps> = ({
  isOpen,
  onClose,
  moods,
  checks,
  routines,
}) => {
  const [range, setRange] = useState<7 | 14 | 30>(7);

  if (!isOpen) return null;

  const dateStrings = getPastDateStrings(range);

  // Compute daily data points
  const points = dateStrings.map((d) => {
    const dayCheck = checks[d] || {};
    let done = 0;
    routines.forEach((r) => {
      if (dayCheck[r.id]) done++;
    });
    const routinePercent = routines.length > 0 ? Math.round((done / routines.length) * 100) : 0;
    const moodVal = moods[d]?.mood || null;

    // Short date label: '10/24'
    const shortLabel = d.slice(5).replace('-', '/');

    return {
      date: d,
      shortLabel,
      mood: moodVal, // 1~5 or null
      routinePercent,
      routinesDone: done,
    };
  });

  const moodEmojis: Record<number, string> = {
    5: '😊',
    4: '🙂',
    3: '😐',
    2: '😔',
    1: '🌧️',
  };

  // SVG Chart dimensions
  const svgWidth = 360;
  const svgHeight = 160;
  const paddingX = 28;
  const paddingY = 24;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const stepX = points.length > 1 ? chartWidth / (points.length - 1) : chartWidth;

  // Mood coords (1=bottom, 5=top)
  const getMoodY = (m: number) => {
    // 5 is top (paddingY), 1 is bottom (paddingY + chartHeight)
    return paddingY + chartHeight - ((m - 1) / 4) * chartHeight;
  };

  // Routine coords (0%=bottom, 100%=top)
  const getRoutineY = (pct: number) => {
    return paddingY + chartHeight - (pct / 100) * chartHeight;
  };

  // Build SVG path for routine lines
  const routinePath = points
    .map((p, idx) => {
      const x = paddingX + idx * stepX;
      const y = getRoutineY(p.routinePercent);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Filter mood points that exist
  const validMoodPoints = points
    .map((p, idx) => ({
      x: paddingX + idx * stepX,
      y: p.mood ? getMoodY(p.mood) : null,
      mood: p.mood,
      date: p.date,
      shortLabel: p.shortLabel,
    }))
    .filter((pt) => pt.mood !== null);

  const moodPath = validMoodPoints
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[88vh] bg-[#FCFDFB] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-100/80 bg-white/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100/80 rounded-xl text-emerald-800">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">마음과 일상 리듬 추이</h2>
              <span className="text-[11px] text-slate-500">기분과 루틴 달성 흐름을 함께 살펴봐</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Range Selector */}
        <div className="flex items-center justify-center gap-1.5 p-2 bg-emerald-50/50 border-b border-emerald-100/60 text-xs">
          {([7, 14, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-xl font-medium transition-all ${
                range === r
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              최근 {r}일
            </button>
          ))}
        </div>

        {/* Chart Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-center gap-5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-1 bg-amber-400 rounded-full" />
              <span>기분 (5단계)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-1 bg-emerald-500 rounded-full" />
              <span>생활 루틴 달성률 (%)</span>
            </div>
          </div>

          {/* SVG Chart Box */}
          <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs flex flex-col items-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
              {/* Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((pct) => {
                const y = getRoutineY(pct);
                return (
                  <g key={pct}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 4}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94A3B8"
                      fontSize="9"
                    >
                      {pct}%
                    </text>
                  </g>
                );
              })}

              {/* Routine Path */}
              {routinePath && (
                <path
                  d={routinePath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              )}

              {/* Routine Points */}
              {points.map((p, idx) => {
                const x = paddingX + idx * stepX;
                const y = getRoutineY(p.routinePercent);
                return (
                  <circle
                    key={`r-${idx}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Mood Line */}
              {moodPath && (
                <path
                  d={moodPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Mood Points & Emojis */}
              {validMoodPoints.map((pt, idx) => (
                <g key={`m-${idx}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y!}
                    r="6"
                    fill="#FDE68A"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y! - 8}
                    textAnchor="middle"
                    fontSize="11"
                  >
                    {moodEmojis[pt.mood!]}
                  </text>
                </g>
              ))}

              {/* X-axis date labels */}
              {points.map((p, idx) => {
                // If 30 days, only show every 4th label; if 14 days every 2nd; if 7 days show all
                const showLabel =
                  range === 7 ||
                  (range === 14 && idx % 2 === 0) ||
                  (range === 30 && idx % 4 === 0) ||
                  idx === points.length - 1;

                if (!showLabel) return null;
                const x = paddingX + idx * stepX;
                return (
                  <text
                    key={`label-${idx}`}
                    x={x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="9"
                  >
                    {p.shortLabel}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Gentle Observation Note */}
          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed flex items-start gap-2">
            <Heart size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <p>
              오르막과 내리막이 있는 건 당연한 일이야. 낮아진 날이 있어도 괜찮아. 그날의 너는 충분히 버텨냈으니까.
            </p>
          </div>

          {/* Recent Days Detail List */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar size={13} />
              <span>날짜별 상세 기록</span>
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {[...points].reverse().map((p) => (
                <div
                  key={p.date}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 text-xs shadow-xs"
                >
                  <span className="font-medium text-slate-700">{p.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      루틴 {p.routinesDone}/{routines.length} ({p.routinePercent}%)
                    </span>
                    <span className="text-sm">
                      {p.mood ? moodEmojis[p.mood] : <span className="text-slate-300 text-xs">미기록</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
