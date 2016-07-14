const promiseCache = {};

const loadImage = (src) =>
  new Promise((r, j) => {
    const image = new Image();
    image.src = src;

    image.onload = () => r(image);
  });

function loadImages(images) {
  const promises = images.map(src => {
    promiseCache[src] = promiseCache[src] || loadImage(src);

    return promiseCache[src];
  });

  return Promise.all(promises);
}

module.exports = loadImages;