
import { VideoCategory, VideoAsset, NewsItem, ResearchItem, ResourceItem } from './types';

export const INITIAL_VIDEOS: VideoAsset[] = [
  {
    id: 'v1',
    title: '비상교육 AI 아이덴티티',
    category: VideoCategory.BRAND,
    url: "/visang-ai---ax-edutech-platform/videos/Flow.mp4",
    posterUrl: "/visang-ai---ax-edutech-platform/images/end-banner.png",
    version: 1,
    updatedAt: new Date().toISOString(),
    description: 'AI로 연결된 학습, 세상을 바꾸는 교육의 혁신.',
    views: 1240
  },
  {
    id: 'v2',
    title: '서비스 데모: 수학 AI',
    category: VideoCategory.USE_CASE,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-network-connection-background-3049-large.mp4',
    posterUrl: 'https://picsum.photos/1920/1080?blur=2',
    version: 1,
    updatedAt: new Date().toISOString(),
    description: '실시간 DKT 분석 및 맞춤형 문제 추천 시연.',
    views: 856
  },
  {
    id: 'v3',
    title: '2025 AX 비전 필름',
    category: VideoCategory.VISION,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-white-network-connection-background-3053-large.mp4',
    posterUrl: 'https://picsum.photos/1920/1080?random=3',
    version: 1,
    updatedAt: new Date().toISOString(),
    description: '25년의 교육 전문성과 생성형 AI의 만남.',
    views: 542
  }
];

export const MOCK_NEWS: NewsItem[] = [
  { 
    id: 'n1', 
    title: '비상교육, K-12 전용 "Math GPT" 출시', 
    date: '2024-05-20', 
    tag: 'Press', 
    summary: 'sLLM 기술을 활용한 초개인화 수학 학습의 혁명.',
    linkUrl: 'https://teams.microsoft.com/l/message/fake-message-id',
    content: `비상교육이 자체 개발한 sLLM(소형언어모델) 기반의 수학 전용 AI 튜터 'Math GPT'를 정식 출시했습니다. 
    
이 모델은 기존 LLM의 할루시네이션 문제를 최소화하고, 한국 수학 교육 과정에 최적화된 답변을 제공하도록 미세조정(Fine-tuning) 되었습니다. 학생들은 사진을 찍거나 음성으로 질문하여 실시간으로 풀이 과정과 개념 설명을 들을 수 있습니다.

주요 특징:
- 99.8%의 수식 인식 정확도
- 교육과정 연계 개념 추천
- 학생 수준별 맞춤형 설명 톤앤매너 조절

이번 출시는 에듀테크 시장에서의 AI 주도권을 확고히 하는 계기가 될 것입니다.`
  },
  { 
    id: 'n2', 
    title: 'Global Edutech Fair 2024 기조연설', 
    date: '2024-04-15', 
    tag: 'Event', 
    summary: 'AX 시대, 교육의 미래를 주제로 CEO 발표 진행.',
    linkUrl: 'https://www.youtube.com/watch?v=fake-link',
    content: `영국 런던에서 개최된 'Global Edutech Fair 2024'에서 비상교육 양태회 대표가 기조연설자로 나섰습니다.
    
'AX(AI Transformation) 시대, 교육의 본질을 다시 묻다'라는 주제로 진행된 이번 연설에서, 비상교육은 AI가 교사를 대체하는 것이 아니라 교사의 역량을 증강(Augmentation)시키는 도구임을 강조했습니다.

또한, 글로벌 진출 전략으로 'AllviA' 플랫폼의 남미 및 동남아 시장 확장 성과를 공유하며 큰 호응을 얻었습니다.`
  },
  { 
    id: 'n3', 
    title: '사내 AI Loop 컨퍼런스 개최', 
    date: '2024-03-10', 
    tag: 'Internal', 
    summary: 'R&D 부서 간 최신 기술 성과 공유 및 네트워킹.',
    content: `비상교육 본사 비전홀에서 제3회 'AI Loop 컨퍼런스'가 성공적으로 개최되었습니다.
    
AI Core팀, 메타버스 개발팀, 데이터 전략팀 등 10여 개 R&D 부서가 참여하여 지난 1년간의 연구 성과를 공유했습니다.
특히 이번 행사에서는 생성형 AI를 활용한 자동 문제 출제 시스템 시연이 가장 큰 주목을 받았습니다.

우수 발표팀에게는 포상과 함께 해외 AI 컨퍼런스 탐방 기회가 주어졌습니다.`
  },
];

export const MOCK_RESEARCH: ResearchItem[] = [
  { id: 'r1', title: 'Knowledge Tracing v4.0', status: 'In Progress', model: 'Transformer-based DKT', description: '장기 기억 보유율 예측 정확도 개선 모델 연구.' },
  { id: 'r2', title: 'Multimodal Vision QA', status: 'Completed', model: 'Gemini-Pro Fine-tuned', description: '손글씨 학생 답안 인식률 99% 달성 및 자동 채점.' },
];

export const MOCK_RESOURCES: ResourceItem[] = [
  { id: 'res1', title: 'Visang AI 윤리 가이드라인 2024', type: 'PDF', size: '2.4 MB' },
  { id: 'res2', title: '2024년 1분기 IR 리포트 - AI 부문', type: 'PDF', size: '5.1 MB' },
  { id: 'res3', title: '브랜드 에셋 & 로고 키트', type: 'ZIP', size: '120 MB' },
];