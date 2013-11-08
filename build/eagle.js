/*! eagle-diff version 0.0.1 2013-11-07 5:03:26 PM MST */

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
var Eagle = {

  multiplier: 100,
  version: null,
  drawing: null,
  xml: null,

  canvas: null,
  context: null,
  last: {
    x: 0,
    y: 0
  },

  define: function(string, object) {

    var parts = string.split('.'),
        parent = window;

    for(var i = 0, length = parts.length; i < length; i++) {
      parent[parts[i]] = parent[parts[i]] || object;
      parent = parent[parts[i]];
    }

    return parent;

  },

  discernType: function(value) {

    if(! isNaN(value)) {
      value = parseFloat(value);
      return ((value % 1) === 0) ? parseInt(value) : value;
    } else if(value == 'no' || value == 'yes') {
      return (value == 'yes' ? true : false);
    }

    return value;

  },

  init: function(el, file) {

    this.canvas = document.getElementById(el);
    this.context = this.canvas.getContext('2d');

    this.context.imageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;

    Eagle.get(file, function(data) {
      Eagle.xml = data;
      Eagle.parse();
    });

  },

  parse: function() {

    if(! this.xml)
      throw 'Loading failed';

    if(window.DOMParser) {
      var parser = new DOMParser();
      this.parsed = parser.parseFromString(this.xml, 'text/xml');
    } else {
      this.parsed = new ActiveXObject('Microsoft.XMLDOM');
      this.parsed.async = false;
      this.parsed.loadXML(this.xml);
    }

    this.eachNode('eagle', this.parsed, function(node) {
      Eagle.version = Eagle.discernType(node.getAttribute('version'));
    });

    this.eachNode('drawing', this.parsed, function(node) {

      Eagle.clear();

      Eagle.drawing = new Eagle.Drawing();
      Eagle.drawing.parse(node);

    });

  },

  get: function(url, callback) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

      if (xhr.readyState == 4)
        callback(xhr.responseText);

    };

    xhr.open('GET', url, true);
    xhr.send();

  },

  beginPath: function() {

    this.last.x = 0;
    this.last.y = 0;

    this.context.beginPath();

    return this;

  },

  moveTo: function(x, y, relative) {

    relative = (typeof relative !== 'undefined' ? relative : false);

    // do the math
    if(relative) {
      x = this.last.x + x;
      y = this.last.y + y;
    }

    // move to the location
    this.context.moveTo((this.canvas.width / 2) + x, (this.canvas.height / 2) - y);

    // store the current location for later
    this.last.x = x;
    this.last.y = y;

    return this;

  },

  lineTo: function(x, y, relative) {

    relative = (typeof relative !== 'undefined' ? relative : false);

    // do the math
    if(relative) {
      x = this.last.x + x;
      y = this.last.y + y;
    }

    // move to the location
    this.context.lineTo((this.canvas.width / 2) + x, (this.canvas.height / 2) - y);

    // store the current location for later
    this.last.x = x;
    this.last.y = y;

    return this;

  },

  closePath: function() {

    this.last.x = 0;
    this.last.y = 0;

    this.context.closePath();

    return this;

  },

  stroke: function(width, color) {

    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.stroke();

  },

  clear: function() {
    Eagle.context.clearRect(0, 0, Eagle.canvas.width, Eagle.canvas.height);
  },

  each: function(source, callback) {

    if(source instanceof Array) {

      for(var i = 0; i < source.length; i++) {

        callback(i, source[i]);

      }

    } else if(typeof source == 'object') {

      for(var key in source) {

        callback(key, source[key]);

      }

    }

  },

  eachNode: function(name, source, callback) {

    var results = source.getElementsByTagName(name);

    for(var i = 0; i < results.length; i++) {

      callback(results[i]);

    }

  }

};

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
Eagle.define('Eagle.Approved', function() {

  /** VARIABLES **/
  this['hash'] = null;

  this.parse = function(node) {

    var approved = this;

    Eagle.each(node.attributes, function(i, attribute) {
      approved[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Attribute', function(){

  /** VARIABLES **/
  this['name'] = null;
  this['value'] = null;
  this['x'] = null;
  this['y'] = null;
  this['size'] = null;
  this['layer'] = null;
  this['font'] = null;
  this['ratio'] = null;
  this['rot'] = 0;
  this['display'] = 'value';
  this['constant'] = false;

  this.parse = function(node) {

    var attribute = this;

    Eagle.each(node.attributes, function(i, attr) {
      attribute[attr.name] = Eagle.discernType(attr.value);
    });

  };

});


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
Eagle.define('Eagle.Bus', function() {

  /** VARIABLES **/
  this['name'] = null;

  /** CHILDREN **/
  this['segment'] = null;

  this.parse = function(node) {

    var bus = this;

    Eagle.each(node.attributes, function(i, attribute) {
      bus[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('segment', node, function(child) {

      var segment = new Eagle.Segment();
          segment.parse(child);

      bus.segment = segment;

    });

  };

});


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
Eagle.define('Eagle.Circle', function() {

  /** VARIABLES **/
  this['x'] = null;
  this['y'] = null;
  this['radius'] = null;
  this['width'] = null;
  this['layer'] = null;

  this.parse = function(node) {

    var circle = this;

    Eagle.each(node.attributes, function(i, attribute) {
      circle[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Class', function(){

  /** VARIABLES **/
  this['number'] = null;
  this['name'] = null;
  this['width'] = 0;
  this['drill'] = 0;

  /** CHILDREN **/
  this['clearance'] = null;

  this.parse = function(node) {

    var c = this;

    Eagle.each(node.attributes, function(i, attribute) {
      c[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('clearance', node, function(child) {

      var clearance = new Eagle.Clearance();
          clearance.parse(child);

      c.clearance = clearance;

    });

  };

});


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
Eagle.define('Eagle.Clearance', function() {

  /** VARIABLES **/
  this['class'] = null;
  this['value'] = 0;

  this.parse = function(node) {

    var clearance = this;

    Eagle.each(node.attributes, function(i, attribute) {
      clearance[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Connect', function() {

  /** VARIABLES **/
  this['gate'] = null;
  this['pin'] = null;
  this['pad'] = null;
  this['route'] = 'all';

  this.parse = function(node) {

    var connect = this;

    Eagle.each(node.attributes, function(i, attribute) {
      connect[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Description', function() {

  /** VARIABLES **/
  this['language'] = 'en';
  this['content'] = null;

  this.parse = function(node) {

    var description = this;

    Eagle.each(node.attributes, function(i, attribute) {
      description[attribute.name] = Eagle.discernType(attribute.value);
    });

    this.content = node.textContent;

  };

});


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
Eagle.define('Eagle.Device', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['package'] = null;

  /** CHILDREN **/
  this['connects'] = [];
  this['technologies'] = [];

  this.parse = function(node) {

    var device = this;

    Eagle.each(node.attributes, function(i, attribute) {
      device[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('connects', node, function(child) {

      Eagle.eachNode('connect', child, function(con) {

        var connect = new Eagle.Connect();
            connect.parse(con);

        device.connects.push(connect);

      });

    });

    Eagle.eachNode('technologies', node, function(child) {

      Eagle.eachNode('technology', child, function(tech) {

        var technology = new Eagle.Technology();
            technology.parse(tech);

        device.technologies.push(technology);

      });

    });

  };

});


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
Eagle.define('Eagle.DeviceSet', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['prefix'] = null;
  this['uservalue'] = false;

  /** CHILDREN **/
  this['description'] = null;
  this['gates'] = [];
  this['devices'] = [];

  this.parse = function(node) {

    var deviceset = this;

    Eagle.each(node.attributes, function(i, attribute) {
      deviceset[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      deviceset.description = description;

    });

    Eagle.eachNode('gates', node, function(child) {

      Eagle.eachNode('gate', child, function(g) {

        var gate = new Eagle.Gate();
            gate.parse(g);

        deviceset.gates.push(gate);

      });

    });

    Eagle.eachNode('devices', node, function(child) {

      Eagle.eachNode('device', child, function(dev) {

        var device = new Eagle.Device();
            device.parse(dev);

        deviceset.devices.push(device);

      });

    });

  };

});


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
            layer.parse(lay);

        drawing.layers.push(layer);

      });

    });

    Eagle.eachNode('grid', node, function(child) {

      var grid = new Eagle.Grid();
          grid.parse(child);

      drawing.grid = grid;

    });

    Eagle.eachNode('settings', node, function(child) {

      var settings = new Eagle.Settings();
          settings.parse(child);

      drawing.settings = settings;

    });

    Eagle.eachNode('schematic', node, function(child) {

      var schematic = new Eagle.Schematic();
          schematic.parse(child);

      drawing.schematic = schematic;

    });

    Eagle.eachNode('board', node, function(child) {

      var board = new Eagle.Board();
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
Eagle.define('Eagle.Frame', function() {

  /** VARIABLES **/
  this['x1'] = null;
  this['y1'] = null;
  this['x2'] = null;
  this['y2'] = null;
  this['columns'] = null;
  this['rows'] = null;
  this['layer'] = null;
  this['border-left'] = true;
  this['border-top'] = true;
  this['border-right'] = true;
  this['border-bottom'] = true;

  this.parse = function(node) {

    var frame = this;

    Eagle.each(node.attributes, function(i, attribute) {
      frame[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Gate', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['symbol'] = null;
  this['x'] = null;
  this['y'] = null;
  this['addlevel'] = 'next';
  this['swaplevel'] = 0;

  this.parse = function(node) {

    var gate = this;

    Eagle.each(node.attributes, function(i, attribute) {
      gate[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Grid', function(){

  /** VARIABLES **/
  this['distance'] = null;
  this['unitdist'] = null;
  this['unit'] = null;
  this['style'] = 'lines';
  this['multiple'] = 1;
  this['display'] = false;
  this['altdistance'] = null;
  this['altunitdist'] = null;
  this['altunit'] = null;
  this['path'] = null;

  this.parse = function(node) {

    var grid = this;

    Eagle.each(node.attributes, function(i, attribute) {
      grid[attribute.name] = Eagle.discernType(attribute.value);
    });

    //grid.draw();

  };

  this.draw = function() {

    if(! this.display)
      return false;

    var width = Eagle.canvas.width,
        height = Eagle.canvas.height;

    Eagle.beginPath();

    for(var y = 0; y < height; y += this.distance) {
      Eagle.moveTo(0, y);
      Eagle.lineTo(width, y);
    }

    for(var x = 0; x < width; x += this.distance) {
      Eagle.moveTo(x, 0);
      Eagle.lineTo(x, height);
    }

    Eagle.closePath();

    Eagle.stroke(0.1, '#000');

  };

});


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
Eagle.define('Eagle.Hole', function() {

  /** VARIABLES **/
  this['x'] = null;
  this['y'] = null;
  this['drill'] = null;

  this.parse = function(node) {

    var hole = this;

    Eagle.each(node.attributes, function(i, attribute) {
      hole[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Instance', function() {

  /** VARIABLES **/
  this['part'] = null;
  this['gate'] = null;
  this['x'] = null;
  this['y'] = null;
  this['smashed'] = false;
  this['rot'] = 0;

  /** CHILDREN **/
  this['attribute'] = null;

  this.parse = function(node) {

    var instance = this;

    Eagle.each(node.attributes, function(i, attribute) {
      instance[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('attribute', node, function(child) {

      var attribute = new Eagle.Attribute();
          attribute.parse(child);

      instance.attribute = attribute;

    });

  };

  this.draw = function() {
    //TODO
  };

});


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
Eagle.define('Eagle.Junction', function() {

  /** VARIABLES **/
  this['x'] = null;
  this['y'] = null;

  this.parse = function(node) {

    var junction = this;

    Eagle.each(node.attributes, function(i, attribute) {
      junction[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

  this.draw = function() {
    // TODO
  };

});


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
Eagle.define('Eagle.Label', function() {

  /** VARIABLES **/
  this['x'] = null;
  this['y'] = null;
  this['size'] = null;
  this['layer'] = null;
  this['font'] = 'proportional';
  this['ratio'] = 8;
  this['rot'] = 0;
  this['xref'] = false;

  this.parse = function(node) {

    var label = this;

    Eagle.each(node.attributes, function(i, attribute) {
      label[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

  this.draw = function() {
    // TODO
  };

});


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
Eagle.define('Eagle.Layer', function(){

  /** VARIABLES **/
  this['number'] = null;
  this['name'] = null;
  this['color'] = null;
  this['fill'] = null;
  this['visible'] = true;
  this['active'] = true;

  this.parse = function(node) {

    var layer = this;

    Eagle.each(node.attributes, function(i, attribute) {
      layer[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Library', function() {

  /** VARIABLES **/
  this['name'] = null;

  /** CHILDREN **/
  this['description'] = null;
  this['packages'] = [];
  this['symbols'] = [];
  this['devicesets'] = [];

  this.parse = function(node) {

    var library = this;

    Eagle.each(node.attributes, function(i, attribute) {
      library[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      library.description = description;

    });

    Eagle.eachNode('packages', node, function(child) {

      Eagle.eachNode('package', child, function(p) {

        var pack = new Eagle.Package();
            pack.parse(p);

        library.packages.push(pack);

      });

    });

    Eagle.eachNode('symbols', node, function(child) {

      Eagle.eachNode('symbol', child, function(s) {

        var symbol = new Eagle.Symbol();
            symbol.parse(s);

        library.symbols.push(symbol);

      });

    });

    Eagle.eachNode('devicesets', node,function(child) {

      Eagle.eachNode('deviceset', child, function(d) {

        var deviceset = new Eagle.DeviceSet();
            deviceset.parse(d);

        library.devicesets.push(deviceset);

      });

    });

  };

  this.getSymbol = function(name) {

    Eagle.each(this.symbols, function(i, symbol) {

      if(symbol.name == name)
        return name;

    });

  };

});


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
Eagle.define('Eagle.Net', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['class'] = 0;

  /** CHILDREN **/
  this['segment'] = null;

  this.parse = function(node) {

    var net = this;

    Eagle.each(node.attributes, function(i, attribute) {
      net[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('segment', node, function(child) {

      var segment = new Eagle.Segment();
          segment.parse(child);

      net.segment = segment;

    });

  };

});


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
Eagle.define('Eagle.Package', function() {

  /** VARIABLES **/
  this['name'] = null;

  /** CHILDREN **/
  this['description'] = null;
  this['types'] = [];

  this.valid_types = [
    'Polygon',
    'Wire',
    'Text',
    'Circle',
    'Rectangle',
    'Frame',
    'Hole',
    'Pad',
    'SMD'
  ];

  this.parse = function(node) {

    var pack = this;

    Eagle.each(node.attributes, function(i, attribute) {
      pack[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      pack.description = description;

    });

    Eagle.each(this.valid_types, function(i, t) {

      Eagle.eachNode(t.toLowerCase(), node, function(child) {

        var obj = Eagle[t],
            type = new obj();

        type.parse(child);

        pack.types.push(type);

      });

    });

  };

});


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
Eagle.define('Eagle.Pad', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['x'] = null;
  this['y'] = null;
  this['drill'] = null;
  this['diameter'] = 0;
  this['shape'] = 'round';
  this['rot'] = 0;
  this['stop'] = true;
  this['thermals'] = true;
  this['first'] = true;

  this.parse = function(node) {

    var pad = this;

    Eagle.each(node.attributes, function(i, attribute) {
      pad[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Param', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['value'] = null;

  this.parse = function(node) {

    var param = this;

    Eagle.each(node.attributes, function(i, attribute) {
      param[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Part', function(){

  /** VARIABLES **/
  this['name'] = null;
  this['library'] = null;
  this['deviceset'] = null;
  this['device'] = null;
  this['technology'] = null;
  this['value'] = null;

  /** CHILDREN **/
  this['attributes'] = [];
  this['variants'] = [];

  this.parse = function(node) {

    var part = this;

    Eagle.each(node.attributes, function(i, attribute) {
      part[attribute.name] = Eagle.discernType(attribute.value);
    });


    Eagle.eachNode('attributes', node, function(child) {

      var attribute = new Eagle.Attribute();
          attribute.parse(child);

      part.attributes.push(attribute);

    });

    Eagle.eachNode('variant', node, function(child) {

      var variant = new Eagle.Variant();
          variant.parse(child);

      part.variants.push(variant);

    });

  };

});


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
Eagle.define('Eagle.Pass', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['refer'] = null;
  this['active'] = true;

  /** CHILDREN **/
  this['param'] = null;

  this.parse = function(node) {

    var pass = this;

    Eagle.each(node.attributes, function(i, attribute) {
      pass[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('param', node, function(child) {

      var param = new Eagle.Param();
          param.parse(child);

      pass.param = param;

    });

  };

});


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
      pin[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.PinRef', function() {

  /** VARIABLES **/
  this['part'] = null;
  this['gate'] = null;
  this['pin'] = null;

  this.parse = function(node) {

    var pinref = this;

    Eagle.each(node.attributes, function(i, attribute) {
      pinref[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

  this.draw = function() {
    // TODO
  };

});


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
Eagle.define('Eagle.Polygon', function() {

  /** VARIABLES **/
  this['width'] = null;
  this['layer'] = null;
  this['spacing'] = null;
  this['pour'] = 'solid';
  this['isolate'] = null;
  this['orphans'] = false;
  this['thermals'] = true;
  this['rank'] = 0;

  /** CHILDREN **/
  this['vertices'] = [];

  this.parse = function(node) {

    var polygon = this;

    Eagle.each(node.attributes, function(i, attribute) {
      polygon[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('vertex', node, function(child) {

      var vertex = new Eagle.Vertex();
          vertex.parse(child);

      polygon.vertex.push(vertex);

    });

  };

});


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

  this.parse = function(node) {

    var rectangle = this;

    Eagle.each(node.attributes, function(i, attribute) {
      rectangle[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.SMD', function() {

  /** VARIABLES **/
  this['name'] = null;
  this['x'] = null;
  this['y'] = null;
  this['dx'] = null;
  this['dy'] = null;
  this['layer'] = null;
  this['roundness'] = 0;
  this['rot'] = 0;
  this['stop'] = true;
  this['thermals'] = true;
  this['cream'] = true;

  this.parse = function(node) {

    var smd = this;

    Eagle.each(node.attributes, function(i, attribute) {
      smd[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Settings', function(){

  /** VARIABLES **/
  this['alwaysvectorfont'] = null;
  this['verticaltext'] = 'up';

  this.parse = function(node) {

    var settings = this;

    Eagle.eachNode('setting', node, function(child) {

      Eagle.each(child.attributes, function(i, attribute) {
        settings[attribute.name] = Eagle.discernType(attribute.value);
      });

    });

  };

});



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
Eagle.define('Eagle.Sheet', function() {

  /** CHILDREN **/
  this['description'] = null;
  //this.plain = null;
  this['instances'] = [];
  this['busses'] = [];
  this['nets'] = [];

  this.parse = function(node) {

    var sheet = this;

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      sheet.description = description;

    });

    /** TODO: what the fuck is plain?
    Eagle.eachNode('plain', node, function() {

      var plain = new Eagle.Plain();
          plain.parse(this);

      sheet.plain = plain;

    }); */

    Eagle.eachNode('instances', node, function(child) {

      Eagle.eachNode('instance', child, function(i) {

        var instance = new Eagle.Instance();
            instance.parse(i);

        sheet.instances.push(instance);

      });

    });

    Eagle.eachNode('busses', node, function(child) {

      Eagle.eachNode('bus', child, function(b) {

        var bus = new Eagle.Bus();
            bus.parse(b);

        sheet.busses.push(bus);

      });

    });

    Eagle.eachNode('nets', node, function(child) {

      Eagle.eachNode('net', child, function(n) {

        var net = new Eagle.Net();
            net.parse(n);

        sheet.nets.push(net);

      });

    });

  };

});


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
Eagle.define('Eagle.Symbol', function() {

  /** VARIABLES **/
  this['name'] = null;

  /** CHILDREN **/
  this['description'] = null;
  this['types'] = [];

  this.valid_types = [
    'Polygon',
    'Wire',
    'Text',
    'Pin',
    'Circle',
    'Rectangle',
    'Frame'
  ];

  this.parse = function(node) {

    var symbol = this;

    Eagle.each(node.attributes, function(i, attribute) {
      symbol[attribute.name] = Eagle.discernType(attribute.value);
    });

    Eagle.eachNode('description', node, function(child) {

      var description = new Eagle.Description();
          description.parse(child);

      symbol.description = description;

    });

    Eagle.each(this.valid_types, function(i, t) {

      Eagle.eachNode(t.toLowerCase(), node, function(child) {

        var obj = Eagle[t];

        var type = new obj();
            type.parse(child);

        symbol.types.push(type);

      });

    });

  };

});


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
Eagle.define('Eagle.Technology', function() {

  /** VARIABLES **/
  this['name'] = null;

  this.parse = function(node) {

    var technology = this;

    Eagle.each(node.attributes, function(i, attribute) {
      technology[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
      text[attribute.name] = Eagle.discernType(attribute.value);
    });

    this.content = node.textContent;

  };

});


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
Eagle.define('Eagle.Variant', function(){

  /** VARIABLES **/
  this['name'] = null;
  this['populate'] = true;
  this['value'] = null;
  this['technology'] = null;

  this.parse = function(node) {

    var variant = this;

    Eagle.each(node.attributes, function(i, attribute) {
      variant[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.VariantDef', function(){

  /** VARIABLES **/
  this['name'] = null;

  this.parse = function(node) {

    var variantdef = this;

    Eagle.each(node.attributes, function(i, attribute) {
      variantdef[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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
Eagle.define('Eagle.Vertex', function() {

  /** VARIABLES **/
  this['x'] = null;
  this['y'] = null;
  this['curve'] = 0;

  this.parse = function(node) {

    var vertex = this;

    Eagle.each(node.attributes, function(i, attribute) {
      vertex[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

});


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

