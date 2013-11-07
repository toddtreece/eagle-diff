/**
 * eagle-diff
 * Copyright 2012 Todd Treece
 * todd@sparkfun.com
 *
 * This file is part of eagle-diff.
 *
 * eagle-diff is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published bythe Free
 * Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * eagle-diff is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with eagle-diff.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var Eagle = {

  multiplier: 100,
  version: null,
  drawing: null,
  xml: null,


  canvas: null,
  context: null,
  last: {
    x: 0,
    y: 0
  },

  define: function(string, object) {

    var parts = string.split('.'),
        parent = window;

    for(var i = 0, length = parts.length; i < length; i++) {
      parent[parts[i]] = parent[parts[i]] || object;
      parent = parent[parts[i]];
    }

    return parent;

  },

  discernType: function(value) {

    if(! isNaN(value)) {
      value = parseFloat(value);
      return ((value % 1) === 0) ? parseInt(value) : value;
    } else if(value == 'no' || value == 'yes') {
      return (value == 'yes' ? true : false);
    }

    return value;

  },

  init: function(el, file) {

    this.canvas = document.getElementById(el);
    this.context = this.canvas.getContext('2d');

    Eagle.get(file, function(data) {
      Eagle.xml = data;
      Eagle.parse();
    });

  },

  parse: function() {

    if(! this.xml)
      throw 'Loading failed';

    if(window.DOMParser) {
      var parser = new DOMParser();
      this.parsed = parser.parseFromString(this.xml, 'text/xml');
    } else {
      this.parsed = new ActiveXObject('Microsoft.XMLDOM');
      this.parsed.async = false;
      this.parsed.loadXML(this.xml);
    }

    this.each('eagle', this.parsed, function(node) {
      Eagle.version = Eagle.discernType(node.getAttribute('version'));
    });

    this.each('drawing', this.parsed, function(node) {

      Eagle.clear();

      var drawing = new Eagle.Drawing();
          drawing.parse(node);

      Eagle.drawing = drawing;

    });

  },

  beginPath: function() {

    this.last.x = 0;
    this.last.y = 0;

    this.context.beginPath();

    return this;

  },

  moveTo: function(x, y, relative) {

    relative = (typeof relative !== 'undefined' ? relative : false);

    // do the math
    if(relative) {
      x = this.last.x + x;
      y = this.last.y + y;
    }

    // move to the location
    this.context.moveTo(x, this.canvas.height - y);

    // store the current location for later
    this.last.x = x;
    this.last.y = y;

    return this;

  },

  lineTo: function(x, y, relative) {

    relative = (typeof relative !== 'undefined' ? relative : false);

    // do the math
    if(relative) {
      x = this.last.x + x;
      y = this.last.y + y;
    }

    // move to the location
    this.context.lineTo(x, this.canvas.height - y);

    // store the current location for later
    this.last.x = x;
    this.last.y = y;

    return this;

  },

  closePath: function() {

    this.last.x = 0;
    this.last.y = 0;

    this.context.closePath();

    return this;

  },

  get: function(url, callback) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

      if (xhr.readyState == 4)
        callback(xhr.responseText);

    };

    xhr.open('GET', url, true);
    xhr.send();

  },

  clear: function() {
    Eagle.context.clearRect(0, 0, Eagle.canvas.width, Eagle.canvas.height);
  },

  each: function(name, source, callback) {

    var results = source.getElementsByTagName(name);

    for(var i = 0; i < results.length; i++) {

      callback(results[i]);

    }

  }

};
