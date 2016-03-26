module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ["build"],
    uglify: {
      build: {
        src: 'src/_/js/menu.js',
        dest: 'build/_/js/menu.js'
      }
    },
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
          cwd: 'src/_/css',
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
          src: ['**', '!**/_templates/**'],
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
        args: ["--verbose"],
        exclude: [".DS_Store"],
        recursive: true
      },
      production: {
        options: {
          src: "build/",
          dest: "/srv/users/serverpilot/apps/aaronshekey/public",
          host: "serverpilot@45.55.179.159",
          delete: false
        }
      }
    },
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-rsync');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin', 'includes']);

  grunt.registerTask('deploy', ['rsync:production']);
};
