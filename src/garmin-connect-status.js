'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE_URL = 'https://static.garmincdn.com/';

function parseServiceDiv(i, div) {
    const $ = cheerio.load(div);
    const item = $('div.item', div).text().trim();
    const statusReasons = $('div.status-reasons', div).text().trim();
    return { item: item, statusReasons: statusReasons };
}

function divReducer(uniques, div) {
    const isDuplicate = uniques.find(uniqueDiv => uniqueDiv.item === div.item);
    return isDuplicate ? uniques : [...uniques, div];
}

var exports = module.exports = {};

exports.parseBody = (body) => {
    const $ = cheerio.load(body);

    const green = $('div.service.green').map(parseServiceDiv).toArray().reduce(divReducer, []);
    const yellow = $('div.service.yellow').map(parseServiceDiv).toArray().reduce(divReducer, []);
    const red = $('div.service.red').map(parseServiceDiv).toArray().reduce(divReducer, []);
    return { green: green, yellow: yellow, red: red };
};

exports.getStatus = async function() {
    const response = await fetch(BASE_URL + 'connectstatus/garmin-connect-status-content.html');
    return exports.parseBody(await response.text());
};
