import moment from 'moment-timezone';

const convertUtcToET = (dateStr) => {
    let localTime = moment.utc(dateStr).toDate();
    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
};

export default convertUtcToET;