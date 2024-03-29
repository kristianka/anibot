/* eslint-disable no-console */
"use strict";

import dotenv from 'dotenv';
dotenv.config();

export default {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const channel = client.channels.cache.get(process.env.LOGS_CHANNEL_ID);

        channel.send("Online! ✅");
    }

};
