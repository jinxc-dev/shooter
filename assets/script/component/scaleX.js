cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {
        var screenSize = cc.sys.windowPixelResolution;
        var rX = screenSize.width / screenSize.height / 0.5633;
        this.node.scaleX = rX;
    },

    start () {

    },

    // update (dt) {},
});
