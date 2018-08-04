var fs = require('fs');
var https = require('https');

/**
 * Download file.
 * @param {String} url 
 * @param {Object} options 
 */
function downloadFile(url, options, callback) {
    if (!url) {
        return;
    }

    mkdirSyncRecursive(options.directory);

    options = typeof options === 'object' ? options : {}
    options.directory = options.directory ? options.directory : '.'
    var path = options.directory + "/" + options.filename;
    var file = fs.createWriteStream(path);

    var request = https.get(url, function (response) {
        response.pipe(file);
    });

    callback(path);
}

/**
 * Get file name from url of audio.
 * @param {String} url 
 */
function getNameFileFromUrl(url) {
    // console.log(url);
    if (!url) {
        return "";
    }

    let name1 = url.split('/').slice(-1)[0];
    let indexOfName1 = name1.indexOf("?");

    return indexOfName1 !== -1 ? name1.slice(0, indexOfName1) : name1;
}

function mkdirSyncRecursive(directory) {
    var path = directory.replace(/\/$/, '').split('/');
    for (var i = 1; i <= path.length; i++) {
        var segment = path.slice(0, i).join('/');
        segment.length > 0 && !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
    }
};

/**
 * convert vietnamese to english, case-sensitive
 * @param str
 * @returns {XML|string|*}
 */
function convertViToEn(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();

    return str;
}

/**
 * return friendly url
 * @param str
 * @returns {string}
 */
function getUrlFriendlyString(str) {
    str = convertViToEn(str);
    str = str
        .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
        .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
        .replace(/[^a-zA-z\u0400-\u04FF0-9-]+/g, "") // remove almoust all characters except hyphen
        .replace(/[-]+/g, "-") // replace multiple hyphens
        .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphen

    return str.toLowerCase();
}

module.exports = {
    downloadFile: downloadFile,
    getNameFileFromUrl: getNameFileFromUrl,
    mkdirSyncRecursive: mkdirSyncRecursive,
    getUrlFriendlyString: getUrlFriendlyString
}