(function () {
    'use strict';

    angular.module('ati.core.bootstrap')
        .constant('API_END_POINT', 'http://localhost:3000/api')
        .provider('API_BASE_URL', {
            $get: function(API_END_POINT) {
                return API_END_POINT + '/v1';
            }
        })
        .provider('API_UPLOAD_FILES', {
            $get: function(API_BASE_URL) {
                return API_BASE_URL + '/uploadFiles';
            }
        })
    ;
})();
