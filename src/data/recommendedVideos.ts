/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RecommendedVideoTopic {
  id: string;
  category: string;
  title: string;
  tagline: string;
  searchQuery: string;
  recommendedSources: string;
  suggestedDuration: string;
}

export const RECOMMENDED_VIDEO_TOPICS: RecommendedVideoTopic[] = [
  {
    id: 'anxiety-breathing',
    category: '불안 완화',
    title: '정신건강의학과 전문의 불안 조절 호흡법',
    tagline: '가슴이 두근거리고 숨이 가쁠 때 자율신경계를 즉각 안정시키는 호흡',
    searchQuery: '정신건강의학과 전문의 불안할 때 호흡법',
    recommendedSources: '정신건강의학과 전문의 채널',
    suggestedDuration: '5~10분',
  },
  {
    id: 'mindful-meditation',
    category: '마음 챙김',
    title: '상담심리사 마음 진정 및 감각 접지 명상',
    tagline: '머릿속을 맴도는 복잡한 생각의 고리를 끊고 신체 감각으로 돌아오는 안내',
    searchQuery: '상담심리사 마음 진정 명상',
    recommendedSources: '공인 한국상담심리학회 전문가 채널',
    suggestedDuration: '10~15분',
  },
  {
    id: 'depression-comfort',
    category: '우울할 때',
    title: '아무것도 하기 싫고 무기력할 때 듣는 다정한 위로',
    tagline: '게으름이 아닌 번아웃과 지친 마음을 토닥이는 따뜻한 임상심리사의 이야기',
    searchQuery: '임상심리전문가 무기력 번아웃 극복',
    recommendedSources: '임상심리전문가 채널',
    suggestedDuration: '10~20분',
  },
  {
    id: 'panic-emergency',
    category: '응급 진정',
    title: '공황이나 과호흡이 찾아왔을 때 대처법',
    tagline: '심한 불안과 과호흡으로 어지러울 때 빠르게 안정감을 찾는 의학적 팁',
    searchQuery: '공황장애 극복 호흡법 의사',
    recommendedSources: '대학병원 정신건강의학과 채널',
    suggestedDuration: '5~12분',
  },
  {
    id: 'sleep-relaxation',
    category: '수면 이완',
    title: '잠들기 전 생각 멈추기 & 점진적 근육 이완법',
    tagline: '침대에 누워도 꼬리를 무는 걱정을 내려놓고 깊은 잠으로 이끄는 이완 가이드',
    searchQuery: '점진적 근육이완법 수면 수면클리닉',
    recommendedSources: '수면의학 전문의 채널',
    suggestedDuration: '15~25분',
  },
  {
    id: 'cbt-thought',
    category: '인지 치료',
    title: '부정적 생각의 함정에서 벗어나는 생각 바꾸기 연습',
    tagline: '자책감과 흑백논리에서 벗어나 나를 친구처럼 대하는 인지 재구조화',
    searchQuery: '인지행동치료 자동적사고 생각바꾸기',
    recommendedSources: '인지행동치료 전문가 채널',
    suggestedDuration: '10~15분',
  },
];
