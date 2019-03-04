var commonH = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {

        gunPrefab : {
            default: null,
            type: cc.Prefab
        },
        correct: 1,
    },

    onCollisionEnter: function (other, self) {
        console.log('Shooter OK');

        var pos = other.world.position;
        var node_pos = self.node.getPosition();
        var p_y = self.node.parent.y;
        var hh = other.world.preAabb.y - self.world.preAabb.y;
        var b_head = false;
        var gun_power = other.node.parent.getComponent('gun').power;
        var game = this.node.parent.getComponent('bgMap');
        var ss = commonH.getScale();
        //. head shoot
        if (hh > this.node.height / 3) {
            b_head = true;
            gun_power *= 2;
        }

        other.node.removeFromParent();

        pos = cc.v2(pos.x / ss, pos.y);
        
        game.spawnCircle(pos, gun_power);
        game.updateScore(b_head);
        game.removeAnim(pos, 'enemy');

        game.enemyHitedOK(b_head);

        for (var i = 0; i < this.bonus.length; i++) {
            var b = this.bonus[i];
            game.spawnBonus(cc.v2(node_pos.x, node_pos.y * ss + p_y), b);
        }

        this.node.removeFromParent();
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
            'enemy1.png', 'enemy2.png', 'enemy3.png'
        ];
       
        var idx = Math.floor(files.length * Math.random());

        var _this = this;
        var path = 'img/enemy/' + files[idx];
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, sprite) {
            if (err) {
                return;
            }
            _this.node.getComponent(cc.Sprite).spriteFrame = sprite
        });

        this.gun;
        this.setGun();
    },

    start () {
        var b = [0, 1, 0, 1, 0, 2, 1, 0, 1, 0];
        // var b = [2, 2, 2, 2, 2, 2, 2, 2];
        this.stopShooter();
        this.bonus.push(b[Math.floor(b.length * Math.random())]);
        this.targetAngle = 0;
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

        if (alpha > this.targetAngle - 0.03 && alpha < this.targetAngle + 0.03) {
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

        var s1 = cc.moveTo(0.1 * t, step, pos.y);
        var se = cc.sequence(s1, cc.callFunc(this.endDisplay, this));
        this.node.runAction(se);
    },
    endDisplay() {
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
    updatePos() {

    },

    setGun() {
        this.gun = cc.instantiate(this.gunPrefab);
        this.node.addChild(this.gun);
        this.gun.position = cc.v2(-30, 40);
    },

    setHealth(n) {
        return;
    }

    

});
