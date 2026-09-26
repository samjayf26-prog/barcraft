import os
import sys
import socket
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_wifi_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class BarCraftHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.manifest': 'application/manifest+json'
    }

def run():
    wifi_ip = get_wifi_ip()
    server_address = ('0.0.0.0', PORT)
    httpd = ThreadingHTTPServer(server_address, BarCraftHandler)

    print("")
    print("==================================================================")
    print("             BARCRAFT - PROGRESSIVE WEB APP SERVER                ")
    print("==================================================================")
    print(f"  PC Browser:      http://localhost:{PORT}/")
    print(f"  iPhone (Safari): http://{wifi_ip}:{PORT}/")
    print("------------------------------------------------------------------")
    print("  How to install on your iPhone:")
    print("   1. Connect iPhone to the same Wi-Fi network.")
    print(f"   2. Open Safari and go to: http://{wifi_ip}:{PORT}/")
    print("   3. Tap Share button at bottom -> Add to Home Screen -> Add.")
    print("------------------------------------------------------------------")
    print("  Server is active. Press Ctrl+C in this window to stop.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run()
