import request from 'request';

const getStockData = (ticker, isFull = false) => {
    const outputSize = isFull ? 'full' : 'compact';
    return new Promise((resolve, reject) => {
        request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker + '&outputsize=' + outputSize + '&apikey=KPZ1F0KC6AGLIY4E', (error, res, body) => {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        })
    })
}


export default getStockData;