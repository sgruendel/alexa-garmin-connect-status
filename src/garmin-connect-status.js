'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');

const gcRequest = request.defaults({
    baseUrl: 'http://static.garmin.com',
    gzip: true,
});

function parseServiceDiv(i, div) {
    const $ = cheerio.load(div);
    const item = $('div.item', div).text().trim();
    const statusReasons = $('div.status-reasons', div).text().trim();
    return { item: item, statusReasons: statusReasons };
}

var exports = module.exports = {};

exports.parseBody = (body) => {
    const $ = cheerio.load(body);

    const green = $('div.service.green').map(parseServiceDiv).toArray();
    const yellow = $('div.service.yellow').map(parseServiceDiv).toArray();
    const red = $('div.service.red').map(parseServiceDiv).toArray();
    return { green: green, yellow: yellow, red: red };
};

exports.getStatus = async function() {
    const options = {
        uri: '/connectstatus/garmin-connect-status-content.html',
    };
    return exports.parseBody(await gcRequest(options));
};
