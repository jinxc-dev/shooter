var commonH = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {
        track: {
            default: null,
            type: cc.Graphics
        },

        gunPrefab : {
            default: [],
            type: cc.Prefab
        },
        bulletPrefab: {
            default: null,
            type:cc.Prefab
        },
    },

    onCollisionEnter: function (other, self) {
        console.log('Player OK');

        var pos = other.world.position;
        var node_pos = self.node.getPosition();
        var p_y = self.node.parent.y;
        var ss = commonH.getScale();
        pos = cc.v2(pos.x / ss, pos.y);

        if (other.node.parent.parent.name != 'player') {
            this.game.deadLife();
            this.game.removeAnim(pos, 'player');
        }
        other.node.removeFromParent();

        return;

        // this.node.removeFromParent();
    },
    onLoad () {
        this.runStaus = 0;
        this.pathInfo = {};
        this.step = 0;
        this.stepTime = 0.1
        this.R = {
            alpha: 0,
            coff: 1,
            step: 3,
            delta: 0,
            rr: 30
        };
        this.shooterReady = true;
        this.game;
        this.gunNum = 0;
        this.gun = null;
        this.bNewGun = false;
        this.bufferCnt = 0;
        // this.newGunNum = 0;
        // this.setGun(this.gunNum, false);
        this.gunNum = parseInt(cc.sys.localStorage.getItem("gun_num"));
    },

    start () {
        this.game = this.node.parent.getComponent('bgMap');
        this.setGun(this.gunNum, false);        
    },

    update (dt) {
        if (this.shooterReady) {
            this.drawShooter(dt);
        }
    },

    updatePos(paths, step) {
        this.pathInfo = paths;
        this.runStaus = 1;
        this.step = step;
        this.runMove();
    },

    runMove() {
        this.stopShooter();
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

    },
    endMove() {
        // this.node.setScale(this.pathInfo.coff, 1);
        this.game.getBonus();
        this.game.upgardeEnemyHealth();

        if (this.game.deadBoss) {
            this.runMoveEnd();
        } else {
            this.node.setScale(this.pathInfo.coff, 1);
            this.game.upgardMap();
        }
    },

    drawShooter(dt) {
        this.R.delta += dt;
        if (this.R.delta < 0.07) {
            return;
        }

        if (this.R.alpha < 0) {
            this.R.coff = 1;
        } else if (this.R.alpha > 45) {
            this.R.coff = -1;
        }
        this.R.alpha += this.R.step * this.R.coff;        
        this.drawStrack();

        this.gun.setRotation(this.R.alpha);
        this.R.delta = 0;

    },

    drawStrack() {
       
        var r = this.gun.width / 2 + this.aimLen;        
        var a = this.calcAlpha(this.R.alpha);
        this.gun.getComponent('gun').setAngle(a);
        var g = this.track;

        if (a < 0)
            return;
        g.clear();     
        g.fillColor = cc.color(0, 0, 0, 100);
        g.arc(0, 0, r, 0, a, true);
        g.lineTo(0, 0);
        g.close();
        g.fill();

        g.strokeColor = cc.color(255, 255, 255, 255);
        g.lineWidth = 2;
        g.moveTo(0, 0);
        g.lineTo(r * Math.cos(a), r * Math.sin(a));
        g.close();
        g.stroke();
    },
    calcAlpha(a) {
        return a * Math.PI / 180;
    },

    stopShooter() {
        this.shooterReady = false;
        this.R = {
            alpha: 0,
            coff: 1,
            step: 3,
            delta: 0,
            rr: 30
        };
        // this.drawStrack();
        this.track.clear();
        this.gun.setRotation(0);
    },

    getAngle() {
        return this.R.alpha;
    },

    setGun(n, b_newGun) {
        if (this.gun != null) {
            this.gun.removeChild();
            this.gun.removeFromParent();
            this.gun = null;
        }

        this.bNewGun = b_newGun;

        this.gun = cc.instantiate(this.gunPrefab[n]);
        this.node.addChild(this.gun);
        this.gun.position = cc.v2(0, this.track.node.y);
        this.aimLen = this.gun.getComponent('gun').aimLen;
    },

    startShoot() {
        this.shooterReady = false;
        this.track.clear();
        this.gun.getComponent('gun').startShoot();

    },

    runMoveEnd() {
        this.stopShooter();
        var p = this.pathInfo.paths;
        var coff = this.pathInfo.coff;
        var xx = (coff + 1) * this.game.node.width / 2 - p[p.length - 1].x;
        var s1 = cc.moveBy(0.5, xx, 0);

        var endF = cc.callFunc(this.endMoveEnd, this);
        var se = cc.sequence(s1, endF);
        this.node.runAction(se);
    },
    endMoveEnd() {
        this.game.updateGameLevel();
    },

    setNewGun(n, buffer) {
        this.setGun(n);
        this.bufferCnt = buffer;
        this.bNewGun = true;
        this.game.bulletCntNode.active = true;
        this.game.bulletCntLabel.string = this.bufferCnt;
    },

    //. now gun status check.
    checkGunStatus() {
        if (this.bNewGun) {
            this.bufferCnt --;

            if (this.bufferCnt < 1) {
                this.bNewGun = false;
                this.setGun(this.gunNum, false);
                this.game.bulletCntNode.active = false;
            } else {
                this.game.bulletCntLabel.string = this.bufferCnt;
                this.game.bulletCntNode.active = true;
            }
        }
    },

    //. gun test function.
    setTestGun(idx) {        
        this.setGun(idx, false);        
        this.gun.setRotation(45);
        this.gun.getComponent('gun').setAngle(this.calcAlpha(45));
        this.gun.getComponent('gun').setGunTest(true);
        this.gun.getComponent('gun').startShoot();
    },
    setSelectGunReady() {
        this.gun.setRotation(45);
        this.gun.getComponent('gun').setAngle(this.calcAlpha(45));
        this.gun.getComponent('gun').setGunTest(true);        
    },
    destroySelectGunReady() {
        this.gun.setRotation(0);
        this.gun.getComponent('gun').setAngle(0);
        this.gun.getComponent('gun').setGunTest(false);
    }


});
