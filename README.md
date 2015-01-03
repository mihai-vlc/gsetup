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
this setup also includes a few helper functions as described below.




<table>
    
<thead>
    <tr>
        <th>Helper</th>
        <th>Description</th>
    </tr>
</thead>

<tbody>
    <tr>
        <td>include(tplName)</td>
        <td>
            
            <div class="highlight highlight-html"><pre>&lt;%= include('header') %&gt;
&lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s1"><span class="pl-pds">"</span>main<span class="pl-pds">"</span></span>&gt;
    Content
&lt;/<span class="pl-ent">div</span>&gt;
&lt;%= include('footer') %&gt;</pre></div>
<p>The <code>include</code> function will grab and parse the content of the specified file using
the same lodash template engine. </p>
<p>Considering that in the src/index.html file we would have an <code>include('foo')</code> the search 
would go like this:<br>
First in the defined paths:</p>
<ul class="task-list">
<li>src/partials/_foo.html </li>
<li>src/partials/foo </li>
</ul>
<p>Then in the current directory:</p>
<ul class="task-list">
<li>src/_foo.html </li>
<li>src/foo </li>
</ul>
<p>When it finds the first path that exists it will stop searching.<br>
You can add additional search paths in the <code>tplPaths</code> variable inside the gulpfile.<br>
The current directory for the parsed file is added automatically at the end of the list.</p>

        </td>
    </tr>

    <tr>
        <td>isBuild()</td>
        <td>You can use this function inside the templates to determine if the current process is
a build one</td>
    </tr>

    <tr>
        
        <td>file</td>

        <td>This variable will contain the path of the current template/partial file.</td>
    </tr>

    <tr>
        <td>path</td>
        <td>The nodejs path module http://nodejs.org/api/path.html</td>
    </tr>

</tbody>

</table>


### Contributions

Please report bugs in the [issue tracker](https://github.com/ionutvmi/gsetup/issues).


### Author

**Mihai Ionut Vilcu**
 
+ [github/ionutvmi](https://github.com/ionutvmi)
+ [twitter/ionutvmi](http://twitter.com/ionutvmi) 

### License
Copyright (c) 2014 Mihai Ionut Vilcu   
Released under the MIT license

