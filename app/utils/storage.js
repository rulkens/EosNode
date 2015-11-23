
angular.module('utils').factory('utilsStorage', ['$log', '$window', function ($log, $window) {

    var SESSION_KEY = 'pirKlantPortaal';

    // Todo : Error handling

    return {
        setSession: function (key, value) {
            $window.sessionStorage.setItem(key || SESSION_KEY, angular.toJson(value));
        },
        getSession: function (key) {

            var value = $window.sessionStorage.getItem(key || SESSION_KEY);

            // TODO : make a util also for converting (or trying to convert) data to an object
            try {
                // When passing multiple options as object
                value = angular.fromJson(value);
            } catch (e) { }

            return value;

        }
    };
}]);