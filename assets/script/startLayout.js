
cc.Class({
    extends: cc.Component,

    properties: {
        maxScoreLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable() {

        this.maxScoreLabel.string = cc.sys.localStorage.getItem("maxScore"); 
    }
    // update (dt) {},
});
