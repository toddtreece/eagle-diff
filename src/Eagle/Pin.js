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
Eagle.define('Eagle.Pin', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['x'] = null;
  this['y'] = null;
  this['visible'] = 'both';
  this['length'] = 'long';
  this['direction'] = 'io';
  this['function'] = 'none';
  this['swaplevel'] = 0;
  this['rot'] = 0;

  this.parse = function(node) {

    var pin = this;

    Eagle.each(node.attributes, function(i, attribute) {

      if(attribute.nodeType != 2)
        return;

      pin[attribute.name] = Eagle.discernType(attribute.value);

    });

  };

});

