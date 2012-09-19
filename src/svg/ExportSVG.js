/**
 *  Exports items, layers or whole projects as a svg
 *  Stetson Alpha - Paper.js
 *  
 *  var NS="http://www.w3.org/2000/svg";
 *  var svg=document.createElementNS(NS,"svg");
 */

 


var ExportSVG = this.ExportSVG = Base.extend({
	var svgObj = null; // xml dom object (svg typed)
	//var blarg = this;
	
	//initialize the svgObj and what ever else.
	/*function initialize(){
		var NS = "http://www.w3.org/2000/svg";
		svgObj = document.createElementNS(NS,"svg");
		
		console.log(svgObj);

	};*/
	
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
    	exportProject: function(project){
		var layerArray = project.layers;
		var svgObj = document.createElements(NS, "svg");
		for(int i=0; i < layerArray.length; i++){
			svgObj.appendChild(this.exportLayer(layerArray[i]));
		}
    		return svgObj;
    	};
	
    
	/**
	 * 
	 * Takes the layer and then parses all groups
	 * and items into one svg
	 * 
	 * takes in a Paper.js Layer
	 * returns svg object (xml dom)
	 */
    	exportLayer: function(layer){
		//not sure if this is the right method call,
		//got it from our language lawyer, the "constructor" part
		//could actually mean a real constructor. Will consult
		//during team meeting tomorrow
		var svgG = document.createElementNS(NS,"g");
		var childArray = layer.children;
		for(i = 0; i<childArray.length; i++){
			var curChild = childArray[i];
			switch(childArray[i].constructor.toString()){
			case "Layer":
				svgG.appendChild(this.exportLayer(curChild));
				break;
			case "Group":
				svgG.appendChild(this.exportGroup(curchild));
				break;
			//case "Item":
			//	svgG.appendChild(this.exportItem(curChild));
			//	break
			case "Path":
				svgG.appendChild(this.exportPath(curChild));
				break;
			}

		}
    		return svgG;
	};
	
    
	/**
	 * 
	 * Takes the group and puts it's items 
	 * in a svg file.
	 * 
	 * takes in a Paper.js Group
	 * returns svg object (xml dom)
	 */
    	exportGroup: function(group){
		var svgG = document.createElementsNS(NS, "g");
		var childArray = group.children;
		for(int i=0; i<childArray.length; i++){
			var curChild = childArray[i];
			switch(childArray[i].constructor.toString()){
			case "Group":
				svgG.appendChild(this.exportGroup(curChild);
				break;
			//case "Item":
			//	svgG.appendChild(this.exportItem(curChild);
			//	break;
			case "Path":
				svgG.appendChild(this.exportPath(curChild);
			}
		}
    		return svgObj;
    	};
	
	/**
	 * 
	 * Takes the item and puts it in
	 * a svg file.
	 * 
	 * takes in a Paper.js Item
	 * returns svg object (xml dom)
	 */
    	exportItem: function(item){
		//after finally getting here, I don't think there's
		//a need to export to Items. I could be wrong, but I think
		// Item is just used for shared code. I'll bring it up at
		// team meeting.
    		return svgObj;
    	};
    
	/**
	 * 
	 * Takes the path and puts it in
	 * a svg file.
	 * 
	 * takes in a Paper.js Path
	 * returns svg object (xml dom)
	 */
    	exportPath = function(path){
    		//this.initialize();
    		//console.log(blarg.svgObj);
		var pathClone = path.clone();
		var NS = "http://www.w3.org/2000/svg";
		svgObj = document.createElementNS(NS,"svg");
		svgPath = document.createElementNS(NS, "path");
	
		//Getting all of the segments(a point, a HandleIn and a HandleOut) in the path
		var segArray = pathClone.getSegments();

		var pointArray = new Array();
		var handleInArray = new Array();
		var handleOutArray = new Array();
		for(i = 0; i < segArray.length; i++){	
			console.log(segArray[i].toString());
			pointArray[i] = segArray[i].getPoint();
			handleInArray[i] = segArray[i].getHandleIn();
			handleOutArray[i] = segArray[i].getHandleOut();
		}
		//pointstring is formatted in the way the SVG XML will be reading
		//Namely, a point and the way to traverse to that point
		var pointString = "";
		for(i = 0; i < pointArray.length; i++){
			var x = pointArray[i].getX();
			//x = x - (x % 1); //Possible for simplifying  
			var y = pointArray[i].getY();
			//y = y - (x % 1);
			if(i === 0){
				//M is moveto, moving to a point without drawing
				pointString+= "M " + x + " " + y + " ";
			} else{
				//L is lineto, moving to a point with drawing
				pointString+= "L " + x + " " + y + " ";
			}
		}
		if(pathClone.getClosed())
		{
			//Z implies a closed path, connecting the first and last points
			pointString += "z";
		}
	
		svgPath.setAttribute("d",pointString);

		//If the stroke doesn't have a color, there's no attribute for it
		if(pathClone.strokeColor != undefined){
			svgPath.setAttribute("stroke", pathClone.strokeColor.toCssString());
		}
	
		//If the fill doesn't have a color, there's no attribute for it
		if(pathClone.fillColor != undefined){
			svgPath.setAttribute("fill", pathClone.fillColor.toCssString());
		}
		
		svgPath.setAttribute("stroke-width",pathClone.strokeWidth);
		svgObj.appendChild(svgPath); //appends path to svgObj
		return svgObj;
    	}
	
	//TRY TO BREAK THIS! FOR ANDREW
	_checkType: function(segArray){
		var type;
		var pointArray = new Array();
		var handleInArray = new Array();
		var handleOutArray = new Array();
		var hIY;
		var hIX;
		var hOX;
		var hOY;
		var dPoint12;
		var dPoint34;
		//SCOTT- for this loop, hIX, hIY, hOX and HOY just keep 
		//getting reset. Like...they're only going to record the 
		//information for the last segment.
		for(i = 0; i < segArray.length; i++){
			pointArray[i] = segArray[i].getPoint();
			handleInArray[i] = segArray[i].getHandleIn();
			handleOutArray[i] = segArray[i].getHandleOut();
			hIX = handleInArray[i].getX();
			hIY = handleInArray[i].getY();
			hOX = handleOutArray[i].getX();
			hOY = handleOutArray[i].getY();
		}
		dPoint12 = pointArray[0].getDistance(pointArray[1], true);
		dPoint34 = pointArray[2].getDistance(pointArray[3], true);
		if(hIX === 0 && hIY === 0 && hOX === 0 && hOY === 0){
			if(dPoint12 === dPoint34){
				type = "rectangle";
			} else {
				type = "line";
			}
		}
		else if(hIX != 0 ||  hIY != 0 && Math.abs(hIY) === Math.abs(hOY) && Math.abs(hIX) === Math.abs(hOX)){
			if(handleInArray[2].getY() === hOX && handleOutArray[2].getY() === hIX){
				type = "circle";
			} else{
				type = "ellipse";
			}
		}
			

	}
   
    //initialize(); // calls the init function after class is loaded
});
