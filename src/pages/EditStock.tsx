import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const EditStock = () => {
	interface Stock {
		id: number;
		symbol: string;
		name: string;
	}

	const [stock, setStock] = useState<Stock | null>();
	const [error, setError] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		getStock();
	},[]);

	const getStock = async () => {
		try {
			let res = await fetch(`http://${process.env.REACT_APP_SERVER_HOST}:8080/stocks/${id}`);
			let data = await res.json();
			console.log(data)
			setStock(data);
		}
		catch(err) {
			setError(true);
		}
	}
	
	return(
		<div>
			<h1>{stock ? stock.symbol : null}</h1>
			<div className="row">
				{error && <div className="alert alert-danger">There was an error loading the stock.</div>}
			</div>
		</div>
	);
}

export default EditStock;