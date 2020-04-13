const { src, dest } = require("gulp");
const slim = require("gulp-slim");
const foreach = require("gulp-foreach");
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create()

function slim2html_(arg) {
  console.log(arg);

  return src(arg)
    .pipe(plumber())
    .pipe(slim({
      options: "encoding='utf-8'"
    }))
    .pipe(rename(function (path) {
      path.dirname += "/../";
    }))
    .pipe(foreach(function (stream, file) {
      console.log(`${file.path.substr(file.path.lastIndexOf('/') - 2)} is ready to inlineCss`);
      return stream
    }))
    .pipe(dest('render'))
}
exports.slim2html_ = slim2html_

// // Promise
// module.exports = function () {
//   gulp.task('slim', function () {
//     return Promise.all([
//       new Promise(function (resolve, reject) {
//         gulp.src(['src/**/slim/*.slim'])
//         .pipe(plumber())
//         .pipe(slim({
//           options: "encoding='utf-8'"
//         }))
//         .on('error', reject)
//         .pipe(rename(function(path) {
//           path.dirname += "/../";
//         }))
//         .pipe(foreach(function(stream, file) {
//           var fileName = file.path.substr(file.path.lastIndexOf("\\")-2);
//           var myregex = fileName.replace(/(.+?)\\.+/,"$1");
//             // console.log('myregex ' + myregex + '\n fileName ' + fileName + '\n file.path ' + file.path)
//           return stream
//           // .pipe(bs.stream()) // cf premailer task
//         }))
//         .pipe(gulp.dest('render')) // html folder
//         .on('end', resolve)
//       })
//     ]).then(function () {
//       // console.log(` slim terminé run sass global_end:${global_end} `);
//       console.log(` slim terminé run sass `);
//       gulp.start('sass');
//     })
//   });
// }
