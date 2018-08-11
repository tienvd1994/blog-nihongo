(function () {
    'use strict';

    angular.module('ati.home')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.home', {
                    // parent: 'anon',
                    url: '/',
                    views: {
                        'content@app': {
                            controller: 'HomeController',
                            templateUrl: 'home/home.tpl.html'
                        },
                        'header@app': {
                            controller: 'HeaderController',
                            templateUrl: 'core/layout/header.tpl.html'
                        },
                        'sideBarRight@app.home': {
                            controller: 'SideBarRightController',
                            templateUrl: 'core/layout/sideBarRight.tpl.html'
                        }
                    },
                    resolve: {

                    },
                    data: {
                        allowAnonymous: true
                    }
                })
                ;
        })
        ;
})();
