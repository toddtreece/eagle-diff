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

  this.parse = function(el) {

    var pack = this;

    $.each(el.attributes, function(i, attribute) {
      pack[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      pack.description = description;

    });

    $.each(this.valid_types, function(i, t) {

      $(t.toLowerCase(), el).each(function() {

        var obj = Eagle[t];

        var type = new obj();
            type.parse(this);

        pack.types.push(type);

      });

    });

  };

});

