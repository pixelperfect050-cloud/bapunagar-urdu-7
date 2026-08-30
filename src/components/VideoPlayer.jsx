import { useState } from 'react';
import { Play } from 'lucide-react';
import './VideoPlayer.css';

export default function VideoPlayer({ videoId, title }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // High quality thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="video-card card">
      <div className="video-wrapper">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <div 
            className="video-facade" 
            onClick={() => setIsPlaying(true)}
            role="button"
            tabIndex={0}
            aria-label={`Play video: ${title}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsPlaying(true); }}
          >
            <img 
              src={thumbnailUrl} 
              alt={title || "Video thumbnail"} 
              loading="lazy" 
              className="video-thumbnail"
            />
            <div className="play-button-overlay">
              <div className="play-circle">
                <Play size={28} className="play-icon" />
              </div>
            </div>
            <span className="watch-badge">Watch on YouTube</span>
          </div>
        )}
      </div>
      {title && (
        <div className="video-info">
          <h3 title={title}>{title}</h3>
        </div>
      )}
    </div>
  );
}
