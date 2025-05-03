import './stock-reset-button.styles.css'
import Button from '@mui/material/Button';

const StockResetButton = ({ onClick, placeHolder}) => {

    return (
        <Button className="reset-button" variant="contained" onClick={ onClick }>{ placeHolder }</Button>
        // <button onClick={onClick} className="reset-button">{placeHolder}</button>
    )

}

export default StockResetButton