import mediaData from '../data/media.json';

// In-memory cache to avoid duplicate network requests
const albumCache = new Map();

/**
 * Parses raw HTML of an ImgBB album page and extracts images from data-object attributes
 */
export function parseImgbbHtml(html, fallbackTitle = '') {
  try {
    const objectMatches = [...html.matchAll(/data-object=['"]([^'"]+)['"]/g)];
    const photos = [];

    for (const match of objectMatches) {
      try {
        const decoded = decodeURIComponent(match[1]);
        const data = JSON.parse(decoded);

        const imgUrl =
          data.display_url ||
          (data.medium && data.medium.url) ||
          (data.image && data.image.url) ||
          (data.thumb && data.thumb.url);
        const fullUrl = (data.image && data.image.url) || imgUrl;
        const thumbUrl = (data.thumb && data.thumb.url) || imgUrl;
        const rawTitle = data.title || data.name || '';
        const cleanTitle = rawTitle.replace(/[_-]/g, ' ').trim();

        photos.push({
          id: data.id_encoded || `img_${photos.length}`,
          title: cleanTitle ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1) : fallbackTitle,
          url: imgUrl,
          fullUrl: fullUrl,
          thumbUrl: thumbUrl,
          viewerUrl: data.url_viewer || '',
          width: data.width,
          height: data.height
        });
      } catch (err) {
        console.error('Error parsing data-object:', err);
      }
    }
    return photos;
  } catch (e) {
    console.error('Error parsing ImgBB HTML:', e);
    return [];
  }
}

/**
 * Fetch live photos for a given album ID with newest photos first
 */
export async function fetchLiveAlbum(albumId, forceRefresh = false) {
  if (!albumId) return null;

  if (!forceRefresh && albumCache.has(albumId)) {
    return albumCache.get(albumId);
  }

  // 1. Try Vercel Serverless Function /api/album
  try {
    const res = await fetch(`/api/album?id=${albumId}`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.photos)) {
        albumCache.set(albumId, data.photos);
        return data.photos;
      }
    }
  } catch (err) {
    console.debug(`Direct API fetch skipped for album ${albumId}:`, err?.message);
  }

  // 2. Try AllOrigins CORS proxy with sort=date_desc
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://ibb.co/album/${albumId}?sort=date_desc`)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const html = await res.text();
      const photos = parseImgbbHtml(html);
      if (photos.length > 0) {
        albumCache.set(albumId, photos);
        return photos;
      }
    }
  } catch (err) {
    console.debug(`Proxy fetch skipped for album ${albumId}:`, err?.message);
  }

  // 3. Fallback to bundled media.json album
  const bundledAlbum = (mediaData.albums || []).find((a) => a.id === albumId);
  if (bundledAlbum && bundledAlbum.photos) {
    return bundledAlbum.photos;
  }

  return [];
}
