module.exports = {
  SASS_FILES: ["sass/**/*.scss", "!sass/vendor/*"],
  SASS_MAIN_FILE: "sass/style.scss",
  HTML_FILES: ["./*.html"],
  JS_FILES: [
    "config/**/*.js",
    "js/**/*.js",
    "gulpfile.js",
    "!js/vendor/**/*.js",
    "!js//browserified/**/*.js"
  ],
  JS_CLIENT_SIDE_FILES: [
    "js/browserified/**/*.js"
  ],
  IMG_FILES: ["img/**"],
  FONT_FILES: ["fonts/**/*.{woff,woff2}"],
  MEDIA_FILES:["media/*"],
  JS_TEST_FILES: ["test/**/*.js"],

  JS_HINT_OPTIONS: {
    globals: {
      describe: false,
      it: false,
      beforeEach: false,
      afterEach: false,
      task: false,
      before: false,
      after: false,
      complete: false,
      fail: false
    },
    bitwise: true,
    eqeqeq: true,
    forin: true,
    newcap: true,
    noarg: true,
    nocomma: true,
    nonbsp: true,
    nonew: true,
    notypeof: true,
    strict: true,
    //latedef: "nofunc",
    undef: true,  // not letting global var without explicitly define them in upper comments as globals
    node: true,
    browser: true,
    laxcomma: true,
    esversion: 6,
    devel: true,
    expr: true // for mocha expect(value).to.not.be.undefined,
  },
  // general configuration of style lint: http://stylelint.io/user-guide/configuration/
  // list of options: http://stylelint.io/user-guide/rules/
  // https://github.com/stylelint/stylelint-config-standard
  STYLE_LINT: {

    // "extends": "stylelint-config-standard",
    //"extends": "stylelint-config-idiomatic-order",
    "rules": {
      "block-no-empty": true,
      "color-no-invalid-hex": true,
      "declaration-colon-space-after": "always",
      "declaration-colon-space-before": "never",
      "function-comma-space-after": "always",
      "media-feature-colon-space-after": "always",
      "media-feature-colon-space-before": "never",
      "media-feature-name-no-vendor-prefix": true,
      "max-empty-lines": 5,
      "number-leading-zero": "always",
      "number-no-trailing-zeros": true,
      "property-no-vendor-prefix": true,
      "selector-list-comma-space-before": "never",
      "selector-list-comma-newline-after": "always",
      "selector-no-id": true,
      "string-quotes": "double",
      "value-no-vendor-prefix": true,
      "indentation": 2
      //  "declaration-block-properties-order": ["content", "display", "float", "flex", "width", "height", "position", "top", "right", "bottom", "left", "margin", "padding", "border", "font", "background"]
      //}
    }
  }
};
