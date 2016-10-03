var gulp = require("gulp");
var rimraf = require("rimraf");
var fs = require('fs');

var paths = {
    wwwroot: './wwwroot/',
    src: './src/'
};

gulp.task('clean:www', function (cb) {
  rimraf(paths.wwwroot, cb);
});

gulp.task('copy:www', ['clean:www'], function () {

    var all = [];

    return gulp.src(all)
        .pipe(gulp.dest(paths.wwwroot));

});
