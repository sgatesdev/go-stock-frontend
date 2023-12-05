import { useState } from "react";
import { Link } from "react-router-dom";
import ChartSingleSeries from "../components/ChartSingleSeries";
import PriceDetailsSeries from "../components/PriceDetailsSeries";
import Price from "../types/Price";
import Stock from "../types/Stock";


interface DashboardItemProps {
    stock: Stock;
    prices: Price[];
}


const DashboardItem: React.FC<DashboardItemProps> = ({stock, prices}) => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="col-sm-6 py-2" style={{height: showChart ? '300px' : '200px'}} key={stock.symbol}>
            <div className="row">
                <div className="col">            
                    <Link to = {`/stocks/${stock.id}`}><h5 className="card-title">{stock.symbol}</h5></Link>
                </div>
                <div className="col" style={{display: 'flex', justifyContent:'end'}}>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowChart(!showChart)}>{showChart ? "Hide" : "Show"} Chart</button>
                </div>
            </div>
            <div className="row">
                {showChart ? <ChartSingleSeries prices={prices} height="250px" /> : <PriceDetailsSeries symbol={stock.symbol!} prices={prices} />}
            </div>
        </div>
    )
}

export default DashboardItem;