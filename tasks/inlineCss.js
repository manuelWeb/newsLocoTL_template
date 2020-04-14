const { src, dest } = require('gulp')
const cssToInline = require('gulp-inline-css');
const foreach = require("gulp-foreach");
const browserSync = require('browser-sync').create()

function inlineCss(firstarg, cb) {

  const promise1 = new Promise(function (resolve, reject) {
    src('render/**/*.html')
      .pipe(cssToInline({}))
      .pipe(dest('render'))
      .on('end', resolve)

  })

  promise1.then(function () {
    console.log(firstarg);
    cb();
  });
}

exports.inlineCss = inlineCss


  // promise = start prettify
  // gulp.task('premailer', function () {
  //   return Promise.all([
  //     new Promise(function (resolve, reject) {
  //       gulp.src('render/**/*.html')
  //         .pipe(premailer({}))
  //         .pipe(gulp.dest('render'))
  //         .on('end', resolve)
  //     })
  //   ]).then(function () {
  //     console.log('premailer terminé run prettify + bs')
  //     // gulp.start('prettify');
  //   })
  // });