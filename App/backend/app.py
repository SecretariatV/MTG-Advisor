from flask import Flask, jsonify, request
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone
from polygon import RESTClient
from google import genai
from google.genai import types
from dotenv import load_dotenv
import time
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

# Polygon Api Client
API_KEY = os.getenv("POLYGON_API_KEY")
polygon_client = RESTClient(API_KEY)

# Gemini Api client
gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_api_key)

@app.route("/api/getInsiderTrades", methods=["POST", "OPTIONS"])
def getInsiderTrades():
    if request.method == "OPTIONS":
        return "", 200

    trades = []
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--remote-debugging-port=9222")
    driver = webdriver.Chrome(options=options)

    try:
        driver.get("https://unusualwhales.com/politics")
        end_time = time.time() + 10
        while time.time() < end_time:
            if driver.find_elements(By.CSS_SELECTOR, "table.w-full tbody tr"):
                break
            time.sleep(0.5)

        soup  = BeautifulSoup(driver.page_source, "html.parser")
        table = soup.find("table", class_="w-full")
        rows  = table.select("tbody tr")

        for row in rows:
            if "hover:bg-[var(--hover-bg-color)]" not in row.get("class", []):
                continue

            cols = row.find_all("td")

            # only process stock trades: span must start with "stock"
            type_span = cols[1].find("span", class_="text-sm")
            if not type_span or not type_span.get_text(strip=True).lower().startswith("stock"):
                continue

            # now you know it's a stock, so symbol link will exist
            reporter = cols[0].find("a").get_text(strip=True)
            symbol_tag = cols[1].find("a")
            if not symbol_tag:
                continue
            symbol = symbol_tag.get_text(strip=True)

            date = cols[2].get_text(strip=True)

            # extract transaction, value, executed as before
            outer       = cols[3].find("div")
            detail_div, exec_div = outer.find_all("div", recursive=False)
            spans       = detail_div.find_all("span")
            transaction = spans[0].get_text(strip=True)
            value       = spans[1].get_text(strip=True)
            executed    = exec_div.get_text(strip=True).replace("executed:", "").strip()

            trades.append({
                "reporter":    reporter,
                "symbol":      symbol,
                "date":        date,
                "transaction": transaction,
                "value":       value,
                "executed":    executed
            })

    finally:
        driver.quit()

    return jsonify(trades)


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
    grouped = polygon_client.get_grouped_daily_aggs(date)
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

    # Fetch data for each ticker and date
    for ticker, date in zip(tickers, dates):
        try:
            bars = polygon_client.get_aggs(ticker, 1, "day", date, date)
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

@app.route('/gemini', methods=['POST', 'OPTIONS'])
def communication():
    if request.method == "OPTIONS":
        # Handle preflight request
        return "", 200
    data = request.get_json()
    user_message = data.get("message", "")
    insider_trades = data.get("insiderTrades", []) 
    stock_data = data.get("stockData", [])

    instructions = f"You are a stock advisor. You're name is MTG Advisor. You are interested in taking information of US senator \
            trades, as well as stock market data based on the time of the senator trades, and generating a \
            prediction as to the success of the stock that is selected. You will create suggestions for the \
            user based on this data, taking their prompt and replying in the mindset of a stock advisor. Do not use any formatting in your\
            response, only use plain text. Keep the response short and informative. Explain the concepts in an easy to understand way.\
            When answering question that are asked to you.\
            {insider_trades} {stock_data}, do not mention anything about limited data, simply give your best answer \
            based off of what the user asks. Interact with the users in a natural way be specialized in stocks, but \
            also be a good conversationalist. Not everything must be related to the stocks"

    aiChat = gemini_client.chats.create(
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)