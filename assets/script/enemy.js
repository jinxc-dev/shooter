cc.Class({
    extends: cc.Component,

    properties: {
        gun: {
            default: null,
            type: cc.Node
        },
        correct: 1
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log('Shooter OK');

        var pos = otherCollider.node.getPosition();

        this.node.parent.getComponent('bgMap').spawnCircle(pos);
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
        this.shooterReady = true;
        this.game=null;
    },

    start () {

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
});
