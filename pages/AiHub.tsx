import React, { useState, useMemo } from 'react';
import { TabType, NewsItem } from '../types';
import { MOCK_NEWS, MOCK_RESEARCH, MOCK_RESOURCES } from '../constants';
import { Download, ExternalLink, FileText, FlaskConical, Plus, ChevronLeft, Calendar, Tag, PenTool, X, Save, Link as LinkIcon, Printer } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';

const AiHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.NEWSROOM);
  
  // Newsroom State
  const [newsList, setNewsList] = useState<NewsItem[]>(MOCK_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Form State
  const [newPost, setNewPost] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tag: 'Press',
    summary: '',
    content: '',
    linkUrl: ''
  });

  // Dynamic Categories derived from existing news
  const categories = useMemo(() => {
    const tags = new Set(newsList.map(item => item.tag));
    return ['All', ...Array.from(tags)];
  }, [newsList]);

  const filteredNews = activeFilter === 'All' 
    ? newsList 
    : newsList.filter(item => item.tag === activeFilter);

  const handleSavePost = () => {
    if (!newPost.title || !newPost.content) return alert('제목과 본문을 입력해주세요.');
    
    const post: NewsItem = {
      id: `n-${Date.now()}`,
      ...newPost,
      summary: newPost.summary || newPost.content.substring(0, 50) + '...'
    };

    setNewsList([post, ...newsList]);
    setIsWriting(false);
    setNewPost({ title: '', date: new Date().toISOString().split('T')[0], tag: 'Press', summary: '', content: '', linkUrl: '' });
    
    // Automatically switch to the new tag if convenient, or stay on All
    if (activeFilter !== 'All' && activeFilter !== post.tag) setActiveFilter('All');
  };

  const handleDownloadPdf = (title: string) => {
      alert(`'${title}' 게시글이 PDF로 다운로드 되었습니다.\n(파일명: ${title.replace(/\s+/g, '_')}.pdf)`);
  };

  const handleDownloadAllPdf = (categoryName: string) => {
      alert(`전체 ${categoryName} 데이터가 PDF로 변환되어 다운로드 시작되었습니다.\n파일명: Visang_AI_${categoryName.replace(/\s+/g, '_')}_Report_2024.pdf`);
  };

  const renderNewsroom = () => {
    // 1. Detail View Mode
    if (selectedNews) {
      return (
        <FadeInSection className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 relative min-h-[600px]">
          <div className="flex justify-between items-start mb-8">
            <button 
                onClick={() => setSelectedNews(null)}
                className="flex items-center text-slate-400 hover:text-white transition group"
            >
                <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 mr-2">
                <ChevronLeft size={20} />
                </div>
                목록으로 돌아가기
            </button>

            <button
                onClick={() => handleDownloadPdf(selectedNews.title)}
                className="flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition"
                title="PDF로 저장"
            >
                <FileText size={18} className="mr-2"/>
                PDF 저장
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm font-bold rounded-lg border border-blue-900/50">
                {selectedNews.tag}
              </span>
              <span className="text-slate-500 text-sm flex items-center">
                <Calendar size={14} className="mr-1" /> {selectedNews.date}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
              {selectedNews.title}
            </h2>
            
            {/* Related Link Button */}
            {selectedNews.linkUrl && (
                <div className="mb-8">
                    <a 
                        href={selectedNews.linkUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition border border-slate-700"
                    >
                        <ExternalLink size={16} className="mr-2 text-blue-400"/>
                        관련 링크 (Teams/Article) 바로가기
                    </a>
                </div>
            )}

            <div className="h-px w-full bg-slate-800 mb-8" />
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose whitespace-pre-line">
              {selectedNews.content || selectedNews.summary}
            </div>
          </div>
        </FadeInSection>
      );
    }

    // 2. Write Mode
    if (isWriting) {
      return (
        <FadeInSection className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 relative">
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
            <h2 className="text-2xl font-bold text-white">새 뉴스 등록</h2>
            <button onClick={() => setIsWriting(false)} className="text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">카테고리 (직접 입력 가능)</label>
                <div className="relative">
                   <Tag className="absolute left-3 top-3 text-slate-500" size={18}/>
                   <input 
                      type="text" 
                      list="category-options"
                      value={newPost.tag}
                      onChange={(e) => setNewPost({...newPost, tag: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="예: Press, Event"
                   />
                   <datalist id="category-options">
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
                   </datalist>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">날짜</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-3 text-slate-500" size={18}/>
                   <input 
                      type="date" 
                      value={newPost.date}
                      onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                   />
                </div>
              </div>
            </div>

            <div>
               <label className="block text-slate-400 text-sm font-bold mb-2">제목</label>
               <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-lg font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="제목을 입력하세요"
               />
            </div>

            <div>
               <label className="block text-slate-400 text-sm font-bold mb-2">관련 링크 (Teams 게시글, 외부 기사 등)</label>
               <div className="relative">
                   <LinkIcon className="absolute left-3 top-3.5 text-slate-500" size={18}/>
                   <input 
                      type="url" 
                      value={newPost.linkUrl}
                      onChange={(e) => setNewPost({...newPost, linkUrl: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="https://..."
                   />
               </div>
            </div>

            <div>
               <label className="block text-slate-400 text-sm font-bold mb-2">요약 (선택사항)</label>
               <input 
                  type="text" 
                  value={newPost.summary}
                  onChange={(e) => setNewPost({...newPost, summary: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="리스트에 노출될 짧은 요약"
               />
            </div>

            <div>
               <label className="block text-slate-400 text-sm font-bold mb-2">본문 내용</label>
               <textarea 
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full h-64 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none leading-relaxed"
                  placeholder="내용을 입력하세요..."
               />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSavePost}
                className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 transition transform active:scale-95"
              >
                <Save size={20} className="mr-2"/>
                게시글 등록
              </button>
            </div>
          </div>
        </FadeInSection>
      );
    }

    // 3. Default List Mode
    return (
      <div className="space-y-6 relative">
         {/* Filter & Action Bar */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-xs md:text-sm font-medium px-4 py-2 rounded-full transition border ${
                    activeFilter === cat 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/50' 
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => handleDownloadAllPdf("Newsroom")}
                    className="flex items-center text-sm font-bold text-slate-400 hover:text-blue-400 transition px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
                    title="전체 뉴스 PDF 다운로드"
                >
                    <Download size={16} className="mr-2"/>
                    전체 다운로드
                </button>
                <button 
                onClick={() => setIsWriting(true)}
                className="flex items-center text-sm font-bold text-blue-400 hover:text-white transition px-4 py-2 bg-blue-900/10 hover:bg-blue-600 rounded-lg border border-blue-900/30 hover:border-blue-500 group"
                >
                <PenTool size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                뉴스 등록
                </button>
            </div>
         </div>

         {/* Grid List */}
         <div className="grid grid-cols-1 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map(news => (
                <div 
                  key={news.id} 
                  onClick={() => setSelectedNews(news)}
                  className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition"></div>
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <div className="flex items-center gap-2">
                          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border w-fit ${
                            news.tag === 'Press' ? 'bg-purple-900/20 text-purple-400 border-purple-900/30' :
                            news.tag === 'Event' ? 'bg-orange-900/20 text-orange-400 border-orange-900/30' :
                            'bg-blue-900/20 text-blue-400 border-blue-900/30'
                          }`}>
                            {news.tag}
                          </span>
                          {news.linkUrl && <LinkIcon size={12} className="text-slate-500" />}
                      </div>
                      <span className="text-slate-500 text-sm flex items-center">
                        <Calendar size={14} className="mr-1.5"/> {news.date}
                      </span>
                   </div>
                   
                   <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                     {news.title}
                   </h3>
                   <p className="text-slate-400 leading-relaxed line-clamp-2">
                     {news.summary}
                   </p>
                   
                   <div className="mt-6 flex items-center text-sm text-blue-500 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                     자세히 보기 <ChevronLeft className="rotate-180 ml-1" size={16}/>
                   </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                등록된 게시글이 없습니다.
              </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <FadeInSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">AI Hub</h1>
          <p className="text-slate-400 text-lg">비상교육의 AI 혁신, 연구 성과, 그리고 지식 자산을 공유합니다.</p>
        </FadeInSection>

        {/* Tabs */}
        <FadeInSection delay="0.1s" className="flex flex-wrap justify-center mb-12 border-b border-slate-800">
          {[
            { id: TabType.NEWSROOM, label: '뉴스룸' },
            { id: TabType.RND, label: 'R&D 허브' },
            { id: TabType.RESOURCES, label: '자료실' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedNews(null); // Reset detail view when switching tabs
                setIsWriting(false);
              }}
              className={`pb-4 px-6 md:px-10 font-bold text-lg transition-all border-b-2 ${
                activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </FadeInSection>

        {/* Content Area */}
        <div className="min-h-[600px]">
          {activeTab === TabType.NEWSROOM && (
            <div className="fade-in-section is-visible">
              {renderNewsroom()}
            </div>
          )}

          {activeTab === TabType.RND && (
             <FadeInSection>
                <div className="flex justify-end mb-6">
                    <button 
                        onClick={() => handleDownloadAllPdf("R&D Hub")}
                        className="flex items-center text-sm font-bold text-slate-400 hover:text-blue-400 transition px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
                    >
                        <Download size={16} className="mr-2"/>
                        전체 보고서 다운로드 (PDF)
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_RESEARCH.map(item => (
                    <div key={item.id} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col hover:shadow-lg hover:shadow-purple-900/10 transition group">
                    <div className="flex items-center mb-6">
                        <div className="p-3 rounded-lg bg-slate-800 mr-4 group-hover:bg-purple-900/20 transition">
                            <FlaskConical className="text-purple-400" size={24}/>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                    </div>
                    <div className="mb-6 flex-grow space-y-4">
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-500">상태</span>
                            <span className={`font-medium px-2 py-0.5 rounded ${item.status === 'Completed' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>{item.status}</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-500">사용 모델</span>
                            <span className="text-slate-300 text-right font-mono text-xs bg-slate-800 px-2 py-1 rounded">{item.model}</span>
                        </div>
                        <p className="text-slate-400 text-sm pt-2 leading-relaxed">{item.description}</p>
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center mt-auto font-medium transition group-hover:translate-x-1">
                        기술 보고서 보기 <ExternalLink size={14} className="ml-1"/>
                    </button>
                    </div>
                ))}
                </div>
            </FadeInSection>
          )}

          {activeTab === TabType.RESOURCES && (
            <FadeInSection className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden shadow-xl">
              {MOCK_RESOURCES.map(res => (
                <div key={res.id} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer group">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center mr-5 text-slate-400 group-hover:text-white transition-colors group-hover:bg-blue-600 shadow-inner">
                      <FileText size={20}/>
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors text-lg">{res.title}</h4>
                      <p className="text-slate-500 text-sm mt-1 font-mono">{res.type} • {res.size}</p>
                    </div>
                  </div>
                  <button className="p-3 text-slate-400 group-hover:text-white bg-slate-800 group-hover:bg-blue-600 rounded-full transition shadow-lg">
                    <Download size={18} />
                  </button>
                </div>
              ))}
              <div className="p-8 bg-slate-950/30 text-center">
                 <button className="text-blue-400 text-sm font-bold hover:text-blue-300 transition flex items-center justify-center w-full">
                    <Download size={16} className="mr-2"/> 전체 자료 다운로드 (ZIP)
                 </button>
              </div>
            </FadeInSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiHubPage;