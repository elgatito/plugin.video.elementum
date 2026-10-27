import io
import os
import re
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'resources', 'site-packages'))


def cleanup_settings():
    # Kodi auto-names id-less legacy settings labelN/actionN, and its counter grows on every settings reload, so stale ids pile up in user settings (#1208).
    # Must run before the first xbmcaddon.Addon() loads the values, otherwise they are saved back.
    try:
        from xbmcvfs import translatePath
    except ImportError:
        from xbmc import translatePath

    path = translatePath('special://profile/addon_data/plugin.video.elementum/settings.xml')
    try:
        with io.open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        cleaned = re.sub(r'[ \t]*<setting id="(?:label|action)\d+"[^>]*?(?:/>|>[^<]*</setting>)[ \t]*\r?\n?', '', content)
        if cleaned != content:
            with io.open(path, 'w', encoding='utf-8') as f:
                f.write(cleaned)
    except Exception:
        pass


cleanup_settings()

from elementum import service, config  # noqa: E402

config.init()
service.run()
