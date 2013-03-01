
var Util = function(){
    function log(message){
        console.log(message);
    }
    function get(id){
        var ret = null;
        if (id && typeof id == "string" && id != ""){
            ret = document.getElementById(id);
            if (!ret)
                log("bad id = " + id);

        } else {
            log("bad id = " + id);
        }
        return ret;
    }
    //////////////////////
    /* PUBLICLY EXPOSED */
    //////////////////////
    return {
        log: log,
        get: get
    };
}();