import getTrend from '../utils/get-trend';
import chunkApi from '../utils/chunk-api';

const getSingleHistorical = async (ticker, interval = 'interval=day', span = 'span=week') => {
    console.log('tick', ticker);
    // try
    console.log(`https://api.robinhood.com/quotes/historicals/${ticker}/?${interval}`);

    const getHistorical = async ticker => {
        const historicalDailyUrl = `https://api.robinhood.com/quotes/historicals/${ticker}/?interval=10minute&span=5year`;
        let { historicals } = await Robinhood.url(historicalDailyUrl);
        return (historicals.length) ? historicals : null;
    };

    return getHistorical(ticker);

    //     var [fundamentals, quote_data] = await Promise.all([
    //         Robinhood.fundamentals(ticker),
    //         Robinhood.quote_data(ticker)
    //     ]);
    //     fundamentals = fundamentals.results[0];
    //     quote_data = quote_data.results[0];
    // } catch (e) {
    //     console.log(e, 'error getting trend', ticker);
    //     return {};
    // }

    // const { open } = fundamentals;
    // const { last_trade_price, adjusted_previous_close } = quote_data;

    // return {
    //     fundamentals,
    //     quote_data,
    //     open,
    //     last_trade_price,
    //     // previous_close,
    //     trend_since_open: getTrend(last_trade_price, open),
    //     trend_since_prev_close: getTrend(last_trade_price, adjusted_previous_close)
    // };
};

export default getSingleHistorical;