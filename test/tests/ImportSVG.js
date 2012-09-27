/*
* Paper.js
*
* This file is part of Paper.js, a JavaScript Vector Graphics Library,
* based on Scriptographer.org and designed to be largely API compatible.
* http://paperjs.org/
* http://scriptographer.org/
*
* Copyright (c) 2011, Juerg Lehni & Jonathan Puckey
* http://lehni.org/ & http://jonathanpuckey.com/
*
* Distributed under the MIT license. See LICENSE file for details.
*
* All rights reserved.
*
* This test file created by Stetson-Team-Alpha
*/

module('ImportSVG');

test('make an svg line', function() {
	var svgns = 'http://www.w3.org/2000/svg';
   	var shape = document.createElementNS(svgns, 'line');
	var x1 = 5,
		x2 = 45,
		y1 = 5,
		y2 = 45;
   	shape.setAttribute('x1', x1);
 	shape.setAttribute('y1', y1);
 	shape.setAttribute('x2', x2);
   	shape.setAttribute('y2', y2);

	var isvg = new ImportSVG();
	var importedLine = isvg.importSVG(shape);

	var line = new Path.Line([x1, y1], [x2, y2]);

	compareSegmentLists(importedLine.segments, line.segments, true);
});

test('compare rectangle values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'rect');
	var x = 25,
		y = 25,
		width = 100,
		height = 100;
	shape.setAttribute('x', x);
	shape.setAttribute('y', y);
	shape.setAttribute('width', width);
	shape.setAttribute('height', height);

	var isvg = new ImportSVG();
	var importedRectangle = isvg.importSVG(shape);

	var topLeft = new Point(x, y);
	var size = new Size(width, height);
	var rectangle = new Rectangle(topLeft, size);
	var realRectangle = new Path.Rectangle(rectangle);

	compareSegmentLists(importedRectangle.segments, realRectangle.segments, true);
});