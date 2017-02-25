// Gulp tasks for the drh.dk mockup site.

var
  gulp = require('gulp')
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  // imagemin = require('gulp-imagemin'),
  cleanCSS = require('gulp-clean-css'),
  // minifyHTML = require('gulp-minify-html'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify');

var
  browser = require('browser-sync'),
  del = require('del'),
  path = require('path')
  sequence = require('run-sequence');

var compatibility = ['last 2 versions', 'ie >= 9'];

var port = 8000;

var paths = {
  dist: 'dist',
  assets: [
    'src/assets/**/*',
    '!src/assets/{!js,scss}/**/*'
  ],
  pages: [
    'src/pages/**/*.html',
  ],
  sass: [
    'src/assets/scss',
    'node_modules/bootstrap/scss',
  ],
  javascript: [
    // TODO: do we need this at all? could we cherry-pick from bootstrap instead?
    'node_modules/tether/dist/js/tether.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    // 'src/assets/js/!(drh.js)**/*.js',
    'src/assets/js/site.js'
  ]
};

gulp.task('clean', function(done) {
  return del(paths.dist, done);
});

gulp.task('pages', function(done) {
  var opts = {
    conditionals: true
  };

  return gulp.src(paths.pages)
    // .pipe(minifyHTML(opts))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('assets', function(done) {
  return gulp.src(paths.assets)
    // .pipe(minifyHTML(opts))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function(done) {
  return gulp.src('src/assets/scss/drh.scss')
   .pipe(sass({
     includePaths: paths.sass
   }).on('error', sass.logError))
   // .pipe(autoprefixer({
   //   browsers: compatibility
   // }))
   // .pipe(cleanCSS())
   .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('javascript', function(done) {
  return gulp.src(paths.javascript)
    .pipe(concat('drh.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.dist + '/js/'));
});

// TODO: add javascript-vendor task to copy jquery etc. into place.

gulp.task('build', function(done) {
  sequence('clean', ['pages', 'assets', 'sass', 'javascript'], done);
});

gulp.task('serve', ['build'], function() {
  browser.init({
    server: paths.dist,
    port: port,
    startPath: '/',
  });
});

gulp.task('default', ['build', 'serve'], function() {
  // TODO: Watch js, img folder as well
  gulp.watch(['src/assets/scss/**/*.scss'], ['sass', browser.reload]);
  gulp.watch(['src/pages/**/*.html'], ['pages', browser.reload]);
});
