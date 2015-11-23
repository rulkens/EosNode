
angular.module('utils').factory('utilsHelper', ['$log', '$window', function ($log, $window) {

    // TODO : use @ngInject
    // TODO : dit bestand moet nog middels Grunt toegevoegd worden aan de concat lijst
    // TODO : de hasProperty gaan gebruiken in rekeningenManager._setIndexesRekeningBySession

    return {
        hasProperty: function (obj, names) {

            // usage : hasProperty(myObject, 'a.b.c')

            var key, keys = names.split('.');

            /*jshint -W084 */
            while (key = keys.shift()) {
                if (!obj.hasOwnProperty(key)) return false;
                obj = obj[key];
            }


            return true;
        }
    };
}]);