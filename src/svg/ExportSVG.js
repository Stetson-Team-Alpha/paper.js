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
 * This class and all methods therein programmed by Stetson-Team-Alpha
 * @author Stetson-Team-Alpha
 */


 /**
 * @name ExportSVG
 *
 * @class The ExportSVG object represents a Paper.js object that will be
 * converted into an SVG canvas design.
 * The Paper.js object is converted by changing its items into groups
 *
 */

var ExportSVG = this.ExportSVG = Base.extend(/** @Lends ExportSVG# */{
	//initialize the svgObj and what ever else.
	initialize: function() {
		this.NS = 'http://www.w3.org/2000/svg';
		this.svgObj = document.createElementNS(this.NS, 'svg');
	},

	/**
	 * Takes the selected Paper.js project and parses all of its layers and
	 * groups to be placed into SVG groups, converting the project into one
	 * SVG group.
	 *
	 * @function
	 * @param {Paper.js Project} project A Paper.js project
	 * @return {SVG DOM} this.svgObj The imported project converted to an
	 * SVG project
	 */
	exportProject: function(project) {
		var layerArray = project.layers;
		var layer;
		for (var i = 0; i < layerArray.length; ++i) {
			layer = layerArray[i];
			this.svgObj.appendChild(this.exportLayer(layer));
		}
		return this.svgObj;
	},


	/**
	 * 
	 * Takes the selected Paper.js layer and parses all groups
	 * and items on the layer into one SVG
	 * 
	 * @name ExportSVG#exportLayer
	 * @function
	 * @param {Paper.js Layer} layer A Paper.js layer
	 * @return {SVG DOM} this.exportGroup(layer) The layer converted into an
	 * SVG group
	 */
	exportLayer: function(layer) {
		return this.exportGroup(layer);
	},


	/**
	 * 
	 * Takes a Paper.js group and puts its items in a SVG file.
	 * 
	 * @name ExportSVG#exportGroup
	 * @function
	 * @param {Paper.js Group} group A Paper.js group
	 * @return {SVG DOM} svgG An SVG object
	 */
	exportGroup: function(group) {
		var svgG = document.createElementNS(this.NS, 'g');
		var curChild;

		for (var i in group.children) {
			curChild = group.children[i];
			if (curChild.children) {
				svgG.appendChild(this.exportGroup(curChild));
			} else {
				svgG.appendChild(this.exportPath(curChild));
			}
		}

		return svgG;
	},

	/**
	 * 
	 * Takes the path and puts it in
	 * a svg file.
	 * 
	 * @name ExportSVG#exportPath
	 * @function
	 * @param {Paper.js Path} path A Paper.js path object
	 * @return {SVG DOM} svgPath An SVG object of the imported path
	 */
	exportPath: function(path) {
		var svgPath = document.createElementNS(this.NS, 'path');

		//Getting all of the segments(a point, a HandleIn and a HandleOut) in the path
		var segArray = path.getSegments();
		var pointArray = new Array();
		var handleInArray = new Array();
		var handleOutArray = new Array();
		for (i = 0; i < segArray.length; i++) {	
			console.log(segArray[i].toString());
			pointArray[i] = segArray[i].getPoint();
			handleInArray[i] = segArray[i].getHandleIn();
			handleOutArray[i] = segArray[i].getHandleOut();
		}
		var type = this._checkType(segArray, pointArray, handleInArray, handleOutArray);
		switch (type) {
			case 'rect':
				svgEle = document.createElementNS(this.NS, 'rect');
				svgEle.setAttribute('x', pointArray[0].getX());
				svgEle.setAttribute('y', pointArray[0].getY());
				//code for rest of rect here
				break;
			case'line':
				svgEle = document.createElementNS(this.NS, 'line');
				svgEle.setAttribute('x1', pointArray[0].getX());
				svgEle.setAttribute('y1', pointArray[0].getY());
				svgEle.setAttribute('x2', pointArray[pointArray.length - 1].getX());
				svgEle.setAttribute('y2', pointArray[pointArray.length - 1].getY());
				break;
			case 'circle':
				svgEle = document.createElementNS(this.NS, 'circle');
				var radius = (pointArray[2].getX() - pointArray[0].getX()) /2;
				var cx = pointArray[0].getX() + radius;
				svgEle.setAttribute('cx', cx);
				svgEle.setAttribute('cy', pointArray[0].getY());
				svgEle.setAttribute('r', radius);
				break;
			case 'ellipse':
				svgEle = document.createElementNS(this.NS, 'ellipse');
				var radiusX = (pointArray[2].getX() - pointArray[0].getX()) / 2;
				var radiusY = (pointArray[3].getY() - pointArray[1].getY()) /2;
				var cx = pointArray[0].getX() + radiusX;
				svgEle.setAttribute('cx', cx);
				svgEle.setAttribute('cy', pointArray[0].getY());
				svgEle.setAttribute('rx', radiusX);
				svgEle.setAttribute('ry', radiusY);
				break;
			case 'polyline':
				svgEle = document.createElementNS(this.NS, 'polyline');
				var pointString;
				for(i = 0; i < pointArray.length; ++i) {
					pointString += pointArray[i].getX() + ", " + pointArray[i].getY();
				}
				svgEle.setAttribute('points', pointString);
				break;
			case 'polygon':
				svgEle = document.createElementNS(this.NS, 'polygon')
				var pointString;
				for(i = 0; i < pointArray.length; ++i) {
					pointString += pointArray[i].getX() + ", " + pointArray[i].getY();
				}
				svgEle.setAttribute('points', pointString);
				break;
			default:
				svgEle = document.createElementNS(this.NS, 'path');
				//TODO add attributes to the path element
		}


		//pointstring is formatted in the way the SVG XML will be reading
		//Namely, a point and the way to traverse to that point
		var pointString = "";
		for (i = 0; i < pointArray.length; i++) {
			var x = pointArray[i].getX();
			//x = x - (x % 1); //Possible for simplifying  
			var y = pointArray[i].getY();
			//y = y - (x % 1);
			if (i === 0) {
				//M is moveto, moving to a point without drawing
				pointString+= "M " + x + " " + y + " ";
			} else {
				//L is lineto, moving to a point with drawing
				pointString+= "L " + x + " " + y + " ";
			}
		}
		if (path.getClosed())
			{
				//Z implies a closed path, connecting the first and last points
				pointString += "z";
			}

			svgPath.setAttribute("d",pointString);

			//If the stroke doesn't have a color, there's no attribute for it
			if (path.strokeColor != undefined) {
				svgPath.setAttribute("stroke", path.strokeColor.toCssString());
			}

			//If the fill doesn't have a color, there's no attribute for it
			if (path.fillColor != undefined) {
				svgPath.setAttribute("fill", path.fillColor.toCssString());
			}

			svgPath.setAttribute("stroke-width",path.strokeWidth);
			return svgPath;
	},		

	//TRY TO BREAK THIS! FOR ANDREW
	/**
	* Checks the type SVG object created by converting from Paper.js
	*
	* @name ExportSVG#checkType
	* @function
	* @param {SVG Object Array} segArray An array of objects for the newly
	* converted SVG object
	* @return {String} type A string labeling which type of object the 
	* passed in object is
	*/

	_checkType: function(segArray) {
		var type;
		var dPoint12;
		var dPoint34;
		dPoint12 = pointArray[0].getDistance(pointArray[1], true);
		dPoint34 = pointArray[2].getDistance(pointArray[3], true);
		if(segArray.length === 4) {
			if (hIX === 0 && hIY === 0 && hOX === 0 && hOY === 0) {
				if (dPoint12 === dPoint34) {
					type = "rectangle";
				} 
			} 
			else if (handleInArray[0].getX() != 0 || handleInArray[0].getY() != 0 && Math.abs(handleInArray[0].getX()) === Math.abs(handleOutArray[0].getX()) && Math.abs(handleInArray[0].getY()) === Math.abs(handleOutArray[0].getY())) {
				if (handleInArray[3].getY() === handleOutArray[0].getX() && handleOutArray[3].getY() === handleInArray[0].getX()) {
					type = 'circle'
				} else {
					type = 'ellipse';
				}
			}
		} else if (segArray.length >= 3 && handleInArray[0].getX() === 0 && handleInArray[0].getY() === 0 && handleOutArray[0].getX() === 0 && handleOutArray[0].getY() === 0) {
			if(path.getClosed()) {
				type = 'polygon';
			} else {
				type = 'polyline';
			}
		} else {
			type = 'line';
		} 
		return type;
	}
});
