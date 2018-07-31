
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var s1 = cc.fadeIn(0.5);
        var s2 = cc.fadeOut(1);
        this.node.runAction(cc.sequence(s2, s1).repeatForever());
    },

    // update (dt) {},
});
