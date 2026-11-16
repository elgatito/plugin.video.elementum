# Run: python3 -I tests/test_settings_file.py   (no Kodi needed: settings_file.py imports Kodi modules lazily)
import importlib.util
import json
import os
import stat
import sys
import tempfile
import textwrap
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    "settings_file", os.path.join(HERE, "..", "resources", "site-packages", "elementum", "settings_file.py"))
sf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sf)

XML = textwrap.dedent("""\
    <settings><category>
    <setting label="1" type="lsep" />
    <setting id="b_on" type="bool" default="true" />
    <setting id="b_off" type="bool" />
    <setting id="n" type="number" />
    <setting id="n_bad" type="number" />
    <setting id="e" type="enum" />
    <setting id="s_int" type="slider" option="int" />
    <setting id="s_pct" type="slider" option="percent" />
    <setting id="s_f" type="slider" option="float" />
    <setting id="t" type="text" />
    <setting id="language" type="text" />
    <setting id="second_language" type="text" />
    <setting id="download_path" type="folder" />
    <setting id="completed_movies_path" type="folder" />
    <setting id="trakt_token" type="text" />
    <setting id="trakt_token_expiry" type="text" />
    <setting id="trakt_username" type="text" />
    </category></settings>""")
VALUES = {"b_on": "true", "b_off": "false", "n": "42", "n_bad": "x", "e": "3", "s_int": "7.0", "s_pct": "50.0",
          "s_f": "1.5", "t": "hi", "language": "German | de", "download_path": "special://temp/dl/",
          "completed_movies_path": "", "trakt_token": "SECRET"}


class T(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()
        os.makedirs(os.path.join(self.d, "resources"))
        with open(os.path.join(self.d, "resources", "settings.xml"), "w") as f:
            f.write(XML)

    def lang(self, kind, region):
        return {("iso", True): "en-US", ("iso", False): "en", ("english", False): "English"}.get((kind, region), "")

    def bundle(self, existing=None, setter=None, baseline=None):
        tr = lambda p: p.replace("special://temp", self.d + "/tmp").replace("special://", self.d + "/")
        info = lambda k: {"id": "plugin.video.elementum", "profile": "special://profile/x/"}.get(k, "v-" + k)
        return sf.build_bundle(self.d, info, {"os": "linux", "arch": "x64", "kodi": 21, "build": "b", "version": ""},
                               tr, lambda k: VALUES.get(k, ""), lambda kind, region: self.lang(kind, region), existing, setter, baseline)

    def test_types(self):
        s = self.bundle()["Settings"]
        self.assertIs(s["b_on"], True)
        self.assertIs(s["b_off"], False)
        self.assertEqual((s["n"], s["n_bad"], s["e"], s["s_int"], s["s_pct"], s["s_f"]), (42, 0, 3, 7, 50, 1.5))
        self.assertEqual(s["t"], "hi")
        self.assertEqual(s["download_path"], self.d + "/tmp/dl/")
        self.assertEqual(s["completed_movies_path"], "")
        self.assertEqual(s["trakt_token"], "SECRET")
        self.assertNotIn(None, s)

    def test_bundle_shape(self):
        b = self.bundle()
        self.assertEqual(sorted(b), ["Info", "InterfaceLanguage", "KodiBufferSize", "Language", "Platform", "Region", "SecondLanguage", "Settings", "Version"])
        self.assertEqual((b["Version"], b["Language"], b["SecondLanguage"], b["Region"]), (1, "de", "en", "US"))
        self.assertEqual(b["Info"]["ID"], "plugin.video.elementum")
        self.assertEqual(b["Info"]["Path"], self.d)
        self.assertEqual(b["Info"]["TempPath"], self.d + "/tmp/elementum")
        self.assertEqual(b["Platform"], {"OS": "linux", "Arch": "x64", "Version": "", "Kodi": 21, "Build": "b"})
        self.assertTrue(os.path.isdir(self.d + "/tmp/dl/"))

    def test_keep_newer_tokens(self):
        self.addCleanup(VALUES.update, trakt_token="SECRET")
        VALUES.update(trakt_token="old", trakt_token_expiry="100", trakt_username="u")
        base = {"trakt_token": "old", "trakt_token_expiry": 100, "trakt_username": "u"}
        run = lambda existing: (self.bundle(existing, lambda k, v: calls.append((k, v)), base)["Settings"])
        calls = []
        # refresh by the binary
        s = run({"trakt_token": "new", "trakt_token_expiry": 200, "trakt_username": "u"})
        self.assertEqual((s["trakt_token"], s["trakt_token_expiry"]), ("new", 200))
        self.assertIn(("trakt_token", "new"), calls)
        # deauth by the binary: empty token and expiry 0 must win
        calls[:] = []
        s = run({"trakt_token": "", "trakt_token_expiry": 0, "trakt_username": ""})
        self.assertEqual((s["trakt_token"], s["trakt_token_expiry"], s["trakt_username"]), ("", 0, ""))
        self.assertIn(("trakt_token_expiry", "0"), calls)
        # user change in Kodi: file equals baseline, Kodi wins, nothing pushed
        calls[:] = []
        VALUES["trakt_token"] = "kodi"
        s = run(dict(base))
        self.assertEqual(s["trakt_token"], "kodi")
        self.assertEqual(calls, [])

    def test_language(self):
        g = lambda kind, region: {("english", False): "Spanish (Mexico)", ("iso", False): "es", ("iso", True): "es-MX"}.get((kind, region), "")
        self.assertEqual((sf.kodi_language(g), sf.kodi_region(g)), ("es", "MX"))
        g = lambda kind, region: {("english", False): "German", ("iso", False): "de", ("iso", True): "de"}.get((kind, region), "")
        self.assertEqual((sf.kodi_language(g), sf.kodi_region(g)), ("de", "DE"))
        self.assertEqual((sf.kodi_language(lambda k, r: ""), sf.kodi_region(lambda k, r: "")), ("en", "US"))
        self.assertEqual(sf.kodi_interface_language(lambda kind, region: {("iso", True): "pt-BR"}.get((kind, region), "")), "pt-br")
        self.assertEqual(sf.kodi_interface_language(lambda kind, region: {("english", False): "German", ("iso", False): "de"}.get((kind, region), "")), "de")
        self.assertEqual(sf.kodi_interface_language(lambda k, r: ""), "en")

    def test_monitor_skips_write_for_writeback_only(self):
        import types
        stubs = {}
        for n in ("xbmc", "six", "six.moves", "elementum", "elementum.addon", "elementum.daemon", "elementum.logger", "elementum.config", "elementum.settings_file", "elementum.util"):
            stubs[n] = types.ModuleType(n)
        store = {}
        stubs["xbmc"].Monitor = type("Monitor", (), {"__init__": lambda self: None})
        stubs["six"].ensure_str = stubs["six"].ensure_binary = str
        opener = mock.Mock()
        stubs["six.moves"].urllib_request = mock.Mock(build_opener=lambda: opener)
        a = stubs["elementum.addon"]
        a.ADDON = mock.Mock(getSetting=lambda k: store.get(k, ""))
        a.ADDON_ID = "id"
        stubs["elementum.daemon"].shutdown = lambda: None
        stubs["elementum.logger"].log = mock.Mock()
        c = stubs["elementum.config"]
        c.init = lambda: None
        c.ELEMENTUMD_HOST = "h"
        c.ONLY_CLIENT = False
        stubs["elementum.util"].interface_language = lambda: "de"
        writes = []
        stubs["elementum.settings_file"].write_settings_file = lambda: writes.append(1)
        mspec = importlib.util.spec_from_file_location("mon", os.path.join(HERE, "..", "resources", "site-packages", "elementum", "monitor.py"))
        with mock.patch.dict(sys.modules, stubs):
            mon = importlib.util.module_from_spec(mspec)
            mspec.loader.exec_module(mon)
            m = mon.ElementumMonitor()
            store["trakt_token"] = "x"
            m.onSettingsChanged()
            self.assertEqual(writes, [])
            store["t"] = "y"  # not a write-back key: monitored values unchanged -> write + reload
            m.onSettingsChanged()
            self.assertEqual(writes, [1])

    def test_buffer_size(self):
        p = os.path.join(self.d, "as.xml")
        self.assertEqual(sf.kodi_buffer_size(p), 0)
        open(p, "w").write("<advancedsettings><cache><memorysize>1234</memorysize></cache></advancedsettings>")
        self.assertEqual(sf.kodi_buffer_size(p), 1234)

    def test_atomic_write(self):
        p = os.path.join(self.d, "settings.json")
        sf.write_atomic(p, {"a": 1})
        sf.write_atomic(p, {"a": 2})
        self.assertEqual(json.load(open(p)), {"a": 2})
        self.assertEqual(os.listdir(self.d).count("settings.json.tmp"), 0)
        if os.name != "nt":
            self.assertEqual(stat.S_IMODE(os.stat(p).st_mode), 0o600)
        with mock.patch.object(sf.os, "replace", side_effect=OSError("boom")):  # failure keeps the old file, drops the temp
            with self.assertRaises(OSError):
                sf.write_atomic(p, {"a": 3})
        self.assertEqual(json.load(open(p)), {"a": 2})
        self.assertFalse(os.path.exists(p + ".tmp"))

    def test_library_marker(self):
        for name, data, want in (("a.so", b"x" * (3 << 20) + b"..settings-file-v1.." + b"y" * 10, True), ("b.so", b"configPath" * 10, False)):
            p = os.path.join(self.d, name)
            with open(p, "wb") as f:
                f.write(data)
            self.assertIs(sf.library_supports_config_path(p), want)
        self.assertIs(sf.library_supports_config_path(os.path.join(self.d, "none.so")), False)

    def test_probe_timeout_not_cached(self):
        exe = os.path.join(self.d, "slow")
        with open(exe, "w") as f:
            f.write("#!/bin/sh\nexec sleep 30\n")
        os.chmod(exe, 0o755)
        real = sf.threading.Timer
        with mock.patch.object(sf.threading, "Timer", lambda t, fn: real(0.2, fn)):
            self.assertIs(sf.binary_supports_config_path(exe), False)
        self.assertEqual([k for k in sf._support if k[0] == exe], [])

    def test_support_detection(self):
        for name, text, want in (("new", "-configPath string\nsettings-file-v1", True), ("old", "-configPath string", False)):
            exe = os.path.join(self.d, name)
            with open(exe, "w") as f:
                f.write("#!/bin/sh\necho '%s'\n" % text)
            os.chmod(exe, 0o755)
            self.assertIs(sf.binary_supports_config_path(exe), want)
        self.assertIs(sf.binary_supports_config_path(os.path.join(self.d, "missing")), False)


if __name__ == "__main__":
    unittest.main()
