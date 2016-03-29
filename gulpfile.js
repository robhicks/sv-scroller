var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var concat = require("gulp-concat");
var del = require('del');
var gulp = require("gulp");
var join = require('path').join;
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require("gulp-sourcemaps");
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

var paths = {
  del: join(__dirname, "dist", "**", "*.*"),
  dist: join(__dirname, "dist"),
  src: join(__dirname, "src", "**", "*.js"),
  start: join(__dirname, "src", "ng-wrapper.js"),
  watch: [join(__dirname, "src", "**", "*.js"), join(__dirname, "*.js")]
}

gulp.task('clean', function() {
  return del(paths.del);
})

gulp.task("transpile", function (done) {
  browserify({entries: [paths.start], external: ['angular'], debug: true})
    .transform("babelify")
    .bundle()
    .pipe(source('sv-scroller.js'))
    .pipe(gulp.dest(paths.dist));

  browserify({entries: [paths.start], external: ['angular']})
    .transform("babelify")
    .bundle()
    .pipe(source('sv-scroller.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist));
  done();
});

gulp.task("watch", function() {
  // gulp.watch(paths.src, gulp.series('clean', 'transpile'));
  gulp.watch(paths.src, gulp.series('transpile'));
});

// gulp.task("build", gulp.series('clean', 'transpile', 'watch'));
gulp.task("default", gulp.series('transpile', 'watch'));
