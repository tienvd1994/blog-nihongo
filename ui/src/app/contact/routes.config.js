(function () {
    'use strict';

    angular.module('ati.contact')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.contact', {
                    url: '/contact',
                    views: {
                        'content@app': {
                            controller: 'ContactController',
                            templateUrl: 'contact/contact.tpl.html',
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
