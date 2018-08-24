import chunkApi from '../utils/chunk-api';
import getTrend from '../utils/get-trend';

export default async (stocks) => {
   console.log('multiple')
    let quotes = await chunkApi(
        stocks,
        async (tickerStr) => {
            const { results } = await Robinhood.url(`https://api.robinhood.com/quotes/?symbols=${tickerStr}`);
            return results;
        },
        1630
    );

    let withQuotes = stocks.map((ticker, i) => {
        let quoteData = quotes[i] || {};
        return {
            ticker,
            quote_data: quoteData,
            last_trade_price: Number(quoteData.last_trade_price),
            previous_close: Number(quoteData.previous_close),
            trend_since_prev_close: getTrend(quoteData.last_trade_price, quoteData.previous_close)
        };
    });
    return withQuotes;
}