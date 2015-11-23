/**
 * @ngdoc directive
 * @description item directive for the navbar. adds some functionality for hiding the navbar in mobile
 * version, dependent on the MenuController
 */
angular.module('main')
    .directive('pirNavbarItem', navbarItemDirective);

/* @ngInject */
function navbarItemDirective(template){
    var directive = {
        require          : '^pirNavbar',
        templateUrl      : template.url('main', 'navbar/navbar-item'),
        scope            : false,
        replace          : true // because this is a list item, we want to have a <li> directly as a child of <ul>
    };

    return directive;
}