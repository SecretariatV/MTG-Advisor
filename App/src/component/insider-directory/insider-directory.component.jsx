import React, { useState, useEffect } from 'react';
import axios from 'axios'
import InsiderItem from '../insider-item/insider-item.component';
import './insider-directory.styles.css'

const InsiderDirectory = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const [insiderTrades, setInsiderTrades] = useState([])

    const [search, setSearch] = useState('');

    const [keywords, setKeywords]= useState([]);

    const filteredKeywords = keywords.filter(keyword =>
        keyword.toLowerCase().includes(search.toLowerCase())
    );

    const getInsiderTrades = async () => {
      try {
          const res = await axios.post("http://localhost:5000/api/getInsiderTrades");
          const trades = res.data;
          setInsiderTrades(trades);

          const symbols = [...new Set(trades.map(trade => trade.symbol))];
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
    <div className={className}>
        <div className="insider-header-row">
          <h1 className="insider-header">Insider</h1>
      
          <div className="filter-container"> {/* Wrapper for positioning */}
            <button className="insider-button" onClick={toggleDropdown}>
              <span className="funnel-icon" />
              <span>Filter</span>
            </button>
      
            {isOpen && (
              <div className="dropdown-menu align-left">
                <input
                  type="text"
                  className="dropdown-search"
                  placeholder="Search filters"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <ul className="keyword-list">
                  {filteredKeywords.length > 0 ? (
                    filteredKeywords.map((keyword, index) => (
                        <li key={index} className="keyword-item" onClick={() => setSearch(keyword)}> {keyword} </li>
                    ))
                  ) : (
                    <li className="no-results">No matches found.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="scrollable-content">
        {insiderTrades.map((item, index) => {
          return (
            <InsiderItem
              key={index} // Use the incremented num as the key
              reporter={item.reporter}
              symbol={item.symbol}
              value={item.value}
              date={item.date}
            />
          );
        })}
        </div>
    </div>      
  );
};

export default InsiderDirectory;