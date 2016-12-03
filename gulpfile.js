var gulp = require('gulp');
var Server = require('karma').Server;
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('lint', function () {
	return gulp.src('src/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
});

function compileJs(dir) {
	return gulp
		.src('src/*.js')
		.pipe(concat('authorize.js'))
		.pipe(gulp.dest(dir))
		.pipe(babel())
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(dir));
}

gulp.task('build:js', function () {
	return compileJs('dist');
});

gulp.task('build', ['build:js']);

gulp.task('test', function() {
    var server = new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	});
	server.start();
});

gulp.task('default', ['build', 'test']);
