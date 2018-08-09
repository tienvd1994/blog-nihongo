(function () {
    'use strict';

    angular.module('ati.category')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.category', {
                    // parent: 'anon',
                    url: '/category/:friendlyName',
                    views: {
                        'content@app': {
                            controller: 'Category',
                            templateUrl: 'category/category.tpl.html'
                        },
                        'header@app': {
                            controller: 'HeaderController',
                            templateUrl: 'core/layout/header.tpl.html'
                        },
                        'sideBarRight@app.category': {
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
