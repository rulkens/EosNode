var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings){
    return function () {
        plugins.util.log('checkout');
        // make sure the content path and its files are writable before doing
        // anything with them
        // NOTE: this needs sudo to work on osx!
        return gulp.src([settings.paths.dest.main + '**/*.*'])
            .pipe(plugins.chmod(755));
    }
};