const path = require('path');
const gulp = require('gulp');
const clean = require('gulp-clean');
const connect = require('gulp-connect');
const less = require('gulp-less');
const watch = require('gulp-watch');
const open = require('gulp-open');
const sourcemaps = require('gulp-sourcemaps');

const src = 'src';
const target = 'dist';

// Web server
gulp.task('serve', () => {
  connect.server({
    root: target,
    port: 9003,
    livereload: true
  })
  gulp.src('').pipe(open({uri: 'http://localhost:9003'}));
});

// File watcher
gulp.task('watch', () => {
  gulp.watch([`${src}/**`, `!${src}/css/*`, `!${src}/**/*.html`], { ignoreInitial: false }, ['copy-files']);
  gulp.watch([`${src}/**/*.html`], { ignoreInitial: false }, ['html']);
  gulp.watch([`${src}/css/**/*`], { ignoreInitial: false }, ['css']);
});

// Clean the output directory
gulp.task('clean', () => {
  return gulp.src(target, { read: false })
    .pipe(clean());
});

// Copy all assets except our HTML and CSS
gulp.task('copy-files', () => {
  return gulp.src([`${src}/**`, `!${src}/css/*`, `!${src}/**/*.html`])
    .pipe(gulp.dest(target))
    .pipe(connect.reload());
});

// Copy HTML
gulp.task('html', () => {
  return gulp.src([`${src}/**/*.html`])
    .pipe(gulp.dest(target))
    .pipe(connect.reload());
});

// Build the CSS
gulp.task('css', () => {
  return gulp.src([`${src}/css/*`])
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [
        path.join(__dirname, '.'),
        path.join(__dirname, `${src}/css`),
        path.join(__dirname, 'node_modules') ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${target}/css`))
    .pipe(connect.reload());
});

gulp.task('build', ['copy-files', 'html', 'css']);
gulp.task('default', ['build', 'serve', 'watch']);
