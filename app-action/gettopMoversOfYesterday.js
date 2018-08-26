import chunkApi from '../utils/chunk-api';
import getTrend from '../utils/get-trend';
import { orderBy } from 'lodash';
import convertUtcToET from '../utils/convertUtcToET';

const getYesterdayBigMovers = async (tickers, qs = 'interval=day') => {
    const allHistoricals = await chunkApi(
        tickers,
        async (tickerStr) => {
            const { results } = await Robinhood.url(`https://api.robinhood.com/quotes/historicals/?symbols=${tickerStr}&${qs}`);
            return results;
        },
        75
    );

    const getFormatedHistoricalData = () => allHistoricals.map(obj => {
        let prevClose;
        let index = 0;
        return {
            ticker: obj.symbol,
            historical: orderBy(obj.historicals.map(hist => {
                hist.index = ++index;
                ['open_price', 'close_price', 'high_price', 'low_price'].forEach(key => {
                    hist[key] = Number(hist[key]).toFixed(4);
                });
                if (prevClose) {
                    hist.trend = getTrend(hist.close_price, prevClose);
                }
                prevClose = hist.close_price;
                const { begins_at, open_price, close_price, high_price, low_price, trend, volume } = hist;
                return { begins_at, close_price, trend, volume };
            }), 'begins_at', 'desc')
        };
    });


    const gettopMoversOfYesterday = () => {
        const formatedHistoricalData = getFormatedHistoricalData();
        const topMoversOfYesterday = [];
        console.log(formatedHistoricalData);
        formatedHistoricalData.map(tickerData => {
            if (Math.abs(tickerData.historical[0].trend) > 3 && tickerData.historical[0].volume >= 100000) {
                const { ticker } = tickerData;
                const { trend, volume, close_price, begins_at } = tickerData.historical[0];
                topMoversOfYesterday.push({
                    ticker, begins_at: convertUtcToET(begins_at), close_price, trend, volume
                });
            }
        });
        return orderBy(topMoversOfYesterday, 'trend', 'asc');
    };
    return gettopMoversOfYesterday();

};

export default getYesterdayBigMovers;