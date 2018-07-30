cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Node,
        bossIcon: cc.Node,
        healthMask: cc.Node,
        healthBar: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bossInitPos = this.bossIcon.position;
    },

    start () {

    },

    initMove() {
        this.bossIcon.position = this.bossInitPos;
        this.bossIcon.setScale(1);
        this.healthMask.active = false;
        this.healthBar.setScale(0, 1);
        this.title.setScale(1);
        this.title.opacity = 255;
        this.node.opacity = 50;
    },

    onEnable() {
        console.log('BOSS');
        this.initMove();
        this.node.opacity = 50;
        var s2 = cc.fadeIn(1);

        var se = cc.sequence(s2, cc.callFunc(this.endDisplay, this));
        this.node.runAction(se);

    },
    endDisplay() {
        console.log('BOSS END');
        var s1 = cc.scaleTo(.5, 0.5);
        var s2 = cc.moveTo(.5, 0, 40);
        this.bossIcon.runAction(cc.sequence(s1, s2, cc.callFunc(this.endMove, this)));
        this.title.runAction(cc.scaleTo(.5, 1.5));
        this.title.runAction(cc.fadeOut(0.5));
    },
    endMove() {
        this.healthMask.active = true;
        this.healthBar.runAction(cc.scaleTo(0.2, 1));
        // this.node.active = false;
    },
    upgardeBar(init, now) {
        var n = now < 0? 0: now;
        this.healthBar.runAction(cc.scaleTo(0.2, n / init, 1));
    }

    // update (dt) {},
});
