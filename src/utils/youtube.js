import mediaData from '../data/media.json';

const CHANNEL_ID = 'UCmu2AT_q6UtiQowTDlIY0-Q';

/**
 * Parses YouTube XML RSS feed into an array of video objects
 */
export function parseYouTubeRss(xmlText) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = xmlDoc.getElementsByTagName('entry');
    const videos = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const videoIdEl = entry.getElementsByTagName('yt:videoId')[0] || entry.getElementsByTagName('videoId')[0];
      const titleEl = entry.getElementsByTagName('title')[0];
      const publishedEl = entry.getElementsByTagName('published')[0];

      if (videoIdEl && videoIdEl.textContent) {
        videos.push({
          id: videoIdEl.textContent.trim(),
          youtubeId: videoIdEl.textContent.trim(),
          title: titleEl ? titleEl.textContent.trim() : 'School Activity Video',
          publishedAt: publishedEl ? publishedEl.textContent.trim() : null
        });
      }
    }

    return videos;
  } catch (err) {
    console.debug('Error parsing YouTube RSS:', err?.message);
    return [];
  }
}

/**
 * Fetch live latest videos from YouTube channel and merge with catalog
 */
export async function fetchLiveVideos() {
  const bundledVideos = mediaData.videos || [];
  let liveVideos = [];

  // 1. Try Vercel API /api/videos
  try {
    const res = await fetch('/api/videos', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.videos)) {
        liveVideos = data.videos;
      }
    }
  } catch (err) {
    console.debug('Direct /api/videos skipped:', err?.message);
  }

  // 2. If no live videos from API, try CORS proxy with YouTube RSS feed
  if (liveVideos.length === 0) {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(7000) });
      if (res.ok) {
        const xmlText = await res.text();
        liveVideos = parseYouTubeRss(xmlText);
      }
    } catch (err) {
      console.debug('Proxy RSS fetch skipped:', err?.message);
    }
  }

  // Merge live videos at the top if there are any new ones not yet in media.json
  if (liveVideos.length > 0) {
    const existingIds = new Set(bundledVideos.map((v) => v.youtubeId));
    const newUploads = liveVideos.filter((v) => !existingIds.has(v.youtubeId));

    if (newUploads.length > 0) {
      return [...newUploads, ...bundledVideos];
    }
  }

  return bundledVideos;
}
