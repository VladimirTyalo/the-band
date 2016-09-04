"use strict";

const gulp         = require("gulp"),
      sass         = require("gulp-sass"),
      plumber      = require("gulp-plumber"),
      postcss      = require("gulp-postcss"),
      scss         = require("postcss-scss"),
      autoprefixer = require("autoprefixer"),
      server       = require("browser-sync"),
      gulpGlob     = require("gulp-sass-glob"), // to import whole directories of scss
      path         = require("path"),
      mqpacker     = require("css-mqpacker"),
      cssMinify    = require("gulp-csso"),
      rename       = require("gulp-rename"),
      imagemin     = require("gulp-imagemin"),
      del          = require("del"),
      runSequence  = require("run-sequence"),
      config       = require("./config/config"),
      uglify       = require("gulp-uglify"),
      stylelint    = require("stylelint"),
      reporter     = require("postcss-reporter"),
      jshint       = require("gulp-jshint"),
      htmlhint     = require("gulp-htmlhint"),
      mocha        = require("gulp-mocha"),
      browserify   = require("browserify"),
      source       = require('vinyl-source-stream'),
      es           = require('event-stream'),
      flatten      = require("gulp-flatten"),
      concat       = require("gulp-concat");


gulp.task("style", function () {
  gulp.src(config.SASS_MAIN_FILE)
      .pipe(plumber())
      .pipe(gulpGlob())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({
          browsers: [
            "> 1%",
            "last 3 IE versions",
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Opera versions",
            "last 2 Edge versions"
          ]
        }),
        mqpacker({
          sort: true
        })
      ]))
      .pipe(gulp.dest("build/css"))
      .pipe(cssMinify())
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest("build/css"))
      .pipe(server.reload({stream: true}));
});

gulp.task("lint-styles", function () {
  var processors = [
    stylelint(config.STYLE_LINT),
    reporter({
      clearMessages: true,
      console: true
    })
  ];
  return gulp.src(config.SASS_FILES)
             .pipe(plumber())
             .pipe(postcss(processors, {syntax: scss}));
});


gulp.task("lint-js", function () {
  return gulp.src(config.JS_FILES)
             .pipe(jshint(config.JS_HINT_OPTIONS))
             .pipe(jshint.reporter('jshint-stylish'))
             .pipe(jshint.reporter('fail'));
});

gulp.task("lint-html", function () {
  return gulp.src(config.HTML_FILES)
             .pipe(htmlhint())
             .pipe(htmlhint.reporter("htmlhint-stylish"))
             .pipe(htmlhint.failReporter({suppress: true}));
});

gulp.task("serve", function () {
  server.init({
    server: "./build",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch(config.SASS_FILES, ["lint-styles", "style"]);

  gulp.watch(config.HTML_FILES, ["lint-html"]).on("change", function () {
    return gulp.src(config.HTML_FILES, {base: "."})
               .pipe(plumber())
               .pipe(gulp.dest("build"))
               .pipe(server.reload({stream: true}));
  });

  gulp.watch(config.JS_FILES, ["lint-js", "browserify"]);

  gulp.watch(config.JS_CLIENT_SIDE_FILES, ["uglify"]).on("change", server.reload);
});


// optimize images
gulp.task("images", function () {
  return gulp.src("build/img/**/*.{jpg,png,gif,svg}")
             .pipe(imagemin([
               imagemin.optipng({optimizationlevel: 3}),
               imagemin.jpegtran({progressive: true})
             ]))
             .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([].concat(config.FONT_FILES)
                    .concat(config.IMG_FILES)
                    .concat(config.HTML_FILES)
                    .concat(config.MEDIA_FILES), {
               base: "."
             })
             .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", function (fn) {
  runSequence(
    ["lint-styles", "lint-js", "lint-html"],
    "clean",
    "copy",
    "browserify",
    "uglify",
    "style",
    "images",
    fn
  );
});


gulp.task("test", function () {
  process.stdout.write("testing server side javascript ...");
  return gulp.src(config.JS_TEST_FILES, {read: false})
             .pipe(plumber())
             .pipe(mocha({reporter: "spec"}));
});


gulp.task("browserify", function () {

  // we define our input files, which we want to have
  // bundled:
  var files = [
    './js/main.js'
  ];
  // map them to our stream function
  var tasks = files.map(function (entry) {
    return browserify({entries: [entry]})
      .bundle()
      .pipe(source(entry))
      // rename them to have "bundle as postfix"
      .pipe(rename({
        extname: '.js'
      }))
      .pipe(gulp.dest('js/browserified'));
  });
  // create a merged stream
  return es.merge.apply(null, tasks);
});

gulp.task("uglify", function () {
  return gulp.src(config.JS_CLIENT_SIDE_FILES)
             .pipe(flatten())
             .pipe(concat("script.js"))
             .pipe(gulp.dest("build/js"))
             .pipe(uglify())
             .pipe(rename("script.min.js"))
             .pipe(gulp.dest("build/js"))
             .pipe(server.reload({stream: true}));
});

