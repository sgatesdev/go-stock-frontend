import React from 'react';
import { useState } from 'react';
import Price from "../types/Price";

interface PriceDetailsSeriesProps {
    symbol: string;
    prices: Price[];
}

const PriceDetailsSeries: React.FC<PriceDetailsSeriesProps> = ({symbol, prices}) => {
    const [showPercentage, setShowPercentage] = useState(false);

    if (prices.length == 0) {
        return (
            <div>
            <h3>Key Price Data for Series</h3>
            <p>No data available</p>
            </div>
        );
    }

    const openPrice = prices[0].c;
    const currentPrice = prices[prices.length - 1].c;

    interface PricePercentage {
        price: number;
        percentage: string;
    }

    let high: PricePercentage
    let low: PricePercentage

    prices.forEach((price) => {
        if (!high || price.c > high.price) {
            high = {
                price: price.c,
                percentage: formatPercentage((price.c - openPrice) / openPrice)
            }
        }

        if (!low || price.c < low.price) {
            low = {
                price: price.c,
                percentage: formatPercentage((price.c - openPrice) / openPrice)
            }
        }
    })

    // get intraday high (price and percentage)
    const getHighPrice = () => {
        return {price: high.price, percentage: high.percentage}
    }

    // get intraday low (price and percentage)
    const getLowPrice = () => {
        return {price: low.price, percentage: low.percentage}
    }

    // get movement (price and percentage)
    const currentVsOpen = () => {
        let value = currentPrice - openPrice
        let movementPercent = formatPercentage(value / openPrice)
        let movementNumber = formatNumber(value)
        return {price: movementNumber, percentage: movementPercent, isNegative: value < 0}
    }

    const getMovementFromHighLow = () => {
        let value = high.price - low.price
        let movementPercent = formatPercentage(value / low.price)
        let movementNumber = formatNumber(value)
        return {price: movementNumber, percentage: movementPercent, isNegative: value < 0}
    }

    const getNumDaysInSeries = () => {
        const uniqueDates = prices.reduce((dates: Set<string>, price) => {
            return dates.add(new Date(price.t * 1000).toDateString());
        }, new Set<string>());
        return uniqueDates.size;
    }

    let highPrice = getHighPrice()
    let lowPrice = getLowPrice()
    let movementFromOpen = currentVsOpen()
    let movementFromHighLow = getMovementFromHighLow()

    return (
        <div className="row" style={{justifyContent: 'center'}}>
            <div className="row" style={{width: '55rem'}}>
                <div className="col-2 p-1" style={{display: 'flex', alignItems: 'center'}}>
                    <h2 className={formatColor(movementFromOpen.isNegative)}>{movementFromOpen.price}<br /> {movementFromOpen.percentage}</h2>
                </div>
                <div className="col-5">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>Open <b>{openPrice}</b></li>
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>Current <b>{currentPrice}</b></li>
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>High <b>{highPrice.price + " | " + highPrice.percentage}</b></li>
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>Low <b>{lowPrice.price + " | " + lowPrice.percentage}</b></li>
                    </ul>
                </div>
                <div className="col-5">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>Movement <b>{movementFromHighLow.price + " | " + movementFromHighLow.percentage}</b></li>
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>Days in Series <b>{getNumDaysInSeries()}</b></li>
                        <li className="list-group-item" style={{display: 'flex', justifyContent: 'space-between'}}>Price Points <b>{prices.length}</b></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

const formatPercentage = (percentage: number) => {
    let formatted = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(percentage);
    return formatted;
}

const formatNumber = (num: number) => {
    return num.toFixed(3);
}

const formatColor = (negative: boolean) => {
    if (negative) {
        return "text-danger"
    }
    return "text-success"
}

export default PriceDetailsSeries