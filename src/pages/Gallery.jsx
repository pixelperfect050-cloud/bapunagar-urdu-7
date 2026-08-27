import mediaData from '../data/media.json';
import './Gallery.css';

export default function Gallery() {
  const { photos } = mediaData;

  return (
    <div className="gallery-page fade-in">
      <div className="page-header">
        <div className="container">
          <h1>School Gallery</h1>
          <p>A glimpse into the vibrant life at Bapunagar Urdu 7.</p>
        </div>
      </div>

      <div className="container section">
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="gallery-item card">
              <div className="gallery-image-wrapper">
                <img src={photo.url} alt={photo.title} loading="lazy" />
              </div>
              <div className="gallery-info">
                <h3>{photo.title}</h3>
                {photo.description && <p>{photo.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
