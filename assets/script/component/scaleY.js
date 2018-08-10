cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {
        var screenSize = cc.sys.windowPixelResolution;
        var rY = screenSize.width / screenSize.height * 1.775;
        this.node.scaleY = rY;
    },

    start () {

    },

    // update (dt) {},
});
