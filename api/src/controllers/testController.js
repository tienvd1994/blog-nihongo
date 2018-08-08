"use strict";

const TestRepository = require('../repository/testRepository');

/**
 *
 * @param req
 * @param res
 * @param next
 */

function list(req, res, next) {
    TestRepository.getList(req.params)
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

function one(req, res, next) {
    TestRepository.findById(req.params.id)
        .then(function (log) {
            res.send(log);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

function create(req, res, next) {
    let data = req.body || {};

    TestRepository.save(data)
        .then(function (log) {
            res.send(log);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

function update(req, res, next) {
    let data = req.body || {};

    if (!data._id) {
        data = Object.assign({}, data, { _id: req.params.id });
    }

    TestRepository.update(data.id, data)
        .then(function (result) {
            res.send(result);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

function getByCategory(req, res, next) {
    TestRepository.findByCategory(req.params.category_friendlyName)
        .then(function (result) {
            res.send(result);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

module.exports = {
    one: one,
    list: list,
    create: create,
    update: update,
    getByCategory: getByCategory,
};
