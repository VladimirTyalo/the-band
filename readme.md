# GULP AUTOMATIZATION TEMPLATE

**VERSION 1.0.2** [Change log](changelog.md)

SIMPLE TEMPLATE FOR CREATING HTML PAGES USING SASS, CODE LINTERS, AUTOPREFIXER, IMAGE OPTIMIZATION ETC.

## Getting started

to start just type:
`npm start`
in command line and the server will
 - lint all your css, js and html (you can set witch files to lint in [config.js](config/config.js) )
 - clean build directory if it existed, make new directory if not, and copy all static files to it ( [it is also configurable](config/config.js) )
 - compile your SCSS/SASS files into build/css directory
 - optimize images in build img directory so that original files stayed untouched
 - start serving at http://localhost:3000

 linux users could start separate tasks from [gulpfile.js](gulpfile.js) just typing:
 `./gulp.sh [task name]`

P.S. Make sure yor gulp.sh file is executable by typing `chmod +x gulp.sh`

## Motivation
This project was created to start simple projects  quickly providing code quality assurance.
It uses [stylint](https://www.npmjs.com/package/stylelint) for sass/css linting, [gulp-jshint](https://www.npmjs.com/package/gulp-jshint) for javascript and [gulp-htmlhint](https://www.npmjs.com/package/gulp-htmllint) for html.

While compiling SASS it also autoprefix it with postCss plugin, sort media queries and finally make to 2 versions of css: plain one and minified one.
It also uses borwsersync to inject changes of your SASS to html page on the fly and refresh browsers on js or html changes.

I am a big fan of BEM methodology so I created basic sass folder structure also adjusted to BEM.

Stylelint use [idiomatic-order](https://www.npmjs.com/package/stylelint-config-idiomatic-order) plugin, but you can set any other plugin of your choice in [config](config/config.js) or just comment it out if you don't want strict rules for properties order

node_modules are also included in this repo for better safety  in case of apocalypse )

I wanted to keep it simple, so not much features are supported for now!

## CONTRIBUTORS
- [TYALO VLADIMIR](http://tyalovladimir.herokuapp.com)

## LICENSE & COPYRIGHT

© Tyalo Vladimir

Licensed under the [MIT License](LICENSE).
