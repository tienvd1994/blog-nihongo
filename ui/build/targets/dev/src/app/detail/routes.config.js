(function () {
    'use strict';

    angular.module('ati.detail')
        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state('app.detail', {
                    // parent: 'anon',
                    url: '/detail/:id',
                    views: {
                        'content@app': {
                            controller: 'Detail',
                            templateUrl: 'detail/detail.tpl.html'
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
