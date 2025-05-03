from flask import Flask, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)



app = Flask(__name__)
# Cors allows you to communicate with React on different ports
CORS(app)

@app.route('/api/message')
def get_message():
    return jsonify({"message": "Hello from Flask!"})

def greetings():
    return "Hello"

if __name__ == '__main__':
    app.run(debug=True)