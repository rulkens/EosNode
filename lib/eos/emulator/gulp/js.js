var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings, errorHandler, browserSync){
    return function () {

        plugins.util.log('[js] isDevelopment', settings.isDevelopment);

        // vendor files
        // TODO: take CDN versions for production env
        var excludeSpecialScripts = '!' + settings.paths.src.app + '_*/**',

            // TODO: define these scripts in an external JSON file, and provide optional CDN alternatives
            appScripts = [
                settings.paths.src.js + '**/app.js', // app files first (to initialize the angular modules)
                settings.paths.src.js + '**/!(app.js)',
                '!' + settings.paths.src.js + '**/!(*.js)', // no non-javascript files or folders
                excludeSpecialScripts
            ];

        // app files
        gulp.src(appScripts)
            .pipe(plugins.plumber(errorHandler))
            .pipe(plugins.if(settings.isDevelopment, plugins.sourcemaps.init()))
            .pipe(plugins.iife())
            .pipe(plugins.concat(settings.files.dest.js.app + '.js'))
            .pipe(plugins.if(!settings.isDevelopment, plugins.uglify()))
            .pipe(plugins.if(settings.isDevelopment, plugins.sourcemaps.write()))
            .pipe(gulp.dest(settings.paths.dest.js))
            // reporting
            .pipe(plugins.size({ title: 'app.js' }))
            .pipe(plugins.notify("App Scripts rebuild"))
            .pipe(browserSync.reload({stream: true }));

    }
};