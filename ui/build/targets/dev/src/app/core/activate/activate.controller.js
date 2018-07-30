(function () {
    'use strict';

    Activate.$inject = ["$scope", "token", "validateToken"];
    angular.module('ati.core.activate')
        .controller('Activate', Activate)
        ;

    function Activate($scope, token, validateToken) {
        $scope.validateToken = validateToken;

        // $.notifyDefaults({
        //     offset: {
        //         x: 0,
        //         y: 0
        //     },
        //     delay: 3000,
        //     template: `<div data-notify="container" class="col-xs-12 col-sm-12 alert alert-{0}" role="alert">
        //                    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
        //                    <span data-notify="icon"></span>
        //                    <span data-notify="title">{1}</span>
        //                    <span data-notify="message">{2}</span>
        //                    <div class="progress" data-notify="progressbar">
        //                        <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
        //                    </div>
        //                    <a href="{3}" target="{4}" data-notify="url"></a>
        //               </div>`
        // });

        if (!validateToken) {
            $.notify({ message: $translate.instant('ACTIVATE_MODULE.ACTIVATE_FAIL', { token: token }) }, { type: 'danger' });
        } else {
            $.notify({ message: $translate.instant('ACTIVATE_MODULE.ACTIVATE_SUCCESS', { token: token }) }, { type: 'success' });
        }
    }
})();
