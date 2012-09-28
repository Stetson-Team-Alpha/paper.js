/**
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

module('ExportSVG');

test('compare line path functions', function() {
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

	var line = new Path.Line([x1, y1], [x2, y2]);

	var epjs = new ExportSVG();
	var exportedLine = epjs.exportPath(line);

	var shapex1 = shape.getAttribute('x1');
	var shapey1 = shape.getAttribute('y1');
	var shapex2 = shape.getAttribute('x2');
	var shapey2 = shape.getAttribute('y2');

	var exportedx1 = exportedLine.getAttribute('x1');
	var exportedy1 = exportedLine.getAttribute('y1');
	var exportedx2 = exportedLine.getAttribute('x2');
	var exportedy2 = exportedLine.getAttribute('y2');

	equals(shapex1, exportedx1);
	equals(shapey1, exportedy1);
	equals(shapex2, exportedx2);
	equals(shapey2, exportedy2);

});

test('compare negative line path functions', function() {
	var svgns = 'http://www.w3.org/2000/svg';
	var shape = document.createElementNS(svgns, 'line');
	var x1 = -5,
		x2 = -45,
		y1 = -5,
		y2 = -45;
	shape.setAttribute('x1', x1);
	shape.setAttribute('y1', y1);
	shape.setAttribute('x2', x2);
	shape.setAttribute('y2', y2);

	var line = new Path.Line([x1, y1], [x2, y2]);

	var epjs = new ExportSVG();
	var exportedLine = epjs.exportPath(line);

	var shapex1 = shape.getAttribute('x1');
	var shapey1 = shape.getAttribute('y1');
	var shapex2 = shape.getAttribute('x2');
	var shapey2 = shape.getAttribute('y2');

	var exportedx1 = exportedLine.getAttribute('x1');
	var exportedy1 = exportedLine.getAttribute('y1');
	var exportedx2 = exportedLine.getAttribute('x2');
	var exportedy2 = exportedLine.getAttribute('y2');

	equals(shapex1, exportedx1);
	equals(shapey1, exportedy1);
	equals(shapex2, exportedx2);
	equals(shapey2, exportedy2);

});

test('compare invalid line path functions', function() {
	var svgns = 'http://www.w3.org/2000/svg';
	var shape = document.createElementNS(svgns, 'line');
	var x1 = null,
		x2 = null,
		y1 = null,
		y2 = null;
	shape.setAttribute('x1', x1);
	shape.setAttribute('y1', y1);
	shape.setAttribute('x2', x2);
	shape.setAttribute('y2', y2);
	
	var line = new Path.Line([x1, y1], [x2, y2]);

	var epjs = new ExportSVG();
	var exportedLine = epjs.exportPath(line);

	var shapex1 = shape.getAttribute('x1');
	var shapey1 = shape.getAttribute('y1');
	var shapex2 = shape.getAttribute('x2');
	var shapey2 = shape.getAttribute('y2');

	var exportedx1 = exportedLine.getAttribute('x1');
	var exportedy1 = exportedLine.getAttribute('y1');
	var exportedx2 = exportedLine.getAttribute('x2');
	var exportedy2 = exportedLine.getAttribute('y2');

	equals(shapex1, exportedx1);
	equals(shapey1, exportedy1);
	equals(shapex2, exportedx2);
	equals(shapey2, exportedy2);

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

	var center = new Point(cx, cy);
	var circle = new Path.Circle(center, r);

	var epjs = new ExportSVG();
	var exportedCircle = epjs.exportPath(circle);

	var shapecx = shape.getAttribute('cx');
	var shapecy = shape.getAttribute('cy');
	var shaper = shape.getAttribute('r');

	var exportedcx = exportedCircle.getAttribute('cx');
	var exportedcy = exportedCircle.getAttribute('cy');
	var exportedr = exportedCircle.getAttribute('r');

	equals(shapecx, exportedcx);
	equals(shapecy, exportedcy);
	equals(shaper, exportedr);

});

test('compare negative circle values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'circle');
	var cx = -100,
		cy = -80,
		r = -50;
	shape.setAttribute('cx', cx);
	shape.setAttribute('cy', cy);
	shape.setAttribute('r', r);

	var center = new Point(cx, cy);
	var circle = new Path.Circle(center, r);

	var epjs = new ExportSVG();
	var exportedCircle = epjs.exportPath(circle);

	var shapecx = shape.getAttribute('cx');
	var shapecy = shape.getAttribute('cy');
	var shaper = shape.getAttribute('r');

	var exportedcx = exportedCircle.getAttribute('cx');
	var exportedcy = exportedCircle.getAttribute('cy');
	var exportedr = exportedCircle.getAttribute('r');

	equals(shapecx, exportedcx);
	equals(shapecy, exportedcy);
	equals(shaper, exportedr);

});

test('compare invalid circle values', function() {
	var svgns = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(svgns, 'circle');
	var cx = null,
		cy = null,
		r = null;
	shape.setAttribute('cx', cx);
	shape.setAttribute('cy', cy);
	shape.setAttribute('r', r);

	var center = new Point(cx, cy);
	var circle = new Path.Circle(center, r);

	var epjs = new ExportSVG();
	var exportedCircle = epjs.exportPath(circle);

	var shapecx = shape.getAttribute('cx');
	var shapecy = shape.getAttribute('cy');
	var shaper = shape.getAttribute('r');

	var exportedcx = exportedCircle.getAttribute('cx');
	var exportedcy = exportedCircle.getAttribute('cy');
	var exportedr = exportedCircle.getAttribute('r');

	equals(shapecx, exportedcx);
	equals(shapecy, exportedcy);
	equals(shaper, exportedr);

});


