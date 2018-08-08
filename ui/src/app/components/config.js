(function() {
    "use strict";

    angular.module('ati.components')
        .constant('NOTIFICATION', {
            "NEW_SUBSCRIBE": "NEW_SUBSCRIBE",
            "NEW_QUESTION": "NEW_QUESTION",
            "NEW_REVIEW": "NEW_REVIEW",
            "REPLY_QUESTION": "REPLY_QUESTION",
            "COURSE_PRICE_UPDATED": "COURSE_PRICE_UPDATED",
            "COURSE_CONTENT_UPDATED": "COURSE_CONTENT_UPDATED",
            "COURSE_CURRICULUM_UPDATED": "COURSE_CURRICULUM_UPDATED",
            "QUIZ_MAXIMUM_RETRY_EXCEEDED": "QUIZ_MAXIMUM_RETRY_EXCEEDED",
        })
    ;
})();