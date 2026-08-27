import './VideoPlayer.css';

export default function VideoPlayer({ videoId, title }) {
  return (
    <div className="video-card card">
      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      {title && (
        <div className="video-info">
          <h3>{title}</h3>
        </div>
      )}
    </div>
  );
}
