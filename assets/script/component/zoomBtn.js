
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    start () {
        
        this.node.on("touchstart", function(){
            this.startZoom();
        }, this);
    },

    startZoom() {
        this.node.pauseSystemEvents(true);
        var _stepX1 = cc.scaleTo(0.1, 0.8, 0.8).easing(cc.easeCubicActionOut());
        var _stepX2 = cc.scaleTo(0.1, 1).easing(cc.easeCubicActionOut());
        var se = cc.sequence(_stepX1, _stepX2, cc.callFunc(this.endZoom, this));        
        this.node.runAction(se);
    },

    endZoom() {
        this.node.resumeSystemEvents(true);
        this.node.dispatchEvent(new cc.Event.EventCustom("btnClicked", true));
    }

    // update (dt) {},
});
