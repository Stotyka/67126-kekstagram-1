'use strict';

// Создаёт для каждой записи массива pictures блок фотографии на основе шаблона #picture-template.
// var container = document.querySelector('.pictures'); //контейнер для фото
var template = document.querySelector('#picture-template');
var templateContainer = 'content' in template ? template.content : template;
var gallery = require('./gallery.js');

/**
 * Выводит созданные элементы на страницу внутрь блока .pictures
 * @param {number} num - порядковый номер картинки в массиве
 * @param {object} picture - объект со свойствами фото
 * @return {HTMLElement} templateElement
 */
var getTemplateElement = function(picture, num) {

  var templateElement = templateContainer.querySelector('.picture').cloneNode(true);
  templateElement.querySelector('.picture-likes').textContent = picture.likes;
  templateElement.querySelector('.picture-comments').textContent = picture.comments;

  var backgroundImage = new Image();
  backgroundImage.src = picture.preview || picture.url;

  var image = templateElement.querySelector('img');

  //Обработчик загрузки: после загрузки изображения указывает тегу <img /> в шаблоне src загруженного изображения
  //и задает ему размеры 182×182
  backgroundImage.onload = function() {
    image.src = backgroundImage.src;
    image.style.width = '182px';
    image.style.height = '182px';
  };

  //Обработчик клика по картинке
  templateElement.onclick = function(event) {
    event.preventDefault();
    gallery.show(num);
  };

  //Обработчик ошибки: добавляет блоку фотографии .picture класс picture-load-failure.
  backgroundImage.onerror = function() {
    templateElement.classList.add('picture-load-failure');
  };

  return templateElement;
};

module.exports = getTemplateElement;
