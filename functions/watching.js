
const fetchFromAPI = require('./fetchAPI.js');
const index = require("../index.js");
const fs = require('fs');

const path = require('path');
const dataDirectory = path.join(__dirname, '../data/data.json')
const showsDirectory = path.join(__dirname, '../data/shows.json')


module.exports.watching = async function execute() {
    {
        require('dotenv').config()
        try {
            const bot = index.Gbot;
            // get current time on local timezone
            const currentTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const channel = bot.channels.cache.get(process.env.RELEASE_CHANNEL_ID);
            const max = 3;
            for (let i = 0; i < max; i++) {

                let showName = await fetchFromAPI('name', i);
                let pubTime = await fetchFromAPI('time', i);

                // If a batch release then skip and add one to max amount fetched shows
                if (showName.includes("[Batch]")) {
                    console.log("Skipping batch", showName);
                    max += 1;
                }
                else {

                    const shows = JSON.parse(fs.readFileSync(showsDirectory, (err, data) => {
                        if (err) throw err;
                    }));

                    const fetchedShows = JSON.parse(fs.readFileSync(dataDirectory, (err, data) => {
                        if (err) throw err;
                    }));

                    const following = shows.some(e => e === showName);

                    if (following) {

                        // check if showname exists in data.json file, if exists it means that show has been fetched 
                        // and sent notification already
                        const alreadyFetched = fetchedShows.some(e => e === showName);

                        if (!alreadyFetched) {

                            console.log("Sending", showName, "to chat at", currentTime())
                            channel.send('NEW RELEASE: ' + showName + ' at ' + pubTime);
                            fs.readFile(dataDirectory, function (err, data) {
                                if (err) throw err;
                                const json = JSON.parse(data);
                                json.push(showName);
                                fs.writeFile(dataDirectory, JSON.stringify(json), function (err) {
                                    if (err) throw err;
                                    console.log('Data', json, 'has been added to', dataDirectory, 'succesfully!');
                                });
                            })
                        }
                        else {
                            console.log(showName, "has been already fetched!");
                        }
                    } else {
                        console.log("No new episodes! Latest show was", showName, "Finished at", currentTime());
                    }
                }
            }

        } catch (error) {
            console.log("Error sending message: ", error);
        }
    }
}

