import chunkApi from '../utils/chunk-api';
import getTrend from '../utils/get-trend';
import { orderBy } from 'lodash';
import moment from 'moment';
import convertUtcToET from '../utils/convertUtcToET';
import isWithinWeek from '../utils/isWithinWeek';

const getTopMovers52Weeks = async (tickers, interval = 'interval=day', span = 'span=year') => {
    const allHistoricals = await chunkApi(
        tickers,
        async (tickerStr) => {
            const { results } = await Robinhood.url(`https://api.robinhood.com/quotes/historicals/?symbols=${tickerStr}&${interval}&${span}`);
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

    // return getFormatedHistoricalData();

    const gettopMoversOfYesterday = () => {
        const formatedHistoricalData = getFormatedHistoricalData();

        // console.log(JSON.stringify(formatedHistoricalData));
        // return formatedHistoricalData;
        let ticketResultObject = {};
        const topMoversOfYesterday = [];
        let historicals = [];
        formatedHistoricalData.map(tickerData => {
            const { ticker } = tickerData;
            ticketResultObject.ticker = ticker;
            tickerData.historical.map(history => {
                if (Math.abs(history.trend) > 3 && history.volume >= 100000 && isWithinWeek(moment(history.begins_at))) {
                    const { trend, volume, close_price, begins_at } = history;
                    historicals.push({
                        begins_at: convertUtcToET(begins_at), close_price, trend, volume
                    });
                }
            });
            ticketResultObject.historical = historicals;
            topMoversOfYesterday.push(ticketResultObject);
            ticketResultObject = {};
            historicals = [];
        });
        return topMoversOfYesterday;
    };
    return gettopMoversOfYesterday();

};

export default getTopMovers52Weeks;