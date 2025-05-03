import './insider-item.styles.css'

const InsiderItem = ( { reporter, symbol,  value, date } ) => {

    return (
        <div className="row">
            <div className='cell' id='name'>
                <h3>Reporter</h3>
                <p>{reporter}</p>
            </div>
            <div className='cell' id='openPrice'>
                <h3>Symbol</h3> 
                <p>{symbol}</p>
            </div>
            <div className='cell' id='closePrice'>
                <h3>Value</h3> 
                <p>{value}</p>
            </div>
            <div className='cell' id='date'>
                <h3>Date</h3>
                <p>{date}</p>
            </div>
        </div>
    )
}

export default InsiderItem