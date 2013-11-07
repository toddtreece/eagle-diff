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
  this['xreflabel'] = null;
  this['xrefpart'] = null;

  /** CHILDREN **/
  this['libraries'] = [];
  this['attributes'] = [];
  this['variantdefs'] = [];
  this['classes'] = [];
  this['parts'] = [];
  this['sheets'] = [];
  this['errors'] = [];

  this.parse = function(node) {

    var schematic = this;

    Eagle.each(node.attributes, function(i, attribute) {
      schematic[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('libraries', node, function(child) {

      Eagle.eachNode('library', child, function(lib) {

        var library = new Eagle.Library();
            library.parse(lib);

        schematic.libraries.push(library);

      });

    });

    Eagle.eachNode('attributes', node, function(child) {

      Eagle.eachNode('attribute', child, function(a) {

        var attribute = new Eagle.Attribute();
            attribute.parse(a);

        schematic.attributes.push(attribute);

      });

    });

    Eagle.eachNode('variantdefs', node, function(child) {

      Eagle.eachNode('variantdef', child, function(v) {

        var variantdef = new Eagle.VariantDef();
            variantdef.parse(v);

        schematic.variantdefs.push(variantdef);

      });

    });

    Eagle.eachNode('classes', node, function(child) {

      Eagle.eachNode('class', child, function(c) {

        var cl = new Eagle.Class();
            cl.parse(c);

        schematic.classes.push(cl);

      });

    });

    Eagle.eachNode('parts', node, function(child) {

      Eagle.eachNode('part', child, function(p) {

        var part = new Eagle.Part();
            part.parse(p);

        schematic.parts.push(part);

      });

    });

    Eagle.eachNode('sheets', node, function(child) {

      Eagle.eachNode('sheet', child, function(s) {

        var sheet = new Eagle.Sheet();
            sheet.parse(s);

        schematic.sheets.push(sheet);

      });

    });

    Eagle.eachNode('errors', node, function(child) {

      Eagle.eachNode('error', child, function(e) {

        var error = new Eagle.Error();
            error.parse(e);

        schematic.errors.push(error);

      });

    });

  };

});


