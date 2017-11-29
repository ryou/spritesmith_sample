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
    // Promiseに関しては以下参照
    // https://qiita.com/norami_dream/items/0edfca15c15199921a73
    const resize = (folder) => {
      return new Promise((resolve) => {
        gulp.src(paths.sprite.src + '/' + folder + '/**\/*.png')
          .pipe(imageResize({
            percentage: 50,
            imageMagick: true,
          }))
          .pipe(gulp.dest(paths.sprite.tmp + '/' + folder))
          .on('end', resolve);
      });
    };

    Promise.resolve()
      .then(() => {
        return Promise.all(folders.map((folder) => {
          return resize(folder);
        }))
      })
      .then(() => {
        cb();
      });
  });

  gulp.task('sprite.copy', ['sprite.resize'], (cb) => {
    const copy = (folder) => {
      return new Promise((resolve) => {
        gulp.src(paths.sprite.src + '/' + folder + '/**/*.png')
          .pipe(rename({
            suffix: '@2x',
          }))
          .pipe(gulp.dest(paths.sprite.tmp + '/' + folder))
          .on('end', resolve);
      });
    };

    Promise.resolve()
      .then(() => {
        return Promise.all(folders.map((folder) => {
          return copy(folder);
        }));
      })
      .then(() => {
        cb();
      });
  });

  gulp.task('sprite.sprite', ['sprite.copy'], (cb) => {
    const sprite = (folder) => {
      return new Promise((resolve) => {
        gulp.src(paths.sprite.tmp + '/' + folder + '/**/*.png')
          .pipe(spritesmith({
            imgName: folder + '.png',
            cssName: folder + '.css',
            retinaImgName: folder + '@2x.png',
            retinaSrcFilter: [paths.sprite.tmp + '/' + folder + '/**/*@2x.png'],
          }))
          .pipe(gulp.dest(paths.sprite.dest))
          .on('end', resolve);
      });
    };

    Promise.resolve()
      .then(() => {
        return Promise.all(folders.map((folder) => {
          return sprite(folder);
        }));
      })
      .then(() => {
        cb();
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
