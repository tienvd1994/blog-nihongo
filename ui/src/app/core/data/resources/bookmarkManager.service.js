(function(){
    "use strict";
    
        angular.module('ati.core.data.resources')
            .factory('BookmarkManager', BookmarkManager)
        ;
    
        function BookmarkManager(Restangular) {
            let RESOURCE_NAME = 'bookmarks';
    
            return Restangular.service(RESOURCE_NAME);
        }
    })();