
import React, { useState } from 'react';
import { VideoAsset, VideoCategory } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import FadeInSection from '../components/FadeInSection';
import { ArrowRight, Brain, Globe, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomeProps {
  videos: VideoAsset[];
  onVideoPlay?: (id: string) => void;
}

const HomePage: React.FC<HomeProps> = ({ videos, onVideoPlay }) => {
  const brandVideo = videos.find(v => v.category === VideoCategory.BRAND);
  const useCaseVideo = videos.find(v => v.category === VideoCategory.USE_CASE);
  const [isEnded, setIsEnded] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {brandVideo && !isEnded ? (
          // 🔥 1) 영상 재생 중 구간
          <div className="relative w-full h-full">
            <VideoPlayer
              src={brandVideo.url}
              poster={brandVideo.posterUrl}
              className="w-full h-full"
              onEnded={() => setIsEnded( true )}
            />
          </div>
        ) : (
          // 🔥 2) 영상 종료 후 구간 → 이미지 + 텍스트 표시
          <div className="relative w-full h-full">
            <img
              src={brandVideo?.posterUrl}
              className="w-full h-full object-cover"
            />

            {/* 🔥 텍스트는 여기에서만 보이게 조건 처리 */}
            <div className="absolute bottom-20 w-full text-center z-10">
              <FadeInSection>
                <h2 className="text-blue-400 font-bold text-sm mb-4 uppercase">AI Edutech Leader</h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                  AI로 연결된 학습,<br />
                  세상을 바꾸는 교육의 혁신.
                </h1>
                <p className="text-slate-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                  비상교육은 AX 시대의 에듀테크 리더로서,<br className="hidden md:block"/>
                  데이터와 인공지능을 통해 더 나은 학습 경험을 설계합니다.
                </p>
              </FadeInSection>
            </div>
          </div>
        )}
      </section>


      {/* AI Value Highlights */}
      <section className="py-24 bg-slate-950 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <FadeInSection delay="0s">
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-500 hover:-translate-y-2 group h-full">
                <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 group-hover:bg-blue-500/20 transition">
                  <Brain className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI 맞춤 학습</h3>
                <p className="text-slate-400 leading-relaxed">학습자 수준을 실시간 진단하고<br/>최적의 경로를 제시하는 맞춤형 학습</p>
              </div>
            </FadeInSection>

            <FadeInSection delay="0.2s">
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition duration-500 hover:-translate-y-2 group h-full">
                <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-6 group-hover:bg-purple-500/20 transition">
                  <Database className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">데이터 기반 분석</h3>
                <p className="text-slate-400 leading-relaxed">25년 교육 데이터와 최신 AI 알고리즘의<br/>결합으로 정밀한 분석 제공</p>
              </div>
            </FadeInSection>

            <FadeInSection delay="0.4s">
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition duration-500 hover:-translate-y-2 group h-full">
                <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-full mb-6 group-hover:bg-cyan-500/20 transition">
                  <Globe className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">글로벌 확장성</h3>
                <p className="text-slate-400 leading-relaxed">언어와 국경을 넘어 전 세계 교실에<br/>적용 가능한 유연한 AI 플랫폼</p>
              </div>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* AI Service Teaser */}
      <section className="py-24 bg-slate-900">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
            <FadeInSection className="w-full md:w-1/2">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">AX 혁명을 경험하세요</h2>
               <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  비상교육의 AI는 단순히 문제를 푸는 것을 넘어, 학습의 본질을 꿰뚫어봅니다.
                  AI 튜터, 실시간 발음 교정, 자동 채점 등 다양한 서비스 현장을 확인하세요.
               </p>
               <div className="flex gap-4">
                  <span className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm border border-slate-700">Math AI</span>
                  <span className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm border border-slate-700">Vision AI</span>
                  <span className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm border border-slate-700">Speech AI</span>
               </div>
            </FadeInSection>
            
            <FadeInSection delay="0.3s" className="w-full md:w-1/2">
              <div className="h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                 {useCaseVideo ? (
                   <VideoPlayer
                     src={useCaseVideo.url}
                     poster={useCaseVideo.posterUrl}
                     className="w-full h-full"
                     onPlay={() => onVideoPlay && onVideoPlay(useCaseVideo.id)}
                   />
                 ) : (
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <p className="text-slate-500">서비스 데모 영상 준비중</p>
                   </div>
                 )}
              </div>
            </FadeInSection>
         </div>
      </section>
    </div>
  );
};

export default HomePage;