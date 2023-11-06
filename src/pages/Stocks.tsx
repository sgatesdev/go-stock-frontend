import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Stocks = () => {
	const [stocks, setStocks] = useState([]);
	const [error, setError] = useState(false);

	useEffect(() => {
		getStocks();
	}, []);

	const getStocks = async () => {
		console.log(process.env)
		try {
			let res = await fetch(`http://${process.env.REACT_APP_SERVER_HOST}:8080/stocks/`);
			let data = await res.json();
			console.log(data)
			setStocks(data.stocks);
		}
		catch(err) {
			setError(true);
		}
	}
	
	return(
		<div>
			<h1>Stocks</h1>
			<div className="row">
				{error && <div className="alert alert-danger">There was an error loading the stocks.</div>}
				{stocks.map((stock: any) => (
					<div className="col-sm-3 py-2" key={stock.symbol}>
						<div className="card">
							<div className="card-body">
								<Link to = {`/stocks/${stock.id}`}>
								<h5 className="card-title">{stock.symbol}</h5>
								</Link>
								<p className="card-text">{stock.name}</p>
								<p>
								<Link to = {`/stocks/${stock.id}`}><button type="button" className="btn btn-secondary ">Edit</button></Link>
								<Link to = {`/analysis/${stock.id}`}>
								<button type="button" className="btn btn-secondary mx-2">Analyze</button>
								</Link>
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Stocks;