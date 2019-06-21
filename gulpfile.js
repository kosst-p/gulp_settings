//Подключаем Галп
const gulp = require('gulp');
//Объединение файлов
const concat = require('gulp-concat');
//Добавление автопрефиксов
const autoprefixer = require('gulp-autoprefixer');
//Оптимизация стилей
const cleanCSS = require('gulp-clean-css');
//Оптимизация скриптов
const uglify = require('gulp-uglify');
//Удаление файлов
const del = require('del');
//Синхронизация с браузером
const browserSync = require('browser-sync').create();
//Модуль для препроцессора
const sourcemaps = require('gulp-sourcemaps');
//LESS препроцессор
const less = require('gulp-less');
//Сжатие картинок
const imagemin = require('gulp-imagemin');

//Массив для подключения CSS фалов
/* const styleFiles = [
    './src/css/media.css',
    './src/css/main.css'
] */

//Массив для подключения JS фалов
/* const scriptFiles = [
    './src/js/lib.js',
    './src/js/main.js'
] */

//Таск для обработки стилей
gulp.task('styles', () => {
    //Шаблон для поиска файлов CSS
    //Все файлы по шаблону './src/css/**/*.css'
    return gulp.src('./src/css/style.less')
        .pipe(sourcemaps.init())
        //LESS препроцессор
        .pipe(less())
        //Объединение файлов в один
        .pipe(concat('style.css'))
        //Добавить префиксы
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //Минификация CSS файла
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        //Выходная папка для стилей
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
})

//Таск для обработки скриптов
gulp.task('scripts', () => {
    //Шаблон для поиска файлов JS
    //Все файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
        //Объединение файлов в один
        .pipe(concat('script.js'))
        //Минификация JS файла
        .pipe(uglify({
            toplevel: true
        }))
        //Выходная папка для скриптов
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream())
})

//Удалить все в указанной папке
gulp.task('del', () => {
    return del(['build/*'])
})

//Таск на создание папки fonts
gulp.task('fonts', () => {
    return gulp.src('./src/fonts/**')
        .pipe(gulp.dest('./build/fonts'))
})
//Таск на создание папки libs и перенос в неё всех файлов соответствнно
gulp.task('libs', () => {
    return gulp.src('./src/libs/**')
        .pipe(gulp.dest('./build/libs'))
})
//Таск для обработки картинок
gulp.task('img-compress', () => {
    //Шаблон для поиска файлов всех файлов в папке IMG
    return gulp.src('./src/img/**')
        //Вызов модуля 
        .pipe(imagemin({
            progressive: true
        }))
        //Результат положить в папке с сохранением всех подпапок
        .pipe(gulp.dest('./build/img/'))
})

//Отслеживание файлов
gulp.task('watch', () =>{
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: 'firefox',
        notify: false
    });
    //Отслеживание за файлами в папке IMG файлами
    gulp.watch('./src/img/**', gulp.series('img-compress'))
    //Отслеживание за CSS файлами
    gulp.watch('./src/css/**/*.less', gulp.series('styles'))
    //Отслеживание за JS файлами
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
    //Отслеживание за файлами в папке fonts
    gulp.watch('./src/fonts/**', gulp.series('fonts'))
    //Отслеживание за файлами в папке libs
    gulp.watch('./src/libs/**', gulp.series('libs'))
    //При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
})



//Общий таск. Запускает последовательно таск del и directories после этого в параллельном режиме запускаются такски styles, scripts и img-compres  и такс watch для слежения.
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'img-compress', 'fonts', 'libs'), 'watch')); //при необходимости добавить 'scripts'