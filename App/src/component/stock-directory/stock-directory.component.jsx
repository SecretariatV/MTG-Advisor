import './stock-directory.styles.css'
import StockItem from '../stock-item/stock-item.component';
import StockResetButton from '../stock-reset-button/stock-reset-button.component';

const StockDirectory = ( { className, stockData, func1, func2 }) => {

    return (
        <div className={ className }>
          <header className="stock-header">
            <h1>Stock Prices</h1>
          </header>
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
                <StockResetButton onClick={func1} placeHolder={"Recent Prices"}/>
                <StockResetButton onClick={func2} placeHolder={"Insider Trades"}/>
            </div>
        </div>
    )
}

export default StockDirectory;