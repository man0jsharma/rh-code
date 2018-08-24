import recurseUrl from '../utils/recurse-url';
import { save } from '../utils/json-mgr';

const getAllStocks = async () => {
    let allTickers = [];
    try {
        allTickers = require('../json/stock-data/allStocks');
    } catch (e) {
        allTickers = await recurseUrl('https://api.robinhood.com/instruments/');
        allTickers = allTickers
            .filter(stock => stock.tradeable && stock.tradability === 'tradable')
            .map(stock => stock.symbol);

        await save('./json/stock-data/allStocks.json', allTickers);
    }
    return allTickers;
};

export default getAllStocks;
