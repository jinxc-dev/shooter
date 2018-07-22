
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log('bullet Shooter');
        this.despawn();
    },

    onLoad () {
        this.game = null;
    },

    update (dt) {
        var x = this.node.x;
        if (x < 0 || x > this.node.parent.width ) {
            this.despawn();
        }
    },

    despawn() {
        this.node.removeFromParent();
    }

});
