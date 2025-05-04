import React, { useState } from 'react';
import InsiderItem from '../insider-item/insider-item.component';
import './insider-directory.styles.css'

const InsiderDirectory = ({ className, insiderTrades, keywords, setFilteredKeywords }) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    
    const [search, setSearch] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState(null);

    const filtered = keywords.filter(keyword =>
        keyword.toLowerCase().includes(search.toLowerCase())
    );

    return (
    <div className={className}>
        <div className="insider-header-row">
          <h1 className="insider-header">Insider Trades</h1>
      
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
                  onChange={e => {
                    setSearch(e.target.value)
                    setFilteredKeywords(filtered)
                    }
                  }
                />
                <ul className="keyword-list">
                  {filtered.length > 0 ? (
                    filtered.map((keyword, index) => (
                      <li 
                          key={index}
                          className="keyword-item"
                          onClick={() => {
                          setIsOpen(false);
                          setSelectedSymbol(keyword);
                        }}
                      > 
                        {keyword} 
                      </li>
                    ))
                  ) : (
                    <li className="no-results">No matches found.</li>
                  )}
                </ul>
              </div>
            )}
            {selectedSymbol && (
              <button
                className="clear-button"
                onClick={() => setSelectedSymbol(null)}
              >
                Clear Filter ({selectedSymbol})
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="scrollable-content">
        {insiderTrades
          .filter(item => !selectedSymbol || item.symbol === selectedSymbol)
          .map((item, index) => {
            return (
              <InsiderItem
                key={index} // Use the incremented num as the key
                reporter={item.reporter}
                symbol={item.symbol}
                value={item.value}
                date={item.date}
                transaction={item.transaction}
                executed={item.executed}
              />
            );
          })}
        </div>
    </div>      
  );
};

export default InsiderDirectory;