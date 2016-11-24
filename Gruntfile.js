module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                compress: {
                    global_defs: {
                        "DEBUG": false
                    },
                    dead_code: true
                },
                preserveComments: false,
                report: 'gzip'
            },
            dist: {
                files: {
                    'Files/js/main.min.js': [
                        'Files/js/jquery-3.1.1.min.js',
                        'Files/js/jquery-ui-1.12.1.min.js',
                        'Files/js/handlebars-v4.0.5.js',
                        'Files/js/handlebars-intl.min.js',
                        'Files/js/locale-data/fr.js',
                        'Files/js/jquery.mCustomScrollbar.concat.min.js',
                        'Files/js/tips.js',
                        'Files/js/main.js'
                    ]
                }
            }
        },

        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    'Files/css/style.css': 'Files/sass/style.scss'
                }
            }
        },

        copy: {
          main: {
            files: [
              {
                expand: true,
                src: [
                  'Files/fonts/**',
                  'Files/js/main.min.js',
                  'Files/css/style.min.css',
                  'IconMouseNormal.png',
                  'IconMouseOver.png',
                  'manifest.json'
                ],
                dest: 'dist/'
              },
            ],
          },
        },

        cssmin: {
          target: {
            files: {
              'Files/css/style.min.css': ['Files/css/font-awesome.min.css', 'Files/css/jquery.mCustomScrollbar.min.css', 'Files/css/style.css']
            }
          }
        },

        htmlmin: {
          dist: {
            options: {
              removeComments: true,
              collapseWhitespace: true
            },
            files: {
              'dist/Files/index.html': 'Files/index.html',
              'dist/Files/config.html': 'Files/config.html'
            }
          }
        },

        watch: {
            css: {
                files: 'Files/sass/*',
                tasks: ['sass'],
                options: {
                    livereload: true,
                },
            },
            scripts: {
                files: 'Files/js/*',
                tasks: ['uglify']
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('prepare', ['uglify', 'sass', 'cssmin']);
    grunt.registerTask('overwolf', ['copy', 'htmlmin']);

};
