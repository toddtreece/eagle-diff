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
Eagle.define('Eagle.Wire', function() {

  /** VARIABLES **/
  this['x1'] = null;
  this['y1'] = null;
  this['x2'] = null;
  this['y2'] = null;
  this['width'] = null;
  this['layer'] = null;
  this['extent'] = null;
  this['style'] = 'continuous';
  this['curve'] = 0;
  this['cap'] = 'round';

  this.parse = function(node) {

    var wire = this;

    Eagle.each(node.attributes, function(i, attribute) {

      if(attribute.nodeType != 2)
        return;

      wire[attribute.name] = Eagle.discernType(attribute.value);

    });

  };

  this.draw = function() {

    var layer = Eagle.drawing.getLayer(this.layer);

    if(! layer)
      return;

    if(! layer.visible)
      return;

    if(! layer.active)
      return;

    Eagle.beginPath()
      .moveTo(this.x1 * 2, this.y1 * 2)
      .lineTo(this.x2 * 2, this.y2 * 2)
      .closePath()
      .stroke(this.width * 2, '#000');

  };

});

