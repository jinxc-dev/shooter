
cc.Class({
    extends: cc.Component,

    properties: {
        
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
        var c = Math.floor(color.length * cc.random0To1());

        this.node.color = color[c];
        this.node.setScale(this.initScale, this.initScale);
        var z = cc.random0To1() * (1 - 0.8) + 0.8;
        var s1 = cc.scaleTo(.1, z);
        var s2 = cc.fadeOut(0.1);
        var func = cc.callFunc(this.stopFunc, this);
        var se = cc.sequence(s1, s2, func);
        this.node.runAction(se);
    }, 

    stopFunc() {
        this.node.removeFromParent();
    }
    

});
