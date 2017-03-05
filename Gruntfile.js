module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ["build"],
    includes: {
      build: {
        cwd: 'src',
        src: [ '**/*.html', '!**/_templates/*.html' ],
        dest: 'build/',
        options: {
          flatten: true,
          includePath: 'src/_templates'
        }
      }
    },
    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: 'build/_/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/_/css',
          ext: '.css'
        }]
      }
    },
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**', '!**/_templates/**', '!_/css/*.less'],
          dest: 'build/',
          flatten: false,
          dot: true
        }]
      }
    },
    watch: {
      build: {
        files: ['src/**/*'],
        tasks: ['default']
      },
    },
    rsync: {
      options: {
        exclude: [".DS_Store"],
        recursive: true
      },
      production: {
        options: {
          src: 'build/',
          dest: '/srv/users/serverpilot/apps/aaronshekey/public',
          host: 'serverpilot@45.55.179.159',
          delete: false
        }
      }
    },
    less: {
      build: {
        options: {
          paths: ['src/_/css/'],
        },
        files: {
          'build/_/css/home.css': 'src/_/css/home.less',
          'build/_/css/post.css': 'src/_/css/post.less',
          'build/_/css/resume.css': 'src/_/css/resume.less'
        }
      },
    },
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'less', 'cssmin', 'includes']);
  grunt.registerTask('build', ['clean', 'copy', 'less', 'cssmin', 'includes']);
  grunt.registerTask('deploy', ['rsync:production']);
};
