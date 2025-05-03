from flask import Flask, jsonify, request
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from datetime import datetime
import time

app = Flask(__name__)
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
     methods=["OPTIONS", "POST", "GET"],
     allow_headers=["Content-Type"])

@app.route("/api/getInsiderTrades", methods=["POST", "OPTIONS"])
@app.route("/api/getInsiderTrades", methods=["POST", "OPTIONS"])
def getInsiderTrades():
    if request.method == "OPTIONS":
        return "", 200

    trades = []
    options = Options()
    options.add_argument("--headless")
    # options.add_argument("--no-sandbox")
    # options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--disable-gpu")
    # options.add_argument("--remote-debugging-port=9222")
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

        # Debug
        # for trade in trades:
        #     print(
        #         f"Date:        {trade['date']}\n"
        #         f"Reporter:    {trade['reporter']}\n"
        #         f"Symbol:      {trade['symbol']}\n"
        #         f"Transaction: {trade['transaction']}\n"
        #         f"Value:       {trade['value']}\n"
        #         f"Executed:    {trade['executed']}\n\n"
        #     )

    finally:
        driver.quit()

    return jsonify(trades)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)