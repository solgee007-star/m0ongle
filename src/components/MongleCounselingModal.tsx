/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, CloudStage } from '../types.ts';
import { CloudCharacter } from './CloudCharacter.tsx';
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  Heart,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import { DEFAULT_INITIAL_CHAT_MESSAGE } from '../utils/storage.ts';

interface MongleCounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (userText: string) => Promise<void>;
  onResetChat: () => void;
  isLoading: boolean;
  cloudStage: CloudStage;
  onOpenHospitalGuide?: () => void;
}

export const MongleCounselingModal: React.FC<MongleCounselingModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onResetChat,
  isLoading,
  cloudStage,
  onOpenHospitalGuide,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestedPrompts = [
    '오늘 실수해서 자꾸 자책하게 돼',
    '인간관계 때문에 마음이 너무 답답해',
    '아무것도 하기 싫고 무기력해',
    '내일 일어날 일 때문에 가슴이 뛰어',
    '나만 뒤처지는 것 같아 불안해',
    '마음이 복잡해서 잠이 안 와',
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const textToSend = inputText.trim();
    setInputText('');
    await onSendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
    textareaRef.current?.focus();
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full sm:h-[88vh] sm:max-h-[780px] bg-[#F7FAF6] sm:rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 py-3.5 bg-white/90 backdrop-blur-md border-b border-emerald-100 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 flex items-center justify-center overflow-hidden border border-emerald-200">
              <span className="text-xl">☁️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-800">몽글이 상담소</h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                  AI 1:1 상담
                </span>
              </div>
              <p className="text-[11px] text-slate-500">포근한 구름 친구와의 비밀 마음 대화</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (confirm('대화 기록을 지우고 처음부터 다시 시작할까?')) {
                  onResetChat();
                }
              }}
              title="대화 초기화"
              aria-label="대화 초기화"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              aria-label="닫기"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Medical / Safe Space Disclaimer Strip */}
        <div className="px-4 py-2 bg-emerald-50/80 border-b border-emerald-100/80 text-[11px] text-emerald-950 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Heart size={13} className="text-emerald-700 shrink-0" />
            <span className="truncate">
              이 대화는 의료 진단을 대신하지 않아. 언제든 털어놓을 수 있는 너만의 쉼터야.
            </span>
          </div>
          {onOpenHospitalGuide && (
            <button
              onClick={() => {
                onClose();
                onOpenHospitalGuide();
              }}
              className="text-[10px] font-semibold text-emerald-800 underline underline-offset-2 shrink-0 hover:text-emerald-950"
            >
              병원 안내
            </button>
          )}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Friendly Cloud Welcome Card at top */}
          <div className="p-4 bg-white/90 rounded-2xl border border-emerald-100/90 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <CloudCharacter
                stage={cloudStage}
                size="sm"
                expression="happy"
              />
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800 mb-0.5">혼자 끌어안지 말고 몽글이에게 털어놔 봐</p>
              <p className="text-[11px] text-slate-500">
                평가나 판단 없이 있는 그대로 들어줄게. 네 마음의 날씨를 천천히 들려줘.
              </p>
            </div>
          </div>

          {/* Messages list */}
          {messages.map((msg) => {
            const isMongle = msg.sender === 'mongle';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMongle ? 'justify-start' : 'justify-end'}`}
              >
                {/* Mongle Avatar for assistant messages */}
                {isMongle && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm shrink-0 mt-1">
                    ☁️
                  </div>
                )}

                <div
                  className={`group relative max-w-[82%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMongle
                      ? 'bg-white text-slate-800 border border-emerald-100 shadow-2xs rounded-tl-xs'
                      : 'bg-emerald-700 text-white shadow-2xs rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Message footer with timestamp and copy button */}
                  <div
                    className={`flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] ${
                      isMongle ? 'text-slate-400 border-t border-slate-50' : 'text-emerald-100/80'
                    }`}
                  >
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      title="텍스트 복사"
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {copiedId === msg.id ? (
                        <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                          <Check size={11} />
                          <span>복사됨</span>
                        </span>
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator when loading */}
          {isLoading && (
            <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm shrink-0 mt-1">
                ☁️
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs text-xs text-slate-500 flex items-center gap-2">
                <span className="animate-spin text-emerald-600">🌀</span>
                <span>몽글이가 네 마음에 귀 기울이고 있어...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#F2F7F1] border-t border-emerald-100/60 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">이런 고민:</span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-emerald-200/80 rounded-xl transition-colors active:scale-95 shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 bg-white border-t border-emerald-100/90 flex items-end gap-2 shrink-0"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="몽글이에게 털어놓고 싶은 고민을 편하게 적어봐..."
              className="w-full p-2.5 pr-2 bg-slate-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none leading-relaxed"
            />
            <div className="text-[10px] text-slate-400 px-1 pt-0.5">
              Enter로 전송 · Shift+Enter로 줄바꿈
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="메시지 전송"
            className="w-11 h-11 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0 mb-4"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
