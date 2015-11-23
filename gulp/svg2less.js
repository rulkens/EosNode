var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')();

module.exports = function(settings){
    return function () {
        var fs = require('fs'),
            p123Dir = 'pensioen123/',
            pensioen123Dir = settings.paths.src.images + p123Dir,
            icons, lessVars;

        fs.readdir(pensioen123Dir, function (err, files) {
            if(err) console.log('Error reading svg file directory', err);

            icons = files.map(function (file) {
                // cut off .svg
                return file.split('.')[0];
            });

            lessVars = '@pensioen123-icons: ' + icons.join(', ') + ';';

            // write to less file
            fs.writeFile(settings.paths.src.less + settings.files.src.less.icons, lessVars, function (err) {
                if(err) console.log('Error while writing less icon file', err);
            });
        });
    }
};