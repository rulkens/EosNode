/*
 * The loader-service is used by the loader directive to register new loaders.
 */

angular.module('utils')
    .directive('pirLoader', pirLoaderDirective);

/* @ngInject */
function pirLoaderDirective(template, loader) {
    // directive interface
    var directive = {
        restrict: 'E',
        templateUrl: template.url('utils', 'loader/loader'),
        //replace: true,
        scope: {
            id: '@'
        },
        controller: controller,
        controllerAs : 'lo',
        bindToController: true
    };

    return directive;

    /* @ngInject */
    function controller($scope, $attrs) {

        /* jshint validthis: true */

        // =====================================================
        // Bindables
        // =====================================================

        var vm = this;

        vm.percentage = .5;
        vm.loading = true;

        _init();
        // =====================================================
        // Public Methods
        // =====================================================

        // =====================================================
        // Private Methods
        // =====================================================
        function _init (){
            // Register the spinner with the spinner service.
            loader._register(vm);
            /*loader.on('progress', _progressHandler);
            loader.on('start', _startHandler);
            loader.on('complete', _completeHandler);*/
        }

        function _progressHandler (percentage){
            vm.percentage = percentage;
        }

        function _startHandler (){
            vm.loading = true;
        }

        function _completeHandler(){
            vm.loading = false;
        }

    }
        
}