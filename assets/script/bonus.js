cc.Class({
    extends: cc.Component,

    properties: {
        type: 0
    },


    onLoad () {
        this.game;
    },

    start () {

    },

    init(game) {
        this.game = game;
    },

    runMove() {
        var pos = this.game.coinImage.position;

        if (this.type == 1) {
            pos = this.game.healthImage.position;
        }
        var s1 = cc.moveTo(0.5, pos);
        var se = cc.sequence(s1, cc.callFunc(this.endMove, this));
        this.node.runAction(se);
    },

    endMove() {
        if (this.type == 0) {
            this.game.addCoin();
        } 
        this.node.removeFromParent();
    }

    // update (dt) {},
});
