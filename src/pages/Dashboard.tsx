import { useState, useEffect, useRef } from "react";
import Price from "../types/Price";
import { Link } from "react-router-dom";
import ChartSingleSeries from "../components/ChartSingleSeries";
import StockPriceState from "../types/StockPriceState";

const Dashboard = () => {
	const [stocks, setStocks] = useState([]);
	const [pricesByStock, setPricesByStock] = useState<StockPriceState>({});
	const [error, setError] = useState(false);

	const socketRef = useRef<WebSocket | null>(null);
	
	// fetch stocks
	useEffect(() => {
		getStocks();
	}, []);

	// handle web socket traffic
	useEffect(() => {
		socketRef.current = new WebSocket(`ws://${process.env.REACT_APP_SERVER_HOST}:8080/ws/prices`);

		socketRef.current.onopen = (event) => {
			console.log('WebSocket is connected.');
		};

		socketRef.current.onmessage = (event) => {
			if (event.data == null) {
				return
			}

			const isPrice = (obj:any): obj is Price => {
				return obj.id !== undefined;
			}

			const isArrayOfPrices = (obj: any): obj is Price => {
				return Array.isArray(obj) && obj.every(isPrice);
			}

			try {
				if (!event || !event?.data) {
					return;
				}

				let data = JSON.parse(event?.data)
				if (isPrice(data)) {
					setPricesByStock((prevState) => {
						return updatePricesByStock(prevState, data);
					})
				} else if (isArrayOfPrices(data)) {
					setPricesByStock((prevState) => {
						let newState = {...prevState};
						for (let price of data) {
							newState = updatePricesByStock(newState, price);
						}
						return newState;
					})
				} else {
					console.log(data)
				}

				setError(false)
			} catch (err) {
				console.log(event.data)
			}
		};

		socketRef.current.onerror = (error) => {
			console.error(`WebSocket error reported`);
			setError(true);
		};

		return () => {
			socketRef.current?.close();
		};
	}, []);

	const updatePricesByStock = (prevState: StockPriceState, price: Price): StockPriceState  => {
			const newState = {...prevState};
			if (newState[price.stockId] == null) {
				newState[price.stockId] = [];
			}

			// escape if this price is already in the array
			let oldArray = newState[price.stockId];
			if (oldArray) {
				for (let i = oldArray.length - 1; i >= 0; i--) {
					if (oldArray[i] && oldArray[i].id === price.id) {
						return prevState
					}
				}
			}

			newState[price.stockId].push(price);
			return newState;
	}

	const getStocks = async () => {
		try {
			let res = await fetch(`http://${process.env.REACT_APP_SERVER_HOST}:8080/stocks/`);
			let data = await res.json();
			setStocks(data.stocks);
			setError(false)
		}
		catch(err) {
			setError(true);
		}
	}

	const getPricesByStock = (id: string): Price[] =>  {
		return pricesByStock[id] || [];
	}

	return(
		<div>
			<h1>Dashboard</h1>
			<div className="row">
				{error && <div className="alert alert-danger">There was an error loading the dashboard.</div>}
				{stocks.map((stock: any) => (
					<div className="col-sm-6 py-2" style={{height: '300px'}} key={stock.symbol}>
						<Link to = {`/stocks/${stock.id}`}>
						<h5 className="card-title">{stock.symbol}</h5>
						</Link>
						<ChartSingleSeries prices={getPricesByStock(stock.id)} height="300px" />
				</div>					
				))}
			</div>
		</div>
	);
}

export default Dashboard;