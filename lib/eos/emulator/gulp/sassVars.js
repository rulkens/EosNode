var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')(),
    //lessReplace        = require('./gulp-less-replace'),
    del                = require('del');

module.exports = function(settings, errorHandler){
    return function () {

        // remove temporary directory
        //del.sync([settings.paths.tmp.less + '**']);

        // replace site-specific variables, and put the files in a temp directory
        return gulp.src(settings.paths.src.sass + '**/*.scss')
            .pipe(plugins.plumber(errorHandler))
            .pipe(plugins.print())
            // TODO: implement a SASS version of the replacer script
            //.pipe(lessReplace({ vars: settings.style }))
            .pipe(gulp.dest(settings.paths.tmp.sass));
    }
};