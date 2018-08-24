import { login } from './rh-action/login';
import { getAccount } from './get-account';
import recurseUrl from './utils/recurse-url';
import saveJSON from './save-json';
import _ from 'lodash';
import getAllStocks from './app-action/get-all-stocks';
import getTrendSinceOpen from './app-action/get-trend-since-open';
// const getMultipleHistoricals = require('./app-action/get-multiple-historicals');
import getMultipleHistoricals from './app-action/get-next-days-of-5%rise';
// 
import mapLimit from 'promise-map-limit';
import delay from 'delay';
import 'es6-promise/auto';

// const blackListStocks = ['MBNAB', 'MBNAA'];

(async () => {
    try {
        const Robinhood = await login();
        global.Robinhood = Robinhood;

        //Get all stocks
        // const allStocks = await getAllStocks();

        const trend = await getTrendSinceOpen(['NOK']);

        console.log(trend);

        //Filter penny stock
        // const pennyStocks = trend.filter(t => t.last_trade_price < 5).map(data => data.ticker);

        // const results = await getMultipleHistoricals(pennyStocks.map(stock => stock.ticker));

        // await Promise.all(
        //     await pennyStocks.map(async ticker => await getMultipleHistoricals(ticker))
        // );
        // console.log(allStocks);
        // mapLimit(allStocks, 3, async ticker => {
        //     await getMultipleHistoricals(ticker);
        // });

        // let allHistorical = await getMultipleHistoricals(pennyStocks);
        // console.log(allHistorical)
        // saveJSON('./json/hiDividends.json', allHistorical);
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

