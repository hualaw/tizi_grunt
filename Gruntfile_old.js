module.exports = function (grunt) {

    var config = grunt.file.readJSON('package.json');
    
    var sourceDir = config.path+"js";// 源码目录
    var finalDir = config.path+'js.'+config.version;// 最终打包目录
    
    grunt.initConfig({
        //复制文件
        copy: {
            build: {
                expand: true,
                flatten: false,
                cwd: sourceDir,
                src: ['**/**/*'],
                dest: finalDir,
                filter: 'isFile'
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
                        src: ['**/**/*.js','!**/**/*-debug.js','!tools/ckeditor/**/*.js','!tools/jmeditor/**/*.js'],
                        dest: finalDir
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('cookies');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('compress',function(arg1,arg2){
        if (arguments.length === 2) {
            grunt.log.writeln(this.name + " start... , package: " + arg1 + ", version: " + arg2);
            if(arg1&&arg2){
                grunt.task.run(['copy:build', 'uglify'])
            }else{
                grunt.log.writeln(this.name + " error...");
            }
        }else{
            grunt.log.writeln(this.name + " error...");
        }
    });
};