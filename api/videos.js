export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const channelId = 'UCmu2AT_q6UtiQowTDlIY0-Q';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `YouTube RSS returned status ${response.status}` });
    }

    const xmlText = await response.text();

    // Parse entries from XML
    const entryMatches = [...xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    const latestVideos = [];

    for (const match of entryMatches) {
      const entryContent = match[1];
      const videoIdMatch = entryContent.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entryContent.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/);

      if (videoIdMatch && videoIdMatch[1]) {
        latestVideos.push({
          id: videoIdMatch[1],
          youtubeId: videoIdMatch[1],
          title: titleMatch ? titleMatch[1].trim() : 'School Activity Video',
          publishedAt: publishedMatch ? publishedMatch[1] : null
        });
      }
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({
      channelId,
      count: latestVideos.length,
      videos: latestVideos
    });
  } catch (error) {
    console.error('Server error fetching YouTube RSS:', error);
    return res.status(500).json({ error: 'Failed to fetch YouTube videos', details: error.message });
  }
}
