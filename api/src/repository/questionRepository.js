"use strict";

const Question = require('../models/question');
const Q = require('q');
const errors = require('restify-errors');
const log = require('../../logger').log;
/**
 * 
 * @param {*} id 
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    Question.findOne({ _id: id }, function (err, actionLog) {
        if (err) {
            log.error(err);
            deferred.reject(new errors.InvalidContentError(err.message))
        } else if (!actionLog) {
            deferred.reject(new errors.ResourceNotFoundError(
                'The resource you requested could not be found.'
            ));
        } else {
            deferred.resolve(actionLog)
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

    Question.apiQuery(params, function (error, logs) {
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
    let question = new Question(data);
    question.save(function (err, question) {
        if (err) {
            log.error(err);
            deferred.reject(
                new errors.InvalidContentError(err.message)
            );
        } else {
            deferred.resolve(question);
        }

    });

    return deferred.promise;
}

function update(id, data) {
    const deferred = Q.defer();

    data = _.omit(data, ['createdAt', 'updatedAt', '_id', '__v']);

    Question.update({ _id: id }, data, function (error, question) {
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

    Question.findOne({ friendlyName: friendlyName }, function (err, result) {
        if (err) {
            log.error(err);
            deferred.reject(new errors.InvalidContentError(err.message))
        } else {
            deferred.resolve(result)
        }
    });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    save: save,
    update: update,
    findByFriendlyName: findByFriendlyName
};