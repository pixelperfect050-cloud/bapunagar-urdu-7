import urllib.request
import re

url = "https://www.youtube.com/@asifali081"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    m = re.search(r'"channelId":"(UC[^"]+)"', html)
    if m:
        print("CHANNEL_ID:" + m.group(1))
    else:
        print("Not found")
except Exception as e:
    print(e)
