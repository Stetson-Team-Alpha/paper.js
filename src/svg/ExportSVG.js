/**
 *  Exports items, layers or whole projects as a svg
 *  Stetson Alpha - Paper.js
 *  
 */

var ExportSVG = this.ExportSVG = Base.extend({
	//initialize the svgObj and what ever else.
	initialize: function() {
		this.NS = 'http://www.w3.org/2000/svg';
		this.svgObj = document.createElementNS(this.NS, 'svg');
	},

	/**
	 * 
	 * Takes the whole project and parses
	 * all the layers to be put into svg groups and 
	 * groups into svg groups making all the projects 
	 * items into one svg.
	 * 
	 * takes in a Paper.js Project
	 * returns svg object (xml dom)
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
	 * Takes the layer and then parses all groups
	 * and items into one svg
	 * 
	 * takes in a Paper.js Layer
	 * returns svg object (xml dom)
	 */
	exportLayer: function(layer) {
		return this.exportGroup(layer);
	},


	/**
	 * 
	 * Takes the group and puts it's items 
	 * in a svg file.
	 * 
	 * takes in a Paper.js Group
	 * returns svg object (xml dom)
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
	 * takes in a Paper.js Path
	 * returns svg object (xml dom)
	 */
	exportPath: function(path) {
		var svgEle;

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
		var type = 'path' //this._checkType(segArray, pointArray, handleInArray, handleOutArray);
		switch (type) {
			case 'rect':
				svgEle = document.createElementNS(this.NS, 'rect');
				svgEle.setAttribute('x', pointArray[0].getX());
				svgEle.setAttribute('y', pointArray[0].getY());
				svgEle.setAttribute('width', pointArray[1].getDistance(pointArray[2], true));
				svgEle.setAttribute('height', pointArray[0].getDistance(pointArray[1], true));
				//code for rest of rect here
				//Rect still lacks rounded corners functionality. Necessary?
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
			//Do we need a text case?
			default:
				//Is there a more efficient way to do this...?(See ln 175) -Jacob
				svgEle = document.createElementNS(this.NS, 'path');
				//svgEle = this.pathSetup(path);
				break;
		}
		if (path.strokeColor != undefined) {
			svgEle.setAttribute('stroke', path.strokeColor.toCssString());
		}
		if (path.fillColor != undefined) {
			svgEle.setAttribute('fill', path.fillColor.toCssString());
		}
		if(path.strokeWidth != undefined){
			svgEle.setAttribute('stroke-width', path.strokeWidth);
		}
		if(path.name != undefined) {
			svgEle.setAttribute('name', path.name);
		}
		return svgEle;
	}


		//pointstring is formatted in the way the SVG XML will be reading
		//Namely, a point and the way to traverse to that point
		//GETTING UNEXPECTED IDENTIFIER HERE...WHY?
		/*pathSetup: function(path) {
			var svgPath = document.createElementNS(this.NS, 'path');
			var segArray = path.getSegments();
			var pointArray = new Array();
			var handleInArray = new Array();
			var handleOutArray = new Array();
			
			//...because this block of code is repeated from a previous method. (lns 88 - 93)
			for (i = 0; i < segArray.length; i++) {
				pointArray[i] = segArray[i].getPoint();
				hIArray[i] = segArray[i].getHandleIn();
				hOArray[i] = segArray[i].getHandleOut();
			}
			var pointString = '';
			var x1;
			var x2;
			var y1;
			var y2;
			var handleOut1;
			var handleIn2;
			//Checks 2 points and the angles in between the 2 points
			for (i = 0; i < pointArray.length-1; i++) {
				x1 = pointArray[i].getX();
				y1 = pointArray[i].getY();
				x2 = pointArray[i + 1].getX();
				y2 = pointArray[i + 1].getY();
				handleOut1 = hOarray[i];
				handleIn2 = hIarray[i+1];
				if(handleOut1.getX() == 0 && handleOut1.getY() == 0 && handleIn2.getX() == 0 && handleIn2.getY() ==0) {
					if (i == 0) {
						//M is moveto, moving to a point without drawing
						pointString+= 'M ' + x2 + ' ' + y2 + ' ';
					} else {
						//L is lineto, moving to a point with drawing
						pointString+= 'L ' + x2 + ' ' + y2 + ' ';
				}
				} else {
					//c is curveto, relative: handleOut, handleIn - endpoint, endpoint - startpoint
					pointString+= 'c ' + handleOut1.getX() + ' ' + handleOut1.getY() + ' ';
					pointString+= (handleIn2.getX() - x2) + ' ' + (handleIn2.getY() - y2) + ' ';
					pointString+= (x2 - x1) + ' ' + (y2-y1) +  ' ';
			}
		}
			if (path.getClosed())
			{
				//Z implies a closed path, connecting the first and last points
				pointString += 'z';
			}
			svgPath.setAttribute('d',pointString);
			return svgPath;
	},	*/	

	//TRY TO BREAK THIS! FOR ANDREW
	//Need to add path functionality
	//UNEXPECTED IDENTIFIER HERE AS WELL. WHY?
	/*_checkType: function(segArray) {
		var type;
		var dPoint12;
		var dPoint34;
		dPoint12 = pointArray[0].getDistance(pointArray[1], true);
		dPoint34 = pointArray[2].getDistance(pointArray[3], true);
		var curves = false
		var segHandleIn;
		var segHandleOut;
		for( var i in segArray){
			//Checks for any curves. Differentiates between straight things(line, polyline, rect) and
			// curvy things  (circle, ellipse, path).
			segHandleIn = segArray[i].getHandleIn();
			segHandleOut = segArray[i].getHandleOut();
			curves = segHandleIn.getX() != 0 || segHandleIn.getY() != 0 ? true : curves;
			curves = segHandleOut().getX() != 0 || segHandleOut().getY() != 0 ? true : curves;			
		}
		//Cleaned up the logic so it's a little easier to read and includes path.
		//Kept the old logic for reference. Also, I kept the really long logic lines in their correct
		//places, because I couldn't figure them out completely.
		if(curves){
			if(segArray.length == 4) {
				if(handleInArray[0].getX() != 0 || handleInArray[0].getY() != 0 && Math.abs(handleInArray[0].getX()) === Math.abs(handleOutArray[0].getX()) && Math.abs(handleInArray[0].getY()) === Math.abs(handleOutArray[0].getY())) {
					if(handleInArray[3].getY() === handleOutArray[0].getX() && handleOutArray[3].getY() === handleInArray[0].getX()) {
						type = 'circle';
					} else {
						type = 'ellipse';
					}
					
				}
			} else {
				type = 'path';
			}
		} else {
			if(segArray.length == 4 && dPoint12 == dPoint34) {
				type = 'rectangle';
			} else if(segArray.length >= 3) {
				if(path.getClosed()) {
					type = 'polygon';
				} else {
					type = 'polyline';
			} else {
				type = 'line';
			}
			
		}
		
		
		/*if(segArray.length == 4) {
			if (!curves) {
				if (dPoint12 == dPoint34) {
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
		} else if (segArray.length >= 3 && !curves{
			if(path.getClosed()) {
				type = 'polygon';
			} else {
				type = 'polyline';
			}
		} else if(segArray.length == 2 && !curves){
			type = 'line';
		}/*
		
		return type;
	}*/
});
