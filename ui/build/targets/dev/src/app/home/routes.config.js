(function () {
    'use strict';

    angular.module('ati.home')
        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('app.home', {
                    // parent: 'anon',
                    url: '/?page&redirectUrl',
                    views: {
                        'content@app': {
                            controller: 'Home',
                            templateUrl: 'home/home.tpl.html'
                        },
                        'header@app': {
                            controller: 'HeaderController',
                            templateUrl: 'core/layout/header.tpl.html'
                        },
                        // 'footer@app': {
                        //     controller: 'FooterController',
                        //     templateUrl: 'core/layout/footer.tpl.html'
                        // }
                    },
                    resolve: {

                    },
                    data: {
                        allowAnonymous: true
                    }
                })
                ;
        }])
        ;
})();
