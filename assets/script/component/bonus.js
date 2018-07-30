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
            var n = this.game.lifeValue;// > 2 ? 2: this.game.lifeValue;
            n = n > 2 ? 2:n;
            n = n < 0 ? 0:n;
            pos = this.game.lifeImgNode[n].position;
        }
        var s1 = cc.moveTo(0.5, pos);
        var se = cc.sequence(s1, cc.callFunc(this.endMove, this));
        this.node.runAction(se);
    },

    endMove() {
        if (this.type == 0) {
            this.game.addCoin();
        } else if (this.type == 1) {
            this.game.addLife();
        }
        this.node.removeFromParent();
    }

    // update (dt) {},
});
