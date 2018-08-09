const listening = require('./listening');
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
grammar.accessWebsite(pageToVisit);