"use strict";

const CourseRateRepository = require('../../repository/courseRateRepository');
const CourseRepository = require('../../repository/courseRepository');
const NotificationRepository = require('../../repository/notificationRepository');
const _ = require('lodash');
const log = require('../../../logger').log;

/**
 * even listener create course rate
 * @param courseId
 */
function updateCourseRate(courseId, type) {
    CourseRateRepository.getByCourse(courseId)
        .then(function (courseRates) {
            let totalScore = 0;
            let averageScoreOfCourse = 0;

            if (courseRates.length > 0) {
                totalScore = _.sumBy(courseRates, 'score');
                averageScoreOfCourse = totalScore / courseRates.length;
            }

            CourseRepository.findById(courseId)
                .then(function (course) {
                    course.rateScore = Number(averageScoreOfCourse.toFixed(2));

                    if (type === 1) {
                        course.rates++;
                    } else if (type === 3) {
                        course.rates--;
                    }

                    course.save(function (error, courseItem) {
                        if (error) {
                            log.error(error);
                        }
                    });
                })
                .catch(function (error) {
                    log.error(error);
                })
                .done()

        })
        .catch(function (error) {
            log.error(error);
        })
        .done()
}

/**
 * even listener create section
 * @param course
 * @param student
 */
function createNotification(course, student) {
    let notification = {
        from: student,
        for: 'LECTURER',
        type: 'NEW_REVIEW'
    };

    CourseRepository.findByFriendlyName(course.friendlyName)
        .then((course) => {

            notification.user = course.instructor;
            notification.course = { name: course.name, friendlyName: course.friendlyName, thumbnail: course.thumbnail };
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
    updateCourseRate: updateCourseRate,
    createNotification: createNotification
};