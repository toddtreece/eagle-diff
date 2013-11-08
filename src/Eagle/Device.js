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
Eagle.define('Eagle.Device', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['package'] = null;

  /** CHILDREN **/
  this['connects'] = [];
  this['technologies'] = [];

  this.parse = function(node) {

    var device = this;

    Eagle.each(node.attributes, function(i, attribute) {

      if(attribute.nodeType != 2)
        return;

      device[attribute.name] = Eagle.discernType(attribute.value);

    });

    Eagle.eachNode('connects', node, function(child) {

      Eagle.eachNode('connect', child, function(con) {

        var connect = new Eagle.Connect();
            connect.parent = device;
            connect.parse(con);

        device.connects.push(connect);

      });

    });

    Eagle.eachNode('technologies', node, function(child) {

      Eagle.eachNode('technology', child, function(tech) {

        var technology = new Eagle.Technology();
            technology.parent = device;
            technology.parse(tech);

        device.technologies.push(technology);

      });

    });

  };

});

