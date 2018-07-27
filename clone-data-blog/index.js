const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const download = require('download-file');
const commonService = require('./services/commonService');
const _ = require('lodash');

var pageToVisit = "http://japanesetest4you.com/";

// request(pageToVisit, function (error, response, body) {
//     if (error) {
//         console.log("Error: " + error);

//         return;
//     }

//     if (response.statusCode === 200) {
//         // Parse the document body
//         let $ = cheerio.load(body);

//         // $('#categories-2 ul li a').each(function (index, element) {
//         //     let $element = $(element);
//         //     let text = $element.text();
//         //     let url = $element.attr("href");

//         //     if (text.indexOf("listening test") !== -1) {
//         //         getDataListeningTest(url);
//         //     }
//         // });

//         // getDataListeningTest("http://japanesetest4you.com/category/jlpt-n5/jlpt-n5-listening-test/");
//     }
// });

let cateName = (("JLPT N5 listening test").trim().replace(/\s/g, "_")).toLocaleLowerCase();

let urlTest1 = "http://japanesetest4you.com/category/jlpt-n2/page/3/";
let urlTest2 = "http://japanesetest4you.com/category/jlpt-n5/jlpt-n5-listening-test/";
getDataListeningTest(urlTest1, cateName);

function getDataListeningTest(url, categoryName) {
    request(url, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);
            return;
        }

        let $ = cheerio.load(body);

        // access to detail page.
        $('#content .post > .title > a').each(function (index, element) {
            let subCateName = ($(element).text().split("–").slice(-1)[0]).trim().replace(/\s/g, "_").toLocaleLowerCase();
            accessDetailOfListeningTest($(element).attr('href'), categoryName, subCateName);
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
                    }
                }
            }
            else {
                pagenavi.find('a.page').each(function (index, element) {
                    let page = $(element).text();

                    if (parseInt(page) > parseInt(currentPage)) {
                        let url = $(element).attr('href');
                        console.log(url);
                        // getDataListeningTest("http://japanesetest4you.com/category/jlpt-n5/jlpt-n5-listening-test/", cateName);
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
 * @param {String} subCateName Tên bài. 
 */
function accessDetailOfListeningTest(url, categoryName, subCateName) {
    request(url, function (error, response, body) {
        if (error) {
            console.log("Error: " + error);

            return;
        }

        let $ = cheerio.load(body);
        let formListening = $("#content .entry form");

        // create folder.
        let dir = './files/' + categoryName + "/" + subCateName;
        commonService.mkdirSyncRecursive(dir);

        formListening.find('audio.wp-audio-shortcode').each(function (index, element) {
            let urlAudio = $(element).find('source').attr('src');

            commonService.downloadFile(urlAudio, {
                directory: dir + "/question_" + (index + 1) + '/audio',
                filename: commonService.getNameFileFromUrl(urlAudio)
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
                });
            }
        });

        // download transcript.
        let urlTranscript = $("a[title|='View transcript']").attr('href');

        commonService.downloadFile(urlTranscript, {
            directory: dir,
            filename: commonService.getNameFileFromUrl(urlTranscript)
        });
    });
}