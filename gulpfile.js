var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var browserSync = require('browser-sync').create();

var path = {
  main: 'dist',
  assets: 'dist/assets'
};

// BrowserSync Task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
});

// Jade Task
gulp.task('jade', function() {
  return gulp.src('src/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path.main))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Sass Task
gulp.task('sass', function() {
  return gulp.src('src/scss/*.scss') // get source files
    .pipe(sass({
      outputStyle: 'expanded'
    })) // sass plugin
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest(path.assets + '/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// JS Task
gulp.task('build-scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(rename({suffix: '.min' }))
    .pipe(gulp.dest(path.assets + '/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('vendor-scripts', function() {
  return gulp.src('src/scripts/vendor/*.js')
    .pipe(gulp.dest(path.assets + '/js'))
})

gulp.task('scripts', ['build-scripts', 'vendor-scripts']);

// Copy Fonts
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest(path.assets + '/fonts'))
});

// Watch Task
//gulp.task('watch', ['browserSync', 'jade', 'sass', 'fonts'], function() {
//  gulp.watch('src/jade/**/*.jade', ['jade']);
//  gulp.watch('src/scss/**/*.scss', ['sass']);
//})


gulp.task('watch', function() {
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
});

gulp.task('build', ['sass', 'jade', 'scripts', 'fonts']);

gulp.task('default', ['watch', 'browserSync']);
