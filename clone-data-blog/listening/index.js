const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const commonService = require('./../services/commonService');
const _ = require('lodash');

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
                    
                request.post({
                    url: "http://localhost:3000/api/v1/categories",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: {
                        "name": cateName,
                       "friendlyName": commonService.getUrlFriendlyString(cateName)

                    },
                    json:true
               }, function(error, response, body){
                if(error){
                    console.log(error);

                    return;
                }else{
                    let categoryId = body._id;
                    console.log(categoryId);
                    getDataListeningTest(url, cateName, categoryId);
                }
               });
                }
            });
        }
    });
}

// let cateName = (("JLPT N5 listening test").trim().replace(/\s/g, "_")).toLocaleLowerCase();
// let urlTest1 = "http://japanesetest4you.com/category/infographics/phrases-for-daily-use/";
// let urlTest2 = "http://japanesetest4you.com/category/jlpt-n5/jlpt-n5-listening-test/";
// getDataListeningTest(urlTest1, cateName);

function getDataListeningTest(url, categoryName,categoryId) {
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
                        console.log(url + "page/" + i + '/');
                        getDataListeningTest(url + "page/" + i + '/', categoryName, categoryId);
                    }
                }
            }
            else {
                pagenavi.find('a.page').each(function (index, element) {
                    let page = $(element).text();

                    if (parseInt(page) > parseInt(currentPage)) {
                        let url = $(element).attr('href');
                        console.log(url);
                        getDataListeningTest(url, categoryName, categoryId);
                    }
                });
            }
        }
    });
}


// accessDetailOfListeningTest("http://japanesetest4you.com/japanese-language-proficiency-test-jlpt-n5-listening-exercise-10/", "jlpt_n5_listening_test", "hihi");

/**
 * Access to detail page.
 * @param {String} url 
 * @param {String} categoryName 
 * @param {String} subCate Tên bài. 
 */
function accessDetailOfListeningTest(url, categoryName, subCate, categoryId,questionName) {
    request(url, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);

            return;
        }

        let $ = cheerio.load(body);
        let formListening = $("#content .entry form");

        // create folder.
        let dir = './files/' + categoryName + "/" + subCate;
        commonService.mkdirSyncRecursive(dir);

        formListening.find('audio.wp-audio-shortcode').each(function (index, element) {
            let urlAudio = $(element).find('source').attr('src');

            commonService.downloadFile(urlAudio, {
                directory: dir + "/question_" + (index + 1) + '/audio',
                filename: commonService.getNameFileFromUrl(urlAudio)
            }, function (path) {
                request.post({
                    url: "http://localhost:3000/api/v1/questions/createOrUpdate",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: {
                        "title": questionName,
                        "friendlyName": commonService.getUrlFriendlyString(questionName),
                        "category": categoryId,
                        "media": path,
                        "type": 1
                    },
                    json:true
               }, function(error, response, body){
                if(error){
                    console.log(error);

                    return;
                }else{
                    console.log(body);
                }
               });
            });

            let urlImage = "";
            let elementHasDiv = $(element).next('p').next('div');

            if (elementHasDiv.text()) {
                urlImage = elementHasDiv.next('p').find('img').attr('src');
            }
            else {
                urlImage = $(element).next('p').next('p').find('img').attr('src');
            }

            if (urlImage) {
                commonService.downloadFile(urlImage, {
                    directory: dir + "/question_" + (index + 1) + '/image',
                    filename: commonService.getNameFileFromUrl(urlImage)
                }, function (path) {
                    request.post({
                        url: "http://localhost:3000/api/v1/questions/createOrUpdate",
                        headers: {
                           "Content-Type": "application/json"
                        },
                        body: {
                            "title": questionName,
                            "friendlyName": commonService.getUrlFriendlyString(questionName),
                            "category": categoryId,
                            "image": path,
                            "type": 1
                        },
                        json:true
                   }, function(error, response, body){
                    if(error){
                        console.log(error);
    
                        return;
                    }else{
                        console.log(body);
                    }
                   });
                });
            }
        });

        // download transcript.
        let urlTranscript = $("a[title|='View transcript']").attr('href');

        commonService.downloadFile(urlTranscript, {
            directory: dir,
            filename: commonService.getNameFileFromUrl(urlTranscript)
        }, function (path) {
            console.log(path);
        });
    });
}

module.exports = {
    accessWebsite: accessWebsite,
    getDataListeningTest: getDataListeningTest,
    accessDetailOfListeningTest: accessDetailOfListeningTest
}