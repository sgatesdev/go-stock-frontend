import ReactECharts from 'echarts-for-react';
import Price from "../types/Price";

const ChartSingleSeries = ({prices, height}:{prices:Price[] | null | undefined, height:string} ) => {
	const getOption = (prices:Price[] | null) => {
		const options = {
			// grid: { top: 50, bottom: 50 },
			xAxis: {
			  type: 'category',
			  data: prices?.map((price: Price) => new Date(price.t * 1000).toString()),
			},
			yAxis: {
			  type: 'value',
			  min: 'dataMin',
			},
			series: [
			  {
			    data: prices?.map((price: Price) => price.c),
			    type: 'line',
			    smooth: true,
			    markLine: {
				data: [
					{ type: 'average', name: 'Avg' },
					{ type: 'min', name: 'Min' },
					{ type: 'max', name: 'Max' },
					{ type: 'median', name: 'Median' }
				]
			    }
			  },
			],
			tooltip: {
			  trigger: 'axis',
			},
			dataZoom: {
				type: 'slider'
			}
		};
		return options
	}

	return (
		<ReactECharts
			option={getOption(prices ? prices : null)}
			// notMerge={true}
			// lazyUpdate={true}
			// theme={"theme_name"}
			// onChartReady={this.onChartReadyCallback}
			// onEvents={EventsDict}
			// opts={}
			style={{height:height, marginTop: '0px'}}
		/>);
}

export default ChartSingleSeries;