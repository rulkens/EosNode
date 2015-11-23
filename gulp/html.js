var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings, errorHandler, browserSync){
    return function () {

        var excludeSpecialScripts = '!' + settings.paths.src.app + '_*/**';

        // main html file
        gulp.src(settings.paths.src.views + settings.files.src.html.main)
            .pipe(plugins.plumber(errorHandler))
            .pipe(plugins.replaceTask({ patterns: [ { json: settings }]}))
            .pipe(plugins.rename(settings.files.dest.html.main))
            .pipe(gulp.dest(settings.paths.dest.index))
            .pipe(plugins.print())
            .pipe(plugins.notify({ message: "Main HTML rebuild"}))
            .pipe(browserSync.reload({stream: true }));

        // template files, ignore files in directories starting with _
        gulp.src([settings.paths.src.app + '**/*.html', excludeSpecialScripts])
            .pipe(plugins.plumber(errorHandler))
            .pipe(plugins.replaceTask({ patterns: [ { json: settings }]}))
            .pipe(plugins.rename(stripTemplateDir))
            .pipe(plugins.notify({ message: "Templates rebuild", onLast: true}))
            .pipe(gulp.dest(settings.paths.dest.views));

        function stripTemplateDir(path){
            path.dirname = (path.dirname + '/').replace(settings.paths.src.templates, '');
        }
    }
};