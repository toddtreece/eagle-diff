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

  this.parse = function(node) {

    var library = this;

    Eagle.each(node.attributes, function(i, attribute) {
      library[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      library.description = description;

    });

    Eagle.eachNode('packages', node, function(child) {

      Eagle.eachNode('package', child, function(p) {

        var pack = new Eagle.Package();
            pack.parse(p);

        library.packages.push(pack);

      });

    });

    Eagle.eachNode('symbols', node, function(child) {

      Eagle.eachNode('symbol', child, function(s) {

        var symbol = new Eagle.Symbol();
            symbol.parse(s);

        library.symbols.push(symbol);

      });

    });

    Eagle.eachNode('devicesets', node,function(child) {

      Eagle.eachNode('deviceset', child, function(d) {

        var deviceset = new Eagle.DeviceSet();
            deviceset.parse(d);

        library.devicesets.push(deviceset);

      });

    });

  };

  this.getSymbol = function(name) {

    Eagle.each(this.symbols, function(i, symbol) {

      if(symbol.name == name)
        return name;

    });

  };

});

