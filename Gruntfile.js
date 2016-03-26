module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-includes');

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin', 'includes']);
};
