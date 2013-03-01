/********************/
/********************/
/* REQUIRES Util.js */
/********************/
/********************/
/********************/
var Compatibility = function(){
    /////////////////////
    /* PRIVATE MEMBERS */
    /////////////////////
    /////////////////////
    /* PRIVATE METHODS */
    /////////////////////
    function _canvasSupported(){
        var c = document.createElement('canvas');
        var supported = !!c.getContext && c.getContext('2d') instanceof CanvasRenderingContext2D;  
        if (!supported)
            Util.log("canvas not supported");
        return supported;
    }
    function _audioSupported(){
        var a = document.createElement('audio');
        var supported = !!a.canPlayType; 
        if (!supported)
            Util.log("audio not supported");
        return supported;
    }
    function _inputSupported(){
        var supported = _touchSupported() || _clickSupported();
        if (!supported)
            Util.log("input not supported");
        return supported;
    }
    function _touchSupported(){
        
    }
    function _clickSupported(){
        
    }
    function _getBrowser(){
        
    }
    ////////////////////
    /* PUBLIC METHODS */
    ////////////////////
    function isSupported(){
        var supported = _canvasSupported() && _audioSupported() && _inputSupported();
        if (!supported)
            Util.log("browser is not fully supported. (" + _getBrowser() + ")");
    }
    return {
        isSupported: isSupported
    };
}();