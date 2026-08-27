import mediaData from '../data/media.json';
import VideoPlayer from '../components/VideoPlayer';
import { PlaySquare } from 'lucide-react';
import './Videos.css';

export default function Videos() {
  const { videos } = mediaData;

  return (
    <div className="videos-page fade-in">
      <div className="page-header">
        <div className="container">
          <h1>Video Highlights</h1>
          <p>Watch the latest activities, events, and educational content.</p>
        </div>
      </div>

      <div className="container section">
        <div className="channel-link-banner">
          <PlaySquare size={32} className="youtube-icon" />
          <div className="banner-text">
            <h2>Want to see more?</h2>
            <p>Subscribe to our official YouTube channel for all updates.</p>
          </div>
          <a 
            href="https://www.youtube.com/@asifali081" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Visit Channel
          </a>
        </div>

        <div className="videos-grid">
          {videos.map((video) => (
            <VideoPlayer 
              key={video.id} 
              videoId={video.youtubeId} 
              title={video.title} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
