function loadImages(images, callback) {
  var result = {};

  images.forEach(function(src) {
    var image = new Image();
    image.src = src;

    image.onload = function() {
      result[src] = image;

      if (Object.keys(result).length === images.length) {
        callback(result);
      }
    }
  });
}

module.exports = loadImages;