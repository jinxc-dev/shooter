
cc.Class({
    extends: cc.Component,

    properties: {
        stepH : 40,
        startPos: cc.v2(50, 435),
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.graphics = this.getComponent(cc.Graphics);        
        this.color = cc.color(73, 120, 228, 255);
        this.colorStep = cc.color(5, 9, 15);
        this.initCnt = 10;
        this.stairsMap;

    },

    start () {
        this.initGame();
    },

    initGame() {
        this.stairsMap = this.generateStairs();
        this.drawStairs(this.stairsMap);
    },

    //. draw map
    drawStairs(stairs) {
        var initPath = [
            cc.v2(this.node.width, 0),
            cc.v2(this.node.width, stairs[0].paths[0].y)
        ];
        this.drawPart(initPath, stairs[0].paths, false, this.color);

        for (var i = 1; i < stairs.length; i++) {
            this.color = this.upgardColor(this.color, this.colorStep);
            this.drawPart(stairs[i - 1].paths, stairs[i].paths, stairs[i].right, this.color);
        }

    },

    drawPart(prev, now, b_right, color) {
        var g = this.graphics;
        var n = now.length;

        g.fillColor = color;

        g.moveTo(now[0].x, now[0].y);
        for (var i = 1; i < n; i++) {
            g.lineTo(now[i].x, now[i].y);
        }
        var x = 0;
        if (b_right) {
            x = this.node.width;
        }

        g.lineTo(x, now[n - 1].y);
        g.lineTo(x, prev[0].y);

        for (var i = 0; i < prev.length; i++) {
            g.lineTo(prev[i].x, prev[i].y);
        }
        g.lineTo(now[0].x, now[0].y);
        console.log('---------------------');
        // g.stroke();
        g.close();
        g.fill();

    },
    upgardColor(color, step) {
        return cc.color(color.getR() - step.getR(), color.getG() - step.getG(), color.getB() - step.getB(), 255);
    },

    //. generate stairs information.
    generateStairs() {
        var paths = [];
        var w_flag = true;
        var w_prevPath = this.startPos;
        for (var i = 0; i < this.initCnt; i++) {
            w_flag = !w_flag;
            var w_path = this.generatePath(3, 2, w_prevPath, w_flag, this.stepH);
            paths.push({
                right: w_flag,
                paths: w_path
            });
            w_prevPath = w_path[w_path.length - 1];
        }
        return paths;  
    },

    generatePath(maxN, minN, pos, bRight, step) {
        var n = Math.round(cc.random0To1() * (maxN - minN)) + minN;
        console.log('N:' + n);
        var coff = (bRight) ? 1: -1;
        var p = [];
        for (var i = 0; i < n; i++) {
            var x = coff * (i * step + this.startPos.x) + this.node.width / 2;
            var y = pos.y + i * step;
            p.push(cc.v2(x, y));
            p.push(cc.v2(x, y + step));
        }
        return p;

    },




});
