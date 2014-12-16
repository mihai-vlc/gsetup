# Gsetup

> A gulp setup for web development


### Install

    git clone https://github.com/ionutvmi/gsetup.git
    cd gsetup
    npm install

### Development

    gulp dev


### Build

    gulp build


### What it does

* Compiles sass using `gulp-ruby-sass`
* Runs autoprefixer over your css
* Minifies the css with [clean-css](https://github.com/GoalSmashers/clean-css)
* Minifies the js with [UglifyJs](http://lisperator.net/uglifyjs/)
* Builds a development static server (includes livereload)
* The livereload is watching for your css, js, html changes
* Compiles the html using the [LoDash Templates](https://lodash.com/docs#template)
* The js is concatenated using  [gulp-usemin](https://github.com/zont/gulp-usemin)


### Templates
Apart from the default functionality provided by the [LoDash Templates](https://lodash.com/docs#template)
this setup also includes a few helper vars as described below.

**include(tplName)**
```html
<%= include('header') %>
<div class="main">
    Content
</div>
<%= include('footer') %>
```

The `include` function will grab and parse the content of the specified file using
the same lodash template engine. 

Considering that in the src/index.html file we would have an `include('foo')` the search 
would go like this:  
First in the defined paths:

- src/partials/_foo.html 
- src/partials/foo 

Then in the current directory:

- src/_foo.html 
- src/foo 

When it finds the first path that exists it will stop searching.  
You can add additional search paths in the `tplPaths` variable inside the gulpfile.  
The current directory for the parsed file is added automatically at the end of the list.


**isBuild()**  
You can use this function inside the templates to determine if the current process is
a build one


**file**
This variable will contain the path of the current template/partial file.

**path**
The nodejs [path module](http://nodejs.org/api/path.html)

### Contributions

Please report bugs in the [issue tracker](https://github.com/ionutvmi/gsetup/issues).


### Author

**Mihai Ionut Vilcu**
 
+ [github/ionutvmi](https://github.com/ionutvmi)
+ [twitter/ionutvmi](http://twitter.com/ionutvmi) 

### License
Copyright (c) 2014 Mihai Ionut Vilcu   
Released under the MIT license

