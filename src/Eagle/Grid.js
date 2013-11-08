/**
 * eagle-diff
 * Copyright 2012-2013 Todd Treece
 * todd@uniontownlabs.org
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
Eagle.define('Eagle.Grid', function(){

  /** VARIABLES **/
  this['distance'] = null;
  this['unitdist'] = null;
  this['unit'] = null;
  this['style'] = 'lines';
  this['multiple'] = 1;
  this['display'] = false;
  this['altdistance'] = null;
  this['altunitdist'] = null;
  this['altunit'] = null;
  this['path'] = null;

  this.parse = function(node) {

    var grid = this;

    Eagle.each(node.attributes, function(i, attribute) {

      if(attribute.nodeType != 2)
        return;

      grid[attribute.name] = Eagle.discernType(attribute.value);

    });

    //grid.draw();

  };

  this.draw = function() {

    if(! this.display)
      return false;

    var width = Eagle.canvas.width,
        height = Eagle.canvas.height;

    Eagle.beginPath();

    for(var y = 0; y < height; y += this.distance) {
      Eagle.moveTo(0, y);
      Eagle.lineTo(width, y);
    }

    for(var x = 0; x < width; x += this.distance) {
      Eagle.moveTo(x, 0);
      Eagle.lineTo(x, height);
    }

    Eagle.closePath();

    Eagle.stroke(0.1, '#000');

  };

});

