(function () {
    'use strict';

    App.$inject = ["$timeout"];
    angular.module('ati.core.layout')
        .controller('AppController', App)
        ;

    function App($timeout) {
        $timeout(function () {
            $("#side-menu").metisMenu();

            $('.button-menu-mobile').on('click', function (event) {
                event.preventDefault();
                $("body").toggleClass("enlarged");
            });
        }, 0)
    }
})();
