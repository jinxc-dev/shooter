
cc.Class({
    extends: cc.Component,

    properties: {
        bulletBuff: 5,
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        aimLen: 20,
        power: 3,
        gunName: "pistol",
        shotSound: cc.AudioClip
        // dealyT : 0.5
    },

    onLoad() {
        this.deltaX = 0;
        this.deltaY = 0;
        this.bGunTest = false;  //. gun tset status
        this.dealyTime = 0;
        this.angle = 0;
        this.bulletCnt = 0;
        this.readyStatus = false;
    },
    start () {

    },

    spawnBullet () {
        if (this.bulletCnt < 1) {
            this.readyStatus = false;
            if (!this.bGunTest) {
                this.sendEndStatus();
            }
            return;
        }
        this.bulletCnt --;
        var bullet;
        var pos = this.node.parent.position;
        var coff = 1;

        if (pos.x >= 320) {
            coff = -1;
        }
        
        bullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(bullet);

        bullet.position = cc.v2(-this.node.width,0);
        
        var d = 2000;
        var xx = d * Math.cos(this.angle) * coff;
        var yy = d * Math.sin(this.angle);
        var _body = bullet.getComponent(cc.RigidBody);
        
        _body.linearVelocity = cc.v2(xx, yy);
        _body.active = true;
        this.runShock();
        return bullet;
    },

    update (dt) {
        if (this.readyStatus) {
            this.dealyTime += dt;
            if (this.dealyTime > 0.1) {
                this.spawnBullet();
                this.dealyTime = 0;
            }
        }
    },

    setAngle(angle) {
        this.angle = angle;
    },

    startShoot() {
        this.readyStatus = true;
        this.bulletCnt = this.bulletBuff;
        if (cc.sys.localStorage.getItem('soundStatus') == 'on') {
            cc.audioEngine.play(this.shotSound, false, 1);
        }
    },

    sendEndStatus() {
        //. if owner is player, check gunStatus.

        this.scheduleOnce(function(){
            var event = new cc.Event.EventCustom("end_shooter", true);
            this.node.dispatchEvent(event);

            if (this.node.parent.name == 'player') {
                console.log('ower');
                this.node.parent.getComponent('player').checkGunStatus();
            }
        }, 0.5);


    },

    runShock() {
        var s1 = cc.moveBy(0.05, 5, 0);
        var s2 = cc.moveBy(0.05, -5, 0);

        var se = cc.sequence(s1, s2);
        this.node.runAction(se);
    },

    //. set, remove gun test
    setGunTest(bTest) {
        this.bGunTest = bTest;
    }

});
