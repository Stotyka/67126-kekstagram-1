'use strict';

//Показывает фотографии в полноэкранном режиме при нажатии на фотографию из списка
function Gallery() {

  //Свойства объекта
  this.pictures = []; //Массив объектов – фотографии, которые нужно показать
  this.activePicture = 0; //номер текущей фотографии в галерее
}

//Ссылки на DOM-элементы:

// элемент фотогалереи с классом gallery-overlay
var galleryOverlay = document.querySelector('.gallery-overlay');

// элемент закрытия галереи с классом gallery-overlay-close
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

// фотография с классом gallery-overlay-image
var galleryOverlayImage = document.querySelector('.gallery-overlay-image');

/**
 * Принимает на вход массив объектов фотографий и записывает их в свойство pictures
 * @param {object} pictures - массив объектов фотографий
 */
Gallery.prototype.setPictures = function(pictures) {
  this.pictures = pictures;
};

/**
 * Показывает фотогалерею. Добавляет обработчики событий DOM-элементам галереи.
 * @param {number} num - порядковый номер картинки в массиве
 */
Gallery.prototype.show = function(num) {
  var self = this;

  // Обработчик события click по элементу gallery-overlay-close, который вызывает метод hide
  galleryOverlayClose.onclick = function() {
    self.hide();
  };

  // Обработчик события click по элементу фотографии, который показывает следующую фотографию из массива pictures,
  // вызывая метод setActivePicture.
  galleryOverlayImage.onclick = function() {

    // Если показана последняя фотография, при клике происходит зацикливание галереи — показвыается первая фотография
    if(self.activePicture + 1 === self.pictures.length) {
      self.setActivePicture(0);
    } else {
      self.setActivePicture(self.activePicture + 1);
    }
  };

  // Показывает фотогалерею, убирая у ее DOM-элемента класс invisible.
  galleryOverlay.classList.remove('invisible');

  // Вызывает метод setActivePicture, передав в него параметром число,
  // которое было передано параметром в show
  this.setActivePicture(num);
};

// убирает фотогалерею
Gallery.prototype.hide = function() {

  // Добавлет DOM-элементу фотогалереи класс invisible
  galleryOverlay.classList.add('invisible');

  // Удаляет обработчики событий, записывая в них значение null
  galleryOverlayClose.onclick = null;
  galleryOverlayImage.onclick = null;
};

Gallery.prototype.setActivePicture = function(num) {

  // принимает на вход число и записывает его в свойство activePicture
  this.activePicture = num;

  // После этого находит в массиве pictures фотографию с нужным индексом
  // и записывает ее адрес в свойство src, DOM-элемента фотографии.
  galleryOverlayImage.src = this.pictures[num].preview || this.pictures[num].url;

  // Записывает в DOM-элементы likes-count и comments-count количество лайков и комментариев для показанной фотографии
  galleryOverlay.querySelector('.likes-count').textContent = this.pictures[num].likes;
  galleryOverlay.querySelector('.comments-count').textContent = this.pictures[num].comments;
};

//экспорт модуля
module.exports = new Gallery();
