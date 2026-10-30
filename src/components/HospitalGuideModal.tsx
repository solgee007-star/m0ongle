/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Phone, FileText, AlertCircle, Heart } from 'lucide-react';
import { DailyMoodMap, MindRecord, RoutineItem, RoutineRecordMap } from '../types.ts';
import { generateHospitalSummaryReport } from '../utils/hospitalSignal.ts';

interface HospitalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  routines: RoutineItem[];
  checks: RoutineRecordMap;
  moods: DailyMoodMap;
  mindRecords: MindRecord[];
}

export const HospitalGuideModal: React.FC<HospitalGuideModalProps> = ({
  isOpen,
  onClose,
  routines,
  checks,
  moods,
  mindRecords,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const report = generateHospitalSummaryReport(routines, checks, moods, mindRecords);

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(report.reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#FAFDF9] rounded-t-3xl sm:rounded-3xl shadow-xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100/80 bg-white/80 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100/80 rounded-xl text-emerald-800">
              <Heart size={18} />
            </div>
            <h2 className="text-base font-semibold text-slate-800">병원 &amp; 상담 안내</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Warm Note */}
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-100 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-2">
            <p className="font-semibold text-emerald-900">
              혼자서 모든 짐을 다 짊어지지 않아도 돼
            </p>
            <p>
              감기에 걸리면 이비인후과에 가듯, 마음에 감기가 찾아왔을 때 정신건강의학과나 공인 상담센터를 찾는 건 자연스럽고 아주 용기 있는 일이야.
            </p>
            <p className="text-[11px] text-emerald-700/90">
              * 이 앱은 의료 진단이나 치료를 대신하지 않아. 의사 선생님이나 상담사에게 일상 패턴을 들려줄 때 아래 요약 리포트를 보여주면 큰 도움이 될 거야.
            </p>
          </div>

          {/* 2-Week Summary Report Box */}
          <div className="bg-white rounded-2xl border border-emerald-100/90 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-700" />
                <h3 className="text-sm font-semibold text-slate-800">병원 방문용 2주 요약 리포트</h3>
              </div>
              <button
                onClick={handleCopyReport}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? '복사 완료!' : '텍스트 복사'}</span>
              </button>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-0.5">핵심 루틴 달성률</span>
                <span className="text-base font-bold text-slate-800">{report.coreRoutineRate}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">식사 · 수면 · 대화</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-0.5">최근 마음기록 작성</span>
                <span className="text-base font-bold text-slate-800">{report.anxietyRecordsCount}회</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">불안 및 생각 기록</span>
              </div>
            </div>

            {/* Full Report Text Box */}
            <div className="relative">
              <pre className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto border border-slate-100">
                {report.reportText}
              </pre>
            </div>
          </div>

          {/* First Visit Tips */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">첫 방문이 두려운 너를 위한 팁</h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <span>
                  <strong>예약하고 방문하기:</strong> 대부분의 정신건강의학과는 예약제로 운영돼. 네이버 지도나 카카오맵에서 집 근처 클리닉에 전화해 "초진 예약하고 싶어요"라고 말하면 친절히 안내해줘.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">2.</span>
                <span>
                  <strong>말을 조리 있게 못 해도 괜찮아:</strong> 긴장되면 위의 요약 리포트를 화면으로 보여주거나 복사해 읽어줘도 의사 선생님이 다 이해해주셔.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">3.</span>
                <span>
                  <strong>비용과 기록:</strong> 일반 초진 비용은 건강보험 적용 시 약 2~3만 원 안팎이야. 의료 기록은 법적으로 철저하게 비밀이 보장되니 걱정하지 않아도 돼.
                </span>
              </li>
            </ul>
          </div>

          {/* Crisis Hotline Numbers */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100/90 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
              <AlertCircle size={16} />
              <span>지금 당장 너무 버겁고 위험한 생각이 들 때</span>
            </div>
            <p className="text-xs text-rose-950/80 leading-relaxed">
              혼자서 고통을 참지 말고, 24시간 언제든 익명으로 온전히 내 편이 되어주는 전문가에게 연락해줘.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:109"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white text-rose-700 font-medium text-xs rounded-xl shadow-xs border border-rose-200 active:scale-95 transition-transform"
              >
                <Phone size={14} />
                <span>자살예방 109</span>
              </a>
              <a
                href="tel:119"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white text-rose-700 font-medium text-xs rounded-xl shadow-xs border border-rose-200 active:scale-95 transition-transform"
              >
                <Phone size={14} />
                <span>응급 119</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/90 border-t border-emerald-100/80 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl hover:bg-emerald-800 active:scale-95 transition-all shadow-xs"
          >
            확인했어, 고마워
          </button>
        </div>
      </div>
    </div>
  );
};
