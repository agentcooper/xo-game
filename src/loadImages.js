const cache = {};

function loadImages(images, callback) {
  const result = {};

  function isDone() {
    return Object.keys(result).length === images.length;
  }

  images.forEach(src => {

    if (cache[src]) {
      result[src] = cache[src];

      if (isDone()) {
        callback(result);
      }

    } else {
      const image = new Image();
      image.src = src;

      image.onload = function() {
        result[src] = image;
        cache[src] = image;

        if (isDone()) {
          callback(result);
        }
      }
    }
  });
}

module.exports = loadImages;