const fs = require('mz/fs');

const saveJSON = async (fileName, obj) => {
    try {
        await fs.writeFile(fileName, JSON.stringify(obj, null, 2));
    }
    catch (err) {
        console.error(err);
    }
};

module.exports = saveJSON;