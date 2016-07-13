function scaleImageSizes(images, cellSize) {
  const margin = 5;

  const imageSizes = Object.keys(images).reduce(function(result, imageName) {
    const w = images[imageName].width;
    const h = images[imageName].height;
    const widthToHeight = w / h;

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