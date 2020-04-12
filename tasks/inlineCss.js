const { src, dest } = require('gulp')
const cssToInline = require('gulp-inline-css');

function inlineCss(cb) {
  const promise1 = new Promise(function (resolve, reject) {
    src('render/**/*.html')
      .pipe(cssToInline({}))
      .pipe(dest('render'))

    setTimeout(function () {
      resolve('i\'m before cssToInline promise cb');
    }, 0);

  })
  promise1.then(function (value) {
    console.log(value);
    // expected output: "i\'m before cssToInline promise cb"
    cb(console.log('it\'s ok for cssToInline'));
  });
}

exports.inlineCss = inlineCss

// const promise1 = new Promise(function (resolve, reject) {
//   console.log('start inilined');

//   src('render/**/*.html')
//     .pipe(inlineCss({}))
//     .pipe(dest('render'))

//   setTimeout(function () {
//     resolve('i\'m before inlineCss promise cb');
//   }, 0);

// })
// promise1.then(function (value) {
//   console.log(value);
//   cb(console.log('it\'s ok for inlineCss'));
// })

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