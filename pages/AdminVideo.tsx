
import React, { useState, useRef, useEffect } from 'react';
import { VideoAsset, VideoCategory } from '../types';
import { Upload, Trash2, RefreshCw, Eye, AlertCircle, Wand2, Check, X, ImagePlus, MapPin, ExternalLink, MonitorPlay, Sparkles, Save, Film, Loader2, Shuffle, Image as ImageIcon, BarChart2 } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import FadeInSection from '../components/FadeInSection';
import { GoogleGenAI } from "@google/genai";
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    }
  }
}

interface AdminVideoProps {
  videos: VideoAsset[];
  onUpdateVideo: (video: VideoAsset) => void;
  onDeleteVideo: (id: string) => void;
}

type AdminTab = 'manage' | 'generate';

const AdminVideoPage: React.FC<AdminVideoProps> = ({ videos, onUpdateVideo, onDeleteVideo }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('manage');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>(VideoCategory.BRAND);
  
  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);
  const [generatedDesc, setGeneratedDesc] = useState<string>('');
  const [thumbnailPrompt, setThumbnailPrompt] = useState<string>('');
  const [savedPrompts, setSavedPrompts] = useState<string[]>([
    "Futuristic AI education environment, blue and white theme, 3d render, high tech",
    "Abstract network connections, data flow, dark background, professional, corporate style"
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Video Gen State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoGenStatus, setVideoGenStatus] = useState<string>('');
  const [useImageAsReference, setUseImageAsReference] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  // Analytics Data Preparation
  const analyticsData = videos.map(v => ({
      name: v.category.split(' ')[0], // Short name
      views: v.views || 0,
      fullTitle: v.title
  }));

  // Update prompt when category changes
  useEffect(() => {
    setThumbnailPrompt(`A futuristic, high-tech, abstract background image suitable for a video thumbnail about ${selectedCategory}. 
Keywords: AI, Education, Data, Blue and Dark Navy Color Palette, Minimalist, Corporate, Professional. 
Style: 3D render, digital art, high resolution, glowing lines, connectivity.
No text.`);
  }, [selectedCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'poster') => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const objectUrl = URL.createObjectURL(selectedFile);

      if (type === 'video') {
        setFile(selectedFile);
        setPreviewUrl(objectUrl);
      } else {
        setPosterFile(selectedFile);
        setPosterPreviewUrl(objectUrl);
      }
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate network upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeUpload();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const completeUpload = () => {
    if ((!file && !previewUrl) || !previewUrl) return;

    const existingVideo = videos.find(v => v.category === selectedCategory);
    const newVersion = existingVideo ? existingVideo.version + 1 : 1;
    const newId = existingVideo ? existingVideo.id : `v-${Date.now()}`;

    const newVideoAsset: VideoAsset = {
      id: newId,
      title: `${selectedCategory} Video v${newVersion}`,
      category: selectedCategory,
      url: previewUrl, 
      posterUrl: posterPreviewUrl || (existingVideo?.posterUrl ?? ''),
      version: newVersion,
      updatedAt: new Date().toISOString(),
      description: generatedDesc || existingVideo?.description,
      views: existingVideo?.views || 0 // Preserve analytics on update
    };

    onUpdateVideo(newVideoAsset);
    setIsUploading(false);
    
    // Reset form
    setFile(null);
    setPosterFile(null);
    setPreviewUrl(null);
    setPosterPreviewUrl(null);
    setGeneratedDesc('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (posterInputRef.current) posterInputRef.current.value = '';
    
    // Simple toast alert
    alert(`성공적으로 업로드되었습니다: ${selectedCategory} (v${newVersion})`);
  };

  const generateDescription = async () => {
    if (!process.env.API_KEY) {
        setGeneratedDesc("API_KEY가 필요합니다. (데모 모드)");
        return;
    }

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, professional video description in Korean (1 sentence) for a corporate AI video about ${selectedCategory}. Tone: Innovative, Trustworthy.`,
        });
        setGeneratedDesc(response.text.trim());
    } catch (error) {
        console.error("Gemini API Error:", error);
        setGeneratedDesc("AI 생성 실패. 수동으로 입력해주세요.");
    } finally {
        setIsGenerating(false);
    }
  };

  const generateThumbnail = async () => {
    if (!process.env.API_KEY) {
        alert("API_KEY가 필요합니다. (데모 모드)");
        return;
    }

    if (!thumbnailPrompt.trim()) {
        alert("프롬프트를 입력해주세요.");
        return;
    }

    setIsGeneratingThumb(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: thumbnailPrompt }] },
        });

        let imageUrl = '';
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    imageUrl = `data:image/png;base64,${base64EncodeString}`;
                    break;
                }
            }
        }

        if (imageUrl) {
            setPosterPreviewUrl(imageUrl);
        } else {
            alert("이미지를 생성하지 못했습니다. 다시 시도해주세요.");
        }
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        alert("AI 이미지 생성 중 오류가 발생했습니다.");
    } finally {
        setIsGeneratingThumb(false);
    }
  };

  const handleSavePrompt = () => {
    if (thumbnailPrompt.trim() && !savedPrompts.includes(thumbnailPrompt.trim())) {
      setSavedPrompts(prev => [...prev, thumbnailPrompt.trim()]);
      alert("프롬프트가 저장되었습니다.");
    }
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
        alert("영상 생성을 위한 프롬프트를 입력해주세요.");
        return;
    }

    // Check for API Key (Veo requires paid key)
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            try {
                // Fixed: openSelectKey returns void, so checking if (!success) is invalid.
                await window.aistudio.openSelectKey();
            } catch (e) {
                console.error(e);
                alert("API Key 선택 중 오류가 발생했습니다.");
                return;
            }
        }
    }

    setIsGeneratingVideo(true);
    setVideoGenStatus("작업 요청 중...");
    setGeneratedVideoUrl(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let imagePart = undefined;
        // If image reference is enabled and we have a poster URL
        if (useImageAsReference && posterPreviewUrl) {
            try {
                const base64Data = await urlToBase64(posterPreviewUrl);
                imagePart = {
                    imageBytes: base64Data,
                    mimeType: 'image/png', // Assuming PNG/JPEG, Veo handles standard types
                };
            } catch (e) {
                console.warn("Failed to process image for video generation", e);
                // Continue without image or alert? Let's alert to be safe.
                alert("이미지 처리 중 오류가 발생했습니다. 텍스트로만 생성합니다.");
            }
        }

        const requestParams: any = {
            model: 'veo-3.1-fast-generate-preview',
            prompt: videoPrompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        };

        if (imagePart) {
            requestParams.image = imagePart;
        }

        let operation = await ai.models.generateVideos(requestParams);

        setVideoGenStatus("영상 생성 중... (약 1~2분 소요)");

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
            operation = await ai.operations.getVideosOperation({operation: operation});
            setVideoGenStatus("영상 렌더링 진행 중...");
        }

        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = operation.response.generatedVideos[0].video.uri;
            setVideoGenStatus("영상 다운로드 중...");
            
            // Fetch the video content
            const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoRes.ok) throw new Error("Video download failed");
            
            const blob = await videoRes.blob();
            const url = URL.createObjectURL(blob);
            setGeneratedVideoUrl(url);
            setVideoGenStatus("완료");
        } else {
            throw new Error("No video URI in response");
        }

    } catch (error: any) {
        console.error("Video Gen Error:", error);
        setVideoGenStatus("오류 발생: " + (error.message || "알 수 없는 오류"));
        if (error.message?.includes("Requested entity was not found")) {
            alert("세션이 만료되었거나 키가 유효하지 않습니다. 키를 다시 선택해주세요.");
            if (window.aistudio) await window.aistudio.openSelectKey();
        }
    } finally {
        setIsGeneratingVideo(false);
    }
  };

  const handleRandomPrompt = () => {
    const prompts = [
        "A futuristic classroom with holograms floating in the air, cinematic lighting, 4k",
        "A drone shot of a futuristic school campus with solar panels and green roofs",
        "Close up of a student using a transparent tablet with glowing data visualizations",
        "Abstract visualization of neural networks connecting global knowledge nodes",
        "Cyberpunk city street with neon lights reflecting on wet pavement, detailed texture",
        "Time-lapse of a flower blooming in a digital garden, particles floating",
        "A robot teacher explaining mathematics to children in a bright, modern room"
    ];
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setVideoPrompt(random);
  };

  const useGeneratedVideo = () => {
      if (generatedVideoUrl) {
          setPreviewUrl(generatedVideoUrl);
          // Auto-switch tab and fill prompt if empty
          setActiveTab('manage');
          // Optionally generate a thumbnail for it too?
      }
  };

  // Helper to determine exposure location based on category
  const getExposureInfo = (category: VideoCategory) => {
    switch (category) {
      case VideoCategory.BRAND:
        return { label: '홈 > 상단 Hero 섹션', path: '/' };
      case VideoCategory.USE_CASE:
        return { label: '홈 > 서비스 티저 섹션', path: '/' };
      case VideoCategory.VISION:
        return { label: 'AI 에듀테크 > 하단 Vision 섹션', path: '/edutech' };
      default:
        return { label: '미정', path: '#' };
    }
  };

  const exposureInfo = getExposureInfo(selectedCategory);
  const currentVideo = videos.find(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center">
                  <div className="p-3 bg-blue-600 rounded-xl mr-4 shadow-lg shadow-blue-900/50">
                      <MonitorPlay size={24} className="text-white"/>
                  </div>
                  영상 관리 모듈
              </h1>
              <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-bold border border-red-900/50 flex items-center gap-1">
                <AlertCircle size={12}/> 관리자 전용
              </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-900/50 p-1 rounded-xl inline-flex border border-slate-800">
             <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'manage' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
             >
                영상 관리 / 업로드
             </button>
             <button
                onClick={() => setActiveTab('generate')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${
                    activeTab === 'generate' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
             >
                <Sparkles size={16} className="mr-2" />
                AI Video Studio (Veo)
             </button>
          </div>
        </FadeInSection>
        
        {activeTab === 'manage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dashboard Analytics Section - Full Width for Manage Tab */}
          <div className="lg:col-span-3">
             <FadeInSection>
                 <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8 relative overflow-hidden">
                     {/* Decorative bg */}
                     <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                     
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center">
                            <BarChart2 className="mr-2 text-blue-500" /> 
                            실시간 영상 KPI 분석 (Video Analytics)
                        </h2>
                        <span className="text-xs text-slate-500">Live Data</span>
                     </div>
                     
                     <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-2/3 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip 
                                        cursor={{fill: '#1e293b', opacity: 0.4}}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                    />
                                    <Bar dataKey="views" fill="#3b82f6" barSize={20} radius={[0, 4, 4, 0]}>
                                        {analyticsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#06b6d4'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">총 재생 횟수 (Total Views)</p>
                                <p className="text-2xl font-bold text-white">{analyticsData.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">활성 슬롯 (Active Slots)</p>
                                <p className="text-2xl font-bold text-white">{videos.length} <span className="text-sm font-normal text-slate-500">/ 3</span></p>
                            </div>
                        </div>
                     </div>
                 </div>
             </FadeInSection>
          </div>

          {/* Left Column: Upload Form */}
          <div className="lg:col-span-1 space-y-6">
            <FadeInSection delay="0.1s">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/90 z-10 flex flex-col items-center justify-center p-8">
                    <div className="w-full h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-200" style={{width: `${uploadProgress}%`}}></div>
                    </div>
                    <p className="text-white font-medium animate-pulse">업로드 중... {uploadProgress}%</p>
                  </div>
                )}
                
                <h2 className="text-xl font-bold text-white mb-6">새 영상 업로드</h2>
                
                <div className="space-y-5">
                  {/* Category Select mapped to Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">영상 노출 위치 (Slot) 선택</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => {
                          setSelectedCategory(e.target.value as VideoCategory);
                          setPreviewUrl(null); 
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value={VideoCategory.BRAND}>메인 홈 상단 (Brand Identity)</option>
                      <option value={VideoCategory.USE_CASE}>메인 서비스 소개 (Use Case)</option>
                      <option value={VideoCategory.VISION}>AI 에듀테크 하단 (AX Vision)</option>
                    </select>
                  </div>

                  {/* Exposure Info Box */}
                  <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-900/30 flex items-center justify-between">
                     <div className="flex items-center text-xs">
                         <MapPin size={14} className="text-blue-400 mr-2"/>
                         <span className="text-slate-400 mr-2">실제 노출 위치:</span>
                         <span className="text-white font-bold">{exposureInfo.label}</span>
                     </div>
                  </div>

                  {/* Video Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">영상 파일 (MP4/WebM)</label>
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file ? 'border-blue-500 bg-blue-900/10' : 'border-slate-700 bg-slate-800 hover:bg-slate-750 hover:border-slate-500'}`}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {file ? (
                                <>
                                  <Check className="w-8 h-8 mb-2 text-blue-500" />
                                  <p className="text-xs text-blue-400 font-medium truncate max-w-[200px]">{file.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-3 text-slate-500" />
                                  <p className="text-sm text-slate-400"><span className="font-semibold text-blue-400">클릭하여 업로드</span></p>
                                </>
                              )}
                          </div>
                          <input ref={fileInputRef} type="file" className="hidden" accept="video/mp4,video/webm" onChange={(e) => handleFileChange(e, 'video')} />
                      </label>
                    </div>
                  </div>

                  {/* Poster Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-400">썸네일 이미지</label>
                    </div>
                    
                    <input ref={posterInputRef} type="file" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-white hover:file:bg-slate-600 transition cursor-pointer mb-3" accept="image/*" onChange={(e) => handleFileChange(e, 'poster')} />
                    
                    {/* AI Thumbnail Generation Controls */}
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-xs font-bold text-slate-400 uppercase flex items-center">
                                <Sparkles size={10} className="mr-1 text-purple-400"/> AI 썸네일 생성 설정
                             </label>
                             <button 
                                onClick={generateThumbnail}
                                disabled={isGeneratingThumb}
                                className="text-xs flex items-center text-purple-400 hover:text-purple-300 transition bg-purple-900/20 px-2 py-1 rounded border border-purple-900/50 hover:bg-purple-900/40"
                            >
                                <ImagePlus size={12} className="mr-1"/> {isGeneratingThumb ? '생성 중...' : '이미지 생성하기'}
                            </button>
                        </div>
                        <textarea 
                            value={thumbnailPrompt}
                            onChange={(e) => setThumbnailPrompt(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-slate-300 h-20 resize-none focus:ring-1 focus:ring-purple-500 scrollbar-thin outline-none"
                            placeholder="AI에게 요청할 이미지 설명을 입력하세요..."
                        />
                        <div className="mt-2 flex items-center justify-between gap-2">
                             <button
                                onClick={handleSavePrompt}
                                className="text-xs flex items-center bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition border border-slate-600"
                             >
                                <Save size={12} className="mr-1.5"/> 프롬프트 저장
                             </button>
                             {savedPrompts.length > 0 && (
                                <select 
                                    className="bg-slate-800 text-xs text-slate-400 border border-slate-600 rounded px-2 py-1.5 max-w-[140px] outline-none hover:border-slate-500"
                                    onChange={(e) => setThumbnailPrompt(e.target.value)}
                                    value=""
                                >
                                    <option value="" disabled>불러오기...</option>
                                    {savedPrompts.map((p, i) => (
                                        <option key={i} value={p}>
                                            {p.length > 15 ? p.substring(0, 15) + '...' : p}
                                        </option>
                                    ))}
                                </select>
                             )}
                        </div>
                    </div>

                    {posterPreviewUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                             <p className="text-xs text-slate-500 mb-1 px-1">썸네일 미리보기</p>
                             <img src={posterPreviewUrl} alt="Thumbnail Preview" className="w-full h-auto object-cover max-h-48" />
                        </div>
                    )}
                  </div>
                  
                  {/* AI Description Gen */}
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase">AI Description</label>
                          <button 
                              onClick={generateDescription}
                              disabled={isGenerating}
                              className="text-xs flex items-center text-purple-400 hover:text-purple-300 transition"
                          >
                              <Wand2 size={12} className="mr-1"/> {isGenerating ? '생성 중...' : '자동 생성'}
                          </button>
                      </div>
                      <textarea 
                          value={generatedDesc}
                          onChange={(e) => setGeneratedDesc(e.target.value)}
                          placeholder="영상의 내용을 입력하거나 AI로 생성하세요..."
                          className="w-full bg-slate-800 border-none rounded p-2 text-sm text-white h-12 resize-none focus:ring-1 focus:ring-purple-500 placeholder-slate-600"
                      />
                  </div>

                  <button
                    onClick={simulateUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-4 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                      file 
                      ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25' 
                      : 'bg-slate-800 cursor-not-allowed text-slate-600'
                    }`}
                  >
                    {isUploading ? '업로드 처리 중...' : (currentVideo ? '영상 교체하기 (Replace)' : '영상 게시하기 (Publish)')}
                  </button>
                </div>
              </div>
            </FadeInSection>
            
            {/* Guidelines */}
            <FadeInSection delay="0.2s">
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center"><AlertCircle size={16} className="mr-2 text-yellow-500"/> 관리자 가이드</h3>
                  <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
                      <li>영상 위치 선택 시 실제 웹사이트의 해당 섹션 영상이 교체됩니다.</li>
                      <li>MP4 형식을 권장하며, 용량 최적화가 필요합니다.</li>
                      <li>AI 썸네일 생성 기능을 활용해 일관된 톤앤매너를 유지하세요.</li>
                  </ul>
              </div>
            </FadeInSection>
          </div>

          {/* Right Column: Preview & Status */}
          <div className="lg:col-span-2 space-y-6">
             {/* Live Preview Area */}
             <FadeInSection delay="0.1s">
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white flex items-center">
                          <Eye className="mr-2 text-blue-500" /> 
                          {previewUrl ? '업로드 미리보기 (Preview)' : '현재 라이브 영상 (Live)'}
                      </h2>
                      {currentVideo ? (
                          <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full border border-green-900 font-medium animate-pulse">
                              On Air (v{currentVideo.version})
                          </span>
                      ) : (
                          <span className="text-xs bg-slate-800 text-slate-500 px-3 py-1 rounded-full border border-slate-700 font-medium">
                              Empty Slot
                          </span>
                      )}
                  </div>

                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-700 relative shadow-2xl">
                      {(previewUrl || currentVideo) ? (
                          <VideoPlayer 
                              src={previewUrl || currentVideo!.url} 
                              poster={posterPreviewUrl || currentVideo?.posterUrl}
                              autoPlay={false} 
                              className="w-full h-full"
                          />
                      ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
                              <Upload size={48} className="mb-4 opacity-30"/>
                              <p>선택한 위치에 영상이 없습니다.</p>
                          </div>
                      )}
                      
                      {/* Overlay Preview Badge */}
                      {previewUrl && (
                          <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg">
                              PREVIEW MODE
                          </div>
                      )}
                  </div>
                  
                  <div className="mt-6 p-5 bg-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                          <h4 className="text-sm font-bold text-white mb-1">영상 메타데이터</h4>
                          <p className="text-xs text-slate-400">
                             {currentVideo ? `ID: ${currentVideo.id} | Updated: ${new Date(currentVideo.updatedAt).toLocaleDateString()}` : '데이터 없음'}
                          </p>
                      </div>
                      <Link to={exposureInfo.path} target="_blank" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition flex items-center">
                          실제 페이지 확인 <ExternalLink size={12} className="ml-2"/>
                      </Link>
                  </div>
               </div>
             </FadeInSection>
             
             {/* Inventory List */}
             <FadeInSection delay="0.2s">
               <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-800">
                      <h3 className="font-bold text-white">전체 슬롯 현황</h3>
                  </div>
                  <div className="divide-y divide-slate-800">
                      {videos.map((vid) => (
                          <div key={vid.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition group">
                              <div className="flex items-center space-x-4">
                                  <div className="h-16 w-28 bg-slate-800 rounded-lg overflow-hidden relative shadow-md">
                                      <img src={vid.posterUrl} alt="poster" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                              <MonitorPlay size={12} className="text-white"/>
                                          </div>
                                      </div>
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-white">{vid.category}</p>
                                      <p className="text-xs text-slate-500 mt-1">v{vid.version} • {new Date(vid.updatedAt).toLocaleDateString()}</p>
                                  </div>
                              </div>
                              <div className="flex space-x-3">
                                  <button 
                                      onClick={() => {
                                          setSelectedCategory(vid.category);
                                          window.scrollTo({top: 0, behavior: 'smooth'});
                                      }}
                                      className="p-2 text-slate-400 hover:text-white hover:bg-blue-600/20 rounded-lg transition" 
                                      title="이 슬롯 수정하기"
                                  >
                                      <RefreshCw size={18} />
                                  </button>
                                  <button 
                                      onClick={() => {
                                          if(window.confirm('정말 이 영상을 삭제하시겠습니까? 해당 슬롯은 비어있게 됩니다.')) onDeleteVideo(vid.id);
                                      }}
                                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                                      title="삭제 (초기화)"
                                  >
                                      <Trash2 size={18} />
                                  </button>
                              </div>
                          </div>
                      ))}
                      {videos.length === 0 && (
                          <div className="p-12 text-center text-slate-500 text-sm">등록된 영상이 없습니다.</div>
                      )}
                  </div>
               </div>
             </FadeInSection>
          </div>
        </div>
        )}

        {/* AI Video Generator Tab */}
        {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <FadeInSection>
                        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                             {/* Background Accent */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                             <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                                    <Sparkles className="text-purple-500 mr-2" />
                                    AI Video Studio
                                </h2>
                                <p className="text-slate-400 text-sm mb-6">
                                    Google의 Veo 모델을 사용하여 텍스트 프롬프트로 고화질 영상을 생성합니다.<br/>
                                    <span className="text-purple-400 text-xs">* 유료 API 키 필요, 생성에 1~2분 소요됩니다.</span>
                                </p>

                                <div className="space-y-4">
                                    {/* Image Reference Toggle */}
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-lg mr-3 ${useImageAsReference ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                                <ImageIcon size={18} />
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${useImageAsReference ? 'text-white' : 'text-slate-400'}`}>Image-to-Video</h4>
                                                <p className="text-xs text-slate-500">현재 업로드된 썸네일을 시작 프레임으로 사용</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={useImageAsReference} onChange={() => setUseImageAsReference(!useImageAsReference)} />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                    
                                    {useImageAsReference && (
                                        <div className="p-3 bg-purple-900/10 border border-purple-500/30 rounded-lg text-xs text-purple-300 flex items-start">
                                            <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0"/>
                                            {posterPreviewUrl 
                                             ? "현재 '영상 관리' 탭의 썸네일 이미지를 기반으로 영상을 생성합니다." 
                                             : "경고: '영상 관리' 탭에 썸네일 이미지가 없습니다. 이미지를 먼저 업로드하거나 생성해주세요."}
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-bold text-slate-300">프롬프트 (Prompt)</label>
                                            <button 
                                                onClick={handleRandomPrompt}
                                                className="text-xs flex items-center text-purple-400 hover:text-white transition bg-slate-800 hover:bg-purple-600 px-3 py-1 rounded-full border border-slate-700 hover:border-purple-500"
                                            >
                                                <Shuffle size={12} className="mr-1"/> Surprise Me (자동 완성)
                                            </button>
                                        </div>
                                        <textarea
                                            value={videoPrompt}
                                            onChange={(e) => setVideoPrompt(e.target.value)}
                                            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none resize-none leading-relaxed"
                                            placeholder={useImageAsReference ? "이미지를 어떻게 움직이게 할까요? (예: 카메라가 천천히 줌아웃하며...)" : "예: A futuristic classroom with holograms floating in the air, cinematic lighting, 4k"}
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={handleGenerateVideo}
                                        disabled={isGeneratingVideo || !videoPrompt.trim() || (useImageAsReference && !posterPreviewUrl)}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                                            isGeneratingVideo
                                            ? 'bg-slate-800 cursor-not-allowed text-slate-400'
                                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/25 active:scale-95'
                                        }`}
                                    >
                                        {isGeneratingVideo ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={20}/>
                                                {videoGenStatus}
                                            </>
                                        ) : (
                                            <>
                                                <Film className="mr-2" size={20}/>
                                                영상 생성 시작 (Generate Video)
                                            </>
                                        )}
                                    </button>
                                </div>
                             </div>
                        </div>
                    </FadeInSection>
                    
                    <FadeInSection delay="0.1s">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                             <h3 className="font-bold text-slate-300 mb-4 text-sm">추천 프롬프트 예시</h3>
                             <div className="space-y-3">
                                {[
                                    "A drone shot of a futuristic school campus with solar panels and green roofs",
                                    "Close up of a student using a transparent tablet with glowing data visualizations",
                                    "Abstract visualization of neural networks connecting global knowledge nodes"
                                ].map((p, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setVideoPrompt(p)}
                                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer transition border border-slate-700 hover:border-purple-500/50"
                                    >
                                        {p}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </FadeInSection>
                </div>

                <div className="space-y-6">
                    <FadeInSection delay="0.2s">
                        <div className="bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col">
                            <div className="flex-grow relative flex items-center justify-center bg-slate-950">
                                {generatedVideoUrl ? (
                                    <VideoPlayer
                                        src={generatedVideoUrl}
                                        autoPlay={true}
                                        loop={true}
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        {isGeneratingVideo ? (
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-20 h-20 mb-6">
                                                    <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                                                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                                                    <Sparkles className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={24}/>
                                                </div>
                                                <p className="text-white font-bold text-lg mb-2">AI가 영상을 생성하고 있습니다</p>
                                                <p className="text-slate-500 text-sm">{videoGenStatus}</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center opacity-50">
                                                <Film size={64} className="text-slate-700 mb-4"/>
                                                <p className="text-slate-500">생성된 영상이 여기에 표시됩니다.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Bar */}
                            <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-between items-center">
                                <div className="text-xs text-slate-500">
                                    {generatedVideoUrl ? "생성 완료 (Preview)" : "대기 중"}
                                </div>
                                <button
                                    onClick={useGeneratedVideo}
                                    disabled={!generatedVideoUrl}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition ${
                                        generatedVideoUrl
                                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    }`}
                                >
                                    <Check size={16} className="mr-2"/>
                                    이 영상을 업로드 폼으로 가져오기
                                </button>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminVideoPage;
