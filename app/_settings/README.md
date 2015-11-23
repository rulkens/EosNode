# Settings
The settings for this app are contained in a couple of json files. The `api` directory contains dummy data for the
API. The `spf.json` and `spov.json` files contain site-specific information. They are in the site directory.

# Site-specific settings

By using the `--site sitename` switch in the gulp `build` or `serve` tasks, you can select which version of the site
you want to work on :

```
gulp serve --site spf
```

The specific `sitename.json` is loaded from the `site` directory and the variables defined here are injected into the
template, less and javascript files. Each type of file has a slightly different injection method, to make sure
the file can still be loaded without causing parse errors. 

# Environment-specific settings

By using the `--env environment` switch in the gulp `build` or `serve` tasks, you can select which environment you want 
to work on. By default it selects the `mvc` environment.

## Less / Style

When defining a style variable, it is searched for in all `.less` source files and replaced with the variable value if
it is found. It looks for a regular less variable name and replaced the value:

    "style" {
        "var" : "#CCC"
    }

Looks for the `var` variable in a `.less` file:

    @var : #FF0000;
    
And replaces the value:

    @var : #CCC;

*NOTE*: currently, the parser doesn't allow for variables other than color values!!

## HTML

Replaces variables in the same way, but uses `@@` as a variable indicator, using [applause](https://github.com/outaTiME/applause)

    <title>@@title</title>