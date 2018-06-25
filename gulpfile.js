'use strict';

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const cmq = require('gulp-combine-mq');
const watch = require('gulp-watch');
const rename = require('gulp-rename');

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('public'));
});

gulp.task('sass', function () {
    return gulp.src('src/**/*.sass')
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(cmq({beautify: true}))
        .pipe(gulp.dest('public'));
});

gulp.task('js', function () {
    return gulp.src('src/**/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('public'));
});

gulp.task('image', function () {
    return gulp.src('src/**/*.{png,jpg,gif,svg}')
        .on('data', function (file) {
            file.path = file.base + '/' + file.basename;
        })
        .pipe(gulp.dest('public/images'));
});

gulp.task('clean', function () {
    return gulp.src('public/*', {read: false})
        .pipe(clean());
});

gulp.task('css:minify', function () {
    return gulp.src('public/**/*.css')
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public'));
});

gulp.task('minify', gulp.series('css:minify'));

gulp.task('build', gulp.series('clean', 'html', 'sass', 'js', 'image', 'minify'));

gulp.task('watch', function () {
    watch('src/**/*.html', gulp.series('html'));
    watch('src/**/*.sass', gulp.series('sass'));
    watch('src/**/*.js', gulp.series('js'));
    watch('src/**/*.{png,jpg,gif,svg}', gulp.series('image'));
});

gulp.task('server', function () {
    browserSync.init({
        server: 'public'
    });

    browserSync.watch('public/*').on('change', function () {
        browserSync.reload();
    });
});

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')));