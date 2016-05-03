var gulp       = require('gulp'),
    plugins    = require('gulp-load-plugins')(),
    source     = require('vinyl-source-stream');
    browserify = require('browserify'),
    //babelify   = require('babelify');


module.exports = function (settings, errorHandler, browserSync) {
    return function () {

        plugins.util.log('[js] isDevelopment', settings.isDevelopment);

        // vendor files
        // TODO: take CDN versions for production env
        var excludeSpecialScripts = '!' + settings.paths.src.app + '_*/**',

            // TODO: define these scripts in an external JSON file, and provide optional CDN alternatives
            appScripts            = [
                settings.paths.src.js + '**/app.js', // app files first (to initialize the angular modules)
                settings.paths.src.js + '**/!(app.js)',
                '!' + settings.paths.src.js + '**/!(*.js)', // no non-javascript files or folders
                excludeSpecialScripts
            ];

        // app files
        // gulp.src(appScripts)
        //     .pipe(plugins.plumber(errorHandler))
        //     .pipe(plugins.if(settings.isDevelopment, plugins.sourcemaps.init()))
        //     .pipe(plugins.)
        //     .pipe(plugins.iife())
        //     .pipe(plugins.concat(settings.files.dest.js.app + '.js'))
        //     .pipe(plugins.if(!settings.isDevelopment, plugins.uglify()))
        //     .pipe(plugins.if(settings.isDevelopment, plugins.sourcemaps.write()))
        //     .pipe(gulp.dest(settings.paths.dest.js))
        //     // reporting
        //     .pipe(plugins.size({title : 'app.js'}))
        //     .pipe(plugins.notify("App Scripts rebuild"))
        //     .pipe(browserSync.reload({stream : true}));

        // new browserify route
        
        var dependencies = ['react', 'react-dom'];

        var appBundler = browserify({
            entries: settings.paths.src.app + settings.files.src.js.main,
            debug: true
        });

        // create vendor file
        browserify({
            require: dependencies,
            debug: true
        })
            .bundle()
            .on('error', plugins.util.log)
            .pipe(source(settings.files.dest.js.vendor + '.js'))
            .pipe(gulp.dest(settings.paths.dest.js));

        // make the dependencies external so they don't get bundled by the
        // app bundler. Dependencies are already bundled in vendor.js for
        // development environments.
        dependencies.forEach(function(dep){
            appBundler.external(dep);
        });

        appBundler
        // transform ES6 and JSX to ES5 with babelify
            .transform('babelify', {presets: ['es2015', 'react']})
            .bundle()
            .on('error',errorHandler.errorHandler)
            .pipe(source(settings.files.dest.js.app + '.js'))
            .pipe(gulp.dest(settings.paths.dest.js))
            .pipe(plugins.notify("App Scripts rebuild"));

    }
};