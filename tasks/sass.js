var gulp = require("gulp");
var gulpSass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

// Promise
function sass() {

  // gulp.src('src/**/scss/*.scss')
  //   .pipe(gulpSass({ errLogToConsole: true }))
  //   .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  //   .pipe(rename(function (path) {
  //     path.dirname += "/../css";
  //   }))
  //   .pipe(gulp.dest('render'))

  const promise1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('foo');
    }, 3000);

  })
  promise1.then(function (value) {
    console.log(value);
    // expected output: "foo"
  });
  console.log(promise1);

  //   return Promise.all([
  //     new Promise(function (resolve, reject) {
  //       gulp.src('src/**/scss/*.scss')
  //         .pipe(sass({ errLogToConsole: true }))
  //         .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  //         .pipe(rename(function (path) {
  //           path.dirname += "/../css";
  //         }))
  //         .pipe(gulp.dest('render'))
  //       // .on('end', resolve)
  //     })
  //   ])
  //     .then(function () {
  //       console.log(`sass terminé run premailer sinon
  // pas de rendu HTML !!!`)
  //       // gulp.start('premailer');
  //     })

}

exports.sass = sass

// attention sass et dépendant de slim du fait de l'injection des styles en ligne de premailer et ce dans chaque country/index.html. Pour cette raison le watch de scss/**/*.scss est inclut au watch de slim.