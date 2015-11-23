var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')(),
    del                = require('del');

module.exports = function(settings){
    return function () {
        // clean the content directory
        // do it synchronously, to make sure we won't have rece conditions with the next tasks
        del.sync([
            settings.paths.dest.content + '**'
        ]);
    }
};