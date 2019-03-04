var commonH = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {
        gunPrefab : {
            default: null,
            type: cc.Prefab
        },
        correct: 1,
        health: 2
    },

    onCollisionEnter: function (other, self) {
        console.log('Shooter OK');
        
        var pos = other.world.position;
        var node_pos = self.node.getPosition();
        // var p_y = selfCollider.node.parent.y;
        var hh = other.world.preAabb.y - self.world.preAabb.y;
        var game = this.node.parent.getComponent('bgMap');
        var gun_power = other.node.parent.getComponent('gun').power;
        var b_head = false;
        var ss = commonH.getScale();
        if (hh > this.node.height / 3) {
            b_head = true;
            gun_power *= 2;
        }

        pos = cc.v2(pos.x / ss, pos.y);
        
        game.spawnCircle(pos, gun_power);

        other.node.removeFromParent();
        game.updateScore(b_head);

        this.health -= gun_power;
        game.upgardeBossHealth(this.initHealth, this.health);
        if (this.health > 0) {
            game.hasEnemy = true;
            game.enemyHitedOK(b_head);
        } else {
            game.hasEnemy = false;
            game.deadBoss = true;
            game.removeAnim(pos, 'enemy');
            game.enemyHitedOK(b_head);
            this.generateBonus(game);
            this.node.removeFromParent(); 
        }


    },

    onLoad () {
        this.stepTime = 0.1
        this.R = {
            alpha: 0,
            coff: 1,
            step: 3,
            delta: 0,
            rr: 30
        };
        this.shooterReady = false;
        this.game = null;
        this.bonus = [];
        var files = [
            'boss1.png', 'boss2.png', 'boss3.png'
        ];
        var idx = Math.floor(files.length * Math.random());
        var _this = this;
        var path = 'img/boss/' + files[idx];
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, sprite) {
            if (err) {
                return;
            }
            _this.node.getComponent(cc.Sprite).spriteFrame = sprite
        });
        this.gun;
        this.setGun();
        this.initHealth = 0;
   
    },

    start () {
        var b = [0, 0, 1, 0, 1, 2, 0, 0];
        this.stopShooter();
        this.bonus.push(b[Math.floor(b.length * Math.random())]);
    },

    update (dt) {
        if (this.shooterReady) {
            this.drawShooter(dt);
        }
    },

    drawShooter(dt) {
        this.R.delta += dt;
        if (this.R.delta < 0.05) {
            return;
        }

        if (this.R.alpha < 0) {
            this.R.coff = 1;
        } else if (this.R.alpha > 45) {
            this.R.coff = -1;
        }
        this.R.alpha += this.R.step * this.R.coff;
        var a = this.R.alpha * this.correct * -1;
        this.gun.setRotation(a);
        this.R.delta = 0;
        var alpha = this.calcAlpha(this.R.alpha);

        if (alpha > this.targetAngle - 0.05 && alpha < this.targetAngle + 0.05) {
            this.gun.getComponent('gun').setAngle(this.calcAlpha(a));
            this.gun.getComponent('gun').startShoot();
            this.shooterReady = false;
        }

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
        this.gun.setRotation(0);
    },

    display(info) {
        var pos = info.paths[info.paths.length - 1];
        var w = this.node.parent.width;
        this.node.x = w / 2 * (info.coff + 1);
        this.node.y = pos.y;
        this.node.setScale(info.coff, 1);
        var step = pos.x + 50 * info.coff;
        var t = Math.abs(this.node.x - step) / 50;

        var s1 = cc.jumpTo(0.1 * t, cc.v2(step, pos.y), 50, 1);
        var se = cc.sequence(s1, cc.callFunc(this.endDisplay, this));
        this.node.runAction(se);
    },

    endDisplay() {
        this.node.parent.getComponent('bgMap').readyPlayerShoot();

    },

    updatePos() {
        var game = this.node.parent.getComponent('bgMap');
        
        this.pathInfo = game.stairsPath[1];
        this.runStaus = 1;
        this.step = game.stepH;
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
        this.node.setScale(this.pathInfo.coff, 1);
        this.node.parent.getComponent('bgMap').readyPlayerShoot();
    },

    readyShooter(playPos) {
        var vect = playPos.sub(this.node.position);
        // var angle = cc.pToAngle(cc.pCompOp(vect, Math.abs));
        vect.x = Math.abs(vect.x);
        vect.y = Math.abs(vect.y);
        var angle = vect.angle(cc.v2(1, 0));
        this.targetAngle = angle;
        this.shooterReady = true;
    },

    setGun() {
        this.gun = cc.instantiate(this.gunPrefab);
        this.node.addChild(this.gun);
        this.gun.position = cc.v2(-30, 40);
    },

    setHealth(n) {
        this.health = n;
        this.initHealth = this.health;
    },

    generateBonus(game) {
        var coinCnt = Math.round(game.level);// + 3;
        var node_pos = this.node.getPosition();
        var ss = commonH.getScale();
        //. create coin
        for (var i = 0; i < coinCnt; i++) {
            game.spawnBonus(cc.v2(node_pos.x, node_pos.y * ss + this.node.parent.y), 1);
        }

        var gunBonus = Math.round(Math.random() + 0.2);
        if (gunBonus != 0) {
            game.goldBox.position = node_pos;
            game.goldBox.active = true;
        } else {
            game.spawnBonus(cc.v2(node_pos.x, node_pos.y * ss + this.node.parent.y), 2);
        }
    }


});
