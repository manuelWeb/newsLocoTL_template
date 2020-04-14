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
// const renderDir = path.join(__dirname, 'render')

const fs = require('fs');
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

// const html = getFiles('render').filter(i => i.match(/\.html$/g))
// const css = getFiles('render').filter(i => i.match(/\.css$/g))
// const htmlBV = fs.readFileSync(html[1], 'utf8')
// const htmlBVBody = htmlBV.match(/<body.+?>/)[0]

const { gulp, series, parallel, src, dest, watch } = require('gulp');
const rimraf = require('rimraf')
const { exec } = require('child_process');
const browserSync = require('browser-sync').create()
// const slim = require("gulp-slim");
const { slim2html } = require('./tasks/slim')
const { slim2htmlByCountry } = require('./tasks/slim2htmlByCountry')
// const { sass } = require('./tasks/sass')
const { sass } = require('./tasks/sass')
const { sassByCountry } = require('./tasks/sassByCountry')
const { inlineCss } = require('./tasks/inlineCss')

exports.sass = sass
exports.sassByCountry = sassByCountry
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

function rm(done) {
  exec('rm -r render', (err) => {
    if (err) {
      console.error(`${err}`);
      return;
    }
  })
  done()
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
async function print(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    console.log(`async fs.promise dirs: ./render/${dirent.name}/index.html`);
  }
}
const cssWatch = () => {
  watch(['src/**/slim/*.slim']).on('change',
    (stream) => {
      // sl2htmlByCoun(dir:fileToCompile, callback)
      let html, css = []

      slim2htmlByCountry(
        stream,
        () => {
          html = getFiles('render').filter(i => i.match(/\.html$/g))
          console.clear()
          console.log(html);
          sassByCountry(stream, () => {
            css = getFiles('render').filter(i => i.match(/\.css$/g))
            console.log(css)
            inlineCss('inlineCss cb: ', () => {
              console.log(
                // fs.readFileSync(html[0], 'utf8').match(/<body.+?>/)[0]
                html.map(
                  (i) => fs.readFileSync(i, 'utf8').match(/<body.+?>/)[0]
                )
              )
            })
          })
        }
      );

      // print('./render').catch(e => e).then(console.log('fichier pas prét'))
      // const html = getFiles('render').filter(i => i.match(/\.html$/g))
      // const css = getFiles('render').filter(i => i.match(/\.css$/g))
      // const htmlBV = fs.readFileSync(html[1], 'utf8')
      // const htmlBVBody = htmlBV.match(/<body.+?>/)[0]

      // console.log('\x1b[36m%s\x1b[0m', fs.readFileSync(html[1], 'utf8'));
      // console.log(htmlBVBody, css);

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
