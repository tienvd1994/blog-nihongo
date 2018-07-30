(function () {
    'use strict';

    angular.module('ati.core.activate')
        .config(["$stateProvider", function ($stateProvider) {
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
                        },
                        'footer@app': {
                            controller: 'FooterController',
                            templateUrl: 'core/layout/footer.tpl.html'
                        }
                    },
                    resolve: {
                        token: ["$stateParams", function($stateParams) {
                            return $stateParams.token;
                        }],
                        validateToken: ["token", "Restangular", function(token, Restangular) {
                            return Restangular.one('activate').one('validate', token).get()
                                .then(function(validate) {
                                    return validate.valid;
                                })
                                .catch(function() {
                                    return false;
                                })
                        }]
                    },
                    data: {
                        allowAnonymous: true
                    }
                })
            ;
        }])
    ;
})();
