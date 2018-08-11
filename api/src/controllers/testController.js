"use strict";

const TestRepository = require('../repository/testRepository');

/**
 *
 * @param req
 * @param res
 * @param next
 */

function list(req, res, next) {
    let page = parseInt(req.params.page);
    let per_page = parseInt(req.params.per_page);

    TestRepository.getList(page, per_page)
        .then(function (tests) {
            res.send([tests]);
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
        .then(function (test) {
            res.send(test[0]);
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
    let page = parseInt(req.params.page);
    let per_page = parseInt(req.params.per_page);

    TestRepository.findByCategory(req.params.category_friendlyName, page, per_page)
        .then(function (result) {
            res.send([result]);
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
