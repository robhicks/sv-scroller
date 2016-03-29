let angular = require('angular');

import svScrollerSrvc from './svScrollerSrvc.service';
import svScroller from "./svScroller.directive";
import svScrollerCtrl from './svScrollerCtrl';

angular.module('sv-scroller', [])
  .factory('svScrollerSrvc', () => svScrollerSrvc)
  .directive('svScroller', svScroller.factory)
  .controller('svScrollerCtrl', svScrollerCtrl)
