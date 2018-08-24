let results = [];

const recurseUrl = async (url) => {
    if (url) {
        console.log('Looking at the results ' + results.length);
        reqBody = await Robinhood.url(url);
        results = [...results, ...reqBody.results];
        return await recurseUrl(reqBody.next);
    } else {
        return results;
    }
}

export default recurseUrl;