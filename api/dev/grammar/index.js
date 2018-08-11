const request = require('request');
const cheerio = require('cheerio');
const commonService = require('./../services/commonService');
const _ = require('lodash');
const testRepository = require('./../../src/repository/testRepository');
const categoryRepository = require('./../../src/repository/categoryRepository');

function accessWebsite(pageToVisit, category) {
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

                if (text.indexOf(category) !== -1) {
                    let cateName = (text.trim().replace(/\s/g, "_")).toLocaleLowerCase();
                    let group = "";

                    _.each(['N1', 'N2', 'N3', 'N4', 'N5'], function (item) {
                        if (text.indexOf(item) > -1) {
                            group = item;
                        }
                    });

                    categoryRepository.save({
                        "name": text,
                        "friendlyName": commonService.getUrlFriendlyString(text),
                        "group": group

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
            let testName = $(element).text();
            let formatTestName = (testName.split("–").slice(-1)[0]).trim().replace(/\s/g, "_").toLocaleLowerCase();
            accessDetailOfListeningTest($(element).attr('href'), categoryName, formatTestName, categoryId, testName);
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
 * @param {String} testNameFormat Tên bài. 
 */
function accessDetailOfListeningTest(url, categoryName, testNameFormat, categoryId, testName) {
    request(url, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);

            return;
        }

        let $ = cheerio.load(body);
        let formListening = $("#content .entry form");
        let questions = [];
        let description = "";
        let dir = './files/' + categoryName + "/" + testNameFormat;

        formListening.find('p').each(function (index, element) {
            let question = null;
            var questionAndAnswer = $(element).text().trim();

            if (questionAndAnswer) {
                var array = questionAndAnswer.split("↵")[0].split("\n");

                if (array && array.length > 0) {
                    let array0 = array[0];

                    if (array.length == 1) {
                        if (array0 === "Advertisement") {
                            console.log("ads");
                        }
                        else {
                            description = array0;
                        }
                    }
                    else {
                        let answerArray = array.slice(1, array.length);
                        let tmps = [];

                        _.each(answerArray, function (item) {
                            tmps.push({
                                content: item,
                                isCorrect: false
                            });
                        });

                        question = {
                            content: array0,
                            answers: tmps
                        }

                        questions.push(question);
                    }
                }
            }
        });

        // download transcript.
        let testFile = formListening.next('p').next('p').find('a');
        let transcriptUrl = "";

        if (testFile.text() === "Click here") {
            let testFileUrl = testFile.attr('href');
            console.log(testFileUrl);

            if (testFileUrl && testFileUrl.indexOf(".pdf") > -1) {
                commonService.downloadFile(testFileUrl, {
                    directory: dir,
                    filename: commonService.getNameFileFromUrl(testFileUrl)
                }, function (path) {
                    transcriptUrl = path;
                });
            }
        }

        let test = {
            "title": testName,
            "friendlyName": commonService.getUrlFriendlyString(testName),
            "category": {
                id: categoryId,
                friendlyName: commonService.getUrlFriendlyString(categoryName)
            },
            "type": 2,
            "questions": questions,
            "transcript": transcriptUrl,
            "description": description
        }

        testRepository.creates(test);
    });
}

module.exports = {
    accessWebsite: accessWebsite,
    accessDetailOfListeningTest: accessDetailOfListeningTest,
    getDataListeningTest: getDataListeningTest
}