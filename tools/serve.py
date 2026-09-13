#!/usr/bin/env python3
"""Local preview that sends the same response headers as production.

Vercel applies the `headers` in vercel.json; `python3 -m http.server` does not, so a
Content-Security-Policy mistake would only show up after deploy. This server reads
vercel.json and attaches those headers to every response, so CSP violations appear in the
browser console *before* pushing.

Usage:  python3 tools/serve.py [port]      (default 8932; serves the repo root, not dist/)
"""
import http.server, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8932

with open(os.path.join(ROOT, "vercel.json"), encoding="utf-8") as f:
    RULES = json.load(f).get("headers", [])

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)
    def end_headers(self):
        for rule in RULES:                      # only "/(.*)" is used today; match everything
            for h in rule.get("headers", []):
                self.send_header(h["key"], h["value"])
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, fmt, *args):          # quieter
        if "GET" in fmt % args and " 200 " in fmt % args: return
        super().log_message(fmt, *args)

print(f"serving {ROOT} on http://localhost:{PORT} with {sum(len(r['headers']) for r in RULES)} production headers")
http.server.ThreadingHTTPServer(("", PORT), H).serve_forever()
