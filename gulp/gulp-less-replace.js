/**
 * this gulp plugin replaces less variables with options given
 */

/*
 * gulp-replace-task
 *
 * Copyright (c) 2015 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/gulp-replace-task/blob/master/LICENSE-MIT
 */

'use strict';

// dependencies

var through2 = require('through2');
var gutil = require('gulp-util'),
    _ = require('lodash');

// constants

var PLUGIN_NAME = 'gulp-less-replace';

// plugin

module.exports = function (opts) {

    return through2.obj(function (file, enc, cb) {

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME,
                'Streaming not supported'));
            return cb();
        }

        var options = opts || {};
        var contents = file.contents.toString();

        // TODO: use a more generic pattern that supports all sorts of variables, instead of only
        // colors values!!
        var pattern = "[:\\t ]+(#[0-9a-f]+);";

        var matchFound = false;

        _.each(options.vars, function (val, key) {
            var varPattern = '@' + key + pattern;
            var retVal = '@' + key + ':\t' + val + ';';
            if(contents.match(new RegExp(varPattern))){
                contents = contents.replace(new RegExp(varPattern), retVal);
                matchFound = true;
            } else {
                return;
            }
        });

        // if we found a match, replace the contents, otherwise do nothing
        if (matchFound) {
            //console.log('less file path', file.path);
            file.contents = new Buffer(contents);
        } else {
            // preserve original file
        }

        this.push(file);
        cb(null, file);

    });

};
