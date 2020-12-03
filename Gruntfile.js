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
    connect: {
      server: {
        options: {
          port: 3030, // custom port
          base: 'build/', // current directory for 'index.html' is root
          keepalive: true, // keep the server alive indefinitely
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*'],
        tasks: ['clean', 'copy', 'less', 'cssmin', 'includes'],
      },
    },
    concurrent: {
      options: {
          logConcurrentOutput: true
      },

      serve: [
          'connect',
          'watch',
      ],
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['build', 'concurrent:serve']);
  grunt.registerTask('build', ['clean', 'copy', 'less', 'cssmin', 'includes']);
};
