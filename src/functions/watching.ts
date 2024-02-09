import dotenv from "dotenv";
import mongodb from "mongodb";
import { TextChannel, Client } from "discord.js";
import index from "../index.js";
import { main } from "./fetchFromAPI.js";
import { getDay, getTime } from "../misc.js";

dotenv.config();

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
        const bot: Client = index.Gbot;
        const channel: TextChannel = bot.channels.cache.get(
            process.env.RELEASE_CHANNEL_ID
        ) as TextChannel;

        let max = 5;

        await mongoConnection
            .connect()
            .then(() => console.log("Connected to database"))
            .catch((err) => console.error(`Error connecting to database: ${err}`));

        const showsFromDB = await mongoConnection
            .db("series")
            .collection("data")
            .find({})
            .toArray();

        const items = await main();

        for (let i = 0; i < max; i++) {
            // clear strings
            const rawTitle = items[i].title.toString();
            const category = items[i].category.toString();
            const pubDate = items[i].pubDate.toString();

            const titleWithEpisodeNum = rawTitle.slice(0, -23).slice(13);
            const pubTimeLocal = getTime(pubDate);
            const pubDateLocal = getDay(pubDate);

            const releaseId: string = rawTitle.slice(0, -5).slice(-8);

            // If a batch release then skip and add one to max amount fetched shows
            if (titleWithEpisodeNum.includes("[Batch]")) {
                console.log("Skipping batch", category);
                max += 1;
                continue;
            }

            const showNameWOEpisode = category.slice(0, -7);
            const following = showsFromDB.some((e) => e.name === showNameWOEpisode);

            if (!following) {
                console.log("No new episodes! Latest show was", titleWithEpisodeNum);
                continue;
            }

            // check if showname exists in database, if exists it means that show has been fetched
            // and sent notification already
            const alreadyFetched: boolean = showsFromDB.some(
                (obj) => obj.latestEpisode === releaseId
            );

            if (alreadyFetched) {
                console.log("Already fetched", titleWithEpisodeNum);
                continue;
            }

            console.log(`Sending ${titleWithEpisodeNum} to chat at ${pubTimeLocal}`);
            channel.send(`NEW RELEASE: ${titleWithEpisodeNum} at ${pubTimeLocal}`);

            // mark show as fetched
            await mongoConnection
                .db("series")
                .collection("data")
                .updateOne(
                    { name: { $eq: showNameWOEpisode } },
                    { $set: { latestEpisode: releaseId } }
                );
            await mongoConnection.close();
        }
        await mongoConnection.close();
    } catch (error) {
        console.log("Error sending message: ", error);
        await mongoConnection.close();
    }
}
