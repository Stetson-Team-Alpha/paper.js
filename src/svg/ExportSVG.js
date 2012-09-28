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
		var svgEle;

		//Getting all of the segments(a point, a HandleIn and a HandleOut) in the path
		var segArray;
		var pointArray;
		var handleInArray;
		var handleOutArray;
		//finding the type of path to export
		if(path.content){
			type = 'text';
		} else {
			//Values are only defined if the path is not text because
			// text does not have these values
			segArray = path.getSegments();
			pointArray = new Array();
			handleInArray = new Array();
			handleOutArray = new Array();
			for (i = 0; i < segArray.length; i++) {
				pointArray[i] = segArray[i].getPoint();
				handleInArray[i] = segArray[i].getHandleIn();
				handleOutArray[i] = segArray[i].getHandleOut();
			}
			var exp = this;
			var type = exp._determineType(path, segArray, pointArray, handleInArray, handleOutArray);
		}
		//switch statement that determines what type of SVG element to add to the SVG Object
		switch (type) {
			case 'rect':
				svgEle = document.createElementNS(this.NS, 'rect');
				var width = pointArray[3].getX() - pointArray[0].getX();
				var height = pointArray[0].getY() - pointArray[1].getY();
				svgEle.setAttribute('x', pointArray[1].getX());
				svgEle.setAttribute('y', pointArray[1].getY());
				svgEle.setAttribute('width', width);
				svgEle.setAttribute('height', height);
				break;
			case 'roundRect':
				var rx = pointArray[4].getX() - pointArray[3].getX();
				var ry = pointArray[3].getY() - pointArray[4].getY();
				var width = pointArray[6].getX() - pointArray[1].getX();
				var height = pointArray[0].getY() - pointArray[3].getY();
				svgEle = document.createElementNS(this.NS, 'rect');
				svgEle.setAttribute('x', pointArray[3].getX());
				svgEle.setAttribute('y', pointArray[4].getY());
				svgEle.setAttribute('rx', rx);
				svgEle.setAttribute('ry', ry);
				svgEle.setAttribute('width', width);
				svgEle.setAttribute('height', height);
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
				var pointString = '';
				for(i = 0; i < pointArray.length; ++i) {
					pointString += pointArray[i].getX() + ','  + pointArray[i].getY() + ' ';
				}
				svgEle.setAttribute('points', pointString);
				break;
			case 'polygon':
				svgEle = document.createElementNS(this.NS, 'polygon');
				var pointString = '';
				for(i = 0; i < pointArray.length; ++i) {
					pointString += pointArray[i].getX() + ',' + pointArray[i].getY() + ' ';
				}
				svgEle.setAttribute('points', pointString);
				break;
			case 'text':
				svgEle = document.createElementNS(this.NS, 'text');
				svgEle.setAttribute('x', path.getPosition().getX());
				svgEle.setAttribute('y', path.getPosition().getY());
				if(path.style.font != undefined) {
					svgEle.setAttribute('font', path.style.font);
				}
				if(path.characterStyle.font != undefined) {
					svgEle.setAttribute('font-family', path.characterStyle.font);
				}
				if(path.characterStyle.fontSize != undefined) {
					svgEle.setAttribute('font-size',path.characterStyle.fontSize);
				}
				svgEle.textContent = path.getContent();
				//svgEle.insertData(path.getContent()); //Gives Error
				break;
			default:
				svgEle = document.createElementNS(this.NS, 'path');
				svgEle = this.pathSetup(path, pointArray, handleInArray, handleOutArray);
				break;
		}

		//checks if there is a stroke color in the passed in path
		//adds an SVG element attribute with the defined stroke color
		if(path.id != undefined) {
			svgEle.setAttribute('id', path.id);
		}
		if (path.strokeColor != undefined) {
			svgEle.setAttribute('stroke', path.strokeColor.toCssString());
		}
		//same thing as above except checking for a fill color
		if (path.fillColor != undefined) {
			//Cause of fill issues- CHECK THIS
			svgEle.setAttribute('fill', path.fillColor.toCssString());
		}
		//same thing as stroke color except with stroke width
		if(path.strokeWidth != undefined){
			svgEle.setAttribute('stroke-width', path.strokeWidth);
		}
		//same thing as stroke color except with the path name
		if(path.name != undefined) {
			svgEle.setAttribute('name', path.name);
		}
		if(path.strokeCap != undefined) {
			svgEle.setAttribute('stroke-linecap', path.strokeCap);
		}
		if(path.strokeJoin != undefined) {
			svgEle.setAttribute('stroke-linejoin', path.strokeJoin);
		}
		if(path.opacity != undefined) {
			svgEle.setAttribute('opacity', path.opacity);
		}
		if(path.dashArray != undefined) {
			var dashVals = '';
			for (var i in path.dashArray) {
				dashVals += path.dashArray[i] + ", ";
			}
			svgEle.setAttribute('stoke-dasharray', dashVals);
		}
		if(path.dashOffset != undefined) {
			svgEle.setAttribute('stroke-dashoffset', path.dashOffset);
		}
		if(path.miterLimit != undefined) {
			svgEle.setAttribute('stroke-miterlimit', path.miterLimit);
		}
		if(path.visibility != undefined) {
			var visString = '';
			if(path.visibility) {
				visString = 'visible';
			} else {
				visString = 'hidden';
			}
			svgEle.setAttribute('visibility', visString);
		}
		return svgEle;
	},


		//pointstring is formatted in the way the SVG XML will be reading
		//Namely, a point and the way to traverse to that point
		pathSetup: function(path, pointArray, hIArray, hOArray) {
			var svgPath = document.createElementNS(this.NS, 'path');
			var pointString = '';
			var x1;
			var x2;
			var y1;
			var y2;
			var handleOut1;
			var handleIn2;
			pointString += 'M' + pointArray[0].getX() + ',' + pointArray[0].getY();
			//Checks 2 points and the angles in between the 2 points
			for (i = 0; i < pointArray.length-1; i++) {
				x1 = pointArray[i].getX();
				y1 = pointArray[i].getY();
				x2 = pointArray[i + 1].getX();
				y2 = pointArray[i + 1].getY();
				handleOut1 = hOArray[i];
				handleIn2 = hIArray[i+1];
				if(handleOut1.getX() == 0 && handleOut1.getY() == 0 && handleIn2.getX() == 0 && handleIn2.getY() ==0) {
						//L is lineto, moving to a point with drawing
						pointString+= 'L' + x2 + ',' + y2 + ' ';
				} else {
					//c is curveto, relative: handleOut, handleIn - endpoint, endpoint - startpoint
					pointString+= 'c' + (handleOut1.getX())  + ',' + (handleOut1.getY()) + ' ';
					pointString+= (x2 - x1 + handleIn2.getX()) + ',' + (y2 - y1 + handleIn2.getY()) + ' ';
					pointString+= (x2 - x1) + ',' + (y2-y1) +  ' ';
			}
		}
			if (path.getClosed())
			{
				//Z implies a closed path, connecting the first and last points
				pointString += 'z';
			}
			svgPath.setAttribute('d',pointString);
			return svgPath;
	},	

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

	_determineType: function(path, segArray, pointArray, handleInArray, handleOutArray) {
		var type;
		var dPoint12;
		var dPoint34;
		var curves = false;	
		var segHandleIn;
		var segHandleOut;
		for( var i in segArray){
			//Checks for any curves. Differentiates between straight things(line, polyline, rect) and
			// curvy things  (circle, ellipse, path).
			segHandleIn = segArray[i].getHandleIn();
			segHandleOut = segArray[i].getHandleOut();
			curves = segHandleIn.getX() != 0 || segHandleIn.getY() != 0 ? true : curves;
			curves = segHandleOut.getX() != 0 || segHandleOut.getY() != 0 ? true : curves;			
		}
		//Cleaned up the logic so it's a little easier to read and includes path.
		//Kept the old logic for reference. Also, I kept the really long logic lines in their correct
		//places, because I couldn't figure them out completely.
		//Checks for curves in the passed in segments
		//Checks if the type of the passed in path is a rounded rectangle, an ellipse, a circle, or if it's simply a path
		//If there aren't any curves (if curves = false), then it checks if the type is a rectangle, a polygon, a polyline, or simply a line.
		if(curves){
			if(segArray.length == 8) {
				dPoint12 = pointArray[0].getY() - pointArray[3].getY();
				dPoint34 = pointArray[7].getY() - pointArray[4].getY();
				if(dPoint12 == dPoint34) {
					type = 'roundRect';
				}
			} else if(segArray.length == 4) {
				var checkPointValues = true;
				for(i = 0; i < pointArray.length && checkPointValues == true; i++) {
					if(handleInArray[i].getX() != 0 || handleInArray[i].getY() != 0 && Math.abs(handleInArray[i].getX()) === Math.abs(handleOutArray[i].getX()) && Math.abs(handleInArray[i].getY()) === Math.abs(handleOutArray[i].getY())) {
						checkPointValues = true;
					} else {
						checkPointValues = false;
					}	
				}	
				if(checkPointValues == true)
					if(handleInArray[0].getY() === handleInArray[3].getX() && handleOutArray[0].getY() === handleOutArray[3].getX()) {
						type = 'circle';
					} else {
						type = 'ellipse';
					}
				}
			} 
		} else if(!curves) {
			if(segArray.length == 4) {
				dPoint12 = pointArray[0].getY() - pointArray[1].getY();
				dPoint34 = pointArray[3].getY() - pointArray[2].getY();
				if(dPoint12 == dPoint34) {
					type = 'rect';
				}
			} else if(segArray.length >= 3) {
				if(path.getClosed()) {
					type = 'polygon';
				} else {
					type = 'polyline';
				}
			} else {
				type = 'line';
			}	
		} else {
			type = null;
		}
		return type;
	}
});
