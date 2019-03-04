
cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        circleImg: cc.Node
    },


    onLoad () {
        this.initScale = 0.5;
    },

    start () {
        
    },


    play() {
        var color = [
            cc.color(128, 158, 10),
            cc.color(80, 137, 197),
            cc.color(97, 105, 113),
        ];
        var c = Math.floor(color.length * Math.random());

        this.circleImg.color = color[c];
        this.circleImg.setScale(this.initScale, this.initScale);
        var z = Math.random() * (1 - 0.8) + 0.8;
        var s1 = cc.scaleTo(.1, z);
        var s2 = cc.fadeOut(0.1);
        var func = cc.callFunc(this.stopFunc, this);
        var se = cc.sequence(s1, s2);        
        this.circleImg.runAction(se);

        //. label score
        var coff = this.node.x > 320 ? 1 : -1;
        console.log("xxx:" + this.node.x);
        this.scoreLabel.node.position = cc.v2(coff * 60, 60);
        var ss1 = cc.moveBy(0.5, coff * 50, 30);
        this.scoreLabel.node.runAction(cc.sequence(ss1, func));
    }, 

    stopFunc() {
        this.node.removeFromParent();
    },

    setScore(score) {
        this.scoreLabel.string = -score;
    }
    

});
