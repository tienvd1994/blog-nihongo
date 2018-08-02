"use strict";

const SectionRepository = require('../../repository/sectionRepository');
const CourseRepository = require('../../repository/courseRepository');
const SubscribeCourseRepository = require('../../repository/subscribeCourseRepository');
const NotificationRepository = require('../../repository/notificationRepository');
const UserRepository = require('../../repository/userRepository');
const log = require('../../../logger').log;
/**
 * even listener create section
 * @param section
 */
function updateCurriculum (section) {
    SectionRepository.getCurriculumByCourse(section.course)
        .then(function (curriculum) {
            CourseRepository.findById(section.course)
                .then((course) => {
                    course.curriculum = curriculum;
                    course.save(function(error, course) {
                        if (!error && course.isPublished) {
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
                                                    }).done()
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
                    })
                })
                .catch(function (error) {
                    log.error(error);
                }).done()
        })
        .catch(function (error) {
            log.error(error);
        }).done();
}

function reorderAfterRemove(section) {
    SectionRepository.reorderLectureAfterRemove(section)
        .catch((error) => {
            log.error(error);
        })
}

module.exports = {
    updateCurriculum: updateCurriculum,
    reorderAfterRemove: reorderAfterRemove
};