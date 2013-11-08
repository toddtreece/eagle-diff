module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT Z") %> */\n'
      },
      dist: {
        src: ['src/Eagle.js', 'src/Eagle/*.js'],
        dest: 'build/eagle.min.js',
      }
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT Z") %> */\n\n'
      },
      dist: {
        src: ['src/Eagle.js', 'src/Eagle/*.js'],
        dest: 'build/eagle.js',
      }
    },
    jshint: {
      options: {
        sub: true
      },
      all: ['src/Eagle.js', 'src/Eagle/*.js']
    },
    watch: {
      scripts: {
        files: ['src/Eagle.js', 'src/Eagle/*.js'],
        tasks: ['default']
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'test'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // only compress and concat by default
  grunt.registerTask('default', ['jshint', 'uglify', 'concat']);

  // start a local webserver
  grunt.registerTask('serve', ['default', 'connect', 'watch']);

};
