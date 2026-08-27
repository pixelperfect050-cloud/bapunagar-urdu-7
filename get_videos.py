import yt_dlp
import json

ydl_opts = {'extract_flat': 'in_playlist', 'playlist_items': '1-6'}
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info('https://www.youtube.com/playlist?list=UUmu2AT_q6UtiQowTDlIY0-Q', download=False)
    if 'entries' in info:
        videos = [{'id': e['id'], 'title': e['title']} for e in info['entries'] if e.get('id')]
        print("VIDEOS_JSON_RESULT:" + json.dumps(videos))
