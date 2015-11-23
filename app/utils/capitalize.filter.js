angular.module('utils').
    filter('capitalize', capitalizeFilter);

function capitalizeFilter() {
    return function(input) {
        if(input){
            return input.substring(0,1).toUpperCase() + input.substring(1);
        }
        return '';
    };
}