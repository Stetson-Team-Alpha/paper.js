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
    		return svgObj;
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
		for(i = 0; i < segArray.length; i++){
			pointArray[i] = segArray[i].getPoint();
			handleInArray[i] = segArray[i].getHandleIn();
			handleOutArray[i] = segArray[i].getHandleOut();
			hIX = handleInArray[i].getX();
			hIY = handleInArray[i].getY();
			hOX = handleOutArray[i].getX();
			hOY = handleOutArray[i].getY();
			
			if(hIX === 0 && hIY === 0 && hOX === 0 && hOY === 0){
				type = "rectangle"; //nested if statements for checking if a line, distances between points have to be equal for rectangle
			}
			else if(hIX != 0 ||  hIY != 0 && Math.abs(hIY) === Math.abs(hOY) && Math.abs(hIX) === Math.abs(hOX)){
				type = "circle";
			}
			

		}
   
    //initialize(); // calls the init function after class is loaded
});
