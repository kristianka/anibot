import axios from "axios";
import xml2js from "xml2js";
import { RssDataInterface, ItemInterface } from "../types.js";

const fetchFromAPI = async () => {
    try {
        const res = await axios.get("https://subsplease.org/rss/?t&r=1080");
        const xml = res.data;
        const parser = new xml2js.Parser();
        return parser.parseStringPromise(xml) as Promise<RssDataInterface>;
    } catch (error) {
        console.log("error in api:", error);
        return null;
    }
};

export const main = async () => {
    const jsonData = await fetchFromAPI();
    if (!jsonData) {
        return null;
    }

    const items: ItemInterface[] = jsonData.rss.channel[0].item;
    return items;
};
