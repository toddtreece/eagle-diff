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
Eagle.define('Eagle.DeviceSet', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['prefix'] = null;
  this['uservalue'] = false;

  /** CHILDREN **/
  this['description'] = null;
  this['gates'] = [];
  this['devices'] = [];

  this.parse = function(node) {

    var deviceset = this;

    Eagle.each(node.attributes, function(i, attribute) {
      deviceset[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      deviceset.description = description;

    });

    Eagle.eachNode('gates', node, function(child) {

      Eagle.eachNode('gate', child, function(g) {

        var gate = new Eagle.Gate();
            gate.parse(g);

        deviceset.gates.push(gate);

      });

    });

    Eagle.eachNode('devices', node, function(child) {

      Eagle.eachNode('device', child, function(dev) {

        var device = new Eagle.Device();
            device.parse(dev);

        deviceset.devices.push(device);

      });

    });

  };

});

