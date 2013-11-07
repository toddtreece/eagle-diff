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
Eagle.define('Eagle.Part', function(){

  /** VARIABLES **/
  this['name'] = null;
  this['library'] = null;
  this['deviceset'] = null;
  this['device'] = null;
  this['technology'] = null;
  this['value'] = null;

  /** CHILDREN **/
  this['attributes'] = [];
  this['variants'] = [];

  this.parse = function(node) {

    var part = this;

    Eagle.each(node.attributes, function(i, attribute) {
      part[attribute.name] = Eagle.discernType(attribute.value);
    });


    Eagle.eachNode('attributes', node, function(child) {

      var attribute = new Eagle.Attribute();
          attribute.parse(child);

      part.attributes.push(attribute);

    });

    Eagle.eachNode('variant', node, function(child) {

      var variant = new Eagle.Variant();
          variant.parse(child);

      part.variants.push(variant);

    });

  };

});

