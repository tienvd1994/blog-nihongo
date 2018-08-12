const grammarlistening = require('./listening');
const grammar = require('./grammar');

const mongoose = require('mongoose');
const config = require('../config');

// establish connection to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri, { auth: config.db.auth });
const db = mongoose.connection;

db.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

let pageToVisit = "http://japanesetest4you.com/";
let listeningUrl = "https://japanesetest4you.com/category/jlpt-n2/jlpt-n2-listening-test/"
let listeningDetailUrl = "https://japanesetest4you.com/japanese-language-proficiency-test-jlpt-n5-listening-exercise-26/";
let categoryId = "5b655105864688410888de37";

// listening.getDataListeningTest(listeningUrl, "xxxx", categoryId);
// listening.accessDetailOfListeningTest(listeningDetailUrl, "Category", "SubCategory", categoryId, "questionName");
// grammar.accessWebsite(pageToVisit);
// "listening test"
// grammar.accessWebsite(pageToVisit, "vocabulary test");
// grammar.accessDetailOfListeningTest("https://japanesetest4you.com/japanese-language-proficiency-test-jlpt-n5-vocabulary-exercise-3/", "cateName", "subName", "asdfsd", "testName");

// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'AIzaSyCSWzc8Gdy-7J0EIeRzMnpaOCeRHc2Rzuk';

// Instantiates a client
const translate = new Translate({
    // projectId: 'tranquil-marker-213010',
    keyFilename: './dev/key-file.json',
});

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const text = 'Hello, world!';
const target = 'vi';

// Translates the text into the target language. "text" can be a string for
// translating a single piece of text, or an array of strings for translating
// multiple texts.
translate
    .translate(text, target)
    .then(results => {
        let translations = results[0];
        translations = Array.isArray(translations)
            ? translations
            : [translations];

        console.log('Translations:');

        translations.forEach((translation, i) => {
            console.log(`${text[i]} => (${target}) ${translation}`);
        });
    })
    .catch(err => {
        console.error('ERROR:', err);
    });