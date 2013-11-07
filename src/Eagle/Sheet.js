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
Eagle.define('Eagle.Sheet', function() {

  /** CHILDREN **/
  this['description'] = null;
  //this.plain = null;
  this['instances'] = [];
  this['busses'] = [];
  this['nets'] = [];

  this.parse = function(node) {

    var sheet = this;

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      sheet.description = description;

    });

    /** TODO: what the fuck is plain?
    Eagle.eachNode('plain', node, function() {

      var plain = new Eagle.Plain();
          plain.parse(this);

      sheet.plain = plain;

    }); */

    Eagle.eachNode('instances', node, function(child) {

      Eagle.eachNode('instance', child, function(i) {

        var instance = new Eagle.Instance();
            instance.parse(i);

        sheet.instances.push(instance);

      });

    });

    Eagle.eachNode('busses', node, function(child) {

      Eagle.eachNode('bus', child, function(b) {

        var bus = new Eagle.Bus();
            bus.parse(b);

        sheet.busses.push(bus);

      });

    });

    Eagle.eachNode('nets', node, function(child) {

      Eagle.eachNode('net', child, function(n) {

        var net = new Eagle.Net();
            net.parse(n);

        sheet.nets.push(net);

      });

    });

  };

});

