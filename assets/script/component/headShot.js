
cc.Class({
    extends: cc.Component,

    properties: {
        headCntLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.headShotCnt = 0;
        this.headShot = false;
    },

    start () {

    },

    init() {
        this.headCnt = 0;
        this.headShot = false;
        this.node.active = false;
    },

    checkHeadShot(status) {
        if (status) {
            this.headShot = true;
            this.headCnt ++;
            this.headCntLabel.string = "爆头x" + this.headCnt;
            this.runEffect();
        } else {
            this.init();
        }
    },
    runEffect() {
        this.node.setScale(0.5);
        this.node.opacity = 255;
        this.node.active = true;
        var s1 = cc.scaleTo(0.5, 0.8);
        var s2 = cc.fadeOut(1);
        this.node.runAction(cc.sequence(s1, s2));
    },
    endEffect() {
        this.node.active = false;
    }

    // update (dt) {},
});
