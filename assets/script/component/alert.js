cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.active = false;
    },

    start () {

    },

    showAlert(str) {
        this.content.string = str;
        this.node.active = true;

        this.scheduleOnce(function(){
            this.node.active = false;
        }, 3);
    }

    // update (dt) {},
});
