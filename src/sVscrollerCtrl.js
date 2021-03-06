import Config from './Config';
import {error} from './utils';
import scroller from './scroller';
const REMOVE_INTERVAL = 300;
const VISIBILITY_TIME = 1;
const REPAINT_WAIT = 200;

export default function svScrollerCtrl($scope, $element, $attrs, $transclude, $interval, $timeout, svScrollerSrvc) {
  let ctrl = this;
  ctrl.config = new Config();
  ctrl.namespace = $attrs.id ? $attrs.id + ':' : '';
  ctrl.infiniteScroll = this.infiniteScroll;

  initialize(ctrl);

  $scope.$watchCollection(() => {
    return this.collection;
  }, (n, o) => {
    if (n !== o) {
      ctrl.collection = this.collection;
      initialize(ctrl);
      onScrollHandler();
    }
  })

  svScrollerSrvc.subscribe(ctrl.namespace + 'scrollToElement', scrollToElement);
  svScrollerSrvc.subscribe(ctrl.namespace + 'scrollToView', scrollToView);
  svScrollerSrvc.subscribe(ctrl.namespace + 'reset', reset);
  svScrollerSrvc.subscribe(ctrl.namespace + 'isReady', isReady);

  function createElement(i) {
    let $item = angular.element('<div></div>');
    let css = {
      height: ctrl.itemHeight + 'px',
      width: '100%',
      position: 'absolute',
      top: (i * ctrl.itemHeight) + 'px',
      visibility: 'hidden'
    }
    if (ctrl.mode === 'horizontal') {
      css.height = '100%';
      css['min-height'] = '100%';
      delete css.top;
      css.left = (i * ctrl.itemWidth) + 'px';
      css.width = ctrl.itemWidth + 'px';
    }

    if (ctrl.mode === 'grid') {
      let col = 0;
      let row = parseInt(i / ctrl.totalCols);
      col = i - (ctrl.totalCols * row);
      css.top = row * ctrl.itemHeight + 'px';
      css.left = (col * ctrl.itemWidth) + 'px';
      css.width = ctrl.itemWidth + 'px';
      css['min-height'] = ctrl.itemHeight + 'px';
    }
    $item.css(css);
    $item.addClass(ctrl.mode === 'horizontal' ? 's-vcol' : 's-vrow');
    if (ctrl.mode === 'grid') $item.addClass('s-vcol');
    $transclude((el, scope) => {
      scope[ctrl.iterator] = ctrl.collection[i];
      $item.append(el);
    });
    setTimeout(() => {$item.css({visibility: 'visible'})}, VISIBILITY_TIME);
    return Promise.resolve($item);
  }

  function initialize(config = {}) {
    let parent = $element.parent()[0].getBoundingClientRect();
    ctrl.parentDims = {
      height: parent.height,
      width: parent.width
    };
    Object.assign(ctrl, config);
    Object.assign(ctrl, ctrl.config.initialize(ctrl));
    // console.log("ctrl", ctrl);
    if ($element.children().length === 0) $element.append(ctrl.$container);
    // console.log("ctrl.$container", ctrl.$container);
    ctrl.$container
      .unbind('scroll')
      .unbind('resize')
      .bind('scroll', onScrollHandler)
      .bind('resize', reset);
    // console.log("ctrl.$container", ctrl.$container);
    renderChunk(ctrl.$container, 0).then(mode => {
      // console.log('initialze', ctrl.namespace + 'ready');
      svScrollerSrvc.publish(ctrl.namespace + 'ready', true);
    });

    $interval(() => {
      if (Date.now() - ctrl.lastScrolled > REPAINT_WAIT) {
        let $badNodes = angular.element(document.querySelectorAll('[data-rm-node="' + ctrl.badNodeMarker + '"]'));
        $badNodes.remove();
      }
    }, REMOVE_INTERVAL);
  }

  function onScrollHandler() {
    let target = ctrl.$container[0];
    let first, scrollLeft, scrollTop;

    switch(ctrl.mode) {
      case 'horizontal':
        scrollLeft = target.scrollLeft;
        if ((Math.abs(scrollLeft - ctrl.lastRepaintX) > ctrl.maxBuffer)) {
          first = parseInt(scrollLeft / ctrl.itemWidth) - ctrl.screenItemsLen;
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintX = scrollLeft;
        }
        break;
      case 'grid':
        scrollTop = target.scrollTop;
        // console.log("scrollTop", scrollTop, ' ctrl.lastRepaintY', ctrl.lastRepaintY, ' ctrl.maxBuffer ', ctrl.maxBuffer);
        if ((Math.abs(scrollTop - ctrl.lastRepaintY) > ctrl.maxBuffer)) {
          first = parseInt(scrollTop / ctrl.itemHeight * ctrl.totalCols) - ctrl.screenItemsLen;
          // console.log("first", first, "screenItemsLen ", ctrl.screenItemsLen);
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintY = scrollTop;
        }
        break;
      default:
        scrollTop = target.scrollTop;
        if ((Math.abs(scrollTop - ctrl.lastRepaintY) > ctrl.maxBuffer)) {
          first = parseInt(scrollTop / ctrl.itemHeight) - ctrl.screenItemsLen;
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintY = scrollTop;
        }
    }

    ctrl.lastScrolled = Date.now();
    target.preventDefault && target.preventDefault();
  }

  function renderChunk($node, from) {
    let promises = [];
    let finalItem = from + ctrl.cachedItemsLen * 3;
    let totalElements = ctrl.mode === 'horizontal' ? ctrl.totalCols : ctrl.mode === 'grid' ? ctrl.totalCols * ctrl.totalRows : ctrl.totalRows;
    // console.log("from", from, " finalItem ", finalItem, " totalElements ", totalElements);
    if (finalItem > totalElements) finalItem = totalElements;
    let $fragment = angular.element(document.createDocumentFragment());
    for (var i = from; i < finalItem; i++) {
      promises.push(createElement(i));
    }

    // Hide and mark obsolete nodes for deletion.
    let $children = $node.children();
    for (var j = 1, l = $children.length; j < l; j++) {
      let child = $children[j];
      child.style.display = 'none';
      child.setAttribute('data-rm-node', ctrl.badNodeMarker);
    }

    return Promise.all(promises).then(results => {
      results.forEach(result => {
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
    switch(ctrl.mode) {
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
    switch(ctrl.scrollToView) {
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
        if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop - Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen / ctrl.totalCols);
        else ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop - Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen);
        break;
      case 'down':
        if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop + Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen / ctrl.totalCols);
        else ctrl.$container[0].scrollTop = ctrl.$container[0].scrollTop + Math.ceil(ctrl.itemHeight * ctrl.screenItemsLen);
        break;
    }
  }

}

svScrollerCtrl.$inject = [
  '$scope',
  '$element',
  '$attrs',
  '$transclude',
  '$interval',
  '$timeout',
  'svScrollerSrvc'
];
