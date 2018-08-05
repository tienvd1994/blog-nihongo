const listening = require('./listening');

let pageToVisit = "http://japanesetest4you.com/";
let listeningUrl = "https://japanesetest4you.com/category/jlpt-n2/jlpt-n2-listening-test/"
let listeningDetailUrl = "https://japanesetest4you.com/japanese-language-proficiency-test-jlpt-n5-listening-exercise-26/";
let categoryId = "5b655105864688410888de37";

// listening.getDataListeningTest(listeningUrl, "xxxx", categoryId);
// listening.accessDetailOfListeningTest(listeningDetailUrl, "Category", "SubCategory", categoryId, "questionName");
listening.accessWebsite(pageToVisit);