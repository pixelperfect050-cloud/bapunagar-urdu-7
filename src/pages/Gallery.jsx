import { useState, useEffect, useCallback } from 'react';
import mediaData from '../data/media.json';
import { fetchLiveAlbum } from '../utils/imgbb';
import Lightbox from '../components/Lightbox';
import {
  Folder,
  Image as ImageIcon,
  ArrowLeft,
  Maximize2
} from 'lucide-react';
import './Gallery.css';

// Dynamically import any local images placed in src/assets/images/
const localImageModules = import.meta.glob(
  '../assets/images/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,WEBP,gif,GIF}',
  { eager: true }
);

export default function Gallery() {
  // Initialize state with bundled albums
  const [albums, setAlbums] = useState(() => mediaData.albums || []);
  const [selectedAlbumKey, setSelectedAlbumKey] = useState(null); // null = overview, 'all' = all photos, or album.key

  // Lightbox state
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [activePhotosList, setActivePhotosList] = useState([]);

  // Local photos
  const localPhotos = Object.keys(localImageModules).map((path, index) => {
    const filename = path.split('/').pop().replace(/\.[^/.]+$/, '');
    const title = filename
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      id: `local-${index}`,
      url: localImageModules[path].default || localImageModules[path],
      fullUrl: localImageModules[path].default || localImageModules[path],
      title: title,
      albumKey: 'local',
      albumTitle: 'Local Uploads'
    };
  });

  // Automatically sync live albums from ImgBB in the background
  const syncAlbums = useCallback(async (force = false) => {
    try {
      const initialAlbums = mediaData.albums || [];
      const updatedAlbums = await Promise.all(
        initialAlbums.map(async (album) => {
          if (!album.id) return album;
          try {
            const livePhotos = await fetchLiveAlbum(album.id, force);
            if (livePhotos && livePhotos.length > 0) {
              return {
                ...album,
                photos: livePhotos,
                photoCount: livePhotos.length,
                coverImage: livePhotos[0].url || album.coverImage
              };
            }
          } catch (err) {
            console.warn(`Could not sync album ${album.title}:`, err);
          }
          return album;
        })
      );
      setAlbums(updatedAlbums);
    } catch (e) {
      console.error('Error syncing albums:', e);
    }
  }, []);

  // Sync on initial mount
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await syncAlbums(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [syncAlbums]);

  // Compute all photos combined
  const allPhotos = [
    ...localPhotos,
    ...albums.flatMap((a) =>
      (a.photos || []).map((p) => ({
        ...p,
        albumKey: a.key,
        albumTitle: a.title
      }))
    )
  ];

  // Current selected album object
  const currentAlbum = albums.find((a) => a.key === selectedAlbumKey);

  // Photos to show based on selected view
  let displayedPhotos = [];
  if (selectedAlbumKey === 'all') {
    displayedPhotos = allPhotos;
  } else if (currentAlbum) {
    displayedPhotos = currentAlbum.photos || [];
  }

  // Handle open lightbox
  const openLightbox = (photo, list) => {
    const idx = list.findIndex((p) => p.id === photo.id);
    setActivePhotosList(list);
    setActivePhotoIndex(idx >= 0 ? idx : 0);
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null && activePhotosList.length > 0) {
      setActivePhotoIndex((prev) => (prev + 1) % activePhotosList.length);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null && activePhotosList.length > 0) {
      setActivePhotoIndex((prev) =>
        prev === 0 ? activePhotosList.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="gallery-page fade-in">
      {/* Header Banner */}
      <div className="page-header">
        <div className="container">
          <h1>School Photo Gallery</h1>
          <p>
            A glimpse into the vibrant life, activities, and campus of Bapunagar Urdu 7.
          </p>
        </div>
      </div>

      <div className="container section">
        {/* Navigation Tabs */}
        <div className="gallery-toolbar">
          <div className="view-navigation">
            <button
              className={`view-tab-btn ${selectedAlbumKey === null ? 'active' : ''}`}
              onClick={() => setSelectedAlbumKey(null)}
            >
              <Folder size={18} /> Album Folders ({albums.length})
            </button>
            <button
              className={`view-tab-btn ${selectedAlbumKey === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedAlbumKey('all')}
            >
              <ImageIcon size={18} /> All Photos ({allPhotos.length})
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW VIEW: 6 Album Folders */}
        {selectedAlbumKey === null && (
          <div className="albums-container">
            <div className="albums-grid">
              {albums.map((album) => {
                const count = album.photos ? album.photos.length : album.photoCount || 0;
                return (
                  <div 
                    key={album.id} 
                    className="album-card card"
                    onClick={() => setSelectedAlbumKey(album.key)}
                  >
                    <div className="album-cover-wrapper">
                      <img
                        src={album.coverImage || album.defaultCover}
                        alt={album.title}
                        loading="lazy"
                      />
                      <div className="album-badge">
                        <ImageIcon size={14} /> {count} {count === 1 ? 'Photo' : 'Photos'}
                      </div>
                      <div className="album-hover-overlay">
                        <span className="btn-explore">Open Folder</span>
                      </div>
                    </div>

                    <div className="album-details">
                      <div className="album-title-row">
                        <h3>{album.title}</h3>
                      </div>
                      <p className="album-desc">{album.description}</p>

                      <div className="album-card-footer">
                        <button
                          className="btn-view-folder"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlbumKey(album.key);
                          }}
                        >
                          <Folder size={16} /> View {count} Photos
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SPECIFIC ALBUM VIEW */}
        {selectedAlbumKey !== null && currentAlbum && (
          <div className="single-album-view">
            {/* Album Header */}
            <div className="album-view-header">
              <button
                className="btn-back"
                onClick={() => setSelectedAlbumKey(null)}
              >
                <ArrowLeft size={18} /> Back to All Albums
              </button>

              <div className="album-header-meta">
                <div className="album-header-title-box">
                  <h2>{currentAlbum.title}</h2>
                  <span className="album-photos-count">
                    {displayedPhotos.length} {displayedPhotos.length === 1 ? 'Photo' : 'Photos'}
                  </span>
                </div>
                <p className="album-header-desc">{currentAlbum.description}</p>
              </div>
            </div>

            {/* Photos Grid */}
            {displayedPhotos.length > 0 ? (
              <div className="photos-grid">
                {displayedPhotos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    className="photo-card card"
                    onClick={() => openLightbox(photo, displayedPhotos)}
                  >
                    <div className="photo-image-wrapper">
                      <img
                        src={photo.url}
                        alt={photo.title || currentAlbum.title}
                        loading="lazy"
                      />
                      <div className="photo-hover-overlay">
                        <Maximize2 size={24} className="zoom-icon" />
                      </div>
                      <span className="photo-number-tag">#{idx + 1}</span>
                    </div>
                    {photo.title && (
                      <div className="photo-caption">
                        <span className="photo-caption-title">{photo.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-album-notice">
                <ImageIcon size={48} className="empty-icon" />
                <h3>No photos added yet</h3>
                <p>
                  Photos added to the <strong>{currentAlbum.title}</strong> album will automatically appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. ALL PHOTOS STREAM VIEW */}
        {selectedAlbumKey === 'all' && (
          <div className="all-photos-view">
            <div className="filter-chips-bar">
              <span className="filter-label">Filter by Folder:</span>
              <button
                className={`filter-chip ${selectedAlbumKey === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedAlbumKey('all')}
              >
                All ({allPhotos.length})
              </button>
              {albums.map((alb) => (
                <button
                  key={alb.key}
                  className={`filter-chip ${selectedAlbumKey === alb.key ? 'active' : ''}`}
                  onClick={() => setSelectedAlbumKey(alb.key)}
                >
                  {alb.title} ({alb.photos ? alb.photos.length : 0})
                </button>
              ))}
            </div>

            <div className="photos-grid">
              {displayedPhotos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="photo-card card"
                  onClick={() => openLightbox(photo, displayedPhotos)}
                >
                  <div className="photo-image-wrapper">
                    <img
                      src={photo.url}
                      alt={photo.title || 'School Photo'}
                      loading="lazy"
                    />
                    <div className="photo-hover-overlay">
                      <Maximize2 size={24} className="zoom-icon" />
                    </div>
                    {photo.albumTitle && (
                      <span className="photo-album-tag">{photo.albumTitle}</span>
                    )}
                  </div>
                  {photo.title && (
                    <div className="photo-caption">
                      <span className="photo-caption-title">{photo.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Lightbox Modal */}
      {activePhotoIndex !== null && (
        <Lightbox
          photo={activePhotosList[activePhotoIndex]}
          currentIndex={activePhotoIndex}
          totalCount={activePhotosList.length}
          onClose={() => setActivePhotoIndex(null)}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
        />
      )}
    </div>
  );
}
