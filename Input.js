/********************/
/********************/
/* REQUIRES Util.js */
/********************/
/********************/
/********************/
var Input = function(){
    /////////////////////
    /* PRIVATE MEMBERS */
    /////////////////////
    var _touchHandler = null;
    var _clickHandler = null;
    var _touchState = false;
    var _clickState = false;
    var _offset = { x:0, y:0};
    var _mousePos = { x:0, y:0};
    var _targetElement = null;
    /////////////////////
    /* PRIVATE METHODS */
    /////////////////////
    function _touchHelper(){
        //call the handler
        if (_touchHandler)
            _touchHandler(0, 0);
    }
    function _clickHelper(x, y){
        //call the handler
        if (_clickHandler)
            _clickHandler(x, y);
    }
    ////////////////////
    /* PUBLIC METHODS */
    ////////////////////
    function initialize(targetElement){
        //register touch events on the target element
        targetElement.addEventListener("mousedown", onMouseDown, false);
        targetElement.addEventListener("mousemove", onMouseMove, false);
        _targetElement = targetElement;
        
        resetOffset();
    }
    function resetOffset() {
        _offset.x = _targetElement.offsetLeft;
        _offset.y = _targetElement.offsetTop;
    }
    function setTouchHandler(handler){
        if (!handler || typeof handler != "function"){
            Util.log("bad touch handler");
            return;
        }
        _touchHandler = handler;
    }
    function setClickHandler(handler){
        if (!handler || typeof handler != "function"){
            Util.log("bad click handler");
            return;
        }
        _clickHandler = handler;
    }
    function getIsBeingClicked(){
        return false;
    }
    function getIsBeingTouched(){
        return false;
    }
    function onMouseDown(e) {
        var x;
        var y;
        if (e.pageX || e.pageY) {
          x = e.pageX;
          y = e.pageY;
        }
        else {
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= _offset.x;
        y -= _offset.y;

        _clickHelper(x, y);
    }
    function onMouseMove(e) {
                var x;
        var y;
        if (e.pageX || e.pageY) {
          x = e.pageX;
          y = e.pageY;
        }
        else {
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= _offset.x;
        y -= _offset.y;

        _mousePos.x = x;
        _mousePos.y = y;
    }
    function getMousePosition()
    {
        return _mousePos;
    }
    return {
        initialize: initialize,
        setTouchHandler: setTouchHandler,
        getIsBeingTouched: getIsBeingTouched,
        setClickHandler: setClickHandler,
        getIsBeingClicked: getIsBeingClicked,
        getMousePosition: getMousePosition,
        resetOffset: resetOffset
    };
}();