
const fs = require('fs');
require('dotenv').config()
const path = require('path');
const dataDirectory = path.join(__dirname, '../data/data.json')

module.exports.reset = async function execute() {

    try {
        const json = JSON.parse("[]");
        fs.writeFile(dataDirectory, JSON.stringify(json), function (err) {
            if (err) throw err;
            console.log('Data.json has been reset.');
        });

    } catch (error) {
        console.log(error);
    }
}

