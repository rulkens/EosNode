angular.module('main').config(configure);

/* @ngInject */
function configure (templateProvider,
                    $stateProvider,
                    $urlRouterProvider,
                    $httpProvider,
                    $locationProvider,
                    $logProvider,
                    cfpLoadingBarProvider){

    $logProvider.debugEnabled(true);

    // For any unmatched url, redirect to 404 page
    $urlRouterProvider.otherwise('404');
    $locationProvider.html5Mode(true);

    // disable spinner while loading
    cfpLoadingBarProvider.includeSpinner = false;

    // TODO: move this to a json file so it can be used to generate the menu
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: templateProvider.url('main', 'index')
        })
        .state('help', {
            url: '/help',
            templateUrl: templateProvider.url('main', 'help')
        })
        .state('404', {
            url: "/404",
            templateUrl: templateProvider.url('main', '404')
        })
}