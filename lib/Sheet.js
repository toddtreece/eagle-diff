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
  this.description = null;
  //this.plain = null;
  this.instances = [];
  this.busses = [];
  this.nets = [];

  this.parse = function(el) {

    var sheet = this;

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      sheet.description = description;

    });

    /** TODO: what the fuck is plain?
    $('plain', el).each(function() {

      var plain = new Eagle.Plain();
          plain.parse(this);

      sheet.plain = plain;

    }); */

    $('instances', el).each(function() {

      $('instance', this).each(function() {

        var instance = new Eagle.Instance();
            instance.parse(this);

        sheet.instances.push(instance);

      });

    });

    $('busses', el).each(function() {

      $('bus', this).each(function() {

        var bus = new Eagle.Bus();
            bus.parse(this);

        sheet.busses.push(bus);

      });

    });

    $('nets', el).each(function() {

      $('net', this).each(function() {

        var net = new Eagle.Net();
            net.parse(this);

        sheet.nets.push(net);

      });

    });

  };

});

