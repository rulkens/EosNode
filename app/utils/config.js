
angular.module('utils').config(utilsConfig);

/* @ngInject */
function utilsConfig($logProvider, $httpProvider) {
    $logProvider.debugEnabled(true);

    console.log('utils config');

    // add a loading interceptor

}