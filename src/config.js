import {error, filterInt, uuid} from './utils';
import createContainer from './createContainer';
import scroller from './scroller';

const CACHED_ITEMS_MULTIPLE = 1;

export default class {

  constructor() {
    this.totalRows = 0;
    this.totalCols = 0;
    this.lastRepaintY = 0;
    this.lastRepaintX = 0;
    this.lastScrolled = 0;
    this.badNodeMarker = uuid(true);
  }

  initialize(conf) {
    let config = {};
    Object.assign(config, this, conf);
    this.w = config.w ? filterInt(config.w) : config.parentDims.width;;
    this.h = config.h ? filterInt(config.h) : config.parentDims.height;
    this.width = this.w ? this.w + 'px' : '100%';
    this.height = this.h ? this.h + 'px' : '100%';
    this.mode = config.mode || 'vertical';
    if (this.mode !== 'vertical' && this.mode !== 'horizontal' && this.mode !== 'grid') error('wrong type');
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
}

function configureHorizontalMode(obj) {
  obj.totalCols = filterInt(obj.cols);
  if (!obj.totalCols) obj.totalCols = obj.collection.length;
  obj.itemWidth = filterInt(obj.itemWidth);
  if (!obj.itemWidth) error("'item-width' required in horizontal mode");
  obj.screenItemsLen = Math.ceil(obj.w / obj.itemWidth);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen * obj.itemWidth);
  obj.$scroller = scroller(obj.itemWidth * obj.totalCols, obj.mode, obj.$scroller);
  obj.$container = obj.$container || createContainer(obj.width, obj.height, obj.mode);
}

function configureVerticalMode(obj) {
  obj.totalRows = filterInt(obj.rows);
  obj.itemHeight = filterInt(obj.itemHeight);
  if (!obj.totalRows) obj.totalRows = obj.collection.length;
  if (!obj.itemHeight) error("'item-height' required in vertical mode");
  obj.screenItemsLen = Math.ceil(obj.h / obj.itemHeight);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen * obj.itemHeight);
  obj.$scroller = scroller(obj.itemHeight * obj.totalRows, obj.mode, obj.$scroller);
  obj.$container = obj.$container || createContainer(obj.width, obj.height, obj.mode);
}

function configureGridMode(obj) {
  obj.totalCols = filterInt(obj.cols);
  obj.totalRows = filterInt(obj.rows);
  obj.itemHeight = filterInt(obj.itemHeight);
  obj.itemWidth = filterInt(obj.itemWidth);
  if (!obj.itemHeight) error("'item-height' required in grd mode");
  if (!obj.itemWidth) error("'item-width' required in grid mode");
  if (!obj.totalCols) obj.totalCols = Math.floor((obj.w / obj.itemWidth));
  if (!obj.totalRows) obj.totalRows = Math.ceil(obj.collection.length / obj.totalCols);
  // console.log("obj.totalCols", obj.totalCols);
  obj.screenItemsLen = Math.ceil(obj.h / obj.itemHeight) * obj.totalCols;
  // console.log("obj.screenItemsLen", obj.screenItemsLen);
  obj.maxBuffer = Math.ceil(obj.screenItemsLen / obj.totalCols * obj.itemHeight);
  obj.$scroller = scroller(obj.itemHeight * obj.totalRows, obj.mode, obj.$scroller);
  obj.$container = obj.$container || createContainer(obj.width, obj.height, obj.mode);
}
