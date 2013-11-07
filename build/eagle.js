/*! eagle-diff version 0.0.1 2013-11-07 12:11:07 PM MST */

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

      var drawing = new Eagle.Drawing();
          drawing.parse(node);

      Eagle.drawing = drawing;

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
    this.context.moveTo(x, this.canvas.height - y);

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
    this.context.lineTo(x, this.canvas.height - y);

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

      for(key in source) {

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
  this['ratio'] = null
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

    Eagle.eachNode('layers', node, function(child) {

      Eagle.eachNode('layer', child, function(lay) {

        var layer = new Eagle.Layer();
            layer.parse(lay);

        drawing.layers.push(layer);

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

    var path = '';
        width = Eagle.canvas.width,
        height = Eagle.canvas.height;

    Eagle.beginPath();

    for(var y = 0; y < height; y += this.distance) {
      Eagle.moveTo(0,y);
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

  this.parse = function(el) {

    var hole = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var instance = this;

    $.each(el.attributes, function(i, attribute) {
      instance[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('attribute', el).each(function() {

      var attribute = new Eagle.Attribute();
          attribute.parse(this);

      instance.attribute = attribute;

    });

  };

  this.draw = function() {

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

  this.parse = function(el) {

    var junction = this;

    $.each(el.attributes, function(i, attribute) {
      junction[attribute.name] = Eagle.discernType(attribute.value);
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

  this.parse = function(el) {

    var label = this;

    $.each(el.attributes, function(i, attribute) {
      label[attribute.name] = Eagle.discernType(attribute.value);
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
Eagle.define('Eagle.Layer', function(){

  /** VARIABLES **/
  this['number'] = null;
  this['name'] = null;
  this['color'] = null;
  this['fill'] = null;
  this['visible'] = true;
  this['active'] = true;

  this.parse = function(el) {

    var layer = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var library = this;

    $.each(el.attributes, function(i, attribute) {
      library[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      library.description = description;

    });

    $('packages', el).each(function() {

      $('package', this).each(function() {

        var pack = new Eagle.Package();
            pack.parse(this);

        library.packages.push(pack);

      });

    });

    $('symbols', el).each(function() {

      $('symbol', this).each(function() {

        var symbol = new Eagle.Symbol();
            symbol.parse(this);

        library.symbols.push(symbol);

      });

    });

    $('devicesets', el).each(function() {

      $('deviceset', this).each(function() {

        var deviceset = new Eagle.DeviceSet();
            deviceset.parse(this);

        library.devicesets.push(deviceset);

      });

    });

  };

  this.getSymbol = function(name) {

    $.each(this.symbols, function(i,symbol) {

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

  this.parse = function(el) {

    var net = this;

    $.each(el.attributes, function(i, attribute) {
      net[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('segment', el).each(function() {

      var segment = new Eagle.Segment();
          segment.parse(this);

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

  this.parse = function(el) {

    var pack = this;

    $.each(el.attributes, function(i, attribute) {
      pack[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      pack.description = description;

    });

    $.each(this.valid_types, function(i, t) {

      $(t.toLowerCase(), el).each(function() {

        var obj = Eagle[t];

        var type = new obj();
            type.parse(this);

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

  this.parse = function(el) {

    var pad = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var param = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var part = this;

    $.each(el.attributes, function(i, attribute) {
      part[attribute.name] = Eagle.discernType(attribute.value);
    });


    $('attributes', el).each(function() {

      var attribute = new Eagle.Attribute();
          attribute.parse(this);

      part.attributes.push(attribute);

    });

    $('variant', el).each(function() {

      var variant = new Eagle.Variant();
          variant.parse(this);

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

  this.parse = function(el) {

    var pass = this;

    $.each(el.attributes, function(i, attribute) {
      pass[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('param', el).each(function() {

      var param = new Eagle.Param();
          param.parse(this);

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

  this.parse = function(el) {

    var pin = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var pinref = this;

    $.each(el.attributes, function(i, attribute) {
      pinref[attribute.name] = Eagle.discernType(attribute.value);
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

  this.parse = function(el) {

    var polygon = this;

    $.each(el.attributes, function(i, attribute) {
      polygon[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('vertex', el).each(function() {

      var vertex = new Eagle.Vertex();
          vertex.parse(this);

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

  this.parse = function(el) {

    var rectangle = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var smd = this;

    $.each(el.attributes, function(i, attribute) {
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

    $('parts', el).each(function() {

      $('part', this).each(function() {

        var part = new Eagle.Part();
            part.parse(this);

        schematic.parts.push(part);

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

    Ea.each(this.valid_types, function(i, t) {
      
      $(t.toLowerCase(), el).each(function() {

        var obj = Eagle[t];

        var type = new obj();
            type.parse(this);

        if(t == 'Wire')
          type.draw();

        segment.type = type;

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

  this.parse = function(el) {

    var settings = this;

    $('setting', el).each(function() {

      $.each(this.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var sheet = this;

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      sheet.description = description;

    });

    /** TODO: what the fuck is plain?
    $('plain', el).each(function() {

      var plain = new Eagle.Plain();
          plain.parse(this);

      sheet.plain = plain;

    }); */

    $('instances', el).each(function() {

      $('instance', this).each(function() {

        var instance = new Eagle.Instance();
            instance.parse(this);

        sheet.instances.push(instance);

      });

    });

    $('busses', el).each(function() {

      $('bus', this).each(function() {

        var bus = new Eagle.Bus();
            bus.parse(this);

        sheet.busses.push(bus);

      });

    });

    $('nets', el).each(function() {

      $('net', this).each(function() {

        var net = new Eagle.Net();
            net.parse(this);

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

  this.parse = function(el) {

    var symbol = this;

    $.each(el.attributes, function(i, attribute) {
      symbol[attribute.name] = Eagle.discernType(attribute.value);
    });

    $('description', el).each(function() {

      var description = new Eagle.Description();
          description.parse(this);

      symbol.description = description;

    });

    $.each(this.valid_types, function(i, t) {

      $(t.toLowerCase(), el).each(function() {

        var obj = Eagle[t];

        var type = new obj();
            type.parse(this);

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

  this.parse = function(el) {

    var technology = this;

    $.each(el.attributes, function(i, attribute) {
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

  this['parse'] = function(el) {

    var text = this;

    $.each(el.attributes, function(i, attribute) {
      text[attribute.name] = Eagle.discernType(attribute.value);
    });

    this.content = $(el).html();

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

  this.parse = function(el) {

    var variant = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var variantdef = this;

    $.each(el.attributes, function(i, attribute) {
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

  this.parse = function(el) {

    var vertex = this;

    $.each(el.attributes, function(i, attribute) {
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

    Eagle.each(node.attributes, function(attribute) {
      wire[attribute.name] = Eagle.discernType(attribute.value);
    });

  };

  this.draw = function() {

    Eagle.beginPath()
      .moveTo(this.x1, this.y1)
      .lineTo(this.x2, this.y2)
      .closePath()
      .stroke(this.width, 'red');

  };

});

