import { src, dest, watch, series } from 'gulp'
// SCSS to CSS
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
// Minified CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
// Minified JS
import terser from 'gulp-terser';
// Browser Sync
import browserSync from 'browser-sync';

const sassCompiler = gulpSass(sass);

// File Path
const paths = {
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    // icons: 'icons/**/*',
    // imgs: 'src/images/**/*',
    output: 'dist',
}

// HTML Task - Copies HTML files to `dist`
function htmlTask() {
    return src(paths.html)
        .pipe(dest(paths.output));
}

// Sass Tasks 
function scssTask() {
    return src(paths.scss, { sourcemaps: true})
        .pipe(sassCompiler())
        .pipe(postcss([cssnano()]))
        .pipe(dest(`${paths.output}/css`, { sourcemaps: true}))
}

// Copy Images Task
// function imgsTask() {
//     return src(paths.imgs, {encoding: false})
//         .pipe(dest(`${paths.output}/images`))
// }

// JS Tasks 
function jsTask() {
    return src(paths.js, { sourcemaps: true})
        .pipe(terser())
        .pipe(dest(`${paths.output}/js`, { sourcemaps: true}))
}


// BrowserSync Tasks 
function browserSyncServe(callback) {
    browserSync.init({
        server: {
            baseDir: paths.output
        }
    })

    callback()
}

function browserSyncReload(callback) {
    browserSync.reload()
    callback()
}

// Watch Tasks
function watchTasks() {
    watch(paths.html, series(htmlTask ,browserSyncReload))
    watch(paths.scss, series(scssTask, browserSyncReload))
    watch(paths.js, series(jsTask, browserSyncReload))
    // watch(paths.icons, series(iconsTask, browserSyncReload))
    // watch(paths.imgs, series(imgsTask, browserSyncReload))
}

//Default Gulp Task
export default series(
    scssTask,
    jsTask,
    htmlTask,
    // iconsTask,
    // imgsTask,
    browserSyncServe,
    watchTasks
  );