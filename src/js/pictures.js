'use strict';

// Прячет блок с фильтрами .filters, добавляя ему класс hidden
var filters = document.querySelector('.filters');
filters.classList.add('.hidden');

var PICTURES_LOAD_URL = '/api/pictures';
var container = document.querySelector('.pictures'); //контейнер для фото

var getTemplateElement = require('./picture.js');
var load = require('./load.js');
var gallery = require('./gallery.js');

/**
 * Отрисовывает фотографии: перебирает массив фотографий в цикле и создает для каждой DOM-элемент.
 * @param {array} arr - массив с картинками
 */
function renderPictures(arr) {

  arr.forEach(function(picture, num) {
    container.appendChild(getTemplateElement(picture, num));
  });

  gallery.setPictures(arr);
}

load(PICTURES_LOAD_URL, renderPictures);

// Отображает блок с фильтрами.
filters.classList.remove('.hidden');




