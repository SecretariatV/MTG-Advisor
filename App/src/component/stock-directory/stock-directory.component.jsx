import { useState, useEffect } from 'react';
import './stock-directory.styles.css'
import StockItem from '../stock-item/stock-item.component';
import StockResetButton from '../stock-reset-button/stock-reset-button.component';

import axios from "axios";

const StockDirectory = ( { className }) => {

    const fetchRecentStockData = async () => {
        const tickers = ["AAPL", "MSFT", "GOOG", "NVDA", "INTC"];
        try {
          const res = await axios.post("http://localhost:5001/api/stock-data", {
            tickers,
          });
          setStockData(res.data)
        } catch (err) {
          console.error(err.response?.data || "Error fetching stock data");
        }
    };

    const fetchInsiderStockData = async () => {

        const tickers = ["BITB", "BTC", "AAPL", "AMCR", "GOOG"];
        const dates = ["4/8/2025", "4/23/2025", "4/7/2025", "4/7/2025", "4/7/2025"]
        try {
          const res = await axios.post("http://localhost:5001/api/get-single-stock", {
            tickers,dates,
          });
          setStockData(res.data)
        } catch (err) {
          console.error(err.response?.data || "Error fetching stock data");
        }
    }
    
    useEffect(() => {
        fetchInsiderStockData()
    }, [])

    const [stockData, setStockData] = useState([])
    return (
        <div className={ className }>
            <h1>Stock Prices</h1>
            {stockData.map(item => (
                <StockItem
                key={item.Ticker + item.Date}
                name={item.Ticker}
                openPrice={item.Open}
                closePrice={item.Close}
                date={item.Date}
                />
            ))}
            <div className="button-container">
                <StockResetButton onClick={fetchRecentStockData} placeHolder={"Recent Prices"}/>
                <StockResetButton onClick={fetchInsiderStockData} placeHolder={"Insider Trades"}/>
            </div>
        </div>
    )
}


export default StockDirectory;