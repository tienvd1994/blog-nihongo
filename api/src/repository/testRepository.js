"use strict";

const Test = require('../models/test');
const Q = require('q');
const errors = require('restify-errors');
const log = require('../../logger').log;
const ObjectId = require('mongoose').Types.ObjectId;
const TestSerialzer = require('./../serializers/test');

/**
 * 
 * @param {*} id 
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();
    let condition = {};

    if (ObjectId.isValid(id)) {
        condition = { _id: id };
    } else {
        condition = { friendlyName: id };
    }

    Test.aggregate([
        { $match: condition },
        {
            $lookup: {
                from: "categories",
                localField: "category.id",
                foreignField: "_id",
                as: "categories"
            }
        },
        { $unwind: "$categories" },
        { $addFields: { "category.name": "$categories.name" } },
        { $project: { _id: 1, title: 1, friendlyName: 1, category: 1, questions: 1, transcript: 1, createdAt: 1 } }
    ])
        .exec(function (err, test) {
            if (err) {
                log.error(err);
                deferred.reject(new errors.InvalidContentError(err.message))
            } else {
                deferred.resolve(test)
            }
        });

    return deferred.promise;
}

/**
 *
 * @param params
 * @returns {*|promise}
 */
function getList(params) {
    const deferred = Q.defer();

    Test.apiQuery(params, function (error, logs) {
        if (error) {
            log.error(error);
            deferred.reject(
                new errors.InvalidContentError(error.message)
            );
        } else {
            deferred.resolve(logs);
        }
    });

    return deferred.promise;
}

/**
 * 
 * @param {*} data
 * @param {*} request
 * @returns {*|promise}
 */
function save(data) {
    const deferred = Q.defer();
    let question = new Test(data);
    question.save(function (err, question) {
        if (err) {
            log.error(err);
            deferred.reject(new errors.InvalidContentError(err.message));
        } else {
            deferred.resolve(question);
        }

    });

    return deferred.promise;
}

function update(id, data) {
    const deferred = Q.defer();

    data = _.omit(data, ['createdAt', 'updatedAt', '_id', '__v']);

    Test.update({ _id: id }, data, function (error, question) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(question);
        }
    });

    return deferred.promise;
}

function findByFriendlyName(friendlyName) {
    const deferred = Q.defer();

    Test.findOne({ friendlyName: friendlyName }, function (err, result) {
        if (err) {
            log.error(err);
            // console.log(err);
            deferred.reject(new errors.InvalidContentError(err.message))
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}

function creates(data) {
    let test = new Test(data);
    test.save(function (err, question) {
        if (err) {
            console.log(err);
        } else {
            console.log("created question");
        }

    });
}

function findByCategory(category, page, per_page) {
    const deferred = Q.defer();
    let offset = (page - 1) * per_page;

    Test.aggregate([
        { "$match": { "category.friendlyName": category } },
        {
            $lookup: {
                from: "categories",
                localField: "category.id",
                foreignField: "_id",
                as: "categories"
            }
        },
        { $unwind: "$categories" },
        {
            $project: {
                _id: 1,
                title: 1,
                friendlyName: 1,
                createdAt: 1,
                categoryName: "$categories.name"
            }
        },
        { $skip: offset },
        { $limit: per_page }
    ])
        .exec(function (err, result) {
            if (err) {
                log.error(err);
                console.log(err);
                deferred.reject(new errors.InvalidContentError(err.message))
            } else {
                Test.count({ "category.friendlyName": category }, function (error, total) {
                    if (err) {
                        log.error(err);
                        console.log(err);
                        deferred.reject(new errors.InvalidContentError(err.message))
                    }
                    else {
                        deferred.resolve({
                            items: result,
                            totalItems: total
                        });
                    }
                })
            }
        });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    save: save,
    update: update,
    findByFriendlyName: findByFriendlyName,
    creates: creates,
    findByCategory: findByCategory
};