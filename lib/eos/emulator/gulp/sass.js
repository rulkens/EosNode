var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')(),
    del                = require('del'),
    cleanCSS           = require('clean-css'),
    map                = require('vinyl-map');

module.exports = function(settings, errorHandler, browserSync){
    return function () {

        // simple minify css
        var minifyCss = map(function (buff, filename) {
            return new cleanCSS({
                // specify your clean-css options here
            }).minify(buff.toString()).styles;
        });

        plugins.util.log(plugins.util.colors.magenta('Sass task'));

        // remove main.css file
        del.sync([settings.paths.dest.css + settings.files.dest.css.main]);

        // then compile the less
        // take them from the tmp directory where they have been pre-processed
        return gulp.src(settings.paths.tmp.sass + settings.files.src.sass.main)
            .pipe(plugins.plumber(errorHandler)) // catch errors
            .pipe(plugins.if(settings.isDevelopment, plugins.sourcemaps.init()))
            .pipe(plugins.sass())
            .pipe(plugins.autoprefixer())
            .pipe(plugins.if(settings.isDevelopment, plugins.sourcemaps.write()))
            .pipe(plugins.if(!settings.isDevelopment, minifyCss))
            .pipe(plugins.size({ title: 'main.css' }))
            .pipe(gulp.dest(settings.paths.dest.css))
            .pipe(plugins.notify({ message: "SASS rebuild", onLast: true, sound: true }))
            .pipe(browserSync.stream({match: '**/*.css'}));

        // TODO: implement
        // clean the tmp directory
        //gulp.src(settings.paths.tmp.main + settings.paths.tmp.less)
        //    .pipe(plugins.clean());
    }
};