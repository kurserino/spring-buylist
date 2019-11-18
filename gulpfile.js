const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

let sassTaskHandler = () => gulp.src('./src/scss/**/*.scss', { sourcemaps: true })
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./css'));

let babelTaskHandler = () => gulp.src('./src/js/**/*.js', { sourcemaps: true })
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .on('error', function(e){
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./js'));

// Tasks
gulp.task('sass', sassTaskHandler);
gulp.task('sass:watch', () => gulp.watch('./src/scss/**/*.scss', sassTaskHandler));

gulp.task('babel', babelTaskHandler);
gulp.task('babel:watch', () => gulp.watch('./src/js/**/*.js', babelTaskHandler));

gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.scss', sassTaskHandler);
  gulp.watch('./src/js/**/*.js', babelTaskHandler);
});
