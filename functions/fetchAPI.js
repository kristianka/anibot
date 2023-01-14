
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
        showName = showName.slice(0, -29);
        showName = showName.slice(14);
        showName = showName.toString();
        return showName;
    }

    else if (type === 'time') {
        let pubTime = JSON.stringify(jsonData.rss.channel.item[i].pubDate);
        const toLocalTime = (time) => new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return toLocalTime(pubTime);
    }

}