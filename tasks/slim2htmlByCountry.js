const { src, dest } = require("gulp");
const slim = require("gulp-slim");
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');

function slim2htmlByCountry(arg) {
  console.log(`slim2htmlByCountry arg -> ${arg}`)
  let renderDir = arg.substring(4, 6)

  return src(arg)
    .pipe(plumber())
    .pipe(slim({
      options: "encoding='utf-8'"
    }))
    .pipe(rename(function (path) {
      // replace path with rename mandatory to go render/{country}
      console.log(`path.dirname:${path.dirname}, renderDir:${renderDir}`);
      // path.dirname += "/render/BV";
      path.dirname += `/render/${renderDir}`;
    }))
    // render is dyn by rename above
    .pipe(dest(`./`))
}
exports.slim2htmlByCountry = slim2htmlByCountry