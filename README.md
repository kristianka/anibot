# anibot
Anibot is a discord bot that notifies user of latest releases from their favourite animes. This bot uses discord.js and data is fetched from SubsPlease RSS feed.

Made with node.js using minimal amount of npm modules. 


## How to run

- Visit [Discord Developer Portal](https://discord.com/developers/docs/intro) and create a bot. Choose basic permissions, atleast sending messages. Turn on all the Privileged Gateway Intents options inside "Bot" section.

- Clone this repository to your machine.

- Create .env file and place your discord tokens there. Example:
```
DISCORD_TOKEN= "xx"
CLIENT_ID= "xx"
GUILD_ID= "xx"
RELEASE_CHANNEL_ID= "xx" // id of channel where you want bot to notify
DEV_CHANNEL_ID= "xx" // test channel for /slash commands
```


- Create a data.json file inside /data/ folder and insert ```[]``` to there. 

- Create a shows.json where you list your favourite shows that you want to track. [Here's](https://myanimelist.net/anime/season) a list of  airing shows.
 Example: 
```
[
    "Vinland Saga S2",
    "Mobile Suit Gundam - The Witch from Mercury",
]
```
- In repository run node index.js.

- Done!

**Note!** Make sure to type names correctly, use [rōmaji](https://en.wikipedia.org/wiki/Romanization_of_Japanese) version of names. SubsPlease shortens seasons in title, like "Season 2" to "S2". If you are unsure, you can check their [RSS feed](https://subsplease.org/rss/?t&r=1080) for correct spelling.


Suggestions? Create an [issue](https://github.com/kristianka/anibot/issues)!
