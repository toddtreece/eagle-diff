module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: ['src/Eagle.js', 'src/Eagle/*.js'],
        dest: 'build/eagle.min.js',
      }
    },
    concat: {
      dist: {
        src: ['src/Eagle.js', 'src/Eagle/*.js'],
        dest: 'build/eagle.js',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['uglify', 'concat']);

};
