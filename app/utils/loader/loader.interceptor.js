// Intercepting HTTP calls with AngularJS.
angular.module('utils', [])
    .factory('loaderInterceptor', loaderInterceptorFactory);

function loaderInterceptorFactory($q, $log) {

    $log.debug('preparing loaderInterceptorFactory');

    return {
        // On request success
        request: request,
        // On request failure
        requestError: requestError,
        // On response success
        response: response,
        // On response failture
        responseError: responseError
    };

    function request(config) {
        console.log('loaderInterceptor.request', config); // Contains the data about the request before it is sent.

        // Return the config or wrap it in a promise if blank.
        return config || $q.when(config);
    }

    function requestError(rejection) {
        console.log('loaderInterceptor.requestError', rejection); // Contains the data about the error on the request.

        // Return the promise rejection.
        return $q.reject(rejection);
    }

    function response(response) {
        console.log('loaderInterceptor.response', response); // Contains the data from the response.

        // Return the response or promise.
        return response || $q.when(response);
    }

    function responseError(rejection) {
        console.log('loaderInterceptor.responseError', rejection); // Contains the data about the error.

        // Return the promise rejection.
        return $q.reject(rejection);
    }
}