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

  paper: null,

  xml: null,

  define: function(string, object) {

    var parts = string.split('.'),
    parent = window;

    for (var i = 0, length = parts.length; i < length; i++) {
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

    this.paper = Raphael(el);

    $.get(file, function(data) {
      Eagle.xml = data;
      Eagle.parse();
    });

    $(window).bind('resize', function() {
      Eagle.paper.setSize($('#' + el).width(), $('#' + el).height());
      Eagle.parse();
    });

  },

  parse: function() {

    $('eagle',this.xml).each(function() {
      Eagle.version = Eagle.discernType(this.attr('version'));
    });

    $('drawing',this.xml).each(function() {

      Eagle.paper.clear();

      var drawing = new Eagle.Drawing();
          drawing.parse(this);

      Eagle.drawing = drawing;

    });

  },

  moveTo: function(x, y, relative) {

    relative = (typeof relative !== 'undefined' ? relative : false);

    var command = (relative ? 'm' : 'M');

    return command + ((this.paper.width / 2) + x) + ' ' + ((this.paper.height / 2) - y);

  },

  lineTo: function(x, y, relative) {

    relative = (typeof relative !== 'undefined' ? relative : false);

    var command = (relative ? 'l' : 'L');

    return command + ((this.paper.width / 2) + x) + ' ' + ((this.paper.height / 2) - y);

  }

};
