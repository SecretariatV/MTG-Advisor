import React, { useState } from 'react';
import './insider-directory.styles.css'

const InsiderDirectory = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const [search, setSearch] = useState('');
    
    const keywords = ['APPL', 'NVIDA', 'AMZN'];

    const filteredKeywords = keywords.filter(keyword =>
        keyword.toLowerCase().includes(search.toLowerCase())
    );
  
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
    </div>      
  );
};

export default InsiderDirectory;