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

test('compare imported svg line values', function() {
	NS = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'line');
	shape.setAttribute('x1', 0);
	shape.setAttribute('y1', 0);
	shape.setAttribute('x2', 200);
	shape.setAttribute('y2', 200);
	shape.setAttribute('stroke', 'black');
	shape.setAttribute('stroke-width', 1);
	var importedLine = new ImportSVG();
	var line = importedLine.importSVG(shape);
	var svgSegArray = line.getSegments();
	var svgPointArray = new Array();
	var svgHandleInArray = new Array();
	var svgHandleOutArray = new Array();
	for (i = 0; i < svgSegArray.length; i++) {
		svgPointArray[i] = svgSegArray[i].getPoint();
		svgHandleInArray[i] = svgSegArray[i].getHandleIn();
		svgHandleOutArray[i] = svgSegArray[i].getHandleOut();
	}
	var svgLineX1 = svgPointArray[0].getX();
	var svgLineY1 = svgPointArray[0].getY();
	var svgLineX2 = svgPointArray[svgPointArray.length - 1].getX();
	var svgLineY2 = svgPointArray[svgPointArray.length - 1].getY();
	
	var from = new Point(0, 0);
	var to = new Point(200, 200);
	var line = new Path.Line(from, to);
	var segArray = line.getSegments();
	var pointArray = new Array();
	var handleInArray = new Array();
	var handleOutArray = new Array();
	for (i = 0; i < segArray.length; i++) {
		pointArray[i] = segArray[i].getPoint();
		handleInArray[i] = segArray[i].getHandleIn();
		handleOutArray[i] = segArray[i].getHandleOut();
	}
	var lineX1 = pointArray[0].getX();
	var lineY1 = pointArray[0].getY();
	var lineX2 = pointArray[pointArray.length - 1].getX();
	var lineY2 = pointArray[pointArray.length - 1].getY();

	equals(svgLineX1, lineX1);
	equals(svgLineY1, lineY1);
	equals(svgLineX2, svgLineY2);
	equals(svgLineY2, svgLineX2);

});

test('compare invalid svg line values', function() {
	NS = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'line');
	shape.setAttribute('x1', null);
	shape.setAttribute('y1', null);
	shape.setAttribute('x2', null);
	shape.setAttribute('y2', null);
	shape.setAttribute('stroke', 'black');
	shape.setAttribute('stroke-width', 1);
	var importedLine = new ImportSVG();
	var line = importedLine.importSVG(shape);
	var svgSegArray = line.getSegments();
	var svgPointArray = new Array();
	var svgHandleInArray = new Array();
	var svgHandleOutArray = new Array();
	for (i = 0; i < svgSegArray.length; i++) {
		svgPointArray[i] = svgSegArray[i].getPoint();
		svgHandleInArray[i] = svgSegArray[i].getHandleIn();
		svgHandleOutArray[i] = svgSegArray[i].getHandleOut();
	}

	var svgLineX1 = svgPointArray[0].getX();
	var svgLineY1 = svgPointArray[0].getY();
	var svgLineX2 = svgPointArray[svgPointArray.length - 1].getX();
	var svgLineY2 = svgPointArray[svgPointArray.length - 1].getY();

	var from = new Point(0, 0);
	var to = new Point(0, 0);
	var line = new Path.Line(from, to);
	var segArray = line.getSegments();
	var pointArray = new Array();
	var handleInArray = new Array();
	var handleOutArray = new Array();
	for (i = 0; i < segArray.length; i++) {
		pointArray[i] = segArray[i].getPoint();
		handleInArray[i] = segArray[i].getHandleIn();
		handleOutArray[i] = segArray[i].getHandleOut();
	}

	var lineX1 = pointArray[0].getX();
	var lineY1 = pointArray[0].getY();
	var lineX2 = pointArray[pointArray.length - 1].getX();
	var lineY2 = pointArray[pointArray.length - 1].getY();

	equals(svgLineX1, lineX1);
	equals(svgLineY1, lineY1);
	equals(svgLineX2, svgLineY2);
	equals(svgLineY2, svgLineX2);

});

test('compare rectangle values', function() {
	NS = 'http://w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'rect');
	shape.setAttribute('x', 25);
	shape.setAttribute('y', 25);
	shape.setAttribute('rx', 0);
	shape.setAttribute('ry', 0);
	shape.setAttribute('width', 100);
	shape.setAttribute('height', 100);
	shape.setAttribute('stroke', 'black');
	shape.setAttribute('fill', 'black');
	shape.setAttribute('stroke-width', 1);
	var importedRectangle = new ImportSVG();
	var rect = importedRectangle.importSVG(shape);
	var svgSegArray = rect.getSegments();
	var svgPointArray = new Array();
	var svgHandleInArray = new Array();
	var svgHandleOutArray = new Array();
	for (i = 0; i < svgSegArray.length; i++) {
		svgPointArray[i] = svgSegArray[i].getPoint();
		svgHandleInArray[i] = svgSegArray[i].getHandleIn();
		svgHandleOutArray[i] = svgSegArray[i].getHandleOut();
	}
	var svgRectangleX = svgPointArray[1].getX();
	var svgRectangleY = svgPointArray[1].getY();
	//var svgRectangleWidth = svgPointArray[1].getDistance(svgPointArray[2], true);
	//var svgRectangleHeight = svgpointArray[0].getDistance(svgPointArray[1], true);

	var topLeft = new Point(25, 25);
	var size = new Size(100, 100);
	var rectangle = new Rectangle(topLeft, size);
	var realRectangle = new Path.Rectangle(rectangle);
	var segArray = realRectangle.getSegments();
	var pointArray = new Array();
	var handleInArray = new Array();
	var hangleOutArray = new Array();
	for (i = 0; i < segArray.length; i++) {
		pointArray[i] = segArray[i].getPoint();
		handleInArray[i] = segArray[i].getHandleIn();
		handleOutArray[i] = segArray[i].getHandleOut();
	}

	var RectangleX = pointArray[1].getX();
	var RectangleY = pointArray[1].getY();
	//var RectangleWidth = pointArray[1].getDistance(pointArray[2], true));
	//var RectangleHeight = pointArray[0].getDistance(pointArray[1], true));
	
	
	equals(svgRectangleX, RectangleX);
	equals(svgRectangleY, RectangleY);
	//equals(svgRectangleWidth, RectangleWidth);
	//equals(svgRectangleHeight, RectangleHeight);
});

test('compare invalid rectangle values', function() {
        NS = 'http://w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'rect');
	shape.setAttribute('x', null);
	shape.setAttribute('y', null);
	shape.setAttribute('rx', 0);
	shape.setAttribute('ry', 0);
	shape.setAttribute('width', 100);
	shape.setAttribute('height', 100);
	shape.setAttribute('stroke', 'black');
	shape.setAttribute('fill', 'black');
	shape.setAttribute('stroke-width', 1);
	var importedRectangle = new ImportSVG();
	var rect = importedRectangle.importSVG(shape);
	var svgSegArray = rect.getSegments();
	var svgPointArray = new Array();
	var svgHandleInArray = new Array();
	var svgHandleOutArray = new Array();
	for (i = 0; i < svgSegArray.length; i++) {
		svgPointArray[i] = svgSegArray[i].getPoint();
		svgHandleInArray[i] = svgSegArray[i].getHandleIn();
		svgHandleOutArray[i] = svgSegArray[i].getHandleOut();
	}

	var svgRectangleX = svgPointArray[1].getX();
	var svgRectangleY = svgPointArray[1].getY();
	//var svgRectangleWidth = svgPointArray[1].getDistance(svgPointArray[2], true);
	//var svgRectangleHeight = svgpointArray[0].getDistance(svgPointArray[1], true);

	var topLeft = new Point(null, null);
	var size = new Size(100, 100);
	var rectangle = new Rectangle(topLeft, size);
	var realRectangle = new Path.Rectangle(rectangle);
	var segArray = realRectangle.getSegments();
	var pointArray = new Array();
	var handleInArray = new Array();
	var hangleOutArray = new Array();
	for (i = 0; i < segArray.length; i++) {
		pointArray[i] = segArray[i].getPoint();
		handleInArray[i] = segArray[i].getHandleIn();
		handleOutArray[i] = segArray[i].getHandleOut();
	}

	var RectangleX = pointArray[1].getX();
	var RectangleY = pointArray[1].getY();
	//var RectangleWidth = pointArray[1].getDistance(pointArray[2], true));
	//var RectangleHeight = pointArray[0].getDistance(pointArray[1], true));

	equals(svgRectangleX, RectangleX);						equals(svgRectangleY, RectangleY);
	//equals(svgRectangleWidth, RectangleWidth);
	//equals(svgRectangleHeight, RectangleHeight);
});

test('compare circle values', function() {
	NS = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'ellipse');
	shape.setAttribute('cx', 25);
	shape.setAttribute('cy', 25);
	shape.setAttribute('r', 20);
	shape.setAttribute('stroke', 'black');
	shape.setAttribute('fill', 'black');
	shape.setAttribute('stroke-width', 1);
	var importedCircle = new ImportSVG();
	var balls = importedCircle.importSVG(shape);
	var svgSegArray = balls.getSegments();
	var svgPointArray = new Array();
	var svgHandleInArray = new Array();
	var svgHandleOutArray = new Array();
	for (i = 0; i < svgSegArray.length; i++) {
		svgPointArray[i] = svgSegArray[i].getPoint();
		svgHandleInArray[i] = svgSegArray[i].getHandleIn();
		svgHandleOutArray[i] = svgSegArray[i].getHandleOut();
	}
	var svgCircleX = svgPointArray[1].getX();
	var svgCircleY = svgPointArray[0].getY();
	
	var center = new Point(25, 25);
	var circle = new Path.Circle(center, 25);
	var segArray = circle.getSegments();
	var pointArray = new Array();
	var handleInArray = new Array();
	var handleOutArray = new Array();
	for (i = 0; i < segArray.length; i++) {	
		pointArray[i] = segArray[i].getPoint();
		handleInArray[i] = segArray[i].getHandleIn();
		handleOutArray[i] = segArray[i].getHandleOut();
	}
	var circleX = pointArray[1].getX();
	var circleY = pointArray[0].getY();
	var circleR = (pointArray[2].getX() - pointArray[0].getX())/2;

	equals(svgCircleX, circleX);
	equals(svgCircleY, circleY);
});

test('compare invalid circle X values', function() {
NS = 'http://www.w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'ellipse');
	shape.setAttribute('cx', null);
	shape.setAttribute('cy', null);
	shape.setAttribute('r', 20);
	shape.setAttribute('stroke', 'black');
	shape.setAttribute('fill', 'black');
	shape.setAttribute('stroke-width', 1);
	var importedCircle = new ImportSVG();
	var imported = importedCircle.importSVG(shape);
	var svgSegArray = imported.getSegments();
	var svgPointArray = new Array();
	var svgHandleInArray = new Array();
	var svgHandleOutArray = new Array();
	for (i = 0; i < svgSegArray.length; i++) {
       		svgPointArray[i] = svgSegArray[i].getPoint();
	        svgHandleInArray[i] = svgSegArray[i].getHandleIn();
		svgHandleOutArray[i] = svgSegArray[i].getHandleOut();
	}
	var svgCircleX = svgPointArray[1].getX();
	var svgCircleY = svgPointArray[2].getY();


	var center = new Point(null, null);
	var circle = new Path.Circle(center, 25);
	var segArray = circle.getSegments();
	var pointArray = new Array();
	var handleInArray = new Array();
	var handleOutArray = new Array();
	for (i = 0; i < segArray.length; i++) {
	        pointArray[i] = segArray[i].getPoint();
	        handleInArray[i] = segArray[i].getHandleIn();
	        handleOutArray[i] = segArray[i].getHandleOut();
	}
	var circleX = pointArray[1].getX();
	var circleY = pointArray[2].getY();
	equals(svgCircleX, circleX);
	equals(svgCircleY, circleY);
});
