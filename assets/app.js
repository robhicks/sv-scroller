angular.module('App', ['sv-scroller'])
.controller('MainCtrl', ['sVscrollerSrvc', '$timeout', function(sVscrollerSrvc, $timeout) {
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
    if (parseInt(idx, 10)) {
      if(direction === 'vertical') sVscrollerSrvc.publish('vertical:scrollToElement', idx);
      if (direction === 'horizontal') sVscrollerSrvc.publish('horizontal:scrollToElement', idx);
      if (direction === 'grid') sVscrollerSrvc.publish('grid:scrollToElement', idx);
    }
  }

  this.horizontalView = function(token) {
    sVscrollerSrvc.publish('horizontal:scrollToView', token);
  }

  this.verticalView = function(token) {
    sVscrollerSrvc.publish('vertical:scrollToView', token);
  }

  this.gridView = function(token) {
    sVscrollerSrvc.publish('grid:scrollToView', token);
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

  this.resizeGrid = function(size) {
    sVscrollerSrvc.publish('grid:reset', {itemHeight: size, itemWidth: size});
  }

  $timeout(() => {
    console.log("resetting");
    this.items = this.injectedItems;
  }, 1000);

}])
