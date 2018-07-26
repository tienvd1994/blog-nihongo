var fs = require('fs');
var http = require('http');

/**
 * Download file.
 * @param {String} url 
 * @param {Object} options 
 */
function downloadFile(url, options) {
    mkdirSyncRecursive(options.directory);

    options = typeof options === 'object' ? options : {}
    options.directory = options.directory ? options.directory : '.'
    var path = options.directory + "/" + options.filename;

    var file = fs.createWriteStream(path);

    var request = http.get(url, function (response) {
        response.pipe(file);
    });
}

/**
 * Get file name from url of audio.
 * @param {String} url 
 */
function getNameFileFromUrl(url) {
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

module.exports = {
    downloadFile: downloadFile,
    getNameFileFromUrl: getNameFileFromUrl,
    mkdirSyncRecursive: mkdirSyncRecursive
}