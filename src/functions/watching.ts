/* eslint-disable no-console */
/* eslint-disable brace-style */
"use strict";

import fetchFromAPI from "./fetchAPI.js";
import index from "../index.js";

import dotenv from 'dotenv';
dotenv.config();

import mongodb from "mongodb";

const uri = process.env.DB_CONNECTION_STRING;

const mongoConnection = new mongodb.MongoClient(uri, {
    serverApi: {
        version: mongodb.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export default async function execute() {

    try {
        const bot = index.Gbot;
        const channel = bot.channels.cache.get(process.env.RELEASE_CHANNEL_ID);
        let max = 3;

        for (let i = 0; i < max; i++) {
            await mongoConnection.connect()
                .then(() => console.log("Connected to database"))
                .catch(err => console.error(`Error connecting to database: ${err}`));

            const showsFromDB = await mongoConnection.db("series").collection("data").find({}).toArray();

            const showNameRaw = await fetchFromAPI("name", i);
            const showName = showNameRaw.slice(0, -24);

            // pubTimes is a string array. 0 is to local date, 1 is to local time and 2 is current local time
            const pubTimes = await fetchFromAPI("time", i);
            const releaseId = showNameRaw.slice(0, -6).slice(-8);

            // If a batch release then skip and add one to max amount fetched shows
            if (showName.includes("[Batch]")) {
                console.log("Skipping batch", showName);
                max += 1;
            } else {

                const showNameWOEpisode = showName.slice(0, -5);
                const following = showsFromDB.some(e => e.name === showNameWOEpisode);

                if (following) {

                    // check if showname exists in database, if exists it means that show has been fetched
                    // and sent notification already
                    const alreadyFetched = showsFromDB.some(obj => obj.latestEpisode === releaseId);

                    if (!alreadyFetched) {
                        try {
                            console.log("Sending", showName, "to chat at", pubTimes[2]);
                            channel.send(`NEW RELEASE: ${showName} at ${pubTimes[1]}`);
                            await mongoConnection.db("series").collection("data").updateOne(
                                { name: { $eq: showNameWOEpisode } },
                                { $set: { latestEpisode: releaseId } }
                            );
                        } catch (err) {
                            console.error(`Error occured while adding ID to database: ${err}`);
                        }
                    }
                    else {
                        console.log(showName, "has been already fetched!");
                    }
                } else {
                    console.log("No new episodes! Latest show was", showName, "Finished at", pubTimes[2]);
                }
            }
            await mongoConnection.close();
        }
    } catch (error) {
        console.log("Error sending message: ", error);
    }
};
