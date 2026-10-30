/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HealingQuote, SavedVideo } from '../types.ts';
import { HEALING_QUOTES } from '../data/quotes.ts';
import { RECOMMENDED_VIDEO_TOPICS } from '../data/recommendedVideos.ts';
import {
  Wind,
  Compass,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Bookmark,
  Sparkles,
  Shuffle,
  Eye,
  Hand,
  Volume2,
  Smile,
  AlertTriangle,
} from 'lucide-react';

interface CalmKitTabProps {
  bookmarkedQuoteIds: string[];
  onToggleBookmarkQuote: (quoteId: string) => void;
  savedVideos: SavedVideo[];
  onAddVideo: (video: Omit<SavedVideo, 'id' | 'addedAt'>) => void;
  onDeleteVideo: (id: string) => void;
  onOpenCounseling?: () => void;
}

export const CalmKitTab: React.FC<CalmKitTabProps> = ({
  bookmarkedQuoteIds,
  onToggleBookmarkQuote,
  savedVideos,
  onAddVideo,
  onDeleteVideo,
  onOpenCounseling,
}) => {
  const [subTab, setSubTab] = useState<'breath' | 'video' | 'quotes'>('breath');

  // 1. 4-7-8 Breathing Guide State
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // 2. 5-4-3-2-1 Grounding State
  const [groundingStep, setGroundingStep] = useState(5);
  const [groundingInputs, setGroundingInputs] = useState<Record<number, string[]>>({
    5: ['', '', '', '', ''],
    4: ['', '', '', ''],
    3: ['', '', ''],
    2: ['', ''],
    1: [''],
  });

  // 3. Video Add State
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMemo, setVideoMemo] = useState('');

  // 4. Quotes State
  const [quoteCategory, setQuoteCategory] = useState<string>('all');
  const [featuredQuoteIndex, setFeaturedQuoteIndex] = useState(0);

  // 4-7-8 Breathing Timer logic
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!breathActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Phase transition
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 7;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 8;
          } else {
            // Completed cycle
            setBreathCyclesCompleted((c) => c + 1);
            setBreathPhase('inhale');
            return 4;
          }
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [breathActive, breathPhase]);

  const handleResetBreathing = () => {
    setBreathActive(false);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(4);
    setBreathCyclesCompleted(0);
  };

  // Video Add Submit
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    onAddVideo({
      title: videoTitle.trim(),
      url: videoUrl.trim(),
      memo: videoMemo.trim() || undefined,
    });

    setVideoTitle('');
    setVideoUrl('');
    setVideoMemo('');
    setIsAddingVideo(false);
  };

  // Filtered Quotes
  const filteredQuotes = HEALING_QUOTES.filter((q) => {
    if (quoteCategory === 'favorites') {
      return bookmarkedQuoteIds.includes(q.id);
    }
    if (quoteCategory === 'all') return true;
    return q.category === quoteCategory;
  });

  const handleShuffleQuote = () => {
    if (filteredQuotes.length === 0) return;
    const nextIdx = Math.floor(Math.random() * filteredQuotes.length);
    setFeaturedQuoteIndex(nextIdx);
  };

  const currentFeaturedQuote =
    filteredQuotes[featuredQuoteIndex] || filteredQuotes[0] || HEALING_QUOTES[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Tab Header & Sub Navigation */}
      <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800">응급상자 (지금 마음 진정하기)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              불안이 치솟을 때 호흡을 가다듬고 온기를 채워주는 도구들이야
            </p>
          </div>
          {onOpenCounseling && (
            <button
              onClick={onOpenCounseling}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs active:scale-95 transition-all shrink-0"
            >
              <span>💬</span>
              <span>몽글이 상담소</span>
            </button>
          )}
        </div>

        {/* Sub-tab segmented control */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-emerald-50/70 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setSubTab('breath')}
            className={`py-2 rounded-xl transition-all ${
              subTab === 'breath'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            호흡 / 감각 접지
          </button>
          <button
            onClick={() => setSubTab('video')}
            className={`py-2 rounded-xl transition-all ${
              subTab === 'video'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            마음 진정 영상
          </button>
          <button
            onClick={() => setSubTab('quotes')}
            className={`py-2 rounded-xl transition-all ${
              subTab === 'quotes'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            힐링 문구 (65)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: 호흡 / 접지 */}
      {subTab === 'breath' && (
        <div className="space-y-4">
          {/* 4-7-8 Breathing Guide Card */}
          <section
            aria-label="4-7-8 이완 호흡법"
            className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-4 text-center"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Wind size={16} />
                <span>4-7-8 이완 호흡 가이드</span>
              </span>
              <span className="text-[11px] text-slate-400">
                완료한 사이클: {breathCyclesCompleted}회
              </span>
            </div>

            <p className="text-xs text-slate-500">
              코로 4초 들이쉬고, 7초간 멈추고, 입으로 8초간 후- 길게 내쉬어봐. 부교감신경이 깨어나 심장을 진정시켜 줘.
            </p>

            {/* Breathing Animated Circle */}
            <div className="relative py-8 flex flex-col items-center justify-center">
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-lg ${
                  breathPhase === 'inhale'
                    ? 'scale-110 bg-gradient-to-br from-emerald-100 to-teal-200 border-4 border-emerald-300'
                    : breathPhase === 'hold'
                    ? 'scale-110 bg-gradient-to-br from-amber-100 to-yellow-200 border-4 border-amber-300 animate-gentle-pulse-slow'
                    : 'scale-90 bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-200'
                }`}
              >
                <span className="text-3xl font-extrabold text-slate-800 tabular-nums">
                  {phaseSecondsLeft}
                </span>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {breathPhase === 'inhale'
                    ? '천천히 들이쉬어'
                    : breathPhase === 'hold'
                    ? '숨을 멈춰'
                    : '천천히 후- 내쉬어'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {breathPhase === 'inhale' ? '4초' : breathPhase === 'hold' ? '7초' : '8초'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setBreathActive(!breathActive)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-xs ${
                  breathActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {breathActive ? <Pause size={16} /> : <Play size={16} />}
                <span>{breathActive ? '잠시 멈추기' : '호흡 시작하기'}</span>
              </button>
              <button
                onClick={handleResetBreathing}
                aria-label="호흡 초기화"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl active:scale-95 transition-all"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </section>

          {/* 5-4-3-2-1 Sensory Grounding Technique */}
          <section
            aria-label="5-4-3-2-1 감각 접지 기법"
            className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Compass size={16} />
                <span>5-4-3-2-1 감각 접지 기법</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">단계별로 따라오기</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              공황이나 과도한 불안으로 머릿속이 하얘질 때, 주변 사물에 오감을 집중해 &apos;지금, 여기&apos;로 돌아오는 과학적인 방법이야.
            </p>

            {/* Step navigation tabs */}
            <div className="flex items-center gap-1.5">
              {[5, 4, 3, 2, 1].map((st) => (
                <button
                  key={st}
                  onClick={() => setGroundingStep(st)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    groundingStep === st
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {st}단계
                </button>
              ))}
            </div>

            {/* Current Step Description Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-3">
              {groundingStep === 5 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <Eye size={18} className="text-emerald-700" />
                    <span>5가지: 눈에 보이는 것 찾기</span>
                  </div>
                  <p className="text-xs text-emerald-950/80">
                    지금 주변을 둘러보며 시선이 닿는 물건 5개의 이름을 마음속으로 부르거나 적어봐. (예: 시계, 화분, 컵, 창문, 신발)
                  </p>
                </div>
              )}
              {groundingStep === 4 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <Hand size={18} className="text-emerald-700" />
                    <span>4가지: 손으로 만질 수 있는 촉감 느끼기</span>
                  </div>
                  <p className="text-xs text-emerald-950/80">
                    책상의 매끄러움, 바지의 천 질감, 따뜻한 찻잔의 온도처럼 4가지 감각을 손끝으로 가만히 느껴봐.
                  </p>
                </div>
              )}
              {groundingStep === 3 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <Volume2 size={18} className="text-emerald-700" />
                    <span>3가지: 귀에 들리는 소리에 귀 기울이기</span>
                  </div>
                  <p className="text-xs text-emerald-950/80">
                    시계 초침 소리, 창밖 바람 소리, 냉장고 웅웅거림 등 3가지 소리를 가만히 포착해봐.
                  </p>
                </div>
              )}
              {groundingStep === 2 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <Wind size={18} className="text-emerald-700" />
                    <span>2가지: 코로 맡을 수 있는 냄새 알아차리기</span>
                  </div>
                  <p className="text-xs text-emerald-950/80">
                    커피 향, 방 안 공기 냄새, 비누 향기 등 2가지를 깊게 들이쉬며 느껴봐.
                  </p>
                </div>
              )}
              {groundingStep === 1 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <Smile size={18} className="text-emerald-700" />
                    <span>1가지: 입안의 맛 또는 나에게 전하는 한마디</span>
                  </div>
                  <p className="text-xs text-emerald-950/80">
                    물 한 모금의 감각이나, &ldquo;난 지금 안전해&rdquo;라는 스스로를 향한 다정한 확언을 건네줘.
                  </p>
                </div>
              )}

              {/* Interactive Input Rows for the current step */}
              <div className="space-y-1.5 pt-1">
                {groundingInputs[groundingStep].map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const next = [...groundingInputs[groundingStep]];
                      next[idx] = e.target.value;
                      setGroundingInputs({ ...groundingInputs, [groundingStep]: next });
                    }}
                    placeholder={`${idx + 1}번째 감각 적어보기`}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                ))}
              </div>

              {/* Navigation button */}
              <div className="pt-2 flex justify-end">
                {groundingStep > 1 ? (
                  <button
                    onClick={() => setGroundingStep(groundingStep - 1)}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all"
                  >
                    다음 단계 ({groundingStep - 1}단계) &rarr;
                  </button>
                ) : (
                  <button
                    onClick={() => setGroundingStep(5)}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all"
                  >
                    처음부터 다시 하기
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SUBTAB 2: 마음 진정 영상 */}
      {subTab === 'video' && (
        <div className="space-y-4">
          {/* Disclaimer Header Card */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              확인되지 않은 임의의 영상 대신, 정신건강의학과 전문의 및 상담심리사가 운영하는 주제별 유튜브 검색 카드를 준비했어. <strong>전문가가 직접 운영하는 채널인지 확인하고 편안하게 시청해줘.</strong>
            </p>
          </div>

          {/* Curated Topic Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 px-1">추천 전문가 마음 진정 검색</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {RECOMMENDED_VIDEO_TOPICS.map((topic) => {
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  topic.searchQuery
                )}`;

                return (
                  <a
                    key={topic.id}
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group active:scale-[0.99]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {topic.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{topic.suggestedDuration}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {topic.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {topic.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                      <span>{topic.recommendedSources}</span>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-emerald-600" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* My Saved Videos (내 영상 목록) */}
          <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>⭐</span>
                <span>내가 저장한 마음 영상 ({savedVideos.length}개)</span>
              </h3>
              <button
                onClick={() => setIsAddingVideo(!isAddingVideo)}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                <Plus size={14} />
                <span>영상 추가하기</span>
              </button>
            </div>

            {/* Add Video Form */}
            {isAddingVideo && (
              <form
                onSubmit={handleSaveVideo}
                className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs"
              >
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="영상 제목 (예: 잠들기 전 10분 ASMR 명상)"
                  className="w-full p-2 bg-white border border-emerald-200 rounded-xl"
                />
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="유튜브 URL 링크 (https://...)"
                  className="w-full p-2 bg-white border border-emerald-200 rounded-xl"
                />
                <input
                  type="text"
                  value={videoMemo}
                  onChange={(e) => setVideoMemo(e.target.value)}
                  placeholder="따뜻한 메모 (예: 가슴이 두근거릴 때 틀어둘 것)"
                  className="w-full p-2 bg-white border border-emerald-200 rounded-xl"
                />
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingVideo(false)}
                    className="px-3 py-1.5 text-slate-500"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-medium"
                  >
                    목록에 저장
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            {savedVideos.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                아직 직접 저장한 영상이 없어. 마음에 쏙 드는 채널이나 영상을 모아봐.
              </p>
            ) : (
              <div className="space-y-2">
                {savedVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-800 hover:text-emerald-700 truncate block"
                      >
                        {vid.title}
                      </a>
                      {vid.memo && <p className="text-[11px] text-slate-500 mt-0.5">{vid.memo}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-emerald-700 hover:bg-emerald-50"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => onDeleteVideo(vid.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: 오늘의 힐링 문구 */}
      {subTab === 'quotes' && (
        <div className="space-y-4">
          {/* Featured Random Quote Highlight Card */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-amber-50/70 rounded-3xl border border-emerald-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles size={16} className="text-emerald-600" />
                <span>마음을 감싸주는 한 줄</span>
              </span>
              <button
                onClick={handleShuffleQuote}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/90 hover:bg-white border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 active:scale-95 transition-all shadow-2xs"
              >
                <Shuffle size={13} />
                <span>다른 문구 보기</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed py-2">
              &ldquo;{currentFeaturedQuote.text}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-emerald-800/80 font-medium bg-emerald-100/60 px-2 py-0.5 rounded-md">
                {currentFeaturedQuote.category === 'anxiety'
                  ? '불안할 때'
                  : currentFeaturedQuote.category === 'depression'
                  ? '우울할 때'
                  : currentFeaturedQuote.category === 'unmotivated'
                  ? '아무것도 하기 싫을 때'
                  : currentFeaturedQuote.category === 'bedtime'
                  ? '자기 전에'
                  : '힘내고 싶을 때'}
              </span>
              <button
                onClick={() => onToggleBookmarkQuote(currentFeaturedQuote.id)}
                className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium"
              >
                <Bookmark
                  size={14}
                  className={
                    bookmarkedQuoteIds.includes(currentFeaturedQuote.id)
                      ? 'fill-emerald-600 text-emerald-600'
                      : ''
                  }
                />
                <span>
                  {bookmarkedQuoteIds.includes(currentFeaturedQuote.id) ? '보관됨' : '즐겨찾기'}
                </span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: '전체 (65)' },
                { id: 'anxiety', label: '불안할 때' },
                { id: 'depression', label: '우울할 때' },
                { id: 'unmotivated', label: '아무것도 하기 싫을 때' },
                { id: 'bedtime', label: '자기 전에' },
                { id: 'cheer', label: '힘내고 싶을 때' },
                { id: 'favorites', label: `즐겨찾기 (${bookmarkedQuoteIds.length})` },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setQuoteCategory(cat.id);
                    setFeaturedQuoteIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    quoteCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List of Quotes */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredQuotes.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                  해당 카테고리에 문구가 아직 없어.
                </div>
              ) : (
                filteredQuotes.map((q) => {
                  const isBookmarked = bookmarkedQuoteIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      className="p-3.5 bg-white rounded-2xl border border-emerald-100/80 shadow-2xs flex items-start justify-between gap-3 text-xs leading-relaxed"
                    >
                      <p className="text-slate-700 flex-1">{q.text}</p>
                      <button
                        onClick={() => onToggleBookmarkQuote(q.id)}
                        aria-label={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        className="text-slate-300 hover:text-emerald-700 shrink-0 p-1"
                      >
                        <Bookmark
                          size={15}
                          className={isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}
                        />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
