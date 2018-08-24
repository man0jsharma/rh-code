const getAccount = async (callback) => {
    await Robinhood.accounts((err, response, body) => {
        if(err){
            console.error(err);
        }else{
            callback(body);
        }
    });
}

module.exports = {
    getAccount
}