cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: {
            default: null,
            type: cc.Node
        },

    },

    onLoad() {
        // console.log("width:" + this.node.width);
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;
        // cc.director.getPhysicsManager().gravity = cc.v2 (0, -320);
        cc.director.getCollisionManager().enabled = true;
    },

    start () {
    },

    initGame() {
    },



});
