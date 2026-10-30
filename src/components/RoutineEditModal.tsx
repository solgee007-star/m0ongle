/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { RoutineItem } from '../types.ts';

interface RoutineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  routines: RoutineItem[];
  onAddRoutine: (title: string, hint?: string) => void;
  onUpdateRoutine: (id: string, title: string, hint?: string) => void;
  onDeleteRoutine: (id: string) => void;
}

export const RoutineEditModal: React.FC<RoutineEditModalProps> = ({
  isOpen,
  onClose,
  routines,
  onAddRoutine,
  onUpdateRoutine,
  onDeleteRoutine,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newHint, setNewHint] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editHint, setEditHint] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddRoutine(newTitle.trim(), newHint.trim() || undefined);
    setNewTitle('');
    setNewHint('');
  };

  const startEdit = (routine: RoutineItem) => {
    setEditingId(routine.id);
    setEditTitle(routine.title);
    setEditHint(routine.hint || '');
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateRoutine(id, editTitle.trim(), editHint.trim() || undefined);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#FCFDFB] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-100/80 bg-white/80">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">생활 루틴 관리</h2>
            <p className="text-[11px] text-slate-500">핵심 3개는 기본 고정이고, 보조 루틴은 자유롭게 다듬을 수 있어</p>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Add New Routine Form */}
          <form onSubmit={handleAdd} className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2.5">
            <h3 className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
              <Plus size={14} />
              <span>새 보조 루틴 추가하기</span>
            </h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="예: 좋아하는 음악 한 곡 듣기, 창문 활짝 열기"
              className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <input
              type="text"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              placeholder="따뜻한 한마디 메모 (선택)"
              className="w-full p-2 bg-white border border-emerald-100 rounded-xl text-xs text-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
            >
              루틴에 쏙 넣기
            </button>
          </form>

          {/* Routine List */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-600">현재 루틴 목록</h3>
            {routines.map((r) => {
              const isEditing = editingId === r.id;

              return (
                <div
                  key={r.id}
                  className={`p-3 rounded-2xl border transition-all text-xs ${
                    r.isCore
                      ? 'bg-amber-50/50 border-amber-200/80'
                      : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-emerald-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={editHint}
                        onChange={(e) => setEditHint(e.target.value)}
                        placeholder="메모 수정"
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-slate-500 text-xs"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => saveEdit(r.id)}
                          className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs flex items-center gap-1"
                        >
                          <Check size={12} />
                          <span>저장</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {r.isCore && (
                            <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                              핵심
                            </span>
                          )}
                          <span className="font-semibold text-slate-800 truncate">{r.title}</span>
                        </div>
                        {r.hint && (
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{r.hint}</p>
                        )}
                      </div>

                      {/* Controls */}
                      {!r.isCore && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(r)}
                            aria-label="수정"
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteRoutine(r.id)}
                            aria-label="삭제"
                            className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
