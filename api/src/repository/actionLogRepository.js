"use strict";

const ActionLog = require('../models/actionLog');
const Q         = require('q');
const errors     = require('restify-errors');
const StringService = require('../services/stringService');
const log = require('../../logger').log;
/**
 * 
 * @param {*} id 
 * @returns {*|promise}
 */  
function findById(id) {
    const deferred = Q.defer();

    ActionLog.findOne({ _id : id },function(err, actionLog) {
        if (err) {
            log.error(err);
            deferred.reject(new errors.InvalidContentError(err.message))
        } else if (!actionLog){
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
 * @param {*} user 
 * @returns {*|promise}
 */
function findByUser(user) {
    const deferred = Q.defer();

    ActionLog.find({ user: user },function(error, logs) {
        if(error){
            log.error(error);
            deferred.reject(new errors.InvalidContentError(error.message))
        } else {
            deferred.resolve(logs);
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

    ActionLog.apiQuery(params, function(error, logs) {
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
function save(data, request) {
    const deferred = Q.defer();

    let actionLog = new ActionLog(data);

    actionLog.ip = StringService.getClientIpV4(request);

    actionLog.save(function(err, actionLog) {
        if (err) {
            log.error(err);
            deferred.reject(
                new errors.InvalidContentError(err.message)
            );
        } else {
            deferred.resolve(actionLog);
        }

    });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    findByUser: findByUser,
    getList: getList,
    save: save
};