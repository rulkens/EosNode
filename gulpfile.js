/**
 the main configuration and builds for the EOS Frontend

 **/
var _                  = require('lodash'),
    gulp               = require('gulp'),
    browserSync        = require('browser-sync').create(),
    plugins            = require('gulp-load-plugins')(),
    nodemon            = require('nodemon'),
    // general settings
    defaultSettings    = require('./app/_settings/settings.json'),
    env                = require('minimist')(process.argv.slice(2)).env || defaultSettings.env.default,
    site               = require('minimist')(process.argv.slice(2)).site || defaultSettings.versions.default,

    // settings for the specific version of the site
    siteSettings       = require('./app/_settings/site/' + site + '.json'),
    // settings for the specific build environment
    envSettings        = require('./app/_settings/env/' + env + '.json'),
    // default plumber error handler - display a notification
    plumberErrorHandler = {errorHandler: plugins.notify.onError("Error: <%= error.message %>")},
    // combine all settings
    settings = _.merge(defaultSettings, siteSettings, envSettings, {site: site, env: env });

/* TFS CHECKOUT */
gulp.task('checkout',
    require('./gulp/checkout')          (settings));

/* LESS inject site-specific variables */
gulp.task('lessVars',
    require('./gulp/lessVars')          (settings, plumberErrorHandler));

/* LESS component files to tmp less directory */
gulp.task('lessComponents',
    ['lessVars'],
    require('./gulp/lessComponents')    (settings, plumberErrorHandler));

/* LESS */
gulp.task('less',
    ['checkout', 'lessComponents'],
    require('./gulp/less')              (settings, plumberErrorHandler, browserSync));

/* HTML */
gulp.task('html',
    ['checkout'],
    require('./gulp/html')              (settings, plumberErrorHandler, browserSync));

/* IMAGES */
gulp.task('images',
    ['checkout'],
    require('./gulp/images')            (settings, browserSync));

/* JAVASCRIPT */
gulp.task('js',
    ['checkout'],
    require('./gulp/js')                (settings, plumberErrorHandler, browserSync));

/* TEST API */
gulp.task('api',
    require('./gulp/api')               (settings));

/* CONTENT */
gulp.task('content',
    ['cleanContent'],
    require('./gulp/content')           (settings, plumberErrorHandler, browserSync));

gulp.task('contentSite',
    ['content'],
    require('./gulp/contentSite')       (settings, plumberErrorHandler, browserSync));

gulp.task('cleanContent',
    require('./gulp/cleanContent')      (settings));

/* ONE-TIME TASKS (used during development) */

/* WEBSERVER - for debug and development */
gulp.task('serve',
    ['contentSite', 'api', 'less', 'html', 'js', 'images'],
    require('./gulp/serve')             (settings, browserSync));

/* PRODUCTION BUILD */
gulp.task('build',
    ['contentSite', 'api', 'less', 'html', 'js', 'images'],
    require('./gulp/build')             (settings));

// utility helper tasks to reload page when js or html files change
gulp.task('html-watch',
    ['html'],
    browserSync.reload);

gulp.task('js-watch',
    ['js'],
    browserSync.reload);

gulp.task('images-watch',
    ['images'],
    browserSync.reload);

gulp.task('content-watch',
    ['contentSite'],
    browserSync.reload);

/* DEFAULT */
gulp.task('default',
    ['less', 'html', 'js', 'images'],
    function () {

    });

gulp.task('run', function() {
    nodemon({
        script : 'index.js'
        , ext  : 'js html'
        , env  : {'NODE_ENV' : 'development'}
    });
});