cc.Class({
    extends: cc.Component,

    properties: {
        gun: {
            default: null,
            type: cc.Node
        },
        correct: 1,
        health: 2
    },

    onCollisionEnter: function (other, self) {
        console.log('Shooter OK');

        var pos = other.world.position;
        var node_pos = self.node.getPosition();
        var p_y = self.node.parent.y;

        var game = this.node.parent.getComponent('bgMap');
        game.spawnCircle(pos);
        game.removeEnemy(pos);
        // //. not killed
        // this.updatePos();
        // game.hasEnemy = true;
        game.shootedOK(pos);

        for (var i = 0; i < this.bonus.length; i++) {
            var b = this.bonus[i];
            game.spawnBonus(cc.v2(node_pos.x, node_pos.y + p_y), b);
        }
        other.node.removeFromParent();
        this.node.removeFromParent();

        

        

        // var pos = otherCollider.node.getPosition();
        // var node_pos = selfCollider.node.getPosition();
        // var p_y = selfCollider.node.parent.y;

        // var game = this.node.parent.getComponent('bgMap');
        // game.spawnCircle(pos);
        // game.removeEnemy(pos);
        // game.shootedOK(pos);

        // console.log('YYYY:' + node_pos.y);
        // console.log('YYYY:' + p_y);
        // for (var i = 0; i < this.bonus.length; i++) {
        //     var b = this.bonus[i];
        //     game.spawnBonus(cc.v2(node_pos.x, node_pos.y + p_y), b);
        // }
        // this.node.removeFromParent();
    },

    onLoad () {
        this.stepTime = 0.1
        this.R = {
            alpha: 0,
            coff: 1,
            step: 5,
            delta: 0,
            rr: 30
        };
        this.shooterReady = false;
        this.game = null;
        this.bonus = []; 

        var files = [
            'enemy1.png', 'enemy2.png', 'enemy3.png'
        ];
       
        var idx = Math.floor(files.length * cc.random0To1());
        var texture = cc.textureCache.addImage(cc.url.raw("resources/img/enemy/" + files[idx]));
        this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    },

    start () {
        var b = [1, 1, 1, 1, 1, 2, 1, 1];
        this.stopShooter();
        this.bonus.push(b[Math.floor(b.length * cc.random0To1())]);
    },

    update (dt) {
        if (this.shooterReady) {
            this.drawShooter(dt);
        }
    },

    drawShooter(dt) {
        this.R.delta += dt;
        if (this.R.delta < 0.1) {
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

    },

    calcAlpha(a) {
        return a * Math.PI / 180;
    },

    stopShooter() {
        this.shooterReady = false;
        this.R = {
            alpha: 0,
            coff: 1,
            step: 5,
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

        var s1 = cc.moveTo(0.5, pos.x + 50 * info.coff, pos.y);
        var se = cc.sequence(s1, cc.callFunc(this.endDisplay, this));
        this.node.runAction(se);
    },
    endDisplay() {
        this.node.parent.getComponent('bgMap').readyPlayerShoot();

    },

});
