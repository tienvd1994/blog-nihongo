(function () {
    "use strict";

    headerNotificationController.$inject = ["$state", "$translate", "NotificationManager", "NOTIFICATION"];
    angular.module('ati.components')
        .component('headerNotification', {
            bindings: {
                notification: '<',
                onMarkAsRead: '&'
            },
            templateUrl: 'components/headerNotification.tpl.html',
            controller: headerNotificationController
        })
        ;

    function headerNotificationController($state, $translate, NotificationManager, NOTIFICATION) {
        this.getNotificationContent = function () {
            switch (this.notification.type) {
                case NOTIFICATION.NEW_SUBSCRIBE:
                    return `<span class="bold">${this.notification.from.name}</span> ${$translate.instant('NOTIFICATION.NEW_SUBSCRIBE')} <span class="bold">${this.notification.course.name}</span>`;
                    break;

                case NOTIFICATION.NEW_QUESTION:
                    return `<span class="bold">${this.notification.from.name}</span> ${$translate.instant('NOTIFICATION.NEW_QUESTION')} <span class="bold">${this.notification.course.name}</span>`;
                    break;

                case NOTIFICATION.NEW_REVIEW:
                    return `<span class="bold">${this.notification.from.name}</span> ${$translate.instant('NOTIFICATION.NEW_REVIEW')} <span class="bold">${this.notification.course.name}</span>`;
                    break;
                case NOTIFICATION.REPLY_QUESTION:
                    return `<span class="bold">${this.notification.from.name}</span> ${$translate.instant('NOTIFICATION.REPLY_QUESTION')} <span class="bold">${this.notification.course.name}</span>`;
                    break;
                case NOTIFICATION.COURSE_PRICE_UPDATED:
                    return `<span class="bold">${this.notification.course.name}</span> ${$translate.instant('NOTIFICATION.COURSE_PRICE_UPDATED')}</span>`;
                    break;

                case NOTIFICATION.COURSE_CONTENT_UPDATED:
                    return `<span class="bold">${this.notification.course.name}</span> ${$translate.instant('NOTIFICATION.COURSE_CONTENT_UPDATED')}</span>`;
                    break;

                case NOTIFICATION.COURSE_CURRICULUM_UPDATED:
                    return `<span class="bold">${this.notification.course.name}</span> ${$translate.instant('NOTIFICATION.COURSE_CURRICULUM_UPDATED')}`;
                    break;
                case NOTIFICATION.QUIZ_MAXIMUM_RETRY_EXCEEDED:
                    return `${$translate.instant('NOTIFICATION.QUIZ_MAXIMUM_RETRY_EXCEEDED')} <span class="bold">${this.notification.course.name}</span>`;
                    break;
            }
        };

        this.markAsRead = function () {
            if (this.notification.read) {
                return;
            }

            NotificationManager.one(this.notification._id)
                .one('mark-as-read').put({})
                .then((updated) => {
                    Object.assign(this.notification, { read: true });
                    this.notification.read = true;
                    this.onMarkAsRead(this.notification);
                }, (error) => {
                    console.log(error);
                })

        };

        this.followNotification = () => {
            if (!this.notification.read) {
                NotificationManager.one(this.notification._id)
                    .one('mark-as-read').put({})
                    .then((updated) => {
                        Object.assign(this.notification, { read: true });
                        this.notification.read = true;
                        this.onMarkAsRead(this.notification);
                    }, (error) => {
                        console.log(error);
                    })
            }

            switch (this.notification.type) {
                case NOTIFICATION.NEW_SUBSCRIBE:
                case NOTIFICATION.NEW_REVIEW:
                case NOTIFICATION.COURSE_PRICE_UPDATED:
                case NOTIFICATION.COURSE_CURRICULUM_UPDATED:
                    $state.go('app.course.learn.overview', { friendlyName: this.notification.course.friendlyName });
                    break;
                case NOTIFICATION.NEW_QUESTION:
                    $state.go('app.course.learn.question', { friendlyName: this.notification.course.friendlyName });
                    break;
                case NOTIFICATION.REPLY_QUESTION:
                    $state.go('app.course.learn.question.questionDetail', { friendlyName: this.notification.course.friendlyName, questionId: this.notification.question });
                    break;
                default:
                    $state.go('app.course.detail', { friendlyName: this.notification.course.friendlyName });
            }
        };
    }
})();