import mediaData from '../data/media.json';
import './Gallery.css';

// Dynamically import all images from src/assets/images/
const localImageModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,WEBP,gif,GIF}', { eager: true });

export default function Gallery() {
  // Convert local images to photo objects
  const localPhotos = Object.keys(localImageModules).map((path, index) => {
    // Extract filename without extension (e.g., "Science_Fair_2025")
    const filename = path.split('/').pop().replace(/\.[^/.]+$/, "");
    // Format Title: convert underscores/hyphens to spaces and capitalize words
    const title = filename
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    return {
      id: `local-${index}`,
      url: localImageModules[path].default || localImageModules[path],
      title: title,
      description: "School Activity Photo"
    };
  });

  // If local photos folder has images, show them; otherwise fallback to default placeholder photos
  const photos = localPhotos.length > 0 ? localPhotos : mediaData.photos;

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
