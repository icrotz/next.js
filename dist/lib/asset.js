'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = asset;
exports.setAssetPrefix = setAssetPrefix;
var assetPrefix = void 0;

function asset(path) {
  var pathWithoutSlash = path.replace(/^\//, '');
  return assetPrefix + '/static/' + pathWithoutSlash;
}

function setAssetPrefix(url) {
  assetPrefix = url;
}