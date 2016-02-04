var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('karma', function() {
    var server = new Server({configFile: __dirname + '/karma.conf.js', singleRun: false});
    server.start();
});
