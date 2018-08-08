(function () {
    'use strict';

    angular.module('ati.detail')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.detail', {
                    url: '/:friendlyName',
                    views: {
                        'content@app': {
                            controller: 'Detail',
                            templateUrl: 'detail/detail.tpl.html'
                        },
                        'header@app': {
                            controller: 'HeaderController',
                            templateUrl: 'core/layout/header.tpl.html'
                        },
                        'sideBarRight@app.detail': {
                            controller: 'SideBarRightController',
                            templateUrl: 'core/layout/sideBarRight.tpl.html'
                        }
                    },
                    resolve: {
                        test: function ($stateParams, TestManager) {
                            return TestManager.one($stateParams.friendlyName).get();
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
