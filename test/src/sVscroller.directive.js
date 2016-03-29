export default class sVscroller {
  constructor() {
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

  static factory() {
    sVscroller.instance = new sVscroller();
    return sVscroller.instance;
  }

}

sVscroller.factory.$inject = [];
