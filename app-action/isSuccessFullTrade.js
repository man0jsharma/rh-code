import moment from 'moment';

const tradingPercent = 1; // One percent increase
const stopLoss = 1; // one Percent stopLoss
const totalAmount = 100; //$1000


const calculateProfit = (buyPrice, isSuccess) => {
    const numberOfStocks = Math.floor(totalAmount / buyPrice);
    if (isSuccess)
        return +((numberOfStocks * (getSuccessPrice(buyPrice) - buyPrice)).toFixed(2));
    else
        return +((numberOfStocks * (getStopLossPrice(buyPrice) - buyPrice)).toFixed(2));
};

const getSuccessPrice = (buyPrice) => {
    return Number(((buyPrice * tradingPercent / 100) + buyPrice).toFixed(2));
};

const getStopLossPrice = (buyPrice) => {
    return Number((buyPrice - (buyPrice * stopLoss / 100)).toFixed(2));
};



const isSuccessFullTrade = (min10Data, day) => {
    const totalReport = [];
    // console.log(min10Data[0].historical[0]);
    const nextDay = moment(day).tz('UTC').add(1, 'days');
    min10Data.map(stockData => {
        let isSuccessFullTrade = false;
        // console.log('----------------------');
        // console.log(stockData.ticker);
        // console.log(day);
        // console.log(moment(nextDay));
        const historicalByDate = stockData.historical.filter(history => moment(history.begins_at).tz('UTC').isSame(moment(nextDay), 'day'));
        // console.log(historicalByDate.length);
        if(historicalByDate.length === 0){
            console.log({
                error: 'next day error',
                nextDay
            });
            return;
        }
        // console.log(historicalByDate);
        const initialBuyPrice = historicalByDate[0].open_price;
        let tradingEnded = false;
        const resultValue = historicalByDate.reduce((overAll, every10min) => {
            if (every10min.high_price >= getSuccessPrice(initialBuyPrice)) {
                isSuccessFullTrade = true;
                tradingEnded = true;
            }
            if (every10min.low_price <= getStopLossPrice(initialBuyPrice)) {
                isSuccessFullTrade = false;
                tradingEnded = true;
            }
            if (tradingEnded) {
                return overAll || isSuccessFullTrade;
            } else {
                return false;
            }
        }, false);
        totalReport.push({ date: nextDay.toString(), ticker: stockData.ticker, resultValue, profit: calculateProfit(initialBuyPrice, resultValue) });
    });
    return totalReport;
};

export default isSuccessFullTrade;
// console.log(getStopLossPrice(5.47));
// console.log(calculateProfit(5.47, false));