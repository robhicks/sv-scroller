export default class sInView {
  constructor() {
    this.restrict = 'A';
    this.controller = function($scope, $element) {
      let $scrollEl = $element.parent().parent();
      let parentDims = $scrollEl[0].getBoundingClientRect();
      let transcluded = false;
      console.log("$element", $element);

      $scrollEl.bind('scroll', () => {
        let scrollTop = $scrollEl[0].scrollEl;

        let myDims = $element[0].getBoundingClientRect();
        let inView = (myDims.top >= parentDims.top && myDims.top <= parentDims.bottom && myDims.left >= parentDims.left && myDims.left <= parentDims.right)
                    || (myDims.top >= parentDims.top && myDims.top <= parentDims.bottom && myDims.right <= parentDims.right && myDims.right >= parentDims.left)
                    || (myDims.bottom <= parentDims.bottom && myDims.bottom >= parentDims.top && myDims.left >= parentDims.left && myDims.left <= parentDims.right)
                    || (myDims.bottom <= parentDims.bottom && myDims.bottom >= parentDims.top && myDims.right <= parentDims.right && myDims.right >= parentDims.left);

      })
    };
  }

  static factory() {
    sInView.instance = new sInView();
    return sInView.instance;
  }

}

sInView.factory.$inject = [];
