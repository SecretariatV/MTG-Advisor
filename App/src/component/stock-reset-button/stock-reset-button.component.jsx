import './stock-reset-button.styles.css'

const StockResetButton = ({ onClick, placeHolder}) => {

    return (
        <button onClick={onClick} className="reset-button">{placeHolder}</button>
    )

}

export default StockResetButton