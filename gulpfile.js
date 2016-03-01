var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('build', function () {
});

gulp.task('test', ['build'], function() {
    var server = new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	});
	server.start();
});

gulp.task('default', ['build', 'test']);
