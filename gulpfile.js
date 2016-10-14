var gulp = require('gulp'); 
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var imagemin = require('gulp-imagemin');
var rigger = require('gulp-rigger');
var sass = require('gulp-sass');
var watch = require('gulp-watch'); 
var browserSync = require('browser-sync');
var pngquant = require('imagemin-pngquant');
var reload = browserSync.reload;

var config = {
	server: {
		baseDir: './build'
	}, 
	tunnel: true, 
	host: 'localhost',
	port: 7000,
	logPrefix: 'myConfigurator'
}

gulp.task('html:build', function(){
	gulp.src('app/*.html')
	.pipe(rigger())
	.pipe(gulp.dest('build/'))
	.pipe(reload({stream: true}))
})

gulp.task('js:build', function () {
  gulp.src('app/js/**/*.*')
    .pipe(rigger())
    .pipe(concat("main.js"))
    .pipe(gulp.dest('build/js/'))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function(){
	gulp.src('app/styles/**/*.*')
	.pipe(sass.sync().on('error', sass.logError))
	.pipe(concatCss('styles.css'))
	.pipe(gulp.dest('build/css/'))
	.pipe(reload({stream: true}))
})

gulp.task('image:build', function () {
  gulp.src('app/img/**/*.*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest('build/img/'))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts/'))
});

gulp.task('watch', function(){
	watch('app/*.html', function(event, cb){
		gulp.start('html:build');
	});
	watch('app/js/**/*.*', function(event, cb){
		gulp.start('js:build');
	});
	watch('app/styles/**/*.*', function(event, cb) {
		gulp.start('style:build');
	});
	watch('app/img/**/*.*', function(event, cb) {
		gulp.start('image:build');
	});
	watch('app/fonts/**/*.*', function(event, cb){
		gulp.start('fonts:build');
	});
})

gulp.task('webserver', function(){
	browserSync(config);
})

gulp.task('default', ['html:build', 'style:build', 'js:build', 'image:build', 'fonts:build','webserver', 'watch'])
