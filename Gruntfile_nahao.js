module.exports = function (grunt) {

    var config = grunt.file.readJSON('package.json');
    
    var sourceDir = config.path+"debug";// 源码目录
    var buildDir = ".build";// 构建中间目录
    var finalDir = config.path+config.version;// 最终打包目录

    //var sourceDir = "debug";// 源码目录
    //var buildDir = ".build";// 构建中间目录
    //var finalDir = "v1";// 最终打包目录
    // var libPath = 'lib/';

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var script = transport.script.init(grunt);

    grunt.initConfig({
        // 检测js依赖
        transport: {
            options: {
                paths: [sourceDir],
                parsers: {
                    '.js': [script.jsParser],
                    '.css': [style.css2jsParser]
                },
                alias: {
                    // 学生别名
                    "jquery": "lib/jquery/1.8.2/jquery",
                    "naHaoDialog": "lib/artDialog/4.1.7/artDialog",
                    "validForm": "lib/Validform/5.3.2/Validform",
                    "kindEditor": "lib/kindeditor/4.1.10/kindeditor",
                    "select": "module/lib/select",
                    "jQDate": "lib/My97DatePicker/4.8/WdatePicker",
                    // 老师别名
                    "jquery": "lib/jquery/1.8.2/jquery",
                    "naHaoDialog": "lib/artDialog/4.1.7/artDialog",
                    "validForm": "lib/Validform/5.3.2/Validform",
                    "kindEditor": "lib/kindeditor/4.1.10/kindeditor",
                    "select": "module/lib/select",
                    "ckEditorUploader": "lib/ckeditor/4.3/ckeditor",
                    "ckSourceUploader": "lib/ckeditor/4.3/adapters/jquery",
                    "flashUploader": "lib/uploadify/2.2/jquery.uploadify",
                    "jQDate": "lib/My97DatePicker/4.8/WdatePicker",
                    "cryptoJs": "lib/cryptoJs/3.1.2/sha1",
                }
            },
            build: {
                files: [
                    {
                        cwd: sourceDir,
                        src: ['module/**/*.js'],
                        dest: buildDir
                    }
                ]
            }
        },
        // 合并js
        concat: {
            options: {
                paths: [buildDir],
                include: 'all'
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: buildDir,
                        src: ['**/**/*.js','!lib/*'],
                        dest: finalDir
                    }
                ]
            }
        },
        // 压缩js
        uglify: {
            options: {
                mangle: false
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: finalDir,
                        src: ['**/**/*.js','!**/**/*-debug.js'],
                        dest: finalDir
                    }
                ]
            }
        },
        css_combo: {
            options: {
                debug: false,
                compress: true
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: sourceDir,
                        src: ['**/**/style.css'],
                        dest: finalDir
                    }
                ]
            }
        },
        // 删除临时目录
        clean: {
            build: [buildDir]
        },
        //复制文件
        copy: {
            build: {
                expand: true,
                flatten: false,
                cwd: sourceDir,
                src: ['html/*', '!module/**/*.js','lib/**/*','public/**/*','fonts/**/*'],
                dest: finalDir,
                filter: 'isFile'
            },
            image : {
                expand: true,
                flatten: false,
                cwd: sourceDir,
                src: ['images/**/*'],
                dest: finalDir,
                filter: 'isFile'
            },
            css : {
                expand: true,
                flatten: false,
                cwd: sourceDir,
                src: ['**/**/style.css'],
                dest: finalDir,
                filter: 'isFile'
            }
        }
    });

    // grunt.loadNpmTasks('cookies');
    grunt.loadNpmTasks('grunt-css-combo');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('compress', ['transport', 'concat', 'uglify', 'css_combo', 'clean', 'copy:build','copy:image']);

};
