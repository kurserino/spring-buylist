// Spring boot static folder path
const STATIC = './src/main/resources/static'

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

let sassTaskHandler = () => gulp.src(`${STATIC}/src/scss/**/*.scss`, { sourcemaps: true })
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(`${STATIC}/css`));

let babelTaskHandler = () => gulp.src(`${STATIC}/src/js/**/*.js`, { sourcemaps: true })
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .on('error', function(e){
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(`${STATIC}/js`));

// Tasks
gulp.task('sass', sassTaskHandler);
gulp.task('sass:watch', () => gulp.watch(`${STATIC}/src/scss/**/*.scss`, sassTaskHandler));

gulp.task('babel', babelTaskHandler);
gulp.task('babel:watch', () => gulp.watch(`${STATIC}/src/js/**/*.js`, babelTaskHandler));

gulp.task('watch', () => {
  gulp.watch(`${STATIC}/src/scss/**/*.scss`, sassTaskHandler);
  gulp.watch(`${STATIC}/src/js/**/*.js`, babelTaskHandler);
});
