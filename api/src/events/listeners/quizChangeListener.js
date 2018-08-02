"use strict";

const NotificationRepository = require('../../repository/notificationRepository');
const QuestionAnswerRepository = require('../../repository/questionAnswerRepository');
const LectureRepository = require('../../repository/lectureRepository');
const SectionRepository = require('../../repository/sectionRepository');
const UserRepository = require('../../repository/userRepository');
const log = require('../../../logger').log;

/**
 * even listener create section
 * @param subscribeCourse
 * @param lecture
 */
function resetLearnProgress (subscribeCourse) {

    // reset learn progress
    subscribeCourse.section = [];
    subscribeCourse.completionRatio = 0;
    subscribeCourse.totalLectureCompletedOfCourse = 0;
    subscribeCourse.retry = 3;
    subscribeCourse.sectionSelected = null;


    subscribeCourse.save(function(error, doc) {
        if (error) {
            log.error(error);
        }
    });
    // SectionRepository.getFirstSectionForCourse(subscribeCourse.course._id)
    //     .then((section) => {
    //         LectureRepository.getFirstLectureForSection(section._id.toString())
    //             .then((lecture) => {
    //                 subscribeCourse.sectionSelected = {sectionId: section._id.toString(), lecture: {_id: lecture._id.toString(), position: lecture.position}};
    //                 subscribeCourse.save(function(error, doc) {
    //                     if (error) {
    //                         log.error(error);
    //                     }
    //                 });
    //             })
    //             .catch((error) => {
    //                 log.error(error);
    //             }).done();
    //     })
    //     .catch((error) => {
    //         log.error(error);
    //     }).done();

    // create notification
    let notification = {
        for: 'STUDENT',
        type: 'QUIZ_MAXIMUM_RETRY_EXCEEDED',
        course: subscribeCourse.course
    };

    UserRepository.findById(subscribeCourse.user)
        .then((user) => {
            notification.user = {name: user.name, username: user.username, photo: user.photo};
            NotificationRepository.save(notification)
                .then(function (notify) {
                    log.info(`new ${notification.for} notification of type ${notification.type} sent to ${notification.user.name}`);
                })
                .catch(function (error) {
                    log.error(error);
                })
                .done();
        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}

module.exports = {
    resetLearnProgress: resetLearnProgress
};