var gulp = require("gulp");
var insert = require('gulp-insert');
var handlebars = require('handlebars');
var rimraf = require("rimraf");
var fs = require('fs');

var paths = {
    wwwroot: './wwwroot/',
    src: './src/'
};

handlebars.registerHelper('setTitle', function(options) {
    options.data.root.title = options.fn(this);
});

handlebars.registerHelper('link', function(text, url, options) {
    text = handlebars.Utils.escapeExpression(text);
    url  = handlebars.Utils.escapeExpression(url);

    var className = url.indexOf(options.data.root.file) !== -1 ? "selected" : "";
    var result = '<a class="'+ className + '" href="' + url + '">' + text + '</a>';

    return new handlebars.SafeString(result);
});

gulp.task('clean', function (cb) {
  rimraf(paths.wwwroot, cb);
});

gulp.task('copy', ['clean'], function () {

    return gulp.src(['!' + paths.src + '**/*.{html,hbs}', paths.src + '**/*.*'])
        .pipe(gulp.dest(paths.wwwroot));

});

gulp.task('build', ['copy'], function () {

    var source = fs.readFileSync(paths.src + 'layout.hbs', 'utf8');
    var template = handlebars.compile(source);

    gulp.src(paths.src + '*.html')
        .pipe(insert.transform(function(contents, file) {
            var context = {file: file.relative};
            context.body = handlebars.compile(contents)(context);
            return template(context);
        }))
        .pipe(gulp.dest(paths.wwwroot));

    var sourceRu = fs.readFileSync(paths.src + 'ru/layout.hbs', 'utf8');
    var templateRu = handlebars.compile(sourceRu);

    gulp.src(paths.src + 'ru/*.html')
        .pipe(insert.transform(function(contents, file) {
            var context = {file: file.relative};
            context.body = handlebars.compile(contents)(context);
            return templateRu(context);
        }))
        .pipe(gulp.dest(paths.wwwroot + 'ru/'));


});
