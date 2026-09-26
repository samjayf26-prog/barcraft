import os
import sys
import time
import subprocess
import re

DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_PY = os.path.join(DIR, "server.py")
CLOUDFLARED_EXE = os.path.join(DIR, "cloudflared.exe")
UV_EXE = os.path.expandvars(r"%USERPROFILE%\.local\bin\uv.exe")

# 1. Start Python server
server_proc = subprocess.Popen([UV_EXE, "run", SERVER_PY], cwd=DIR)
time.sleep(1.5)

# 2. Start cloudflared tunnel
tunnel_proc = subprocess.Popen(
    [CLOUDFLARED_EXE, "tunnel", "--url", "http://localhost:8080"],
    stderr=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True,
    bufsize=1
)

public_url = None
start_time = time.time()

# Read stderr from cloudflared to extract the trycloudflare.com URL
while time.time() - start_time < 20:
    line = tunnel_proc.stderr.readline()
    if not line:
        continue
    match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
    if match:
        public_url = match.group(0)
        break

if public_url:
    print(f"\n==================================================================")
    print(f"  SECURE HTTPS PWA LINK (OFFLINE ENABLED ON IPHONE):")
    print(f"  {public_url}")
    print(f"==================================================================\n")
    with open(os.path.join(DIR, "tunnel_url.txt"), "w") as f:
        f.write(public_url)

    # Keep running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
else:
    print("Could not retrieve cloudflare tunnel URL within 20s.")

server_proc.terminate()
tunnel_proc.terminate()
