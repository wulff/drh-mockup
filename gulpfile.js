// Gulp tasks for the drh.dk mockup site.

var
  gulp = require('gulp')
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  // imagemin = require('gulp-imagemin'),
  minifyCSS = require('gulp-minify-css'),
  minifyHTML = require('gulp-minify-html'),
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
    '!src/assets/{!img,js,scss}/**/*'
  ],
  pages: [
    'src/pages/**/*.html',
  ],
  sass: [
    'src/assets/scss',
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src/'
  ],
  javascript: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/what-input/what-input.js',
    'bower_components/foundation-sites/js/foundation.core.js',
    'bower_components/foundation-sites/js/foundation.util.*.js',
    'src/assets/js/!(drh.js)**/*.js',
    'src/assets/js/drh.js'
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
    .pipe(minifyHTML(opts))
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
   // .pipe(minifyCSS())
   .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('build', function(done) {
  sequence('clean', ['pages', 'sass'], done);
});

gulp.task('serve', ['build'], function() {
  browser.init({
    server: paths.dist,
    port: port,
    startPath: '/front.html',
  });
});

gulp.task('default', ['build', 'serve'], function() {
  gulp.watch(['src/assets/scss/**/*.scss'], ['sass', browser.reload]);
  gulp.watch(['src/pages/**/*.html'], ['pages', browser.reload]);
});
