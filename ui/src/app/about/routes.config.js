(function () {
    'use strict';

    angular.module('ati.about')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.about', {
                    url: '/about-us',
                    views: {
                        'content@app': {
                            controller: 'AboutController',
                            templateUrl: 'about/about.tpl.html',
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
            ;
        });
})();
