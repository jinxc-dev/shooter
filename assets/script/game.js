cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: {
            default: null,
            type: cc.Node
        },
        startBtn: cc.Node,
        startLayout: cc.Layout,
        mainLayout: cc.Layout

    },

    onLoad() {
        // console.log("width:" + this.node.width);
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;
        // cc.director.getPhysicsManager().gravity = cc.v2 (0, -320);
        cc.director.getCollisionManager().enabled = true;

        this.gameColor = [
            cc.color(73, 120, 228, 255),
            cc.color(219, 119, 131, 255)
        ];
    },

    start () {
        var n = Math.round(cc.random0To1() * (this.gameColor.length - 1));
        this.mainLayout.node.color = this.gameColor[n];
        this.startBtn.on("touchstart", function(){
            console.log('start Game');
            this.bgNode.getComponent('bgMap').startGame();
            this.startLayout.node.active = false;
        }, this);
    },

    initGame() {
    },



});
