# Build procedure.

Build process is implemented with [Grunt](http://gruntjs.com/).

To set up all dependencies use next shell commands:

```
# npm install -g grunt-cli
# npm install -g bower
$ npm install
$ bower install
```

## Tests

```
$ grunt test
```

NOTE: currently there is problem running browser tests with Grunt. To run browser test please
open ```test/client.html``` in your favourite browsers.

## Build

```
$ grunt build
```

## Default behaviour

```
$ grunt
```

Is equal to:
```
$ grunt test && grunt build
```

# Build artifacts location

## Browser version
```
<project_dir>/dist/browser
```

## NodeJS version
```
<project_dir>/dist/nodejs
```