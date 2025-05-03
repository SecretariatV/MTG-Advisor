import React from 'react';
import './stock-item.styles.css'

const StockItem = ({ name, openPrice, closePrice, date }) => {
  
  return (
    <div className="row">
      <div className='cell'>{name}</div>
      <div className='cell'>Open: {openPrice}</div>
      <div className='cell'>Close: {closePrice}</div>
      <div className='cell'>{date}</div>
    </div>
  );
};

export default StockItem;