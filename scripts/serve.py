#!/usr/bin/env python3
"""
serve.py
--------
Reads .env, generates docs/config.json, serves docs/ folder.
Replaces: python -m http.server 8000
Usage:
   python scripts/serve.py
   python scripts/serve.py --port 3000
"""
import os
import json
import signal
import argparse
import http.server
import socketserver
from pathlib import Path
try:
   from dotenv import load_dotenv
except ImportError:
   print("ERROR: pip install -r requirements.txt")
   exit(1)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ENV_PATH = PROJECT_ROOT / ".env"
DOCS_DIR = PROJECT_ROOT / "docs"
CONFIG_PATH = DOCS_DIR / "config.json"

def generate_config():
   """Read .env and write docs/config.json."""
   load_dotenv(ENV_PATH)
   api_key = os.getenv("OPENAI_API_KEY", "").strip()
   assistant_id = os.getenv("OPENAI_ASSISTANT_ID", "").strip()
   warnings = []
   if not api_key or api_key == "sk-your-key-here":
       warnings.append("OPENAI_API_KEY not set")
   if not assistant_id:
       warnings.append("OPENAI_ASSISTANT_ID not set — run setup_assistant.py first")
   config = {
       "apiKey": api_key,
       "assistantId": assistant_id
   }
   with open(CONFIG_PATH, "w", encoding="utf-8") as f:
       json.dump(config, f)
   return warnings

def cleanup():
   """Remove config.json on exit."""
   if CONFIG_PATH.exists():
       CONFIG_PATH.unlink()
       print("\n  Config cleaned up.")

def main():
   parser = argparse.ArgumentParser()
   parser.add_argument("--port", type=int, default=8000, help="Port to serve on")
   args = parser.parse_args()
   print("=" * 60)
   print("  RFD40 / RFD90 API Reference Server")
   print("=" * 60)
   # Generate config
   print("\n[1/2] Reading .env and generating config...")
   warnings = generate_config()
   if warnings:
       for w in warnings:
           print(f"  WARNING: {w}")
       print("\n  API docs will load but chatbot may not work.")
   else:
       print("  Config generated — API key and Assistant ID ready")
   # Start server
   print(f"\n[2/2] Starting server on port {args.port}...")
   os.chdir(DOCS_DIR)
   class QuietHandler(http.server.SimpleHTTPRequestHandler):
       def log_message(self, format, *args):
           # Only log errors
           if args and str(args[1]) not in ('200', '304'):
               super().log_message(format, *args)
   # Handle Ctrl+C
   def handle_exit(sig, frame):
       cleanup()
       exit(0)
   signal.signal(signal.SIGINT, handle_exit)
   with socketserver.TCPServer(("", args.port), QuietHandler) as httpd:
       httpd.allow_reuse_address = True
       print(f"\n{'=' * 60}")
       print(f"  Server        : http://localhost:{args.port}")
       print(f"  API Docs      : http://localhost:{args.port}/index.html")
       print(f"  Chatbot       : Click 💬 bubble on the page")
       print(f"  Stop server   : Ctrl+C")
       print(f"{'=' * 60}\n")
       httpd.serve_forever()

if __name__ == "__main__":
   main()