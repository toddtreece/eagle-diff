var compressor = require('node-minify');
var fs = require('fs');
var lib_path = 'lib/';
var files = fs.readdirSync(lib_path);

for(var i = 0; i < files.length; i++) {

  if(files[i] != 'Eagle.js') {
    files[i] = lib_path + files[i];
  } else {
    files.splice(i,1);
  }

}

//Eagle.js must be first
files.unshift(lib_path + 'Eagle.js');

new compressor.minify({
    type: 'uglifyjs',
    fileIn: files,
    fileOut: 'eagle.min.js',
    callback: function(err){
        console.log(err);
    }
});

new compressor.minify({
    type: 'no-compress',
    fileIn: files,
    fileOut: 'eagle.js',
    callback: function(err){
        console.log(err);
    }
});
