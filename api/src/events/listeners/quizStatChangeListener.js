"use strict";

const QuizStatRepository = require('../../repository/quizStatRepository');
const LectureRepository = require('../../repository/lectureRepository');
const log = require('../../../logger').log;
const _ = require('lodash');

/**
 * even listener add new question
 * @param lecture
 * @param questionId
 */

function updateQuizStat(lectureId, questionId) {
    QuizStatRepository.findAllByLecture(lectureId)
        .then(function (items) {
            let quizStatItem = {};
            _.forEach(items, function (item) {
                quizStatItem = item.toObject();

                quizStatItem.isPassed = false;
                quizStatItem.quizSummary.skipped.push({_id: questionId});

                QuizStatRepository.update(item._id, quizStatItem)
                    .catch((error) => {
                        log.error(error);
                    }).done();
            });

        })
        .catch(function (error) {
            log.error(error);
        }).done();

}

/**
 *
 * @param lectureId
 * @param quizStatId
 * @returns {*|promise}
 */
function removeByLecture(lectureId) {
    QuizStatRepository.findAllByLecture(lectureId)
        .then(function (items) {
            _.forEach(items, function (item) {
                QuizStatRepository.remove(item._id)
                    .catch((error) => {
                        log.error(error);
                    }).done();
            });

        })
        .catch(function (error) {
            log.error(error);
        }).done();
}

/**
 *
 * @param lectureId
 * @param questionId
 * @returns {*|promise}
 */
function remove(lectureId, questionId) {
    QuizStatRepository.findAllByLecture(lectureId)
        .then(function (items) {
            _.forEach(items, function (item) {
                if (_.some(item.quizSummary.correct, {_id: questionId})) {
                    _.pullAllWith(item.quizSummary.correct, [{'_id': questionId}], _.isEqual);
                }

                if (_.some(item.quizSummary.skipped, {_id: questionId})) {
                    _.pullAllWith(item.quizSummary.skipped, [{'_id': questionId}], _.isEqual);
                }

                if (_.some(item.quizSummary.wrong, {_id: questionId})) {
                    _.pullAllWith(item.quizSummary.wrong, [{'_id': questionId}], _.isEqual);
                }

                item.isPassed = item.quizSummary.skipped.length === 0 && item.quizSummary.wrong.length === 0;
                QuizStatRepository.update(item._id, item.toObject())
                    .catch((error) => {
                        log.error(error);
                    }).done();
            });

        })
        .catch(function (error) {
            log.error(error);
        }).done();

}

module.exports = {
    updateQuizStat: updateQuizStat,
    removeByLecture: removeByLecture,
    remove: remove
};