"use strict";

const SectionRepository = require('../../repository/sectionRepository');
const CourseRepository = require('../../repository/courseRepository');
const SubscribeCourseRepository = require('../../repository/subscribeCourseRepository');
const NotificationRepository = require('../../repository/notificationRepository');
const LectureRepository = require('../../repository/lectureRepository');
const UserRepository = require('../../repository/userRepository');
const log = require('../../../logger').log;

/**
 * even listener create lecture
 * @param lecture
 */
function updateCurriculum (lecture) {

    SectionRepository.findById(lecture.section)
        .then(function (section) {
           SectionRepository.getCurriculumByCourse(section.course)
               .then(function (curriculum) {
                   CourseRepository.findById(section.course)
                       .then((course) => {
                            course.curriculum = curriculum;
                            course.save(function(error, doc) {
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
                            });
                            if (course.isPublished) {
                                SubscribeCourseRepository.updateTotalItem(course._id.toString(), curriculum.total)
                                    .catch((error) => {
                                        log.error(error);
                                    }).done();
                            }
                       })
                       .catch(function (error) {
                           log.error(error);
                       }).done()
               })
        })
        .catch(function (error) {
            log.error(error);
        }).done()
}

function reorderAfterRemove(lecture) {
    LectureRepository.reorderLectureAfterRemove(lecture)
        .catch((error) => {
            log.error(error);
        }).done();
}

module.exports = {
    updateCurriculum: updateCurriculum,
    reorderAfterRemove: reorderAfterRemove
};