import getTopMoversPerDayForWeek from './getTopMoversPerDayForWeek';
import saveJSON from '../save-json';
import { login } from '../rh-action/login';

(async () => {
    const Robinhood = await login();
    global.Robinhood = Robinhood;
    const getTopMovers52WeeksResult = await getTopMoversPerDayForWeek(
        ['CKPT']
    );
    saveJSON('./json/getTopMovers52Weeks.json', getTopMovers52WeeksResult);
})();