var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');
var minify = require('gulp-minify');

var paths = {
  sass: ['./scss/**/*.scss'],
    js: ['./www/js/**/*.js']
};

gulp.task('default', ['sass', 'scripts']);

gulp.task('minification', function () {
    return gulp.src(paths.js)
        .pipe(ngmin({dynamic: true}))
         .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', function() {
  gulp.src(paths.js)
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function() {
    return gulp.src(paths.js)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['js'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('test', function () {
  gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});

gulp.task('js', function () {
  gulp.src(['./www/js/app.js', './www/js/controllers/**/*.js', './www/js/factory/**/*.js' ])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./www/js/'))
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});


gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
