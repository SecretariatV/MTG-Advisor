from flask import Flask, jsonify, request
from flask_cors import CORS
from polygon import RESTClient
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
API_KEY = os.getenv("POLYGON_API_KEY")
client = RESTClient(API_KEY)

'''
Calculates the most recent trading day to get data for,
This will likely be replaced by extracting data from the webscraping for the date
'''
def get_last_trading_day():
    today = datetime.now(timezone.utc).date()
    offset = 1
    while True:
        day = today - timedelta(days=offset)
        if day.weekday() < 5:
            return str(day)
        offset += 1

@app.route("/api/stock-data", methods=["POST"])
def fetch_and_return_stock_data():

    body = request.get_json()
    tickers = body.get("tickers", [])

    if not tickers:
        return jsonify({"error": "No tickers provided"}), 400

    date = get_last_trading_day()
    grouped = client.get_grouped_daily_aggs(date)
    data = []

    # extracts the data we need
    for agg in grouped:
        if agg.ticker in tickers:
            data.append({
                "Ticker": agg.ticker,
                "Open": agg.open,
                "Close": agg.close,
                "Date": date
            })

    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "No data found for given tickers"}), 404

if __name__ == "__main__":
    app.run(debug=True)
