// import img from './tasks/img'
// require("./tasks/img.js").default();

// import { img } from './tasks/img';
// export const img = () => {
//   return src('src/**/images/*.{png,jpg,gif}')
//     .pipe(dest('render'))
// }

// Development Task
// export const dev = series(img);

// export default dev;

// require("./tasks/slim.js")();

// lire note dependance sass.js
// require("./tasks/sass.js")();
// require("./tasks/premailer.js")();
// require("./tasks/prettify.js")();

// sys protection contre réécriture avant fin de slim,sass,premailer,prettify.
// var global_end   = "";
// const bs = require('browser-sync')
// const plumber = require('gulp-plumber')
// const rename = require('gulp-rename')
// const using = require('gulp-using')
// const changed = require('gulp-changed')

// module.exports = {
//   img,
//   default: series(img)
// }

// src & output
// var src = 'src/';

// delete old folder before start dev task
// gulp.task('dev', function (cb) {
//   rimraf('./render', function cb() {
//     console.log('render is destroyed : clean is over.\nlet\'s work on clean folder!');
//     gulp.start('dev1');
//   });
// });

// const reportChange = (event) => {
//   console.log("\x1b[30m\x1b[43m%s\x1b[0m", `File: ${event.path}, type was ${event.type}, running tasks...`);
// };

// gulp.task('dev1', ['img', 'slim'], function () {
//   gulp.start('build');
// });


// gulp.task('build', ['bs'], function () {

//   gulp.watch(['source.json', src + '**/**/*.slim', src + '**/scss/*.scss'], ['slim']).on('change', reportChange);
//   gulp.watch(src + '**/images/*.{png,jpg,gif}', ['img']).on('change', reportChange);
// })
const { series, parallel, src, dest } = require('gulp');
const rimraf = require('rimraf')
const browserSync = require('browser-sync').create()
const slim = require("gulp-slim");
const foreach = require("gulp-foreach");
const rename = require('gulp-rename');
const sass = require('./tasks/sass').sass
const premailer = require('./tasks/premailer')

sass()

// browser-sync task !mandatory index.html
function bs() {
  browserSync.init({
    server: {
      baseDir: './render/FR',
      index: 'index.html'
    }
  })
}
// to use from cli gulp bs
exports.bs = bs

let endSignal = false
function log(message) {
  console.log(message);
}

async function rm() {
  await Promise.resolve(
    endSignal = true,
    rimraf.sync('./render'),
    log(`render is removed let's work on clean foler.`)
  )
}
// exports.rm = rm

function img() {
  return src('src/**/images/*.{png,jpg,gif}')
    .pipe(dest('render'))
    .on('end', function () {
      log(`img folder are created ${endSignal}`)
    })
}
exports.img = img


function slim2html() {
  return src('src/**/slim/*.slim')
    .pipe(slim({
      options: "encoding='utf-8'"
    }))
    .pipe(rename(function (path) {
      path.dirname += "/../";
    }))
    .pipe(foreach(function (stream, file) {
      console.log(file.path.substr(file.path.lastIndexOf('/') - 2));

      return stream
    }))
    .pipe(dest('render'))
    .pipe(browserSync.stream()) // cf premailer task
}

// exports.dev = series(
//   clean,
//   img
// )
exports.dev = series(
  rm,
  img,
  slim2html,
  sass,
  bs
)
// module.exports = {
//   default: series(clean, img)
// }
