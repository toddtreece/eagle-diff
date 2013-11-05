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
Eagle.define('Eagle.Rectangle', function() {

  /** VARIABLES **/
  this['x1'] = null;
  this['y1'] = null;
  this['x2'] = null;
  this['y2'] = null;
  this['layer'] = null;
  this['rot'] = 0;

  this.parse = function(el) {

    var rectangle = this;

    $.each(el.attributes, function(i, attribute) {
      rectangle[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});

