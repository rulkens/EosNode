var _                   = require('lodash'),
    gulp                = require('gulp'),
    browserSync         = require('browser-sync').create(),
    plugins             = require('gulp-load-plugins')(),
    settings            = require('./settings.json'),
    plumberErrorHandler = {errorHandler : plugins.notify.onError("Error: <%= error.message %>")};

/* JAVASCRIPT */
gulp.task('js', [],
    require('./gulp/js')(settings, plumberErrorHandler, browserSync));

/* SASS */
gulp.task('sassVars', [],
    require('./gulp/sassVars')(settings, plumberErrorHandler, browserSync));

/* LESS */
gulp.task('sass',
    ['sassVars'],
    require('./gulp/sass')(settings, plumberErrorHandler, browserSync));

/* WEBSERVER - for debug and development */
gulp.task('watch',
    ['sass', 'js'],
    require('./gulp/watch')(settings, browserSync));