import mapLimit from 'promise-map-limit';

const splitIntoChunks = (array, size) => {
    const cloned = array.slice();
    var splitUp = [];
    while (cloned.length > 0)
        splitUp.push(cloned.splice(0, size));
    return splitUp;
};

function flatten(array) {
    return array.reduce((r, e) => Array.isArray(e) ? r = r.concat(flatten(e)) : r.push(e) && r, [])
}

export default async (tickers, apiFn, num) => {
    let nestedArray = await mapLimit(splitIntoChunks(tickers, num), 3, async collection => {
        return await apiFn(collection.join(','));
    });
    return flatten(nestedArray);
};
