
angular.module('utils').factory('loader', loaderFactory);

/* @ngInject */
function loaderFactory($log, $resource, bootstrap, eventEmitter, loaderInterceptor) {
    var cache = {};

    var service = {
        _register: _register,
        _unregister: _unregister
    };

    // make it an event emitter
    //eventEmitter.inject(service);

    $log.debug('loader service');

    return service;

    // A private function intended for loader directives to register themselves with the service.
    function _register(loaderScope) {
        // If no id is passed in, throw an exception.
        if (!loaderScope.id) {
            throw new Error('A loader must have an ID to register with the loader service.');
        }

        // Add our spinner directive's scope to the cache.
        cache[loaderScope.id] = loaderScope;

        console.log('loader this', this);
    }

    // A private function exposed just in case the user really needs to manually unregister a spinner.
    function _unregister(loaderId) {
        delete cache[loaderId];
    }
}
