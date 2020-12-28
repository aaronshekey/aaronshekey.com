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
          livereload: true,
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*'],
        tasks: ['clean', 'copy', 'less', 'cssmin', 'includes'],
        options: {
          livereload: true,
        },
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
    },
    purgecss: {
      my_target: {
        options: {
          content: ['./src/**/*.html'],
          whitelist: ['h:fc-white', 'h:bg-black-050', 'h:fc-black-900', 'h:fc-black-500', 'md:order-first', 'md:fd-column', 'md:ai-center', 'md:jc-start', 'md:p0', 'md:mb32', 'md:order-last', 'md:ta-center', 'md:mr16', 'md:mb48', 'md:mt64', 'md:mb64', 'md:mb96', 'md:ml0', 'sm:ml12', 'sm:p12', 'sm:mb48', 'sm:mt48', 'sm:fd-column', 'sm:mb24', 'lg:order-last', 'h:bg-black-800', 'h:fc-white', 'h:fc-black-500', 'h:fc-black-900', 'h:bg-black-050', 'h:fc-black-700']
        },
        files: {
          'build/_/css/stacks.css': ['src/_/css/stacks.css']
        }
      }
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
  grunt.loadNpmTasks('grunt-purgecss');

  // Default task(s).
  grunt.registerTask('default', ['build', 'concurrent:serve']);
  grunt.registerTask('build', ['clean', 'copy', 'less', 'cssmin', 'purgecss', 'includes']);
};
