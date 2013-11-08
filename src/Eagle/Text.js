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
Eagle.define('Eagle.Text', function() {

  /** VARIABLES **/
  this['x'] = null;
  this['y'] = null;
  this['size'] = null;
  this['layer'] = null;
  this['font'] = 'proportional';
  this['ratio'] = 8;
  this['rot'] = 0;
  this['align'] = 'bottom-left';
  this['content'] = null;

  this['parse'] = function(node) {

    var text = this;

    Eagle.each(node.attributes, function(i, attribute) {

      if(attribute.nodeType != 2)
        return;

      text[attribute.name] = Eagle.discernType(attribute.value);

    });

    this.content = node.textContent;

  };

});

