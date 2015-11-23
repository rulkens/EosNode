var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings){
    return function () {
        // simple copy to destination
        gulp.src(settings.paths.src.api + '**/*.*')
            .pipe(plugins.replaceTask({ patterns: [ { json: settings }]}))
            .pipe(gulp.dest(settings.paths.dest.api));
    }
};