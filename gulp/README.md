# Gulp Tasks

This directory contains the different gulp tasks that are available to develop and build a production ready system.

The main task for development is called `serve`, which starts a BrowserSync webserver that allows for fast reloading,

[Gulp website](http://gulpjs.com/)
[Gulp GitHub](https://github.com/gulpjs/gulp)

## Development strategy

Rapid iteration, well-defined structure, optimizing developer happiness and productivity.

## Plugins

A short description of the most important gulp plugins used. Feel free to expand.

## BrowserSync

This one is not technically a gulp plugin, but ties in with the gulp build system very well. It can automatically refresh
the page when you change the scripts or html templates and even inject new css without reloading the page. This allows
for very fast iteration.

[BrowserSync Website](http://www.browsersync.io/)
[BrowserSync Tutorial](http://www.browsersync.io/docs/gulp/)

### gulp-inject

The gulp injector plugin is used to inject references to the compiled javascript and css files into the main HTML view.

You can see this plugin at work in the `html.js` task

    gulp html
    

*Example*

    .pipe(plugins.inject(cssFiles))

### gulp-replace-task

To replace variables within the `.html` files, for example the ones that are set for specific sites.

    @@var-name
    
Will be replaced by the setting `var-name` in the site-specific .json file in the settings folder. This file is loaded
as the `siteSettings` variable in the main gulp file and passed on to the specific gulp tasks.

To run it. If you look at the `index.html` main view, you see that for example the site title is variable like so:

    <title>@@title</title>
    
In the parsed view, in the `public` directory, The `@@title` is replaced by the title mentioned in the specific settings
file.

*Example*

    .pipe(plugins.replaceTask({ patterns: [ { json: siteSettings }]}))

### gulp-plumber

This plugin catches errors in the task pipeline and gives you a bit more flexibility in how to handle these errors, because
normally they would cause your gulp task to crash. Since this is often not the desired behaviour, with almost all task
pipelines we used this plugin and route the error elsewhere. 

This plugin ties in really well with `gulp-notify` which shows notifications with the native notification system used in
your OS version.

*Example*

    .pipe(plugins.plumber(errorHandler)) // catch errors

## gulp-notify

A super-handly plugin that shows notifications with the native notification system used in your OS version.

*Example*

    .pipe(plugins.notify({ message: "Templates rebuild", onLast: true}))

## gulp-sourcemaps

When looking at your code in the Chrome/Firefox/IE debugger, you would like to see where the error happens, or change needs
to happen. Since all files are pre-processed, combined, altered before serving to the browser, by default you would be
trying to debug this minified/concatenated version. It takes an extra step finding your way back to the original
source file, taking valuable developer time. This is where [sourcemaps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
come in.

Sourcemaps make it appear in debugger tools as if you were running the original source file.

*Example*

    .pipe(sourcemaps.init())
    ...
    .pipe(sourcemaps.write())

## gulp-iife

A small plugin for javascript source files that wraps the code in an [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
(Immediately Invoked Function Expression). This works around a flaw (or a feature) of javascript, where any variable
declared in a file, not within a function is put on the global scope, thus polluting it and introducing the risk of
variable collisions, overwriting variables, etc. It is considered good practice to wrap every source file in an IIFE,
effectively creating a local scope. Any api that needs to be exposed can be explicitly put on the global scope or
use commonJS/AMD style module definition.

[About IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)

*Example*

    .pipe(plugins.iife())

## gulp-ng-annotate

AngularJS works with DI (dependency Injection). This is a very developer-friendly way of resolving module dependencies.
However, the resulting code does not work with minifying solutions (such as `gulp-uglify`). To make sure dependencies are
correctly resolved, this plugin explicitly injects these into the source files. When you use angular's DI, just simple add
an ngInject annotation, and the plugin will inject the dependencies for you.

    /* @ngInject */
    function directive(someService){}
    
Will result in
    
    function directive(someService){}
    directive.$inject = ['someService'];
    
When this is minified, it might look like this:

    function b(a){}
    b.$inject = ['someService'];
    
Without the inject plugin, this DI would fail because the module a obviously does not exist.

*Example*

    .pipe(plugins.ngAnnotate())

## gulp-autoprefixer

Because not all browsers support the newest syntax for some CSS features, sometimes vendor-specific prefixes are required.
As a developer, you don't want to be bothered copy-pasting all these prefixed into your source .less files, because it is
labour intensive, error prone and not DRY. This plugin will automatically parse the resulting CSS and add prefixes when
necessary. It is also customizable to support different levels of backwards compatibility, for legacy browsers like IE8
and IE9.

*Example*

    .pipe(plugins.autoprefixer())

## less-plugin-glob

This adds glob support to the less parser, which is very useful to include a whole directory of files without having to 
specify each individual file. It is used in the case of components, which can include an arbitrary number of less files,
and it's a hassle to generate less `@import`'s for every file.

*Example*

    .pipe(plugins.less({ plugins: [require('less-plugin-glob')] }))

## gulp-print

Prints a list of files that are currently in the pipeline, useful for debugging.

*Example*
    
    .pipe(plugins.print())


## gulp-less-replace

This is a custom version I made of a simple string replacement plugin. It is used to replace colour values in `.less` 
files. It is largely untested, but it works with colour values set in the site-specific settings files.

You can override less variables in the site-specific settings, i.e. for changing the colour scheme or typography.

TODO: make it more generic so it also supports non-colors. 

*Example*