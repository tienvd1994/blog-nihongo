"use strict";

const ActionLogRepository = require('../repository/actionLogRepository');

/**
 *
 * @param req
 * @param res
 * @param next
 */

 function list(req, res, next) {
    ActionLogRepository.getList(req.params)
        .then(function (logs) {
            res.send(logs);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */

 function one(req,res,next){
    ActionLogRepository.findById(req.params.logs_id)
        .then(function(log){
            res.send(log);
            next();
        })
        .catch(function(error){
            console.log(error);
            return next(error);
        })
        .done();
 }

 module.exports = {
     one: one,
     list: list
 };
