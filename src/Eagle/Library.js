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
Eagle.define('Eagle.Library', function() {

  /** VARIABLES **/
  this['name'] = null;

  /** CHILDREN **/
  this['description'] = null;
  this['packages'] = [];
  this['symbols'] = [];
  this['devicesets'] = [];

  this.parse = function(el) {

    var library = this;

    $.each(el.attributes, function(i, attribute) {
      library[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      library.description = description;

    });

    $('packages', el).each(function() {

      $('package', this).each(function() {

        var pack = new Eagle.Package();
            pack.parse(this);

        library.packages.push(pack);

      });

    });

    $('symbols', el).each(function() {

      $('symbol', this).each(function() {

        var symbol = new Eagle.Symbol();
            symbol.parse(this);

        library.symbols.push(symbol);

      });

    });

    $('devicesets', el).each(function() {

      $('deviceset', this).each(function() {

        var deviceset = new Eagle.DeviceSet();
            deviceset.parse(this);

        library.devicesets.push(deviceset);

      });

    });

  };

  this.getSymbol = function(name) {

    $.each(this.symbols, function(i,symbol) {

      if(symbol.name == name)
        return name;

    });

  };

});

