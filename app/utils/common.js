
angular.module('utils').factory('common', common);

/* @ngInject */
function common($location, $q, $log, _, $rootScope, $resource) {    

    var service = {        
        $broadcast : $broadcast,
        $q         : $q,
        $log       : $log,
        _          : _,
        $resource  : $resource
    };

    return service;
    //////////////////////

    function $broadcast() {
        return $rootScope.$broadcast.apply($rootScope, arguments);
    }

 }