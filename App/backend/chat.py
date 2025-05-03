from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

chat = Flask(__name__)
# Cors allows you to communicate with React on different ports
CORS(chat)

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)

@app.route('/gemini')
def communication():
    aiChat = client.chats.create(
        model="gemini-2.0-flash",
        config = types.GenerateContentConfig(
            system_instruction="""You are a stock advisor. You are interested in taking information of US senator
            trades, as well as stock market data based on the time of the senator trades, and generating a 
            prediction as to the success of the stock that is selected. You will create suggestions for the 
            user based on this data, taking their prompt and replying in the mindset of a stock advisor"""
        )
    )

    response = aiChat.send_message_stream()
    for chunk in response:
        print(chunk.text, end="")


if __name__ == '__main__':
    chat.run(debug=True)
    print("Hello World!")