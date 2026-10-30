/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmergencyContact } from '../types.ts';
import {
  Phone,
  User,
  Shield,
  Download,
  Trash2,
  Heart,
  Info,
  HelpCircle,
  FileText,
  AlertTriangle,
  Edit2,
  Check,
} from 'lucide-react';
import { exportAllDataAsJSON } from '../utils/storage.ts';

interface MoreTabProps {
  contact: EmergencyContact;
  onUpdateContact: (contact: EmergencyContact) => void;
  onClearAllData: () => void;
  onOpenHospitalGuide: () => void;
  onOpenOnboarding: () => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  contact,
  onUpdateContact,
  onClearAllData,
  onOpenHospitalGuide,
  onOpenOnboarding,
}) => {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [memo, setMemo] = useState(contact.memo);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContact({
      name: name.trim() || '소중한 사람',
      phone: phone.trim(),
      memo: memo.trim(),
    });
    setIsEditingContact(false);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mongle-mind-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tab Header */}
      <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
        <h2 className="text-base font-bold text-slate-800">더보기 &amp; 안전 설정</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          마음이 위태로울 때 연락할 사람과 앱 데이터 안전을 관리해
        </p>
      </div>

      {/* 1. Trusted Contact Card */}
      <section
        aria-label="신뢰하는 사람 연락처"
        className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-xl text-emerald-800">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">내가 신뢰하는 사람</h3>
              <span className="text-[11px] text-slate-400">힘들 때 바로 전화할 수 있는 든든한 지원군</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditingContact(!isEditingContact)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
          >
            <Edit2 size={13} />
            <span>{isEditingContact ? '취소' : '수정'}</span>
          </button>
        </div>

        {isEditingContact ? (
          <form onSubmit={handleSaveContact} className="space-y-2.5 pt-2 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">이름 또는 호칭</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 민지, 엄마, 가장 편한 친구"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">한마디 메모</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="힘들 때 언제든 전화해줘, 들어줄게"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-medium flex items-center gap-1"
              >
                <Check size={14} />
                <span>저장하기</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-800 block">{contact.name}</span>
              <span className="text-xs text-slate-600 tabular-nums">
                {contact.phone || '전화번호를 등록해줘'}
              </span>
              {contact.memo && (
                <p className="text-[11px] text-emerald-800 mt-1 italic">&ldquo;{contact.memo}&rdquo;</p>
              )}
            </div>
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-2xs active:scale-95 transition-all"
              >
                <Phone size={14} />
                <span>전화 걸기</span>
              </a>
            )}
          </div>
        )}
      </section>

      {/* 2. Crisis Hotlines Card */}
      <section
        aria-label="위기 상담 전화"
        className="p-5 bg-rose-50/70 rounded-3xl border border-rose-100/90 shadow-2xs space-y-3"
      >
        <div className="flex items-center gap-2 text-rose-800">
          <AlertTriangle size={18} />
          <h3 className="text-sm font-bold">24시간 위기 대응 연락처</h3>
        </div>
        <p className="text-xs text-rose-950/80 leading-relaxed">
          너무 힘들어서 혼자 버티기 어렵거나 극심한 위험이 느껴질 때, 주저하지 말고 연결해줘.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="tel:109"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-2xl border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs active:scale-98 transition-transform"
          >
            <Phone size={14} />
            <span>자살예방 109</span>
          </a>
          <a
            href="tel:119"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-2xl border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs active:scale-98 transition-transform"
          >
            <Phone size={14} />
            <span>응급구조 119</span>
          </a>
        </div>
      </section>

      {/* 3. Hospital Guide Shortcut Button */}
      <div
        onClick={onOpenHospitalGuide}
        role="button"
        tabIndex={0}
        aria-label="병원 및 상담센터 안내 열기"
        className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-2xl text-emerald-700">
            <Heart size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">병원 &amp; 상담 안내 리포트</h4>
            <p className="text-[11px] text-slate-500">2주간의 기분/루틴 요약 리포트와 진료 팁</p>
          </div>
        </div>
        <span className="text-xs text-emerald-700 font-semibold">&rarr;</span>
      </div>

      {/* 4. Data Privacy & Backup */}
      <section
        aria-label="데이터 관리"
        className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-2xs space-y-3"
      >
        <div className="flex items-center gap-2 text-slate-800">
          <Shield size={18} className="text-emerald-700" />
          <h3 className="text-sm font-bold">데이터와 개인정보 보호</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          몽글은 로그인 없이 <strong>오직 너의 기기(브라우저) 안에만</strong> 데이터를 보관해. 외부 서버로 어떤 감정이나 루틴도 전송되지 않아.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 active:scale-98 transition-all"
          >
            <Download size={14} />
            <span>내 기록 JSON 파일로 백업(다운로드)하기</span>
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1.5 p-2 text-rose-500 hover:text-rose-700 text-xs font-medium"
            >
              <Trash2 size={13} />
              <span>모든 데이터 초기화하기</span>
            </button>
          ) : (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs space-y-2">
              <p className="text-rose-800 font-semibold">정말 모든 기록을 지울까? 되돌릴 수 없어.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    onClearAllData();
                    setConfirmDelete(false);
                  }}
                  className="flex-1 py-1.5 bg-rose-600 text-white rounded-xl font-bold"
                >
                  전체 삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. App Info & Medical Disclaimer */}
      <section
        aria-label="앱 정보 및 면책 조항"
        className="p-5 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-2.5 text-xs text-slate-600 leading-relaxed"
      >
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Info size={16} />
          <span>몽글(Mongle) 정보</span>
        </div>
        <p>
          몽글은 불안과 우울을 겪을 때 무너진 생활 리듬을 다시 찾고, 인지 왜곡을 천천히 바로잡도록 돕는 셀프케어 웹앱이야.
        </p>
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-medium">
          ⚠️ <strong>이 앱은 의학적 진단이나 심리 치료를 대신하지 않아.</strong> 지속적인 일상 장애나 심한 우울감이 느껴질 땐 반드시 정신건강의학과 전문의나 공인된 심리상담 전문가를 찾아줘.
        </div>
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>버전 1.0.0</span>
          <button
            onClick={onOpenOnboarding}
            className="text-emerald-700 hover:underline"
          >
            앱 소개 다시 보기
          </button>
        </div>
      </section>
    </div>
  );
};
