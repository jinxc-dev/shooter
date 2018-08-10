var commonH = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onBeginContact: function (contact, selfCollider, otherCollider) {
    //     console.log('bullet Shooter');
    //     // this.despawn();
    // },
    // onCollisionEnd: function (other, self) {
    //     console.log('Shooter OK');
    //     this.node.removeFromParent();
    // },
    onLoad () {
        this.game = null;
        
    },


    update (dt) {
        var x = this.node.x;
        var boxs = this.node.getBoundingBoxToWorld();
        if (boxs.x < 0 || boxs.x > 640 * commonH.getScale() ) {
            this.despawn();
        }
    },

    despawn() {
        this.node.removeFromParent();
    },

});
