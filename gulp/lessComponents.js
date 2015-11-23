var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings, errorHandler){
    return function () {

        var excludeSpecialScripts = '!' + settings.paths.src.app + '_*/**';

        // copy all less files, excluding the ones in style
        return gulp.src([settings.paths.src.components + '**/*.less', excludeSpecialScripts])
            .pipe(plugins.plumber(errorHandler))
            .pipe(gulp.dest(settings.paths.tmp.components));
    }
};