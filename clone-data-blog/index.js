const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const download = require('download-file');
const commonService = require('./services/commonService');
const _ = require('lodash');

let pageToVisit = "http://japanesetest4you.com/";