import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Price from '../types/Price';
import PriceFilter from '../types/PriceFilter';
import ChartSingleSeries from '../components/ChartSingleSeries';


const Analysis = () => {
	const [prices, setPrices] = useState<Price[] | null>();
	const [filteredPrices, setFilteredPrices] = useState<Price[] | null>();
	const [priceFilter, setPriceFilter] = useState<PriceFilter>({time: new Date().getTime()/1000, unit: "day", range: 1});

	const [error, setError] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		getStock();
	},[]);

	useEffect(() => {
		filterPrices()
	}, [priceFilter])

	const getStock = async () => {
		try {
			let res = await fetch(`http://${process.env.REACT_APP_SERVER_HOST}:8080/prices/${id}`);
			let data = await res.json();
			setPrices(data);
			setFilteredPrices(data);
		}
		catch(err) {
			setError(true);
		}
	}
	
	const filterPrices = () => {
		if (priceFilter == null) {
			return;
		}

		let filteredPrices = prices?.filter((price: Price) => {
			let multiplier = 0;
			switch(priceFilter.unit) {
				case 'day':
					multiplier = 86400;
					break;
				case 'week':
					multiplier = 604800;
					break;
				case 'month':
					multiplier = 2629743;
					break;
			}
			return price.t > priceFilter.time && price.t < (priceFilter.time + (priceFilter.range * multiplier));
		});
		setFilteredPrices(filteredPrices);
	}

	const processDateInput = (date:string) => {
		// filterPrices({time: 1693886400, unit: "day", range: 1})
		let timestamp = new Date(date).getTime() / 1000
		setPriceFilter({...priceFilter, time: timestamp})
	}

	const processUnitInput = (unit:string) => {
		setPriceFilter({...priceFilter, unit: unit})
	}

	const processRangeInput = (range:string) => {
		if (range === "") {
			range="0"
		}
		setPriceFilter({...priceFilter, range: parseInt(range)})
	}
	
	return(
		<div>
			<div className="row">
				{error && <div className="alert alert-danger">There was an error loading the stock.</div>}
			</div>
			<div className="row">
				<div className="col-sm">
					<input type="date" value={new Date(priceFilter.time*1000).toISOString().split('T')[0]} onChange={(e : React.FormEvent<HTMLInputElement>) => processDateInput(e.currentTarget.value)}></input>
					<input type="text" value={priceFilter.range} size={1} onChange={(e : React.FormEvent<HTMLInputElement>) => processRangeInput(e.currentTarget.value)} className="mx-2">
					</input>
					<select onChange={(e : React.FormEvent<HTMLSelectElement>) => processUnitInput(e.currentTarget.value)}>
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
					</select>
				</div>
			</div>
			<div className="row" style={{height:"650px"}}>
					<ChartSingleSeries prices={filteredPrices} height="650px" />
			</div>
		</div>
	);
}

export default Analysis;