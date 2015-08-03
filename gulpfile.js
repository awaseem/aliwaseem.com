/**
 * Created by awaseem on 15-07-26.
 */

var gulp = require("gulp");
var gls = require("gulp-live-server");

gulp.task("serve", function () {
    var server = gls.new("app.js");
    server.start();

    gulp.watch(["public/**/*.html", "public/**/*.css", "public/**/*.js"], function () {
        server.notify.apply(server, arguments);
    });

    gulp.watch("views/**/*.handlebars", function () {
        server.notify.apply(server, arguments);
    });

    gulp.watch("app.js", server.start.bind(server));
});