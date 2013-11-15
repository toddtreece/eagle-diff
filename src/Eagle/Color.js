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
Eagle.define('Eagle.Color', {

  // these palettes are defined in src/defaultcolors.src
  // which can be found in the eagle install directory
  black: [
    'FF000000',
    'B43232C8',
    'B432C832',
    'B432C8C8',
    'B4C83232',
    'B4C832C8',
    'B4C8C832',
    'B4C8C8C8',
    'B4646464',
    'B40000FF',
    'B400FF00',
    'B400FFFF',
    'B4FF0000',
    'B4FF00FF',
    'B4FFFF00',
    'B4FFFFFF'
  ],

  colored: [
    'FFEEEECE',
    'B4000080',
    'B4008000',
    'B4008080',
    'B4800000',
    'B4800080',
    'B4808000',
    'B4808080',
    'B4C0C0C0',
    'B40000FF',
    'B400FF00',
    'B400FFFF',
    'B4FF0000',
    'B4FF00FF',
    'B4FFFF00',
    'B4000000'
  ],

  white: [
    'B4000080',
    'B4008000',
    'B4008080',
    'B4800000',
    'B4800080',
    'B4808000',
    'B4808080',
    'B4C0C0C0',
    'B40000FF',
    'B400FF00',
    'B400FFFF',
    'B4FF0000',
    'B4FF00FF',
    'B4FFFF00',
    'B4000000'
  ],

  getRgba: function(hex) {

    var values = [];

    values.push( parseInt(hex.substring(2, 4), 16) ); // red
    values.push( parseInt(hex.substring(4, 6), 16) ); // green
    values.push( parseInt(hex.substring(6, 8), 16) ); // blue
    values.push( parseInt(hex.substring(0, 2), 16) ); // alpha

    return 'rgba(' + values.join(', ') + ')';

  },

  getColor: function(index, palette) {

    index = parseInt(index);

    if(typeof pallete == 'undefined') {
      palette = 'black';
    }

    return this.getRgba(this[palette][index]);

  }

});

