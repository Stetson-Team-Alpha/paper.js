/**
 *  Imports svg into items with groups
 *  Stetson Alpha - Paper.js
 *
 */

var ImportSVG = this.ImportSVG = Base.extend({
	/**
	 * Creates a Paper.js Path by parsing
	 * any svg node (rect, path, circle, polygon, g, svg, etc)
	 * and creating the right path object based on the svg type.
	 *
	 * takes in a svg object (xml dom)
	 * returns Paper.js Item
	 */
	importSVG: function(svg) {
		var item = null;
		switch (svg.nodeName.toLowerCase()) {
			case 'line':
				item = this._importLine(svg);
				break;
			case 'rect':
				item = this._importRectangle(svg);
				break;
			case 'ellipse':
				item = this._importOval(svg);
				break;
			case 'g':
			case 'svg':
				item = this._importGroup(svg);
				break;
			case 'text':
				item = this._importText(svg);
				break;
			case 'path':
				item = this._importPath(svg);
				break;
			case 'polygon':
			case 'polyline':
				item = this._importPoly(svg);
				break;
		}

		if (item) {
			this._importAttributesAndStyles(svg, item);
		}

		return item;
	},
	
	/**
	 * Creates a Paper.js Group by parsing
	 * a specific svg g node
	 *
	 * takes in a svg object (xml dom)
	 * returns Paper.js Group
	 */
	_importGroup: function(svg) {
		var group = new Group();
		var child;
		for (var i in svg.childNodes) {
			child = svg.childNodes[i];
			if (child.nodeType != 1) {
				continue;
			}
			item = this.importSVG(child);
			if (item) {
				group.addChild(item);
			}
		}

		return group;
	},

	/**
	 * Creates a Path.Circle Paper.js item
	 *
	 * takes a svg circle node (xml dom)
	 * returns Paper.js Path.Circle item
	 */
	_importCircle: function(svgCircle) {
		var cx = svgCircle.cx.baseVal.value || 0;
		var cy = svgCircle.cy.baseVal.value || 0;
		var r = svgCircle.r.baseVal.value || 0;
		var center = new Point(cx, cy);
		var circle = new Path.Circle(center, r);

		return circle;
	},

	/**
	 * Creates a Path.Oval Paper.js item
	 *
	 * takes a svg ellipse node (xml dom)
	 * returns Paper.js Path.Oval item
	 */
	_importOval: function(svgOval) {
		var cx = svgOval.cx.baseVal.value || 0;
		var cy = svgOval.cy.baseVal.value || 0;
		var rx = svgOval.rx.baseVal.value || 0;
		var ry = svgOval.ry.baseVal.value || 0;

		var center = new Point(cx, cy);
		var offset = new Point(rx, ry);
		var topLeft = center.subtract(offset);
		var bottomRight = center.add(offset);

		var rect = new Rectangle(topLeft, bottomRight);
		var oval = new Path.Oval(rect);

		return oval;
	},

	/**
	 * Creates a "rectangle" Paper.js item
	 *
	 * takes a svg rect node (xml dom)
	 * returns either a
	 *   - Path.Rectangle item
	 *   - Path.RoundRectangle item (if the rectangle has rounded corners)
	 */
	_importRectangle: function(svgRectangle) {
		var x = svgRectangle.x.baseVal.value || 0;
		var y = svgRectangle.y.baseVal.value || 0;
		var rx = svgRectangle.rx.baseVal.value || 0;
		var ry = svgRectangle.ry.baseVal.value || 0;
		var width = svgRectangle.width.baseVal.value || 0;
		var height = svgRectangle.height.baseVal.value || 0;

		var topLeft = new Point(x, y);
		var size = new Size(width, height);
		var rectangle = new Rectangle(topLeft, size);

		if (rx > 0 || ry > 0) {
			var cornerSize = new Size(rx, ry);
			rectangle = new Path.RoundRectangle(rectangle, cornerSize);
		} else {
			rectangle = new Path.Rectangle(rectangle);
		}

		return rectangle;
	},

	/**
	 * Creates a Path.Line Paper.js item
	 *
	 * takes a svg line node (xml dom)
	 * returns a Path.Line item
	 */
	_importLine: function(svgLine) {
		var x1 = svgLine.x1.baseVal.value || 0;
		var y1 = svgLine.y1.baseVal.value || 0;
		var x2 = svgLine.x2.baseVal.value || 0;
		var y2 = svgLine.y2.baseVal.value || 0;

		var from = new Point(x1, y1);
		var to = new Point(x2, y2);
		var line = new Path.Line(from, to);

		return line;
	},

	/**
	 * Creates a PointText Paper.js item
	 *
	 * takes a svg text node (xml dom)
	 * returns a PointText item
	 */
	_importText: function(svgText) {
		//TODO: Extend this for multiple values
		var x = svgText.x.baseVal.getItem(0).value || 0;
		var y = svgText.y.baseVal.getItem(0).value || 0;
		//END:TODO

		var dx; //character kerning
		var dy; //character baseline
		var rotate; //character rotation
		var textLength; //the width of the containing box
		var lengthAdjust; //
		var textContent = svgText.textContent || "";
		var topLeft = new Point(x, y);
		var text = new PointText(topLeft);
		text.content = textContent;

		return text;
	},

	/**
	 * Creates a Path Paper.js item
	 *
	 * takes a svg path node (xml dom)
	 * returns a Path item
	 */
	_importPath: function(svgPath) {
		var path = new Path();
		var segments = svgPath.pathSegList;
		var segment;
		var j;
		var relativeToPoint;
		var controlPoint;
		var prevCommand;
		var segmentTo;
		for (var i = 0; i < segments.numberOfItems; ++i){
			segment = segments.getItem(i);
			if (segment.pathSegType == SVGPathSeg.PATHSEG_UNKNOWN) {
				continue;
			}
			if (segment.pathSegType % 2 == 1 && path.segments.length > 0) {
				relativeToPoint = path.lastSegment.point;
			} else {
				relativeToPoint = new Point(0, 0);
			}
			segmentTo = new Point(segment.x, segment.y);
			segmentTo = segmentTo.add(relativeToPoint);
			switch (segment.pathSegType) {
				case SVGPathSeg.PATHSEG_CLOSEPATH:
					path.closePath();
					break;
				case SVGPathSeg.PATHSEG_MOVETO_ABS:
				case SVGPathSeg.PATHSEG_MOVETO_REL:
					path.moveTo(segmentTo);
					break;
				case SVGPathSeg.PATHSEG_LINETO_ABS:
				case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
				case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
				case SVGPathSeg.PATHSEG_LINETO_REL:
				case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
				case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
					path.lineTo(segmentTo);
					break;
				case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
				case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
					path.cubicCurveTo(
						relativeToPoint.add([segment.x1, segment.y1]),
						relativeToPoint.add([segment.x2, segment.y2]),
						segmentTo
					);
					break;
				case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
				case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
					path.quadraticCurveTo(
						relativeToPoint.add([segment.x1, segment.y1]),
						segmentTo
					);
					break;
				case SVGPathSeg.PATHSEG_ARC_ABS:
				case SVGPathSeg.PATHSEG_ARC_REL:
					//TODO: Implement Arcs. They're ugly.
					//http://www.w3.org/TR/SVG/implnote.html
					break;
				case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
				case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
					prevCommand = segments.getItem(i - 1);
					controlPoint = new Point(prevCommand.x2, prevCommand.y2);
					controlPoint = controlPoint.subtract([prevCommand.x, prevCommand.y]);
					controlPoint = controlPoint.add(path.lastSegment.point);
					controlPoint = path.lastSegment.point.subtract(controlPoint);
					controlPoint = path.lastSegment.point.add(controlPoint);
					path.cubicCurveTo(
						controlPoint,
						relativeToPoint.add([segment.x2, segment.y2]),
						segmentTo
					);
					break;
				case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
				case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
					for (j = i; j >= 0; --j) {
						prevCommand = segments.getItem(j);
						if (prevCommand.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS ||
							prevCommand.pathSegType == SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL
						) {
							controlPoint = new Point(prevCommand.x1, prevCommand.y1);
							controlPoint = controlPoint.subtract([prevCommand.x, prevCommand.y]);
							controlPoint = controlPoint.add(path.segments[j].point);
							break;
						}
					}
					for (j; j < i; ++j) {
						controlPoint = path.segments[j].point.subtract(controlPoint);
						controlPoint = path.segments[j].point.add(controlPoint);
					}
					path.quadraticCurveTo(controlPoint, segmentTo);
					break;
			}
		}

		return path;
	},

	/**
	 * Creates a Path Paper.js item
	 *
	 * takes either
	 *   - svg polyline node (xml dom)
	 *   - svg polygon node (xml dom)
	 * returns a Path item
	 */
	_importPoly: function(svgPoly) {
		var poly = new Path();
		var points = svgPoly.points;
		var start = points.getItem(0);
		var point;
		poly.moveTo([start.x, start.y]);
		
		for (var i = 1; i < points.length; ++i) {
			point = points.getItem(i);
			poly.lineTo([point.x, point.y]);
		}
		if (svgPoly.nodeName.toLowerCase() == 'polygon') {
			poly.closePath();
		}

		return poly;
	},

	/**
	 * Pulls various style attributes and applies them to item.
	 * This method is destructive to item (changes happen to it)
	 *
	 * takes
	 *   - a svg node (xml dom)
	 *   - Paper.js Item
	 */
	_importAttributesAndStyles: function(svg, item) {
		//TODO:Gradients
		var name,
			value;
		for (var i = 0; i < svg.style.length; ++i) {
			name = svg.style[i];
			value = svg.style[name];
			this._applyAttributeOrStyle(name, value, item);
		}
		for (var i = 0; i < svg.attributes.length; ++i) {
			name = svg.attributes[i].name;
			value = svg.attributes[i].value;
			this._applyAttributeOrStyle(name, value, item);
		}
	},

	/**
	 * Pulls a style attribute and applies it to item.
	 * This method is destructive to item (changes happen to it)
	 *
	 * takes
	 *   - a style name (e.g. stroke-width)
	 *   - a style value (e.g. 2px)
	 *   - Paper.js Item
	 */
	 _applyAttributeOrStyle: function(name, value, item) {
		switch (name) {
			case 'id':
				item.name = value;
				break;
			case 'fill':
				if (value != 'none') {
					item.fillColor = value;
				}
				break;
			case 'stroke':
				if (value != 'none') {
					item.strokeColor = value;
				}
				break;
			case 'stroke-width':
				item.strokeWidth = parseFloat(value, 10);
				break;
			case 'stroke-linecap':
				item.strokeCap = value;
				break;
			case 'stroke-linejoin':
				item.strokeJoin = value;
				break;
			case 'stroke-dasharray':
				value = value.replace(/px/g, '');
				value = value.replace(/, /g, ',');
				value = value.replace(/ /g, ',');
				value = value.split(',');
				for (var i in value) {
					value[i] = parseFloat(value[i], 10);
				}
				item.dashArray = value;
				break;
			case 'stroke-dashoffset':
				item.dashOffset = parseFloat(value, 10);
				break;
			case 'stroke-miterlimit':
				item.miterLimit = parseFloat(value, 10);
				break;
			case 'transform':
				value = value.replace(/px/g, '');
				value = value.replace(/, /g, ',');
				value = value.replace(/ /g, ',');
				value = value.split(',');
				for (var i in value) {
					value[i] = value[i].replace(/[a-zA-Z()]/g, '');
					value[i] = parseFloat(value[i], 10);
				}
				console.log(value);
				
				var matrix = new Matrix(value[0], value[2], value[1], value[3], value[4], value[5]);
				item.transform(matrix);
				console.log(item);
			// case 'clip':
			// case 'clip-path':
			// case 'clip-rule':
			// case 'mask':
			case 'opacity':
				item.opacity = parseFloat(value, 10);
			case 'visibility':
				item.visibility = (value == 'visible') ? true : false;
				break;
		}
		if (item.characterStyle) {
			switch (name) {
				case 'font':
					var text = document.createElement('span');
					text.style.font = value;
					for (var i = 0; i < text.style.length; ++i) {
						var n = text.style[i];
						this._applyAttributeOrStyle(n, text.style[n], item);
					}
					break;
				case 'font-family':
					var fonts = value.split(',');
					fonts[0] = fonts[0].replace(/^\s+|\s+$/g, "");
					item.characterStyle.font = fonts[0];
					break;
				case 'font-size':
					item.characterStyle.fontSize = parseFloat(value, 10);
					break;
			}	
		}
	}
});