export default class svScroller {
  constructor() {
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

  static factory() {
    svScroller.instance = new svScroller();
    return svScroller.instance;
  }

}

svScroller.factory.$inject = [];
