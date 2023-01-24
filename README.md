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

Have you:
- added your credentials to ```.env```
- created a ```data``` folder where there are two files, ```shows.json``` and ```data.json```
- added titles to ```shows.json``` and inserted ```[]``` to ```data.json```?

If ```/latest``` works you might have invalid shows in ```shows.json```.


## Suggestions
Create an [issue](https://github.com/kristianka/anibot/issues)!
Feel free to fork this and improve it or modify it to your liking.
