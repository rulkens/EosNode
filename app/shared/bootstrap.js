
angular.module('bootstrap', [])
        .config(bootstrapConfig)
        .run(bootstrapRun)
        .provider('bootstrap', bootstrap);


/* @ngInject */
function bootstrapConfig($logProvider) {
    $logProvider.debugEnabled(true);
}

/* @ngInject */
function bootstrapRun($http, $log) {
    $log.debug('bootstrap Run, setting Id token');
    $http.defaults.headers.common.Authorization = 'Bearer ' + PirGlobal.activeProfile.IdToken;
}

/**
  * @ngdoc service
  * @name bootstrap.provider:bootstrap
  * @description
  *
  * Provider to store bootstrap data created by .Net to serve as a 'readonly' configuration.
  * The server adds the data in a global variable called PirGlobal within a script tag in the DOM.
  * The return value is an object containing the bootstrap data.
  *
  * @property {object} bootstrap The return value of this bootstrap. Retrieves and stores
  * the configuration data from the global (inline) variable PirGlobal.
  */

/* @ngInject */
function bootstrap() {

    var bs = {
        activeProfile: PirGlobal && PirGlobal.activeProfile ? PirGlobal.activeProfile : null,
        appSettings: PirGlobal && PirGlobal.appSettings ? PirGlobal.appSettings : null
    };

    this.activeProfile = bs.activeProfile;
    this.appSettings = bs.appSettings;

    //console.log('appSettings', this.appSettings);
    //console.log('activeProfile', this.activeProfile);

    // Todo : bind the PirGlobal to the return value of this services (bootstrap.data)
    // this will make the JavaScript global pirGlobal accessible to all other modules.
    // If later on you want to change the PirGlobal name. extend or change the data you
    // only have to within the bootstrap

    this.$get = function () {
        return bs;
    }
}

console.log('bootstrapApp GELADEN');
