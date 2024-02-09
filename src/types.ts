export interface RssDataInterface {
    rss: {
        channel: {
            title: string;
            description: string;
            link: string;
            item: [ItemInterface];
        }[];
    };
}

export interface ItemInterface {
    title: string;
    pubDate: string;
    category: string;
}

// really horrible but it discord.js doesn't have a type for this
import { Collection } from "discord.js";
declare module "discord.js" {
    export interface Client {
        commands: Collection<any, any>;
    }
}
