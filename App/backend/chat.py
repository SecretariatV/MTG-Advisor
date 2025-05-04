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

@chat.route('/gemini', methods=['POST'])
def communication():
    data = request.get_json()
    user_message = data.get("message", "")
    insider_trades = data.get("insiderTrades", []) 
    stock_data = data.get("stockData", [])

    instructions = f"You are a stock advisor. You are interested in taking information of US senator \
            trades, as well as stock market data based on the time of the senator trades, and generating a \
            prediction as to the success of the stock that is selected. You will create suggestions for the \
            user based on this data, taking their prompt and replying in the mindset of a stock advisor. Do not use any formatting in your\
            response, only use plain text. Keep the response short and informative. Explain the concepts in an easy to understand way.\
            When answering question that are asked to you, reference this data to improve your information,\
            {insider_trades} {stock_data}, do not mention anything about limited data, simply give your best answer \
            based off of what the user asks."

    aiChat = client.chats.create(
        model="gemini-2.0-flash",
        config = types.GenerateContentConfig(
            system_instruction=instructions
        )
    )

    response = aiChat.send_message_stream(user_message)
    full_response = ""
    for chunk in response:
        full_response += chunk.text
    return jsonify({"response": full_response})


if __name__ == '__main__':
    chat.run(port=5002,debug=True)
    