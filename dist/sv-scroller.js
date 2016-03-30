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

function svScrollerCtrl($scope, $element, $attrs, $transclude, $interval, $timeout, svScrollerSrvc) {
  var _this = this;

  var ctrl = {};
  ctrl.config = new _Config2.default();
  ctrl.namespace = $attrs.id ? $attrs.id + ':' : '';
  ctrl.infiniteScroll = this.infiniteScroll;

  $timeout(function () {
    var parent = $element.parent()[0].getBoundingClientRect();
    _this.parentDims = {
      height: parent.height,
      width: parent.width
    };

    initialize(_this);
  }, 200);

  $scope.$watchCollection(function () {
    return _this.collection;
  }, function (n, o) {
    if (n !== o) {
      ctrl.collection = _this.collection;
      initialize(_this);
      onScrollHandler();
    }
  });

  function createElement(i) {
    var $item = angular.element('<div></div>');
    var css = {
      height: ctrl.itemHeight + 'px',
      width: '100%',
      position: 'absolute',
      top: i * ctrl.itemHeight + 'px'
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
    // setTimeout(() => {$item.css({visibility: 'visible'})}, 10);
    return Promise.resolve($item);
  }

  function initialize(config) {
    Object.assign(ctrl, ctrl.config.initialize(config));
    if ($element.children().length === 0) $element.append(ctrl.$container);
    ctrl.$container.unbind('scroll');
    ctrl.$container.bind('scroll', onScrollHandler);
    ctrl.$container.unbind('resize');
    ctrl.$container.bind('resize', reset);
    renderChunk(ctrl.$container, 0);
    svScrollerSrvc.subscribe(ctrl.namespace + 'scrollToElement', scrollToElement);
    svScrollerSrvc.subscribe(ctrl.namespace + 'scrollToView', scrollToView);
    svScrollerSrvc.subscribe(ctrl.namespace + 'reset', reset);
    $interval(function () {
      if (Date.now() - ctrl.lastScrolled > 200) {
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
        // console.log("scrollTop", scrollTop, ' ctrl.lastRepaintY', ctrl.lastRepaintY, ' ctrl.maxBuffer ', ctrl.maxBuffer);
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

    Promise.all(promises).then(function (results) {
      results.forEach(function (result) {
        $fragment.append(result);
      });
      $node.append($fragment);
    });
  }

  function reset(config) {
    initialize(config);
    scrollToElement(0);
  }

  function scrollToElement(index) {
    index = parseInt(index, 10) || 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29uZmlnLmpzIiwic3JjL2NyZWF0ZUNvbnRhaW5lci5qcyIsInNyYy9uZy13cmFwcGVyLmpzIiwic3JjL3Njcm9sbGVyLmpzIiwic3JjL3N2U2Nyb2xsZXIuZGlyZWN0aXZlLmpzIiwic3JjL3N2U2Nyb2xsZXJDdHJsLmpzIiwic3JjL3N2U2Nyb2xsZXJTcnZjLnNlcnZpY2UuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUEsSUFBTSx3QkFBd0IsQ0FBeEI7OztBQUlKLG9CQUFjOzs7QUFDWixTQUFLLFNBQUwsR0FBaUIsQ0FBakIsQ0FEWTtBQUVaLFNBQUssU0FBTCxHQUFpQixDQUFqQixDQUZZO0FBR1osU0FBSyxZQUFMLEdBQW9CLENBQXBCLENBSFk7QUFJWixTQUFLLFlBQUwsR0FBb0IsQ0FBcEIsQ0FKWTtBQUtaLFNBQUssWUFBTCxHQUFvQixDQUFwQixDQUxZO0FBTVosU0FBSyxhQUFMLEdBQXFCLGlCQUFLLElBQUwsQ0FBckIsQ0FOWTtHQUFkOzs7OytCQVNXLE1BQU07QUFDZixVQUFJLFNBQVMsRUFBVCxDQURXO0FBRWYsYUFBTyxNQUFQLENBQWMsTUFBZCxFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUZlO0FBR2YsV0FBSyxDQUFMLEdBQVMsT0FBTyxDQUFQLEdBQVcsc0JBQVUsT0FBTyxDQUFQLENBQXJCLEdBQWlDLE9BQU8sVUFBUCxDQUFrQixLQUFsQixDQUgzQjtBQUlmLFdBQUssQ0FBTCxHQUFTLE9BQU8sQ0FBUCxHQUFXLHNCQUFVLE9BQU8sQ0FBUCxDQUFyQixHQUFpQyxPQUFPLFVBQVAsQ0FBa0IsTUFBbEIsQ0FKM0I7QUFLZixXQUFLLEtBQUwsR0FBYSxLQUFLLENBQUwsR0FBUyxLQUFLLENBQUwsR0FBUyxJQUFULEdBQWdC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Q0FBeEI7O0FBSUEsU0FBUyxTQUFULENBQW1CLEdBQW5CLEVBQXdCO0FBQ3RCLE1BQUksOEJBQThCLElBQTlCLENBQW1DLEdBQW5DLENBQUosRUFBNkMsT0FBTyxPQUFPLEdBQVAsQ0FBUCxDQUE3QztBQUNBLFNBQU8sSUFBUCxDQUZzQjtDQUF4Qjs7QUFLQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCO0FBQ25CLE1BQUksSUFBSSxJQUFJLElBQUosR0FBVyxPQUFYLEVBQUosQ0FEZTtBQUVuQixNQUFJLGFBQWEsUUFBUSxhQUFSLEdBQXdCLHNDQUF4QixDQUZFO0FBR25CLE1BQUksT0FBTyxXQUFXLE9BQVgsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBUyxDQUFULEVBQVk7QUFDakQsUUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQUwsS0FBZ0IsRUFBaEIsQ0FBTCxHQUEyQixFQUEzQixHQUFnQyxDQUFoQyxDQUR5QztBQUVqRCxRQUFJLEtBQUssS0FBTCxDQUFXLElBQUksRUFBSixDQUFmLENBRmlEO0FBR2pELFdBQU8sQ0FBQyxLQUFLLEdBQUwsR0FBVyxDQUFYLEdBQWdCLElBQUksR0FBSixHQUFVLEdBQVYsQ0FBakIsQ0FBaUMsUUFBakMsQ0FBMEMsRUFBMUMsQ0FBUCxDQUhpRDtHQUFaLENBQW5DLENBSGU7QUFRbkIsU0FBTyxJQUFQLENBUm1CO0NBQXJCOztRQVlFO1FBQ0E7UUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2Vycm9yLCBmaWx0ZXJJbnQsIHV1aWR9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGNyZWF0ZUNvbnRhaW5lciBmcm9tICcuL2NyZWF0ZUNvbnRhaW5lcic7XG5pbXBvcnQgc2Nyb2xsZXIgZnJvbSAnLi9zY3JvbGxlcic7XG5cbmNvbnN0IENBQ0hFRF9JVEVNU19NVUxUSVBMRSA9IDE7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRvdGFsUm93cyA9IDA7XG4gICAgdGhpcy50b3RhbENvbHMgPSAwO1xuICAgIHRoaXMubGFzdFJlcGFpbnRZID0gMDtcbiAgICB0aGlzLmxhc3RSZXBhaW50WCA9IDA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsZWQgPSAwO1xuICAgIHRoaXMuYmFkTm9kZU1hcmtlciA9IHV1aWQodHJ1ZSk7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmYpIHtcbiAgICBsZXQgY29uZmlnID0ge307XG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIHRoaXMsIGNvbmYpO1xuICAgIHRoaXMudyA9IGNvbmZpZy53ID8gZmlsdGVySW50KGNvbmZpZy53KSA6IGNvbmZpZy5wYXJlbnREaW1zLndpZHRoOztcbiAgICB0aGlzLmggPSBjb25maWcuaCA/IGZpbHRlckludChjb25maWcuaCkgOiBjb25maWcucGFyZW50RGltcy5oZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMudyA/IHRoaXMudyArICdweCcgOiAnMTAwJSc7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmggPyB0aGlzLmggKyAncHgnIDogJzEwMCUnO1xuICAgIHRoaXMubW9kZSA9IGNvbmZpZy5tb2RlIHx8ICd2ZXJ0aWNhbCc7XG4gICAgaWYgKHRoaXMubW9kZSAhPT0gJ3ZlcnRpY2FsJyAmJiB0aGlzLm1vZGUgIT09ICdob3Jpem9udGFsJyAmJiB0aGlzLm1vZGUgIT09ICdncmlkJykgZXJyb3IoJ3dyb25nIHR5cGUnKTtcbiAgICB0aGlzLml0ZW1XaWR0aCA9IGNvbmZpZy5pdGVtV2lkdGg7XG4gICAgdGhpcy5pdGVtSGVpZ2h0ID0gY29uZmlnLml0ZW1IZWlnaHQ7XG4gICAgdGhpcy5pdGVyYXRvciA9IGNvbmZpZy5pdGVyYXRvciB8fCAnaXRlbSc7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29uZmlnLmNvbGxlY3Rpb24gfHwgW107XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2hvcml6b250YWwnKSBjb25maWd1cmVIb3Jpem9udGFsTW9kZSh0aGlzKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSAndmVydGljYWwnKSBjb25maWd1cmVWZXJ0aWNhbE1vZGUodGhpcyk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2dyaWQnKSBjb25maWd1cmVHcmlkTW9kZSh0aGlzKTtcbiAgICB0aGlzLiRjb250YWluZXIuZW1wdHkoKS5hcHBlbmQodGhpcy4kc2Nyb2xsZXIpO1xuICAgIHRoaXMuY2FjaGVkSXRlbXNMZW4gPSB0aGlzLnNjcmVlbkl0ZW1zTGVuICogQ0FDSEVEX0lURU1TX01VTFRJUExFO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUhvcml6b250YWxNb2RlKG9iaikge1xuICBvYmoudG90YWxDb2xzID0gZmlsdGVySW50KG9iai5jb2xzKTtcbiAgaWYgKCFvYmoudG90YWxDb2xzKSBvYmoudG90YWxDb2xzID0gb2JqLmNvbGxlY3Rpb24ubGVuZ3RoO1xuICBvYmouaXRlbVdpZHRoID0gZmlsdGVySW50KG9iai5pdGVtV2lkdGgpO1xuICBpZiAoIW9iai5pdGVtV2lkdGgpIGVycm9yKFwiJ2l0ZW0td2lkdGgnIHJlcXVpcmVkIGluIGhvcml6b250YWwgbW9kZVwiKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai53IC8gb2JqLml0ZW1XaWR0aCk7XG4gIG9iai5tYXhCdWZmZXIgPSBNYXRoLmNlaWwob2JqLnNjcmVlbkl0ZW1zTGVuICogb2JqLml0ZW1XaWR0aCk7XG4gIG9iai4kc2Nyb2xsZXIgPSBzY3JvbGxlcihvYmouaXRlbVdpZHRoICogb2JqLnRvdGFsQ29scywgb2JqLm1vZGUsIG9iai4kc2Nyb2xsZXIpO1xuICBvYmouJGNvbnRhaW5lciA9IG9iai4kY29udGFpbmVyIHx8IGNyZWF0ZUNvbnRhaW5lcihvYmoud2lkdGgsIG9iai5oZWlnaHQsIG9iai5tb2RlKTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlVmVydGljYWxNb2RlKG9iaikge1xuICBvYmoudG90YWxSb3dzID0gZmlsdGVySW50KG9iai5yb3dzKTtcbiAgb2JqLml0ZW1IZWlnaHQgPSBmaWx0ZXJJbnQob2JqLml0ZW1IZWlnaHQpO1xuICBpZiAoIW9iai50b3RhbFJvd3MpIG9iai50b3RhbFJvd3MgPSBvYmouY29sbGVjdGlvbi5sZW5ndGg7XG4gIGlmICghb2JqLml0ZW1IZWlnaHQpIGVycm9yKFwiJ2l0ZW0taGVpZ2h0JyByZXF1aXJlZCBpbiB2ZXJ0aWNhbCBtb2RlXCIpO1xuICBvYmouc2NyZWVuSXRlbXNMZW4gPSBNYXRoLmNlaWwob2JqLmggLyBvYmouaXRlbUhlaWdodCk7XG4gIG9iai5tYXhCdWZmZXIgPSBNYXRoLmNlaWwob2JqLnNjcmVlbkl0ZW1zTGVuICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVHcmlkTW9kZShvYmopIHtcbiAgb2JqLnRvdGFsQ29scyA9IGZpbHRlckludChvYmouY29scyk7XG4gIG9iai50b3RhbFJvd3MgPSBmaWx0ZXJJbnQob2JqLnJvd3MpO1xuICBvYmouaXRlbUhlaWdodCA9IGZpbHRlckludChvYmouaXRlbUhlaWdodCk7XG4gIG9iai5pdGVtV2lkdGggPSBmaWx0ZXJJbnQob2JqLml0ZW1XaWR0aCk7XG4gIGlmICghb2JqLml0ZW1IZWlnaHQpIGVycm9yKFwiJ2l0ZW0taGVpZ2h0JyByZXF1aXJlZCBpbiBncmQgbW9kZVwiKTtcbiAgaWYgKCFvYmouaXRlbVdpZHRoKSBlcnJvcihcIidpdGVtLXdpZHRoJyByZXF1aXJlZCBpbiBncmlkIG1vZGVcIik7XG4gIGlmICghb2JqLnRvdGFsQ29scykgb2JqLnRvdGFsQ29scyA9IE1hdGguZmxvb3IoKG9iai53IC8gb2JqLml0ZW1XaWR0aCkpO1xuICBpZiAoIW9iai50b3RhbFJvd3MpIG9iai50b3RhbFJvd3MgPSBNYXRoLmNlaWwob2JqLmNvbGxlY3Rpb24ubGVuZ3RoIC8gb2JqLnRvdGFsQ29scyk7XG4gIC8vIGNvbnNvbGUubG9nKFwib2JqLnRvdGFsQ29sc1wiLCBvYmoudG90YWxDb2xzKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai5oIC8gb2JqLml0ZW1IZWlnaHQpICogb2JqLnRvdGFsQ29scztcbiAgLy8gY29uc29sZS5sb2coXCJvYmouc2NyZWVuSXRlbXNMZW5cIiwgb2JqLnNjcmVlbkl0ZW1zTGVuKTtcbiAgb2JqLm1heEJ1ZmZlciA9IE1hdGguY2VpbChvYmouc2NyZWVuSXRlbXNMZW4gLyBvYmoudG90YWxDb2xzICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ29udGFpbmVyKHcsIGgsIG1vZGUpIHtcbiAgbGV0ICRjID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICBsZXQgY3NzID0ge1xuICAgIHdpZHRoOiB3LFxuICAgIGhlaWdodDogaCxcbiAgICAnb3ZlcmZsb3cteSc6ICdhdXRvJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgcGFkZGluZzogMFxuICB9XG4gIGlmIChtb2RlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBkZWxldGUgY3NzWydvdmVyZmxvdy15J107XG4gICAgY3NzWydvdmVyZmxvdy14J10gPSAnYXV0byc7XG4gIH1cbiAgJGMuY3NzKGNzcyk7XG4gICRjLmFkZENsYXNzKCdzLWNvbnRhaW5lcicpXG4gIHJldHVybiAkYztcbn1cbiIsImxldCBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5pbXBvcnQgc3ZTY3JvbGxlclNydmMgZnJvbSAnLi9zdlNjcm9sbGVyU3J2Yy5zZXJ2aWNlJztcbmltcG9ydCBzdlNjcm9sbGVyIGZyb20gXCIuL3N2U2Nyb2xsZXIuZGlyZWN0aXZlXCI7XG5pbXBvcnQgc3ZTY3JvbGxlckN0cmwgZnJvbSAnLi9zdlNjcm9sbGVyQ3RybCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzdi1zY3JvbGxlcicsIFtdKVxuICAuZmFjdG9yeSgnc3ZTY3JvbGxlclNydmMnLCAoKSA9PiBzdlNjcm9sbGVyU3J2YylcbiAgLmRpcmVjdGl2ZSgnc3ZTY3JvbGxlcicsIHN2U2Nyb2xsZXIuZmFjdG9yeSlcbiAgLmNvbnRyb2xsZXIoJ3N2U2Nyb2xsZXJDdHJsJywgc3ZTY3JvbGxlckN0cmwpXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzY3JvbGxlcihzaXplLCBtb2RlLCAkc2Nyb2xsZXIpIHtcbiAgJHNjcm9sbGVyID0gJHNjcm9sbGVyIHx8IGFuZ3VsYXIuZWxlbWVudCgnPGRpdj48L2Rpdj4nKTtcblxuICBsZXQgY3NzID0ge1xuICAgIG9wYWNpdHk6IDAsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgd2lkdGg6ICcxcHgnLFxuICAgIGhlaWdodDogc2l6ZSArICdweCdcbiAgfTtcblxuICBpZiAobW9kZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgY3NzLndpZHRoID0gc2l6ZSArICdweCc7XG4gICAgY3NzLmhlaWdodCA9ICcxcHgnO1xuICB9XG5cbiAgJHNjcm9sbGVyLmNzcyhjc3MpO1xuICByZXR1cm4gJHNjcm9sbGVyO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mgc3ZTY3JvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzdHJpY3QgPSAnRSc7XG4gICAgdGhpcy5jb250cm9sbGVyID0gJ3N2U2Nyb2xsZXJDdHJsIGFzIHN2Yyc7XG4gICAgdGhpcy5iaW5kVG9Db250cm9sbGVyID0ge1xuICAgICAgaXRlcmF0b3I6ICc8JyxcbiAgICAgIGNvbGxlY3Rpb246ICc9JyxcbiAgICAgIG1vZGU6ICc8JyxcbiAgICAgIHc6ICc8JyxcbiAgICAgIGg6ICc8JyxcbiAgICAgIHJvd3M6ICc8JyxcbiAgICAgIGNvbHM6ICc8JyxcbiAgICAgIGl0ZW1IZWlnaHQ6ICc8JyxcbiAgICAgIGl0ZW1XaWR0aDogJzwnLFxuICAgICAgaW5maW5pdGVTY3JvbGw6ICcmJ1xuICAgIH07XG4gICAgdGhpcy50cmFuc2NsdWRlID0gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBmYWN0b3J5KCkge1xuICAgIHN2U2Nyb2xsZXIuaW5zdGFuY2UgPSBuZXcgc3ZTY3JvbGxlcigpO1xuICAgIHJldHVybiBzdlNjcm9sbGVyLmluc3RhbmNlO1xuICB9XG5cbn1cblxuc3ZTY3JvbGxlci5mYWN0b3J5LiRpbmplY3QgPSBbXTtcbiIsImltcG9ydCBDb25maWcgZnJvbSAnLi9Db25maWcnO1xuaW1wb3J0IHtlcnJvcn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2Nyb2xsZXIgZnJvbSAnLi9zY3JvbGxlcic7XG5jb25zdCBSRU1PVkVfSU5URVJWQUwgPSAzMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN2U2Nyb2xsZXJDdHJsKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRpbnRlcnZhbCwgJHRpbWVvdXQsIHN2U2Nyb2xsZXJTcnZjKSB7XG4gIGxldCBjdHJsID0ge307XG4gIGN0cmwuY29uZmlnID0gbmV3IENvbmZpZygpO1xuICBjdHJsLm5hbWVzcGFjZSA9ICRhdHRycy5pZCA/ICRhdHRycy5pZCArICc6JyA6ICcnO1xuICBjdHJsLmluZmluaXRlU2Nyb2xsID0gdGhpcy5pbmZpbml0ZVNjcm9sbDtcblxuICAkdGltZW91dCgoKSA9PiB7XG4gICAgbGV0IHBhcmVudCA9ICRlbGVtZW50LnBhcmVudCgpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMucGFyZW50RGltcyA9IHtcbiAgICAgIGhlaWdodDogcGFyZW50LmhlaWdodCxcbiAgICAgIHdpZHRoOiBwYXJlbnQud2lkdGhcbiAgICB9O1xuXG4gICAgaW5pdGlhbGl6ZSh0aGlzKTtcbiAgfSwgMjAwKVxuXG5cbiAgJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb247XG4gIH0sIChuLCBvKSA9PiB7XG4gICAgaWYgKG4gIT09IG8pIHtcbiAgICAgIGN0cmwuY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgIGluaXRpYWxpemUodGhpcyk7XG4gICAgICBvblNjcm9sbEhhbmRsZXIoKTtcbiAgICB9XG4gIH0pXG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpKSB7XG4gICAgbGV0ICRpdGVtID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICAgIGxldCBjc3MgPSB7XG4gICAgICBoZWlnaHQ6IGN0cmwuaXRlbUhlaWdodCArICdweCcsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6IChpICogY3RybC5pdGVtSGVpZ2h0KSArICdweCdcbiAgICB9XG4gICAgaWYgKGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBjc3MuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgY3NzWydtaW4taGVpZ2h0J10gPSAnMTAwJSc7XG4gICAgICBkZWxldGUgY3NzLnRvcDtcbiAgICAgIGNzcy5sZWZ0ID0gKGkgKiBjdHJsLml0ZW1XaWR0aCkgKyAncHgnO1xuICAgICAgY3NzLndpZHRoID0gY3RybC5pdGVtV2lkdGggKyAncHgnO1xuICAgIH1cblxuICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykge1xuICAgICAgbGV0IGNvbCA9IDA7XG4gICAgICBsZXQgcm93ID0gcGFyc2VJbnQoaSAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgIGNvbCA9IGkgLSAoY3RybC50b3RhbENvbHMgKiByb3cpO1xuICAgICAgY3NzLnRvcCA9IHJvdyAqIGN0cmwuaXRlbUhlaWdodCArICdweCc7XG4gICAgICBjc3MubGVmdCA9IChjb2wgKiBjdHJsLml0ZW1XaWR0aCkgKyAncHgnO1xuICAgICAgY3NzLndpZHRoID0gY3RybC5pdGVtV2lkdGggKyAncHgnO1xuICAgICAgY3NzWydtaW4taGVpZ2h0J10gPSBjdHJsLml0ZW1IZWlnaHQgKyAncHgnO1xuICAgIH1cblxuICAgICRpdGVtLmNzcyhjc3MpO1xuICAgICRpdGVtLmFkZENsYXNzKGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnID8gJ3MtdmNvbCcgOiAncy12cm93Jyk7XG4gICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSAkaXRlbS5hZGRDbGFzcygncy12Y29sJyk7XG4gICAgJHRyYW5zY2x1ZGUoKGVsLCBzY29wZSkgPT4ge1xuICAgICAgc2NvcGVbY3RybC5pdGVyYXRvcl0gPSBjdHJsLmNvbGxlY3Rpb25baV07XG4gICAgICAkaXRlbS5hcHBlbmQoZWwpO1xuICAgIH0pO1xuICAgIC8vIHNldFRpbWVvdXQoKCkgPT4geyRpdGVtLmNzcyh7dmlzaWJpbGl0eTogJ3Zpc2libGUnfSl9LCAxMCk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkaXRlbSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKGNvbmZpZykge1xuICAgIE9iamVjdC5hc3NpZ24oY3RybCwgY3RybC5jb25maWcuaW5pdGlhbGl6ZShjb25maWcpKTtcbiAgICBpZiAoJGVsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApICRlbGVtZW50LmFwcGVuZChjdHJsLiRjb250YWluZXIpO1xuICAgIGN0cmwuJGNvbnRhaW5lci51bmJpbmQoJ3Njcm9sbCcpO1xuICAgIGN0cmwuJGNvbnRhaW5lci5iaW5kKCdzY3JvbGwnLCBvblNjcm9sbEhhbmRsZXIpO1xuICAgIGN0cmwuJGNvbnRhaW5lci51bmJpbmQoJ3Jlc2l6ZScpO1xuICAgIGN0cmwuJGNvbnRhaW5lci5iaW5kKCdyZXNpemUnLCByZXNldCk7XG4gICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCAwKTtcbiAgICBzdlNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAnc2Nyb2xsVG9FbGVtZW50Jywgc2Nyb2xsVG9FbGVtZW50KTtcbiAgICBzdlNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAnc2Nyb2xsVG9WaWV3Jywgc2Nyb2xsVG9WaWV3KTtcbiAgICBzdlNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAncmVzZXQnLCByZXNldCk7XG4gICAgJGludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChEYXRlLm5vdygpIC0gY3RybC5sYXN0U2Nyb2xsZWQgPiAyMDApIHtcbiAgICAgICAgbGV0ICRiYWROb2RlcyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1ybS1ub2RlPVwiJyArIGN0cmwuYmFkTm9kZU1hcmtlciArICdcIl0nKSk7XG4gICAgICAgICRiYWROb2Rlcy5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9LCBSRU1PVkVfSU5URVJWQUwpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TY3JvbGxIYW5kbGVyKCkge1xuICAgIGxldCB0YXJnZXQgPSBjdHJsLiRjb250YWluZXJbMF07XG4gICAgbGV0IGZpcnN0LCBzY3JvbGxMZWZ0LCBzY3JvbGxUb3A7XG5cbiAgICBzd2l0Y2goY3RybC5tb2RlKSB7XG4gICAgICBjYXNlICdob3Jpem9udGFsJzpcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHRhcmdldC5zY3JvbGxMZWZ0O1xuICAgICAgICBpZiAoKE1hdGguYWJzKHNjcm9sbExlZnQgLSBjdHJsLmxhc3RSZXBhaW50WCkgPiBjdHJsLm1heEJ1ZmZlcikgfHwgc2Nyb2xsTGVmdCA9PT0gMCkge1xuICAgICAgICAgIGZpcnN0ID0gcGFyc2VJbnQoc2Nyb2xsTGVmdCAvIGN0cmwuaXRlbVdpZHRoKSAtIGN0cmwuc2NyZWVuSXRlbXNMZW47XG4gICAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBmaXJzdCA8IDAgPyAwIDogZmlyc3QpO1xuICAgICAgICAgIGN0cmwubGFzdFJlcGFpbnRYID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dyaWQnOlxuICAgICAgICBzY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNjcm9sbFRvcFwiLCBzY3JvbGxUb3AsICcgY3RybC5sYXN0UmVwYWludFknLCBjdHJsLmxhc3RSZXBhaW50WSwgJyBjdHJsLm1heEJ1ZmZlciAnLCBjdHJsLm1heEJ1ZmZlcik7XG4gICAgICAgIGlmICgoTWF0aC5hYnMoc2Nyb2xsVG9wIC0gY3RybC5sYXN0UmVwYWludFkpID4gY3RybC5tYXhCdWZmZXIpIHx8IHNjcm9sbFRvcCA9PT0gMCkge1xuICAgICAgICAgIGZpcnN0ID0gcGFyc2VJbnQoc2Nyb2xsVG9wIC8gY3RybC5pdGVtSGVpZ2h0ICogY3RybC50b3RhbENvbHMpIC0gY3RybC5zY3JlZW5JdGVtc0xlbjtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZpcnN0XCIsIGZpcnN0LCBcInNjcmVlbkl0ZW1zTGVuIFwiLCBjdHJsLnNjcmVlbkl0ZW1zTGVuKTtcbiAgICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGZpcnN0IDwgMCA/IDAgOiBmaXJzdCk7XG4gICAgICAgICAgY3RybC5sYXN0UmVwYWludFkgPSBzY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICBpZiAoKE1hdGguYWJzKHNjcm9sbFRvcCAtIGN0cmwubGFzdFJlcGFpbnRZKSA+IGN0cmwubWF4QnVmZmVyKSB8fCBzY3JvbGxUb3AgPT09IDApIHtcbiAgICAgICAgICBmaXJzdCA9IHBhcnNlSW50KHNjcm9sbFRvcCAvIGN0cmwuaXRlbUhlaWdodCkgLSBjdHJsLnNjcmVlbkl0ZW1zTGVuO1xuICAgICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgZmlyc3QgPCAwID8gMCA6IGZpcnN0KTtcbiAgICAgICAgICBjdHJsLmxhc3RSZXBhaW50WSA9IHNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN0cmwubGFzdFNjcm9sbGVkID0gRGF0ZS5ub3coKTtcbiAgICB0YXJnZXQucHJldmVudERlZmF1bHQgJiYgdGFyZ2V0LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJDaHVuaygkbm9kZSwgZnJvbSkge1xuICAgIGxldCBwcm9taXNlcyA9IFtdO1xuICAgIGxldCBmaW5hbEl0ZW0gPSBmcm9tICsgY3RybC5jYWNoZWRJdGVtc0xlbiAqIDM7XG4gICAgbGV0IHRvdGFsRWxlbWVudHMgPSBjdHJsLm1vZGUgPT09ICdob3Jpem9udGFsJyA/IGN0cmwudG90YWxDb2xzIDogY3RybC5tb2RlID09PSAnZ3JpZCcgPyBjdHJsLnRvdGFsQ29scyAqIGN0cmwudG90YWxSb3dzIDogY3RybC50b3RhbFJvd3M7XG4gICAgLy8gY29uc29sZS5sb2coXCJmcm9tXCIsIGZyb20sIFwiIGZpbmFsSXRlbSBcIiwgZmluYWxJdGVtLCBcIiB0b3RhbEVsZW1lbnRzIFwiLCB0b3RhbEVsZW1lbnRzKTtcbiAgICBpZiAoZmluYWxJdGVtID4gdG90YWxFbGVtZW50cykgZmluYWxJdGVtID0gdG90YWxFbGVtZW50cztcbiAgICBsZXQgJGZyYWdtZW50ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gICAgZm9yICh2YXIgaSA9IGZyb207IGkgPCBmaW5hbEl0ZW07IGkrKykge1xuICAgICAgcHJvbWlzZXMucHVzaChjcmVhdGVFbGVtZW50KGkpKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGFuZCBtYXJrIG9ic29sZXRlIG5vZGVzIGZvciBkZWxldGlvbi5cbiAgICBsZXQgJGNoaWxkcmVuID0gJG5vZGUuY2hpbGRyZW4oKTtcbiAgICBmb3IgKHZhciBqID0gMSwgbCA9ICRjaGlsZHJlbi5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgIGxldCBjaGlsZCA9ICRjaGlsZHJlbltqXTtcbiAgICAgIGNoaWxkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcm0tbm9kZScsIGN0cmwuYmFkTm9kZU1hcmtlcik7XG4gICAgfVxuXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgJGZyYWdtZW50LmFwcGVuZChyZXN1bHQpO1xuICAgICAgfSk7XG4gICAgICAkbm9kZS5hcHBlbmQoJGZyYWdtZW50KTtcbiAgICB9KTtcblxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQoY29uZmlnKSB7XG4gICAgaW5pdGlhbGl6ZShjb25maWcpO1xuICAgIHNjcm9sbFRvRWxlbWVudCgwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbFRvRWxlbWVudChpbmRleCkge1xuICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgsIDEwKSB8fCAwO1xuICAgIHN3aXRjaChjdHJsLm1vZGUpIHtcbiAgICAgIGNhc2UgXCJncmlkXCI6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgKE1hdGguY2VpbChpbmRleCAvIGN0cmwudG90YWxDb2xzKSAtIDEpICogY3RybC50b3RhbENvbHMpO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gKE1hdGguY2VpbChpbmRleCAvIGN0cmwudG90YWxDb2xzKSAtIDEpICogY3RybC5pdGVtSGVpZ2h0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Jpem9udGFsXCI6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgaW5kZXgpO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCA9IGluZGV4ICogY3RybC5pdGVtV2lkdGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBpbmRleCk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBpbmRleCAqIGN0cmwuaXRlbUhlaWdodDtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbFRvVmlldyh0b2tlbikge1xuICAgIGN0cmwuc2Nyb2xsVG9WaWV3ID0gdG9rZW47XG4gICAgc3dpdGNoKGN0cmwuc2Nyb2xsVG9WaWV3KSB7XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGN0cmwudG90YWxSb3dzKTtcbiAgICAgICAgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IHBhcnNlSW50KGN0cmwudG90YWxSb3dzICogY3RybC5pdGVtSGVpZ2h0LCAxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgLSBwYXJzZUludChjdHJsLml0ZW1XaWR0aCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4sIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgKyBwYXJzZUludChjdHJsLml0ZW1XaWR0aCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4sIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiZWdpbm5pbmcnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBjdHJsLnRvdGFsQ29scyk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC50b3RhbENvbHMgKiBjdHJsLml0ZW1XaWR0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cCc6XG4gICAgICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgLSBNYXRoLmNlaWwoY3RybC5pdGVtSGVpZ2h0ICogY3RybC5zY3JlZW5JdGVtc0xlbiAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgICAgZWxzZSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCAtIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCArIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuIC8gY3RybC50b3RhbENvbHMpO1xuICAgICAgICBlbHNlIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wICsgTWF0aC5jZWlsKGN0cmwuaXRlbUhlaWdodCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxufVxuXG5zdlNjcm9sbGVyQ3RybC4kaW5qZWN0ID0gW1xuICAnJHNjb3BlJyxcbiAgJyRlbGVtZW50JyxcbiAgJyRhdHRycycsXG4gICckdHJhbnNjbHVkZScsXG4gICckaW50ZXJ2YWwnLFxuICAnJHRpbWVvdXQnLFxuICAnc3ZTY3JvbGxlclNydmMnXG5dO1xuIiwibGV0IHRvcGljcyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWRkVG9waWModG9waWMpIHtcbiAgICBpZiAoIXRvcGljc1t0b3BpY10pIHRvcGljc1t0b3BpY10gPSBbXTtcbiAgfSxcblxuICBkZWxUb3BpYyh0b3BpYykge1xuICAgIGlmICh0b3BpY3NbdG9waWNdKSB7XG4gICAgICB0b3BpY3NbdG9waWNdLmZvckVhY2goc3Vic2NyaWJlciA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgfSk7XG4gICAgICBkZWxldGUgdG9waWNzW3RvcGljXTtcbiAgICB9XG4gIH0sXG5cbiAgcHVibGlzaCh0b3BpYywgZGF0YSkge1xuICAgIGlmICghdG9waWNzW3RvcGljXSB8fCB0b3BpY3NbdG9waWNdLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICB0b3BpY3NbdG9waWNdLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgbGlzdGVuZXIoZGF0YSB8fCB7fSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3Vic2NyaWJlKHRvcGljLCBsaXN0ZW5lcikge1xuICAgIGlmICghdG9waWNzW3RvcGljXSkgdG9waWNzW3RvcGljXSA9IFtdO1xuICAgIGxldCBjdXJyTGlzdGVuZXIgPSB0b3BpY3NbdG9waWNdLmZpbmQoKGxpc3RucikgPT4gbGlzdG5yID09PSBsaXN0ZW5lcik7XG4gICAgaWYgKCFjdXJyTGlzdGVuZXIpIHRvcGljc1t0b3BpY10ucHVzaChsaXN0ZW5lcik7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJbnQodmFsKSB7XG4gIGlmICgvXihcXC18XFwrKT8oWzAtOV0rfEluZmluaXR5KSQvLnRlc3QodmFsKSkgcmV0dXJuIE51bWJlcih2YWwpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdXVpZChzaG9ydCkge1xuICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBsZXQgdXVpZFN0cmluZyA9IHNob3J0ID8gJzR4eHgteHh4eHh4JyA6ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xuICBsZXQgdXVpZCA9IHV1aWRTdHJpbmcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgbGV0IHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICByZXR1cm4gKGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xuICB9KTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCB7XG4gIGVycm9yLFxuICBmaWx0ZXJJbnQsXG4gIHV1aWRcbn07XG4iXX0=
