(function() {
    'use strict';

    urlPrefixService.$inject = ["USER_ROLES", "BASE_USER_URLS", "Auth"];
    angular.module('ati.core.router')
        .factory('urlPrefixService', urlPrefixService)
    ;

    function urlPrefixService(USER_ROLES, BASE_USER_URLS, Auth) {
        var api = {
            getPrefixedUrl: getPrefixedUrl
        };

        return api;

        /////

        function getUrlPrefixForCurrentUser() {
            var urlPrefix;

            if (Auth.isAuthorized(USER_ROLES.admin)) {
                urlPrefix = BASE_USER_URLS.admin;
            } else if (Auth.isAuthorized(USER_ROLES.doctor)) {
                urlPrefix = BASE_USER_URLS.doctor;
            } else if (Auth.isAuthorized(USER_ROLES.assistant)) {
                urlPrefix = BASE_USER_URLS.assistant;
            } else if (Auth.isAuthorized(USER_ROLES.clinic)) {
                urlPrefix = BASE_USER_URLS.clinic;
            }

            return urlPrefix;
        }

        function getPrefixedUrl(url) {
            if (url.indexOf('/') !== 0) {
                url = '/' + url;
            }

            return getUrlPrefixForCurrentUser() + url;
        }
    }
})();
