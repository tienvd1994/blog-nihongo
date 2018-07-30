(function () {
    'use strict';

    scrollToTop.$inject = ["$rootScope"];
    angular.module('ati.core.router')
        .run(scrollToTop)
    ;

    function scrollToTop($rootScope) {
        $rootScope.$on("$stateChangeSuccess", function () {
            $(window).scrollTop(0);
            // const scrollDuration = 500;
            // const scrollHeight = window.scrollY,
            //     scrollStep = Math.PI / ( scrollDuration / 15 ),
            //     cosParameter = scrollHeight / 2;
            // let   scrollCount = 0,scrollMargin;
            //
            // let   scrollInterval = setInterval( function() {
            //     if (window.scrollY !== 0) {
            //         scrollCount = scrollCount + 1;
            //         scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
            //         window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
            //     } else clearInterval(scrollInterval);
            // }, 15 );
        });
    }
})();
