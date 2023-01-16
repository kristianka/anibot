
module.exports = async function execute(type, i) {
    let jsonData = {};

    await fetch('https://subsplease.org/rss/?t&r=1080')
        .then(response => response.text())
        .then(function (response) {
            let parseString = require('xml2js').parseString;
            parseString(response, { explicitArray: false }, function (err, result) {
                JSON.stringify(result);
                jsonData = Object.assign({}, result)
                if (err) {
                    console.log(err);
                }
            })
        })
        .catch(error => {
            console.log("error in api? ", error)
        });

    if (type === 'name') {
        let showName = JSON.stringify(jsonData.rss.channel.item[i].title);
        // Clean up the name and timestrings
        showName = showName.toString();
        showName = showName.slice(0, -24);
        showName = showName.slice(14);
        return showName;
    }

    else if (type === 'time') {
        // change these to your local ones
        const timezone = "Europe/Helsinki"
        const timeFormat = "en-FI";
        const pubDayTime = JSON.stringify(jsonData.rss.channel.item[i].pubDate);
        const currentTime = () => new Date().toLocaleTimeString(timeFormat, { timeZone: timezone });
        const toLocateDate = (date) => new Date(date).toLocaleDateString(timeFormat, { timeZone: timezone, weekday: "short" });
        const toLocaleTime = (date) => new Date(date).toLocaleTimeString(timeFormat, { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const dateArray = [toLocateDate(pubDayTime), toLocaleTime(pubDayTime), currentTime()];
        return dateArray;
    }

}