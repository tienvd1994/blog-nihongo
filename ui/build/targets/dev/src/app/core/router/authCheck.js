(function () {
    'use strict';

    authCheck.$inject = ["$rootScope", "$state", "Auth", "AUTH_EVENTS", "EXISTING_SESSION"];
    angular.module('ati.core.router')
        .run(authCheck)
        ;

    function authCheck($rootScope, $state, Auth, AUTH_EVENTS, EXISTING_SESSION) {
        $rootScope.$on('$stateChangeStart', function (event, toState, params, fromState, fromParams, options) {
            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, params, { location: 'replace' })
            }

            var stateData = toState.data || {};

            // my login state will early return here
            if (stateData.allowAnonymous) {
                return;
            }

            function cancelStateChange(eventToBroadcast, data) {
                event.preventDefault();
                $rootScope.$broadcast(eventToBroadcast, data);
            }

            var currentSession = Auth.getSession();

            if (!currentSession && toState.name !== "app.cart.list") {
                // note, very important to return early, easy to miss why this is added, it stops further checks
                let redirectUrl = $state.href(toState.name, params, { absolute: true });
                return cancelStateChange(AUTH_EVENTS.notAuthenticated, { redirectUrl: redirectUrl });
            }

            if (toState.name === "app.cart.list") {
                $state.go(toState.name, {}, { notify: false });
                return;
            }

            var requiredRole = stateData.requiredUserRole;

            if (requiredRole && !currentSession.hasUserRole(requiredRole)) {
                return cancelStateChange(AUTH_EVENTS.notAuthorized);
            }

            var requiredModule = stateData.requiredModule;

            if (requiredModule && !currentSession.hasModuleEnabled(requiredModule)) {
                return cancelStateChange(AUTH_EVENTS.notAuthorized);
            }
        });
    }
})();
