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
Eagle.define('Eagle.Drawing', function() {

  /** CHILDREN **/
  this.settings = null;
  this.grid = null;
  this.schematic = null;
  this.board = null;
  this.layers = [];

  this.parse = function(el) {

    var drawing = this;

    $('grid', el).each(function() {

      var grid = new Eagle.Grid();
          grid.parse(this);

      drawing.grid = grid;

    });

    $('settings', el).each(function() {

      var settings = new Eagle.Settings();
          settings.parse(this);

      drawing.settings = settings;

    });

    $('schematic', el).each(function() {

      var schematic = new Eagle.Schematic();
          schematic.parse(this);

      drawing.schematic = schematic;

    });

    $('board', el).each(function() {

      var board = new Eagle.Board();
          board.parse(this);

      drawing.board = board;

    });

    $('layers', el).each(function() {

      $('layer', this).each(function() {

        var layer = new Eagle.Layer();
            layer.parse(this);

        drawing.layers.push(layer);

      });

    });

  };

});

