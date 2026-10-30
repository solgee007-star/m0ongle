/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Heart, Gift, Plus } from 'lucide-react';
import { HappinessItem } from '../types.ts';

interface HappinessPiggyBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: HappinessItem[];
  onAddItem: (content: string) => void;
}

export const HappinessPiggyBankModal: React.FC<HappinessPiggyBankModalProps> = ({
  isOpen,
  onClose,
  items,
  onAddItem,
}) => {
  const [newContent, setNewContent] = useState('');
  const [randomMemory, setRandomMemory] = useState<HappinessItem | null>(null);
  const [showCoinDropAnim, setShowCoinDropAnim] = useState(false);
  const [mode, setMode] = useState<'add' | 'draw' | 'list'>('add');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    // Trigger cute coin drop animation
    setShowCoinDropAnim(true);
    setTimeout(() => {
      onAddItem(newContent.trim());
      setNewContent('');
      setShowCoinDropAnim(false);
    }, 600);
  };

  const handleDrawRandom = () => {
    if (items.length === 0) return;
    const randomIndex = Math.floor(Math.random() * items.length);
    setRandomMemory(items[randomIndex]);
    setMode('draw');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#FCFDFB] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-100/80 bg-white/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍯</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">행복 저금통</h2>
              <span className="text-[11px] text-emerald-800">모인 작은 행복: {items.length}개</span>
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

        {/* Tab Buttons */}
        <div className="flex items-center p-1.5 bg-emerald-50/70 border-b border-emerald-100/60 text-xs">
          <button
            onClick={() => setMode('add')}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
              mode === 'add'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            행복 넣기
          </button>
          <button
            onClick={handleDrawRandom}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-all flex items-center justify-center gap-1 ${
              mode === 'draw'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Gift size={13} />
            <span>힘든 날 열어보기</span>
          </button>
          <button
            onClick={() => setMode('list')}
            className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
              mode === 'list'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            모아보기 ({items.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {mode === 'add' && (
            <div className="space-y-4">
              {/* Cute Jar Illustration */}
              <div className="relative flex flex-col items-center justify-center py-2">
                <div className="relative w-24 h-28 bg-gradient-to-b from-amber-100 to-amber-200/80 rounded-2xl border-2 border-amber-300 shadow-inner flex flex-col items-center justify-center">
                  <div className="w-16 h-3 bg-amber-300 rounded-full mb-1 border border-amber-400" />
                  <span className="text-2xl mt-1">✨</span>
                  <span className="text-[10px] font-bold text-amber-800 mt-1">행복 코인 {items.length}</span>

                  {/* Coin Drop animation */}
                  {showCoinDropAnim && (
                    <div className="absolute -top-6 text-xl animate-bounce">
                      🪙
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 text-center mt-3">
                  아주 사소한 것도 좋아. 오늘 널 슬며시 미소 짓게 만든 순간이 있었니?
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-3">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="예: 점심 먹고 산책할 때 바람이 참 시원했어. 편의점 직원이 다정하게 인사해줬어."
                  rows={3}
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={!newContent.trim() || showCoinDropAnim}
                  className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-medium text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
                >
                  <Plus size={16} />
                  <span>저금통에 쏙 넣기 (+5 코인)</span>
                </button>
              </form>
            </div>
          )}

          {mode === 'draw' && (
            <div className="space-y-4 py-2 text-center">
              {randomMemory ? (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-emerald-50/60 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex justify-center">
                    <span className="text-3xl">🍯</span>
                  </div>
                  <div className="text-xs text-amber-800 font-medium">
                    {randomMemory.date}에 넣어둔 네 소중한 기억
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed px-2">
                    &ldquo;{randomMemory.content}&rdquo;
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-800 flex items-center justify-center gap-1">
                    <Heart size={13} className="fill-emerald-600 text-emerald-600" />
                    <span>너에게 이런 따뜻한 순간이 머물렀던 적이 있어.</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  아직 저금통이 비어 있어. 먼저 오늘의 작은 순간을 하나 넣어볼래?
                </div>
              )}

              <button
                onClick={handleDrawRandom}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
              >
                <Sparkles size={16} />
                <span>다른 행복 기억 꺼내보기</span>
              </button>
            </div>
          )}

          {mode === 'list' && (
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  저금통에 보관된 기억이 아직 없어.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-emerald-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 shadow-xs"
                  >
                    <span className="text-amber-500 mt-0.5">💛</span>
                    <div className="flex-1">
                      <p>{item.content}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{item.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
