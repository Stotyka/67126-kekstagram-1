'use strict';

/**
 * Выполняет JSONP-запросы
 * @param {string} url - адрес JSONP-запроса
 * @param {function} callback - функция, которая должна вызываться после выполнения JSONP скрипта
 */
var load = function(url, callback) {

  var callbackName = 'cb' + Date.now();

  window[callbackName] = function(data) {
    callback(data);
    document.body.removeChild(script);
    delete window[callbackName];
  };

  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};

module.exports = load;
