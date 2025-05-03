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
def getInsiderTrades():

    if request.method == "OPTIONS":
        # Preflight request—just return 200 with CORS headers
        return '', 200
    # 1. Configure headless Chrome
    trades = []
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    try:
        # 2. Load the page and wait for JS-rendered table
        driver.get("https://unusualwhales.com/politics")
        # wait until table appears (up to 10s)
        end_time = time.time() + 10
        while time.time() < end_time:
            if driver.find_elements(By.CSS_SELECTOR, "table.w-full tbody tr"):
                break
            time.sleep(0.5)

        # 3. Grab the rendered HTML and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # 4. Find every row in the target table
        rows = soup.select("table.w-full tbody tr.hover\\:bg-\\[var\\(--hover-bg-color\\)\\]")

        for row in rows:
            cols = row.find_all("td")

            # Reporter: link text in first <td>
            reporter = cols[0].find("a").get_text(strip=True)

            # Symbol: only if there's an <a> in the second <td>
            symbol_tag = cols[1].find("a")
            if symbol_tag:
                symbol = symbol_tag.get_text(strip=True) 
            else:
                continue
        

            # Date: text of third <td>
            date = cols[2].get_text(strip=True)

            # Value: second <span> inside the fourth <td>
            spans = cols[3].find_all("span")
            value = spans[1].get_text(strip=True) if len(spans) > 1 else None

            trades.append({
                "reporter": reporter,
                "symbol": symbol,
                "date": date,
                "value": value
            })

        # 5. Print results
        for t in trades:
            print(f"{t['date']} – {t['reporter']} – {t['symbol'] or '(non-stock)'} – {t['value']}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()
    
    return jsonify(trades)

if __name__ == "__main__":
    app.run(debug=True)
