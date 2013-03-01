
var Consts = function(){
    //////////////////////
    /* PUBLICLY EXPOSED */
    //////////////////////
    return {
        DebugMode: true,
        TargetMS: 32,
        Width: 800,
        Height: 600,
        RestoreWidth: 512,
        RestoreHeight: 384,
        ClearColor : "rgb(255, 255, 255)",
        MaxPaddleSpeed: 10,
        Gravity: .35,
        PaddleColor: {r: 0, b: 0, g: 0},
        BounceYMult: .8,
        BounceXMult: .95,
        ParticleWidth: 10,
        ParticleHeight: 10,
        DrawMode: false,
        PhysicsOpt: true,
        Friction: .99,
        FrictionEnabled: true,
        SpeedDivisor:  20.0,
        DrawLine: false
    };
}();
