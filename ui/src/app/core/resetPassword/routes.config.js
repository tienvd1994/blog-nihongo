(function () {
    'use strict';

    angular.module('ati.core.resetPassword')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.changePassword', {
                    url: '/changePassword/{token}',
                    views: {
                        'content@app': {
                            controller: 'ChangePassword',
                            templateUrl: 'core/resetPassword/changePassword.tpl.html'
                        },
                        'header@app': {
                            controller: 'HeaderController',
                            templateUrl: 'core/layout/header.tpl.html'
                        }
                    },
                    resolve: {
                        token: function($stateParams) {
                            return $stateParams.token;
                        },
                        validateToken: function(token, Restangular) {
                            return Restangular.one('resetting').one('validate', token).get()
                                .then(function(validate) {
                                    return validate.valid;
                                })
                                .catch(function() {
                                    return false;
                                })
                        }
                    },
                    data: {
                        allowAnonymous: true
                    }
                })
            ;
        })
    ;
})();
