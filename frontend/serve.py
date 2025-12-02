"""
Simple HTTP server to serve the frontend on localhost
This allows the frontend to properly communicate with the backend
"""
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Change to frontend directory
os.chdir(Path(__file__).parent)

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

# Add CORS headers
class CORSRequestHandler(Handler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print("=" * 60)
    print("🚀 Talky Frontend Server")
    print("=" * 60)
    print(f"📱 Frontend URL: http://localhost:{PORT}")
    print(f"🔗 Open in browser: http://localhost:{PORT}/index.html")
    print(f"🔧 Backend should be running on: http://localhost:8000")
    print("=" * 60)
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    
    # Open browser automatically
    webbrowser.open(f'http://localhost:{PORT}/index.html')
    
    httpd.serve_forever()
