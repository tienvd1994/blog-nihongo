const request = require('request');
const cheerio = require('cheerio');
const commonService = require('./../services/commonService');
const _ = require('lodash');
const testRepository = require('./../../src/repository/testRepository');
const categoryRepository = require('./../../src/repository/categoryRepository');
// const mongoose = require('mongoose');
// const config = require('../../config');

// // establish connection to mongodb
// mongoose.Promise = global.Promise;
// mongoose.connect(config.db.uri, { auth: config.db.auth });
// const db = mongoose.connection;

// db.on('error', (err) => {
//     console.error(err);
//     process.exit(1);
// });

function accessWebsite(pageToVisit) {
    request(pageToVisit, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);

            return;
        }

        if (response.statusCode === 200) {
            // Parse the document body
            let $ = cheerio.load(body);

            $('#categories-2 ul li a').each(function (index, element) {
                let $element = $(element);
                let text = $element.text();
                let url = $element.attr("href");

                if (text.indexOf("listening test") !== -1) {
                    let cateName = (text.trim().replace(/\s/g, "_")).toLocaleLowerCase();

                    categoryRepository.save({
                        "name": text,
                        "friendlyName": commonService.getUrlFriendlyString(text)

                    })
                        .then(function (rs) {
                            console.log("created category");
                            getDataListeningTest(url, cateName, rs._id);
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .done();
                }
            });
        }
    });
}

function getDataListeningTest(url, categoryName, categoryId) {
    request(url, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);
            return;
        }

        let $ = cheerio.load(body);

        // access to detail page.
        $('#content .post > .title > a').each(function (index, element) {
            let questionName = $(element).text();
            let subCate = (questionName.split("–").slice(-1)[0]).trim().replace(/\s/g, "_").toLocaleLowerCase();
            accessDetailOfListeningTest($(element).attr('href'), categoryName, subCate, categoryId, questionName);
        });

        // check has pagition.
        let pagenavi = $('#content .navigation .wp-pagenavi');

        if (pagenavi.text()) {
            let currentPage = parseInt(pagenavi.find('span.current').text());
            let maxPage = 0;

            if (pagenavi.find('a.last').text()) {
                let filter = _.filter((pagenavi.find('a.last').attr('href')).split('/'), (item) => {
                    return item;
                });

                maxPage = parseInt(filter.slice(-1)[0]);

                if (currentPage < maxPage) {
                    for (let i = (currentPage + 1); i <= maxPage; i++) {
                        getDataListeningTest(url + "page/" + i + '/', categoryName, categoryId);
                    }
                }
            }
            else {
                pagenavi.find('a.page').each(function (index, element) {
                    let page = $(element).text();

                    if (parseInt(page) > parseInt(currentPage)) {
                        let url = $(element).attr('href');
                        getDataListeningTest(url, categoryName, categoryId);
                    }
                });
            }
        }
    });
}

/**
 * Access to detail page.
 * @param {String} url 
 * @param {String} categoryName 
 * @param {String} subCate Tên bài. 
 */
function accessDetailOfListeningTest(url, categoryName, subCate, categoryId, testName) {

    request(url, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);

            return;
        }

        // console.log(testName);
        let $ = cheerio.load(body);
        let formListening = $("#content .entry form");

        // create folder.
        let dir = './files/' + categoryName + "/" + subCate;
        commonService.mkdirSyncRecursive(dir);
        let questions = [];

        formListening.find('audio.wp-audio-shortcode').each(function (index, element) {
            let urlAudio = $(element).find('source').attr('src');
            let imagePath = "";
            let mediaPath = "";

            commonService.downloadFile(urlAudio, {
                directory: dir + "/question_" + (index + 1) + '/audio',
                filename: commonService.getNameFileFromUrl(urlAudio)
            }, function (path) {
                mediaPath = path;
            });

            let urlImage = "";
            let elementImage = $(element).next('p').next('div');

            if (elementImage.text()) {
                urlImage = elementImage.next('p').find('img').attr('src');
            }
            else {
                urlImage = $(element).next('p').next('p').find('img').attr('src');
            }

            if (urlImage) {
                commonService.downloadFile(urlImage, {
                    directory: dir + "/question_" + (index + 1) + '/image',
                    filename: commonService.getNameFileFromUrl(urlImage)
                }, function (path) {
                    imagePath = path;
                });
            }

            let data = {
                "media": mediaPath,
                "image": imagePath
            };

            let $p = $(element).next('p');
            $p.find('strong').empty();
            let answerString = $p.text();
            let answers = [];

            if (answerString) {
                let answerArray = answerString.trim().replace(/\n|\r/g, "").split(" ");

                if (answerArray.length > 0) {
                    answerArray.forEach(item => {
                        if (item) {
                            answers.push({
                                content: item,
                                isCorrect: false
                            });
                        }
                    });
                }
            }

            data.answers = answers;
            questions.push(data);
        });

        // download transcript.
        let urlTranscript = $("a[title|='View transcript']").attr('href');
        let transcriptUrl = "";

        commonService.downloadFile(urlTranscript, {
            directory: dir,
            filename: commonService.getNameFileFromUrl(urlTranscript)
        }, function (path) {
            transcriptUrl = path;
        });

        let test = {
            "title": testName,
            "friendlyName": commonService.getUrlFriendlyString(testName),
            "category": {
                id: categoryId,
                friendlyName: commonService.getUrlFriendlyString(categoryName)
            },
            "type": 1,
            "questions": questions,
            "transcript": transcriptUrl
        }

        testRepository.creates(test);
    });
}

module.exports = {
    accessWebsite: accessWebsite,
    getDataListeningTest: getDataListeningTest,
    accessDetailOfListeningTest: accessDetailOfListeningTest
}