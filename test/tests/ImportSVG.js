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

test('make an svg line with invalid values', function() {
	var svgns = 'http://www.w3.org/2000/svg';
	var shape = document.createElementNS(svgns, 'line');
	shape.setAttribute('x1', null);
	shape.setAttribute('y1', null);
	shape.setAttribute('x2', null);
	shape.setAttribute('y2', null);

	var isvg = new ImportSVG();
	var importedLine = isvg.importSVG(shape);

	var line = new Path.Line([0, 0], [0, 0]);

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

test('compare invalid rectangle values', function() {
        var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'rect');

	shape.setAttribute('x', null);
	shape.setAttribute('y', null);
	shape.setAttribute('width', null);
	shape.setAttribute('height', null);

        var isvg = new ImportSVG();
	var importedRectangle = isvg.importSVG(shape);
	
	var topLeft = new Point(0, 0);
	var size = new Size(0, 0);
	var rectangle = new Rectangle(topLeft, size);
	var realRectangle = new Path.Rectangle(rectangle);

	compareSegmentLists(importedRectangle.segments, realRectangle.segments, true);
																				});

test('compare oval values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'ellipse');
	var cx = 300,
		cy = 80,
		rx = 100,
		ry = 50;
	shape.setAttribute('cx', cx);
	shape.setAttribute('cy', cy);
	shape.setAttribute('rx', rx);
	shape.setAttribute('ry', ry);

	var isvg = new ImportSVG();
	var importedOval = isvg.importSVG(shape);

	var center = new Point(cx, cy);
	var offset = new Point(rx, ry);
	var topLeft = center.subtract(offset);
	var bottomRight = center.add(offset);

	var rect = new Rectangle(topLeft, bottomRight);
	var oval = new Path.Oval(rect);

	compareSegmentLists(importedOval.segments, oval.segments, true);


});


test('compare invalid oval values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'ellipse');
	shape.setAttribute('cx', null);
	shape.setAttribute('cy', null);
	shape.setAttribute('rx', null);
	shape.setAttribute('ry', null);

	var isvg = new ImportSVG();
	var importedOval = isvg.importSVG(shape);

	var center = new Point(0, 0);
	var offset = new Point(0, 0);
	var topLeft = center.subtract(offset);
	var bottomRight = center.add(offset);

	var rect = new Rectangle(topLeft, bottomRight);
	var oval = new Path.Oval(rect);

	compareSegmentLists(importedOval.segments, oval.segments, true);

});

test('compare circle values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'circle');
	var cx = 100,
		cy = 80,
		r = 50;	
	shape.setAttribute('cx', cx);
	shape.setAttribute('cy', cy);
	shape.setAttribute('r', r);

	var isvg = new ImportSVG();
	var importedCircle = isvg.importSVG(shape);

	var center = new Point(cx, cy);
	var circle = new Path.Circle(center, r);

	compareSegmentLists(importedCircle.segments, circle.segments, true);


});

test('compare circle values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'circle');
	shape.setAttribute('cx', null);
	shape.setAttribute('cy', null);
	shape.setAttribute('r', null);

	var isvg = new ImportSVG();
	var importedCircle = isvg.importSVG(shape);

	var center = new Point(0, 0);
	var circle = new Path.Circle(center, 0);

	compareSegmentLists(importedCircle.segments, circle.segments, true);

});
