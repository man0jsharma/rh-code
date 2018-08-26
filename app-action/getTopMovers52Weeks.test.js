import getTopMovers52Weeks from './getTopMovers52Weeks';
import saveJSON from '../save-json';
import { login } from '../rh-action/login';

(async () => {
    const Robinhood = await login();
    global.Robinhood = Robinhood;
    const getTopMovers52WeeksResult = await getTopMovers52Weeks(
        ['CKPT'],
        'interval=day',
        'span=year'
    );
    saveJSON('./json/getTopMovers52Weeks.json', getTopMovers52WeeksResult);
})();