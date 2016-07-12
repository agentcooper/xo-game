var cache = {};

function loadImages(images, callback) {
  var result = {};

  function isDone() {
    return Object.keys(result).length === images.length;
  }

  images.forEach(function(src) {

    if (cache[src]) {
      result[src] = cache[src];

      if (isDone()) {
        callback(result);
      }

    } else {
      var image = new Image();
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