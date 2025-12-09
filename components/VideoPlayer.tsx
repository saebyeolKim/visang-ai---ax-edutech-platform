import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  onPlay?: () => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = false,
  className = '',
  onPlay,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {});
    }
  }, [src, autoPlay]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        controls
        onPlay={onPlay}
        onEnded={onEnded}          
      />

      {/* bottom gradient only */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default VideoPlayer;
