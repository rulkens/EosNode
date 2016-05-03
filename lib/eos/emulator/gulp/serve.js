var gulp               = require('gulp'),
    historyApiFallback = require('connect-history-api-fallback'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings, browserSync){

    return function () {

        // show if we have a development environment
        plugins.util.log('isDevelopment', settings.isDevelopment);

        // watch changes in files
        gulp.watch([settings.paths.src.sass + '**/*.*', settings.paths.src.components + '**/*.sass'], ['sass']);
        gulp.watch(settings.paths.src.js + '**/*.js', ['js']);
    }
};