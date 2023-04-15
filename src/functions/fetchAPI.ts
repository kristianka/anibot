/* eslint-disable no-undef */
/* eslint-disable func-style */
/* eslint-disable no-console */
"use strict";

import { parseString } from 'xml2js';

interface RssDataInterface {
    rss: {
        channel: {
            item: {
                title: string,
                pubDate: string
            }[]
        }
    }
}
interface fetchAPIInterface {
    showName?: string;
    pubTime?: string[];
}

export default async function execute(type: "name" | "time", i: number): Promise<fetchAPIInterface> {

    async function fetchRssData(): Promise<RssDataInterface | undefined> {
        try {
            const response = await fetch("https://subsplease.org/rss/?t&r=1080");
            const responseText: string = await response.text();
            const result = await new Promise((resolve, reject) => {
                parseString(responseText, { explicitArray: false }, (err, result) => {
                    if (err || !result) {
                        console.log(err);
                        reject(err);
                    }
                    resolve(result);
                });
            });
            return result as RssDataInterface;
        } catch (error) {
            console.log("error in api? ", error);
            return undefined;
        }
    }

    const jsonData: RssDataInterface = await fetchRssData();

    if (jsonData && type === "name") {
        let showName: string = JSON.stringify(jsonData.rss.channel.item[i].title);

        // Clean up the name and timestrings
        showName = showName.toString();
        showName = showName.slice(14);
        console.log(`Showname is ${showName}`);
        return { showName };
    }

    if (jsonData && type === "time") {

        // change these to your local ones
        const timezone = "Europe/Helsinki";
        const timeFormat = "en-FI";

        const pubDayTime: string = JSON.stringify(jsonData.rss.channel.item[i].pubDate);

        const currentLocalTime = () => new Date().toLocaleTimeString(timeFormat, { timeZone: timezone });

        const toLocateDate = date => new Date(date).toLocaleDateString(timeFormat,
            { timeZone: timezone, weekday: "short" });

        const toLocaleTime = date => new Date(date).toLocaleTimeString(timeFormat,
            { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit" });

        const pubTime = [toLocateDate(pubDayTime), toLocaleTime(pubDayTime), currentLocalTime()];

        return { pubTime };
    }
    return null;
}
