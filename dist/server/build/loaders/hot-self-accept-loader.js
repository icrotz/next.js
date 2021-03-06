'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (content, sourceMap) {
  this.cacheable();

  var route = getRoute(this);

  // Webpack has a built in system to prevent default from colliding, giving it a random letter per export.
  // We can safely check if Component is undefined since all other pages imported into the entrypoint don't have __webpack_exports__.default
  this.callback(null, content + '\n    (function (Component, route) {\n      if(!Component) return\n      if (!module.hot) return\n      module.hot.accept()\n      Component.__route = route\n\n      if (module.hot.status() === \'idle\') return\n\n      var components = next.router.components\n      for (var r in components) {\n        if (!components.hasOwnProperty(r)) continue\n\n        if (components[r].Component.__route === route) {\n          next.router.update(r, Component)\n        }\n      }\n    })(typeof __webpack_exports__ !== \'undefined\' ? __webpack_exports__.default : (module.exports.default || module.exports), ' + (0, _stringify2.default)(route) + ')\n  ', sourceMap);
};

var nextPagesDir = (0, _path.resolve)(__dirname, '..', '..', '..', 'pages');

function getRoute(loaderContext) {
  var pagesDir = (0, _path.resolve)(loaderContext.options.context, 'pages');
  var resourcePath = loaderContext.resourcePath;

  var dir = [pagesDir, nextPagesDir].find(function (d) {
    return resourcePath.indexOf(d) === 0;
  });
  var path = (0, _path.relative)(dir, resourcePath);
  return '/' + path.replace(/((^|\/)index)?\.js$/, '');
}