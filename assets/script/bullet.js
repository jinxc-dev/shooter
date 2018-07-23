
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
        if (x < 0 || x > this.node.parent.width ) {
            console.log('RE:');
            this.despawn();
        }
    },

    despawn() {
        this.node.removeFromParent();
    }

});
