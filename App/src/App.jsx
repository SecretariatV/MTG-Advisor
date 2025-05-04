import { useEffect, useState } from 'react';
import axios from 'axios';

import ChatContainer from './component/chat-container/chat-container.component'
import StockDirectory from "./component/stock-directory/stock-directory.component";
import InsiderDirectory from "./component/insider-directory/insider-directory.component"
import "./App.css"

function App() {

  const [stockData, setStockData] = useState([])
  const [insiderTrades, setInsiderTrades] = useState([])
  const [keywords, setKeywords]= useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState([])
  let tickers = []
  let dates = []

  const getTickers = () => {
    tickers = insiderTrades.slice(0, Math.min(5, insiderTrades.length)).map(trade => trade.symbol);
  }

  const getDates = () => {
    dates = insiderTrades.slice(0,Math.min(5,insiderTrades.length)).map(trade => trade.date)
  }



  const fetchRecentStockData = async () => {
    getTickers()
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
    getTickers()
    getDates()
    try {
      const res = await axios.post("http://localhost:5001/api/get-single-stock", {
        tickers,dates,
      });
      setStockData(res.data)
    } catch (err) {
      console.error(err.response?.data || "Error fetching stock data");
    }
  }

  fetchInsiderStockData()

  const getInsiderTrades = async () => {
    try {
        const res = await axios.post("http://localhost:5000/api/getInsiderTrades");
        setInsiderTrades(res.data);
        const trades = res.data;
        setInsiderTrades(trades);

        const symbols = [...new Set(trades.map(trade => trade.symbol))].sort((a,b)=> a.localeCompare(b));
        setKeywords(symbols);
    } catch (err) {
        console.error(err.response?.data || "Error fetching insider trades");
        alert("Failed to fetch insider trades. Please try again later.");
    }
};

  useEffect(() => {
    getInsiderTrades()
  }, [])


  return (
    <>
      <div className="parent-container">
        <InsiderDirectory className="container" insiderTrades={insiderTrades} keywords={keywords} setFilteredKeywords={setFilteredKeywords}/>
        <StockDirectory className="container" stockData={stockData} func1={fetchRecentStockData} func2={fetchInsiderStockData}/>
        <ChatContainer className="container"/>
      </div>
    </>
  );
}

export default App;