"use strict";

let http = require('http');

const ELITE_PROSPECTS_URL = 'http://www.eliteprospects.com/player.php?player='

const PLAYER_NAME_TAG = '<span id="fontHeader">'
const BIRTHDAY_TAG = /\<a href\=\"birthdate\.php\?Birthdate\=.*\"\>/g
const POSITION_TAG = '<span id="fontSmall">POSITION</span>';
const HEIGHT_TAG = '<span id="fontSmall">HEIGHT</span>';
const WEIGHT_TAG = '<span id="fontSmall">WEIGHT</span>';
const TD_TAG = '<td>';

const SPAN_END_TAG = '</span>';
const ANCHOR_END_TAG = '</a>';
const TD_END_TAG = '</td>';

const BIRTHDAY_SEPARATOR = '-';

module.exports = exports = function(id, callback)
{
    httpGet(createEliteProspectsUrl(id), (err, response, body) => {
        let nameOpenTagIndex = body.indexOf(PLAYER_NAME_TAG) + PLAYER_NAME_TAG.length;
        let nameEndTagIndex = body.indexOf(SPAN_END_TAG, nameOpenTagIndex);
        let playerName = body.substring(nameOpenTagIndex, nameEndTagIndex).trim();

        let birthdayOpenTagIndex = body.indexOf('>' , body.regexIndexOf(BIRTHDAY_TAG, nameEndTagIndex))+1;
        let birthdayEndTagIndex = body.indexOf(ANCHOR_END_TAG, birthdayOpenTagIndex);
        let birthday = body.substring(birthdayOpenTagIndex, birthdayEndTagIndex).split(BIRTHDAY_SEPARATOR);

        let positionLabelOpenTagIndex = body.indexOf(POSITION_TAG, birthdayEndTagIndex);
        let positionOpenTagIndex = body.indexOf(TD_TAG, positionLabelOpenTagIndex) + TD_TAG.length;
        let positionEndTagIndex = body.indexOf(TD_END_TAG, positionOpenTagIndex);
        let position = body.substring(positionOpenTagIndex, positionEndTagIndex);

        let heightLabelOpenTagIndex = body.indexOf(HEIGHT_TAG, positionEndTagIndex);
        let heightOpenTagIndex = body.indexOf(TD_TAG, heightLabelOpenTagIndex) + TD_TAG.length;
        let heightEndTagIndex = body.indexOf(TD_END_TAG, heightOpenTagIndex);
        let heightSet = body.substring(heightOpenTagIndex, heightEndTagIndex).split(/\s\/\s/g);
        let height = heightStringToInches(heightSet[1]);

        let weightLabelOpenTagIndex = body.indexOf(WEIGHT_TAG, heightEndTagIndex);
        let weightOpenTagIndex = body.indexOf(TD_TAG, weightLabelOpenTagIndex) + TD_TAG.length;
        let weightEndTagIndex = body.indexOf(TD_END_TAG, weightOpenTagIndex);
        let weightSet = body.substring(weightOpenTagIndex, weightEndTagIndex).split(/\s\/\s/g);
        let weight = parseInt(weightSet[1].split(/\s/g)[0]);

        callback({
            name: playerName,
            birthday: new Date(parseInt(birthday[0]), parseInt(birthday[1]), parseInt(birthday[2])),
            position: position,
            height: height,
            weight: weight,
        })
    })
}

function httpGet(url, cb)
{
    let body = '';
    http.get(url, (response) => {
        response.on('data', (data) => {
            body += data;
        }).on('end', () => {
            cb(null, response, body);
        });
    }).on('error', cb);
}

function createEliteProspectsUrl(id)
{
    return ELITE_PROSPECTS_URL + id;
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

function heightStringToInches(s)
{
    let heightInfo = s.split(/['"]/g);
    return parseInt(heightInfo[0])*12 + parseInt(heightInfo[1]);
}
