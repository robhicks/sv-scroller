let angular = require('angular');

import sVscrollerSrvc from './sVscrollerSrvc.service';
import sVscroller from "./sVscroller.directive";
import sVscrollerCtrl from './sVscrollerCtrl';

angular.module('sv-scroller', [])
  .factory('sVscrollerSrvc', () => sVscrollerSrvc)
  .directive('sVscroller', sVscroller.factory)
  .controller('sVscrollerCtrl', sVscrollerCtrl)
