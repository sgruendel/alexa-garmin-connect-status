'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE_URL = 'https://status.garminconnectweb.workers.dev/';

function parseServiceDiv(i, div) {
    const $ = cheerio.load(div);
    const item = $('div.item', div).text().trim();
    const statusReasons = $('div.status-reasons', div).text().trim();
    return { item: item, statusReasons: statusReasons };
}

var exports = module.exports = {};

exports.parseBody = (body) => {
    const $ = cheerio.load(body);

    // Strangely, Garmin Express is shown under "Platforms" but is a separate div ...
    const greenPlatforms = $('div#platforms div.service.green, div#Express.service.green').map(parseServiceDiv).toArray();
    const yellowPlatforms = $('div#platforms div.service.yellow, div#Express.service.yellow').map(parseServiceDiv).toArray();
    const redPlatforms = $('div#platforms div.service.red, div#Express.service.red').map(parseServiceDiv).toArray();

    const greenFeatures = $('div#features div.service.green').map(parseServiceDiv).toArray();
    const yellowFeatures = $('div#features div.service.yellow').map(parseServiceDiv).toArray();
    const redFeatures = $('div#features div.service.red').map(parseServiceDiv).toArray();
    return {
        platforms: {
            green: greenPlatforms, yellow: yellowPlatforms, red: redPlatforms,
        },
        features: {
            green: greenFeatures, yellow: yellowFeatures, red: redFeatures,
        },
    };
};

exports.getStatus = async function() {
    const response = await fetch(BASE_URL + 'garmin-connect-status-content.html');
    return exports.parseBody(await response.text());
};
