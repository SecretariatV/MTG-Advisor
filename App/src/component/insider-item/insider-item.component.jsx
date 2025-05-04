import './insider-item.styles.css'

const InsiderItem = ( { reporter, symbol,  date, value, transaction, executed } ) => {

    return (
        <div className="insider-row">
            <div className="cell-container">
                <div className='insider-cell' id='name'>
                    <h3>Reporter</h3>
                    <p>{reporter}</p>
                </div>
                <div className='insider-cell' id='openPrice'>
                    <h3>Symbol</h3> 
                    <p>{symbol}</p>
                </div>
                <div className='insider-cell' id='date'>
                    <h3>Date Executed</h3>
                    <p>{executed}</p>
                </div>
            </div>
            <div className="cell-container">
                <div className='insider-cell' id='date'>
                    <h3>Transaction</h3>
                    <p>{transaction}</p>
                </div>
                <div className='insider-cell' id='closePrice'>
                    <h3>Value</h3> 
                    <p>{value}</p>
                </div>
                <div className='insider-cell' id='date'>
                    <h3>Filing Date</h3>
                    <p>{date}</p>
                </div>
            </div>
        </div>
    )

}

export default InsiderItem