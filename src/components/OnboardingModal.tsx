/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CloudCharacter } from './CloudCharacter.tsx';
import { ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '안녕! 몽글에 온 걸 환영해',
      desc: '불안하고 우울할 때, 무너진 일상 리듬을 아주 작은 걸음부터 천천히 회복하도록 돕는 너만의 따뜻한 쉼터야.',
      icon: Heart,
      characterText: '오늘 이곳을 찾아와준 것만으로도 정말 대단해!',
    },
    {
      title: '네 모든 기록은 안전해',
      desc: '네가 적는 마음과 생활 기록은 그 어떤 서버로도 전송되지 않고, 오직 지금 쓰고 있는 이 기기 안에만 안전하게 남아.',
      icon: ShieldCheck,
      characterText: '로그인도 필요 없어. 너만의 비밀 일기장이야.',
    },
    {
      title: '몽글이가 항상 곁에 있을게',
      desc: '루틴을 지키지 못해도 벌칙은 없어. 아무것도 못한 날에도 괜찮아. 곁에서 다정하게 응원해 줄게.',
      icon: Sparkles,
      characterText: '자, 이제 우리 천천히 시작해 볼까?',
    },
  ];

  const current = slides[slide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#FAFDF9] rounded-3xl p-6 shadow-2xl border border-emerald-100/90 text-center flex flex-col items-center">
        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slide === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-emerald-200'
              }`}
            />
          ))}
        </div>

        {/* Cloud Character */}
        <div className="py-2">
          <CloudCharacter
            stage={1}
            size="md"
            expression={slide === 2 ? 'cheer' : 'happy'}
            speechText={current.characterText}
          />
        </div>

        {/* Slide Content */}
        <div className="mt-2 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">{current.title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">{current.desc}</p>
        </div>

        {/* CTA Button */}
        <div className="w-full mt-6">
          {slide < slides.length - 1 ? (
            <button
              onClick={() => setSlide((prev) => prev + 1)}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
            >
              <span>다음으로</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
            >
              <span>몽글이와 함께 시작하기</span>
              <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
