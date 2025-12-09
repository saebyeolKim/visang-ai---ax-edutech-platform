
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { VideoAsset } from './types';
import { INITIAL_VIDEOS } from './constants';

// Pages
import HomePage from './pages/Home';
import AiEdutechPage from './pages/AiEdutech';
import AiHubPage from './pages/AiHub';
import AdminVideoPage from './pages/AdminVideo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '홈', path: '/' },
    { name: 'AI 에듀테크', path: '/edutech' },
    { name: 'AI 허브', path: '/hub' },
    { name: '관리자 (영상)', path: '/admin' },
  ];

  const isActive = (path: string) => location.pathname === path ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white font-medium';

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <span className="text-2xl font-bold tracking-tighter text-white group-hover:opacity-90 transition">
                VISANG <span className="text-blue-500">AI</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm transition-all duration-200 ${isActive(link.path)}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-950 border-t border-slate-900 py-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="mb-4">
        <span className="text-2xl font-bold text-slate-600">VISANG</span>
      </div>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        AI로 연결된 학습, 세상을 바꾸는 교육의 혁신.<br/>
        Copyright © Visang Education Inc. All rights reserved.
      </p>
      <div className="flex justify-center space-x-6 text-slate-600 text-xs">
        <a href="#" className="hover:text-blue-400 transition">개인정보처리방침</a>
        <a href="#" className="hover:text-blue-400 transition">이용약관</a>
        <a href="#" className="hover:text-blue-400 transition">문의하기</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  // Central State for Videos (Mocking a database/CMS)
  const [videos, setVideos] = useState<VideoAsset[]>(INITIAL_VIDEOS);

  const handleUpdateVideo = (newVideo: VideoAsset) => {
    setVideos((prev) => {
      const exists = prev.find((v) => v.id === newVideo.id);
      if (exists) {
        return prev.map((v) => (v.id === newVideo.id ? newVideo : v));
      } else {
        return [...prev, newVideo];
      }
    });
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVideoView = (id: string) => {
    setVideos((prev) => 
      prev.map((v) => (v.id === id ? { ...v, views: (v.views || 0) + 1 } : v))
    );
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage videos={videos} onVideoPlay={handleVideoView} />} />
            <Route path="/edutech" element={<AiEdutechPage videos={videos} onVideoPlay={handleVideoView} />} />
            <Route path="/hub" element={<AiHubPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminVideoPage 
                  videos={videos} 
                  onUpdateVideo={handleUpdateVideo} 
                  onDeleteVideo={handleDeleteVideo} 
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;