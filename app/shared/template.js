/**
  * @ngdoc factory
  * @name template.factory:template
  * @description The template factory generates the right template urls for you.
  * It uses the PirGlobal object to get the right path and appends '.html' to the
  * filename.
  */
angular.module('template', ['bootstrap'])
    .config(templateConfig)
    .provider('template', templateProvider);

/* @ngInject */
function templateConfig($logProvider) {
    $logProvider.debugEnabled(true);
}

/* @ngInject */
function templateProvider(bootstrapProvider){

    this.url = function (moduleName, filePath) {
        return url(moduleName, filePath, bootstrapProvider);
    };

    // this returns a factory to be used by normal DI, so you can use template.url
    this.$get = function templateFactory(){
        return {
            url: function (moduleName, filePath) {
                return url(moduleName, filePath, bootstrapProvider);
            }
        };
    };

    function url(moduleName, filePath, bs){

        var timestamp = '{{VERSION}}';
        // TODO: use angular constant
        var extension = '.html';

        //return PirGlobal.requireJs.get(moduleName).templatePath + filePath + extension + "?v="; + timestamp;
        return bs.appSettings.appRoot + 'templates/' + moduleName + '/' + filePath + extension;
        //return '/templates/' + moduleName + '/' + filePath + extension;
    }
}

console.log('templateFactory GELADEN');