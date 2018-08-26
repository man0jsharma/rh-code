import { login } from './rh-action/login';
import saveJSON from './save-json';
import getAllStocks from './app-action/get-all-stocks';
import getTrendSinceOpen from './app-action/get-trend-since-open';
import {json2excel} from 'js2excel';
// import getTopMovers52Weeks from './app-action/getTopMovers52Weeks';
import getTopMoversPerDayForWeek from './app-action/getTopMoversPerDayForWeek';

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


        // Testing first 10 pennyStock

        // const first10PennyStocks = pennyStocks.slice(0,10);
        const getTopMoversPerDayForWeekResult = await getTopMoversPerDayForWeek(
            pennyStocks
        );

        saveJSON('./json/getTopMovers52Weeks.json', getTopMoversPerDayForWeekResult);

        try {
            json2excel({
                getTopMoversPerDayForWeekResult,
                name: 'user-info-data',
                formateDate: 'yyyy/mm/dd'
            });
        } catch (e) {
            console.error('export error' + e);
        }
        
    }
    catch (err) {
        console.log(err);
    }

})();

