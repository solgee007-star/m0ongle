/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MindRecord } from '../types.ts';
import { COGNITIVE_TRAPS } from '../data/cognitiveTraps.ts';
import { CloudCharacter } from './CloudCharacter.tsx';
import {
  Camera,
  Heart,
  Brain,
  HelpCircle,
  MessageCircleHeart,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3,
  X,
  Coins,
  Smile,
} from 'lucide-react';

interface MindRecordTabProps {
  records: MindRecord[];
  onSaveRecord: (record: MindRecord) => void;
  onUpdateRecord: (record: MindRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const MindRecordTab: React.FC<MindRecordTabProps> = ({
  records,
  onSaveRecord,
  onUpdateRecord,
  onDeleteRecord,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [fact, setFact] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [customEmotionInput, setCustomEmotionInput] = useState('');
  const [initialIntensity, setInitialIntensity] = useState<number>(7);
  const [thought, setThought] = useState('');
  const [selectedTraps, setSelectedTraps] = useState<string[]>([]);
  const [friendReframe, setFriendReframe] = useState('');
  const [finalIntensity, setFinalIntensity] = useState<number>(4);

  // Celebration Modal State after submission
  const [celebrationData, setCelebrationData] = useState<{
    record: MindRecord;
    intensityDiff: number;
    coinsEarned: number;
  } | null>(null);

  const defaultEmotionChips = [
    '불안함',
    '두려움',
    '슬픔',
    '외로움',
    '화남/답답함',
    '막막함',
    '공허함',
    '자책감',
    '무기력함',
    '긴장됨',
    '수치심/부끄러움',
    '초조함',
  ];

  const handleToggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleAddCustomEmotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmotionInput.trim()) return;
    if (!selectedEmotions.includes(customEmotionInput.trim())) {
      setSelectedEmotions([...selectedEmotions, customEmotionInput.trim()]);
    }
    setCustomEmotionInput('');
  };

  const handleToggleTrap = (trapId: string) => {
    if (selectedTraps.includes(trapId)) {
      setSelectedTraps(selectedTraps.filter((id) => id !== trapId));
    } else {
      setSelectedTraps([...selectedTraps, trapId]);
    }
  };

  // Open Form for New Record
  const handleOpenNewForm = () => {
    setEditingRecordId(null);
    setTitle('');
    setFact('');
    setSelectedEmotions([]);
    setInitialIntensity(7);
    setThought('');
    setSelectedTraps([]);
    setFriendReframe('');
    setFinalIntensity(4);
    setIsFormOpen(true);
  };

  // Open Form to Edit an Existing Record
  const handleStartEdit = (rec: MindRecord) => {
    setEditingRecordId(rec.id);
    setTitle(rec.title);
    setFact(rec.fact);
    setSelectedEmotions(rec.emotions);
    setInitialIntensity(rec.initialIntensity);
    setThought(rec.thought);
    setSelectedTraps(rec.trapIds);
    setFriendReframe(rec.friendReframe);
    setFinalIntensity(rec.finalIntensity);
    setIsFormOpen(true);
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRecordId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fact.trim()) return;

    if (editingRecordId) {
      // Update existing record
      const existing = records.find((r) => r.id === editingRecordId);
      const updated: MindRecord = {
        id: editingRecordId,
        date: existing ? existing.date : new Date().toISOString().slice(0, 10),
        timestamp: existing ? existing.timestamp : Date.now(),
        title: title.trim(),
        fact: fact.trim(),
        emotions: selectedEmotions.length > 0 ? selectedEmotions : ['불안함'],
        initialIntensity,
        thought: thought.trim(),
        trapIds: selectedTraps,
        friendReframe: friendReframe.trim(),
        finalIntensity,
      };

      onUpdateRecord(updated);
      setIsFormOpen(false);
      setEditingRecordId(null);
    } else {
      // Create new record
      const newRecord: MindRecord = {
        id: `mind-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        timestamp: Date.now(),
        title: title.trim(),
        fact: fact.trim(),
        emotions: selectedEmotions.length > 0 ? selectedEmotions : ['불안함'],
        initialIntensity,
        thought: thought.trim(),
        trapIds: selectedTraps,
        friendReframe: friendReframe.trim(),
        finalIntensity,
      };

      onSaveRecord(newRecord);
      setIsFormOpen(false);

      // Trigger Celebration Animation Modal!
      const diff = initialIntensity - finalIntensity;
      setCelebrationData({
        record: newRecord,
        intensityDiff: diff,
        coinsEarned: 15,
      });
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner & Action */}
      <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">사실과 감정 분리 기록</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              불안이 몰려올 때 카메라처럼 사실만 보고, 생각 함정을 알아차려 봐
            </p>
          </div>
          {!isFormOpen && (
            <button
              onClick={handleOpenNewForm}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              <Plus size={15} />
              <span>새 기록 쓰기</span>
            </button>
          )}
        </div>
      </div>

      {/* Structured Writing & Editing Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-white rounded-3xl border-2 border-emerald-300/80 shadow-md space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <span>{editingRecordId ? '마음 기록 수정하기' : '마음 정리 7단계 연습'}</span>
            </h3>
            <button
              type="button"
              onClick={handleCancelForm}
              aria-label="닫기"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 1. 지금 불안한 일 (한 줄 제목) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">
                1
              </span>
              <span>지금 불안하거나 마음에 걸리는 일은 뭐야? (한 줄 제목)</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 단체 채팅방에 질문을 남겼는데 아직 답이 없음"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            />
          </div>

          {/* 2. 객관적 사실 (CCTV 카메라 렌즈 콘셉트) */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-300/80 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1 bg-slate-200 text-slate-700 rounded-md">
                <Camera size={15} />
              </div>
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[11px] font-extrabold">
                2
              </span>
              <span>객관적 사실: 카메라로 찍으면 보이는 것만 적기</span>
            </label>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              내 추측이나 주관적 판단은 빼고, CCTV 영상에 그대로 찍힐 모습만 적어줘. (예: &ldquo;오후 2시에 메시지를 보냈고, 현재 오후 4시이며 답장은 오지 않았다.&rdquo;)
            </p>
            <textarea
              required
              value={fact}
              onChange={(e) => setFact(e.target.value)}
              placeholder="카메라 화면에 비친 사실만 적어줘."
              rows={2}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/30 resize-none leading-relaxed"
            />
          </div>

          {/* 3. 내 감정과 강도 슬라이더 */}
          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
            <label className="text-xs font-bold text-rose-950 flex items-center gap-2">
              <div className="p-1 bg-rose-200 text-rose-700 rounded-md">
                <Heart size={15} className="fill-rose-400 text-rose-600" />
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-[11px] font-extrabold">
                3
              </span>
              <span>내 감정: 어떤 감정들이 올라오니?</span>
            </label>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              {defaultEmotionChips.map((chip) => {
                const isSelected = selectedEmotions.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleToggleEmotion(chip)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-2xs scale-102'
                        : 'bg-white text-slate-600 border border-rose-200 hover:bg-rose-100/50'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Custom Emotion Input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customEmotionInput}
                onChange={(e) => setCustomEmotionInput(e.target.value)}
                placeholder="직접 입력 (예: 억울함, 긴장)"
                className="flex-1 p-2 bg-white border border-rose-200 rounded-xl text-xs text-slate-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomEmotion}
                className="px-3 py-1 bg-rose-200 text-rose-900 text-xs rounded-xl font-semibold active:scale-95"
              >
                추가
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-rose-950 font-bold">
                <span>현재 느끼는 감정의 강도 (0: 평온 ~ 10: 압도됨)</span>
                <span className="text-rose-600 tabular-nums">{initialIntensity} / 10점</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={initialIntensity}
                onChange={(e) => setInitialIntensity(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. 내 생각 (해석) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">
                4
              </span>
              <Brain size={15} className="text-indigo-500" />
              <span>내 생각(해석): 사실을 보고 내가 붙인 생각 적기</span>
            </label>
            <p className="text-[11px] text-slate-500">
              머릿속에서 멋대로 재생되는 부정적인 해석 (예: &ldquo;나를 귀찮아하거나 싫어하나 봐&rdquo;)
            </p>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="머릿속에 떠오른 생각을 솔직하게 적어봐."
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none leading-relaxed"
            />
          </div>

          {/* 5. 생각 함정 알아차리기 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">
                5
              </span>
              <HelpCircle size={15} className="text-amber-500" />
              <span>생각 함정 알아차리기 (인지 왜곡 카드 선택)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COGNITIVE_TRAPS.map((trap) => {
                const isSelected = selectedTraps.includes(trap.id);
                return (
                  <div
                    key={trap.id}
                    onClick={() => handleToggleTrap(trap.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-400 shadow-2xs ring-1 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>{trap.name}</span>
                      {isSelected && <span className="text-amber-700 font-bold">✓ 선택됨</span>}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{trap.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. 다시 바라보기 (친구 관점) */}
          <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 space-y-2">
            <label className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <div className="p-1 bg-emerald-200 text-emerald-800 rounded-md">
                <MessageCircleHeart size={15} />
              </div>
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">
                6
              </span>
              <span>다시 바라보기: &ldquo;친한 친구가 같은 상황이면 뭐라고 말해줄까?&rdquo;</span>
            </label>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              나 자신에게 가장 아끼는 친구를 위로하듯 다정하고 현실적인 말을 건네줘. (예: &ldquo;그 친구도 지금 회의 중이거나 바쁠 거야. 나를 싫어해서가 아니야.&rdquo;)
            </p>
            <textarea
              value={friendReframe}
              onChange={(e) => setFriendReframe(e.target.value)}
              placeholder="친구에게 건넬 따뜻한 한마디를 적어봐."
              rows={2}
              className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none leading-relaxed"
            />
          </div>

          {/* 7. 기록 후 감정 강도 재평가 및 전후 비교 */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">
                  7
                </span>
                <TrendingDown size={15} className="text-emerald-600" />
                <span>다시 생각해보니 지금 감정 강도는 몇 점이야?</span>
              </span>
              <span className="text-emerald-700 font-bold tabular-nums">{finalIntensity} / 10점</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={finalIntensity}
              onChange={(e) => setFinalIntensity(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            {/* Visual Comparison Box */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="text-slate-500">
                <span>작성 전: </span>
                <span className="font-bold text-rose-600">{initialIntensity}점</span>
              </div>
              <span className="text-slate-300">&rarr;</span>
              <div className="text-slate-500">
                <span>작성 후: </span>
                <span className="font-bold text-emerald-700">{finalIntensity}점</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900">
                {initialIntensity - finalIntensity > 0
                  ? `${initialIntensity - finalIntensity}점 완화됨 ✨`
                  : '마음 알아차림 완료'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-semibold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles size={15} />
              <span>{editingRecordId ? '수정 내용 저장하기' : '기록 저장하고 몽글이 응원받기'}</span>
            </button>
          </div>
        </form>
      )}

      {/* History Records List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 px-1 flex items-center gap-1.5">
          <Calendar size={13} />
          <span>지난 마음 기록들 ({records.length}개)</span>
        </h3>

        {records.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-emerald-200 space-y-2">
            <span className="text-3xl block">💭</span>
            <p className="text-xs font-medium text-slate-700">아직 남겨진 마음 기록이 없어</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              불안이 스멀스멀 올라올 때 언제든 &apos;새 기록 쓰기&apos;를 눌러봐. 사실과 감정을 나누는 것만으로도 마음이 한결 가벼워질 거야.
            </p>
          </div>
        ) : (
          records.map((rec) => {
            const isExpanded = expandedRecordId === rec.id;
            const diff = rec.initialIntensity - rec.finalIntensity;

            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-2xs overflow-hidden transition-all"
              >
                {/* Header summary row */}
                <div
                  onClick={() => setExpandedRecordId(isExpanded ? null : rec.id)}
                  role="button"
                  tabIndex={0}
                  className="p-3.5 flex items-start justify-between cursor-pointer hover:bg-emerald-50/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-400">{rec.date}</span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        <span>{rec.initialIntensity}점 &rarr; {rec.finalIntensity}점</span>
                        {diff > 0 && <span className="text-emerald-700">(-{diff}점)</span>}
                      </div>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {rec.title}
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {rec.emotions.map((em, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                        >
                          {em}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(rec);
                      }}
                      aria-label="기록 수정"
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('이 마음 기록을 정말 삭제할까?')) {
                          onDeleteRecord(rec.id);
                        }
                      }}
                      aria-label="기록 삭제"
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="text-slate-400 pl-0.5">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-[#FCFDFB] text-xs space-y-3 leading-relaxed">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                        📷 객관적 사실
                      </span>
                      <p className="text-slate-800">{rec.fact}</p>
                    </div>

                    {rec.thought && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                          🧠 내가 붙인 생각(해석)
                        </span>
                        <p className="text-slate-800">{rec.thought}</p>
                      </div>
                    )}

                    {rec.trapIds.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 block mb-1">
                          ⚠️ 발견한 생각 함정
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {rec.trapIds.map((tid) => {
                            const trap = COGNITIVE_TRAPS.find((t) => t.id === tid);
                            return (
                              <span
                                key={tid}
                                className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-medium"
                              >
                                {trap?.name || tid}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {rec.friendReframe && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-800 block mb-0.5">
                          💬 친구가 건네는 따뜻한 관점
                        </span>
                        <p className="text-emerald-950">&ldquo;{rec.friendReframe}&rdquo;</p>
                      </div>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleStartEdit(rec)}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                      >
                        <Edit3 size={13} />
                        <span>이 기록 수정하기</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Celebration Modal on Record Completion with Cloud Character & Coin Animation */}
      {celebrationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#FCFDFB] rounded-3xl p-6 shadow-2xl border-2 border-emerald-300/90 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Animated Coin Pop */}
            <div className="relative mb-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-2 border-yellow-200 animate-bounce">
                <Coins size={28} className="text-amber-900" />
              </div>
              <span className="absolute -top-2 -right-3 text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                +{celebrationData.coinsEarned}C
              </span>
            </div>

            {/* Cloud Character Cheering */}
            <div className="py-1">
              <CloudCharacter
                stage={2}
                expression="cheer"
                size="md"
                speechText="네 마음을 솔직하게 마주해줘서 정말 고마워!"
              />
            </div>

            {/* Celebration Text */}
            <div className="mt-3 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                마음 기록 완료! (+{celebrationData.coinsEarned} 코인)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                사실과 생각을 구분하고 생각 함정을 알아차린 것만으로도, 불안에 휘둘리지 않는 단단한 힘이 생겼어.
              </p>

              {/* Before and After Pill */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs mt-2 flex items-center justify-center gap-3">
                <span className="text-rose-600 font-semibold">
                  기록 전 {celebrationData.record.initialIntensity}점
                </span>
                <span className="text-slate-400">&rarr;</span>
                <span className="text-emerald-700 font-bold">
                  기록 후 {celebrationData.record.finalIntensity}점
                </span>
                {celebrationData.intensityDiff > 0 && (
                  <span className="text-emerald-800 font-bold">
                    ({celebrationData.intensityDiff}점 완화!)
                  </span>
                )}
              </div>
            </div>

            {/* Confirm Close Button */}
            <button
              onClick={() => setCelebrationData(null)}
              className="w-full h-11 mt-5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
            >
              <Smile size={16} />
              <span>고마워, 몽글아!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
