var join = require('path').join;
var path = require('path');
var basePath = path.resolve(__dirname, '');

module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: basePath,
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    files: [
      // Test tools
      'node_modules/chai/chai.js',
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon-stub-promise/index.js',

      // libraries
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',

      // dist files
      'dist/s-vscroller.js',

      // Test files
      'test/**/*.js'

    ]
  })
}
