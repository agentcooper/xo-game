function scaleImageSizes(images, cellSize) {
  const margin = 5;

  return images.map(function(image) {
    const { width, height } = image;
    const widthToHeight = width / height;

    return width >= height ?
      {
        original: image,
        width: cellSize - margin * 2,
        height: (cellSize - margin * 2) * widthToHeight
      }
      :
      {
        original: image,
        width: (cellSize - margin * 2) * widthToHeight,
        height: cellSize - margin * 2
      };
  });
}

module.exports = scaleImageSizes;