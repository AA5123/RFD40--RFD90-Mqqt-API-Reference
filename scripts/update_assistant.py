#!/usr/bin/env python3
"""
update_assistant.py
-------------------
Run after generate_openapi_tags_md.py when your docs change.
Updates the OpenAI Assistant with the latest openapi_md.json.
Usage:
   python scripts/generate_openapi_tags_md.py
   python scripts/update_assistant.py
"""
import os
import time
from pathlib import Path
try:
   from openai import OpenAI
except ImportError:
   print("ERROR: pip install -r requirements.txt")
   exit(1)
try:
   from dotenv import load_dotenv, set_key
except ImportError:
   print("ERROR: pip install -r requirements.txt")
   exit(1)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ENV_PATH = PROJECT_ROOT / ".env"
DOCS_DIR = PROJECT_ROOT / "docs"
OPENAPI_PATH = DOCS_DIR / "openapi_md.json"

def main():
   print("=" * 60)
   print("  RFD40 / RFD90 API Assistant — Update")
   print("=" * 60)
   # Load .env
   load_dotenv(ENV_PATH)
   api_key = os.getenv("OPENAI_API_KEY", "").strip()
   assistant_id = os.getenv("OPENAI_ASSISTANT_ID", "").strip()
   old_file_id = os.getenv("OPENAI_FILE_ID", "").strip()
   vector_store_id = os.getenv("OPENAI_VECTOR_STORE_ID", "").strip()
   if not api_key:
       print("  ERROR: OPENAI_API_KEY not set in .env")
       exit(1)
   if not assistant_id:
       print("  ERROR: OPENAI_ASSISTANT_ID not set.")
       print("  Run: python scripts/setup_assistant.py first")
       exit(1)
   if not OPENAPI_PATH.exists():
       print(f"  ERROR: {OPENAPI_PATH} not found.")
       print("  Run: python scripts/generate_openapi_tags_md.py first")
       exit(1)
   client = OpenAI(api_key=api_key)
   # ── Step 1: Upload new file ───────────────────────────────────
   print(f"\n[1/3] Uploading updated openapi_md.json...")
   file_size = OPENAPI_PATH.stat().st_size / 1024
   print(f"      File size: {file_size:.1f} KB")
   with open(OPENAPI_PATH, "rb") as f:
       file_response = client.files.create(
           file=(OPENAPI_PATH.name, f, "application/json"),
           purpose="assistants"
       )
   new_file_id = file_response.id
   print(f"      New File ID: {new_file_id}")
   # ── Step 2: Update Vector Store ───────────────────────────────
   print(f"\n[2/3] Updating Vector Store...")
   # Add new file
   client.beta.vector_stores.files.create(
       vector_store_id=vector_store_id,
       file_id=new_file_id
   )
   print(f"      New file added to vector store")
   # Remove old file
   if old_file_id:
       try:
           client.beta.vector_stores.files.delete(
               vector_store_id=vector_store_id,
               file_id=old_file_id
           )
           client.files.delete(old_file_id)
           print(f"      Old file removed: {old_file_id}")
       except Exception as e:
           print(f"      Warning: Could not remove old file: {e}")
   # Wait for indexing
   print(f"      Re-indexing", end="", flush=True)
   time.sleep(5)
   for _ in range(10):
       vs = client.beta.vector_stores.retrieve(vector_store_id)
       if vs.status == "completed":
           print(" done!")
           break
       print(".", end="", flush=True)
       time.sleep(3)
   else:
       print(" continuing...")
   # ── Step 3: Save new file ID ──────────────────────────────────
   print(f"\n[3/3] Saving to .env...")
   set_key(str(ENV_PATH), "OPENAI_FILE_ID", new_file_id)
   print(f"      Saved new File ID: {new_file_id}")
   print("\n" + "=" * 60)
   print("  Update Complete!")
   print("=" * 60)
   print(f"  Assistant ID    : {assistant_id}")
   print(f"  Vector Store ID : {vector_store_id}")
   print(f"  New File ID     : {new_file_id}")
   print("\n  Next step:")
   print("  python scripts/serve.py")
   print("=" * 60)

if __name__ == "__main__":
   main()