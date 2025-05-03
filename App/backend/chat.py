from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os

chat = Flask(__name__)
# Cors allows you to communicate with React on different ports
CORS(chat)

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)
model = genai

if __name__ == '__main__':
    chat.run(debug=True)
    print("Hello World!")