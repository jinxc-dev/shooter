cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: {
            default: null,
            type: cc.Node
        },

    },

    onLoad() {
        console.log("width:" + this.node.width);
    },

    start () {
    },

    initGame() {
    },



});
