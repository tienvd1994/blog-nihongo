"use strict";

const config = require('../../config');

/**
 * convert vietnamese to english, case-sensitive
 * @param str
 * @returns {XML|string|*}
 */
function convertViToEn(str)
{
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim();

    return str;
}

/**
 * return friendly url
 * @param str
 * @returns {string}
 */
function getUrlFriendlyString(str)
{
    str = convertViToEn(str);
    str = str
        .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
        .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
        .replace(/[^a-zA-z\u0400-\u04FF0-9-]+/g, "") // remove almoust all characters except hyphen
        .replace(/[-]+/g, "-") // replace multiple hyphens
        .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphen

    return str.toLowerCase();
}

/**
 *
 * @param total
 * @returns {string}
 */
function generateCertificateCodeNumber(total) {
    let number = total + 1;
    if (number < 10) {
        number = `00${number}`
    } else if (number < 100) {
        number = `0${number}`
    }

    let today = new Date();
    let day = today.getUTCDate();
    day = day > 9 ? day.toString() : `0${day}`;

    let month = today.getUTCMonth() + 1;
    month = month > 9 ? month.toString() : `0${month}`;

    let year = today.getUTCFullYear().toString();

    return `MD${day}${month}${year}${number}`
}

function stripHtmlTag(str) {
    if (typeof str === 'string' || str instanceof String) {
        str = str.replace(/\(/g, '&#40;');
        str = str.replace(/\)/g, '&#41;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/{/g, '&#123;');
        str = str.replace(/}/g, '&#125;');
        return str;
    }

    if (Array.isArray(str)) {
        return str.map(item => {
            return stripHtmlTag(item);
        })
    }

    return '';
}

/**
 *
 * @param request
 * @returns {*}
 */
function getClientIpV4(request) {
    let ipParts = request.connection.remoteAddress.split(':');
    return ipParts[ipParts.length -1];
}

function randomString() {
    return Math.random().toString(36).slice(-6);
}

module.exports = {
    getUrlFriendlyString: getUrlFriendlyString,
    generateCertificateCodeNumber: generateCertificateCodeNumber,
    stripHtmlTag: stripHtmlTag,
    convertViToEn: convertViToEn,
    getClientIpV4: getClientIpV4,
    randomString: randomString
};
