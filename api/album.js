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

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Album ID is required' });
  }

  // Use sort=date_desc so newly added photos appear at the top first
  const albumUrl = `https://ibb.co/album/${id}?sort=date_desc`;

  try {
    const response = await fetch(albumUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `ImgBB returned status ${response.status}` });
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1].replace('— ImgBB', '').trim() : '';

    // Extract data-object JSON payloads
    const objectMatches = [...html.matchAll(/data-object=['"]([^'"]+)['"]/g)];
    const photos = [];

    for (const match of objectMatches) {
      try {
        const decoded = decodeURIComponent(match[1]);
        const data = JSON.parse(decoded);

        const imgUrl = data.display_url || (data.medium && data.medium.url) || (data.image && data.image.url) || (data.thumb && data.thumb.url);
        const fullUrl = (data.image && data.image.url) || imgUrl;
        const thumbUrl = (data.thumb && data.thumb.url) || imgUrl;
        const rawTitle = data.title || data.name || '';
        const cleanTitle = rawTitle.replace(/[_-]/g, ' ').trim();

        photos.push({
          id: data.id_encoded || `img_${photos.length}`,
          title: cleanTitle ? (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)) : title,
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

    // Set cache headers (cache for 60 seconds on CDN)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      albumId: id,
      albumUrl,
      title,
      photoCount: photos.length,
      photos
    });
  } catch (error) {
    console.error('Server error fetching album:', error);
    return res.status(500).json({ error: 'Failed to fetch album', details: error.message });
  }
}
