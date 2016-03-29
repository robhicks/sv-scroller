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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29uZmlnLmpzIiwic3JjL2NyZWF0ZUNvbnRhaW5lci5qcyIsInNyYy9uZy13cmFwcGVyLmpzIiwic3JjL3NWc2Nyb2xsZXIuZGlyZWN0aXZlLmpzIiwic3JjL3NWc2Nyb2xsZXJDdHJsLmpzIiwic3JjL3NWc2Nyb2xsZXJTcnZjLnNlcnZpY2UuanMiLCJzcmMvc2Nyb2xsZXIuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUEsSUFBTSx3QkFBd0IsQ0FBeEI7OztBQUlKLG9CQUFjOzs7QUFDWixTQUFLLFNBQUwsR0FBaUIsQ0FBakIsQ0FEWTtBQUVaLFNBQUssU0FBTCxHQUFpQixDQUFqQixDQUZZO0FBR1osU0FBSyxZQUFMLEdBQW9CLENBQXBCLENBSFk7QUFJWixTQUFLLFlBQUwsR0FBb0IsQ0FBcEIsQ0FKWTtBQUtaLFNBQUssWUFBTCxHQUFvQixDQUFwQixDQUxZO0FBTVosU0FBSyxhQUFMLEdBQXFCLGlCQUFLLElBQUwsQ0FBckIsQ0FOWTtHQUFkOzs7OytCQVNXLE1BQU07QUFDZixVQUFJLFNBQVMsRUFBVCxDQURXO0FBRWYsYUFBTyxNQUFQLENBQWMsTUFBZCxFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUZlO0FBR2YsV0FBSyxDQUFMLEdBQVMsT0FBTyxDQUFQLEdBQVcsc0JBQVUsT0FBTyxDQUFQLENBQXJCLEdBQWlDLE9BQU8sVUFBUCxDQUFrQixLQUFsQixDQUgzQjtBQUlmLFdBQUssQ0FBTCxHQUFTLE9BQU8sQ0FBUCxHQUFXLHNCQUFVLE9BQU8sQ0FBUCxDQUFyQixHQUFpQyxPQUFPLFVBQVAsQ0FBa0IsTUFBbEIsQ0FKM0I7QUFLZixXQUFLLEtBQUwsR0FBYSxLQUFLLENBQUwsR0FBUyxLQUFLLENBQUwsR0FBUyxJQUFULEdBQWdC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QUosR0FBVyxPQUFYLEVBQUosQ0FEZTtBQUVuQixNQUFJLGFBQWEsUUFBUSxhQUFSLEdBQXdCLHNDQUF4QixDQUZFO0FBR25CLE1BQUksT0FBTyxXQUFXLE9BQVgsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBUyxDQUFULEVBQVk7QUFDakQsUUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQUwsS0FBZ0IsRUFBaEIsQ0FBTCxHQUEyQixFQUEzQixHQUFnQyxDQUFoQyxDQUR5QztBQUVqRCxRQUFJLEtBQUssS0FBTCxDQUFXLElBQUksRUFBSixDQUFmLENBRmlEO0FBR2pELFdBQU8sQ0FBQyxLQUFLLEdBQUwsR0FBVyxDQUFYLEdBQWdCLElBQUksR0FBSixHQUFVLEdBQVYsQ0FBakIsQ0FBaUMsUUFBakMsQ0FBMEMsRUFBMUMsQ0FBUCxDQUhpRDtHQUFaLENBQW5DLENBSGU7QUFRbkIsU0FBTyxJQUFQLENBUm1CO0NBQXJCOztRQVlFO1FBQ0E7UUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2Vycm9yLCBmaWx0ZXJJbnQsIHV1aWR9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGNyZWF0ZUNvbnRhaW5lciBmcm9tICcuL2NyZWF0ZUNvbnRhaW5lcic7XG5pbXBvcnQgc2Nyb2xsZXIgZnJvbSAnLi9zY3JvbGxlcic7XG5cbmNvbnN0IENBQ0hFRF9JVEVNU19NVUxUSVBMRSA9IDE7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRvdGFsUm93cyA9IDA7XG4gICAgdGhpcy50b3RhbENvbHMgPSAwO1xuICAgIHRoaXMubGFzdFJlcGFpbnRZID0gMDtcbiAgICB0aGlzLmxhc3RSZXBhaW50WCA9IDA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsZWQgPSAwO1xuICAgIHRoaXMuYmFkTm9kZU1hcmtlciA9IHV1aWQodHJ1ZSk7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmYpIHtcbiAgICBsZXQgY29uZmlnID0ge307XG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIHRoaXMsIGNvbmYpO1xuICAgIHRoaXMudyA9IGNvbmZpZy53ID8gZmlsdGVySW50KGNvbmZpZy53KSA6IGNvbmZpZy5wYXJlbnREaW1zLndpZHRoOztcbiAgICB0aGlzLmggPSBjb25maWcuaCA/IGZpbHRlckludChjb25maWcuaCkgOiBjb25maWcucGFyZW50RGltcy5oZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMudyA/IHRoaXMudyArICdweCcgOiAnMTAwJSc7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmggPyB0aGlzLmggKyAncHgnIDogJzEwMCUnO1xuICAgIHRoaXMubW9kZSA9IGNvbmZpZy5tb2RlIHx8ICd2ZXJ0aWNhbCc7XG4gICAgaWYgKHRoaXMubW9kZSAhPT0gJ3ZlcnRpY2FsJyAmJiB0aGlzLm1vZGUgIT09ICdob3Jpem9udGFsJyAmJiB0aGlzLm1vZGUgIT09ICdncmlkJykgZXJyb3IoJ3dyb25nIHR5cGUnKTtcbiAgICB0aGlzLml0ZW1XaWR0aCA9IGNvbmZpZy5pdGVtV2lkdGg7XG4gICAgdGhpcy5pdGVtSGVpZ2h0ID0gY29uZmlnLml0ZW1IZWlnaHQ7XG4gICAgdGhpcy5pdGVyYXRvciA9IGNvbmZpZy5pdGVyYXRvciB8fCAnaXRlbSc7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29uZmlnLmNvbGxlY3Rpb24gfHwgW107XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2hvcml6b250YWwnKSBjb25maWd1cmVIb3Jpem9udGFsTW9kZSh0aGlzKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSAndmVydGljYWwnKSBjb25maWd1cmVWZXJ0aWNhbE1vZGUodGhpcyk7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2dyaWQnKSBjb25maWd1cmVHcmlkTW9kZSh0aGlzKTtcbiAgICB0aGlzLiRjb250YWluZXIuZW1wdHkoKS5hcHBlbmQodGhpcy4kc2Nyb2xsZXIpO1xuICAgIHRoaXMuY2FjaGVkSXRlbXNMZW4gPSB0aGlzLnNjcmVlbkl0ZW1zTGVuICogQ0FDSEVEX0lURU1TX01VTFRJUExFO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUhvcml6b250YWxNb2RlKG9iaikge1xuICBvYmoudG90YWxDb2xzID0gZmlsdGVySW50KG9iai5jb2xzKTtcbiAgaWYgKCFvYmoudG90YWxDb2xzKSBvYmoudG90YWxDb2xzID0gb2JqLmNvbGxlY3Rpb24ubGVuZ3RoO1xuICBvYmouaXRlbVdpZHRoID0gZmlsdGVySW50KG9iai5pdGVtV2lkdGgpO1xuICBpZiAoIW9iai5pdGVtV2lkdGgpIGVycm9yKFwiJ2l0ZW0td2lkdGgnIHJlcXVpcmVkIGluIGhvcml6b250YWwgbW9kZVwiKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai53IC8gb2JqLml0ZW1XaWR0aCk7XG4gIG9iai5tYXhCdWZmZXIgPSBNYXRoLmNlaWwob2JqLnNjcmVlbkl0ZW1zTGVuICogb2JqLml0ZW1XaWR0aCk7XG4gIG9iai4kc2Nyb2xsZXIgPSBzY3JvbGxlcihvYmouaXRlbVdpZHRoICogb2JqLnRvdGFsQ29scywgb2JqLm1vZGUsIG9iai4kc2Nyb2xsZXIpO1xuICBvYmouJGNvbnRhaW5lciA9IG9iai4kY29udGFpbmVyIHx8IGNyZWF0ZUNvbnRhaW5lcihvYmoud2lkdGgsIG9iai5oZWlnaHQsIG9iai5tb2RlKTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlVmVydGljYWxNb2RlKG9iaikge1xuICBvYmoudG90YWxSb3dzID0gZmlsdGVySW50KG9iai5yb3dzKTtcbiAgb2JqLml0ZW1IZWlnaHQgPSBmaWx0ZXJJbnQob2JqLml0ZW1IZWlnaHQpO1xuICBpZiAoIW9iai50b3RhbFJvd3MpIG9iai50b3RhbFJvd3MgPSBvYmouY29sbGVjdGlvbi5sZW5ndGg7XG4gIGlmICghb2JqLml0ZW1IZWlnaHQpIGVycm9yKFwiJ2l0ZW0taGVpZ2h0JyByZXF1aXJlZCBpbiB2ZXJ0aWNhbCBtb2RlXCIpO1xuICBvYmouc2NyZWVuSXRlbXNMZW4gPSBNYXRoLmNlaWwob2JqLmggLyBvYmouaXRlbUhlaWdodCk7XG4gIG9iai5tYXhCdWZmZXIgPSBNYXRoLmNlaWwob2JqLnNjcmVlbkl0ZW1zTGVuICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVHcmlkTW9kZShvYmopIHtcbiAgb2JqLnRvdGFsQ29scyA9IGZpbHRlckludChvYmouY29scyk7XG4gIG9iai50b3RhbFJvd3MgPSBmaWx0ZXJJbnQob2JqLnJvd3MpO1xuICBvYmouaXRlbUhlaWdodCA9IGZpbHRlckludChvYmouaXRlbUhlaWdodCk7XG4gIG9iai5pdGVtV2lkdGggPSBmaWx0ZXJJbnQob2JqLml0ZW1XaWR0aCk7XG4gIGlmICghb2JqLml0ZW1IZWlnaHQpIGVycm9yKFwiJ2l0ZW0taGVpZ2h0JyByZXF1aXJlZCBpbiBncmQgbW9kZVwiKTtcbiAgaWYgKCFvYmouaXRlbVdpZHRoKSBlcnJvcihcIidpdGVtLXdpZHRoJyByZXF1aXJlZCBpbiBncmlkIG1vZGVcIik7XG4gIGlmICghb2JqLnRvdGFsQ29scykgb2JqLnRvdGFsQ29scyA9IE1hdGguZmxvb3IoKG9iai53IC8gb2JqLml0ZW1XaWR0aCkpO1xuICBpZiAoIW9iai50b3RhbFJvd3MpIG9iai50b3RhbFJvd3MgPSBNYXRoLmNlaWwob2JqLmNvbGxlY3Rpb24ubGVuZ3RoIC8gb2JqLnRvdGFsQ29scyk7XG4gIC8vIGNvbnNvbGUubG9nKFwib2JqLnRvdGFsQ29sc1wiLCBvYmoudG90YWxDb2xzKTtcbiAgb2JqLnNjcmVlbkl0ZW1zTGVuID0gTWF0aC5jZWlsKG9iai5oIC8gb2JqLml0ZW1IZWlnaHQpICogb2JqLnRvdGFsQ29scztcbiAgLy8gY29uc29sZS5sb2coXCJvYmouc2NyZWVuSXRlbXNMZW5cIiwgb2JqLnNjcmVlbkl0ZW1zTGVuKTtcbiAgb2JqLm1heEJ1ZmZlciA9IE1hdGguY2VpbChvYmouc2NyZWVuSXRlbXNMZW4gLyBvYmoudG90YWxDb2xzICogb2JqLml0ZW1IZWlnaHQpO1xuICBvYmouJHNjcm9sbGVyID0gc2Nyb2xsZXIob2JqLml0ZW1IZWlnaHQgKiBvYmoudG90YWxSb3dzLCBvYmoubW9kZSwgb2JqLiRzY3JvbGxlcik7XG4gIG9iai4kY29udGFpbmVyID0gb2JqLiRjb250YWluZXIgfHwgY3JlYXRlQ29udGFpbmVyKG9iai53aWR0aCwgb2JqLmhlaWdodCwgb2JqLm1vZGUpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ29udGFpbmVyKHcsIGgsIG1vZGUpIHtcbiAgbGV0ICRjID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICBsZXQgY3NzID0ge1xuICAgIHdpZHRoOiB3LFxuICAgIGhlaWdodDogaCxcbiAgICAnb3ZlcmZsb3cteSc6ICdhdXRvJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgcGFkZGluZzogMFxuICB9XG4gIGlmIChtb2RlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBkZWxldGUgY3NzWydvdmVyZmxvdy15J107XG4gICAgY3NzWydvdmVyZmxvdy14J10gPSAnYXV0byc7XG4gIH1cbiAgJGMuY3NzKGNzcyk7XG4gICRjLmFkZENsYXNzKCdzLWNvbnRhaW5lcicpXG4gIHJldHVybiAkYztcbn1cbiIsImxldCBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5pbXBvcnQgc1ZzY3JvbGxlclNydmMgZnJvbSAnLi9zVnNjcm9sbGVyU3J2Yy5zZXJ2aWNlJztcbmltcG9ydCBzVnNjcm9sbGVyIGZyb20gXCIuL3NWc2Nyb2xsZXIuZGlyZWN0aXZlXCI7XG5pbXBvcnQgc1ZzY3JvbGxlckN0cmwgZnJvbSAnLi9zVnNjcm9sbGVyQ3RybCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzdi1zY3JvbGxlcicsIFtdKVxuICAuZmFjdG9yeSgnc1ZzY3JvbGxlclNydmMnLCAoKSA9PiBzVnNjcm9sbGVyU3J2YylcbiAgLmRpcmVjdGl2ZSgnc1ZzY3JvbGxlcicsIHNWc2Nyb2xsZXIuZmFjdG9yeSlcbiAgLmNvbnRyb2xsZXIoJ3NWc2Nyb2xsZXJDdHJsJywgc1ZzY3JvbGxlckN0cmwpXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBzVnNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXN0cmljdCA9ICdFJztcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSAnc1ZzY3JvbGxlckN0cmwgYXMgc3ZjJztcbiAgICB0aGlzLmJpbmRUb0NvbnRyb2xsZXIgPSB7XG4gICAgICBpdGVyYXRvcjogJzwnLFxuICAgICAgY29sbGVjdGlvbjogJz0nLFxuICAgICAgbW9kZTogJzwnLFxuICAgICAgdzogJzwnLFxuICAgICAgaDogJzwnLFxuICAgICAgcm93czogJzwnLFxuICAgICAgY29sczogJzwnLFxuICAgICAgaXRlbUhlaWdodDogJzwnLFxuICAgICAgaXRlbVdpZHRoOiAnPCcsXG4gICAgICBpbmZpbml0ZVNjcm9sbDogJyYnXG4gICAgfTtcbiAgICB0aGlzLnRyYW5zY2x1ZGUgPSB0cnVlO1xuICB9XG5cbiAgc3RhdGljIGZhY3RvcnkoKSB7XG4gICAgc1ZzY3JvbGxlci5pbnN0YW5jZSA9IG5ldyBzVnNjcm9sbGVyKCk7XG4gICAgcmV0dXJuIHNWc2Nyb2xsZXIuaW5zdGFuY2U7XG4gIH1cblxufVxuXG5zVnNjcm9sbGVyLmZhY3RvcnkuJGluamVjdCA9IFtdO1xuIiwiaW1wb3J0IENvbmZpZyBmcm9tICcuL0NvbmZpZyc7XG5pbXBvcnQge2Vycm9yfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBzY3JvbGxlciBmcm9tICcuL3Njcm9sbGVyJztcbmNvbnN0IFJFTU9WRV9JTlRFUlZBTCA9IDMwMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc1ZzY3JvbGxlckN0cmwoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSwgJGludGVydmFsLCAkdGltZW91dCwgc1ZzY3JvbGxlclNydmMpIHtcbiAgbGV0IGN0cmwgPSB7fTtcbiAgY3RybC5jb25maWcgPSBuZXcgQ29uZmlnKCk7XG4gIGN0cmwubmFtZXNwYWNlID0gJGF0dHJzLmlkID8gJGF0dHJzLmlkICsgJzonIDogJyc7XG4gIGN0cmwuaW5maW5pdGVTY3JvbGwgPSB0aGlzLmluZmluaXRlU2Nyb2xsO1xuXG4gICR0aW1lb3V0KCgpID0+IHtcbiAgICBsZXQgcGFyZW50ID0gJGVsZW1lbnQucGFyZW50KClbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5wYXJlbnREaW1zID0ge1xuICAgICAgaGVpZ2h0OiBwYXJlbnQuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHBhcmVudC53aWR0aFxuICAgIH07XG5cbiAgICBpbml0aWFsaXplKHRoaXMpO1xuICB9LCAyMDApXG5cblxuICAkc2NvcGUuJHdhdGNoQ29sbGVjdGlvbigoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbjtcbiAgfSwgKG4sIG8pID0+IHtcbiAgICBpZiAobiAhPT0gbykge1xuICAgICAgY3RybC5jb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuICAgICAgaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgIG9uU2Nyb2xsSGFuZGxlcigpO1xuICAgIH1cbiAgfSlcblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KGkpIHtcbiAgICBsZXQgJGl0ZW0gPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgbGV0IGNzcyA9IHtcbiAgICAgIGhlaWdodDogY3RybC5pdGVtSGVpZ2h0ICsgJ3B4JyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogKGkgKiBjdHJsLml0ZW1IZWlnaHQpICsgJ3B4J1xuICAgIH1cbiAgICBpZiAoY3RybC5tb2RlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGNzcy5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICBjc3NbJ21pbi1oZWlnaHQnXSA9ICcxMDAlJztcbiAgICAgIGRlbGV0ZSBjc3MudG9wO1xuICAgICAgY3NzLmxlZnQgPSAoaSAqIGN0cmwuaXRlbVdpZHRoKSArICdweCc7XG4gICAgICBjc3Mud2lkdGggPSBjdHJsLml0ZW1XaWR0aCArICdweCc7XG4gICAgfVxuXG4gICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSB7XG4gICAgICBsZXQgY29sID0gMDtcbiAgICAgIGxldCByb3cgPSBwYXJzZUludChpIC8gY3RybC50b3RhbENvbHMpO1xuICAgICAgY29sID0gaSAtIChjdHJsLnRvdGFsQ29scyAqIHJvdyk7XG4gICAgICBjc3MudG9wID0gcm93ICogY3RybC5pdGVtSGVpZ2h0ICsgJ3B4JztcbiAgICAgIGNzcy5sZWZ0ID0gKGNvbCAqIGN0cmwuaXRlbVdpZHRoKSArICdweCc7XG4gICAgICBjc3Mud2lkdGggPSBjdHJsLml0ZW1XaWR0aCArICdweCc7XG4gICAgICBjc3NbJ21pbi1oZWlnaHQnXSA9IGN0cmwuaXRlbUhlaWdodCArICdweCc7XG4gICAgfVxuXG4gICAgJGl0ZW0uY3NzKGNzcyk7XG4gICAgJGl0ZW0uYWRkQ2xhc3MoY3RybC5tb2RlID09PSAnaG9yaXpvbnRhbCcgPyAncy12Y29sJyA6ICdzLXZyb3cnKTtcbiAgICBpZiAoY3RybC5tb2RlID09PSAnZ3JpZCcpICRpdGVtLmFkZENsYXNzKCdzLXZjb2wnKTtcbiAgICAkdHJhbnNjbHVkZSgoZWwsIHNjb3BlKSA9PiB7XG4gICAgICBzY29wZVtjdHJsLml0ZXJhdG9yXSA9IGN0cmwuY29sbGVjdGlvbltpXTtcbiAgICAgICRpdGVtLmFwcGVuZChlbCk7XG4gICAgfSk7XG4gICAgLy8gc2V0VGltZW91dCgoKSA9PiB7JGl0ZW0uY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KX0sIDEwKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCRpdGVtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoY29uZmlnKSB7XG4gICAgT2JqZWN0LmFzc2lnbihjdHJsLCBjdHJsLmNvbmZpZy5pbml0aWFsaXplKGNvbmZpZykpO1xuICAgIGlmICgkZWxlbWVudC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkgJGVsZW1lbnQuYXBwZW5kKGN0cmwuJGNvbnRhaW5lcik7XG4gICAgY3RybC4kY29udGFpbmVyLnVuYmluZCgnc2Nyb2xsJyk7XG4gICAgY3RybC4kY29udGFpbmVyLmJpbmQoJ3Njcm9sbCcsIG9uU2Nyb2xsSGFuZGxlcik7XG4gICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCAwKTtcbiAgICBzVnNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAnc2Nyb2xsVG9FbGVtZW50Jywgc2Nyb2xsVG9FbGVtZW50KTtcbiAgICBzVnNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAnc2Nyb2xsVG9WaWV3Jywgc2Nyb2xsVG9WaWV3KTtcbiAgICBzVnNjcm9sbGVyU3J2Yy5zdWJzY3JpYmUoY3RybC5uYW1lc3BhY2UgKyAncmVzZXQnLCByZXNldCk7XG4gICAgJGludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChEYXRlLm5vdygpIC0gY3RybC5sYXN0U2Nyb2xsZWQgPiAyMDApIHtcbiAgICAgICAgbGV0ICRiYWROb2RlcyA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1ybS1ub2RlPVwiJyArIGN0cmwuYmFkTm9kZU1hcmtlciArICdcIl0nKSk7XG4gICAgICAgICRiYWROb2Rlcy5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9LCBSRU1PVkVfSU5URVJWQUwpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TY3JvbGxIYW5kbGVyKCkge1xuICAgIGxldCB0YXJnZXQgPSBjdHJsLiRjb250YWluZXJbMF07XG4gICAgbGV0IGZpcnN0LCBzY3JvbGxMZWZ0LCBzY3JvbGxUb3A7XG5cbiAgICBzd2l0Y2goY3RybC5tb2RlKSB7XG4gICAgICBjYXNlICdob3Jpem9udGFsJzpcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHRhcmdldC5zY3JvbGxMZWZ0O1xuICAgICAgICBpZiAoKE1hdGguYWJzKHNjcm9sbExlZnQgLSBjdHJsLmxhc3RSZXBhaW50WCkgPiBjdHJsLm1heEJ1ZmZlcikgfHwgc2Nyb2xsTGVmdCA9PT0gMCkge1xuICAgICAgICAgIGZpcnN0ID0gcGFyc2VJbnQoc2Nyb2xsTGVmdCAvIGN0cmwuaXRlbVdpZHRoKSAtIGN0cmwuc2NyZWVuSXRlbXNMZW47XG4gICAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBmaXJzdCA8IDAgPyAwIDogZmlyc3QpO1xuICAgICAgICAgIGN0cmwubGFzdFJlcGFpbnRYID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dyaWQnOlxuICAgICAgICBzY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNjcm9sbFRvcFwiLCBzY3JvbGxUb3AsICcgY3RybC5sYXN0UmVwYWludFknLCBjdHJsLmxhc3RSZXBhaW50WSwgJyBjdHJsLm1heEJ1ZmZlciAnLCBjdHJsLm1heEJ1ZmZlcik7XG4gICAgICAgIGlmICgoTWF0aC5hYnMoc2Nyb2xsVG9wIC0gY3RybC5sYXN0UmVwYWludFkpID4gY3RybC5tYXhCdWZmZXIpIHx8IHNjcm9sbFRvcCA9PT0gMCkge1xuICAgICAgICAgIGZpcnN0ID0gcGFyc2VJbnQoc2Nyb2xsVG9wIC8gY3RybC5pdGVtSGVpZ2h0ICogY3RybC50b3RhbENvbHMpIC0gY3RybC5zY3JlZW5JdGVtc0xlbjtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZpcnN0XCIsIGZpcnN0LCBcInNjcmVlbkl0ZW1zTGVuIFwiLCBjdHJsLnNjcmVlbkl0ZW1zTGVuKTtcbiAgICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGZpcnN0IDwgMCA/IDAgOiBmaXJzdCk7XG4gICAgICAgICAgY3RybC5sYXN0UmVwYWludFkgPSBzY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgICAgICBpZiAoKE1hdGguYWJzKHNjcm9sbFRvcCAtIGN0cmwubGFzdFJlcGFpbnRZKSA+IGN0cmwubWF4QnVmZmVyKSB8fCBzY3JvbGxUb3AgPT09IDApIHtcbiAgICAgICAgICBmaXJzdCA9IHBhcnNlSW50KHNjcm9sbFRvcCAvIGN0cmwuaXRlbUhlaWdodCkgLSBjdHJsLnNjcmVlbkl0ZW1zTGVuO1xuICAgICAgICAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgZmlyc3QgPCAwID8gMCA6IGZpcnN0KTtcbiAgICAgICAgICBjdHJsLmxhc3RSZXBhaW50WSA9IHNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGN0cmwubGFzdFNjcm9sbGVkID0gRGF0ZS5ub3coKTtcbiAgICB0YXJnZXQucHJldmVudERlZmF1bHQgJiYgdGFyZ2V0LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJDaHVuaygkbm9kZSwgZnJvbSkge1xuICAgIGxldCBwcm9taXNlcyA9IFtdO1xuICAgIGxldCBmaW5hbEl0ZW0gPSBmcm9tICsgY3RybC5jYWNoZWRJdGVtc0xlbiAqIDM7XG4gICAgbGV0IHRvdGFsRWxlbWVudHMgPSBjdHJsLm1vZGUgPT09ICdob3Jpem9udGFsJyA/IGN0cmwudG90YWxDb2xzIDogY3RybC5tb2RlID09PSAnZ3JpZCcgPyBjdHJsLnRvdGFsQ29scyAqIGN0cmwudG90YWxSb3dzIDogY3RybC50b3RhbFJvd3M7XG4gICAgLy8gY29uc29sZS5sb2coXCJmcm9tXCIsIGZyb20sIFwiIGZpbmFsSXRlbSBcIiwgZmluYWxJdGVtLCBcIiB0b3RhbEVsZW1lbnRzIFwiLCB0b3RhbEVsZW1lbnRzKTtcbiAgICBpZiAoZmluYWxJdGVtID4gdG90YWxFbGVtZW50cykgZmluYWxJdGVtID0gdG90YWxFbGVtZW50cztcbiAgICBsZXQgJGZyYWdtZW50ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gICAgZm9yICh2YXIgaSA9IGZyb207IGkgPCBmaW5hbEl0ZW07IGkrKykge1xuICAgICAgcHJvbWlzZXMucHVzaChjcmVhdGVFbGVtZW50KGkpKTtcbiAgICAgIC8vICRmcmFnbWVudC5hcHBlbmQoY3JlYXRlRWxlbWVudChpKSk7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhbmQgbWFyayBvYnNvbGV0ZSBub2RlcyBmb3IgZGVsZXRpb24uXG4gICAgbGV0ICRjaGlsZHJlbiA9ICRub2RlLmNoaWxkcmVuKCk7XG4gICAgZm9yICh2YXIgaiA9IDEsIGwgPSAkY2hpbGRyZW4ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICBsZXQgY2hpbGQgPSAkY2hpbGRyZW5bal07XG4gICAgICBjaGlsZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLXJtLW5vZGUnLCBjdHJsLmJhZE5vZGVNYXJrZXIpO1xuICAgIH1cblxuICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgcmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICRmcmFnbWVudC5hcHBlbmQocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgICAgJG5vZGUuYXBwZW5kKCRmcmFnbWVudCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KGNvbmZpZykge1xuICAgIGluaXRpYWxpemUoY29uZmlnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbFRvRWxlbWVudChpbmRleCkge1xuICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgsIDEwKTtcbiAgICBjb25zb2xlLmxvZyhcImluZGV4XCIsIGluZGV4KTtcbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykge1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGluZGV4KTtcbiAgICAgICAgaWYgKGN0cmwubW9kZSA9PT0gJ2hvcml6b250YWwnKSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCA9IGluZGV4ICogY3RybC5pdGVtV2lkdGg7XG4gICAgICAgIGVsc2UgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gTWF0aC5jZWlsKGluZGV4ICogY3RybC5pdGVtSGVpZ2h0IC8gY3RybC50b3RhbENvbHMpO1xuICAgICAgICBlbHNlIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBpbmRleCAqIGN0cmwuaXRlbUhlaWdodDtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgKGluZGV4IDwgY3RybC5zY3JlZW5JdGVtc0xlbikge1xuICAgICAgLy8gICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgLy8gICBpZiAoY3RybC5tb2RlID09PSAnaG9yaXpvbnRhbCcpIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgIC8vICAgZWxzZSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gMDtcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgIHJlbmRlckNodW5rKGN0cmwuJGNvbnRhaW5lciwgaW5kZXgpO1xuICAgICAgLy8gICBpZiAoY3RybC5tb2RlID09PSAnaG9yaXpvbnRhbCcpIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gaW5kZXggKiBjdHJsLml0ZW1XaWR0aDtcbiAgICAgIC8vICAgZWxzZSBpZiAoY3RybC5tb2RlID09PSAnZ3JpZCcpIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBNYXRoLmNlaWwoaW5kZXggKiBjdHJsLml0ZW1IZWlnaHQgLyBjdHJsLnRvdGFsQ29scyk7XG4gICAgICAvLyAgIGVsc2UgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IGluZGV4ICogY3RybC5pdGVtSGVpZ2h0O1xuICAgICAgLy8gfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbFRvVmlldyh0b2tlbikge1xuICAgIGN0cmwuc2Nyb2xsVG9WaWV3ID0gdG9rZW47XG4gICAgc3dpdGNoKGN0cmwuc2Nyb2xsVG9WaWV3KSB7XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIGN0cmwudG90YWxSb3dzKTtcbiAgICAgICAgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IHBhcnNlSW50KGN0cmwudG90YWxSb3dzICogY3RybC5pdGVtSGVpZ2h0LCAxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgLSBwYXJzZUludChjdHJsLml0ZW1XaWR0aCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4sIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbExlZnQgKyBwYXJzZUludChjdHJsLml0ZW1XaWR0aCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4sIDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiZWdpbm5pbmcnOlxuICAgICAgICByZW5kZXJDaHVuayhjdHJsLiRjb250YWluZXIsIDApO1xuICAgICAgICBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgcmVuZGVyQ2h1bmsoY3RybC4kY29udGFpbmVyLCBjdHJsLnRvdGFsQ29scyk7XG4gICAgICAgIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxMZWZ0ID0gY3RybC50b3RhbENvbHMgKiBjdHJsLml0ZW1XaWR0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cCc6XG4gICAgICAgIGlmIChjdHJsLm1vZGUgPT09ICdncmlkJykgY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCA9IGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgLSBNYXRoLmNlaWwoY3RybC5pdGVtSGVpZ2h0ICogY3RybC5zY3JlZW5JdGVtc0xlbiAvIGN0cmwudG90YWxDb2xzKTtcbiAgICAgICAgZWxzZSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCAtIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgaWYgKGN0cmwubW9kZSA9PT0gJ2dyaWQnKSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wID0gY3RybC4kY29udGFpbmVyWzBdLnNjcm9sbFRvcCArIE1hdGguY2VpbChjdHJsLml0ZW1IZWlnaHQgKiBjdHJsLnNjcmVlbkl0ZW1zTGVuIC8gY3RybC50b3RhbENvbHMpO1xuICAgICAgICBlbHNlIGN0cmwuJGNvbnRhaW5lclswXS5zY3JvbGxUb3AgPSBjdHJsLiRjb250YWluZXJbMF0uc2Nyb2xsVG9wICsgTWF0aC5jZWlsKGN0cmwuaXRlbUhlaWdodCAqIGN0cmwuc2NyZWVuSXRlbXNMZW4pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxufVxuXG5zVnNjcm9sbGVyQ3RybC4kaW5qZWN0ID0gW1xuICAnJHNjb3BlJyxcbiAgJyRlbGVtZW50JyxcbiAgJyRhdHRycycsXG4gICckdHJhbnNjbHVkZScsXG4gICckaW50ZXJ2YWwnLFxuICAnJHRpbWVvdXQnLFxuICAnc1ZzY3JvbGxlclNydmMnXG5dO1xuIiwibGV0IHRvcGljcyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWRkVG9waWModG9waWMpIHtcbiAgICBpZiAoIXRvcGljc1t0b3BpY10pIHRvcGljc1t0b3BpY10gPSBbXTtcbiAgfSxcblxuICBkZWxUb3BpYyh0b3BpYykge1xuICAgIGlmICh0b3BpY3NbdG9waWNdKSB7XG4gICAgICB0b3BpY3NbdG9waWNdLmZvckVhY2goc3Vic2NyaWJlciA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgfSk7XG4gICAgICBkZWxldGUgdG9waWNzW3RvcGljXTtcbiAgICB9XG4gIH0sXG5cbiAgcHVibGlzaCh0b3BpYywgZGF0YSkge1xuICAgIGlmICghdG9waWNzW3RvcGljXSB8fCB0b3BpY3NbdG9waWNdLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICB0b3BpY3NbdG9waWNdLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgbGlzdGVuZXIoZGF0YSB8fCB7fSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3Vic2NyaWJlKHRvcGljLCBsaXN0ZW5lcikge1xuICAgIGlmICghdG9waWNzW3RvcGljXSkgdG9waWNzW3RvcGljXSA9IFtdO1xuICAgIGxldCBjdXJyTGlzdGVuZXIgPSB0b3BpY3NbdG9waWNdLmZpbmQoKGxpc3RucikgPT4gbGlzdG5yID09PSBsaXN0ZW5lcik7XG4gICAgaWYgKCFjdXJyTGlzdGVuZXIpIHRvcGljc1t0b3BpY10ucHVzaChsaXN0ZW5lcik7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNjcm9sbGVyKHNpemUsIG1vZGUsICRzY3JvbGxlcikge1xuICAkc2Nyb2xsZXIgPSAkc2Nyb2xsZXIgfHwgYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuXG4gIGxldCBjc3MgPSB7XG4gICAgb3BhY2l0eTogMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICB3aWR0aDogJzFweCcsXG4gICAgaGVpZ2h0OiBzaXplICsgJ3B4J1xuICB9O1xuXG4gIGlmIChtb2RlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBjc3Mud2lkdGggPSBzaXplICsgJ3B4JztcbiAgICBjc3MuaGVpZ2h0ID0gJzFweCc7XG4gIH1cblxuICAkc2Nyb2xsZXIuY3NzKGNzcyk7XG4gIHJldHVybiAkc2Nyb2xsZXI7XG59XG4iLCJmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySW50KHZhbCkge1xuICBpZiAoL14oXFwtfFxcKyk/KFswLTldK3xJbmZpbml0eSkkLy50ZXN0KHZhbCkpIHJldHVybiBOdW1iZXIodmFsKTtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHV1aWQoc2hvcnQpIHtcbiAgbGV0IGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgbGV0IHV1aWRTdHJpbmcgPSBzaG9ydCA/ICc0eHh4LXh4eHh4eCcgOiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgbGV0IHV1aWQgPSB1dWlkU3RyaW5nLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuICAgIGxldCByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgcmV0dXJuIChjID09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KTtcbiAgfSk7XG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQge1xuICBlcnJvcixcbiAgZmlsdGVySW50LFxuICB1dWlkXG59O1xuIl19
