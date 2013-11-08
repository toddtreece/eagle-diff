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
Eagle.define('Eagle.Package', function() {

  /** VARIABLES **/
  this['name'] = null;

  /** CHILDREN **/
  this['description'] = null;
  this['types'] = [];

  this.valid_types = [
    'Polygon',
    'Wire',
    'Text',
    'Circle',
    'Rectangle',
    'Frame',
    'Hole',
    'Pad',
    'SMD'
  ];

  this.parse = function(node) {

    var pack = this;

    Eagle.each(node.attributes, function(i, attribute) {

      if(attribute.nodeType != 2)
        return;

      pack[attribute.name] = Eagle.discernType(attribute.value);

    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parent = pack;
          description.parse(child);

      pack.description = description;

    });

    Eagle.each(this.valid_types, function(i, t) {

      Eagle.eachNode(t.toLowerCase(), node, function(child) {

        var obj = Eagle[t],
            type = new obj();

        type.parent = pack;
        type.parse(child);

        pack.types.push(type);

      });

    });

  };

});

