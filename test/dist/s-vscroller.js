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
      this.iterable = config.iterable || [];
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
  if (!obj.totalCols) obj.totalCols = obj.iterable.length;
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
  if (!obj.totalRows) obj.totalRows = obj.iterable.length;
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
  if (!obj.totalRows) obj.totalRows = Math.ceil(obj.iterable.length / obj.totalCols);
  // console.log("obj.totalCols", obj.totalCols);
  obj.screenItemsLen = Math.ceil(obj.h / obj.itemHeight) * obj.totalCols;
  // console.log("obj.screenItemsLen", obj.screenItemsLen);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen / obj.totalCols * obj.itemHeight);
  obj.$scroller = (0, _scroller2.default)(obj.itemHeight * obj.totalRows, obj.mode, obj.$scroller);
  obj.$container = obj.$container || (0, _createContainer2.default)(obj.width, obj.height, obj.mode);
}

},{"./createContainer":2,"./scroller":7,"./utils":8}],2:[function(require,module,exports){
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

var _sVscrollerSrvc = require('./sVscrollerSrvc.service');

var _sVscrollerSrvc2 = _interopRequireDefault(_sVscrollerSrvc);

var _sVscroller = require('./sVscroller.directive');

var _sVscroller2 = _interopRequireDefault(_sVscroller);

var _sVscrollerCtrl = require('./sVscrollerCtrl');

var _sVscrollerCtrl2 = _interopRequireDefault(_sVscrollerCtrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

angular.module('sv-scroller', []).factory('sVscrollerSrvc', function () {
  return _sVscrollerSrvc2.default;
}).directive('sVscroller', _sVscroller2.default.factory).controller('sVscrollerCtrl', _sVscrollerCtrl2.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./sVscroller.directive":4,"./sVscrollerCtrl":5,"./sVscrollerSrvc.service":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sVscroller = function () {
  function sVscroller() {
    _classCallCheck(this, sVscroller);

    this.restrict = 'E';
    this.controller = 'sVscrollerCtrl as svc';
    this.bindToController = {
      iterator: '<',
      iterable: '=',
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

  _createClass(sVscroller, null, [{
    key: 'factory',
    value: function factory() {
      sVscroller.instance = new sVscroller();
      return sVscroller.instance;
    }
  }]);

  return sVscroller;
}();

exports.default = sVscroller;


sVscroller.factory.$inject = [];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sVscrollerCtrl;

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _utils = require('./utils');

var _scroller = require('./scroller');

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REMOVE_INTERVAL = 300;

function sVscrollerCtrl($scope, $element, $attrs, $transclude, $interval, $timeout, sVscrollerSrvc) {
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
    return _this.iterable;
  }, function (n, o) {
    if (n !== o) {
      ctrl.iterable = _this.iterable;
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
      scope[ctrl.iterator] = ctrl.iterable[i];
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
    renderChunk(ctrl.$container, 0);
    sVscrollerSrvc.subscribe(ctrl.namespace + 'scrollToElement', scrollToElement);
    sVscrollerSrvc.subscribe(ctrl.namespace + 'scrollToView', scrollToView);
    sVscrollerSrvc.subscribe(ctrl.namespace + 'reset', reset);
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
      // $fragment.append(createElement(i));
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
  }

  function scrollToElement(index) {
    index = parseInt(index, 10);
    console.log("index", index);
    if (index) {
      if (ctrl.mode === 'grid') {} else {
        renderChunk(ctrl.$container, index);
        if (ctrl.mode === 'horizontal') ctrl.$container[0].scrollLeft = index * ctrl.itemWidth;else if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = Math.ceil(index * ctrl.itemHeight / ctrl.totalCols);else ctrl.$container[0].scrollTop = index * ctrl.itemHeight;
      }

      // if (index < ctrl.screenItemsLen) {
      //   renderChunk(ctrl.$container, 0);
      //   if (ctrl.mode === 'horizontal') ctrl.$container[0].scrollLeft = 0;
      //   else ctrl.$container[0].scrollTop = 0;
      // } else {
      //   renderChunk(ctrl.$container, index);
      //   if (ctrl.mode === 'horizontal') ctrl.$container[0].scrollLeft = index * ctrl.itemWidth;
      //   else if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = Math.ceil(index * ctrl.itemHeight / ctrl.totalCols);
      //   else ctrl.$container[0].scrollTop = index * ctrl.itemHeight;
      // }
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

sVscrollerCtrl.$inject = ['$scope', '$element', '$attrs', '$transclude', '$interval', '$timeout', 'sVscrollerSrvc'];

},{"./Config":1,"./scroller":7,"./utils":8}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29uZmlnLmpzIiwic3JjL2NyZWF0ZUNvbnRhaW5lci5qcyIsInNyYy9uZy13cmFwcGVyLmpzIiwic3JjL3NWc2Nyb2xsZXIuZGlyZWN0aXZlLmpzIiwic3JjL3NWc2Nyb2xsZXJDdHJsLmpzIiwic3JjL3NWc2Nyb2xsZXJTcnZjLnNlcnZpY2UuanMiLCJzcmMvc2Nyb2xsZXIuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUEsSUFBTSx3QkFBd0IsQ0FBeEI7OztBQUlKLG9CQUFjOzs7QUFDWixTQUFLLFNBQUwsR0FBaUIsQ0FBakIsQ0FEWTtBQUVaLFNBQUssU0FBTCxHQUFpQixDQUFqQixDQUZZO0FBR1osU0FBSyxZQUFMLEdBQW9CLENBQXBCLENBSFk7QUFJWixTQUFLLFlBQUwsR0FBb0IsQ0FBcEIsQ0FKWTtBQUtaLFNBQUssWUFBTCxHQUFvQixDQUFwQixDQUxZO0FBTVosU0FBSyxhQUFMLEdBQXFCLGlCQUFLLElBQUwsQ0FBckIsQ0FOWTtHQUFkOzs7OytCQVNXLE1BQU07QUFDZixVQUFJLFNBQVMsRUFBVCxDQURXO0FBRWYsYUFBTyxNQUFQLENBQWMsTUFBZCxFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUZlO0FBR2YsV0FBSyxDQUFMLEdBQVMsT0FBTyxDQUFQLEdBQVcsc0JBQVUsT0FBTyxDQUFQLENBQXJCLEdBQWlDLE9BQU8sVUFBUCxDQUFrQixLQUFsQixDQUgzQjtBQUlmLFdBQUssQ0FBTCxHQUFTLE9BQU8sQ0FBUCxHQUFXLHNCQUFVLE9BQU8sQ0FBUCxDQUFyQixHQUFpQyxPQUFPLFVBQVAsQ0FBa0IsTUFBbEIsQ0FKM0I7QUFLZixXQUFLLEtBQUwsR0FBYSxLQUFLLENBQUwsR0FBUyxLQUFLLENBQUwsR0FBUyxJQUFULEdBQWdC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LEdBQVcsT0FBWCxFQUFKLENBRGU7QUFFbkIsTUFBSSxhQUFhLFFBQVEsYUFBUixHQUF3QixzQ0FBeEIsQ0FGRTtBQUduQixNQUFJLE9BQU8sV0FBVyxPQUFYLENBQW1CLE9BQW5CLEVBQTRCLFVBQVMsQ0FBVCxFQUFZO0FBQ2pELFFBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFMLEtBQWdCLEVBQWhCLENBQUwsR0FBMkIsRUFBM0IsR0FBZ0MsQ0FBaEMsQ0FEeUM7QUFFakQsUUFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFJLEVBQUosQ0FBZixDQUZpRDtBQUdqRCxXQUFPLENBQUMsS0FBSyxHQUFMLEdBQVcsQ0FBWCxHQUFnQixJQUFJLEdBQUosR0FBVSxHQUFWLENBQWpCLENBQWlDLFFBQWpDLENBQTBDLEVBQTFDLENBQVAsQ0FIaUQ7R0FBWixDQUFuQyxDQUhlO0FBUW5CLFNBQU8sSUFBUCxDQVJtQjtDQUFyQjs7UUFZRTtRQUNBO1FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtlcnJvciwgZmlsdGVySW50LCB1dWlkfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBjcmVhdGVDb250YWluZXIgZnJvbSAnLi9jcmVhdGVDb250YWluZXInO1xuaW1wb3J0IHNjcm9sbGVyIGZyb20gJy4vc2Nyb2xsZXInO1xuXG5jb25zdCBDQUNIRURfSVRFTVNfTVVMVElQTEUgPSAxO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50b3RhbFJvd3MgPSAwO1xuICAgIHRoaXMudG90YWxDb2xzID0gMDtcbiAgICB0aGlzLmxhc3RSZXBhaW50WSA9IDA7XG4gICAgdGhpcy5sYXN0UmVwYWludFggPSAwO1xuICAgIHRoaXMubGFzdFNjcm9sbGVkID0gMDtcbiAgICB0aGlzLmJhZE5vZGVNYXJrZXIgPSB1dWlkKHRydWUpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShjb25mKSB7XG4gICAgbGV0IGNvbmZpZyA9IHt9O1xuICAgIE9iamVjdC5hc3NpZ24oY29uZmlnLCB0aGlzLCBjb25mKTtcbiAgICB0aGlzLncgPSBjb25maWcudyA/IGZpbHRlckludChjb25maWcudykgOiBjb25maWcucGFyZW50RGltcy53aWR0aDs7XG4gICAgdGhpcy5oID0gY29uZmlnLmggPyBmaWx0ZXJJbnQoY29uZmlnLmgpIDogY29uZmlnLnBhcmVudERpbXMuaGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLncgPyB0aGlzLncgKyAncHgnIDogJzEwMCUnO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oID8gdGhpcy5oICsgJ3B4JyA6ICcxMDAlJztcbiAgICB0aGlzLm1vZGUgPSBjb25maWcubW9kZSB8fCAndmVydGljYWwnO1xuICAgIGlmICh0aGlzLm1vZGUgIT09ICd2ZXJ0aWNhbCcgJiYgdGhpcy5tb2RlICE9PSAnaG9yaXpvbnRhbCcgJiYgdGhpcy5tb2RlICE9PSAnZ3JpZCcpIGVycm9yKCd3cm9uZyB0eXBlJyk7XG4gICAgdGhpcy5pdGVtV2lkdGggPSBjb25maWcuaXRlbVdpZHRoO1xuICAgIHRoaXMuaXRlbUhlaWdodCA9IGNvbmZpZy5pdGVtSGVpZ2h0O1xuICAgIHRoaXMuaXRlcmF0b3IgPSBjb25maWcuaXRlcmF0b3IgfHwgJ2l0ZW0nO1xuICAgIHRoaXMuaXRlcmFibGUgPSBjb25maWcuaXRlcmFibGUgfHwgW107XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2hvcml6b250YWwnKSBjb25maWd1cmVIb3Jpem9udGFsTW9kZSh0aGlzKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSAndmVydGljYWwnKSBjb25maWd1cmVWZXJ0aWNhbE1vZGUodGhpcyk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2dyaWQnKSBjb25maWd1cmVHcmlkTW9kZSh0aGlzKTtcbiAgICB0aGlzLiRjb250YWluZXIuZW1wdHkoKS5hcHBlbmQodGhpcy4kc2Nyb2xsZXIpO1xuICAgIHRoaXMuY2FjaGVkSXRlbXNMZW4gPSB0aGlzLnNjcmVlbkl0ZW1zTGVuICogQ0FDSEVEX0lURU1TX01VTFRJUExFO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUhvcml6b250YWxNb2RlKG9iaikge1xuICBvYmoudG90YWxDb2xzID0gZmlsdGVySW50KG9iai5jb2xzKTtcbiAgaWYgKCFvYmoudG90YWxDb2xzKSBvYmoudG90YWxDb2xzID0gb2JqLml0ZXJhYmxlLmxlbmd0aDtcbiAgb2JqLml0ZW1XaWR0aCA9IGZpbHRlckludChvYmouaXRlbVdpZHRoKTtcbiAgaWYgKCFvYmouaXRlbVdpZHRoKSBlcnJvcihcIidpdGVtLXdpZHRoJyByZXF1aXJlZCBpbiBob3Jpem9udGFsIG1vZGVcIik7XG4gIG9iai5zY3JlZW5JdGVtc0xlbiA9IE1hdGguY2VpbChvYmoudyAvIG9iai5pdGVtV2lkdGgpO1xuICBvYmoubWF4QnVmZmVyID0gTWF0aC5jZWlsKG9iai5zY3JlZW5JdGVtc0xlbiAqIG9iai5pdGVtV2lkdGgpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1XaWR0aCAqIG9iai50b3RhbENvbHMsIG9iai5tb2RlLCBvYmouJHNjcm9sbGVyKTtcbiAgb2JqLiRjb250YWluZXIgPSBvYmouJGNvbnRhaW5lciB8fCBjcmVhdGVDb250YWluZXIob2JqLndpZHRoLCBvYmouaGVpZ2h0LCBvYmoubW9kZSk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZVZlcnRpY2FsTW9kZShvYmopIHtcbiAgb2JqLnRvdGFsUm93cyA9IGZpbHRlckludChvYmoucm93cyk7XG4gIG9iai5pdGVtSGVpZ2h0ID0gZmlsdGVySW50KG9iai5pdGVtSGVpZ2h0KTtcbiAgaWYgKCFvYmoudG90YWxSb3dzKSBvYmoudG90YWxSb3dzID0gb2JqLml0ZXJhYmxlLmxlbmd0aDtcbiAgaWYgKCFvYmouaXRlbUhlaWdodCkgZXJyb3IoXCInaXRlbS1oZWlnaHQnIHJlcXVpcmVkIGluIHZlcnRpY2FsIG1vZGVcIik7XG4gIG9iai5zY3JlZW5JdGVtc0xlbiA9IE1hdGguY2VpbChvYmouaCAvIG9iai5pdGVtSGVpZ2h0KTtcbiAgb2JqLm1heEJ1ZmZlciA9IE1hdGguY2VpbChvYmouc2NyZWVuSXRlbXNMZW4gKiBvYmouaXRlbUhlaWdodCk7XG4gIG9iai4kc2Nyb2xsZXIgPSBzY3JvbGxlcihvYmouaXRlbUhlaWdodCAqIG9iai50b3RhbFJvd3MsIG9iai5tb2RlLCBvYmouJHNjcm9sbGVyKTtcbiAgb2JqLiRjb250YWluZXIgPSBvYmouJGNvbnRhaW5lciB8fCBjcmVhdGVDb250YWluZXIob2JqLndpZHRoLCBvYmouaGVpZ2h0LCBvYmoubW9kZSk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUdyaWRNb2RlKG9iaikge1xuICBvYmoudG90YWxDb2xzID0gZmlsdGVySW50KG9iai5jb2xzKTtcbiAgb2JqLnRvdGFsUm93cyA9IGZpbHRlckludChvYmoucm93cyk7XG4gIG9iai5pdGVtSGVpZ2h0ID0gZmlsdGVySW50KG9iai5pdGVtSGVpZ2h0KTtcbiAgb2JqLml0ZW1XaWR0aCA9IGZpbHRlckludChvYmouaXRlbVdpZHRoKTtcbiAgaWYgKCFvYmouaXRlbUhlaWdodCkgZXJyb3IoXCInaXRlbS1oZWlnaHQnIHJlcXVpcmVkIGluIGdyZCBtb2RlXCIpO1xuICBpZiAoIW9iai5pdGVtV2lkdGgpIGVycm9yKFwiJ2l0ZW0td2lkdGgnIHJlcXVpcmVkIGluIGdyaWQgbW9kZVwiKTtcbiAgaWYgKCFvYmoudG90YWxDb2xzKSBvYmoudG90YWxDb2xzID0gTWF0aC5mbG9vcigob2JqLncgLyBvYmouaXRlbVdpZHRoKSk7XG4gIGlmICghb2JqLnRvdGFsUm93cykgb2JqLnRvdGFsUm93cyA9IE1hdGguY2VpbChvYmouaXRlcmFibGUubGVuZ3RoIC8gb2JqLnRvdGFsQ29scyk7XG4gIC8vIGNvbnNvbGUubG9nKFwib2JqLnRvdGFsQ29sc1wiLCBvYmoudG90YWxDb2xzKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai5oIC8gb2JqLml0ZW1IZWlnaHQpICogb2JqLnRvdGFsQ29scztcbiAgLy8gY29uc29sZS5sb2coXCJvYmouc2NyZWVuSXRlbXNMZW5cIiwgb2JqLnNjcmVlbkl0ZW1zTGVuKTtcbiAgb2JqLm1heEJ1ZmZlciA9IE1hdGguY2VpbChvYmouc2NyZWVuSXRlbXNMZW4gLyBvYmoudG90YWxDb2xzICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ29udGFpbmVyKHcsIGgsIG1vZGUpIHtcbiAgbGV0ICRjID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICBsZXQgY3NzID0ge1xuICAgIHdpZHRoOiB3LFxuICAgIGhlaWdodDogaCxcbiAgICAnb3ZlcmZsb3cteSc6ICdhdXRvJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgcGFkZGluZzogMFxuICB9XG4gIGlmIChtb2RlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBkZWxldGUgY3NzWydvdmVyZmxvdy15J107XG4gICAgY3NzWydvdmVyZmxvdy14J10gPSAnYXV0byc7XG4gIH1cbiAgJGMuY3NzKGNzcyk7XG4gICRjLmFkZENsYXNzKCdzLWNvbnRhaW5lcicpXG4gIHJldHVybiAkYztcbn1cbiIsImxldCBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5pbXBvcnQgc1ZzY3JvbGxlclNydmMgZnJvbSAnLi9zVnNjcm9sbGVyU3J2Yy5zZXJ2aWNlJztcbmltcG9ydCBzVnNjcm9sbGVyIGZyb20gXCIuL3NWc2Nyb2xsZXIuZGlyZWN0aXZlXCI7XG5pbXBvcnQgc1ZzY3JvbGxlckN0cmwgZnJvbSAnLi9zVnNjcm9sbGVyQ3RybCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzdi1zY3JvbGxlcicsIFtdKVxuICAuZmFjdG9yeSgnc1ZzY3JvbGxlclNydmMnLCAoKSA9PiBzVnNjcm9sbGVyU3J2YylcbiAgLmRpcmVjdGl2ZSgnc1ZzY3JvbGxlcicsIHNWc2Nyb2xsZXIuZmFjdG9yeSlcbiAgLmNvbnRyb2xsZXIoJ3NWc2Nyb2xsZXJDdHJsJywgc1ZzY3JvbGxlckN0cmwpXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBzVnNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXN0cmljdCA9ICdFJztcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSAnc1ZzY3JvbGxlckN0cmwgYXMgc3ZjJztcbiAgICB0aGlzLmJpbmRUb0NvbnRyb2xsZXIgPSB7XG4gICAgICBpdGVyYXRvcjogJzwnLFxuICAgICAgaXRlcmFibGU6ICc9JyxcbiAgICAgIG1vZGU6ICc8JyxcbiAgICAgIHc6ICc8JyxcbiAgICAgIGg6ICc8JyxcbiAgICAgIHJvd3M6ICc8JyxcbiAgICAgIGNvbHM6ICc8JyxcbiAgICAgIGl0ZW1IZWlnaHQ6ICc8JyxcbiAgICAgIGl0ZW1XaWR0aDogJzwnLFxuICAgICAgaW5maW5pdGVTY3JvbGw6ICcmJ1xuICAgIH07XG4gICAgdGhpcy50cmFuc2NsdWRlID0gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBmYWN0b3J5KCkge1xuICAgIHNWc2Nyb2xsZXIuaW5zdGFuY2UgPSBuZXcgc1ZzY3JvbGxlcigpO1xuICAgIHJldHVybiBzVnNjcm9sbGVyLmluc3RhbmNlO1xuICB9XG5cbn1cblxuc1ZzY3JvbGxlci5mYWN0b3J5LiRpbmplY3QgPSBbXTtcbiIsImltcG9ydCBDb25maWcgZnJvbSAnLi9Db25maWcnO1xuaW1wb3J0IHtlcnJvcn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2Nyb2xsZXIgZnJvbSAnLi9zY3JvbGxlcic7XG5jb25zdCBSRU1PVkVfSU5URVJWQUwgPSAzMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNWc2Nyb2xsZXJDdHJsKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRpbnRlcnZhbCwgJHRpbWVvdXQsIHNWc2Nyb2xsZXJTcnZjKSB7XG4gIGxldCBjdHJsID0ge307XG4gIGN0cmwuY29uZmlnID0gbmV3IENvbmZpZygpO1xuICBjdHJsLm5hbWVzcGFjZSA9ICRhdHRycy5pZCA/ICRhdHRycy5pZCArICc6JyA6ICcnO1xuICBjdHJsLmluZmluaXRlU2Nyb2xsID0gdGhpcy5pbmZpbml0ZVNjcm9sbDtcblxuICAkdGltZW91dCgoKSA9PiB7XG4gICAgbGV0IHBhcmVudCA9ICRlbGVtZW50LnBhcmVudCgpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMucGFyZW50RGltcyA9IHtcbiAgICAgIGhlaWdodDogcGFyZW50LmhlaWdodCxcbiAgICAgIHdpZHRoOiBwYXJlbnQud2lkdGhcbiAgICB9O1xuXG4gICAgaW5pdGlhbGl6ZSh0aGlzKTtcbiAgfSwgMjAwKVxuXG5cbiAgJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLml0ZXJhYmxlO1xuICB9LCAobiwgbykgPT4ge1xuICAgIGlmIChuICE9PSBvKSB7XG4gICAgICBjdHJsLml0ZXJhYmxlID0gdGhpcy5pdGVyYWJsZTtcbiAgICAgIGluaXRpYWxpemUodGhpcyk7XG4gICAgICBvblNjcm9sbEhhbmRsZXIoKTtcbiAgICB9XG4gIH0pXG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChpKSB7XG4gICAgbGV0ICRpdGVtID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICAgIGxldCBjc3MgPSB7XG4gICAgICBoZWlnaHQ6IGN0cmwuaXRlbUhlaWdodCArICdweCcsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6IChpICogY3RybC5pdGVtSGVpZ2h0KSArICdweCdcbiAgICB9XG4gICAgaWYgKGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBjc3MuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgY3NzWydtaW4taGVpZ2h0J10gPSAnMTAwJSc7XG4gICAgICBkZWxldGUgY3NzLnRvcDtcbiAgICAgIGNzcy5sZWZ0ID0gKGkgKiBjdHJsLml0ZW1XaWR0aCkgKyAncHgnO1xuICAgICAgY3NzLndpZHRoID0gY3RybC5pdGVtV2lkdGggKyAncHgnO1xuICAgIH1cblxuICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykge1xuICAgICAgbGV0IGNvbCA9IDA7XG4gICAgICBsZXQgcm93ID0gcGFyc2VJbnQoaSAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgIGNvbCA9IGkgLSAoY3RybC50b3RhbENvbHMgKiByb3cpO1xuICAgICAgY3NzLnRvcCA9IHJvdyAqIGN0cmwuaXRlbUhlaWdodCArICdweCc7XG4gICAgICBjc3MubGVmdCA9IChjb2wgKiBjdHJsLml0ZW1XaWR0aCkgKyAncHgnO1xuICAgICAgY3NzLndpZHRoID0gY3RybC5pdGVtV2lkdGggKyAncHgnO1xuICAgICAgY3NzWydtaW4taGVpZ2h0J10gPSBjdHJsLml0ZW1IZWlnaHQgKyAncHgnO1xuICAgIH1cblxuICAgICRpdGVtLmNzcyhjc3MpO1xuICAgICRpdGVtLmFkZENsYXNzKGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnID8gJ3MtdmNvbCcgOiAncy12cm93Jyk7XG4gICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSAkaXRlbS5hZGRDbGFzcygncy12Y29sJyk7XG4gICAgJHRyYW5zY2x1ZGUoKGVsLCBzY29wZSkgPT4ge1xuICAgICAgc2NvcGVbY3RybC5pdGVyYXRvcl0gPSBjdHJsLml0ZXJhYmxlW2ldO1xuICAgICAgJGl0ZW0uYXBwZW5kKGVsKTtcbiAgICB9KTtcbiAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHskaXRlbS5jc3Moe3Zpc2liaWxpdHk6ICd2aXNpYmxlJ30pfSwgMTApO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoJGl0ZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZShjb25maWcpIHtcbiAgICBPYmplY3QuYXNzaWduKGN0cmwsIGN0cmwuY29uZmlnLmluaXRpYWxpemUoY29uZmlnKSk7XG4gICAgaWYgKCRlbGVtZW50LmNoaWxkcmVuKCkubGVuZ3RoID09PSAwKSAkZWxlbWVudC5hcHBlbmQoY3RybC4kY29udGFpbmVyKTtcbiAgICBjdHJsLiRjb250YWluZXIudW5iaW5kKCdzY3JvbGwnKTtcbiAgICBjdHJsLiRjb250YWluZXIuYmluZCgnc2Nyb2xsJywgb25TY3JvbGxIYW5kbGVyKTtcbiAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgIHNWc2Nyb2xsZXJTcnZjLnN1YnNjcmliZShjdHJsLm5hbWVzcGFjZSArICdzY3JvbGxUb0VsZW1lbnQnLCBzY3JvbGxUb0VsZW1lbnQpO1xuICAgIHNWc2Nyb2xsZXJTcnZjLnN1YnNjcmliZShjdHJsLm5hbWVzcGFjZSArICdzY3JvbGxUb1ZpZXcnLCBzY3JvbGxUb1ZpZXcpO1xuICAgIHNWc2Nyb2xsZXJTcnZjLnN1YnNjcmliZShjdHJsLm5hbWVzcGFjZSArICdyZXNldCcsIHJlc2V0KTtcbiAgICAkaW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKERhdGUubm93KCkgLSBjdHJsLmxhc3RTY3JvbGxlZCA+IDIwMCkge1xuICAgICAgICBsZXQgJGJhZE5vZGVzID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJtLW5vZGU9XCInICsgY3RybC5iYWROb2RlTWFya2VyICsgJ1wiXScpKTtcbiAgICAgICAgJGJhZE5vZGVzLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0sIFJFTU9WRV9JTlRFUlZBTCk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNjcm9sbEhhbmRsZXIoKSB7XG4gICAgbGV0IHRhcmdldCA9IGN0cmwuJGNvbnRhaW5lclswXTtcbiAgICBsZXQgZmlyc3QsIHNjcm9sbExlZnQsIHNjcm9sbFRvcDtcblxuICAgIHN3aXRjaChjdHJsLm1vZGUpIHtcbiAgICAgIGNhc2UgJ2hvcml6b250YWwnOlxuICAgICAgICBzY3JvbGxMZWZ0ID0gdGFyZ2V0LnNjcm9sbExlZnQ7XG4gICAgICAgIGlmICgoTWF0aC5hYnMoc2Nyb2xsTGVmdCAtIGN0cmwubGFzdFJlcGFpbnRYKSA+IGN0cmwubWF4QnVmZmVyKSB8fCBzY3JvbGxMZWZ0ID09PSAwKSB7XG4gICAgICAgICAgZmlyc3QgPSBwYXJzZUludChzY3JvbGxMZWZ0IC8gY3RybC5pdGVtV2lkdGgpIC0gY3RybC5zY3JlZW5JdGVtc0xlbjtcbiAgICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGZpcnN0IDwgMCA/IDAgOiBmaXJzdCk7XG4gICAgICAgICAgY3RybC5sYXN0UmVwYWludFggPSBzY3JvbGxMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ3JpZCc6XG4gICAgICAgIHNjcm9sbFRvcCA9IHRhcmdldC5zY3JvbGxUb3A7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2Nyb2xsVG9wXCIsIHNjcm9sbFRvcCwgJyBjdHJsLmxhc3RSZXBhaW50WScsIGN0cmwubGFzdFJlcGFpbnRZLCAnIGN0cmwubWF4QnVmZmVyICcsIGN0cmwubWF4QnVmZmVyKTtcbiAgICAgICAgaWYgKChNYXRoLmFicyhzY3JvbGxUb3AgLSBjdHJsLmxhc3RSZXBhaW50WSkgPiBjdHJsLm1heEJ1ZmZlcikgfHwgc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICAgICAgZmlyc3QgPSBwYXJzZUludChzY3JvbGxUb3AgLyBjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnRvdGFsQ29scykgLSBjdHJsLnNjcmVlbkl0ZW1zTGVuO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZmlyc3RcIiwgZmlyc3QsIFwic2NyZWVuSXRlbXNMZW4gXCIsIGN0cmwuc2NyZWVuSXRlbXNMZW4pO1xuICAgICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgZmlyc3QgPCAwID8gMCA6IGZpcnN0KTtcbiAgICAgICAgICBjdHJsLmxhc3RSZXBhaW50WSA9IHNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHNjcm9sbFRvcCA9IHRhcmdldC5zY3JvbGxUb3A7XG4gICAgICAgIGlmICgoTWF0aC5hYnMoc2Nyb2xsVG9wIC0gY3RybC5sYXN0UmVwYWludFkpID4gY3RybC5tYXhCdWZmZXIpIHx8IHNjcm9sbFRvcCA9PT0gMCkge1xuICAgICAgICAgIGZpcnN0ID0gcGFyc2VJbnQoc2Nyb2xsVG9wIC8gY3RybC5pdGVtSGVpZ2h0KSAtIGN0cmwuc2NyZWVuSXRlbXNMZW47XG4gICAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBmaXJzdCA8IDAgPyAwIDogZmlyc3QpO1xuICAgICAgICAgIGN0cmwubGFzdFJlcGFpbnRZID0gc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3RybC5sYXN0U2Nyb2xsZWQgPSBEYXRlLm5vdygpO1xuICAgIHRhcmdldC5wcmV2ZW50RGVmYXVsdCAmJiB0YXJnZXQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckNodW5rKCRub2RlLCBmcm9tKSB7XG4gICAgbGV0IHByb21pc2VzID0gW107XG4gICAgbGV0IGZpbmFsSXRlbSA9IGZyb20gKyBjdHJsLmNhY2hlZEl0ZW1zTGVuICogMztcbiAgICBsZXQgdG90YWxFbGVtZW50cyA9IGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnID8gY3RybC50b3RhbENvbHMgOiBjdHJsLm1vZGUgPT09ICdncmlkJyA/IGN0cmwudG90YWxDb2xzICogY3RybC50b3RhbFJvd3MgOiBjdHJsLnRvdGFsUm93cztcbiAgICAvLyBjb25zb2xlLmxvZyhcImZyb21cIiwgZnJvbSwgXCIgZmluYWxJdGVtIFwiLCBmaW5hbEl0ZW0sIFwiIHRvdGFsRWxlbWVudHMgXCIsIHRvdGFsRWxlbWVudHMpO1xuICAgIGlmIChmaW5hbEl0ZW0gPiB0b3RhbEVsZW1lbnRzKSBmaW5hbEl0ZW0gPSB0b3RhbEVsZW1lbnRzO1xuICAgIGxldCAkZnJhZ21lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKTtcbiAgICBmb3IgKHZhciBpID0gZnJvbTsgaSA8IGZpbmFsSXRlbTsgaSsrKSB7XG4gICAgICBwcm9taXNlcy5wdXNoKGNyZWF0ZUVsZW1lbnQoaSkpO1xuICAgICAgLy8gJGZyYWdtZW50LmFwcGVuZChjcmVhdGVFbGVtZW50KGkpKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGFuZCBtYXJrIG9ic29sZXRlIG5vZGVzIGZvciBkZWxldGlvbi5cbiAgICBsZXQgJGNoaWxkcmVuID0gJG5vZGUuY2hpbGRyZW4oKTtcbiAgICBmb3IgKHZhciBqID0gMSwgbCA9ICRjaGlsZHJlbi5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgIGxldCBjaGlsZCA9ICRjaGlsZHJlbltqXTtcbiAgICAgIGNoaWxkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcm0tbm9kZScsIGN0cmwuYmFkTm9kZU1hcmtlcik7XG4gICAgfVxuXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgJGZyYWdtZW50LmFwcGVuZChyZXN1bHQpO1xuICAgICAgfSk7XG4gICAgICAkbm9kZS5hcHBlbmQoJGZyYWdtZW50KTtcbiAgICB9KTtcblxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQoY29uZmlnKSB7XG4gICAgaW5pdGlhbGl6ZShjb25maWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2Nyb2xsVG9FbGVtZW50KGluZGV4KSB7XG4gICAgaW5kZXggPSBwYXJzZUludChpbmRleCwgMTApO1xuICAgIGNvbnNvbGUubG9nKFwiaW5kZXhcIiwgaW5kZXgpO1xuICAgIGlmIChpbmRleCkge1xuICAgICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSB7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgaW5kZXgpO1xuICAgICAgICBpZiAoY3RybC5tb2RlID09PSAnaG9yaXpvbnRhbCcpIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gaW5kZXggKiBjdHJsLml0ZW1XaWR0aDtcbiAgICAgICAgZWxzZSBpZiAoY3RybC5tb2RlID09PSAnZ3JpZCcpIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBNYXRoLmNlaWwoaW5kZXggKiBjdHJsLml0ZW1IZWlnaHQgLyBjdHJsLnRvdGFsQ29scyk7XG4gICAgICAgIGVsc2UgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IGluZGV4ICogY3RybC5pdGVtSGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICAvLyBpZiAoaW5kZXggPCBjdHJsLnNjcmVlbkl0ZW1zTGVuKSB7XG4gICAgICAvLyAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgMCk7XG4gICAgICAvLyAgIGlmIChjdHJsLm1vZGUgPT09ICdob3Jpem9udGFsJykgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgPSAwO1xuICAgICAgLy8gICBlbHNlIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSAwO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBpbmRleCk7XG4gICAgICAvLyAgIGlmIChjdHJsLm1vZGUgPT09ICdob3Jpem9udGFsJykgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgPSBpbmRleCAqIGN0cmwuaXRlbVdpZHRoO1xuICAgICAgLy8gICBlbHNlIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IE1hdGguY2VpbChpbmRleCAqIGN0cmwuaXRlbUhlaWdodCAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgIC8vICAgZWxzZSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gaW5kZXggKiBjdHJsLml0ZW1IZWlnaHQ7XG4gICAgICAvLyB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2Nyb2xsVG9WaWV3KHRva2VuKSB7XG4gICAgY3RybC5zY3JvbGxUb1ZpZXcgPSB0b2tlbjtcbiAgICBzd2l0Y2goY3RybC5zY3JvbGxUb1ZpZXcpIHtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgMCk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgY3RybC50b3RhbFJvd3MpO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gcGFyc2VJbnQoY3RybC50b3RhbFJvd3MgKiBjdHJsLml0ZW1IZWlnaHQsIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCAtIHBhcnNlSW50KGN0cmwuaXRlbVdpZHRoICogY3RybC5zY3JlZW5JdGVtc0xlbiwgMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCArIHBhcnNlSW50KGN0cmwuaXRlbVdpZHRoICogY3RybC5zY3JlZW5JdGVtc0xlbiwgMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JlZ2lubmluZyc6XG4gICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgMCk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbmQnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGN0cmwudG90YWxDb2xzKTtcbiAgICAgICAgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgPSBjdHJsLnRvdGFsQ29scyAqIGN0cmwuaXRlbVdpZHRoO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCAtIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuIC8gY3RybC50b3RhbENvbHMpO1xuICAgICAgICBlbHNlIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wIC0gTWF0aC5jZWlsKGN0cmwuaXRlbUhlaWdodCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICBpZiAoY3RybC5tb2RlID09PSAnZ3JpZCcpIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wICsgTWF0aC5jZWlsKGN0cmwuaXRlbUhlaWdodCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4gLyBjdHJsLnRvdGFsQ29scyk7XG4gICAgICAgIGVsc2UgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgKyBNYXRoLmNlaWwoY3RybC5pdGVtSGVpZ2h0ICogY3RybC5zY3JlZW5JdGVtc0xlbik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG59XG5cbnNWc2Nyb2xsZXJDdHJsLiRpbmplY3QgPSBbXG4gICckc2NvcGUnLFxuICAnJGVsZW1lbnQnLFxuICAnJGF0dHJzJyxcbiAgJyR0cmFuc2NsdWRlJyxcbiAgJyRpbnRlcnZhbCcsXG4gICckdGltZW91dCcsXG4gICdzVnNjcm9sbGVyU3J2Yydcbl07XG4iLCJsZXQgdG9waWNzID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBhZGRUb3BpYyh0b3BpYykge1xuICAgIGlmICghdG9waWNzW3RvcGljXSkgdG9waWNzW3RvcGljXSA9IFtdO1xuICB9LFxuXG4gIGRlbFRvcGljKHRvcGljKSB7XG4gICAgaWYgKHRvcGljc1t0b3BpY10pIHtcbiAgICAgIHRvcGljc1t0b3BpY10uZm9yRWFjaChzdWJzY3JpYmVyID0+IHtcbiAgICAgICAgc3Vic2NyaWJlciA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSB0b3BpY3NbdG9waWNdO1xuICAgIH1cbiAgfSxcblxuICBwdWJsaXNoKHRvcGljLCBkYXRhKSB7XG4gICAgaWYgKCF0b3BpY3NbdG9waWNdIHx8IHRvcGljc1t0b3BpY10ubGVuZ3RoIDwgMSkgcmV0dXJuO1xuICAgIHRvcGljc1t0b3BpY10uZm9yRWFjaChsaXN0ZW5lciA9PiB7XG4gICAgICBsaXN0ZW5lcihkYXRhIHx8IHt9KTtcbiAgICB9KTtcbiAgfSxcblxuICBzdWJzY3JpYmUodG9waWMsIGxpc3RlbmVyKSB7XG4gICAgaWYgKCF0b3BpY3NbdG9waWNdKSB0b3BpY3NbdG9waWNdID0gW107XG4gICAgbGV0IGN1cnJMaXN0ZW5lciA9IHRvcGljc1t0b3BpY10uZmluZCgobGlzdG5yKSA9PiBsaXN0bnIgPT09IGxpc3RlbmVyKTtcbiAgICBpZiAoIWN1cnJMaXN0ZW5lcikgdG9waWNzW3RvcGljXS5wdXNoKGxpc3RlbmVyKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2Nyb2xsZXIoc2l6ZSwgbW9kZSwgJHNjcm9sbGVyKSB7XG4gICRzY3JvbGxlciA9ICRzY3JvbGxlciB8fCBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+Jyk7XG5cbiAgbGV0IGNzcyA9IHtcbiAgICBvcGFjaXR5OiAwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHdpZHRoOiAnMXB4JyxcbiAgICBoZWlnaHQ6IHNpemUgKyAncHgnXG4gIH07XG5cbiAgaWYgKG1vZGUgPT09ICdob3Jpem9udGFsJykge1xuICAgIGNzcy53aWR0aCA9IHNpemUgKyAncHgnO1xuICAgIGNzcy5oZWlnaHQgPSAnMXB4JztcbiAgfVxuXG4gICRzY3JvbGxlci5jc3MoY3NzKTtcbiAgcmV0dXJuICRzY3JvbGxlcjtcbn1cbiIsImZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJbnQodmFsKSB7XG4gIGlmICgvXihcXC18XFwrKT8oWzAtOV0rfEluZmluaXR5KSQvLnRlc3QodmFsKSkgcmV0dXJuIE51bWJlcih2YWwpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdXVpZChzaG9ydCkge1xuICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBsZXQgdXVpZFN0cmluZyA9IHNob3J0ID8gJzR4eHgteHh4eHh4JyA6ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xuICBsZXQgdXVpZCA9IHV1aWRTdHJpbmcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgbGV0IHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICByZXR1cm4gKGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xuICB9KTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCB7XG4gIGVycm9yLFxuICBmaWx0ZXJJbnQsXG4gIHV1aWRcbn07XG4iXX0=
