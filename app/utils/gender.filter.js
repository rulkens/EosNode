angular.module('utils').
    filter('gender', genderFilter);

/**
 * @description filter a gender and output the full word
 * @note only supports Dutch as language
 * @returns {Function}
 */
function genderFilter (){
    return function(input){
        if(!input) return '';
        if(input === 'M' || input === '1'){
            return 'Man';
        }
        if(input === 'V' || input === '2'){
            return 'Vrouw';
        }
    }
};