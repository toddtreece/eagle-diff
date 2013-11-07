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
Eagle.define('Eagle.Net', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['class'] = 0;

  /** CHILDREN **/
  this['segment'] = null;

  this.parse = function(node) {

    var net = this;

    Eagle.each(node.attributes, function(i, attribute) {
      net[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('segment', node, function(child) {

      var segment = new Eagle.Segment();
          segment.parse(child);

      net.segment = segment;

    });

  };

});

