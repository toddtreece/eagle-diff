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
Eagle.define('Eagle.Polygon', function() {

  /** VARIABLES **/
  this.width = null;
  this.layer = null;
  this.spacing = null;
  this.pour = 'solid';
  this.isolate = null;
  this.orphans = false;
  this.thermals = true;
  this.rank = 0;

  /** CHILDREN **/
  this.vertices = [];

  this.parse = function(el) {

    var polygon = this;

    $.each(el.attributes, function(i, attribute) {
      polygon[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('vertex', el).each(function() {

      var vertex = new Eagle.Vertex();
          vertex.parse(this);

      polygon.vertex.push(vertex);

    });

  };

});

