var compressor = require('node-minify');
var fs = require('fs');
var lib_path = 'lib/';
var files = fs.readdirSync(lib_path);
var to_compress = [lib_path + 'Eagle.js'];

for (var i = 0; i < files.length; i++) {

  if (files[i] != 'Eagle.js' && files[i].substr( - 3, 3) == '.js') {
    to_compress.push(lib_path + files[i]);
  }

}

new compressor.minify({
  type: 'uglifyjs',
  fileIn: to_compress,
  fileOut: 'eagle.min.js',
  callback: function(err) {
    console.log(err);
  }
});

new compressor.minify({
  type: 'no-compress',
  fileIn: to_compress,
  fileOut: 'eagle.js',
  callback: function(err) {
    console.log(err);
  }
});

