

var gulp = require('gulp'), //本地安装gulp所用到的地方
    webserver = require('gulp-webserver'),
    connect = require('gulp-connect'),    
    imagemin = require('gulp-imagemin'),   
    clean = require('gulp-clean'), 
    less = require('gulp-less'),
     minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),  
    // spritesmith = require("gulp-spritesmith"); 
    spriter = require('gulp-css-spriter');   


// 样式
gulp.task('styles', function () {
    gulp.src('./src/css/*.less') //该任务针对的文件
      .pipe(less()) //该任务调用的模块       
      .pipe(gulp.dest('./dist/css/')) //将会在dist/css下生成index.css
      .pipe(concat('main.css'))
      .pipe(gulp.dest('./dist/css/'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(gulp.dest('./dist/css/'))     
}); 


// js
gulp.task('scripts', function() {  
  return gulp.src('./src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));   
});

// 图片
gulp.task('images', function() {  
  return gulp.src('./src/img/*')
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img/'));
    
});

// 清理
gulp.task('clean', function() {  
  return gulp.src(['./dist/sprite'], {read: false})
    .pipe(clean());
});

// sprits合成

// gulp.task('spritesmith',['clean'], function () {
//     return  gulp.src('img/*.png')
//       .pipe(spritesmith({
//           imgName: 'sprite.png',
//           styleName: 'sprite.css',
//           imgPath: './sprite.png',          
//           groupBy: 'skin',
//           algorithm:'left-right',
//           padding:5,
//           // cssOpts: {
//           //   cssClass: function (item) {
//           //       return '.sprite-' + item.name;
//           //   }
//           // }
//           // cssTemplate:"../css/index.css",
//           cssOpts: {
//             cssClass: function (item) {
//               // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
//               if (item.name.indexOf('-hover') !== -1) {
//                 return '.sprite-' + item.name.replace('-hover', ':hover');
//               // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
//               } else {
//                 return '.sprite-' + item.name;
//               }
//             }
//           }
//       }))
//       // .pipe(gulpif('*.png', gulp.dest('./dist/img/')))
//       // .pipe(gulpif('*.css', gulp.dest('./dist/css/')));              
//       .pipe(gulp.dest('sprite/'));
      
// });
// gulp.task('webserver', ['watch'], function() {
//     gulp.src('.')
//         .pipe(webserver({
//             livereload: false,
//             directoryListing: true,
//             open: "http://localhost:8080/index.html"
//         }));
// }); 

 
gulp.task('spriter', ['images','clean'], function() {
    return gulp.src('./dist/css/main.min.css')//比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。 很重要 注意(recharge.css)这个是我的项目。别傻到家抄我一样的。
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': './dist/sprite/sprite.png', //这是雪碧图自动合成的图。 很重要
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': 'sprite.png' //这是在css引用的图片路径，很重要
            // 'padding':5
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/sprite/')); //最后生成出来
});

gulp.task('webserver',['watch'], function () {
    connect.server({
       port: 8888,
       livereload:true
    });
});
// 预设任务
gulp.task('default', ['clean'], function() {    
    gulp.start('styles','images','spriter','scripts');
});

// 看守
gulp.task('watch',function() {
  // 看守所有.less档
  gulp.watch('./src/css/*.less', ['styles']); 
  // 看守js
  gulp.watch('./src/js/*.js', ['scripts']);
  // 看守所有图片档
  gulp.watch('./src/img/*', ['images']);
  gulp.watch('./src/css/*.css', ['spriter']);
 
});