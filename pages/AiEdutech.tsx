
import React from 'react';
import { Layers, Mic, Eye, Database, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FadeInSection from '../components/FadeInSection';
import { VideoAsset, VideoCategory } from '../types';
import VideoPlayer from '../components/VideoPlayer';

interface AiEdutechProps {
  videos?: VideoAsset[];
  onVideoPlay?: (id: string) => void;
}

const data = [
  { name: '2022', aiAdoption: 30 },
  { name: '2023', aiAdoption: 55 },
  { name: '2024', aiAdoption: 85 },
  { name: '2025 (E)', aiAdoption: 100 },
];

const services = [
  { 
    name: "기출탭탭 (Taptap)", 
    model: "DKT Engine", 
    feature: "취약점 정밀 진단 & 추천", 
    bgImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    desc: "학생의 학습 패턴을 분석하여 최적의 문제를 추천하는 맞춤형 기출 학습 앱"
  },
  { 
    name: "수플러 (Math)", 
    model: "Vision AI + OCR", 
    feature: "사진 촬영 자동 풀이", 
    bgImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    desc: "모르는 문제를 찍으면 AI가 풀이 과정과 유사 문제를 즉시 제공"
  },
  { 
    name: "잉아 (Eng)", 
    model: "Speech AI", 
    feature: "실시간 발음 교정", 
    bgImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop",
    desc: "원어민 수준의 AI와 대화하며 실시간으로 발음과 억양을 피드백 받는 튜터"
  },
  { 
    name: "AIDT (디지털교과서)", 
    model: "sLLM", 
    feature: "AI 보조교사 챗봇", 
    bgImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    desc: "공교육 현장에 최적화된 AI 디지털 교과서 플랫폼"
  },
  { 
    name: "비바샘", 
    model: "RAG System", 
    feature: "수업 자료 문맥 검색", 
    bgImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    desc: "선생님을 위한 방대한 수업 자료를 AI가 문맥에 맞게 찾아주는 서비스"
  },
  { 
    name: "T-Learning", 
    model: "RecSys", 
    feature: "개인화 콘텐츠 큐레이션", 
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    desc: "교원 연수 및 성인 학습자를 위한 지능형 콘텐츠 추천 플랫폼"
  },
];

const AiEdutechPage: React.FC<AiEdutechProps> = ({ videos = [], onVideoPlay }) => {
  const visionVideo = videos.find(v => v.category === VideoCategory.VISION);

  return (
    <div className="pt-10 pb-0 bg-slate-950">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
        <FadeInSection>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-900/50 mb-6 text-sm font-semibold">
            <Sparkles size={14} className="mr-2" />
            Next Generation Education
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            AI 기술 포트폴리오
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            비상교육은 DKT(Deep Knowledge Tracing)부터 거대언어모델(LLM)까지,<br/>
            미래 교육을 움직이는 <span className="text-blue-400 font-bold">핵심 엔진</span>을 직접 설계하고 보유하고 있습니다.
          </p>
        </FadeInSection>
      </div>

      {/* Tech Cards (Icons) */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {[
          { icon: Database, title: "DKT Engine", desc: "딥러닝 기반 지식 추적 및 학습 예측 모델" },
          { icon: Layers, title: "sLLM + RAG", desc: "교육 특화 경량화 언어모델 및 검색 증강" },
          { icon: Eye, title: "Vision AI", desc: "손글씨/수식 인식 및 학습자 감정 분석" },
          { icon: Mic, title: "Speech AI", desc: "외국어 발음 정밀 진단 및 프리토킹" },
        ].map((tech, idx) => (
          <FadeInSection key={idx} delay={`${idx * 0.1}s`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-blue-500/50 transition-all hover:bg-slate-800 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-all"></div>
              <tech.icon className="w-12 h-12 text-slate-500 mb-6 group-hover:text-blue-400 transition-colors group-hover:scale-110 transform duration-300" />
              <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{tech.desc}</p>
            </div>
          </FadeInSection>
        ))}
      </div>

      {/* Service Map with Rich Images */}
      <div className="bg-slate-900 py-24 border-y border-slate-800 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <FadeInSection className="mb-16 text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Service Ecosystem</h2>
             <p className="text-slate-400">비상교육의 주요 브랜드에 적용된 AI 기술을 확인하세요.</p>
           </FadeInSection>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <FadeInSection key={idx} delay={`${idx * 0.1}s`}>
                  <div className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 hover:border-blue-400/50 transition-all duration-500">
                     {/* Background Image with Zoom Effect */}
                     <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${service.bgImage})` }}
                     />
                     {/* Gradient Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                     
                     {/* Content */}
                     <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center space-x-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-2 group-hover:translate-y-0 delay-100">
                           <span className="px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/30">
                              {service.model}
                           </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {service.name}
                        </h3>
                        <p className="text-slate-300 font-medium text-sm mb-4 line-clamp-1 group-hover:line-clamp-none transition-all">
                            {service.feature}
                        </p>
                        
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                             <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-700 pt-3">
                                 {service.desc}
                             </p>
                        </div>
                     </div>

                     {/* Top Right Icon */}
                     <div className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowRight size={20} />
                     </div>
                  </div>
                </FadeInSection>
              ))}
           </div>
        </div>
      </div>

      {/* Roadmap Graph */}
      <div className="max-w-7xl mx-auto px-4 mt-24 mb-24">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <FadeInSection className="w-full md:w-1/2">
             <h2 className="text-3xl font-bold text-white mb-8">AI Transformation Roadmap</h2>
             <ul className="space-y-10 relative pl-4">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-3 bottom-8 w-0.5 bg-gradient-to-b from-blue-600 via-blue-900 to-slate-800 -z-10"></div>
                
                {[
                    { year: '2023', title: 'Foundation', desc: 'AI R&D 센터 설립 및 핵심 DKT 모델 고도화', active: true },
                    { year: '2024', title: 'Expansion', desc: '주요 서비스(수학/영어) LLM 통합 및 상용화', active: true },
                    { year: '2025', title: 'AX Transformation', desc: 'K-12 전 플랫폼 AI Native 서비스 전환 완료', active: false },
                ].map((item, i) => (
                    <li key={i} className="flex items-start group">
                        <div className={`p-1.5 rounded-full border-2 mr-6 z-10 transition-all duration-300 ${item.active ? 'bg-slate-950 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-900 border-slate-700'}`}>
                                <CheckCircle2 className={`${item.active ? 'text-blue-500' : 'text-slate-700'}`} size={20} />
                        </div>
                        <div>
                            <span className={`text-sm font-bold tracking-wider mb-1 block ${item.active ? 'text-blue-400' : 'text-slate-500'}`}>{item.year}</span>
                            <h4 className={`font-bold text-xl mb-2 ${item.active ? 'text-white' : 'text-slate-400'}`}>{item.title}</h4>
                            <p className="text-slate-500 text-sm">{item.desc}</p>
                        </div>
                    </li>
                ))}
             </ul>
          </FadeInSection>
          
          <FadeInSection className="w-full md:w-1/2" delay="0.2s">
            <div className="h-[500px] bg-gradient-to-b from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h4 className="text-sm font-bold text-slate-400 mb-8 text-center uppercase tracking-wider">AI 기술 적용률 성장 추이</h4>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data}>
                  <defs>
                    <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip 
                    cursor={{fill: '#1e293b', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Bar dataKey="aiAdoption" fill="url(#colorAdoption)" radius={[8, 8, 0, 0]} barSize={50} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* Vision Video Section */}
      <section className="relative w-full py-32 bg-slate-950 border-t border-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <FadeInSection>
                <span className="text-blue-500 font-bold tracking-widest text-sm uppercase mb-4 block animate-pulse">Our Vision</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">AX 비전: 교육의 미래를 보다</h2>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video max-w-5xl mx-auto group">
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
                    {visionVideo ? (
                        <VideoPlayer
                            src={visionVideo.url}
                            poster={visionVideo.posterUrl}
                            autoPlay={false}
                            className="w-full h-full transform transition-transform duration-1000 group-hover:scale-105"
                            onPlay={() => onVideoPlay && onVideoPlay(visionVideo.id)}
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <p className="text-slate-500">Vision 영상이 준비되지 않았습니다.</p>
                        </div>
                    )}
                </div>
                <p className="mt-12 text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
                    비상교육은 AI 기술을 통해 선생님과 학생 모두가 성장하는<br/>
                    새로운 교육 생태계를 만들어갑니다.
                </p>
            </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default AiEdutechPage;