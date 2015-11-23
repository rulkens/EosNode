angular.module('utils').
    filter('percentage', percentageFilter);

/* @ngInject */
function percentageFilter($filter) {
    return function(input, decimals) {
        if(input){
            return $filter('number')(input * 100, decimals || 2) + '%';
        }
        return '';
    };
}