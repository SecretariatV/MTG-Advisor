import React from 'react';
import './stock-item.styles.css' 

const StockItem = ({ name, openPrice, closePrice, date }) => {
  
  return (
    <div className="row">
      <div className='cell' id='name'>
        <h3>Stock</h3>
        <p>{name}</p>
        </div>
      <div className='cell' id='openPrice'>
        <h3>Open</h3> 
        <p>{openPrice}</p>
      </div>
      <div className='cell' id='closePrice'>
        <h3>Close</h3> 
        <p>{closePrice}</p>
      </div>
      <div className='cell' id='date'>
        <h3>Date</h3>
        <p>{date}</p>
      </div>
    </div>
  );
};

export default StockItem;