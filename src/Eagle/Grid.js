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

  this.parse = function(el) {

    var grid = this;

    $.each(el.attributes, function(i, attribute) {
      grid[attribute.name] = Eagle.discernType(attribute.value);
    });

    //grid.draw();

  };

  this.draw = function() {

    if(! this.display)
      return false;

    var path = '';
        width = Eagle.paper.width,
        height = Eagle.paper.height;


    for(var y = 0; y < height; y += this.distance) {
      path += Eagle.moveTo(0,y);
      path += Eagle.lineTo(width, y);
    }

    for(var x = 0; x < width; x += this.distance) {
      path += Eagle.moveTo(x, 0);
      path += Eagle.lineTo(x, height);
    }

    Eagle.paper.path(path).attr({'stroke-width': 0.1});

  };

});

