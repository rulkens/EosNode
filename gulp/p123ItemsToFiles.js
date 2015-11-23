var gulp               = require('gulp'),
    plugins            = require('gulp-load-plugins')(),
    fs                 = require('fs'),
    _                  = require('lodash');

module.exports = function(settings, errorHandler){
    return function () {

        var file = 'content/spov/pensioen123-items';
        var path = 'content/spov/pensioen123/';

        fs.readFile(file, function(err, data){
            console.log('data', data.toString());
            items = data.toString().split('***');

            // split into id and content
            items = _.map(items, function (item) {
                var d = item.split('**');
                return [d[0], d[1].trim()]
            });

            // create string
            var str = '<naam>$1</naam>\n<laag1>\n\t$2\n</laag1>\n<laag2>\n\n</laag2>';

            // create a file for each item
            _.each(items, function (item) {
                var contents = str.replace('$1', item[0]).replace('$2', item[1]);
                var fileName = path + item[0] + '.html';

                fs.writeFile(fileName, new Buffer(contents));
            });

        })

    }
};