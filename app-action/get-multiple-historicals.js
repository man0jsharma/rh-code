import chunkApi from '../utils/chunk-api';
import getTrend from '../utils/get-trend';
import { orderBy } from 'lodash';


export default async (tickers, qs = 'interval=day') => {

    const allHistoricals = await chunkApi(
        tickers,
        async (tickerStr) => {
            const { results } = await Robinhood.url(`https://api.robinhood.com/quotes/historicals/?symbols=${tickerStr}&${qs}`);
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
                const { begins_at, open_price, close_price, high_price, low_price, trend } = hist;
                return { begins_at, trend };
            }), 'begins_at', 'desc')).length,
        };
    });
};
