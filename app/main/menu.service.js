/**
 * @ngdoc service
 * @name main.menu
 * @requires $log
 * @requires $resource
 * @description Get the menu data
 */
angular.module('main')
    .factory('menu', menuFactory);


/* @ngInject */
function menuFactory($log, $resource, $q, bootstrap) {

    // =====================================================
    // Bindables
    // =====================================================

    var api = {
        // TODO: route to the Web API?
        menu: $resource(bootstrap.appSettings.appRoot + 'api/menu.json', {}, { 'query': { method: 'GET', isArray: true, cache: true } })
    };

    var service = {
        getMenu: getMenu
    };

    return service;


    // =====================================================
    // Public Methods
    // =====================================================

    /**
     * @ngdoc object
     * @name example.exampleData#getData
     * @methodOf example.exampleData
     * @description Method to ...
     * @returns {object} A promise with an array of xxx objects or the error object
     */
    function getMenu() {

        return api.menu.query({}).$promise.then(resolve, reject);

        function resolve(data) {
            //$log.debug('menu : ', data);
            return data;
        }

        function reject(e) {
            $log.warn('error in getData', e);
            return $q.reject(e);
        }
    }

    // =====================================================
    // Private Methods
    // =====================================================

}
