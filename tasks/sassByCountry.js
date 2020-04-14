var { src, dest } = require("gulp");
var gulpSass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

function sassByCountry(stream, cb) {
  let country = stream.substring(4, 6)
  new Promise(function (resolve, reject) {
    // src('src/**/scss/*.scss')
    src(`src/${country}/scss/*.scss`)
      .pipe(gulpSass({ errLogToConsole: true }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename(function (path) {
        path.dirname += '/';
      }))
      .pipe(dest(`render/${country}/css/`))
      .on('end', resolve)
  }).then(function () {
    console.log(`sassByCount stream:${stream}`);
    cb();
  });
}
exports.sassByCountry = sassByCountry

// attention sass et dépendant de slim du fait de l'injection des styles en ligne de premailer et ce dans chaque country/index.html. Pour cette raison le watch de scss/**/*.scss est inclut au watch de slim.