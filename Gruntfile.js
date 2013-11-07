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
    serve: {
      default: {
        path: 'test/',
        port: 8080
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // only compress and concat by default
  grunt.registerTask('default', ['jshint', 'uglify', 'concat']);

  // start a local webserver
  grunt.registerMultiTask('serve', function() {

    grunt.task.run('default');

    var connect = require('connect'),
        path = this.data.path;

    connect.createServer(
      connect.static(path)
    ).listen(this.data.port);

    console.log('Test server running at http://localhost:' + this.data.port + '/');

    grunt.task.run('watch');

  });

};
