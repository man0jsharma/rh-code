import chunkApi from '../utils/chunk-api';
import getTrend from '../utils/get-trend';
import { orderBy } from 'lodash';
import convertUtcToET from '../utils/convertUtcToET';

const getMultipleHistoricals = async (tickers, interval = 'interval=day', span = 'span=week') => {
    const allHistoricals = await chunkApi(
        tickers,
        async (tickerStr) => {
            const { results } = await Robinhood.url(`https://api.robinhood.com/quotes/historicals/?symbols=${tickerStr}&${interval}&${span}`);
            return results;
        },
        75
    );

    return allHistoricals.map(obj => {
        let prevClose;
        let index = 0;
        return {
            ticker: obj.symbol,
            historical: (orderBy(obj.historicals.map(hist => {
                hist.index = ++index;
                ['open_price', 'close_price', 'high_price', 'low_price'].forEach(key => {
                    hist[key] = Number(hist[key]).toFixed(2);
                });
                if (prevClose) {
                    hist.trend = getTrend(hist.close_price, prevClose);
                }
                prevClose = hist.close_price;
                const { begins_at, open_price, close_price, high_price, low_price, trend, volume } = hist;
                return {
                    begins_at,
                    open_price: Number(open_price),
                    close_price: Number(close_price),
                    high_price: Number(high_price),
                    low_price: Number(low_price),
                    trend,
                    volume
                };
            }), 'begins_at', 'asc')),
        };
    });
};

export default getMultipleHistoricals;