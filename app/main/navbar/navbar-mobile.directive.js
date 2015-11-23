angular.module('main')
    .directive('pirNavbarMobile', navbarMobileDirective);

/* @ngInject */
function navbarMobileDirective(template){
    var directive = {
        templateUrl      : template.url('main', 'navbar/navbar-mobile'),
        scope            : {
            menu: '='
        },
        link             : link,
        controller       : controller,
        controllerAs     : 'vm',
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

        vm.toggleMenu = toggleMenu;


        // =====================================================
        // Public Methods
        // =====================================================

        function toggleMenu(){
            vm.menu.toggle();
        }

    }

    function link(scope, el, attr, vm) {
    }
}