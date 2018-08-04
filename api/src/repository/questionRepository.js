"use strict";

const Question = require('../models/question');
const Q = require('q');
const errors = require('restify-errors');
const log = require('../../logger').log;
const AnswerRepository = require('./answerRepository');

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
            // deferred.reject(
            //     new errors.InvalidContentError(err.message)
            // );
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
            // console.log(err);
            deferred.reject(new errors.InvalidContentError(err.message))
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}

function creates(data) {
    let question = new Question(data);
    question.save(function (err, question) {
        if (err) {
            console.log(err);
        } else {
            console.log("created question");
        }

    });
}

// function creates(list) {
//     list.forEach(function (data) {
//         Question.findOne({ friendlyName: data.friendlyName }, function (error, result) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(result);

//                 if (!result) {
//                     let questionData = {
//                         title: data.title,
//                         friendlyName: data.friendlyName,
//                         category: data.category,
//                         type: data.type
//                     }

//                     let question = new Question(questionData);
//                     question.save(function (err, question) {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             console.log("created question");

//                             let answerData = {
//                                 question: question._id,
//                                 media: data.media,
//                                 image: data.image
//                             }

//                             AnswerRepository.save(answerData)
//                                 .then(function (answer) {
//                                     console.log("created amswer");
//                                 })
//                                 .catch(function (error) {
//                                     // console.log(error);
//                                 })
//                                 .done();
//                         }

//                     });
//                 }
//                 // else {
//                 //     let answerData = {
//                 //         question: result._id,
//                 //         media: data.media,
//                 //         image: data.image
//                 //     }

//                 //     AnswerRepository.save(answerData)
//                 //         .then(function (answer) {
//                 //             console.log("create answer");
//                 //         })
//                 //         .catch(function (error) {
//                 //             console.log(error);
//                 //         })
//                 //         .done();
//                 // }
//             }
//         });
//     });
// }

module.exports = {
    findById: findById,
    getList: getList,
    save: save,
    update: update,
    findByFriendlyName: findByFriendlyName,
    creates: creates
};