"use strict";

const NotificationRepository = require('../../repository/notificationRepository');
const UserRepository = require('../../repository/userRepository');
const SubscribeCourseRepository = require('../../repository/subscribeCourseRepository');
const WishListRepository = require('../../repository/wishListRepository');
const CourseRepository = require('../../repository/courseRepository');

const log = require('../../../logger').log;

/**
 * even listener create section
 * @param user
 * @param course
 */
function priceUpdated (course) {
    let notification = {
        for: 'STUDENT',
        type: 'COURSE_PRICE_UPDATED',
        course: course
    };

    WishListRepository.findByCourse(course.friendlyName)
        .then((wishlist) => {
            wishlist.map(wish => {
                notification.user = wish.user;
                NotificationRepository.save(notification)
                    .then(function (notify) {
                        log.info(`new ${notification.for} notification of type ${notification.type} sent to ${notification.user.name}`);
                    })
                    .catch(function (error) {
                        log.error(error);
                    }).done();
            });
        })
        .catch((error) => {
            log.error(error);
        })
        .done();

    SubscribeCourseRepository.findByCourse(course.friendlyName)
        .then((subscribeCourses) => {
            subscribeCourses.map(subscribeCourse => {
                UserRepository.findById(subscribeCourse.user)
                    .then((user) => {
                        notification.user = {name: user.name, username: user.username, photo: user.photo};
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

            });
        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function updateTotalTaughtCourse(course) {
    CourseRepository.getCourseByInstructor(course.instructor.username)
        .then((items) => {
            UserRepository.updateByUsername(course.instructor.username, {totalTaughtCourses: items.length})
                .then((updated) => {
                    console.log('update totalTaughtCourses for ' + course.instructor.username + '\n');
                })
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

function updateTotalStudent(user) {
    SubscribeCourseRepository.getDistinctStudentForInstructor(user.username)
        .then((items) => {
            UserRepository.updateByUsername(user.username, {students: items.length})
                .then((updated) => {
                    console.log('update students for ' + user.username + '\n');
                })
                .catch((error) => {
                    console.log(error);
                }).done();
        })
        .catch((error) => {
            console.log(error);
        })
        .done()
    ;
}


function contentUpdated(course) {
    let notification = {
        for: 'STUDENT',
        type: 'COURSE_CONTENT_UPDATED',
        course: course
    };
    SubscribeCourseRepository.findByCourse(course.friendlyName)
        .then((subscribeCourses) => {
            subscribeCourses.map(subscribeCourse => {
                UserRepository.findById(subscribeCourse.user)
                    .then((user) => {
                        notification.user = {name: user.name, username: user.username, photo: user.photo};
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

            });
        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function thumbnailUpdated(course) {
    SubscribeCourseRepository.updateCourseThumbnail(course)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

module.exports = {
    priceUpdated: priceUpdated,
    contentUpdated: contentUpdated,
    thumbnailUpdated: thumbnailUpdated,
    updateTotalTaughtCourse: updateTotalTaughtCourse,
    updateTotalStudent: updateTotalStudent,
};