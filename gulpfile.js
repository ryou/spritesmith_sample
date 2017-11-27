const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const imageResize = require('gulp-image-resize');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const rimraf = require('rimraf');
const rename = require('gulp-rename');

const paths = {
  sprite: {
    src: 'src/sprite',
    dest: './dist/assets/sprite',
    tmp: 'tmp/sprite',
  },
};

gulp.task('sprite.clean', (cb) => {
  rimraf(paths.sprite.tmp, cb);
});

gulp.task('sprite.resize', ['sprite.clean'], () => {
  return gulp.src(paths.sprite.src + '/**/*.png')
    .pipe(imageResize({
      percentage: 50,
      imageMagick: true,
    }))
    .pipe(gulp.dest(paths.sprite.tmp));
});

gulp.task('sprite.copy', ['sprite.resize'], () => {
  return gulp.src(paths.sprite.src + '/**/*.png')
    .pipe(rename({
      suffix: '@2x',
    }))
    .pipe(gulp.dest(paths.sprite.tmp));
});

gulp.task('sprite.sprite', ['sprite.copy'], () => {
  return gulp.src(paths.sprite.tmp + '/**/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      retinaImgName: 'sprite@2x.png',
      retinaSrcFilter: [paths.sprite.tmp + '/**/*@2x.png'],
    }))
    .pipe(gulp.dest(paths.sprite.dest));
});

gulp.task('sprite.compress', ['sprite.sprite'], () => {
  return gulp.src(paths.sprite.dest + '/**/*.png')
    .pipe(imagemin({
      progressive: true,
      use: [
        pngquant({
          quality: '60-80'
        })
      ]
    }))
    .pipe(gulp.dest(paths.sprite.dest));
});

gulp.task('sprite', () => {
  gulp.start('sprite.compress');
});
