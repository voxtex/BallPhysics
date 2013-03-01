/********************/
/********************/
/* REQUIRES Util.js */
/********************/
/********************/
/********************/
var Canvas = function(){
    function getCanvas(canvasId){
        if (!canvasId || typeof canvasId != "string" || canvasId == ""){
            Util.log("bad canvasId = " + canvasId);
            return null;
        }
        var element = Util.get(canvasId);
        if (!element){
            Util.log("could not find canvas element with id = " + canvasId);
            return null;
        }
        if (!element.getContext){
            Util.log("canvas not supported in this browser");
            return null;
        }
        var context = element.getContext("2d");
        if (!context){
            Util.log("could not obtain 2d context from element");
            return null;
        }
        return context;
    }
    function clear(context, width, height, clearColor){
        if (!context || !context.fillRect){
            Util.log("bad context = " + context);
            return;
        }
        if (!clearColor || typeof clearColor != "string"){
            Util.log("bad clearColor = " + clearColor);
            return;
        }
        
        if(!Util.get("superpsychadelic").checked)
        {
            context.fillStyle = clearColor;
            context.fillRect(0, 0, width, height);
        }
    }
    function draw(object, context){
        //TODO: check which methods are actually available?
        if (!context || !context.fillRect){
            Util.log("bad context = " + context);
            return;
        }

        if(Util.get("psychadelic").checked)
        {
            context.fillStyle = "rgb(" + Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + ")";
        }
        else
        {
            context.fillStyle = "rgb(" + object.color.r + "," + object.color.g + "," + object.color.b + ")";
        }
        
        if(object.shape === "rect")
        {
            //context.rotate(.5);
            context.fillRect(object.x, object.y, object.width, object.height);
            //context.rotate
        }
        else if(object.shape == "circle")
        {
            context.beginPath();
            context.arc(object.x + (object.width / 2), object.y + (object.width / 2), object.width / 2, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
    }
    function drawTerrain(object, context){
        //TODO: check which methods are actually available?
        if (!context || !context.lineTo){
            Util.log("bad context = " + context);
            return;
        }

        if(Util.get("psychadelic").checked)
        {
            context.fillStyle = "rgb(" + Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + ")";
        }
        else
        {
            context.fillStyle = "rgb(0, 0 ,0)";
        }

        context.beginPath();
        context.moveTo(object.x1, object.y1);
        context.lineTo(object.x2, object.y2);
        context.stroke();
    }
    
    return {
        draw: draw,
        getCanvas: getCanvas,
        clear: clear,
        drawTerrain: drawTerrain
    };
}();