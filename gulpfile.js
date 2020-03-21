'use strict';

let gulp = require('gulp'),
    uglify = require('gulp-uglify-es').default,
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    preprocess = require('gulp-preprocess'),
    env = require('gulp-env'),
    ftp = require('vinyl-ftp'),
    gutil = require('gulp-util');

const path = {
    build: {
        html: 'www/',
        js: 'www/js/',
        css: 'www/css/',
        img: 'www/img/',
        backend: 'www/backend/'
    },
    src: {
        html: 'src/html/*.html',
        js: 'src/js/script.js',
        style: 'src/css/style.scss',
        img: 'src/img/**/*.*',
        backend: 'src/backend/**/*.*'
    },
    watch: {
        html: 'src/html/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        backend: 'src/backend/**/*.*'
    },
    clean: './www',
    deploy: 'www/**'
};

const envs = env({
    file: '.env',
    type: '.ini',
});

gulp.task('backend:build', async function () {
    gulp.src(path.src.backend)
        .pipe(gulp.dest(path.build.backend));
});

gulp.task('html:build', async function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(preprocess({
            context: envs
        }))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', async function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('css:build', async function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', async function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('build', gulp.series(
    'backend:build',
    'html:build',
    'js:build',
    'css:build',
    'image:build'
));

gulp.task('deploy', function () {

    let conn = ftp.create({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        parallel: 10,
        log: gutil.log
    });

    let globs = [
        path.deploy,
    ];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('sweetmebliv.com.ua/www'));

});

gulp.task('watch', function () {
    gulp.watch(path.watch.backend, gulp.series('backend:build'));
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.style, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
});

gulp.task('default', gulp.series('build', 'watch'));