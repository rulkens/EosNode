var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')(),
    del                = require('del');

module.exports = function(settings, errorHandler) {
    return function () {
        return del([
            settings.paths.tmp + '**',
            '!' + settings.paths.tmp,
            settings.paths.dest.main + '**',
            '!' + settings.paths.dest.main
        ])
    }
};