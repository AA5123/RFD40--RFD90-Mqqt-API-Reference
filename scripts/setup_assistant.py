#!/usr/bin/env python3
"""
setup_assistant.py
------------------
Run ONCE to create the OpenAI Assistant with RAG (file_search).
What it does:
 1. Reads OPENAI_API_KEY from .env
 2. Uploads docs/openapi_md.json to OpenAI
 3. Creates a Vector Store and indexes the document
 4. Creates an Assistant with file_search tool
 5. Saves Assistant ID, Vector Store ID, File ID to .env
Usage:
   python scripts/setup_assistant.py
"""
import os
import time
from pathlib import Path
try:
   from openai import OpenAI
except ImportError:
   print("ERROR: openai not installed.")
   print("Run: pip install -r requirements.txt")
   exit(1)
try:
   from dotenv import load_dotenv, set_key
except ImportError:
   print("ERROR: python-dotenv not installed.")
   print("Run: pip install -r requirements.txt")
   exit(1)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ENV_PATH = PROJECT_ROOT / ".env"
DOCS_DIR = PROJECT_ROOT / "docs"
OPENAPI_PATH = DOCS_DIR / "openapi_md.json"

def check_prerequisites():
   """Check everything is ready before setup."""
   print("\n[0/4] Checking prerequisites...")
   # Check .env exists
   if not ENV_PATH.exists():
       print(f"  ERROR: .env file not found at {ENV_PATH}")
       print("  Create .env file with OPENAI_API_KEY=sk-your-key")
       exit(1)
   # Check openapi_md.json exists
   if not OPENAPI_PATH.exists():
       print(f"  ERROR: {OPENAPI_PATH} not found.")
       print("  Run: python scripts/generate_openapi_tags_md.py first")
       exit(1)
   print("  Prerequisites OK")

def main():
   print("=" * 60)
   print("  RFD40 / RFD90 API Assistant — Setup")
   print("=" * 60)
   check_prerequisites()
   # Load .env
   load_dotenv(ENV_PATH)
   api_key = os.getenv("OPENAI_API_KEY", "").strip()
   if not api_key or api_key == "sk-your-key-here":
       print("\n  ERROR: Please set OPENAI_API_KEY in .env file")
       exit(1)
   # Check if assistant already exists
   existing_id = os.getenv("OPENAI_ASSISTANT_ID", "").strip()
   if existing_id:
       print(f"\n  Existing Assistant found: {existing_id}")
       choice = input("  Create a new one? (y/n): ").strip().lower()
       if choice != 'y':
           print("\n  Keeping existing assistant.")
           print("  Run: python scripts/serve.py")
           return
   client = OpenAI(api_key=api_key)
   # ── Step 1: Upload file ──────────────────────────────────────
   print(f"\n[1/4] Uploading openapi_md.json to OpenAI...")
   file_size = OPENAPI_PATH.stat().st_size / 1024
   print(f"      File size: {file_size:.1f} KB")
   with open(OPENAPI_PATH, "rb") as f:
       file_response = client.files.create(
           file=(OPENAPI_PATH.name, f, "application/json"),
           purpose="assistants"
       )
   file_id = file_response.id
   print(f"      File ID: {file_id}")
   print(f"      Status: {file_response.status}")
   # ── Step 2: Create Vector Store ──────────────────────────────
   print(f"\n[2/4] Creating Vector Store...")
   vector_store = client.beta.vector_stores.create(
       name="RFD40 RFD90 API Reference",
       file_ids=[file_id]
   )
   vector_store_id = vector_store.id
   print(f"      Vector Store ID: {vector_store_id}")
   # Wait for indexing
   print(f"      Indexing document", end="", flush=True)
   max_wait = 120
   waited = 0
   while waited < max_wait:
       vs = client.beta.vector_stores.retrieve(vector_store_id)
       if vs.status == "completed":
           print(" done!")
           break
       print(".", end="", flush=True)
       time.sleep(3)
       waited += 3
   else:
       print(" timeout — continuing anyway")
   # ── Step 3: Create Assistant ─────────────────────────────────
   print(f"\n[3/4] Creating Assistant...")
   assistant = client.beta.assistants.create(
       name="RFD40 / RFD90 API Assistant",
       model="gpt-4o",
       description="Expert assistant for RFD40 and RFD90 Zebra RFID reader MQTT API",
       instructions="""You are an expert technical assistant for the RFD40 / RFD90 Zebra RFID reader MQTT API reference documentation.
Your role is to help developers understand and correctly use this API.
Guidelines:
1. Answer ONLY based on the API reference document provided to you.
2. When showing a command, ALWAYS include the full JSON payload example.
3. When explaining response fields, describe what each field means in plain English.
4. For error codes, always explain the cause and recommended action.
5. Format all JSON examples in properly indented code blocks.
6. Be concise, accurate, and technical in your answers.
7. If a question is not related to the RFD40/RFD90 API, politely say you can only help with API questions.
8. Always mention which tag or category a command belongs to.
9. If multiple commands are relevant to a question, list all of them.
10. For troubleshooting questions, always suggest the recommended action from the error codes.
11. When asked about a command, always show: description, request payload, response fields, and relevant error codes.""",
       tools=[{"type": "file_search"}],
       tool_resources={
           "file_search": {
               "vector_store_ids": [vector_store_id]
           }
       }
   )
   assistant_id = assistant.id
   print(f"      Assistant ID: {assistant_id}")
   print(f"      Model: {assistant.model}")
   # ── Step 4: Save to .env ─────────────────────────────────────
   print(f"\n[4/4] Saving to .env...")
   set_key(str(ENV_PATH), "OPENAI_ASSISTANT_ID", assistant_id)
   set_key(str(ENV_PATH), "OPENAI_VECTOR_STORE_ID", vector_store_id)
   set_key(str(ENV_PATH), "OPENAI_FILE_ID", file_id)
   print(f"      Saved successfully")
   # ── Done ─────────────────────────────────────────────────────
   print("\n" + "=" * 60)
   print("  Setup Complete!")
   print("=" * 60)
   print(f"  Assistant ID    : {assistant_id}")
   print(f"  Vector Store ID : {vector_store_id}")
   print(f"  File ID         : {file_id}")
   print("\n  Next steps:")
   print("  1. python scripts/serve.py")
   print("  2. Open http://localhost:8000")
   print("  3. Click 💬 and ask anything!")
   print("=" * 60)

if __name__ == "__main__":
   main()