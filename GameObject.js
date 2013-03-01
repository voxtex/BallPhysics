function GameObject(params)
{
    this.x = params.x;
    this.y = params.y;
    this.shape = params.shape;
    this.width = params.width;
    this.height = params.height;
    this.dx = 0;
    this.dy = 0;
    this.color = params.color;
    if(params.oldX)
        this.oldX = params.oldX;
    else
        this.oldX = this.x;
    if(params.oldY)
        this.oldY = params.oldY;
    else
        this.oldY = this.y;
    this.ddy = 0;
    this.stopped = false;
    this.halfWidth = {
        x: this.width / 2,
        y: 0
    }
    this.halfHeight = {
        x: 0,
        y: this.height / 2
    }
    this.lastFrameTerrain = false;
};

var decel = .01;

GameObject.prototype.applyFriction = function() {
    var decelx = Math.abs(this.dx) * decel;
    var decely = Math.abs(this.dy) * decel;

    if(Math.abs(this.dx) - decelx < 0)
    {
        this.dx = 0;
    }

    if(Math.abs(this.dy) - decely < 0)
    {
        this.dy = 0;
    }

    if(this.dx === 0 && this.dy === 0)
    {
        return;
    }

    if(this.dx > 0)
    {
        this.dx = this.dx - decelx;
    }
    if(this.dx < 0)
    {
        this.dx = this.dx + decelx;
    }

    if(this.dy > 0)
    {
        this.dy = this.dy - decely;
    }
    if(this.dy < 0)
    {
        this.dy = this.dy + decely;
    }
}

GameObject.prototype.stepX = function(x) {
    this.oldX = this.x;
    this.x = this.x + (this.dx * x);

}

GameObject.prototype.stepY = function(x) {
    if(Util.get("gravitymode").checked)
    {
        if(this.dy < 15)
        {
            this.dy = this.dy + this.ddy
        }
        else
        {
            this.dy = 15;
        }
    }
    
    this.oldY = this.y
    this.y = this.y + (this.dy * x);
}

GameObject.prototype.collisionCheck = function() {
    if(this.x > (Consts.Width - this.width))
    {
        this.x = Consts.Width - this.width;
        this.dx = this.dx * -1;
    }
    if(this.x < 0)
    {
        this.x = 0;
        this.dx = this.dx * -1;
    }

    if(this.y > (Consts.Height - this.height))
    {
        if(Util.get("enablefloor").checked)
        {
            this.y = Consts.Height - this.height;
            this.dy = this.dy * -1;
            this.dy = this.dy * Consts.BounceYMult;
            this.dx = this.dx * .99;
        }
        else
        {
            if(this.y > (Consts.Height))
            {
                this.y = -1 * this.height;
            }
        }
    }
    if(this.y < 0)
    {
        if(Util.get("enablefloor").checked)
        {
            this.dy = this.dy * -1;
            this.y = 1;
        }
        else {
            if(this.y < (-1 * this.height))
            {
                this.y = Consts.Height - this.height;
            }
        }
    }
}

GameObject.prototype.step = function(x) {
    this.stepX(x);
    this.stepY(x);

    this.collisionCheck();

    //Util.get("go").innerHTML = this.dy;

};