var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings, browserSync){
    return function images() {
        // TODO: do some image optimization here or something

        // copy all renderable files to the output folder
        gulp.src(settings.paths.src.images + '**/*.{png,svg,jpg,gif,ico}')
            .pipe(plugins.size({ title: 'images' }))
            .pipe(gulp.dest(settings.paths.dest.images))
            .pipe(browserSync.reload({stream: true}));

        // TODO: favicon
        var faviconFile = '';
    }
};