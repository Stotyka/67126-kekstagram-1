/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var Cookies = require('js-cookie');

var Resizer = require('./resizer.js');

/** @enum {string} */
var FileType = {
  'GIF': '',
  'JPEG': '',
  'PNG': '',
  'SVG+XML': ''
};

/** @enum {number} */
var Action = {
  ERROR: 0,
  UPLOADING: 1,
  CUSTOM: 2
};

/**
 * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
 * из ключей FileType.
 * @type {RegExp}
 */
var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

/**
 * @type {Object.<string, string>}
 */
var filterMap;

/**
 * Объект, который занимается кадрированием изображения.
 * @type {Resizer}
 */
var currentResizer;

/**
 * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
 * изображением.
 */
var cleanupResizer = function() {
  if (currentResizer) {
    currentResizer.remove();
    currentResizer = null;
  }
};

/**
 * Ставит одну из трех случайных картинок на фон формы загрузки.
 */
var updateBackground = function() {
  var images = [
    'img/logo-background-1.jpg',
    'img/logo-background-2.jpg',
    'img/logo-background-3.jpg'
  ];

  var backgroundElement = document.querySelector('.upload');
  var randomImageNumber = Math.round(Math.random() * (images.length - 1));
  backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
};

/**
 * Форма загрузки изображения.
 * @type {HTMLFormElement}
 */
var uploadForm = document.forms['upload-select-image'];

/**
 * Форма кадрирования изображения.
 * @type {HTMLFormElement}
 */
var resizeForm = document.forms['upload-resize'];

/**
 * Форма добавления фильтра.
 * @type {HTMLFormElement}
 */
var filterForm = document.forms['upload-filter'];

/**
 * @type {HTMLImageElement}
 */
var filterImage = filterForm.querySelector('.filter-image-preview');

/**
 * @type {HTMLElement}
 */
var uploadMessage = document.querySelector('.upload-message');

var x = resizeForm.elements['x'];
var y = resizeForm.elements['y'];
var size = resizeForm.elements['size'];
var fwd = resizeForm.elements['fwd'];

/**
 * Проверяет, валидны ли данные, в форме кадрирования.
 * @return {boolean}
 */
function resizeFormIsValid() {
  var imageSizeWidth = currentResizer._image.naturalWidth;
  var imageSizeHeight = currentResizer._image.naturalHeight;
  var newX = Number(x.value);
  var newY = Number(y.value);
  var newSize = Number(size.value);

  return !(newX < 0 ||
      newY < 0 ||
      newSize < 0 ||
      newX + newSize >= imageSizeWidth ||
      newY + newSize >= imageSizeHeight ||
      isNaN(newY) ||
      isNaN(newSize) ||
      isNaN(newX));
}

function changeDisable() {
  fwd.disabled = !resizeFormIsValid();
}

x.oninput = changeDisable;
y.oninput = changeDisable;
size.oninput = changeDisable;

/**
 * @param {Action} action
 * @param {string=} message
 * @return {Element}
 */
var showMessage = function(action, message) {
  var isError = false;

  switch (action) {
    case Action.UPLOADING:
      message = message || 'Кексограмим&hellip;';
      break;

    case Action.ERROR:
      isError = true;
      message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
      break;
  }

  uploadMessage.querySelector('.upload-message-container').innerHTML = message;
  uploadMessage.classList.remove('invisible');
  uploadMessage.classList.toggle('upload-message-error', isError);
  return uploadMessage;
};

var hideMessage = function() {
  uploadMessage.classList.add('invisible');
};

/**
 * Обработчик изменения изображения в форме загрузки. Если загруженный
 * файл является изображением, считывается исходник картинки, создается
 * Resizer с загруженной картинкой, добавляется в форму кадрирования
 * и показывается форма кадрирования.
 * @param {Event} evt
 */
uploadForm.onchange = function(evt) {
  var element = evt.target;
  if (element.id === 'upload-file') {
    // Проверка типа загружаемого файла, тип должен быть изображением
    // одного из форматов: JPEG, PNG, GIF или SVG.
    if (fileRegExp.test(element.files[0].type)) {
      var fileReader = new FileReader();

      showMessage(Action.UPLOADING);

      fileReader.onload = function() {
        cleanupResizer();

        currentResizer = new Resizer(fileReader.result);
        currentResizer.setElement(resizeForm);
        uploadMessage.classList.add('invisible');

        uploadForm.classList.add('invisible');
        resizeForm.classList.remove('invisible');

        hideMessage();
      };

      fileReader.readAsDataURL(element.files[0]);
    } else {
      // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
      showMessage(Action.ERROR);
    }
  }
};

/**
 * Обработка сброса формы кадрирования. Возвращает в начальное состояние
 * и обновляет фон.
 * @param {Event} evt
 */
resizeForm.onreset = function(evt) {
  evt.preventDefault();

  cleanupResizer();
  updateBackground();

  resizeForm.classList.add('invisible');
  uploadForm.classList.remove('invisible');
};

/**
 * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
 * кропнутое изображение в форму добавления фильтра и показывает ее.
 * @param {Event} evt
 */
resizeForm.onsubmit = function(evt) {
  evt.preventDefault();

  if (resizeFormIsValid()) {
    var image = currentResizer.exportImage().src;

    var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
    for (var i = 0; i < thumbnails.length; i++) {
      thumbnails[i].style.backgroundImage = 'url(' + image + ')';
    }

    filterImage.src = image;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');

    var filterFromCookie = Cookies.get('upload-filter') || 'none';
    document.getElementById('upload-filter-' + filterFromCookie).click();
  }
};

/**
 * Сброс формы фильтра. Показывает форму кадрирования.
 * @param {Event} evt
 */
filterForm.onreset = function(evt) {
  evt.preventDefault();

  filterForm.classList.add('invisible');
  resizeForm.classList.remove('invisible');
};

function expireDate() {
  var ONE_DAY = 1000 * 60 * 60 * 24;
  var now = new Date();
  var currentYear = now.getFullYear();
  var grace = new Date(currentYear, 11, 9);

  if (now < grace) {
    grace.setFullYear(currentYear - 1);
  }

  return (now - grace) / ONE_DAY;
}

/**
 * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
 * записав сохраненный фильтр в cookie.
 * @param {Event} evt
 */
filterForm.onsubmit = function(evt) {
  evt.preventDefault();

  cleanupResizer();
  updateBackground();

  filterForm.classList.add('invisible');
  uploadForm.classList.remove('invisible');
};

/**
 * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
 * выбранному значению в форме.
 */
filterForm.onchange = function() {
  if (!filterMap) {
    // Ленивая инициализация. Объект не создается до тех пор, пока
    // не понадобится прочитать его в первый раз, а после этого запоминается
    // навсегда.
    filterMap = {
      'none': 'filter-none',
      'chrome': 'filter-chrome',
      'sepia': 'filter-sepia',
      'marvin': 'filter-marvin'
    };
  }

  var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
    return item.checked;
  })[0].value;

  // Класс перезаписывается, а не обновляется через classList потому что нужно
  // убрать предыдущий примененный класс. Для этого нужно или запоминать его
  // состояние или просто перезаписывать.
  filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];

  // Записывает в куки выбранный фильтр
  Cookies.set('upload-filter', selectedFilter, {expires: expireDate()});
};

cleanupResizer();
updateBackground();
