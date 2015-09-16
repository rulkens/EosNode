/**
 * Created by rulkens on 08/09/15.
 */

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('run', function() {
    nodemon({
        script : 'index.js'
        , ext  : 'js html'
        , env  : {'NODE_ENV' : 'development'}
    });
});