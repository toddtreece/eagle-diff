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
Eagle.define('Eagle.Segment', function() {

  /** CHILDREN **/
  this['type'] = null;

  this.valid_types = [
    'PinRef',
    'Wire',
    'Junction',
    'Label'
  ];

  this.parse = function(node) {

    var segment = this;

    Eagle.each(this.valid_types, function(i, t) {

      Eagle.eachNode(t.toLowerCase(), node, function(child) {

        var obj = Eagle[t];

        var type = new obj();
            type.parse(child);

        segment.type = type;

        segment.type.draw();

      });

    });

  };

});

