cc.Class({
    extends: cc.Component,

    properties: {
    },


    onLoad () {
        this.runStaus = 0;
        this.pathInfo = {};
        this.step = 0;
        this.stepTime = 0.1
    },

    start () {

    },

    update (dt) {
        // this.runMove();
    },

    updatePos(paths, step) {
        this.pathInfo = paths;
        this.runStaus = 1;
        this.step = step;
        this.runMove();
    },

    runMove() {
        // if (this.runStaus == 1) {
        var w_runsArray = [];
        var p = this.pathInfo.paths;
        var coff = this.pathInfo.coff;
        var w_t = Math.abs((this.node.x - p[0].x) / this.step) * this.stepTime;

        console.log('time: ' + w_t);
        
        w_runsArray.push(cc.moveTo(w_t, p[0]));

        for (var i = 1; i < p.length; i++) {
            w_runsArray.push(cc.moveTo(this.stepTime, p[i]));
        }

        w_runsArray.push(cc.moveBy(this.stepTime, this.step * coff, 0));
        w_runsArray.push(cc.callFunc(this.endMove, this));
        var se = cc.sequence(w_runsArray);
        this.node.runAction(se);
        this.runStaus = 0;
        // }
        
    },
    endMove() {
        this.node.setScale(this.pathInfo.coff, 1);
        this.node.parent.getComponent('bgMap').upgardMap();
    }
});
