/**
 * @ngdoc controller
 * @description a small controller to arrange opening and closing the mobile menu
 */
angular.module('main')
    .controller('MenuController', MenuController);

/* @ngInject */
function MenuController ($log){

    var vm = this;

    // =====================================================
    // Bindables
    // =====================================================

    vm.toggle   = toggle;
    vm.open     = open;
    vm.close    = close;

    // default state
    vm.menuOpened = false;

    // =====================================================
    // Public Methods
    // =====================================================

    function toggle (){
        vm.menuOpened = !vm.menuOpened;
        $log.debug('menu toggle', vm.menuOpened);
    }

    function close(){
        vm.menuOpened = false;
        $log.debug('menu open');
    }

    function open (){
        vm.menuOpened = true;
        $log.debug('menu close');
    }
}