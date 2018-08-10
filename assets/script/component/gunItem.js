

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        detailLabel: cc.Label,
        bgGraphics: cc.Graphics
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gun = null;
        this.idx = 0;
        this.selColor = cc.color(51, 58, 66, 255);
        
        this.namePosY = this.nameLabel.node.y;
        this.enabledStatus = false;
        this.readySelect = false;
        this.deltaTime = 0;
    },

    start () {
        this.node.on("touchend", function() {
            if (this.enabledStatus) {
                this.drawSelected();
                this.updateItemsPos();
                var event = new cc.Event.EventCustom("selectGunItem", true);
                event.setUserData(this.idx);
                this.node.dispatchEvent(event);
            } else {
                var event = new cc.Event.EventCustom("show-alert", true);
                event.setUserData("还未拥有此武器");
                this.node.dispatchEvent(event);
            }
        }, this);

        this.node.on("touchstart", function() {
            if (this.readySelect) {
                this.readySelect = false;
                this.enabledStatus = true;
                this.setItemEnable(true);
                var event = new cc.Event.EventCustom("payGunItem", true);
                event.setUserData(this.idx);
                this.node.dispatchEvent(event);    
            }
        }, this);
    },

    //. 현재 총의 Item에 대한 설정을 진행한다.
    setItem(gun, idx, status) {        
        this.idx = idx;

        this.gun = cc.instantiate(gun);
        this.node.addChild(this.gun);
        this.gun.setRotation(20);
        this.gun.setScale(1.2);
        var gunComp = this.gun.getComponent('gun');
        var enable = (status == 1) ? true: false;
        
        //. set gun detail information.
        this.nameLabel.string = gunComp.gunName;
        this.detailLabel.string = "子弹     " + gunComp.bulletBuff + "\n伤害     " + gunComp.power;
        this.detailLabel.node.active = false;
        this.drawUnSelect(enable);
        this.setItemEnable(enable);
        this.enabledStatus = enable;
    },

    setItemEnable(enable) {        
        var w_color = cc.color(255, 255, 255, 255);
        if (!enable) {
            var w_color = cc.color(184, 132, 132, 255);
        }
        this.gun.color = w_color;
        this.nameLabel.node.color = w_color;
        this.detailLabel.node.color = w_color;

        
    },
    drawUnSelect(active) {
        var g = this.bgGraphics;
        var x = -80;
        var w = 160;
        g.clear();
        g.fillColor = cc.color(0, 0, 0, 100);
        g.lineWidth = 0;
        g.roundRect(x, x, w, w, 5);
        g.fill();
        g.stroke();
        g.close();
    },

    drawSelected() {
        var g = this.bgGraphics;
        var x = -85;
        var y = -100;
        g.clear();
        g.fillColor = this.selColor;
        g.lineWidth = 5;
        g.roundRect(x, y, -2 * x, -2 * y, 5);
        g.fill();
        g.stroke();
        g.close();
    },
    updateItemsPos() {
        this.nameLabel.node.y = this.namePosY + 20;
        this.detailLabel.node.active = true;
        this.gun.y = 30;
        this.gun.setScale(1.4);
      
    },
    initItemPos() {
        this.nameLabel.node.y = this.namePosY;
        this.gun.y = 0;
        this.gun.setScale(1.2);
        this.detailLabel.node.active = false;
    },

    //. 총의 선택상태를 체크해준다.
    readySelectGun() {
        if (!this.enabledStatus) {
            console.log('readySelect:' + this.idx);
            this.readySelect = true;
            this.deltaTime = (this.idx % 6) / 10;
            this.setItemEnable(true); 
        }
    },    
    //. 총의 선태상태를 해제해준다.
    stopSelectGun() {
        if (!this.enabledStatus) {
            console.log("stop ready:" + this.idx);
            this.readySelect = false;
            this.drawUnSelect(false);
            this.setItemEnable(false);
        }
    },
    // 총이 선택상태이면 총의 배경을 바꾸어준다.
    update (dt) {
        if (this.readySelect) {
            this.deltaTime += dt;
            if (this.deltaTime > 0.3) {
                this.deltaTime = 0;
                this.drawBGRandon();
            }
        }
    },
    //. 우연적으로 배경을 바꾸어준다.
    drawBGRandon() {
        var t = 100;
        var c1 = Math.ceil(cc.random0To1() * t + t);
        var c2 = Math.ceil(cc.random0To1() * t + t);
        var c3 = Math.ceil(cc.random0To1() * t + t);

        var g = this.bgGraphics;
        var x = -80;
        var w = 160;
        g.clear();
        g.fillColor = cc.color(c1, c2, c3, 255);
        g.lineWidth = 0;
        g.roundRect(x, x, w, w, 5);
        g.fill();
        g.close();
    },
});
