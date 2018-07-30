
cc.Class({
    extends: cc.Component,

    properties: {
       bar: cc.Node
    },

    start () {

    },

    onEnable() {
        this.bar.setScale(0, 1);
    },
    upgardeBar(cnt) {
        this.bar.runAction(cc.scaleTo(0.2, 0.2 * cnt, 1));
    }
});
