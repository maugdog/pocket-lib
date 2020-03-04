const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer'); // For autoprefixing CSS for cross-browser compatibility
const concat = require('gulp-concat'); // For concatenating files together
const eslint = require('gulp-eslint');
const rename = require('gulp-rename'); // For renaming files
const sass = require('gulp-sass'); // For precompiling CSS with SASS
const webpack = require('webpack'); // For compiling js modules and dependencies into a single common JS file
const webpackStream = require('webpack-stream'); // Gulp stream plugin for webpack usage in pipes
const del = require('del');

const paths = {
  build: 'build',
  src: 'src/**/*', // All source files.
  styles: {
    wizard: {
      src: ['src/wizard/styles/*.scss', 'src/wizard/**/*.scss', 'node_modules/react-tagsinput/react-tagsinput.css', 'node_modules/react-image-crop/dist/ReactCrop.css'],
      out: 'wizard.css'
    }
  }
};

const webpackConfig = require('./webpack.config.js');

// Error Handling when running webpack
function handleTaskError(err) {
  console.error(err.toString());
  this.emit('end');
}

function lint() {
  return gulp.src(paths.src)
    .pipe(eslint({ configFile: './.eslintrc.json' }))
    .pipe(eslint.format());
}

function buildJS() {

  return gulp.src(paths.src)
    .pipe(webpackStream(webpackConfig, webpack)).on('error', handleTaskError)
    .pipe(gulp.dest(paths.build));
}

function buildCSS(cssPaths, target, done) {
  return function() {
    return gulp.src(cssPaths)
    .pipe(concat(target)) // Concatenate all of the files together
    .pipe(sass().on('error', sass.logError)) // Compile Sass
    .pipe(autoprefixer({  // Autoprefix
      // Note the "browserslist" key in package.json
      cascade: false
    }))
    .pipe(gulp.dest(paths.build));
  };
  // Concatenate and compile SASS files, then autoprefix them for browser compatibility
}

gulp.task('generateFiles', gulp.parallel(
  buildJS
  //buildCSS(paths.styles.wizard.src, paths.styles.wizard.out) // Wizard
));

// Remove all built files
function clean() {
  return del([`${paths.build}/**/*`]);
}
gulp.task('clean', clean);

const build = gulp.series(lint, 'clean','generateFiles');
gulp.task('build', build);

// Build by default
gulp.task('default', build);
