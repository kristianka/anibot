
const fetchFromAPI = require('./fetchAPI.js');
const index = require("../index.js");
const fs = require('fs');
require('dotenv').config()

const path = require('path');
const dataDirectory = path.join(__dirname, '../data/data.json')
const showsDirectory = path.join(__dirname, '../data/shows.json')


module.exports.watching = async function execute() {
    {
        try {
            const bot = index.Gbot;
            const channel = bot.channels.cache.get(process.env.RELEASE_CHANNEL_ID);
            const max = 3;
            for (let i = 0; i < max; i++) {

                const showName = await fetchFromAPI('name', i);
                const pubTimes = await fetchFromAPI('time', i);
                // pubTimes[0] is toLocateDate, [1] is toLocaleTime, [2] is currentLocalTime

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

                    const showNameWOEpisode = showName.slice(0, -5);
                    const following = shows.some(e => e === showNameWOEpisode);

                    if (following) {

                        // check if showname exists in data.json file, if exists it means that show has been fetched 
                        // and sent notification already
                        const alreadyFetched = fetchedShows.some(e => e === showName);

                        if (!alreadyFetched) {

                            console.log("Sending", showName, "to chat at", pubTimes[2]);
                            channel.send('NEW RELEASE: ' + showName + ' at ' + pubTimes[1]);
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
                        console.log("No new episodes! Latest show was", showName, "Finished at", pubTimes[2]);
                    }
                }
            }

        } catch (error) {
            console.log("Error sending message: ", error);
        }
    }
}

