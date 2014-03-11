module.exports = function (grunt) {

    var config = grunt.file.readJSON('package.json');
    
    var sourceDir = config.path+"debug";// 源码目录
    var buildDir = ".build";// 构建中间目录
    var finalDir = config.path+config.version;// 最终打包目录
    var lib_path = 'lib/';

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
                    "jquery": lib_path + "jquery/1.8.2/jquery",
                    //梯子公共方法
                    "tizi_ajax": lib_path + "tizi_ajax/0.0.1/tizi_ajax",
                    "tizi_datatype": lib_path + "tizi_common/0.0.1/tizi_datatype",
                    "tizi_valid": lib_path + "tizi_common/0.0.1/tizi_valid",
                    "tizi_validform": lib_path + "tizi_common/0.0.1/tizi_validform",
                    "tizi_commonajax": lib_path + "tizi_common/0.0.1/tizi_commonajax",
                    "tizi_msg": lib_path + "tizi_common/0.0.1/tizi_msg",
                    "tizi_msgsend": lib_path + "tizi_common/0.0.1/tizi_msgsend",
                    "tizi_feedback": lib_path + "tizi_common/0.0.1/tizi_feedback",
                    //梯子公共方法结束
                    "md5": lib_path + "md5/0.0.1/md5",
                    "tiziDialog": lib_path + "artDialog/4.1.7/artDialog",
                    "Validform": lib_path + "Validform/5.3.2/Validform",
                    "Placeholder": lib_path + "JPlaceholder/0.0.1/JPlaceholder",
                    "cookies": lib_path + "cookies/0.0.1/jquery.cookies",
                    "ckeditor": lib_path + "ckeditor/4.3/ckeditor",
                    "CKSource": lib_path + "ckeditor/4.3/adapters/CKSource",
                    "wordimage_uploader": lib_path + "java_applet/0.0.1/wordimage_uploader",
                    "ZeroClipboard":lib_path + "ZeroClipboard/1.0.7/ZeroClipboard.1.0.7",
                    "upload_flash":lib_path + "upload_flash/2.2/jquery.uploadify"
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
                        src: ['**/**/*.js','!lib/*','!**/**/*-debug.js'],
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
                compress: false
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
                src: ['!module/**/*.js','!lib/**/*','public/**/*'],
                dest: finalDir,
                filter: 'isFile'
            },
            image : {
                expand: true,
                flatten: false,
                cwd: sourceDir,
                src: ['image/**/*'],
                dest: finalDir,
                filter: 'isFile'
            }
        }
    });

    grunt.loadNpmTasks('cookies');
    grunt.loadNpmTasks('grunt-css-combo');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('compress',function(arg1,arg2){
        if (arguments.length === 2) {
            grunt.log.writeln(this.name + " start... , package: " + arg1 + ", version: " + arg2);
            if(arg1&&arg2){
                grunt.task.run(['transport', 'concat', 'uglify', 'css_combo', 'clean', 'copy:build','copy:image'])
            }else{
                grunt.log.writeln(this.name + " error...");
            }
        }else{
            grunt.log.writeln(this.name + " error...");
        }
    });
};