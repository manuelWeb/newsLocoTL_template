var gulp      = require("gulp");
var premailer = require('gulp-premailer'),
    replace   = require('gulp-replace');

module.exports = function () {
  // promise = start prettify
  gulp.task('premailer', function () {
    return Promise.all([
      new Promise(function (resolve, reject) {
        gulp.src('render/**/*.html')
        .pipe(premailer({
            // escape_url_attributes: false,
            // replace_html_entities: false
        }))
        .pipe(replace(/&amp;/g, '&'))
        .pipe(replace(/~/g, '&nbsp;'))
        .pipe(gulp.dest('render'))
        // .pipe(bs.stream())
        .on('end', resolve)
      })
    ]).then(function () {
      console.log('premailer terminé run prettify + bs')
      gulp.start('prettify');
    })
  });

}
