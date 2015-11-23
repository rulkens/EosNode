/**
 * @ngdoc directive
 * @description container directive for the navbar. adds some functionality for hiding the navbar in mobile
 * version, dependent on the MenuController
 */
angular.module('main')
    .directive('pirNavbar', navbarDirective);

/* @ngInject */
function navbarDirective(template, $log, $timeout, menu){
    var directive = {
        templateUrl      : template.url('main', 'navbar/navbar'),
        scope            : {
            menu: '='
        },
        link             : link,
        controller       : controller,
        controllerAs     : 'nb',
        bindToController : true
    };

    return directive;

    /* @ngInject */
    function controller() {

        /* jshint validthis: true */

        // =====================================================
        // Bindables
        // =====================================================

        var vm = this;

        vm.closeMenu = closeMenu;

        /* Init --------------------------------------------- */
        _init();


        // =====================================================
        // Public Methods
        // =====================================================

        function closeMenu (){
            vm.menu.close();
        }

        // =====================================================
        // Private Methods
        // =====================================================

        function _init (){
            // bind to scope
            menu.getMenu().then(resolve, reject);

            function resolve (data){
                // set menu data to scope
                vm.menus = data;

                // TEST: a notification
                //$timeout(function(){
                //    vm.menus[0]['items'][4].notify = true;
                //
                //    $timeout(function () {
                //        vm.menus[0]['items'][4].notify = false;
                //    }, 4000);
                //}, 2000);

            }

            function reject (e){
                $log.warn('[navbar] ERROR getting menu data', e);
            }
        }


    }

    function link(scope, el, attr, vm) {
    }
}