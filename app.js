import { login } from './rh-action/login';
import saveJSON from './save-json';
import getAllStocks from './app-action/get-all-stocks';
import getTrendSinceOpen from './app-action/get-trend-since-open';
import getMultipleHistoricals from './app-action/get-multiple-historicals';
import getYesterdayBigMovers from './app-action/gettopMoversOfYesterday';
import isSuccessFullTrade from './app-action/isSuccessFullTrade';

(async () => {
    try {
        const Robinhood = await login();
        global.Robinhood = Robinhood;

        //Get all stocks
        const allStocks = await getAllStocks();

        const trend = await getTrendSinceOpen(allStocks);

        // console.log(trend);

        //Filter penny stock
        const pennyStocks = trend.filter(t => t.last_trade_price < 5).map(data => data.ticker);

        // const results = await getMultipleHistoricals(pennyStocks.map(stock => stock.ticker));

        // await Promise.all(
        //     await pennyStocks.map(async ticker => await getMultipleHistoricals(ticker))
        // );
        // console.log(allStocks);
        // mapLimit(allStocks, 3, async ticker => {
        //     await getMultipleHistoricals(ticker);
        // });

        let allYesterdayBigMovers = await getYesterdayBigMovers(['NOK']);

        let todayStatus = await getTrendSinceOpen(allYesterdayBigMovers.map(movers => movers.ticker));

        // console.log(allHistorical)
        todayStatus = todayStatus.map(stock => {
            const { ticker, trend_since_prev_close } = stock;
            const yesterdayTrend = allYesterdayBigMovers.find(mover => mover.ticker === stock.ticker);
            return { ticker, trend_since_prev_close, yesterdayTrend: yesterdayTrend.trend };
        });
        saveJSON('./json/allYesterdayBigMovers.json', allYesterdayBigMovers);
        saveJSON('./json/todayStatus.json', todayStatus);

        let min10Data = await getMultipleHistoricals(
            // allYesterdayBigMovers.filter(mover => mover.trend < 0).map(movers => movers.ticker),
            ['NOK'],
            'interval=10minute',
            'span=week'
        );

        saveJSON('./json/min5Data.json', min10Data);
        const totalReport = isSuccessFullTrade(min10Data);
        saveJSON('./json/totalReport.json', totalReport);
        // console.log(results.filter(data => !!data));
    }
    catch (err) {
        console.log(err);
    }
    // await mapLimit(allStocks, 1, async ticker => {
    //     return await getMultipleHistoricals(ticker);
    // });
    // let results = await getMultipleHistoricals('DNR');
    // results = await getMultipleHistoricals('SENS');
    // results = await getMultipleHistoricals('NEPT');
    // results = await getMultipleHistoricals('CERC');
    // results = await getMultipleHistoricals('DNR');
    // results = await getMultipleHistoricals('DNR');
    //Save JSON
    // console.log(nestedArray);


    // saveJSON('./json/hiDividends.json', results);

    // console.log(pennyStocks.length);
})();

