import getMultipleHistoricals from './get-multiple-historicals';
import { isWithinAWeek } from '../utils/isWithinWeek';
import isSuccessFullTrade from './isSuccessFullTrade';
import mapLimit from 'promise-map-limit';
import moment from 'moment';

const getTopMoversPerDayForWeek = async (tickers) => {
    const topMoversPerDayForYear = await getMultipleHistoricals(
        tickers,
        'interval=day',
        'span=year'
    );

    const datesOfTheWeek = [];
    // console.log(isWithinAWeek(moment(topMoversPerDayForYear[0].historical[0].begins_at)));
    topMoversPerDayForYear[0].historical.forEach(history => {
        if (isWithinAWeek(moment(history.begins_at)) && !datesOfTheWeek.includes(history.begins_at)) {
            datesOfTheWeek.push(history.begins_at);
        }
    });

    let result = [];

    datesOfTheWeek.forEach(date => {
        let dateObject = {};
        let tickers = [];
        dateObject.date = date;
        topMoversPerDayForYear.forEach(tickerData => {
            const dataForTheDate = tickerData.historical.find(data => data.begins_at === date);
            if (dataForTheDate.trend < 0 // negative trend
                &&
                Math.abs(dataForTheDate.trend) > 3 // big movers
                &&
                dataForTheDate.volume > 100000 // higher volume
            ) {
                tickers.push(`${tickerData.ticker}`);
            }
        });
        dateObject.tickers = tickers;
        result.push(dateObject);
        tickers = [];
        dateObject = {};
    });

    // let totalResult = [];
    // result.forEach(async (tickerData, index) => {
    //     const topMoversPer10minForWeek = await getMultipleHistoricals(
    //         tickerData.tickers,
    //         'interval=10minute',
    //         'span=week'
    //     );
    //     const topMoversPer10minForWeekResult = isSuccessFullTrade(topMoversPer10minForWeek[index]);
    //     console.log(topMoversPer10minForWeekResult);
    //     totalResult.push(topMoversPer10minForWeekResult);
    // });

    // const topMoversPer10minForWeek = await getMultipleHistoricals(
    //     ['NOK'],
    //     'interval=10minute',
    //     'span=week'
    // );

    let totalResult = [];
    // await result.forEach(async (tickerData) => {
    //     const topMoversPer10minForWeek = await getMultipleHistoricals(
    //         tickerData.tickers,
    //         'interval=10minute',
    //         'span=week'
    //     );
    //     const topMoversPer10minForWeekResult = isSuccessFullTrade(topMoversPer10minForWeek, tickerData.date);
    //     totalResult.push(topMoversPer10minForWeekResult);
    // });
    // console.log('result', result);
    await mapLimit(result, 1, async (tickerData) => {
        console.log('tickerData',tickerData);
        const topMoversPer10minForWeek = await getMultipleHistoricals(
            tickerData.tickers,
            'interval=10minute',
            'span=week'
        );
        const topMoversPer10minForWeekResult = isSuccessFullTrade(topMoversPer10minForWeek, tickerData.date);
        totalResult.push(topMoversPer10minForWeekResult);
    });

    // const chunkResult = chunk(topMoversPer10minForWeek[0].historical, 39);

    // const topMoversPer10minForWeekResult = isSuccessFullTrade(topMoversPer10minForWeek);
    // console.log(topMoversPer10minForWeekResult);
    // totalResult.push(topMoversPer10minForWeekResult);
    return {
        totalResult
        // chunkResult
    };
};

export default getTopMoversPerDayForWeek;