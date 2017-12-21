const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const gulpIf = require('gulp-if');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('build:css', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(gulpSass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('build:fonts', function () {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build:images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('build:bundle', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
});

gulp.task('cache:clear', function () {
    return cache.clearAll()
});

gulp.task('build', function () {
    runSequence('clean:dist', ['build:css', 'build:images', 'build:fonts'], 'build:bundle');
});

gulp.task('watch', ['browserSync', 'build'], function () {
    gulp.watch('src/scss/**/*.scss', ['build:css', 'build:bundle']);
    gulp.watch('src/*.html', ['build:bundle']);
    gulp.watch('src/js/**/*.js', ['build:bundle']);
});
