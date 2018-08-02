"use strict";

const NotificationRepository = require('../../repository/notificationRepository');
const UserRepository  = require('../../repository/userRepository');
const CourseRepository  = require('../../repository/courseRepository');
const SubscribeCourseRepository  = require('../../repository/subscribeCourseRepository');
const log = require('../../../logger').log;

/**
 * even listener create section
 * @param course
 */
function createNotification (course) {
    let notification = {
        user: course.instructor,
        for: 'LECTURER',
        type: 'NEW_SUBSCRIBE',
        course: course
    };

    SubscribeCourseRepository.findByCourse(course.friendlyName)
        .then((subs) => {
            subs.map(sub => {
                UserRepository
                    .addStudentRoleIfNotExist(sub.user)
                    .catch((error) => {
                        log.error(error);
                    })
                    .done();

                UserRepository
                    .findById(sub.user)
                    .then((user) => {
                        notification.from = {name: user.name, username: user.username, photo: user.photo};

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
                    .done()
                ;
            })
        }).catch((error) => {
            log.error(error);
        }).done();


    CourseRepository.increaseEnrollment(course.friendlyName)
        .catch((error) => {
            log.error(error);
        }).done()
    ;

    SubscribeCourseRepository.getDistinctStudentForInstructor(course.instructor.username)
        .then((items) => {
            UserRepository.updateByUsername(course.instructor.username, {students: items.length})
            .catch((error) => {
                log.error(error);
            }).done();
        })
        .catch((error) => {
            log.error(error);
        })
        .done()
    ;
}

module.exports = {
    createNotification: createNotification
};