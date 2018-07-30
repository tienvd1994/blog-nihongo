(function () {
    'use strict';

    angular.module('ati.errorPage')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.notFound', {
                    url: 'error/not-found',
                    views: {
                        'content@app': {
                            controller: 'Error404Controller',
                            templateUrl: 'error/notFound.tpl.html'
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
                    data: {
                        allowAnonymous: true
                    }
                })
        })
    ;
})();
