var path = require('path');

var gulp = require('gulp')
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var jison = require('gulp-jison');
var through = require('through2');
var serve = require('gulp-serve');
var typescript = require('typescript');
var symlink = require('gulp-symlink');
var fs = require('fs');

var grammarGlob = 'src/**/*.jison';
var scriptsGlob = 'src/**/*.ts';
var nodeModules = ['sql.js', 'zip.js', 'papaparse', 'systemjs', 'angular2', 'bootstrap', 'crypto'].map(function(x) { return 'node_modules/'+x; });

function parserToTypeScript() {
   return through.obj(function(file, enc, cb) {
        var text = file.contents.toString()

        //Handle import statements
        var imports = [];
        text = text.replace(/import.*?from\s+['"]([^'"]+)['"];?/g, function(imp) {
          imports.push(imp);
          return '';
        });

        text = imports.join('\n') + '\n' + text;
        
        //Export
        text = text.replace('var parser = (function(){' , function(data) {
          return 'export ' + data;
        });
        
        //Add typing info
        text = text.replace('function(k,v,o,l)', 'function(k,v,o=undefined,l=undefined)')
       
        //Add lexer to prototype
        text = text.replace('var sharedState = { yy: {} };', 'let sharedState:{ yy : { lexer? : any, parser?: any, parseError? : any }} = { yy :  {} }');
       
        text = text.replace(/var(.*)yyval = {}/g, function(all, rest) {
          return all.replace('yyval', 'yyval:{$?:any, _$?:any}');
        });
       
        text = text.replace('var parser = {trace:', 'var parser = {lexer:undefined, Parser:undefined, trace:');
       
        text = text.replace(/function anonymous\([^)]+\)/g, function(all) {
          return all + ':any';
        });
               
        file.contents = new Buffer(text);
        file.path = file.path.replace('.js', '.ts');
        this.push(file);
        cb();
    });
}

gulp.task('stub-crypto', function() {
  try {
    fs.mkdirSync('node_modules/crypto')
    fs.writeFileSync('node_modules/crypto/index.js', '')
  } catch (e) {
    //ignore
  }
})

gulp.task('scripts', function() {
    var tsconfig = JSON.parse(fs.readFileSync('tsconfig.json')).compilerOptions
    console.log(tsconfig)
    tsconfig.typescript = typescript
    var tsResult = gulp.src(scriptsGlob)
        .pipe(cached('scripts'))
        .pipe(remember('scripts'))
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
        .pipe(ts(tsconfig))
    
    return tsResult.js
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest('src/dist'));
});


gulp.task('parser', function() {
  return gulp.src(grammarGlob)
      .pipe(cached('parsers'))
      .pipe(jison({
        moduleType: 'js'
      }))
      .pipe(parserToTypeScript())
      .pipe(gulp.dest(function(file) {
          return file.base;
      }));
});

gulp.task('watch-parser', function () {
  var watcher = gulp.watch(grammarGlob, ['parser']); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.parsers[event.path];       // gulp-cached remove api
      remember.forget('parsers', event.path);         // gulp-remember remove api
    }
  });
});

gulp.task('watch-scripts', function () {
  var watcher = gulp.watch(scriptsGlob, ['scripts']); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.scripts[event.path];       // gulp-cached remove api
      remember.forget('scripts', event.path);         // gulp-remember remove api
    }
  });
});

gulp.task('symlink', function () {
  return gulp.src(nodeModules)
    .pipe(symlink(function (file) {
      // Here we return a path as string
      return path.join('dist/', file.relative);
    }, {
      force : true
    }));
});

gulp.task('watch', ['watch-parser', 'watch-scripts']);
gulp.task('serve', serve({
  root: ['./src'],
  port: 8080
}));

gulp.task('dev', ['watch', 'serve', 'stub-crypto', 'symlink'])