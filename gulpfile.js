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
// const path = require('path');
const fs = require('fs');
// const renderDir = path.join(__dirname, 'render')

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}
const { gulp, series, parallel, src, dest, watch } = require('gulp');
const rimraf = require('rimraf')
const browserSync = require('browser-sync').create()
// const slim = require("gulp-slim");
const { slim2html } = require('./tasks/slim')
const { slim2htmlByCountry } = require('./tasks/slim2htmlByCountry')
// const { sass } = require('./tasks/sass')
const { sass } = require('./tasks/sass')
const { inlineCss } = require('./tasks/inlineCss')

exports.sass = sass
// use sass task from cli: gulp sass
exports.slim2html = slim2html
exports.slim2htmlByCountry = slim2htmlByCountry
// use sass task from cli: gulp slim2html
exports.inlineCss = inlineCss
// use sass task from cli: gulp inlineCss

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
// use as cli gulp rm
exports.rm = rm

function img() {
  return src('src/**/images/*.{png,jpg,gif}')
    .pipe(dest('render'))
    .on('end', function () {
      log(`img folder are created? ${endSignal}`)
    })
}
exports.img = img

const compile = series(
  rm, img,
  sass, slim2html, inlineCss,
  bs
)
compile.description = 'compile all sources'
exports.compile = compile

// exports.dev = series( rm, img, slim2html, sass, bs, cssWatch )

const imgWatch = () => {
  watch(['src/**/images/*.{png,jpg,gif}'], series(img, slim2html))
}

const cssWatch = () => {
  // watch(['src/**/slim/*.slim'], series(slim2html, sass, inlineCss)).on('change', (stream) => console.log(stream))
  watch(['src/**/slim/*.slim']).on('change',
    (stream) => {
      slim2htmlByCountry(stream);
      console.log(getFiles('render'));
    }
  )
  // watch(['src/**/scss/*.scss'], series(sass, slim2html)).on('change', function (stream) { console.log(`sass change ${stream}`) })
  // watch('render/FR/index.html').on('change', browserSync.reload)
}
exports.imgWatch = imgWatch
exports.cssWatch = cssWatch
const watchall = parallel(imgWatch, cssWatch)
exports.watchall = watchall

const start = parallel(compile, watchall)
exports.start = start
