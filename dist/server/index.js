'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _url = require('url');

var _querystring = require('querystring');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fs3 = require('mz/fs');

var _fs4 = _interopRequireDefault(_fs3);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _render = require('./render');

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _utils = require('./utils');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _package = require('../../package');

var _package2 = _interopRequireDefault(_package);

var _asset = require('../lib/asset');

var asset = _interopRequireWildcard(_asset);

var _utils2 = require('../lib/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('@zeit/source-map-support').install();
// We need to go up one more level since we are in the `dist` directory


var blockedPages = {
  '/_document': true,
  '/_error': true
};

var Server = function () {
  function Server() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$dir = _ref.dir,
        dir = _ref$dir === undefined ? '.' : _ref$dir,
        _ref$dev = _ref.dev,
        dev = _ref$dev === undefined ? false : _ref$dev,
        _ref$staticMarkup = _ref.staticMarkup,
        staticMarkup = _ref$staticMarkup === undefined ? false : _ref$staticMarkup,
        _ref$quiet = _ref.quiet,
        quiet = _ref$quiet === undefined ? false : _ref$quiet,
        _ref$conf = _ref.conf,
        conf = _ref$conf === undefined ? null : _ref$conf;

    (0, _classCallCheck3.default)(this, Server);

    this.dir = (0, _path.resolve)(dir);
    this.dev = dev;
    this.quiet = quiet;
    this.router = new _router2.default();
    this.hotReloader = dev ? this.getHotReloader(this.dir, { quiet: quiet, conf: conf }) : null;
    this.http = null;
    this.config = (0, _config2.default)(this.dir, conf);
    this.dist = this.config.distDir;
    if (!dev && !_fs2.default.existsSync((0, _path.resolve)(dir, this.dist, 'BUILD_ID'))) {
      console.error('> Could not find a valid build in the \'' + this.dist + '\' directory! Try building your app with \'next build\' before starting the server.');
      process.exit(1);
    }
    this.buildStats = !dev ? require((0, _path.join)(this.dir, this.dist, 'build-stats.json')) : null;
    this.buildId = !dev ? this.readBuildId() : '-';
    this.renderOpts = {
      dev: dev,
      staticMarkup: staticMarkup,
      dir: this.dir,
      hotReloader: this.hotReloader,
      buildStats: this.buildStats,
      buildId: this.buildId,
      assetPrefix: this.config.assetPrefix.replace(/\/$/, ''),
      availableChunks: dev ? {} : (0, _utils.getAvailableChunks)(this.dir, this.dist)

      // With this, static assets will work across zones
    };asset.setAssetPrefix(this.config.assetPrefix);

    this.defineRoutes();
  }

  (0, _createClass3.default)(Server, [{
    key: 'getHotReloader',
    value: function getHotReloader(dir, options) {
      var HotReloader = require('./hot-reloader').default;
      return new HotReloader(dir, options);
    }
  }, {
    key: 'handleRequest',
    value: function handleRequest(req, res, parsedUrl) {
      var _this = this;

      // Parse url if parsedUrl not provided
      if (!parsedUrl || (typeof parsedUrl === 'undefined' ? 'undefined' : (0, _typeof3.default)(parsedUrl)) !== 'object') {
        parsedUrl = (0, _url.parse)(req.url, true);
      }

      // Parse the querystring ourselves if the user doesn't handle querystring parsing
      if (typeof parsedUrl.query === 'string') {
        parsedUrl.query = (0, _querystring.parse)(parsedUrl.query);
      }

      res.statusCode = 200;
      return this.run(req, res, parsedUrl).catch(function (err) {
        if (!_this.quiet) console.error(err);
        res.statusCode = 500;
        res.end(_http.STATUS_CODES[500]);
      });
    }
  }, {
    key: 'getRequestHandler',
    value: function getRequestHandler() {
      return this.handleRequest.bind(this);
    }
  }, {
    key: 'prepare',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.hotReloader) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return this.hotReloader.start();

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function prepare() {
        return _ref2.apply(this, arguments);
      }

      return prepare;
    }()
  }, {
    key: 'close',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.hotReloader) {
                  _context2.next = 3;
                  break;
                }

                _context2.next = 3;
                return this.hotReloader.stop();

              case 3:
                if (!this.http) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return new _promise2.default(function (resolve, reject) {
                  _this2.http.close(function (err) {
                    if (err) return reject(err);
                    return resolve();
                  });
                });

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function close() {
        return _ref3.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: 'defineRoutes',
    value: function defineRoutes() {
      var _this3 = this;

      var routes = {
        '/_next-prefetcher.js': function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    p = (0, _path.join)(__dirname, '../client/next-prefetcher-bundle.js');
                    _context3.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this3);
          }));

          function _nextPrefetcherJs(_x2, _x3, _x4) {
            return _ref4.apply(this, arguments);
          }

          return _nextPrefetcherJs;
        }(),

        // This is to support, webpack dynamic imports in production.
        '/_next/webpack/chunks/:name': function () {
          var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    // Cache aggressively in production
                    if (!_this3.dev) {
                      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
                    }
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'chunks', params.name);
                    _context4.next = 4;
                    return _this3.serveStatic(req, res, p);

                  case 4:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this3);
          }));

          function _nextWebpackChunksName(_x5, _x6, _x7) {
            return _ref5.apply(this, arguments);
          }

          return _nextWebpackChunksName;
        }(),

        // This is to support, webpack dynamic import support with HMR
        '/_next/webpack/:id': function () {
          var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'chunks', params.id);
                    _context5.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, _this3);
          }));

          function _nextWebpackId(_x8, _x9, _x10) {
            return _ref6.apply(this, arguments);
          }

          return _nextWebpackId;
        }(),

        '/_next/:hash/manifest.js': function () {
          var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (_this3.dev) {
                      _context6.next = 2;
                      break;
                    }

                    return _context6.abrupt('return', _this3.send404(res));

                  case 2:

                    _this3.handleBuildHash('manifest.js', params.hash, res);
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'manifest.js');
                    _context6.next = 6;
                    return _this3.serveStatic(req, res, p);

                  case 6:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this3);
          }));

          function _nextHashManifestJs(_x11, _x12, _x13) {
            return _ref7.apply(this, arguments);
          }

          return _nextHashManifestJs;
        }(),

        '/_next/:hash/main.js': function () {
          var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    if (_this3.dev) {
                      _context7.next = 2;
                      break;
                    }

                    return _context7.abrupt('return', _this3.send404(res));

                  case 2:

                    _this3.handleBuildHash('main.js', params.hash, res);
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'main.js');
                    _context7.next = 6;
                    return _this3.serveStatic(req, res, p);

                  case 6:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this3);
          }));

          function _nextHashMainJs(_x14, _x15, _x16) {
            return _ref8.apply(this, arguments);
          }

          return _nextHashMainJs;
        }(),

        '/_next/:hash/commons.js': function () {
          var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (_this3.dev) {
                      _context8.next = 2;
                      break;
                    }

                    return _context8.abrupt('return', _this3.send404(res));

                  case 2:

                    _this3.handleBuildHash('commons.js', params.hash, res);
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'commons.js');
                    _context8.next = 6;
                    return _this3.serveStatic(req, res, p);

                  case 6:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this3);
          }));

          function _nextHashCommonsJs(_x17, _x18, _x19) {
            return _ref9.apply(this, arguments);
          }

          return _nextHashCommonsJs;
        }(),

        '/_next/:hash/app.js': function () {
          var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    if (!_this3.dev) {
                      _context9.next = 2;
                      break;
                    }

                    return _context9.abrupt('return', _this3.send404(res));

                  case 2:

                    _this3.handleBuildHash('app.js', params.hash, res);
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'app.js');
                    _context9.next = 6;
                    return _this3.serveStatic(req, res, p);

                  case 6:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this3);
          }));

          function _nextHashAppJs(_x20, _x21, _x22) {
            return _ref10.apply(this, arguments);
          }

          return _nextHashAppJs;
        }(),

        '/_next/:buildId/page/:path*.js.map': function () {
          var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(req, res, params) {
            var paths, page, dist, path;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    paths = params.path || [''];
                    page = '/' + paths.join('/');

                    if (!_this3.dev) {
                      _context10.next = 12;
                      break;
                    }

                    _context10.prev = 3;
                    _context10.next = 6;
                    return _this3.hotReloader.ensurePage(page);

                  case 6:
                    _context10.next = 12;
                    break;

                  case 8:
                    _context10.prev = 8;
                    _context10.t0 = _context10['catch'](3);
                    _context10.next = 12;
                    return _this3.render404(req, res);

                  case 12:
                    dist = (0, _config2.default)(_this3.dir).distDir;
                    path = (0, _path.join)(_this3.dir, dist, 'bundles', 'pages', page + '.js.map');
                    _context10.next = 16;
                    return (0, _render.serveStatic)(req, res, path);

                  case 16:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, _this3, [[3, 8]]);
          }));

          function _nextBuildIdPagePathJsMap(_x23, _x24, _x25) {
            return _ref11.apply(this, arguments);
          }

          return _nextBuildIdPagePathJsMap;
        }(),

        // This is very similar to the following route.
        // But for this one, the page already built when the Next.js process starts.
        // There's no need to build it in on-demand manner and check for other things.
        // So, it's clean to have a seperate route for this.
        '/_next/:buildId/page/_error.js': function () {
          var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(req, res, params) {
            var error, customFields, p;
            return _regenerator2.default.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    if (_this3.handleBuildId(params.buildId, res)) {
                      _context11.next = 6;
                      break;
                    }

                    error = new Error('INVALID_BUILD_ID');
                    customFields = { buildIdMismatched: true };
                    _context11.next = 5;
                    return (0, _render.renderScriptError)(req, res, '/_error', error, customFields, _this3.renderOpts);

                  case 5:
                    return _context11.abrupt('return', _context11.sent);

                  case 6:
                    p = (0, _path.join)(_this3.dir, _this3.dist + '/bundles/pages/_error.js');
                    _context11.next = 9;
                    return _this3.serveStatic(req, res, p);

                  case 9:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, _callee11, _this3);
          }));

          function _nextBuildIdPage_errorJs(_x26, _x27, _x28) {
            return _ref12.apply(this, arguments);
          }

          return _nextBuildIdPage_errorJs;
        }(),

        '/_next/:buildId/page/:path*.js': function () {
          var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(req, res, params) {
            var paths, page, error, customFields, compilationErr, _customFields, p;

            return _regenerator2.default.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    paths = params.path || [''];
                    page = '/' + paths.join('/');

                    if (_this3.handleBuildId(params.buildId, res)) {
                      _context12.next = 8;
                      break;
                    }

                    error = new Error('INVALID_BUILD_ID');
                    customFields = { buildIdMismatched: true };
                    _context12.next = 7;
                    return (0, _render.renderScriptError)(req, res, page, error, customFields, _this3.renderOpts);

                  case 7:
                    return _context12.abrupt('return', _context12.sent);

                  case 8:
                    if (!_this3.dev) {
                      _context12.next = 27;
                      break;
                    }

                    _context12.prev = 9;
                    _context12.next = 12;
                    return _this3.hotReloader.ensurePage(page);

                  case 12:
                    _context12.next = 19;
                    break;

                  case 14:
                    _context12.prev = 14;
                    _context12.t0 = _context12['catch'](9);
                    _context12.next = 18;
                    return (0, _render.renderScriptError)(req, res, page, _context12.t0, {}, _this3.renderOpts);

                  case 18:
                    return _context12.abrupt('return', _context12.sent);

                  case 19:
                    _context12.next = 21;
                    return _this3.getCompilationError();

                  case 21:
                    compilationErr = _context12.sent;

                    if (!compilationErr) {
                      _context12.next = 27;
                      break;
                    }

                    _customFields = { statusCode: 500 };
                    _context12.next = 26;
                    return (0, _render.renderScriptError)(req, res, page, compilationErr, _customFields, _this3.renderOpts);

                  case 26:
                    return _context12.abrupt('return', _context12.sent);

                  case 27:
                    p = (0, _path.join)(_this3.dir, _this3.dist, 'bundles', 'pages', page + '.js');

                    // [production] If the page is not exists, we need to send a proper Next.js style 404
                    // Otherwise, it'll affect the multi-zones feature.

                    _context12.next = 30;
                    return _fs4.default.exists(p);

                  case 30:
                    if (_context12.sent) {
                      _context12.next = 34;
                      break;
                    }

                    _context12.next = 33;
                    return (0, _render.renderScriptError)(req, res, page, { code: 'ENOENT' }, {}, _this3.renderOpts);

                  case 33:
                    return _context12.abrupt('return', _context12.sent);

                  case 34:
                    _context12.next = 36;
                    return _this3.serveStatic(req, res, p);

                  case 36:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, _callee12, _this3, [[9, 14]]);
          }));

          function _nextBuildIdPagePathJs(_x29, _x30, _x31) {
            return _ref13.apply(this, arguments);
          }

          return _nextBuildIdPagePathJs;
        }(),

        '/_next/static/:path*': function () {
          var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    p = _path.join.apply(undefined, [_this3.dist, 'static'].concat((0, _toConsumableArray3.default)(params.path || [])));
                    _context13.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context13.stop();
                }
              }
            }, _callee13, _this3);
          }));

          function _nextStaticPath(_x32, _x33, _x34) {
            return _ref14.apply(this, arguments);
          }

          return _nextStaticPath;
        }(),

        // It's very important keep this route's param optional.
        // (but it should support as many as params, seperated by '/')
        // Othewise this will lead to a pretty simple DOS attack.
        // See more: https://github.com/zeit/next.js/issues/2617
        '/_next/:path*': function () {
          var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    p = _path.join.apply(undefined, [__dirname, '..', 'client'].concat((0, _toConsumableArray3.default)(params.path || [])));
                    _context14.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context14.stop();
                }
              }
            }, _callee14, _this3);
          }));

          function _nextPath(_x35, _x36, _x37) {
            return _ref15.apply(this, arguments);
          }

          return _nextPath;
        }(),

        // It's very important keep this route's param optional.
        // (but it should support as many as params, seperated by '/')
        // Othewise this will lead to a pretty simple DOS attack.
        // See more: https://github.com/zeit/next.js/issues/2617
        '/static/:path*': function () {
          var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    p = _path.join.apply(undefined, [_this3.dir, 'static'].concat((0, _toConsumableArray3.default)(params.path || [])));
                    _context15.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context15.stop();
                }
              }
            }, _callee15, _this3);
          }));

          function staticPath(_x38, _x39, _x40) {
            return _ref16.apply(this, arguments);
          }

          return staticPath;
        }()
      };

      if (this.config.useFileSystemPublicRoutes) {
        routes['/:path*'] = function () {
          var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(req, res, params, parsedUrl) {
            var pathname, query;
            return _regenerator2.default.wrap(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    pathname = parsedUrl.pathname, query = parsedUrl.query;
                    _context16.next = 3;
                    return _this3.render(req, res, pathname, query);

                  case 3:
                  case 'end':
                    return _context16.stop();
                }
              }
            }, _callee16, _this3);
          }));

          return function (_x41, _x42, _x43, _x44) {
            return _ref17.apply(this, arguments);
          };
        }();
      }

      var _arr = ['GET', 'HEAD'];
      for (var _i = 0; _i < _arr.length; _i++) {
        var method = _arr[_i];var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(routes)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            this.router.add(method, p, routes[p]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }, {
    key: 'start',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(port, hostname) {
        var _this4 = this;

        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.prepare();

              case 2:
                this.http = _http2.default.createServer(this.getRequestHandler());
                _context17.next = 5;
                return new _promise2.default(function (resolve, reject) {
                  // This code catches EADDRINUSE error if the port is already in use
                  _this4.http.on('error', reject);
                  _this4.http.on('listening', function () {
                    return resolve();
                  });
                  _this4.http.listen(port, hostname);
                });

              case 5:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function start(_x45, _x46) {
        return _ref18.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(req, res, parsedUrl) {
        var fn;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (!this.hotReloader) {
                  _context18.next = 3;
                  break;
                }

                _context18.next = 3;
                return this.hotReloader.run(req, res);

              case 3:
                fn = this.router.match(req, res, parsedUrl);

                if (!fn) {
                  _context18.next = 8;
                  break;
                }

                _context18.next = 7;
                return fn();

              case 7:
                return _context18.abrupt('return');

              case 8:
                if (!(req.method === 'GET' || req.method === 'HEAD')) {
                  _context18.next = 13;
                  break;
                }

                _context18.next = 11;
                return this.render404(req, res, parsedUrl);

              case 11:
                _context18.next = 15;
                break;

              case 13:
                res.statusCode = 501;
                res.end(_http.STATUS_CODES[501]);

              case 15:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function run(_x47, _x48, _x49) {
        return _ref19.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(req, res, pathname, query, parsedUrl) {
        var html;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                if (!(0, _utils.isInternalUrl)(req.url)) {
                  _context19.next = 2;
                  break;
                }

                return _context19.abrupt('return', this.handleRequest(req, res, parsedUrl));

              case 2:
                if (!blockedPages[pathname]) {
                  _context19.next = 6;
                  break;
                }

                _context19.next = 5;
                return this.render404(req, res, parsedUrl);

              case 5:
                return _context19.abrupt('return', _context19.sent);

              case 6:
                _context19.next = 8;
                return this.renderToHTML(req, res, pathname, query);

              case 8:
                html = _context19.sent;

                if (!(0, _utils2.isResSent)(res)) {
                  _context19.next = 11;
                  break;
                }

                return _context19.abrupt('return');

              case 11:

                res.setHeader('X-Powered-By', 'Next.js ' + _package2.default.version);
                return _context19.abrupt('return', (0, _render.sendHTML)(req, res, html, req.method, this.renderOpts));

              case 13:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function render(_x50, _x51, _x52, _x53, _x54) {
        return _ref20.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: 'renderToHTML',
    value: function () {
      var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(req, res, pathname, query) {
        var compilationErr, out;
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (!this.dev) {
                  _context20.next = 7;
                  break;
                }

                _context20.next = 3;
                return this.getCompilationError();

              case 3:
                compilationErr = _context20.sent;

                if (!compilationErr) {
                  _context20.next = 7;
                  break;
                }

                res.statusCode = 500;
                return _context20.abrupt('return', this.renderErrorToHTML(compilationErr, req, res, pathname, query));

              case 7:
                _context20.prev = 7;
                _context20.next = 10;
                return (0, _render.renderToHTML)(req, res, pathname, query, this.renderOpts);

              case 10:
                out = _context20.sent;
                return _context20.abrupt('return', out);

              case 14:
                _context20.prev = 14;
                _context20.t0 = _context20['catch'](7);

                if (!(_context20.t0.code === 'ENOENT')) {
                  _context20.next = 21;
                  break;
                }

                res.statusCode = 404;
                return _context20.abrupt('return', this.renderErrorToHTML(null, req, res, pathname, query));

              case 21:
                if (!this.quiet) console.error(_context20.t0);
                res.statusCode = 500;
                return _context20.abrupt('return', this.renderErrorToHTML(_context20.t0, req, res, pathname, query));

              case 24:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this, [[7, 14]]);
      }));

      function renderToHTML(_x55, _x56, _x57, _x58) {
        return _ref21.apply(this, arguments);
      }

      return renderToHTML;
    }()
  }, {
    key: 'renderError',
    value: function () {
      var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(err, req, res, pathname, query) {
        var html;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return this.renderErrorToHTML(err, req, res, pathname, query);

              case 2:
                html = _context21.sent;
                return _context21.abrupt('return', (0, _render.sendHTML)(req, res, html, req.method, this.renderOpts));

              case 4:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function renderError(_x59, _x60, _x61, _x62, _x63) {
        return _ref22.apply(this, arguments);
      }

      return renderError;
    }()
  }, {
    key: 'renderErrorToHTML',
    value: function () {
      var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(err, req, res, pathname, query) {
        var compilationErr;
        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                if (!this.dev) {
                  _context22.next = 7;
                  break;
                }

                _context22.next = 3;
                return this.getCompilationError();

              case 3:
                compilationErr = _context22.sent;

                if (!compilationErr) {
                  _context22.next = 7;
                  break;
                }

                res.statusCode = 500;
                return _context22.abrupt('return', (0, _render.renderErrorToHTML)(compilationErr, req, res, pathname, query, this.renderOpts));

              case 7:
                _context22.prev = 7;
                _context22.next = 10;
                return (0, _render.renderErrorToHTML)(err, req, res, pathname, query, this.renderOpts);

              case 10:
                return _context22.abrupt('return', _context22.sent);

              case 13:
                _context22.prev = 13;
                _context22.t0 = _context22['catch'](7);

                if (!this.dev) {
                  _context22.next = 21;
                  break;
                }

                if (!this.quiet) console.error(_context22.t0);
                res.statusCode = 500;
                return _context22.abrupt('return', (0, _render.renderErrorToHTML)(_context22.t0, req, res, pathname, query, this.renderOpts));

              case 21:
                throw _context22.t0;

              case 22:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this, [[7, 13]]);
      }));

      function renderErrorToHTML(_x64, _x65, _x66, _x67, _x68) {
        return _ref23.apply(this, arguments);
      }

      return renderErrorToHTML;
    }()
  }, {
    key: 'render404',
    value: function () {
      var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(req, res) {
        var parsedUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _url.parse)(req.url, true);
        var pathname, query;
        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                pathname = parsedUrl.pathname, query = parsedUrl.query;

                res.statusCode = 404;
                return _context23.abrupt('return', this.renderError(null, req, res, pathname, query));

              case 3:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function render404(_x70, _x71) {
        return _ref24.apply(this, arguments);
      }

      return render404;
    }()
  }, {
    key: 'serveStatic',
    value: function () {
      var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(req, res, path) {
        return _regenerator2.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                if (this.isServeableUrl(path)) {
                  _context24.next = 2;
                  break;
                }

                return _context24.abrupt('return', this.render404(req, res));

              case 2:
                _context24.prev = 2;
                _context24.next = 5;
                return (0, _render.serveStatic)(req, res, path);

              case 5:
                return _context24.abrupt('return', _context24.sent);

              case 8:
                _context24.prev = 8;
                _context24.t0 = _context24['catch'](2);

                if (!(_context24.t0.code === 'ENOENT')) {
                  _context24.next = 14;
                  break;
                }

                this.render404(req, res);
                _context24.next = 15;
                break;

              case 14:
                throw _context24.t0;

              case 15:
              case 'end':
                return _context24.stop();
            }
          }
        }, _callee24, this, [[2, 8]]);
      }));

      function serveStatic(_x72, _x73, _x74) {
        return _ref25.apply(this, arguments);
      }

      return serveStatic;
    }()
  }, {
    key: 'isServeableUrl',
    value: function isServeableUrl(path) {
      var resolved = (0, _path.resolve)(path);
      if (resolved.indexOf((0, _path.join)(this.dir, this.dist) + _path.sep) !== 0 && resolved.indexOf((0, _path.join)(this.dir, 'static') + _path.sep) !== 0) {
        // Seems like the user is trying to traverse the filesystem.
        return false;
      }

      return true;
    }
  }, {
    key: 'readBuildId',
    value: function readBuildId() {
      var buildIdPath = (0, _path.join)(this.dir, this.dist, 'BUILD_ID');
      var buildId = _fs2.default.readFileSync(buildIdPath, 'utf8');
      return buildId.trim();
    }
  }, {
    key: 'handleBuildId',
    value: function handleBuildId(buildId, res) {
      if (this.dev) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
        return true;
      }

      if (buildId !== this.renderOpts.buildId) {
        return false;
      }

      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
      return true;
    }
  }, {
    key: 'getCompilationError',
    value: function () {
      var _ref26 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25() {
        var errors;
        return _regenerator2.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                if (this.hotReloader) {
                  _context25.next = 2;
                  break;
                }

                return _context25.abrupt('return');

              case 2:
                _context25.next = 4;
                return this.hotReloader.getCompilationErrors();

              case 4:
                errors = _context25.sent;

                if (errors.size) {
                  _context25.next = 7;
                  break;
                }

                return _context25.abrupt('return');

              case 7:
                return _context25.abrupt('return', (0, _from2.default)(errors.values())[0][0]);

              case 8:
              case 'end':
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function getCompilationError() {
        return _ref26.apply(this, arguments);
      }

      return getCompilationError;
    }()
  }, {
    key: 'handleBuildHash',
    value: function handleBuildHash(filename, hash, res) {
      if (this.dev) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
        return true;
      }

      if (hash !== this.buildStats[filename].hash) {
        throw new Error('Invalid Build File Hash(' + hash + ') for chunk: ' + filename);
      }

      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
      return true;
    }
  }, {
    key: 'send404',
    value: function send404(res) {
      res.statusCode = 404;
      res.end('404 - Not Found');
    }
  }]);
  return Server;
}();

exports.default = Server;