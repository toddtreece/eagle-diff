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
  this.name = null;
  this.prefix = null;
  this.uservalue = null;

  /** CHILDREN **/
  this.description = null;
  this.gates = [];
  this.devices = [];

  this.parse = function(el) {

    var deviceset = this;

    $.each(el.attributes, function(i, attribute) {
      deviceset[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      deviceset.description = description;

    });

    $('gates', el).each(function() {

      $('gate', this).each(function() {

        var gate = new Eagle.Gate();
            gate.parse(this);

        deviceset.gates.push(gate);

      });

    });

    $('devices', el).each(function() {

      $('device', this).each(function() {

        var device = new Eagle.Device();
            device.parse(this);

        deviceset.devices.push(device);

      });

    });

  };

});

