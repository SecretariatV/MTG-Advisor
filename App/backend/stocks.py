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

def get_last_trading_day():
    today = datetime.now(timezone.utc).date()
    offset = 1
    while True:
        day = today - timedelta(days=offset)
        if day.weekday() < 5:
            return str(day)
        offset += 1

def get_nearest_weekday(date_str):
    """
    Takes a date in the format YYYY-MM-DD and ensures it is not a weekend.
    If it is, go back to the nearest weekday.
    """
    date = datetime.strptime(date_str, "%Y-%m-%d").date()
    
    # Check if the date is a weekend (Saturday=5, Sunday=6)
    while date.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
        date -= timedelta(days=1)  # Go back one day
    
    return date.isoformat()  # Return the adjusted date as a string

@app.route("/api/stock-data", methods=["POST"])
def fetch_and_return_stock_data():

    body = request.get_json()
    tickers = body.get("tickers", [])

    date = get_last_trading_day()
    print(date)
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
    
@app.route("/api/get-single-stock", methods=["POST"])
def getSingle():
    body = request.get_json()
    tickers = body.get("tickers", [])
    dates = body.get("dates", [])
    results = []

    # Convert dates to the correct format (YYYY-MM-DD)
    for i in range(len(dates)):
        dt = datetime.strptime(dates[i], "%m/%d/%Y")
        dates[i] = get_nearest_weekday(dt.date().isoformat())  # Use .date() to remove the time portion
        # print(dates[i])  # Debugging: Print the formatted date

    # Fetch data for each ticker and date
    for ticker, date in zip(tickers, dates):
        try:
            bars = client.get_aggs(ticker, 1, "day", date, date)
            # print(f"Bars for {ticker} on {date}: {bars}")  # Debugging: Print the bars
            if bars:
                bar = bars[0]
                results.append({
                    "Ticker": ticker,
                    "Open": bar.open,
                    "Close": bar.close,
                    "Date": date
                })
        except Exception as e:
            print(f"Error fetching data for Ticker: {ticker}, Date: {date} - {e}")

    if results:
        return jsonify(results)
    else:
        return jsonify({"error": "No data found for given tickers and dates"}), 404



if __name__ == "__main__":
    app.run(port=5001, debug=True)
