var gulp = require("gulp");
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var handlebars = require('handlebars');
var rimraf = require("rimraf");
var fs = require('fs');

var paths = {
    wwwroot: './wwwroot/',
    src: './src/'
};

handlebars.registerHelper('link', function(url, options) {
    url  = handlebars.Utils.escapeExpression(url) + '.html';

    var className = url.indexOf(options.data.root.file) !== -1 ? "selected" : "";
    var result = ' class="'+ className + '" href="' + url + '"';

    return new handlebars.SafeString(result);
});

handlebars.registerHelper('if', function(conditional, options) {
    if(conditional) {
        return options.fn(this);
    }
});

function getLocal(file, culture){
    culture = culture ? culture + '/' : '';
    var localFile = file.replace(/(\.html)|(\.hbs)$/, ".json");
    var json = fs.readFileSync(paths.src + 'local/' + culture + localFile, 'utf8');
    return JSON.parse(json);
}

gulp.task('clean', function (cb) {
  rimraf(paths.wwwroot, cb);
});

gulp.task('copy', ['clean'], function () {

    return gulp.src(['!' + paths.src + '**/*.{html,hbs}',
            '!' + paths.src + 'local/**/*.*',
            paths.src + '**/*.*'])
        .pipe(gulp.dest(paths.wwwroot));

});

gulp.task('build', ['copy'], function () {

    var layout = fs.readFileSync(paths.src + 'layout.hbs', 'utf8');
    var local = getLocal('layout.hbs');
    var template = handlebars.compile(layout);

    return gulp.src(['!' + paths.src + 'layout.hbs', paths.src + '*.hbs'])
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(insert.transform(function(contents, file) {

            var pageLocal = getLocal(file.relative);
            var context = {
                culture: 'en',
                prefix: './',
                culturePrefix: './ru/',
                file: file.relative,
                local: pageLocal
            };
            context.body = handlebars.compile(contents)(context);
            context.local = local;
            context.title = pageLocal.title;
            return template(context);
        }))
        .pipe(gulp.dest(paths.wwwroot));


});

gulp.task('build:local', ['build'], function () {

    var layout = fs.readFileSync(paths.src + 'layout.hbs', 'utf8');
    var local = getLocal('layout.hbs', 'ru');
    var template = handlebars.compile(layout);

    return gulp.src(['!' + paths.src + 'layout.hbs', paths.src + '*.hbs'])
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(insert.transform(function(contents, file) {
            var pageLocal = getLocal(file.relative, 'ru');
            var context = {
                culture: 'ru',
                prefix: '../',
                culturePrefix: '../',
                file: file.relative,
                local: pageLocal
            };
            context.body = handlebars.compile(contents)(context);
            context.local = local;
            context.title = pageLocal.title;
            return template(context);
        }))
        .pipe(gulp.dest(paths.wwwroot + 'ru/'));

});
