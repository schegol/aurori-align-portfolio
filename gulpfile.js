"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("imagemin-webp");
var replace = require("gulp-ext-replace");
var del = require("del");
var uglify = require("gulp-uglify");
var htmlmin = require('gulp-htmlmin');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({includePaths: require("node-normalize-scss").includePaths}))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
});

gulp.task("js", function() {
  return gulp.src("source/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/*.{jpg,png,svg}", gulp.series("images", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(imagemin([
      webp({
        quality: 90
      })
    ]))
    .pipe(replace(".webp"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/js/picturefill.min.js",
    "source/img/*.webp",
    "source/favicon/*",
    "source/projects/**/*",
    "source/misc/**/*"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "css", "js", "images", "webp", "html"));
gulp.task("start", gulp.series("build", "server"));
