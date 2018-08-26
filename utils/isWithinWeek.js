import moment from 'moment';
import convertUtcToET from './convertUtcToET';

var REFERENCE = moment(); // fixed just for testing, use moment();
var A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');

export const isWithinAWeek = (momentDate) => {
    return momentDate.isAfter(A_WEEK_OLD);
};

export const isPreviosDays = (prevDay, currentDay) => {
    return moment(currentDay).add(-1, 'days').isSame(moment(prevDay));
};

export const isSameDate = (date1, date2) => {
    return moment(convertUtcToET(date1)).isSame(moment(convertUtcToET(date2), 'day'));
};

console.log(isSameDate('2018-08-20T13:30:00Z', '2018-08-20T12:30:00Z'));

// export default isWithinAWeek;