/**
 * Created by JetBrains WebStorm.
 * User: Adam
 * Date: 11/30/11
 * Time: 11:09 AM
 * To change this template use File | Settings | File Templates.
 */
var MathVX = function() {
    var _dotV = function(a, b) {
        return (a.x*b.x + a.y*b.y);
    }
    function _addV(a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        }
    }
    function _subV(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }
    function _projV(a, b) {
        var dp = _dotV(a, b);
        return {
            x: ( dp / (b.x*b.x + b.y*b.y) ) * b.x,
            y: ( dp / (b.x*b.x + b.y*b.y) ) * b.y
        }
    }
    var _normV = function(a) {
        return {
            x: -1 * a.y,
            y: a.x
        }
    }
    var _multV = function(a, b) {
        return {
            x: a.x * b,
            y: a.y * b
        }
    }
    var _dist = function(a, b) {
        return Math.sqrt(((b.x - a.x) * (b.x - a.x)) +((b.y - a.y) * (b.y - a.y)));
    }
    var _unitV = function(a) {
        var mag = Math.sqrt((a.x * a.x) + (a.y * a.y));
        if(mag === 0)
        {
            return {x: 1, y:1 };
        }
        return {x: a.x / mag, y: a.y / mag};
    }
    function _magV(a) {
        var mag = Math.sqrt((a.x * a.x) + (a.y * a.y));
        return mag;
    }
    var _crossV = function(a, b) {
        return (a.x * b.y) - (a.y * b.x);
    }
    return {
        dotV: _dotV,
        addV: _addV,
        subV: _subV,
        projV: _projV,
        normV: _normV,
        multV: _multV,
        dist: _dist,
        unitV: _unitV,
        crossV: _crossV,
        magV: _magV
    }
}();