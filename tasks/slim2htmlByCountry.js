const { src, dest } = require("gulp");
const slim = require("gulp-slim");
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');

function slim2htmlByCountry(arg, cb) {
  console.log(`slim2htmlByCountry arg -> ${arg}`)
  let renderDir = arg.substring(4, 6)
  const promise1 = new Promise(function (resolve, reject) {
    return src(arg)
      .pipe(plumber())
      .pipe(slim({
        pretty: true,
        options: "encoding='utf-8'"
      }))
      .pipe(rename(function (path) {
        // replace path with rename mandatory to go render/{country} //path.dirname:${path.dirname},
        console.log(`slim2htmlByCountry renderDir:${renderDir}`);
        // path.dirname += "/render/BV";
        path.dirname += `/render/${renderDir}`;
      }))
      // render is dyn by rename above
      .pipe(dest(`./`))
      .on('end', resolve)
  }).then(function () {
    cb()
  })
}

exports.slim2htmlByCountry = slim2htmlByCountry