import Config from './Config';
import {error} from './utils';
import scroller from './scroller';
const REMOVE_INTERVAL = 300;

export default function sVscrollerCtrl($scope, $element, $attrs, $transclude, $interval, $timeout, sVscrollerSrvc) {
  let ctrl = {};
  ctrl.config = new Config();
  ctrl.namespace = $attrs.id ? $attrs.id + ':' : '';
  ctrl.infiniteScroll = this.infiniteScroll;

  $timeout(() => {
    let parent = $element.parent()[0].getBoundingClientRect();
    this.parentDims = {
      height: parent.height,
      width: parent.width
    };

    initialize(this);
  }, 200)


  $scope.$watchCollection(() => {
    return this.iterable;
  }, (n, o) => {
    if (n !== o) {
      ctrl.iterable = this.iterable;
      initialize(this);
      onScrollHandler();
    }
  })

  function createElement(i) {
    let $item = angular.element('<div></div>');
    let css = {
      height: ctrl.itemHeight + 'px',
      width: '100%',
      position: 'absolute',
      top: (i * ctrl.itemHeight) + 'px'
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
    $interval(() => {
      if (Date.now() - ctrl.lastScrolled > 200) {
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
        if ((Math.abs(scrollLeft - ctrl.lastRepaintX) > ctrl.maxBuffer) || scrollLeft === 0) {
          first = parseInt(scrollLeft / ctrl.itemWidth) - ctrl.screenItemsLen;
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintX = scrollLeft;
        }
        break;
      case 'grid':
        scrollTop = target.scrollTop;
        // console.log("scrollTop", scrollTop, ' ctrl.lastRepaintY', ctrl.lastRepaintY, ' ctrl.maxBuffer ', ctrl.maxBuffer);
        if ((Math.abs(scrollTop - ctrl.lastRepaintY) > ctrl.maxBuffer) || scrollTop === 0) {
          first = parseInt(scrollTop / ctrl.itemHeight * ctrl.totalCols) - ctrl.screenItemsLen;
          // console.log("first", first, "screenItemsLen ", ctrl.screenItemsLen);
          renderChunk(ctrl.$container, first < 0 ? 0 : first);
          ctrl.lastRepaintY = scrollTop;
        }
        break;
      default:
        scrollTop = target.scrollTop;
        if ((Math.abs(scrollTop - ctrl.lastRepaintY) > ctrl.maxBuffer) || scrollTop === 0) {
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
      // $fragment.append(createElement(i));
    }

    // Hide and mark obsolete nodes for deletion.
    let $children = $node.children();
    for (var j = 1, l = $children.length; j < l; j++) {
      let child = $children[j];
      child.style.display = 'none';
      child.setAttribute('data-rm-node', ctrl.badNodeMarker);
    }

    Promise.all(promises).then(results => {
      results.forEach(result => {
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
      if (ctrl.mode === 'grid') {

      } else {
        renderChunk(ctrl.$container, index);
        if (ctrl.mode === 'horizontal') ctrl.$container[0].scrollLeft = index * ctrl.itemWidth;
        else if (ctrl.mode === 'grid') ctrl.$container[0].scrollTop = Math.ceil(index * ctrl.itemHeight / ctrl.totalCols);
        else ctrl.$container[0].scrollTop = index * ctrl.itemHeight;
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

sVscrollerCtrl.$inject = [
  '$scope',
  '$element',
  '$attrs',
  '$transclude',
  '$interval',
  '$timeout',
  'sVscrollerSrvc'
];
