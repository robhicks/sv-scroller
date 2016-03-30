angular.module('App', ['sv-scroller'])
.controller('MainCtrl', ['svScrollerSrvc', '$timeout', function(svScrollerSrvc, $timeout) {
  let iterations = 500;
  let injectedIterations = 5000;
  this.items = [];
  // for (let i = 0; i < iterations; i++) {
  //   this.items.push({id: i});
  // }

  this.injectedItems = [];
  for (let i = 0; i < injectedIterations; i++) {
    this.injectedItems.push({id: i});
  }

  this.scrollToElement = function(idx, direction) {
    console.log("parseInt(idx, 10)", parseInt(idx, 10));
    if (parseInt(idx, 10)) {
      if(direction === 'vertical') svScrollerSrvc.publish('vertical:scrollToElement', idx);
      if (direction === 'horizontal') svScrollerSrvc.publish('horizontal:scrollToElement', idx);
      if (direction === 'grid') svScrollerSrvc.publish('grid:scrollToElement', idx);
    }
  }

  this.horizontalView = function(token) {
    svScrollerSrvc.publish('horizontal:scrollToView', token);
  }

  this.verticalView = function(token) {
    svScrollerSrvc.publish('vertical:scrollToView', token);
  }

  this.gridView = function(token) {
    svScrollerSrvc.publish('grid:scrollToView', token);
  }

  this.getMore = () => {
    $timeout(() => {
      let len = this.items.length;
      for (let i = len; i < len + 50; i++) {
        this.items.push({id: i});
      }
      console.log("this.items.length", this.items.length);
    }, 1000);
  }

  this.changeGridSize = function(size) {
    svScrollerSrvc.publish('grid:reset', {itemHeight: size, itemWidth: size});
  }

  $timeout(() => {
    console.log("resetting");
    this.items = this.injectedItems;
  }, 1000);

}])
