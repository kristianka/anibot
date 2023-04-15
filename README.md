# anibot
Anibot is a discord bot that notifies user of latest releases from their favourite animes. This bot uses discord.js and data is fetched from SubsPlease RSS feed.

Made with TypeScript, MongoDB and NodeJS.


## How to run

- Visit [Discord Developer Portal](https://discord.com/developers/docs/intro) and create a bot. Choose basic permissions, atleast sending messages. Turn on all the Privileged Gateway Intents options inside "Bot" section.

- Clone this repository to your machine and run ```npm i``` to install dependencies.

- Create .env file and place your discord tokens there. Example:


```
DISCORD_TOKEN= ""
CLIENT_ID= ""
GUILD_ID= ""
RELEASE_CHANNEL_ID= ""
DEV_CHANNEL_ID= ""
LOGS_CHANNEL_ID= ""
DB_CONNECTION_STRING= "" // mongodb connection, see below
```


- Create a MongoDB Atlas account and create a cluster that has ```series``` database and ```data``` collection in there. Press connect, select drivers and copy the ```uri``` value. Make sure to modify the ```<password>``` to be your cluster password. 

- You can list your favourite shows that you want to track to the ```data``` collection. [Here's](https://myanimelist.net/anime/season) a list of airing shows. I recommend connecting with MongoDB compass to the datanase. The schema is the following:

```
{
  "_id": {
    "$oid": "64396564a26ce63fc6fc90ca"
  },
  "name": "Vinland Saga S2",
  "latestEpisode": ""
}
```

where ```id``` will be generated automatically. You need to create ```name``` and ```latestEpisode``` keys, you can leave ```latestEpisode``` empty. Both are strings.

- Build the files with the command ```tsc```. JavaScript files will be created to ```/dist``` folder.

- Run ```node dist/index.js``` inside the repository.

- Done!

**Note!** Make sure to type names correctly, use [rōmaji](https://en.wikipedia.org/wiki/Romanization_of_Japanese) version of names. Season in title are shortened, like "Season 2" to "S2".

## Screenshots

<details>
<summary>Click to see screenshots</summary>
<br>

Bot sending notification of a new release. Runs every five minutes automatically in the background.

<img width="706" alt="Picture of the bot sending a new release message" src="https://user-images.githubusercontent.com/49764796/214304019-fd82a0da-1bf3-453d-8d50-f2b7e80fded2.png">

<br>

```/latest``` command which responds with ten latest releases

<img width="702" alt="image" src="https://user-images.githubusercontent.com/49764796/214304300-fdc3d33e-5536-4d1d-8492-1f47c29b71c4.png">
</details>

## FAQ

- [My timezone or time formatting is wrong!](#my-timezone-or-time-formatting-is-wrong)
- [The bot doesn't work!](#the-bot-doesnt-work)


### My timezone or time formatting is wrong!

Modify the these variables in ```fetchAPI.js``` to your liking:
```
const timezone = "Europe/Helsinki";
const timeFormat = "en-FI";
```

### The bot doesn't work!

Have you made sure that:
- you added the credentials to ```.env```
- mongodb connection is working
- mongodb schema is correct?


## Suggestions
Create an [issue](https://github.com/kristianka/anibot/issues)!
Feel free to fork this and improve it or modify it to your liking.
