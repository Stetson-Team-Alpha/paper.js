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
	var svgns = "http://www.w3.org/2000/svg";
  	var svgDocument = evt.target.ownerDocument;
   	var shape = svgDocument.createElementNS(svgns, "line");
   	shape.setAttributeNS(null, "x1", 5);
     	shape.setAttributeNS(null, "y1", 5);
     	shape.setAttributeNS(null, "x2", 45);
       	shape.setAttributeNS(null, "y2", 45);
        svgDocument.documentElement.appendChild(shape);
	var importedLine = new ImportSVG();
	var line = new Line();
	line = this.initialize(new Point(x1, y1), new Point(x2, y2), true);
	equals(importedLine, line);

});

test('compare rectangle values', function() {
	NS = 'http://w3.org/2000/svg'
	var shape = document.createElementNS(NS, 'rect');
	shape.setAttribute(
	
	
	
	var svgns = "http://www.w3.org/2000/svg";
	var svgDocument = evt.target.ownerDocument;
	var shape = svgDocument.createElementNS(svgns, "rect");
	shape.setAttributeNS(null, "x", 5);
	shape.setAttributeNS(null, "y", 5);
	shape.setAttributeNS(null, "width",  40);
	shape.setAttributeNS(null, "height", 40);
	shape.setAttributeNS(null, "fill", "green");
	svgDocument.documentElement.appendChild(shape);
	var importedRectangle = new ImportSVG(shape);
	var rect = new Rectangle();
	rect = this.initialize(5, 5, 40, 40);
	equals(importedRectangle, rect);
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
	document.documentElement.appendChild(shape);
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
	var svgCircleY = svgPointArray[2].getY();


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
	var circleY = pointArray[2].getY();
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
	document.documentElement.appendChild(shape);
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
