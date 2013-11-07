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
Eagle.define('Eagle.Class', function(){

  /** VARIABLES **/
  this['number'] = null;
  this['name'] = null;
  this['width'] = 0;
  this['drill'] = 0;

  /** CHILDREN **/
  this['clearance'] = null;

  this.parse = function(node) {

    var c = this;

    Eagle.each(node.attributes, function(i, attribute) {
      c[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('clearance', node, function(child) {

      var clearance = new Eagle.Clearance();
          clearance.parse(child);

      c.clearance = clearance;

    });

  };

});

