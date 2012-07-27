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
Eagle.define('Eagle.Schematic', function() {

  /** VARIABLES **/
  this.xreflabel = null;
  this.xrefpart = null;

  /** CHILDREN **/
  this.libraries = [];
  this.attributes = [];
  this.variantdefs = [];
  this.classes = [];
  this.parts = [];
  this.sheets = [];
  this.errors = [];

  this.parse = function(el) {

    var schematic = this;

    $.each(el.attributes, function(i, attribute) {
      schematic[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('libraries', el).each(function() {

      $('library', this).each(function() {

        var library = new Eagle.Library();
            library.parse(this);

        schematic.libraries.push(library);

      });

    });

    $('attributes', el).each(function() {

      $('attribute', this).each(function() {

        var attribute = new Eagle.Attribute();
            attribute.parse(this);

        schematic.attributes.push(attribute);

      });

    });

    $('variantdefs', el).each(function() {

      $('variantdef', this).each(function() {

        var variantdef = new Eagle.VariantDef();
            variantdef.parse(this);

        schematic.variantdefs.push(variantdef);

      });

    });

    $('classes', el).each(function() {

      $('class', this).each(function() {

        var c = new Eagle.Class();
            c.parse(this);

        schematic.classes.push(c);

      });

    });

    $('sheets', el).each(function() {

      $('sheet', this).each(function() {

        var sheet = new Eagle.Sheet();
            sheet.parse(this);

        schematic.sheets.push(sheet);

      });

    });

    $('errors', el).each(function() {

      $('error', this).each(function() {

        var error = new Eagle.Error();
            error.parse(this);

        schematic.errors.push(error);

      });

    });

  };

});


