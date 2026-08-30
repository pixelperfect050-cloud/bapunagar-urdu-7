import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import './Lightbox.css';

export default function Lightbox({
  photo,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCount
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close image modal"
        >
          <X size={24} />
        </button>

        {onPrev && totalCount > 1 && (
          <button
            className="lightbox-nav-btn prev-btn"
            onClick={onPrev}
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div className="lightbox-image-container">
          <img
            src={photo.fullUrl || photo.url}
            alt={photo.title || 'School Photo'}
            className="lightbox-img"
          />
        </div>

        {onNext && totalCount > 1 && (
          <button
            className="lightbox-nav-btn next-btn"
            onClick={onNext}
            aria-label="Next photo"
          >
            <ChevronRight size={32} />
          </button>
        )}

        <div className="lightbox-footer">
          <div className="lightbox-info">
            <h3 className="lightbox-title">{photo.title || 'School Activity'}</h3>
            {photo.albumTitle && (
              <span className="lightbox-album-badge">{photo.albumTitle}</span>
            )}
          </div>

          <div className="lightbox-meta">
            {totalCount > 1 && (
              <span className="lightbox-counter">
                {currentIndex + 1} / {totalCount}
              </span>
            )}
            {photo.viewerUrl && (
              <a
                href={photo.viewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lightbox-external-link"
                title="Open original on ImgBB"
              >
                <ExternalLink size={16} /> ImgBB
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
