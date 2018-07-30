(function () {
    'use strict';

    angular.module('ati.core.auth')
        .factory('sessionFactory', sessionFactory)
    ;

    function sessionFactory(USER_ROLES) {
        var api = {
            /**
             * @param {String|Object} token
             * @param {Number} id
             * @param {String} name
             * @param {String} username
             * @param {String} email
             * @param {String} photo
             * @param {Array} [userRoles]
             * @param {String} facebookId
             */
            createNew: function (token, id, name, username, email, photo, userRoles, facebookId) {
                return new Session(token, id, name, username, email, photo, userRoles, facebookId);
            },

            /**
             * @param {Object} data
             */
            createNewFrom: function (data) {
                if (!data.token) {
                    throw new Error('missing token');
                }

                if (!data.id) {
                    throw new Error('missing id');
                }

                if (!data.username) {
                    throw new Error('missing username');
                }

                if (!data.email) {
                    throw new Error('missing email');
                }

                if (!data.name) {
                    throw new Error('missing name');
                }

                if (!data.photo) {
                    data.photo = '/assets/images/anonymous_3.png';
                }

                return this.createNew(data.token, data.id, data.name, data.username, data.email, data.photo, data.userRoles, data.facebookId);
            },

            isSession: function (session) {
                return session instanceof Session;
            }
        };

        function Session(token, id, name, username, email, photo, userRoles, facebookId) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.photo = photo;
            this.name = name;
            this.facebookId = facebookId;

            if (!angular.isArray(userRoles)) {
                userRoles = [];
            }

            this.userRoles = userRoles;
        }

        Session.prototype.hasUserRole = function (role) {
            return this.userRoles.indexOf(role) !== -1;
        };

        Session.prototype.isAdmin = function () {
            return this.userRoles.indexOf(USER_ROLES.admin) !== -1;
        };

        return api;
    }
})();
