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
Eagle.define('Eagle.Drawing', function() {

  /** CHILDREN **/
  this['settings'] = null;
  this['grid'] = null;
  this['schematic'] = null;
  this['board'] = null;
  this['layers'] = [];

  this.parse = function(node) {

    var drawing = this;

    Eagle.eachNode('layers', node, function(child) {

      Eagle.eachNode('layer', child, function(lay) {

        var layer = new Eagle.Layer();
            layer.parent = drawing;
            layer.parse(lay);

        drawing.layers.push(layer);

      });

    });

    Eagle.eachNode('grid', node, function(child) {

      var grid = new Eagle.Grid();
          grid.parent = drawing;
          grid.parse(child);

      drawing.grid = grid;

    });

    Eagle.eachNode('settings', node, function(child) {

      var settings = new Eagle.Settings();
          settings.parent = drawing;
          settings.parse(child);

      drawing.settings = settings;

    });

    Eagle.eachNode('schematic', node, function(child) {

      var schematic = new Eagle.Schematic();
          schematic.parent = drawing;
          schematic.parse(child);

      drawing.schematic = schematic;

    });

    Eagle.eachNode('board', node, function(child) {

      var board = new Eagle.Board();
          board.parent = drawing;
          board.parse(child);

      drawing.board = board;

    });

  };

  this.getLayer = function(id) {

    var layer = false;

    Eagle.each(this.layers, function(i, lay) {

      if(lay.number == id)
        layer = lay;

    });

    return layer;

  };

});

