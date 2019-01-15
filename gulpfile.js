var gulp = require('gulp');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');

var paths = {
  scss: './scss/*.scss',
  pug: './pug/!(_)*.pug'
};

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['build']);
  gulp.watch(paths.pug, ['web']);
});

gulp.task('build', function() {
  gulp.src(paths.scss)
    .pipe(sass({outputStyle: 'compact', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./assets/css'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('web', function() {
  gulp.src(paths.pug)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);
