(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _createContainer = require('./createContainer');

var _createContainer2 = _interopRequireDefault(_createContainer);

var _scroller = require('./scroller');

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CACHED_ITEMS_MULTIPLE = 1;

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.totalRows = 0;
    this.totalCols = 0;
    this.lastRepaintY = 0;
    this.lastRepaintX = 0;
    this.lastScrolled = 0;
    this.badNodeMarker = (0, _utils.uuid)(true);
  }

  _createClass(_class, [{
    key: 'initialize',
    value: function initialize(conf) {
      var config = {};
      Object.assign(config, this, conf);
      this.w = config.w ? (0, _utils.filterInt)(config.w) : config.parentDims.width;;
      this.h = config.h ? (0, _utils.filterInt)(config.h) : config.parentDims.height;
      this.width = this.w ? this.w + 'px' : '100%';
      this.height = this.h ? this.h + 'px' : '100%';
      this.mode = config.mode || 'vertical';
      if (this.mode !== 'vertical' && this.mode !== 'horizontal' && this.mode !== 'grid') (0, _utils.error)('wrong type');
      this.itemWidth = config.itemWidth;
      this.itemHeight = config.itemHeight;
      this.iterator = config.iterator || 'item';
      this.collection = config.collection || [];
      if (this.mode === 'horizontal') configureHorizontalMode(this);
      if (this.mode === 'vertical') configureVerticalMode(this);
      if (this.mode === 'grid') configureGridMode(this);
      this.$container.empty().append(this.$scroller);
      this.cachedItemsLen = this.screenItemsLen * CACHED_ITEMS_MULTIPLE;
      return this;
    }
  }]);

  return _class;
}();

exports.default = _class;


function configureHorizontalMode(obj) {
  obj.totalCols = (0, _utils.filterInt)(obj.cols);
  if (!obj.totalCols) obj.totalCols = obj.collection.length;
  obj.itemWidth = (0, _utils.filterInt)(obj.itemWidth);
  if (!obj.itemWidth) (0, _utils.error)("'item-width' required in horizontal mode");
  obj.screenItemsLen = Math.ceil(obj.w / obj.itemWidth);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen * obj.itemWidth);
  obj.$scroller = (0, _scroller2.default)(obj.itemWidth * obj.totalCols, obj.mode, obj.$scroller);
  obj.$container = obj.$container || (0, _createContainer2.default)(obj.width, obj.height, obj.mode);
}

function configureVerticalMode(obj) {
  obj.totalRows = (0, _utils.filterInt)(obj.rows);
  obj.itemHeight = (0, _utils.filterInt)(obj.itemHeight);
  if (!obj.totalRows) obj.totalRows = obj.collection.length;
  if (!obj.itemHeight) (0, _utils.error)("'item-height' required in vertical mode");
  obj.screenItemsLen = Math.ceil(obj.h / obj.itemHeight);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen * obj.itemHeight);
  obj.$scroller = (0, _scroller2.default)(obj.itemHeight * obj.totalRows, obj.mode, obj.$scroller);
  obj.$container = obj.$container || (0, _createContainer2.default)(obj.width, obj.height, obj.mode);
}

function configureGridMode(obj) {
  obj.totalCols = (0, _utils.filterInt)(obj.cols);
  obj.totalRows = (0, _utils.filterInt)(obj.rows);
  obj.itemHeight = (0, _utils.filterInt)(obj.itemHeight);
  obj.itemWidth = (0, _utils.filterInt)(obj.itemWidth);
  if (!obj.itemHeight) (0, _utils.error)("'item-height' required in grd mode");
  if (!obj.itemWidth) (0, _utils.error)("'item-width' required in grid mode");
  if (!obj.totalCols) obj.totalCols = Math.floor(obj.w / obj.itemWidth);
  if (!obj.totalRows) obj.totalRows = Math.ceil(obj.collection.length / obj.totalCols);
  // console.log("obj.totalCols", obj.totalCols);
  obj.screenItemsLen = Math.ceil(obj.h / obj.itemHeight) * obj.totalCols;
  // console.log("obj.screenItemsLen", obj.screenItemsLen);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen / obj.totalCols * obj.itemHeight);
  obj.$scroller = (0, _scroller2.default)(obj.itemHeight * obj.totalRows, obj.mode, obj.$scroller);
  obj.$container = obj.$container || (0, _createContainer2.default)(obj.width, obj.height, obj.mode);
}

},{"./createContainer":2,"./scroller":4,"./utils":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createContainer;
function createContainer(w, h, mode) {
  var $c = angular.element('<div></div>');
  var css = {
    width: w,
    height: h,
    'overflow-y': 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0
  };
  if (mode === 'horizontal') {
    delete css['overflow-y'];
    css['overflow-x'] = 'auto';
  }
  $c.css(css);
  $c.addClass('s-container');
  return $c;
}

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _svScrollerSrvc = require('./svScrollerSrvc.service');

var _svScrollerSrvc2 = _interopRequireDefault(_svScrollerSrvc);

var _svScroller = require('./svScroller.directive');

var _svScroller2 = _interopRequireDefault(_svScroller);

var _svScrollerCtrl = require('./svScrollerCtrl');

var _svScrollerCtrl2 = _interopRequireDefault(_svScrollerCtrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

angular.module('sv-scroller', []).factory('svScrollerSrvc', function () {
  return _svScrollerSrvc2.default;
}).directive('svScroller', _svScroller2.default.factory).controller('svScrollerCtrl', _svScrollerCtrl2.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./svScroller.directive":5,"./svScrollerCtrl":6,"./svScrollerSrvc.service":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scroller;
function scroller(size, mode, $scroller) {
  $scroller = $scroller || angular.element('<div></div>');

  var css = {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '1px',
    height: size + 'px'
  };

  if (mode === 'horizontal') {
    css.width = size + 'px';
    css.height = '1px';
  }

  $scroller.css(css);
  return $scroller;
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var svScroller = function () {
  function svScroller() {
    _classCallCheck(this, svScroller);

    this.restrict = 'E';
    this.controller = 'svScrollerCtrl as svc';
    this.bindToController = {
      iterator: '<',
      collection: '=',
      mode: '<',
      w: '<',
      h: '<',
      rows: '<',
      cols: '<',
      itemHeight: '<',
      itemWidth: '<',
      infiniteScroll: '&'
    };
    this.transclude = true;
  }

  _createClass(svScroller, null, [{
    key: 'factory',
    value: function factory() {
      svScroller.instance = new svScroller();
      return svScroller.instance;
    }
  }]);

  return svScroller;
}();

exports.default = svScroller;


svScroller.factory.$inject = [];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = svScrollerCtrl;

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _utils = require('./utils');

var _scroller = require('./scroller');

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REMOVE_INTERVAL = 300;
var VISIBILITY_TIME = 1;
var REPAINT_WAIT = 200;

function svScrollerCtrl($scope, $element, $attrs, $transclude, $interval, $timeout, svScrollerSrvc) {
  var _this = this;

  var ctrl = this;
  ctrl.config = new _Config2.default();
  ctrl.namespace = $attrs.id ? $attrs.id + ':' : '';
  ctrl.infiniteScroll = this.infiniteScroll;

  initialize(ctrl);

  $scope.$watchCollection(function () {
    return _this.collection;
  }, function (n, o) {
    if (n !== o) {
      ctrl.collection = _this.collection;
      initialize(ctrl);
      onScrollHandler();
    }
  });

  svScrollerSrvc.subscribe(ctrl.namespace + 'scrollToElement', scrollToElement);
  svScrollerSrvc.subscribe(ctrl.namespace + 'scrollToView', scrollToView);
  svScrollerSrvc.subscribe(ctrl.namespace + 'reset', reset);
  svScrollerSrvc.subscribe(ctrl.namespace + 'isReady', isReady);

  function createElement(i) {
    var $item = angular.element('<div></div>');
    var css = {
      height: ctrl.itemHeight + 'px',
      width: '100%',
      position: 'absolute',
      top: i * ctrl.itemHeight + 'px',
      visibility: 'hidden'
    };
    if (ctrl.mode === 'horizontal') {
      css.height = '100%';
      css['min-height'] = '100%';
      delete css.top;
      css.left = i * ctrl.itemWidth + 'px';
      css.width = ctrl.itemWidth + 'px';
    }

    if (ctrl.mode === 'grid') {
      var col = 0;
      var row = parseInt(i / ctrl.totalCols);
      col = i - ctrl.totalCols * row;
      css.top = row * ctrl.itemHeight + 'px';
      css.left = col * ctrl.itemWidth + 'px';
      css.width = ctrl.itemWidth + 'px';
      css['min-height'] = ctrl.itemHeight + 'px';
    }
    $item.css(css);
    $item.addClass(ctrl.mode === 'horizontal' ? 's-vcol' : 's-vrow');
    if (ctrl.mode === 'grid') $item.addClass('s-vcol');
    $transclude(function (el, scope) {
      scope[ctrl.iterator] = ctrl.collection[i];
      $item.append(el);
    });
    setTimeout(function () {
      $item.css({ visibility: 'visible' });
    }, VISIBILITY_TIME);
    return Promise.resolve($item);
  }

  function initialize() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var parent = $element.parent()[0].getBoundingClientRect();
    ctrl.parentDims = {
      height: parent.height,
      width: parent.width
    };
    Object.assign(ctrl, config);
    Object.assign(ctrl, ctrl.config.initialize(ctrl));
    // console.log("ctrl", ctrl);
    if ($element.children().length === 0) $element.append(ctrl.$container);
    // console.log("ctrl.$container", ctrl.$container);
    ctrl.$container.unbind('scroll').unbind('resize').bind('scroll', onScrollHandler).bind('resize', reset);
    // console.log("ctrl.$container", ctrl.$container);
    renderChunk(ctrl.$container, 0).then(function (mode) {
      // console.log('initialze', ctrl.namespace + 'ready');
      svScrollerSrvc.publish(ctrl.namespace + 'ready', true);
    });

    $interval(function () {
      if (Date.now() - ctrl.lastScrolled > REPAINT_WAIT) {
        var $badNodes = angular.element(document.querySelectorAll('[data-rm-node="' + ctrl.badNodeMarker + '"]'));
        $badNodes.remove();
      }
    }, REMOVE_INTERVAL);
  }

  function onScrollHandler() {
    var target = ctrl.$container[0];
    var first = void 0,
        scrollLeft = void 0,
        scrollTop = void 0;

    switch (ctrl.mode) {
      case 'horizontal':
        scrollLeft = target.scrollLeft;
        if (Math.abs(scrollLeft - ctrl.lastRepaintX) > ctrl.maxBuffer || scrollLeft === 0) {
          first = parseInt(scrollLeft / ctrl.itemWidth) - ctrl.screenItemsLen;
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintX = scrollLeft;
        }
        break;
      case 'grid':
        scrollTop = target.scrollTop;
        console.log("scrollTop", scrollTop, ' ctrl.lastRepaintY', ctrl.lastRepaintY, ' ctrl.maxBuffer ', ctrl.maxBuffer);
        if (Math.abs(scrollTop - ctrl.lastRepaintY) > ctrl.maxBuffer || scrollTop === 0) {
          first = parseInt(scrollTop / ctrl.itemHeight * ctrl.totalCols) - ctrl.screenItemsLen;
          // console.log("first", first, "screenItemsLen ", ctrl.screenItemsLen);
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintY = scrollTop;
        }
        break;
      default:
        scrollTop = target.scrollTop;
        if (Math.abs(scrollTop - ctrl.lastRepaintY) > ctrl.maxBuffer || scrollTop === 0) {
          first = parseInt(scrollTop / ctrl.itemHeight) - ctrl.screenItemsLen;
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintY = scrollTop;
        }
    }

    ctrl.lastScrolled = Date.now();
    target.preventDefault && target.preventDefault();
  }

  function renderChunk($node, from) {
    var promises = [];
    var finalItem = from + ctrl.cachedItemsLen * 3;
    var totalElements = ctrl.mode === 'horizontal' ? ctrl.totalCols : ctrl.mode === 'grid' ? ctrl.totalCols * ctrl.totalRows : ctrl.totalRows;
    // console.log("from", from, " finalItem ", finalItem, " totalElements ", totalElements);
    if (finalItem > totalElements) finalItem = totalElements;
    var $fragment = angular.element(document.createDocumentFragment());
    for (var i = from; i < finalItem; i++) {
      promises.push(createElement(i));
    }

    // Hide and mark obsolete nodes for deletion.
    var $children = $node.children();
    for (var j = 1, l = $children.length; j < l; j++) {
      var child = $children[j];
      child.style.display = 'none';
      child.setAttribute('data-rm-node', ctrl.badNodeMarker);
    }

    return Promise.all(promises).then(function (results) {
      results.forEach(function (result) {
        $fragment.append(result);
      });
      // console.log("$fragment", $fragment);
      $node.append($fragment);
      return ctrl.mode;
    });
  }

  function reset(config) {
    initialize(config);
    scrollToElement(0);
  }

  function isReady() {
    // console.log('isReady: ', Boolean(ctrl.$container.children().length > 1));
    svScrollerSrvc.publish(ctrl.namespace + 'ready', Boolean(ctrl.$container.children().length > 1));
  }

  function scrollToElement(index) {
    index = parseInt(index, 10) || 0;
    // console.log('scrollToElement', index);
    switch (ctrl.mode) {
      case "grid":
        renderChunk(ctrl.$container, (Math.ceil(index / ctrl.totalCols) - 1) * ctrl.totalCols);
        ctrl.$container[0].scrollTop = (Math.ceil(index / ctrl.totalCols) - 1) * ctrl.itemHeight;
        break;
      case "horizontal":
        renderChunk(ctrl.$container, index);
        ctrl.$container[0].scrollLeft = index * ctrl.itemWidth;
        break;
      default:
        renderChunk(ctrl.$container, index);
        ctrl.$container[0].scrollTop = index * ctrl.itemHeight;
    }
  }

  function scrollToView(token) {
    ctrl.scrollToView = token;
    switch (ctrl.scrollToView) {
      case 'top':
        renderChunk(ctrl.$container, 0);
        ctrl.$container[0].scrollTop = 0;
        break;
      case 'bottom':
        renderChunk(ctrl.$container, ctrl.totalRows);
        ctrl.$container[0].scrollTop = parseInt(ctrl.totalRows * ctrl.itemHeight, 10);
        break;
      case 'left':
        ctrl.$container[0].scrollLeft = ctrl.$container[0].scrollLeft - parseInt(ctrl.itemWidth * ctrl.screenItemsLen, 10);
        break;
      case 'right':
        ctrl.$container[0].scrollLeft = ctrl.$container[0].scrollLeft + parseInt(ctrl.itemWidth * ctrl.screenItemsLen, 10);
        break;
      case 'beginning':
        renderChunk(ctrl.$container, 0);
        ctrl.$container[0].scrollLeft = 0;
        break;
      case 'end':
        renderChunk(ctrl.$container, ctrl.totalCols);
        ctrl.$container[0].scrollLeft = ctrl.totalCols * ctrl.itemWidth;
        break;
      case 'up':
        if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop - Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen / ctrl.totalCols);else ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop - Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen);
        break;
      case 'down':
        if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop + Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen / ctrl.totalCols);else ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop + Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen);
        break;
    }
  }
}

svScrollerCtrl.$inject = ['$scope', '$element', '$attrs', '$transclude', '$interval', '$timeout', 'svScrollerSrvc'];

},{"./Config":1,"./scroller":4,"./utils":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var topics = {};

exports.default = {
  addTopic: function addTopic(topic) {
    if (!topics[topic]) topics[topic] = [];
  },
  delTopic: function delTopic(topic) {
    if (topics[topic]) {
      topics[topic].forEach(function (subscriber) {
        subscriber = null;
      });
      delete topics[topic];
    }
  },
  publish: function publish(topic, data) {
    if (!topics[topic] || topics[topic].length < 1) return;
    topics[topic].forEach(function (listener) {
      listener(data || {});
    });
  },
  subscribe: function subscribe(topic, listener) {
    if (!topics[topic]) topics[topic] = [];
    var currListener = topics[topic].find(function (listnr) {
      return listnr === listener;
    });
    if (!currListener) topics[topic].push(listener);
  }
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function error(message) {
  throw new Error(message);
}

function filterInt(val) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(val)) return Number(val);
  return null;
}

function uuid(short) {
  var d = new Date().getTime();
  var uuidString = short ? '4xxx-xxxxxx' : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  var uuid = uuidString.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}

exports.error = error;
exports.filterInt = filterInt;
exports.uuid = uuid;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29uZmlnLmpzIiwic3JjL2NyZWF0ZUNvbnRhaW5lci5qcyIsInNyYy9uZy13cmFwcGVyLmpzIiwic3JjL3Njcm9sbGVyLmpzIiwic3JjL3N2U2Nyb2xsZXIuZGlyZWN0aXZlLmpzIiwic3JjL3N2U2Nyb2xsZXJDdHJsLmpzIiwic3JjL3N2U2Nyb2xsZXJTcnZjLnNlcnZpY2UuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUEsSUFBTSx3QkFBd0IsQ0FBeEI7OztBQUlKLG9CQUFjOzs7QUFDWixTQUFLLFNBQUwsR0FBaUIsQ0FBakIsQ0FEWTtBQUVaLFNBQUssU0FBTCxHQUFpQixDQUFqQixDQUZZO0FBR1osU0FBSyxZQUFMLEdBQW9CLENBQXBCLENBSFk7QUFJWixTQUFLLFlBQUwsR0FBb0IsQ0FBcEIsQ0FKWTtBQUtaLFNBQUssWUFBTCxHQUFvQixDQUFwQixDQUxZO0FBTVosU0FBSyxhQUFMLEdBQXFCLGlCQUFLLElBQUwsQ0FBckIsQ0FOWTtHQUFkOzs7OytCQVNXLE1BQU07QUFDZixVQUFJLFNBQVMsRUFBVCxDQURXO0FBRWYsYUFBTyxNQUFQLENBQWMsTUFBZCxFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUZlO0FBR2YsV0FBSyxDQUFMLEdBQVMsT0FBTyxDQUFQLEdBQVcsc0JBQVUsT0FBTyxDQUFQLENBQXJCLEdBQWlDLE9BQU8sVUFBUCxDQUFrQixLQUFsQixDQUgzQjtBQUlmLFdBQUssQ0FBTCxHQUFTLE9BQU8sQ0FBUCxHQUFXLHNCQUFVLE9BQU8sQ0FBUCxDQUFyQixHQUFpQyxPQUFPLFVBQVAsQ0FBa0IsTUFBbEIsQ0FKM0I7QUFLZixXQUFLLEtBQUwsR0FBYSxLQUFLLENBQUwsR0FBUyxLQUFLLENBQUwsR0FBUyxJQUFULEdBQWdC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LENBQUMsSUFBSSxLQUFLLE1BQUwsS0FBZ0IsRUFBaEIsQ0FBTCxHQUEyQixFQUEzQixHQUFnQyxDQUFoQyxDQUR5QztBQUVqRCxRQUFJLEtBQUssS0FBTCxDQUFXLElBQUksRUFBSixDQUFmLENBRmlEO0FBR2pELFdBQU8sQ0FBQyxLQUFLLEdBQUwsR0FBVyxDQUFYLEdBQWdCLElBQUksR0FBSixHQUFVLEdBQVYsQ0FBakIsQ0FBaUMsUUFBakMsQ0FBMEMsRUFBMUMsQ0FBUCxDQUhpRDtHQUFaLENBQW5DLENBSGU7QUFRbkIsU0FBTyxJQUFQLENBUm1CO0NBQXJCOztRQVlFO1FBQ0E7UUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2Vycm9yLCBmaWx0ZXJJbnQsIHV1aWR9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGNyZWF0ZUNvbnRhaW5lciBmcm9tICcuL2NyZWF0ZUNvbnRhaW5lcic7XG5pbXBvcnQgc2Nyb2xsZXIgZnJvbSAnLi9zY3JvbGxlcic7XG5cbmNvbnN0IENBQ0hFRF9JVEVNU19NVUxUSVBMRSA9IDE7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRvdGFsUm93cyA9IDA7XG4gICAgdGhpcy50b3RhbENvbHMgPSAwO1xuICAgIHRoaXMubGFzdFJlcGFpbnRZID0gMDtcbiAgICB0aGlzLmxhc3RSZXBhaW50WCA9IDA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsZWQgPSAwO1xuICAgIHRoaXMuYmFkTm9kZU1hcmtlciA9IHV1aWQodHJ1ZSk7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmYpIHtcbiAgICBsZXQgY29uZmlnID0ge307XG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIHRoaXMsIGNvbmYpO1xuICAgIHRoaXMudyA9IGNvbmZpZy53ID8gZmlsdGVySW50KGNvbmZpZy53KSA6IGNvbmZpZy5wYXJlbnREaW1zLndpZHRoOztcbiAgICB0aGlzLmggPSBjb25maWcuaCA/IGZpbHRlckludChjb25maWcuaCkgOiBjb25maWcucGFyZW50RGltcy5oZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMudyA/IHRoaXMudyArICdweCcgOiAnMTAwJSc7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmggPyB0aGlzLmggKyAncHgnIDogJzEwMCUnO1xuICAgIHRoaXMubW9kZSA9IGNvbmZpZy5tb2RlIHx8ICd2ZXJ0aWNhbCc7XG4gICAgaWYgKHRoaXMubW9kZSAhPT0gJ3ZlcnRpY2FsJyAmJiB0aGlzLm1vZGUgIT09ICdob3Jpem9udGFsJyAmJiB0aGlzLm1vZGUgIT09ICdncmlkJykgZXJyb3IoJ3dyb25nIHR5cGUnKTtcbiAgICB0aGlzLml0ZW1XaWR0aCA9IGNvbmZpZy5pdGVtV2lkdGg7XG4gICAgdGhpcy5pdGVtSGVpZ2h0ID0gY29uZmlnLml0ZW1IZWlnaHQ7XG4gICAgdGhpcy5pdGVyYXRvciA9IGNvbmZpZy5pdGVyYXRvciB8fCAnaXRlbSc7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29uZmlnLmNvbGxlY3Rpb24gfHwgW107XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2hvcml6b250YWwnKSBjb25maWd1cmVIb3Jpem9udGFsTW9kZSh0aGlzKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSAndmVydGljYWwnKSBjb25maWd1cmVWZXJ0aWNhbE1vZGUodGhpcyk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2dyaWQnKSBjb25maWd1cmVHcmlkTW9kZSh0aGlzKTtcbiAgICB0aGlzLiRjb250YWluZXIuZW1wdHkoKS5hcHBlbmQodGhpcy4kc2Nyb2xsZXIpO1xuICAgIHRoaXMuY2FjaGVkSXRlbXNMZW4gPSB0aGlzLnNjcmVlbkl0ZW1zTGVuICogQ0FDSEVEX0lURU1TX01VTFRJUExFO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUhvcml6b250YWxNb2RlKG9iaikge1xuICBvYmoudG90YWxDb2xzID0gZmlsdGVySW50KG9iai5jb2xzKTtcbiAgaWYgKCFvYmoudG90YWxDb2xzKSBvYmoudG90YWxDb2xzID0gb2JqLmNvbGxlY3Rpb24ubGVuZ3RoO1xuICBvYmouaXRlbVdpZHRoID0gZmlsdGVySW50KG9iai5pdGVtV2lkdGgpO1xuICBpZiAoIW9iai5pdGVtV2lkdGgpIGVycm9yKFwiJ2l0ZW0td2lkdGgnIHJlcXVpcmVkIGluIGhvcml6b250YWwgbW9kZVwiKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai53IC8gb2JqLml0ZW1XaWR0aCk7XG4gIG9iai5tYXhCdWZmZXIgPSBNYXRoLmNlaWwob2JqLnNjcmVlbkl0ZW1zTGVuICogb2JqLml0ZW1XaWR0aCk7XG4gIG9iai4kc2Nyb2xsZXIgPSBzY3JvbGxlcihvYmouaXRlbVdpZHRoICogb2JqLnRvdGFsQ29scywgb2JqLm1vZGUsIG9iai4kc2Nyb2xsZXIpO1xuICBvYmouJGNvbnRhaW5lciA9IG9iai4kY29udGFpbmVyIHx8IGNyZWF0ZUNvbnRhaW5lcihvYmoud2lkdGgsIG9iai5oZWlnaHQsIG9iai5tb2RlKTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlVmVydGljYWxNb2RlKG9iaikge1xuICBvYmoudG90YWxSb3dzID0gZmlsdGVySW50KG9iai5yb3dzKTtcbiAgb2JqLml0ZW1IZWlnaHQgPSBmaWx0ZXJJbnQob2JqLml0ZW1IZWlnaHQpO1xuICBpZiAoIW9iai50b3RhbFJvd3MpIG9iai50b3RhbFJvd3MgPSBvYmouY29sbGVjdGlvbi5sZW5ndGg7XG4gIGlmICghb2JqLml0ZW1IZWlnaHQpIGVycm9yKFwiJ2l0ZW0taGVpZ2h0JyByZXF1aXJlZCBpbiB2ZXJ0aWNhbCBtb2RlXCIpO1xuICBvYmouc2NyZWVuSXRlbXNMZW4gPSBNYXRoLmNlaWwob2JqLmggLyBvYmouaXRlbUhlaWdodCk7XG4gIG9iai5tYXhCdWZmZXIgPSBNYXRoLmNlaWwob2JqLnNjcmVlbkl0ZW1zTGVuICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVHcmlkTW9kZShvYmopIHtcbiAgb2JqLnRvdGFsQ29scyA9IGZpbHRlckludChvYmouY29scyk7XG4gIG9iai50b3RhbFJvd3MgPSBmaWx0ZXJJbnQob2JqLnJvd3MpO1xuICBvYmouaXRlbUhlaWdodCA9IGZpbHRlckludChvYmouaXRlbUhlaWdodCk7XG4gIG9iai5pdGVtV2lkdGggPSBmaWx0ZXJJbnQob2JqLml0ZW1XaWR0aCk7XG4gIGlmICghb2JqLml0ZW1IZWlnaHQpIGVycm9yKFwiJ2l0ZW0taGVpZ2h0JyByZXF1aXJlZCBpbiBncmQgbW9kZVwiKTtcbiAgaWYgKCFvYmouaXRlbVdpZHRoKSBlcnJvcihcIidpdGVtLXdpZHRoJyByZXF1aXJlZCBpbiBncmlkIG1vZGVcIik7XG4gIGlmICghb2JqLnRvdGFsQ29scykgb2JqLnRvdGFsQ29scyA9IE1hdGguZmxvb3IoKG9iai53IC8gb2JqLml0ZW1XaWR0aCkpO1xuICBpZiAoIW9iai50b3RhbFJvd3MpIG9iai50b3RhbFJvd3MgPSBNYXRoLmNlaWwob2JqLmNvbGxlY3Rpb24ubGVuZ3RoIC8gb2JqLnRvdGFsQ29scyk7XG4gIC8vIGNvbnNvbGUubG9nKFwib2JqLnRvdGFsQ29sc1wiLCBvYmoudG90YWxDb2xzKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai5oIC8gb2JqLml0ZW1IZWlnaHQpICogb2JqLnRvdGFsQ29scztcbiAgLy8gY29uc29sZS5sb2coXCJvYmouc2NyZWVuSXRlbXNMZW5cIiwgb2JqLnNjcmVlbkl0ZW1zTGVuKTtcbiAgb2JqLm1heEJ1ZmZlciA9IE1hdGguY2VpbChvYmouc2NyZWVuSXRlbXNMZW4gLyBvYmoudG90YWxDb2xzICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ29udGFpbmVyKHcsIGgsIG1vZGUpIHtcbiAgbGV0ICRjID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICBsZXQgY3NzID0ge1xuICAgIHdpZHRoOiB3LFxuICAgIGhlaWdodDogaCxcbiAgICAnb3ZlcmZsb3cteSc6ICdhdXRvJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgcGFkZGluZzogMFxuICB9XG4gIGlmIChtb2RlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBkZWxldGUgY3NzWydvdmVyZmxvdy15J107XG4gICAgY3NzWydvdmVyZmxvdy14J10gPSAnYXV0byc7XG4gIH1cbiAgJGMuY3NzKGNzcyk7XG4gICRjLmFkZENsYXNzKCdzLWNvbnRhaW5lcicpXG4gIHJldHVybiAkYztcbn1cbiIsImxldCBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5pbXBvcnQgc3ZTY3JvbGxlclNydmMgZnJvbSAnLi9zdlNjcm9sbGVyU3J2Yy5zZXJ2aWNlJztcbmltcG9ydCBzdlNjcm9sbGVyIGZyb20gXCIuL3N2U2Nyb2xsZXIuZGlyZWN0aXZlXCI7XG5pbXBvcnQgc3ZTY3JvbGxlckN0cmwgZnJvbSAnLi9zdlNjcm9sbGVyQ3RybCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzdi1zY3JvbGxlcicsIFtdKVxuICAuZmFjdG9yeSgnc3ZTY3JvbGxlclNydmMnLCAoKSA9PiBzdlNjcm9sbGVyU3J2YylcbiAgLmRpcmVjdGl2ZSgnc3ZTY3JvbGxlcicsIHN2U2Nyb2xsZXIuZmFjdG9yeSlcbiAgLmNvbnRyb2xsZXIoJ3N2U2Nyb2xsZXJDdHJsJywgc3ZTY3JvbGxlckN0cmwpXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzY3JvbGxlcihzaXplLCBtb2RlLCAkc2Nyb2xsZXIpIHtcbiAgJHNjcm9sbGVyID0gJHNjcm9sbGVyIHx8IGFuZ3VsYXIuZWxlbWVudCgnPGRpdj48L2Rpdj4nKTtcblxuICBsZXQgY3NzID0ge1xuICAgIG9wYWNpdHk6IDAsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgd2lkdGg6ICcxcHgnLFxuICAgIGhlaWdodDogc2l6ZSArICdweCdcbiAgfTtcblxuICBpZiAobW9kZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgY3NzLndpZHRoID0gc2l6ZSArICdweCc7XG4gICAgY3NzLmhlaWdodCA9ICcxcHgnO1xuICB9XG5cbiAgJHNjcm9sbGVyLmNzcyhjc3MpO1xuICByZXR1cm4gJHNjcm9sbGVyO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mgc3ZTY3JvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzdHJpY3QgPSAnRSc7XG4gICAgdGhpcy5jb250cm9sbGVyID0gJ3N2U2Nyb2xsZXJDdHJsIGFzIHN2Yyc7XG4gICAgdGhpcy5iaW5kVG9Db250cm9sbGVyID0ge1xuICAgICAgaXRlcmF0b3I6ICc8JyxcbiAgICAgIGNvbGxlY3Rpb246ICc9JyxcbiAgICAgIG1vZGU6ICc8JyxcbiAgICAgIHc6ICc8JyxcbiAgICAgIGg6ICc8JyxcbiAgICAgIHJvd3M6ICc8JyxcbiAgICAgIGNvbHM6ICc8JyxcbiAgICAgIGl0ZW1IZWlnaHQ6ICc8JyxcbiAgICAgIGl0ZW1XaWR0aDogJzwnLFxuICAgICAgaW5maW5pdGVTY3JvbGw6ICcmJ1xuICAgIH07XG4gICAgdGhpcy50cmFuc2NsdWRlID0gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBmYWN0b3J5KCkge1xuICAgIHN2U2Nyb2xsZXIuaW5zdGFuY2UgPSBuZXcgc3ZTY3JvbGxlcigpO1xuICAgIHJldHVybiBzdlNjcm9sbGVyLmluc3RhbmNlO1xuICB9XG5cbn1cblxuc3ZTY3JvbGxlci5mYWN0b3J5LiRpbmplY3QgPSBbXTtcbiIsImltcG9ydCBDb25maWcgZnJvbSAnLi9Db25maWcnO1xuaW1wb3J0IHtlcnJvcn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2Nyb2xsZXIgZnJvbSAnLi9zY3JvbGxlcic7XG5jb25zdCBSRU1PVkVfSU5URVJWQUwgPSAzMDA7XG5jb25zdCBWSVNJQklMSVRZX1RJTUUgPSAxO1xuY29uc3QgUkVQQUlOVF9XQUlUID0gMjAwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdlNjcm9sbGVyQ3RybCgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlLCAkaW50ZXJ2YWwsICR0aW1lb3V0LCBzdlNjcm9sbGVyU3J2Yykge1xuICBsZXQgY3RybCA9IHRoaXM7XG4gIGN0cmwuY29uZmlnID0gbmV3IENvbmZpZygpO1xuICBjdHJsLm5hbWVzcGFjZSA9ICRhdHRycy5pZCA/ICRhdHRycy5pZCArICc6JyA6ICcnO1xuICBjdHJsLmluZmluaXRlU2Nyb2xsID0gdGhpcy5pbmZpbml0ZVNjcm9sbDtcblxuICBpbml0aWFsaXplKGN0cmwpO1xuXG4gICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uO1xuICB9LCAobiwgbykgPT4ge1xuICAgIGlmIChuICE9PSBvKSB7XG4gICAgICBjdHJsLmNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG4gICAgICBpbml0aWFsaXplKGN0cmwpO1xuICAgICAgb25TY3JvbGxIYW5kbGVyKCk7XG4gICAgfVxuICB9KVxuXG4gIHN2U2Nyb2xsZXJTcnZjLnN1YnNjcmliZShjdHJsLm5hbWVzcGFjZSArICdzY3JvbGxUb0VsZW1lbnQnLCBzY3JvbGxUb0VsZW1lbnQpO1xuICBzdlNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAnc2Nyb2xsVG9WaWV3Jywgc2Nyb2xsVG9WaWV3KTtcbiAgc3ZTY3JvbGxlclNydmMuc3Vic2NyaWJlKGN0cmwubmFtZXNwYWNlICsgJ3Jlc2V0JywgcmVzZXQpO1xuICBzdlNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAnaXNSZWFkeScsIGlzUmVhZHkpO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoaSkge1xuICAgIGxldCAkaXRlbSA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdj48L2Rpdj4nKTtcbiAgICBsZXQgY3NzID0ge1xuICAgICAgaGVpZ2h0OiBjdHJsLml0ZW1IZWlnaHQgKyAncHgnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAoaSAqIGN0cmwuaXRlbUhlaWdodCkgKyAncHgnLFxuICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbidcbiAgICB9XG4gICAgaWYgKGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBjc3MuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgY3NzWydtaW4taGVpZ2h0J10gPSAnMTAwJSc7XG4gICAgICBkZWxldGUgY3NzLnRvcDtcbiAgICAgIGNzcy5sZWZ0ID0gKGkgKiBjdHJsLml0ZW1XaWR0aCkgKyAncHgnO1xuICAgICAgY3NzLndpZHRoID0gY3RybC5pdGVtV2lkdGggKyAncHgnO1xuICAgIH1cblxuICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykge1xuICAgICAgbGV0IGNvbCA9IDA7XG4gICAgICBsZXQgcm93ID0gcGFyc2VJbnQoaSAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgIGNvbCA9IGkgLSAoY3RybC50b3RhbENvbHMgKiByb3cpO1xuICAgICAgY3NzLnRvcCA9IHJvdyAqIGN0cmwuaXRlbUhlaWdodCArICdweCc7XG4gICAgICBjc3MubGVmdCA9IChjb2wgKiBjdHJsLml0ZW1XaWR0aCkgKyAncHgnO1xuICAgICAgY3NzLndpZHRoID0gY3RybC5pdGVtV2lkdGggKyAncHgnO1xuICAgICAgY3NzWydtaW4taGVpZ2h0J10gPSBjdHJsLml0ZW1IZWlnaHQgKyAncHgnO1xuICAgIH1cbiAgICAkaXRlbS5jc3MoY3NzKTtcbiAgICAkaXRlbS5hZGRDbGFzcyhjdHJsLm1vZGUgPT09ICdob3Jpem9udGFsJyA/ICdzLXZjb2wnIDogJ3MtdnJvdycpO1xuICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykgJGl0ZW0uYWRkQ2xhc3MoJ3MtdmNvbCcpO1xuICAgICR0cmFuc2NsdWRlKChlbCwgc2NvcGUpID0+IHtcbiAgICAgIHNjb3BlW2N0cmwuaXRlcmF0b3JdID0gY3RybC5jb2xsZWN0aW9uW2ldO1xuICAgICAgJGl0ZW0uYXBwZW5kKGVsKTtcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHskaXRlbS5jc3Moe3Zpc2liaWxpdHk6ICd2aXNpYmxlJ30pfSwgVklTSUJJTElUWV9USU1FKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCRpdGVtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoY29uZmlnID0ge30pIHtcbiAgICBsZXQgcGFyZW50ID0gJGVsZW1lbnQucGFyZW50KClbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY3RybC5wYXJlbnREaW1zID0ge1xuICAgICAgaGVpZ2h0OiBwYXJlbnQuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHBhcmVudC53aWR0aFxuICAgIH07XG4gICAgT2JqZWN0LmFzc2lnbihjdHJsLCBjb25maWcpO1xuICAgIE9iamVjdC5hc3NpZ24oY3RybCwgY3RybC5jb25maWcuaW5pdGlhbGl6ZShjdHJsKSk7XG4gICAgLy8gY29uc29sZS5sb2coXCJjdHJsXCIsIGN0cmwpO1xuICAgIGlmICgkZWxlbWVudC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkgJGVsZW1lbnQuYXBwZW5kKGN0cmwuJGNvbnRhaW5lcik7XG4gICAgLy8gY29uc29sZS5sb2coXCJjdHJsLiRjb250YWluZXJcIiwgY3RybC4kY29udGFpbmVyKTtcbiAgICBjdHJsLiRjb250YWluZXJcbiAgICAgIC51bmJpbmQoJ3Njcm9sbCcpXG4gICAgICAudW5iaW5kKCdyZXNpemUnKVxuICAgICAgLmJpbmQoJ3Njcm9sbCcsIG9uU2Nyb2xsSGFuZGxlcilcbiAgICAgIC5iaW5kKCdyZXNpemUnLCByZXNldCk7XG4gICAgLy8gY29uc29sZS5sb2coXCJjdHJsLiRjb250YWluZXJcIiwgY3RybC4kY29udGFpbmVyKTtcbiAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApLnRoZW4obW9kZSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbHplJywgY3RybC5uYW1lc3BhY2UgKyAncmVhZHknKTtcbiAgICAgIHN2U2Nyb2xsZXJTcnZjLnB1Ymxpc2goY3RybC5uYW1lc3BhY2UgKyAncmVhZHknLCB0cnVlKTtcbiAgICB9KTtcblxuICAgICRpbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoRGF0ZS5ub3coKSAtIGN0cmwubGFzdFNjcm9sbGVkID4gUkVQQUlOVF9XQUlUKSB7XG4gICAgICAgIGxldCAkYmFkTm9kZXMgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcm0tbm9kZT1cIicgKyBjdHJsLmJhZE5vZGVNYXJrZXIgKyAnXCJdJykpO1xuICAgICAgICAkYmFkTm9kZXMucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSwgUkVNT1ZFX0lOVEVSVkFMKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU2Nyb2xsSGFuZGxlcigpIHtcbiAgICBsZXQgdGFyZ2V0ID0gY3RybC4kY29udGFpbmVyWzBdO1xuICAgIGxldCBmaXJzdCwgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wO1xuXG4gICAgc3dpdGNoKGN0cmwubW9kZSkge1xuICAgICAgY2FzZSAnaG9yaXpvbnRhbCc6XG4gICAgICAgIHNjcm9sbExlZnQgPSB0YXJnZXQuc2Nyb2xsTGVmdDtcbiAgICAgICAgaWYgKChNYXRoLmFicyhzY3JvbGxMZWZ0IC0gY3RybC5sYXN0UmVwYWludFgpID4gY3RybC5tYXhCdWZmZXIpIHx8IHNjcm9sbExlZnQgPT09IDApIHtcbiAgICAgICAgICBmaXJzdCA9IHBhcnNlSW50KHNjcm9sbExlZnQgLyBjdHJsLml0ZW1XaWR0aCkgLSBjdHJsLnNjcmVlbkl0ZW1zTGVuO1xuICAgICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgZmlyc3QgPCAwID8gMCA6IGZpcnN0KTtcbiAgICAgICAgICBjdHJsLmxhc3RSZXBhaW50WCA9IHNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdncmlkJzpcbiAgICAgICAgc2Nyb2xsVG9wID0gdGFyZ2V0LnNjcm9sbFRvcDtcbiAgICAgICAgY29uc29sZS5sb2coXCJzY3JvbGxUb3BcIiwgc2Nyb2xsVG9wLCAnIGN0cmwubGFzdFJlcGFpbnRZJywgY3RybC5sYXN0UmVwYWludFksICcgY3RybC5tYXhCdWZmZXIgJywgY3RybC5tYXhCdWZmZXIpO1xuICAgICAgICBpZiAoKE1hdGguYWJzKHNjcm9sbFRvcCAtIGN0cmwubGFzdFJlcGFpbnRZKSA+IGN0cmwubWF4QnVmZmVyKSB8fCBzY3JvbGxUb3AgPT09IDApIHtcbiAgICAgICAgICBmaXJzdCA9IHBhcnNlSW50KHNjcm9sbFRvcCAvIGN0cmwuaXRlbUhlaWdodCAqIGN0cmwudG90YWxDb2xzKSAtIGN0cmwuc2NyZWVuSXRlbXNMZW47XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmaXJzdFwiLCBmaXJzdCwgXCJzY3JlZW5JdGVtc0xlbiBcIiwgY3RybC5zY3JlZW5JdGVtc0xlbik7XG4gICAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBmaXJzdCA8IDAgPyAwIDogZmlyc3QpO1xuICAgICAgICAgIGN0cmwubGFzdFJlcGFpbnRZID0gc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2Nyb2xsVG9wID0gdGFyZ2V0LnNjcm9sbFRvcDtcbiAgICAgICAgaWYgKChNYXRoLmFicyhzY3JvbGxUb3AgLSBjdHJsLmxhc3RSZXBhaW50WSkgPiBjdHJsLm1heEJ1ZmZlcikgfHwgc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICAgICAgZmlyc3QgPSBwYXJzZUludChzY3JvbGxUb3AgLyBjdHJsLml0ZW1IZWlnaHQpIC0gY3RybC5zY3JlZW5JdGVtc0xlbjtcbiAgICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGZpcnN0IDwgMCA/IDAgOiBmaXJzdCk7XG4gICAgICAgICAgY3RybC5sYXN0UmVwYWludFkgPSBzY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjdHJsLmxhc3RTY3JvbGxlZCA9IERhdGUubm93KCk7XG4gICAgdGFyZ2V0LnByZXZlbnREZWZhdWx0ICYmIHRhcmdldC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQ2h1bmsoJG5vZGUsIGZyb20pIHtcbiAgICBsZXQgcHJvbWlzZXMgPSBbXTtcbiAgICBsZXQgZmluYWxJdGVtID0gZnJvbSArIGN0cmwuY2FjaGVkSXRlbXNMZW4gKiAzO1xuICAgIGxldCB0b3RhbEVsZW1lbnRzID0gY3RybC5tb2RlID09PSAnaG9yaXpvbnRhbCcgPyBjdHJsLnRvdGFsQ29scyA6IGN0cmwubW9kZSA9PT0gJ2dyaWQnID8gY3RybC50b3RhbENvbHMgKiBjdHJsLnRvdGFsUm93cyA6IGN0cmwudG90YWxSb3dzO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiZnJvbVwiLCBmcm9tLCBcIiBmaW5hbEl0ZW0gXCIsIGZpbmFsSXRlbSwgXCIgdG90YWxFbGVtZW50cyBcIiwgdG90YWxFbGVtZW50cyk7XG4gICAgaWYgKGZpbmFsSXRlbSA+IHRvdGFsRWxlbWVudHMpIGZpbmFsSXRlbSA9IHRvdGFsRWxlbWVudHM7XG4gICAgbGV0ICRmcmFnbWVudCA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpO1xuICAgIGZvciAodmFyIGkgPSBmcm9tOyBpIDwgZmluYWxJdGVtOyBpKyspIHtcbiAgICAgIHByb21pc2VzLnB1c2goY3JlYXRlRWxlbWVudChpKSk7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhbmQgbWFyayBvYnNvbGV0ZSBub2RlcyBmb3IgZGVsZXRpb24uXG4gICAgbGV0ICRjaGlsZHJlbiA9ICRub2RlLmNoaWxkcmVuKCk7XG4gICAgZm9yICh2YXIgaiA9IDEsIGwgPSAkY2hpbGRyZW4ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICBsZXQgY2hpbGQgPSAkY2hpbGRyZW5bal07XG4gICAgICBjaGlsZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLXJtLW5vZGUnLCBjdHJsLmJhZE5vZGVNYXJrZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihyZXN1bHRzID0+IHtcbiAgICAgIHJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICAkZnJhZ21lbnQuYXBwZW5kKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiJGZyYWdtZW50XCIsICRmcmFnbWVudCk7XG4gICAgICAkbm9kZS5hcHBlbmQoJGZyYWdtZW50KTtcbiAgICAgIHJldHVybiBjdHJsLm1vZGU7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KGNvbmZpZykge1xuICAgIGluaXRpYWxpemUoY29uZmlnKTtcbiAgICBzY3JvbGxUb0VsZW1lbnQoMCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc1JlYWR5KCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdpc1JlYWR5OiAnLCBCb29sZWFuKGN0cmwuJGNvbnRhaW5lci5jaGlsZHJlbigpLmxlbmd0aCA+IDEpKTtcbiAgICBzdlNjcm9sbGVyU3J2Yy5wdWJsaXNoKGN0cmwubmFtZXNwYWNlICsgJ3JlYWR5JywgQm9vbGVhbihjdHJsLiRjb250YWluZXIuY2hpbGRyZW4oKS5sZW5ndGggPiAxKSk7XG4gIH1cblxuICBmdW5jdGlvbiBzY3JvbGxUb0VsZW1lbnQoaW5kZXgpIHtcbiAgICBpbmRleCA9IHBhcnNlSW50KGluZGV4LCAxMCkgfHwgMDtcbiAgICAvLyBjb25zb2xlLmxvZygnc2Nyb2xsVG9FbGVtZW50JywgaW5kZXgpO1xuICAgIHN3aXRjaChjdHJsLm1vZGUpIHtcbiAgICAgIGNhc2UgXCJncmlkXCI6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgKE1hdGguY2VpbChpbmRleCAvIGN0cmwudG90YWxDb2xzKSAtIDEpICogY3RybC50b3RhbENvbHMpO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gKE1hdGguY2VpbChpbmRleCAvIGN0cmwudG90YWxDb2xzKSAtIDEpICogY3RybC5pdGVtSGVpZ2h0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Jpem9udGFsXCI6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgaW5kZXgpO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCA9IGluZGV4ICogY3RybC5pdGVtV2lkdGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBpbmRleCk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBpbmRleCAqIGN0cmwuaXRlbUhlaWdodDtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbFRvVmlldyh0b2tlbikge1xuICAgIGN0cmwuc2Nyb2xsVG9WaWV3ID0gdG9rZW47XG4gICAgc3dpdGNoKGN0cmwuc2Nyb2xsVG9WaWV3KSB7XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGN0cmwudG90YWxSb3dzKTtcbiAgICAgICAgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IHBhcnNlSW50KGN0cmwudG90YWxSb3dzICogY3RybC5pdGVtSGVpZ2h0LCAxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgLSBwYXJzZUludChjdHJsLml0ZW1XaWR0aCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4sIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgKyBwYXJzZUludChjdHJsLml0ZW1XaWR0aCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4sIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiZWdpbm5pbmcnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBjdHJsLnRvdGFsQ29scyk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC50b3RhbENvbHMgKiBjdHJsLml0ZW1XaWR0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cCc6XG4gICAgICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgLSBNYXRoLmNlaWwoY3RybC5pdGVtSGVpZ2h0ICogY3RybC5zY3JlZW5JdGVtc0xlbiAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgICAgZWxzZSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCAtIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCArIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuIC8gY3RybC50b3RhbENvbHMpO1xuICAgICAgICBlbHNlIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wICsgTWF0aC5jZWlsKGN0cmwuaXRlbUhlaWdodCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxufVxuXG5zdlNjcm9sbGVyQ3RybC4kaW5qZWN0ID0gW1xuICAnJHNjb3BlJyxcbiAgJyRlbGVtZW50JyxcbiAgJyRhdHRycycsXG4gICckdHJhbnNjbHVkZScsXG4gICckaW50ZXJ2YWwnLFxuICAnJHRpbWVvdXQnLFxuICAnc3ZTY3JvbGxlclNydmMnXG5dO1xuIiwibGV0IHRvcGljcyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWRkVG9waWModG9waWMpIHtcbiAgICBpZiAoIXRvcGljc1t0b3BpY10pIHRvcGljc1t0b3BpY10gPSBbXTtcbiAgfSxcblxuICBkZWxUb3BpYyh0b3BpYykge1xuICAgIGlmICh0b3BpY3NbdG9waWNdKSB7XG4gICAgICB0b3BpY3NbdG9waWNdLmZvckVhY2goc3Vic2NyaWJlciA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgfSk7XG4gICAgICBkZWxldGUgdG9waWNzW3RvcGljXTtcbiAgICB9XG4gIH0sXG5cbiAgcHVibGlzaCh0b3BpYywgZGF0YSkge1xuICAgIGlmICghdG9waWNzW3RvcGljXSB8fCB0b3BpY3NbdG9waWNdLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICB0b3BpY3NbdG9waWNdLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgbGlzdGVuZXIoZGF0YSB8fCB7fSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3Vic2NyaWJlKHRvcGljLCBsaXN0ZW5lcikge1xuICAgIGlmICghdG9waWNzW3RvcGljXSkgdG9waWNzW3RvcGljXSA9IFtdO1xuICAgIGxldCBjdXJyTGlzdGVuZXIgPSB0b3BpY3NbdG9waWNdLmZpbmQoKGxpc3RucikgPT4gbGlzdG5yID09PSBsaXN0ZW5lcik7XG4gICAgaWYgKCFjdXJyTGlzdGVuZXIpIHRvcGljc1t0b3BpY10ucHVzaChsaXN0ZW5lcik7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJbnQodmFsKSB7XG4gIGlmICgvXihcXC18XFwrKT8oWzAtOV0rfEluZmluaXR5KSQvLnRlc3QodmFsKSkgcmV0dXJuIE51bWJlcih2YWwpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdXVpZChzaG9ydCkge1xuICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBsZXQgdXVpZFN0cmluZyA9IHNob3J0ID8gJzR4eHgteHh4eHh4JyA6ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xuICBsZXQgdXVpZCA9IHV1aWRTdHJpbmcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgbGV0IHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICByZXR1cm4gKGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xuICB9KTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCB7XG4gIGVycm9yLFxuICBmaWx0ZXJJbnQsXG4gIHV1aWRcbn07XG4iXX0=
