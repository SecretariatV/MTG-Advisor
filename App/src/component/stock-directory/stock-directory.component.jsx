import { useState, useEffect } from 'react';
import './stock-directory.styles.css'
import StockItem from '../stock-item/stock-item.component';
import StockResetButton from '../stock-reset-button/stock-reset-button.component';

import axios from "axios";

const StockDirectory = ( { className }) => {

    const fetchRecentStockData = async () => {
        const tickers = ["AAPL", "MSFT", "GOOG", "NVDA"];
      
        try {
          const res = await axios.post("http://localhost:5000/api/stock-data", {
            tickers,
          });
          setStockData(res.data)
        } catch (err) {
          console.error(err.response?.data || "Error fetching stock data");
        }
    };

    const fetchInsiderStockData = async () => {
        console.log("To be implemented")
    }

    useEffect(() => {
        fetchRecentStockData()
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