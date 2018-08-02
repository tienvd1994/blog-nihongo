"use strict";

const NotificationRepository = require('../../repository/notificationRepository');
const CourseRepository = require('../../repository/courseRepository');
const log = require('../../../logger').log;

/**
 * even listener create section
 * @param user
 * @param course
 */
function createNotification (user, course) {
    let notification = {
        from: user,
        for: 'LECTURER',
        type: 'NEW_QUESTION',
        course: course
    };

    CourseRepository.findByFriendlyName(course.friendlyName)
        .then((course) => {

            notification.user = course.instructor;
            NotificationRepository.save(notification)
                .then(function (notify) {
                    log.info(`new ${notification.for} notification of type ${notification.type} sent to ${notification.user.name}`);
                })
                .catch(function (error) {
                    log.error(error);
                }).done();
        })
        .catch((error) => {
            log.error(error);
        })
        .done();

}

module.exports = {
    createNotification: createNotification
};