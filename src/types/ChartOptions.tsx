interface ChartOptions {
	xAxis: {
		type: string;
		data: string[];
	};
	yAxis: {
		type: string;
		min: string;
	};
	series: [
		{
			data: number[];
			type: string;
			smooth: boolean;
			markLine: {
				data: [
					{ type:string; name: string; }
				]
			}
		}
	];
	tooltip: {
		trigger: string;
	};
	dataZoom: {
		type: string;
	};
}

export default ChartOptions;