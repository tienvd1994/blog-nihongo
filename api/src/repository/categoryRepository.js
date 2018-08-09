"use strict";

const Category = require('../models/category');
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

    Category.findOne({ _id: id }, function (err, actionLog) {
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

    Category.find(params)
        .sort({ "orderNo": 1 })
        .exec(function (error, categories) {
            if (error) {
                log.error(error);
                deferred.reject(
                    new errors.InvalidContentError(error.message)
                );
            } else {
                deferred.resolve(categories);
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
    let question = new Category(data);
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

    Category.update({ _id: id }, data, function (error, question) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(question);
        }
    });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    save: save,
    update: update
};