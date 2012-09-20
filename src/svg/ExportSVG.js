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
