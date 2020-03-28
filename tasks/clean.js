function clean() {
  rimraf('./render', function cb() {
    console.log('render is destroyed : clean is over.\nlet\'s work on clean folder!');
  })
}

export { clean }