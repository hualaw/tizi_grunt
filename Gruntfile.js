module.exports = function (grunt) {

    var config = grunt.file.readJSON('package.json');
    
    var sourceDir = config.path+"debug";// 源码目录
    var buildDir = ".build";// 构建中间目录
    var finalDir = config.path+config.version;// 最终打包目录

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var script = transport.script.init(grunt);
    
    var libPath = 'lib/';
    var aliasContent = {
        "jquery": libPath + "jquery/1.8.2/jquery",
        "md5": libPath + "md5/0.0.1/md5",
        "tiziDialog": libPath + "artDialog/4.1.7/artDialog",
        "validForm": libPath + "Validform/5.3.2/Validform",
        "placeHolder": libPath + "JPlaceholder/0.0.1/JPlaceholder",
        "cookies": libPath + "cookies/0.0.1/jquery.cookies",
        "ckEditor": libPath + "ckeditor/4.3/ckeditor",
        "ckSource": libPath + "ckeditor/4.3/adapters/CKSource",
        "ckEditorUploader": libPath + "ckeditor/4.3.upload/ckeditor",
        "ckSourceUploader": libPath + "ckeditor/4.3.upload/adapters/jquery",
        "wordImageUploader": libPath + "java_applet/0.0.1/wordimage_uploader",
        "flashUploader":libPath + "uploadify/2.2/jquery.uploadify",
        "zeroClipboard":libPath + "ZeroClipboard/1.0.7/ZeroClipboard.1.0.7",
        "wdatePicker": libPath + "My97DatePicker/4.8/WdatePicker",
        "kindEditor": libPath + "kindeditor/4.1.10/kindeditor",
        "scrollBar" : libPath + "scrollbar/0.0.1/scrollbar",
        "clipPhoto" : libPath + "clipPhoto/0.0.1/clipPhoto",
        "lessonFlash": libPath + "lessonFlash/0.0.1/swfobject",
        "cloudFlash": libPath + "cloudFlash/0.0.1/swfobject",
        //梯子公共方法
        "tizi_ajax": libPath + "tizi_ajax/0.0.1/tizi_ajax",
        "tizi_datatype": libPath + "tizi_common/0.0.1/tizi_datatype",
        "tizi_valid": libPath + "tizi_common/0.0.1/tizi_valid",
        "tizi_validform": libPath + "tizi_common/0.0.1/tizi_validform",
        "tizi_commonajax": libPath + "tizi_common/0.0.1/tizi_commonajax",
        "tizi_msg": libPath + "tizi_common/0.0.1/tizi_msg",
        "tizi_msgsend": libPath + "tizi_common/0.0.1/tizi_msgsend",
        "tizi_notice": libPath + "tizi_common/0.0.1/tizi_notice",
        "tizi_download": libPath + "tizi_common/0.0.1/tizi_download",
        "tizi_feedback": libPath + "tizi_common/0.0.1/tizi_feedback",
        "tizi_login_form": libPath + "tizi_common/0.0.1/tizi_login_form"
        //梯子公共方法结束
    };

    grunt.initConfig({
        // 检测js依赖
        transport: {
            options: {
                paths: [sourceDir],
                parsers: {
                    '.js': [script.jsParser],
                    '.css': [style.css2jsParser]
                },
                alias: aliasContent
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