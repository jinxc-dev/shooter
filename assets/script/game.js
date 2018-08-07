var wexinHandler = require("wexinHandler");

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: {
            default: null,
            type: cc.Node
        },
        startBtn: cc.Node,
        startLayout: cc.Layout,
        mainLayout: cc.Layout,
        gunListLayout: cc.Layout,        
        rankViewLayout: cc.Layout,
        soundBtn: cc.Node,

        rankViewBtn: cc.Node,
        shareBtn: cc.Node,
        gunListBtn: cc.Node,
        friendBtn: cc.Node,
        wexinBtn: cc.Node,
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2 (0, -320);
        cc.director.getCollisionManager().enabled = true;

        this.soundOnTexture = cc.textureCache.addImage(cc.url.raw("resources/img/sound.png"));
        this.soundOffTexture = cc.textureCache.addImage(cc.url.raw("resources/img/mute.png"));
        this.isloadSoundOn = true;
        this.isSound = true;

        this.gameColor = [
            cc.color(73, 120, 228, 255),
            cc.color(219, 119, 131, 255)
        ];

        this.gameStorageCheck('gun_num', 0);
        this.gameStorageCheck('coinCount', 0);
        this.gameStorageCheck('soundStatus', "on");

        var vv = [1];
        for (var i = 0; i < 22; i++) 
            vv.push(0);
        this.gameStorageCheck('enableGunList', vv);

        this.checkRectBtns();
    },

    start () {
        var n = Math.round(cc.random0To1() * (this.gameColor.length - 1));
        this.mainLayout.node.color = this.gameColor[n];
        this.startBtn.on("touchstart", function(){
            console.log('start Game');
            this.bgNode.getComponent('bgMap').startGame();
            this.startLayout.node.active = false;
        }, this);

        this.gunListBtn.on('touchstart', function() {
            this.gunListLayout.node.active = true;
        }, this);

        //. rank view 

        this.rankViewBtn.on('touchstart', function(){
            this.rankViewLayout.node.active = true;
            wexinHandler.rankList();
            this.startLayout.node.active = false;
        }, this);

        this.shareBtn.on('touchstart', function() {
            if (window.wx != undefined) {
                console.log('share function');
                window.wx.shareAppMessage({title: 'Shooter', imageUrl: 'https://wx1.sinaimg.cn/mw1024/59a47337ly1frj7nve36uj20kd0cqamo.jpg', query: "from=group"});
            }
        });
        //. sound process
        this.soundStatusCheck();
        this.soundBtn.on('touchstart', function(){
            this.isSound = !this.isSound;
            if (this.isloadSoundOn) {
                this.isloadSoundOn = false;
                cc.audioEngine.play(cc.url.raw('resources/sound/bg.mp3'), true, 1);
            }
            if (this.isSound) {
                cc.sys.localStorage.setItem("soundStatus", "on");
                this.soundBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.soundOnTexture);
                cc.audioEngine.resumeAll();
            } else {
                cc.sys.localStorage.setItem("soundStatus", "off");
                this.soundBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.soundOffTexture);
                cc.audioEngine.pauseAll();
            }
        }, this);

    },

    gameStorageCheck(key, value) {
        var ls = cc.sys.localStorage;
        var r = ls.getItem(key);
        if (r == "" || r == null) {
            ls.setItem(key, value);
        }
    },

    soundStatusCheck() {
        var s_status = cc.sys.localStorage.getItem('soundStatus');
        this.isSound = (s_status == "on") ? true: false;          

        if (!this.isSound) {
            this.soundBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.soundOffTexture);
            cc.audioEngine.pauseAll();
        } else {
            cc.audioEngine.play(cc.url.raw('resources/sound/bg.mp3'), true, 1);
            this.isloadSoundOn = false;
        }
    },

    checkRectBtns() {
        var screenSize = cc.sys.windowPixelResolution;
        var rY = screenSize.width / screenSize.height * 1.775;
        this.friendBtn.scaleY = rY;
        this.rankViewBtn.scaleY = rY;
        this.shareBtn.scaleY = rY;
        this.wexinBtn.scaleY = rY;
        this.gunListBtn.scaleY = rY;
    }



});
