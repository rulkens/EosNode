var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings){
    return function () {
        // first copy the common content
        return gulp.src(settings.paths.src.content.common + '**/*.*')
            .pipe(plugins.replaceTask({ patterns: [ { json: settings }]}))
            .pipe(gulp.dest(settings.paths.dest.content));
    }
};