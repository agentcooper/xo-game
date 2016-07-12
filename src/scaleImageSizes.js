function scaleImageSizes(images, cellSize) {
  var margin = 5;

  var imageSizes = Object.keys(images).reduce(function(result, imageName) {
    var w = images[imageName].width;
    var h = images[imageName].height;
    var widthToHeight = w / h;

    result[imageName] =
      w >= h ?
        {
          width: cellSize - margin * 2,
          height: (cellSize - margin * 2) * widthToHeight
        }
        :
        {
          width: (cellSize - margin * 2) * widthToHeight,
          height: cellSize - margin * 2
        }

    return result;
  }, {});

  return imageSizes;
}

module.exports = scaleImageSizes;