from flask import Flask, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

app = Flask(__name__)
CORS(app)

@app.route("/")
def scrape_congress_trades():
    options = Options()
    options.headless = True
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")

    # If using Chromium instead of Google Chrome, uncomment:
    options.binary_location = "/usr/bin/chromium-browser"

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get("https://unusualwhales.com/politics")

    # Wait for data (use implicit wait or better: WebDriverWait)
    driver.implicitly_wait(10)

    trades = []
    rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
    for row in rows:
        cols = row.find_elements(By.TAG_NAME, "td")
        if len(cols) >= 4:
            trade = {
                "senator": cols[0].text.strip(),
                "company": cols[1].text.strip(),
                "amount": cols[2].text.strip(),
                "date": cols[3].text.strip()
            }
            trades.append(trade)

    driver.quit()
    print(trades)
    return 'hi'

if __name__ == "__main__":
    app.run(debug=True)
