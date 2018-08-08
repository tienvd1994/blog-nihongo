(function () {
    'use strict';

    angular.module('ati.core.activate')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.activate', {
                    url: '/activateAccount/{token}',
                    views: {
                        'content@app': {
                            controller: 'Activate',
                            templateUrl: 'core/activate/activate.tpl.html'
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
                            return Restangular.one('activate').one('validate', token).get()
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
