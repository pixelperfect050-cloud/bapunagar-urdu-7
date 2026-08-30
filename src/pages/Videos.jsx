import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import mediaData from '../data/media.json';
import { fetchLiveVideos } from '../utils/youtube';
import VideoPlayer from '../components/VideoPlayer';
import { PlaySquare, Search, Film, Loader2, Sparkles } from 'lucide-react';
import './Videos.css';

const BATCH_SIZE = 12;

export default function Videos() {
  const [allVideos, setAllVideos] = useState(() => mediaData.videos || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTriggerRef = useRef(null);

  // Automatically check YouTube for newly uploaded videos on mount
  useEffect(() => {
    let ignore = false;
    async function loadLatest() {
      try {
        const mergedVideos = await fetchLiveVideos();
        if (!ignore && mergedVideos && mergedVideos.length > 0) {
          setAllVideos(mergedVideos);
        }
      } catch (err) {
        console.debug('Live video sync fallback:', err?.message);
      }
    }
    loadLatest();
    return () => {
      ignore = true;
    };
  }, []);

  // Filtered videos based on search
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return allVideos;
    const q = searchQuery.toLowerCase().trim();
    return allVideos.filter((v) => v.title.toLowerCase().includes(q));
  }, [allVideos, searchQuery]);

  // Sliced visible videos
  const visibleVideos = useMemo(() => {
    return filteredVideos.slice(0, visibleCount);
  }, [filteredVideos, visibleCount]);

  const hasMore = visibleCount < filteredVideos.length;

  // Load next batch
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredVideos.length));
      setIsLoadingMore(false);
    }, 200);
  }, [hasMore, isLoadingMore, filteredVideos.length]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(BATCH_SIZE);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setVisibleCount(BATCH_SIZE);
  };

  // Infinite scroll observer: triggers load more when reaching the bottom
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '300px' }
    );

    const currentTrigger = loadMoreTriggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) observer.unobserve(currentTrigger);
    };
  }, [hasMore, handleLoadMore]);

  return (
    <div className="videos-page fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <span className="channel-tag">
            <Film size={16} /> Official Video Channel
          </span>
          <h1>School Video Highlights</h1>
          <p>
            Explore all {allVideos.length} activities, annual functions, competitions, and educational videos.
          </p>
        </div>
      </div>

      <div className="container section">
        {/* YouTube Channel Banner */}
        <div className="channel-link-banner">
          <PlaySquare size={36} className="youtube-icon" />
          <div className="banner-text">
            <h2>Bapunagar Urdu School No. 7 Channel</h2>
            <p>
              Subscribe to our YouTube channel <strong>@asifali081</strong> to get instant updates on new videos and school events.
            </p>
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

        {/* Search and Stats Bar */}
        <div className="videos-control-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search videos by title or event..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </div>

          <div className="videos-count-stat">
            <Sparkles size={16} color="var(--accent)" />
            <span>
              Showing <strong>{visibleVideos.length}</strong> of <strong>{filteredVideos.length}</strong> videos
            </span>
          </div>
        </div>

        {/* Videos Grid */}
        {visibleVideos.length > 0 ? (
          <div className="videos-grid">
            {visibleVideos.map((video) => (
              <VideoPlayer
                key={video.id || video.youtubeId}
                videoId={video.youtubeId}
                title={video.title}
              />
            ))}
          </div>
        ) : (
          <div className="no-videos-found">
            <Search size={40} className="empty-search-icon" />
            <h3>No videos found</h3>
            <p>No videos matched "{searchQuery}". Try searching with different keywords.</p>
          </div>
        )}

        {/* Infinite Scroll Trigger & Load More */}
        {hasMore && (
          <div ref={loadMoreTriggerRef} className="load-more-container">
            <button
              className="btn-load-more"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Loading more videos...
                </>
              ) : (
                `Load More Videos (${filteredVideos.length - visibleCount} remaining)`
              )}
            </button>
          </div>
        )}

        {/* End of list reached */}
        {!hasMore && filteredVideos.length > 0 && (
          <div className="end-of-videos-notice">
            <span>✨ You have viewed all {filteredVideos.length} videos ✨</span>
          </div>
        )}
      </div>
    </div>
  );
}
