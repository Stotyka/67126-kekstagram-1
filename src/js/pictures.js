'use strict';

// Прячет блок с фильтрами .filters, добавляя ему класс hidden
var filters = document.querySelector('.filters');
filters.classList.add('.hidden');

var PICTURES_LOAD_URL = '/api/pictures';

var load = require('./load.js');

var container = document.querySelector('.pictures'); //контейнер для фото

var getTemplateElement = require('./picture.js');

//Отрисовывает фотографии: перебирает массив фотографий в цикле и создает для каждой DOM-элемент.
function renderPictures(arr) {
  arr.forEach(function(picture) {
    container.appendChild(getTemplateElement(picture));
  });
}

load(PICTURES_LOAD_URL, renderPictures);

// Отображает блок с фильтрами.
filters.classList.remove('.hidden');


