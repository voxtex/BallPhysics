/**********************/
/**********************/
/* REQUIRES Util.js   */
/* REQUIRES Canvas.js */
/* REQUIRES Consts.js */
/* REQUIRES Input.js  */
/* REQUIRES Hud.js  */
/**********************/
/**********************/
/**********************/
var Game = function(){
    /////////////////////
    /* PRIVATE MEMBERS */
    /////////////////////
    var _frontCanvas = null;
    var _backCanvas = null;
    var _backElement = null;
    var _frontElement = null;
    var _paddles =  new Array();
    var _mousepaddle = null;
    var _frame = 0;
    var _isFullScreen = false;
    var _nightMode = false;
    var _paddlemode = null;
    var _draw = null;
    var _numbertext = null;
    var _square = null;
    var _paddlewidth = null;
    var _paddleheight = null;
    var _numbertext = null;
    var _square = null;
    var lastTime = null;
    var timeDifference = 0;
    var point1 = null;

    var _objects = new Array();
    var terrain = new Array();
    var _stop = true;
    var _clear = false;

    function _clickHandler(x, y) {
        if(_draw.checked)
        {
            Consts.DrawMode = !Consts.DrawMode;
        }
        else if(Consts.DrawLine === true)
        {
            if(point1 === null)
            {
                point1 = {x: x, y: y};
            }
            else
            {
                terrain.push({x1: point1.x, y1: point1.y, x2: x, y2: y});
                point1 = null;
            }
        }
        if(_paddlemode.checked)
        {
            var width = parseInt(_paddlewidth.value);
            var height = parseInt(_paddleheight.value);
            var newPaddle = new GameObject({ x: x - (width/2), y: y - (height/2), width: width, height: height, shape: "rect", color: Consts.PaddleColor});
            _paddles.push(newPaddle);
        }
        else
        {
            var num = numbertext.value;
            if(x > Consts.Width - 10)
            {
                x = Consts.Width - 10;
            }
            if(y > Consts.Height - 10)
            {
                y = Consts.Height - 10;
            }
            for(var i=0; i < num; i++)
            {
                var shape = "circle";
                if(_square.checked)
                {
                    shape = "rect";
                }
                var obj = new GameObject({ x: x, y: y, shape: shape, width:Consts.ParticleWidth, height:Consts.ParticleHeight, color: _randomColor()});
                obj.dx = (Math.random() * 16) - 8;
                obj.dy = (Math.random() * 16) - 8;
                obj.ddy = Consts.Gravity;
                _objects.push(obj);
            }
        }

        if(_stop)
        {
            _stop = false;
            _requestFrame();
        }
    }

    function _randomColor() {
        return { r: random(256), b: random(256), g: random(256) };
    }

    function areIntersecting(a1, a2, b1, b2) {
        var s1_x, s1_y, s2_x, s2_y;
        s1_x = a2.x- a1.x;
        s1_y = a2.y - a1.y;
        s2_x = b2.x - b1.x;
        s2_y = b2.y - b1.y;

        var s, t;
        s = (-s1_y * (a1.x - b1.x) + s1_x * (a1.y - b1.y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (a1.y - b1.y) - s2_y * (a1.x - b1.x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
        {
            return { x: a1.x + (t * s1_x), y: a1.y + (t * s1_y)};
        }

        return false;
    }

    /////////////////////
    /* PRIVATE METHODS */
    /////////////////////
    function _initialize(){
        //check for JS libs
        if (!Util || !Canvas || !Consts || !Input || !Hud || !Compatibility){
            alert("missing a JS library");
            return false;
        }

        //TODO:
        //check for audio element support
        
        //TODO:
        //check for input support
        
        
        //get references to rendering elements
        _frontCanvas = Canvas.getCanvas("frontCanvas");
        _backCanvas = Canvas.getCanvas("backCanvas");

        _draw = Util.get("draw");
        _paddlemode = Util.get("paddlemode");
        _paddlewidth = Util.get("paddlewidth");
        _paddleheight = Util.get("paddleheight");
        _numbertext = Util.get('numbertext');
        _square = Util.get("square");

        _frontElement = Util.get("frontCanvas");
        _backElement = Util.get("backCanvas");
        if (!_frontCanvas || !_backCanvas || !_frontCanvas || !_backElement){
            Util.log("could not find buffer DOM elements");    
            return false;
        }
        
        //resize canvas
        _frontElement.width = _backElement.width = Consts.Width;
        _frontElement.height = _backElement.height = Consts.Height;
        
        //init HUD
        Hud.initialize(_frontElement);
        
        //init input
        Input.initialize(_frontElement);
        Input.setClickHandler(_clickHandler);

        lastTime = new Date().getTime();
        
        return true;
    }

    function particleWidthChanged(e) {
        Consts.ParticleWidth = parseInt(e.value);
        Consts.ParticleHeight = parseInt(e.value);
    }

    function _render()
    {
        // Dtermine position of paddle that follows the mouse.
        if(Util.get("mousepaddle").checked) {
            var mouseposition = Input.getMousePosition();
            // TODO: Inefficient.
            var width = parseInt(Util.get("paddlewidth").value);
            var height = parseInt(Util.get("paddleheight").value);
            var x = mouseposition.x - (width / 2);
            var oldX = x;
            var y = mouseposition.y - (height / 2);
            var oldY = y;
            if(_mousepaddle)
            {
                oldX = _mousepaddle.x;
                oldY = _mousepaddle.y
            }
            // TODO: Inefficient...maintain instance if possible.
            var newMousePaddle = new GameObject({ x: x, y: y, oldX: oldX, oldY: oldY, width: width, height: height, shape: "rect", color: Consts.PaddleColor});
            _mousepaddle = newMousePaddle;
        }
        else
        {
            _mousepaddle = null;
        }
        // Draws a paddle every frame. Very slow.
        if(Consts.DrawMode === true)
        {
            // TODO: Inefficient
            var width = parseInt(Util.get("paddlewidth").value);
            var height = parseInt(Util.get("paddleheight").value);
            var mousePos = Input.getMousePosition();
            var x = mousePos.x - (width/2);
            var y =  mousePos.y - (height/2);
            if(x > 0 && x < Consts.Width && y > 0 && y < Consts.Height)
            {
                var newPaddle = new GameObject({ x: x, y: y, width: width, height: height, shape: "rect", color: Consts.PaddleColor});
                _paddles.push(newPaddle);
            }
        }

        // TODO: Inefficient
        var paddle = Util.get("paddlemode").checked;

        // Draw all of our paddles.
        for(var i in _paddles)
        {
            var _paddle = _paddles[i];
            Canvas.draw(_paddle, _backCanvas);
        }
        // Draw all of our terrain.
        for(var i in terrain)
        {
            var terr = terrain[i];
            Canvas.drawTerrain(terr, _backCanvas);
        }

        // Draw paddle that follows the mouse.
        if(_mousepaddle)
        {
            Canvas.draw(_mousepaddle, _backCanvas);
        }

        // swap
        _frontCanvas.drawImage(_backElement, 0, 0);

        // clear back buffer
        Canvas.clear(_backCanvas, Consts.Width, Consts.Height, Consts.ClearColor);

        // TODO: Inefficient.
        // Retrieve desired width/height of paddle.
        var paddleWidth = Util.get("paddlewidth").value;
        var paddleHeight = Util.get("paddleheight").value;


/**
        for(var i = 0; i < _objects.length; i++)
        {
            var currentObject = _objects[i];
            if(i + 1 < _objects.length)
            {
                for(var j = i + 1; j < _objects.length; j++ ) {
                    var iPos = {x: _objects[i].x + (_objects[i].width / 2), y: _objects[i].y + (_objects[i].height / 2)};
                    var jPos = {x: _objects[j].x + (_objects[j].width / 2), y: _objects[j].y + (_objects[j].height /2 )};
                    var dist = MathVX.dist(iPos, jPos);
                    var minDist = (_objects[i].width / 2) + (_objects[j].width / 2);
                    var intersection = minDist - dist;
                    if(intersection > 0 && dist > 0) {
                        var delta = MathVX.subV(iPos, jPos);
                        delta = MathVX.unitV(delta);
                        delta = MathVX.multV(delta, intersection);
                        delta = MathVX.multV(delta, .5);

                        _objects[i].oldX = _objects[i].x;
                        _objects[i].x = _objects[i].x + delta.x;
                        _objects[i].oldy = _objects[i].y;
                        _objects[i].y = _objects[i].y + delta.y;

                        _objects[j].oldX = _objects[j].x;
                        _objects[j].x = _objects[j].x - delta.x;
                        _objects[j].oldY = _objects[j].y;
                        _objects[j].y = _objects[j].y - delta.y;
                   }
                }
            }
        }**/

        //render
        for(var i = 0; i< _objects.length; i++)
        {
            // time elapsed since last frame / constant = speed multiplier to adjust for slow framerates.
            _objects[i].step(timeDifference / Consts.SpeedDivisor);
            
            // terrain intersection check
            for(var k=0; k < terrain.length; k++)
            {
                // Current velocity vector.
                var oldVelocity = {x: _objects[i].dx, y: _objects[i].dy };
                // TODO: Use constant. Apply 'friction' coefficient.
                oldVelocity = MathVX.multV(oldVelocity, .9);
                var terrVect = MathVX.subV({x: terrain[k].x1, y: terrain[k].y1}, {x: terrain[k].x2, y: terrain[k].y2});
                // Normal unit vector of terrain.
                var normVect = MathVX.unitV(MathVX.normV(terrVect));

                // Our normal isn't necessary in the right direction (more than one possible).
                // Determine which direction we need to be going. This is to determine the point of collision detection
                // based on the current velocity. Probably only works for circle...
                if(_objects[i].dx > 0)
                {
                    var xx = (_objects[i].width / 2) * Math.abs(normVect.x);
                }
                else
                {
                    var xx = (_objects[i].width / 2) * Math.abs(normVect.x) * -1;
                }

                if(_objects[i].dy > 0)
                {
                    var yy = (_objects[i].height / 2) * Math.abs(normVect.y);
                }
                else
                {
                    var yy = (_objects[i].height / 2) * Math.abs(normVect.y) * -1;
                }

                // Point on object to use for collision detection based on normal math above. Current.
                var p1 = {x: _objects[i].x + xx + (_objects[i].width / 2), y: _objects[i].y + yy + (_objects[i].height / 2)};
                // Point on object to use for collision detection based on normal math above. Previous.
                var p2 = {x: _objects[i].oldX + xx + (_objects[i].width / 2), y: _objects[i].oldY + yy + (_objects[i].height / 2)};
                // Check intersection of line segment (oldx, newx) and terrain.
                var intersection = areIntersecting(p1, p2, {x: terrain[k].x1, y: terrain[k].y1}, {x: terrain[k].x2, y: terrain[k].y2});
                if(!(intersection === false))
                {
                    //Util.log(p1.x + "," + p1.y + ":" + p2.x + "," + p2.y);
                    //Util.log("inter: " + intersection.x + "," + intersection.y);
                    //Util.log("obj: " + _objects[i].x + "," + _objects[i].y);

                    // The next bit of code is to determine the bounce trajectory.
                    var x1 = MathVX.multV(oldVelocity, -1);
                    var x2 = MathVX.dotV(x1, normVect);
                    var x3 = x2 * 2;
                    var x4 = MathVX.multV(normVect, x3);
                    var newVelVector = MathVX.addV(x4, oldVelocity);
                    // Set our new velocities.
                    _objects[i].dx = newVelVector.x;
                    _objects[i].dy = newVelVector.y;

                    // Using the new velocity vector, determine which direction we need to push the object
                    // to get away from the terrain. Vector * radius.
                    if(newVelVector.x > 0)
                    {
                        var xx2 = (_objects[i].width / 2) * Math.abs(normVect.x);
                    }
                    else
                    {
                        var xx2 = (_objects[i].width / 2) * Math.abs(normVect.x) * -1;
                    }

                    if(newVelVector.y > 0)
                    {
                        var yy2 = (_objects[i].height / 2) * Math.abs(normVect.y);
                    }
                    else
                    {
                        var yy2 = (_objects[i].height / 2) * Math.abs(normVect.y) * -1;
                    }

                    // Move the object away accordingly.
                    _objects[i].x = intersection.x + xx2 - (_objects[i].width / 2);
                    _objects[i].y = intersection.y + yy2 - (_objects[i].height / 2);

                    //Util.log("obj: " + normVect.x + "," + normVect.y);
                }
            }

/**
            //verlet
            if(i + 1 < _objects.length)
            {
                for(var j = i + 1; j < _objects.length; j++ ) {
                    var iPos = {x: _objects[i].x + (_objects[i].width / 2), y: _objects[i].y + (_objects[i].height / 2)};
                    var jPos = {x: _objects[j].x + (_objects[j].width / 2), y: _objects[j].y + (_objects[j].height /2 )};
                    var dist = MathVX.dist(iPos, jPos);
                    var minDist = (_objects[i].width / 2) + (_objects[j].width / 2);
                    var intersection = minDist - dist;
                    if(intersection > 0 && dist > 0) {
                        var delta = MathVX.subV(iPos, jPos);
                        delta = MathVX.unitV(delta);
                        delta = MathVX.multV(delta, intersection);
                        delta = MathVX.multV(delta, .5);

                        _objects[i].oldX = _objects[i].x;
                        _objects[i].x = _objects[i].x + delta.x;
                        _objects[i].oldy = _objects[i].y;
                        _objects[i].y = _objects[i].y + delta.y;

                        _objects[j].oldX = _objects[j].x;
                        _objects[j].x = _objects[j].x - delta.x;
                        _objects[j].oldY = _objects[j].y;
                        _objects[j].y = _objects[j].y - delta.y;
                   }
                }
            }**/

            // We can easily calculate a 'region' for this object in the canvas 'grid'.
            // TODO: This won't work if paddlewidth/height is too small while existing paddles are large. Fix?
            var regionX = Math.floor((_objects[i].x + _objects[i].halfWidth.x) / paddleWidth);
            var regionY = Math.floor((_objects[i].y + _objects[i].halfHeight.y) / paddleHeight);

            var paddleVector = null;
            if(_mousepaddle)
            {
                _paddles.push(_mousepaddle);
                paddleVector = { x: (_mousepaddle.x - _mousepaddle.oldX) / 2, y: (_mousepaddle.y - _mousepaddle.oldY) / 2 };
            }

            var collision = false;
            // Check for collision against all paddles placed on the screen.
            for(var j in _paddles)
            {
                var jRegionX = Math.floor((_paddles[j].x + _paddles[j].halfWidth.x) / paddleWidth);
                var jRegionY = Math.floor((_paddles[j].y + _paddles[j].halfWidth.y) / paddleHeight);
                // Short circuit optimization based on region. Only check regions adjacent to object.
                if(Consts.PhysicsOpt === false || (Math.abs(jRegionX - regionX) <= 1 || Math.abs(jRegionY - regionY) <= 1))
                {
                    var col = isCollide(_objects[i], _paddles[j]);
                    if(!(col === false))
                    {
                        // Initialize vector if needed.
                        if(collision === false)
                            collision = {x: 0, y: 0};
                        // Sum up all of the resulting vectors to push the object away.
                        collision = MathVX.addV(collision, col);
                    }
                }
            }
            if(_mousepaddle)
            {
                _paddles.pop();
            }

            // If we collided with any paddle...
            // TODO: Refactor this to support any surface, not just vertical / horizontal.
            if(!(collision === false))
            {
                if(!(collision.x === 0))
                {
                    // Reverse our velocity if necessary.
                    if((collision.x > 0 && _objects[i].dx < 0) || (collision.x < 0 && _objects[i].dx > 0))
                    {
                        _objects[i].dx = _objects[i].dx * -1;
                    }

                    _objects[i].oldX = _objects[i].x;
                    // Push the object out of the paddle.
                    _objects[i].x = _objects[i].x + collision.x;
                    // Apply a bounce friction coefficient...
                    // TODO: Make better.
                    _objects[i].dx = _objects[i].dx * Consts.BounceXMult;
                   if(_mousepaddle && ((_objects[i].dx > 0 && paddleVector.x > _objects[i].dx) || (_objects[i].dx < 0 && paddleVector.x < _objects[i].dx)))
                   {
                        //_objects[i].dx = paddleVector.x;
                   }

                }
                if(!(collision.y === 0))
                {
                    // Reverse our velocity if necessary.
                    if((collision.y > 0 && _objects[i].dy < 0) || (collision.y < 0 && _objects[i].dy > 0))
                    {
                        _objects[i].dy = _objects[i].dy * -1;
                    }
                    
                    _objects[i].oldY = _objects[i].y;
                    // Push the object out of the paddle.
                    _objects[i].y = _objects[i].y + collision.y;
                    // Apply a bounce friction coefficient...
                    // TODO: Make better.
                    _objects[i].dy = _objects[i].dy * Consts.BounceYMult;
                    if(Consts.FrictionEnabled)
                    {
                        _objects[i].dx = _objects[i].dx * Consts.Friction;
                    }
                   if(_mousepaddle && ((_objects[i].dy > 0 && paddleVector.y > _objects[i].dy) || (_objects[i].dy < 0 && paddleVector.y < _objects[i].dy)))
                   {
                        //_objects[i].dy = paddleVector.y;
                   }
                 }
                // Check for collision on our walls
                // TODO: ??
                _objects[i].collisionCheck();
            }

            // Draw after all physics logic.
            Canvas.draw(_objects[i], _backCanvas);
        }
/**
        for(var i = 0; i < _objects.length; i++)
        {
            if(i + 1 < _objects.length)
            {
                for(var j = i + 1; j < _objects.length; j++ ) {
                    var iPos = {x: _objects[i].x + (_objects[i].width / 2), y: _objects[i].y + (_objects[i].height / 2)};
                    var jPos = {x: _objects[j].x + (_objects[j].width / 2), y: _objects[j].y + (_objects[j].height /2 )};
                    var dist = MathVX.dist(iPos, jPos);
                    var minDist = (_objects[i].width / 2) + (_objects[j].width / 2);
                    var intersection = minDist - dist;
                    if(intersection > 0 && dist > 0) {
                        var delta = MathVX.subV(iPos, jPos);
                        delta = MathVX.unitV(delta);
                        delta = MathVX.multV(delta, intersection);
                        var weighti = (_objects[i].y / Consts.Height) * 5000;
                        var weightj = (_objects[j].y / Consts.Height) * 5000;
                        var weightRatio = weighti / (weighti + weightj);
                        var deltai = MathVX.multV(delta, weightRatio);
                        var deltaj = MathVX.multV(delta, 1 - weightRatio);

                        _objects[i].oldX = _objects[i].x;
                        _objects[i].x = _objects[i].x + deltai.x;
                        _objects[i].oldy = _objects[i].y;
                        _objects[i].y = _objects[i].y + deltai.y;

                        _objects[j].oldX = _objects[j].x;
                        _objects[j].x = _objects[j].x - deltaj.x;
                        _objects[j].oldY = _objects[j].y;
                        _objects[j].y = _objects[j].y - deltaj.y;
                   }
                }
            }
        }**/

        /**
        for(var i = 0; i< _objects.length; i++)
        {
            //verlet
            if(i + 1 < _objects.length)
            {
                for(var j = i + 1; j < _objects.length; j++ ) {
                    var iPos = {x: _objects[i].x + (_objects[i].width / 2), y: _objects[i].y + (_objects[i].height / 2)};
                    var jPos = {x: _objects[j].x + (_objects[j].width / 2), y: _objects[j].y + (_objects[j].height /2 )};
                    var dist = MathVX.dist(iPos, jPos);
                    var minDist = (_objects[i].width / 2) + (_objects[j].width / 2);
                    var intersection = minDist - dist;
                    if(intersection > 0 && dist > 0) {
                        var delta = MathVX.subV(iPos, jPos);
                        delta = MathVX.unitV(delta);
                        delta = MathVX.multV(delta, intersection);
                        delta = MathVX.multV(delta, .5);

                        //Util.log("x" + delta.x + "," + "y:" + delta.y);

                        _objects[i].oldX = _objects[i].x;
                        _objects[i].x = _objects[i].x + delta.x;
                        _objects[i].y = _objects[i].y + delta.y;

                        _objects[j].x = _objects[j].x - delta.x;
                        _objects[j].y = _objects[j].y - delta.y;
                   }
                }
            }
        }**/
         
    }

    function _clearTerrain() {
        terrain = new Array();
    }

    function setFullScreen() {
        _frontElement = Util.get("frontCanvas");
        _backElement = Util.get("backCanvas");

        if(_isFullScreen === true) {
            //resize canvas
            _frontElement.width = _backElement.width = Consts.Width = Consts.RestoreWidth;
            _frontElement.height = _backElement.height = Consts.Height = Consts.RestoreHeight;
        }
        else {
            //resize canvas
            _frontElement.width = _backElement.width = Consts.Width = window.innerWidth - 50;
            _frontElement.height = _backElement.height = Consts.Height = window.innerHeight - 200;
        }

        _isFullScreen = !_isFullScreen;

        Input.resetOffset();
    }
    function clearPaddles()
    {
        _paddles = new Array();
    }
    function isCollide(a, b) {
        // halfwidth vectors for both objects
        var vecA = MathVX.addV(a.halfWidth, a.halfHeight);
        var vecB = MathVX.addV(b.halfWidth, b.halfHeight);

        // projection onto horizontal axis
        // halfwidth vector projection onto horizontal axis
        var hProjA = MathVX.projV(vecA, {x: 1, y: 0});
        var hProjB = MathVX.projV(vecB, {x: 1, y: 0});

        var projVectY;
        var projVectX;

        // distance between centers of both objects
        var cDistX = (a.x + (a.width / 2)) - (b.x + (b.width / 2));

        if(cDistX > 0)
        {
            hProjA = MathVX.multV(hProjA, -1);
            // check collision for projected vectors the horizontal axis
            if(!(b.x + (b.width / 2) + hProjB.x > a.x + (a.width / 2) + hProjA.x))
            {
                return false;
            }
        }
        else
        {
            hProjB = MathVX.multV(hProjB, -1);
            // check collision for projected vectors the horizontal axis
            if(!(a.x + (a.width / 2) + hProjA.x > b.x + (b.width / 2) + hProjB.x))
            {
                return false;
            }
        }
        projVectX = {x: (Math.abs(hProjA.x) + Math.abs(hProjB.x)) - Math.abs(cDistX), y: 0};

        //projection onto vertical axis
        var vProjA = MathVX.projV(vecA, {x: 0, y: 1});
        var vProjB = MathVX.projV(vecB, {x: 0, y: 1});

        var cDistY = (a.y + (a.height / 2)) - (b.y + (b.height / 2));

        if(cDistY > 0)
        {
            vProjA = MathVX.multV(vProjA, -1);
            if(!(b.y + (b.height / 2) + vProjB.y > a.y + (a.height / 2) + vProjA.y))
            {
                return false;
            }
        }
        else
        {
            vProjB = MathVX.multV(vProjB, -1);
            if(!(a.y + (a.height / 2) + vProjA.y > b.y + (b.height / 2) + vProjB.y))
            {
                return false;
            }
        }
        projVectY = {x: 0, y: (Math.abs(vProjA.y) + Math.abs(vProjB.y)) - Math.abs(cDistY)};

        if(Math.abs(projVectX.x) > Math.abs(projVectY.y))
        {
            if((a.oldY + a.halfHeight.y) < (b.oldY + b.halfHeight.y) && projVectY.y > 0)
                return MathVX.multV(projVectY, -1);
            else
                return projVectY;
        }
        if((a.oldX + a.halfWidth.x) < (b.oldX + b.halfWidth.x) && projVectX.x > 0)
            return MathVX.multV(projVectX, -1);
        else
            return projVectX;
    }
    function _requestFrame(){
        //chrome
        if (window.webkitRequestAnimationFrame){
            window.webkitRequestAnimationFrame(_step);
            return;
        }
        //firefox
        if (window.mozRequestAnimationFrame){
            window.mozRequestAnimationFrame(_step);
            return;
        }
        //ie
        if (window.msRequestAnimationFrame){
            window.msRequestAnimationFrame(_step);
            return;
        }
        //fallback with setTimeout
        setTimeout(_step, Consts.TargetMS);
    }

    function _step(){

        var time = new Date().getTime();
        timeDifference = time - lastTime;
        lastTime = time;

        //alert(timeDifference);
        _frame++;

        if(_clear === true)
        {
            _objects = new Array();
            _clear = false;
        }
        
        // on every frame
        _render();

        if(Util.get("pulsemode").checked && _frame % 60 == 0)
        {
            Game.start(parseInt(Util.get('numbertext').value));
        }
        
        // request another frame
        if(_stop === false)
        {
            _requestFrame();
        }
    }
    
    ////////////////////
    /* PUBLIC METHODS */
    ////////////////////
    function executeOnLoad(){
        //check for core JS library
        if (!Util){
            alert("Util.js must be included");
            return;
        }
    
        //attempt to initialize the game
        if (_initialize()){
            //start loop
             start(parseInt(Util.get('numbertext').value));
        }else{
            //missing canvas support or running on the wrong page
            Util.log("failed to init game");
        }
    }

    function random(num) {
        return Math.round(Math.random() * num);
    }

    function start(num) {
        if(_stop === true)
        {
            Util.get("stop").innerHTML = "stop";
            _objects = new Array();
        }

        for(var i=0; i < num; i++)
        {
            var shape = "circle";
            if(Util.get("square").checked)
            {
                shape = "rect";
            }
            var obj = new GameObject({ x: Math.random() * Consts.Width, y: 0, shape: shape, width:Consts.ParticleWidth, height:Consts.ParticleHeight, color: { r: random(256), b: random(256), g: random(256) }});
            obj.dx = (Math.random() * 16) - 8;
            obj.dy = (Math.random() * 8);
            obj.ddy = Consts.Gravity;
            _objects.push(obj);
        }
        if(_stop === true)
        {
            _stop = false;
            _requestFrame();
        }
    }

    function stop() {
        if(_stop === false)
        {
            _stop = true;
            Util.get("stop").innerHTML = "resume";
        }
        else
        {
            _stop = false;
            Util.get("stop").innerHTML = "stop";
            _requestFrame();
        }
    }

    function _setNightMode() {
        if(_nightMode)
        {
            Consts.ClearColor = "rgb(255, 255, 255)";
        }
        else
        {
            Consts.ClearColor = "rgb(0,0,0)";
        }
        if(_nightMode)
        {
            Consts.PaddleColor = {r: 0, b: 0, g: 0};
        }
        else
        {
            Consts.PaddleColor = {r: 255, b: 255, g: 255};
        }
        for(var i in _paddles)
        {
                _paddles[i].color = Consts.PaddleColor;
         }
        if(_mousepaddle)
        {
            _mousepaddle.color = Consts.PaddleColor;
        }
        _nightMode = !_nightMode;
    }

    function clear() {
        if(_stop == true)
        {
            _requestFrame();
            _stop = true;
            start(0);
            _stop = true;
            Util.get("stop").innerHTML = "stop";
        }
        else
        {
            _clear = true;
        }
    }

    return {
        executeOnLoad: executeOnLoad,
        start: start,
        stop: stop,
        clear: clear,
        setFullScreen: setFullScreen,
        setNightMode: _setNightMode,
        clearPaddles: clearPaddles,
        particleWidthChanged: particleWidthChanged,
        clearTerrain: _clearTerrain
    };
}();
//////////////
/* SNIPPETS */
//////////////
/*

clientX: X coordinate of touch relative to the viewport (excludes scroll offset)
clientY: Y coordinate of touch relative to the viewport (excludes scroll offset)
screenX: Relative to the screen
screenY: Relative to the screen
pageX: Relative to the full page (includes scrolling)
pageY: Relative to the full page (includes scrolling)
target: Node the touch event originated from
identifier: An identifying number, unique to each touch event

touches: A list of information for every finger currently touching the screen
targetTouches: Like touches, but is filtered to only the information for finger touches that started out within the same node
changedTouches: A list of information for every finger involved in the event (see below)

touchstart: Happens every time a finger is placed on the screen
touchend: Happens every time a finger is removed from the screen
touchmove: Happens as a finger already placed on the screen is moved across the screen
touchcancel


// Set up handlers (this needs to be done in an onload event)
canvas.ontouchmove = moveEventFunction;
canvas.onmousemove = moveEventFunction;

function moveEventFunction(e) {
    if (e.touches) {
        // Touch Enabled (loop through all touches)
        for (var i = 1; i <= e.touches.length; i++) {
            var p = getCoords(e.touches[i - 1]); // Get info for finger i
            // ... Do something with point touch p
        }
    }
    else {
        // Not touch enabled (get cursor position from single event)
        var p = getCoords(e);
        // ... Do something with cursor point p
    }

    return false; // Stop event bubbling up and doing other stuff (like pinch zoom or scroll)
}

function getCoords(e) {
    if (e.offsetX) {
        // Works in Chrome / Safari (except on iPad/iPhone)
        return { x: e.offsetX, y: e.offsetY };
    }
    else if (e.layerX) {
        // Works in Firefox
        return { x: e.layerX, y: e.layerY };
    }
    else {
        // Works in Safari on iPad/iPhone
        return { x: e.pageX - cb_canvas.offsetLeft, y: e.pageY - cb_canvas.offsetTop };
    }
}
*/