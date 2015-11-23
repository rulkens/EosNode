var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings){
    return function () {
        // copy the site-specific content over the default content
        return gulp.src(settings.paths.src.content.main + settings.site + '/**/*.*')
            .pipe(plugins.print())
            .pipe(plugins.replaceTask({ patterns: [ { json: settings }]}))
            .pipe(gulp.dest(settings.paths.dest.content));
    }
};