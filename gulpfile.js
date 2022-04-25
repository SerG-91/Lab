const {src, dest, watch, parallel, series} = require('gulp');

const scss     = require('gulp-sass')(require('sass'));
const del      = require('del');
const sync     = require('browser-sync').create();
const include  = require('gulp-file-include');
const concat   = require('gulp-concat');
const uglify   = require('gulp-uglify-es').default;
const autopr   = require('gulp-autoprefixer');
const Del      = require('del'); 


function Clean(){
    return Del('dist')
}

function style(){
    return src('src/scss/**.css')
    //.pipe(scss({outputStyle:'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autopr({
        overrideBrowserslist:['last 10 version'],
        grid: true 
    }))
    .pipe(dest('src/css'))
    .pipe(sync.stream())
}


function watching(){
    watch(['src/scss/*.css'], style);
    watch(['src/js/**/*.js','!src/js/main.min.js'], scripts);
    watch(['src/*.html']).on('change', sync.reload);
}

function Sync(){
    sync.init({
        server:{
            baseDir: 'src/'
        }
    });
}

function scripts(){
    return src([
        'node_modules/jquery/dist/jquery.js',
        'src/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(sync.stream())
}

function build(){
    return src([
        'src/css/style.min.css',
        'src/fonts/**/*',
        'src/js/main.min.js',
        'src/img/*',
        'src/*.html'
    ], {base:'src'})
        .pipe(dest('dist'))
}

exports.style     = style;
exports.watching  = watching;
exports.Sync      = Sync;
exports.scripts   = scripts;
exports.Clean     = Clean;


exports.build     = series(Clean, build);
exports.default   = parallel(style, scripts, Sync, watching);