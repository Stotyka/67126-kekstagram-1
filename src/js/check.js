function getMessage (a, b) {
  if (typeof a == 'boolean') {
    if ( a ) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    }
    return 'Переданное GIF-изображение не анимировано';
  }

  if (typeof a == 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов';
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      var artifactsSquare = a.reduce(function(previousValue, currentValue, index) {
        return previousValue + currentValue * b[index];
      }, 0);
      return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
    }

    var amountOfRedPoints = a.reduce(function(previousValue, currentValue) {
      return previousValue + currentValue;
    });
    return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;

  }
  return 'Переданы некорректные данные';
}

