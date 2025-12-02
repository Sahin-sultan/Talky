from http.server import BaseHTTPRequestHandler
import json
import os

try:
    import google.generativeai as genai
except ImportError:
    genai = None

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Get API key from environment
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
                self.send_error(500, 'API key not configured')
                return
            
            if genai is None:
                self.send_error(500, 'Google Generative AI not installed')
                return
            
            # Configure Gemini
            genai.configure(api_key=api_key)
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            message = data.get('message', '')
            
            if not message:
                self.send_error(400, 'Message is required')
                return
            
            # Generate response
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            response = model.generate_content(message)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            result = {
                'response': response.text,
                'model': 'gemini-2.0-flash-exp'
            }
            
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_result = {
                'error': str(e)
            }
            
            self.wfile.write(json.dumps(error_result).encode('utf-8'))
