/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, X } from 'lucide-react';

interface HospitalAlertBannerProps {
  onOpenGuide: () => void;
  onDismiss: () => void;
}

export const HospitalAlertBanner: React.FC<HospitalAlertBannerProps> = ({
  onOpenGuide,
  onDismiss,
}) => {
  return (
    <aside
      aria-label="마음 신호 알림"
      className="relative z-30 mx-3 mt-3 bg-gradient-to-r from-amber-50/95 via-rose-50/95 to-emerald-50/95 border border-amber-200/80 rounded-2xl p-3.5 shadow-sm text-slate-800 backdrop-blur-sm animate-gentle-float"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-1.5 bg-amber-100/90 rounded-xl text-amber-700 shrink-0">
          <Heart size={18} className="fill-amber-400 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-900">몽글이의 다정한 마음 신호</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-snug">
            요즘 많이 힘들었지? 일상 리듬이 일주일에 4일 넘게 흔들렸어. 혼자 버티지 말고 병원이나 상담센터에 한번 가보는 건 어때?
          </p>
          <button
            onClick={onOpenGuide}
            className="mt-2 text-xs font-medium text-emerald-800 hover:text-emerald-900 underline underline-offset-2 flex items-center gap-1 active:opacity-75"
          >
            병원 안내 &amp; 내 요약 리포트 보기 &rarr;
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="오늘 알림 닫기"
          className="absolute top-2.5 right-2.5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
};
