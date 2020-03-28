// import img from './tasks/img'
// require("./tasks/img.js").default();
// const gulp = require('gulp')
// import { src, dest, watch, parallel, series } from 'gulp';

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


// browser-sync task !attention index.html obligatoire
// gulp.task('bs', function () {
//   bs.init({
//     server: {
//       baseDir: 'render/FR',
//       index: 'index.html'
//     }
//   })
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
const slim = require("gulp-slim");
const foreach = require("gulp-foreach");
const rename = require('gulp-rename');

// function clean(done) {
//   rimraf('./render', function (cb) {
//     console.log('render is destroyed : clean is over.\nlet\'s work on clean folder!');
//   })
//   done()
// }
const img = () => {
  console.log('img is ready');
  return src('src/**/images/*.{png,jpg,gif}')
    .pipe(dest('render'))

}
const clean = () => {
  rimraf('./render', function () {
    console.log('render is destroyed : clean is over.\nlet\'s work on clean folder!');
  })
}

function slim2html() {
  return src('src/**/slim/*.slim')
    .pipe(slim({
      options: "encoding='utf-8'"
    }))
    .pipe(rename(function (path) {
      path.dirname += "/../";
    }))
    .pipe(foreach(function (stream, file) {
      var fileName = file.path.substr(file.path.lastIndexOf("\\") - 2);
      var myregex = fileName.replace(/(.+?)\\.+/, "$1");
      // console.log('myregex ' + myregex + '\n fileName ' + fileName + '\n file.path ' + file.path)
      return stream
      // .pipe(bs.stream()) // cf premailer task
    }))
    .pipe(dest('render'))
}

exports.build = series(
  img
)
// module.exports = {
//   default: series(clean, img)
// }