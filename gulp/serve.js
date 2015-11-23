var gulp               = require('gulp'),
    historyApiFallback = require('connect-history-api-fallback'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings, browserSync){

    return function () {

        // show if we have a development environment
        plugins.util.log('isDevelopment', settings.isDevelopment);

        if(settings.env === 'mvc'){

            // serving via IIS server (MVC)
            plugins.util.log('Serving via MVC IIS server');

            browserSync.init({
                proxy: 'https://localhost:44301'
            });

        } else if(settings.env === 'dev'){

            // serving via local server
            plugins.util.log('Serving via Local server');

            browserSync.init({
                server: {
                    baseDir: settings.paths.dest.main,
                    middleware: [historyApiFallback()]
                }
            });

        } else if(settings.env === 'prod'){
            // no server necessary
            plugins.util.log('Production, don\'t start a server');
        }

        //browserSync.reload();

        // watch changes in files
        gulp.watch([settings.paths.src.less + '**/*.*', settings.paths.src.components + '**/*.less'], ['less']);
        gulp.watch([settings.paths.src.views + '**/*.html', settings.paths.src.components + '**/*.html'], ['html-watch']);
        gulp.watch(settings.paths.src.js + '**/*.js', ['js-watch']);
        gulp.watch(settings.paths.src.images + '**/*.*', ['images-watch']);
        gulp.watch(settings.paths.src.content.main + '**/*.*', ['content-watch']);
        gulp.watch(settings.paths.settings + '**/*.*', ['less', 'api', 'html-watch']);
        gulp.watch(settings.paths.src.api + '**/*.*', ['api']);
    }
};