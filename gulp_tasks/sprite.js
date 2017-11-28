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

const folders = [
  'circle_icons',
  'rounded_icons',
];

module.exports = () => {
  gulp.task('sprite.clean', (cb) => {
    rimraf(paths.sprite.tmp, cb);
  });

  gulp.task('sprite.resize', ['sprite.clean'], (cb) => {
    let counter = 0;

    const onEnd = () => {
      counter += 1;

      if (counter >= folders.length) {
        cb();
      }
    };

    folders.forEach((folder) => {
      gulp.src(paths.sprite.src + '/' + folder + '/**/*.png')
        .pipe(imageResize({
          percentage: 50,
          imageMagick: true,
        }))
        .pipe(gulp.dest(paths.sprite.tmp + '/' + folder))
        .on('end', () => {
          onEnd();
        });
    });
  });

  gulp.task('sprite.copy', ['sprite.resize'], (cb) => {
    let counter = 0;

    const onEnd = () => {
      counter += 1;

      if (counter >= folders.length) {
        cb();
      }
    };

    folders.forEach((folder) => {
      gulp.src(paths.sprite.src + '/' + folder + '/**/*.png')
        .pipe(rename({
          suffix: '@2x',
        }))
        .pipe(gulp.dest(paths.sprite.tmp + '/' + folder))
        .on('end', () => {
          onEnd();
        });
    });
  });

  gulp.task('sprite.sprite', ['sprite.copy'], (cb) => {
    let counter = 0;

    const onEnd = () => {
      counter += 1;

      if (counter >= folders.length) {
        cb();
      }
    }

    folders.forEach((folder) => {
      gulp.src(paths.sprite.tmp + '/' + folder + '/**/*.png')
        .pipe(spritesmith({
          imgName: folder + '.png',
          cssName: folder + '.css',
          retinaImgName: folder + '@2x.png',
          retinaSrcFilter: [paths.sprite.tmp + '/' + folder + '/**/*@2x.png'],
        }))
        .pipe(gulp.dest(paths.sprite.dest))
        .on('end', () => {
          onEnd();
        });
    });
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
};
