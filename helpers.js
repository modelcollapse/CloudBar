function randomColorHSB() {
  return color(random(360), 80, 100);
}

function preloadImages(filenames) {
  return filenames.map(name => loadImage(`images/${name}`));
}