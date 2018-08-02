"use strict";

const NotificationRepository = require('../../repository/notificationRepository');
const QuestionAnswerRepository = require('../../repository/questionAnswerRepository');
const CourseRepository = require('../../repository/courseRepository');
const log = require('../../../logger').log;

/**
 * even listener create section
 * @param user
 * @param questionId
 */
function createNotification (user, questionId) {
    let notification = {
        from: user,
        for: 'STUDENT',
        type: 'REPLY_QUESTION'
    };

    QuestionAnswerRepository.findById(questionId)
        .then((question) => {
            CourseRepository.findByFriendlyName(question.course.friendlyName)
                .then((course) => {
                    if (course) {
                        notification.course = { name: course.name, friendlyName: course.friendlyName, thumbnail: course.thumbnail };
                        notification.user = question.user;
                        notification.question = questionId;
                        NotificationRepository.save(notification)
                            .then(function (notify) {
                                log.info(`new ${notification.for} notification of type ${notification.type} sent to ${notification.user.name}`);
                            })
                            .catch(function (error) {
                                log.error(error);
                            })
                            .done();
                    }
                })
                .catch((error) => {
                    log.error(error);
                })
                .done()
            ;

        })
        .catch((error) => {
            log.error(error);
        })
        .done();

}

module.exports = {
    createNotification: createNotification
};