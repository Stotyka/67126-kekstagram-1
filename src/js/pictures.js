'use strict';

(function() {

  // Прячет блок с фильтрами .filters, добавляя ему класс hidden
  var filters = document.querySelector('.filters');
  filters.classList.add('.hidden');

  var PICTURES_LOAD_URL = '/api/pictures';

  /**
   * Выполняет JSONP-запросы
   * @param {string} url - адрес JSONP-запроса
   * @param {function} callback - функция, которая должна вызываться после выполнения JSONP скрипта
   */
  function load(url, callback) {

    var callbackName = 'cb' + Date.now();

    window[callbackName] = function(data) {
      callback(data);
      document.body.removeChild(script);
      delete window[callbackName];
    };

    var script = document.createElement('script');
    script.src = url + '?callback=' + callbackName;
    document.body.appendChild(script);
  }

  // Создаёт для каждой записи массива pictures блок фотографии на основе шаблона #picture-template.
  var container = document.querySelector('.pictures'); //контейнер для фото
  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;

  /**
   * Выводит созданные элементы на страницу внутрь блока .pictures
   * @param {object} picture - объект со свойствами фото
   * @return {HTMLElement} templateElement
   */
  function getTemplateElement(picture) {

    var templateElement = templateContainer.querySelector('.picture').cloneNode(true);
    templateElement.querySelector('.picture-likes').textContent = picture.likes;
    templateElement.querySelector('.picture-comments').textContent = picture.comments;

    var backgroundImage = new Image();
    backgroundImage.src = picture.preview || picture.url;

    var image = templateElement.querySelector('img');

    /**
     * Обработчик загрузки:
     * после загрузки изображения указывает тегу <img /> в шаблоне src загруженного изображения
     * и задает ему размеры 182×182
     */
    backgroundImage.onload = function() {
      image.src = backgroundImage.src;
      image.style.width = '182px';
      image.style.height = '182px';
    };

    /**
     * Обработчик ошибки: добавляет блоку фотографии .picture класс picture-load-failure.
     */
    backgroundImage.onerror = function() {
      templateElement.classList.add('picture-load-failure');
    };

    return templateElement;
  }

  //Отрисовывает фотографии: перебирает массив фотографий в цикле и создает для каждой DOM-элемент.
  function renderPictures(arr) {
    arr.forEach(function(picture) {
      container.appendChild(getTemplateElement(picture));
    });
  }

  load(PICTURES_LOAD_URL, renderPictures);

  // Отображает блок с фильтрами.
  filters.classList.remove('.hidden');

})();
