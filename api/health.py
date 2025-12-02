from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        result = {
            'status': 'ok',
            'message': 'System operational',
            'platform': 'Vercel'
        }
        
        self.wfile.write(json.dumps(result).encode('utf-8'))
