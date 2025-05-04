import { useEffect, useState } from 'react';
import axios from 'axios';

import ChatContainer from './component/chat-container/chat-container.component';
import StockDirectory from './component/stock-directory/stock-directory.component';
import InsiderDirectory from './component/insider-directory/insider-directory.component';
import LoadingScreen from './component/loading/loading.component';
import './App.css';

function App() {
  const [stockData, setStockData] = useState([]);
  const [insiderTrades, setInsiderTrades] = useState([]);
  const [keywords, setKeywords] = useState([]);
  //eslint-disable-next-line
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [fadeOut, setFadeOut] = useState(false); // Fade-out state

  let tickers = [];
  let dates = [];

  const fetchRecentStockData = async () => {
    getUniqueTickers();
    try {
      const res = await axios.post('http://localhost:5000/api/stock-data', {
        tickers: selectedSymbol ? [selectedSymbol] : tickers,
      });
      setStockData(res.data);
    } catch (err) {
      console.error(err.response?.data || 'Error fetching stock data');
    }
  };

  const fetchInsiderStockData = async () => {
    getTickers();
    try {
      const res = await axios.post('http://localhost:5000/api/get-single-stock', {
        tickers: selectedSymbol ? [selectedSymbol] : tickers,
        dates,
      });
      setStockData(res.data);
    } catch (err) {
      console.error(err.response?.data || 'Error fetching stock data');
    }
  };

  const getTickers = () => {
    const uniqueEntries = new Set();
    tickers = [];
    dates = [];

    for (const trade of insiderTrades) {
      const key = `${trade.symbol}-${trade.executed}`;
      if (!uniqueEntries.has(key)) {
        uniqueEntries.add(key);
        tickers.push(trade.symbol);
        dates.push(trade.executed);
      }
      if (tickers.length === 5) break;
    }
  };

  const getUniqueTickers = () => {
    const uniqueSymbols = new Set();
    tickers = [];

    for (const trade of insiderTrades) {
      if (!uniqueSymbols.has(trade.symbol)) {
        uniqueSymbols.add(trade.symbol);
        tickers.push(trade.symbol);
      }
      if (tickers.length === 5) break;
    }
  };

  const getInsiderTrades = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/getInsiderTrades');
      setInsiderTrades(res.data);
      const trades = res.data;
      setInsiderTrades(trades);

      const symbols = [...new Set(trades.map((trade) => trade.symbol))].sort((a, b) =>
        a.localeCompare(b)
      );
      setKeywords(symbols);
    } catch (err) {
      console.error(err.response?.data || 'Error fetching insider trades');
      alert('Failed to fetch insider trades. Please try again later.');
    }
  };

  useEffect(() => {
    getInsiderTrades();

    // Show loading screen for 5 seconds, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true); // Trigger fade-out
      setTimeout(() => setIsLoading(false), 1000); // Wait for fade-out animation to complete
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (isLoading) {
    return <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}><LoadingScreen /></div>;
  }

  return (
    <div className={`parent-container ${fadeOut ? 'fade-in' : ''}`}>
      <InsiderDirectory
        className="container"
        insiderTrades={insiderTrades}
        keywords={keywords}
        setFilteredKeywords={setFilteredKeywords}
        setSelectedSymbol={setSelectedSymbol}
      />
      <StockDirectory
        className="container"
        stockData={stockData}
        func1={fetchRecentStockData}
        func2={fetchInsiderStockData}
      />
      <ChatContainer className="container" insiderTrades={insiderTrades} stockData={stockData} />
    </div>
  );
}

export default App;