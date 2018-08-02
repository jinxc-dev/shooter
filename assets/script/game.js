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
        gunListBtn: cc.Node,
        rankViewBtn: cc.Node,
        rankViewLayout: cc.Layout

    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2 (0, -320);
        cc.director.getCollisionManager().enabled = true;

        this.gameColor = [
            cc.color(73, 120, 228, 255),
            cc.color(219, 119, 131, 255)
        ];

        this.gameStorageCheck('gun_num', 0);
        this.gameStorageCheck('coinCount', 0);
        var vv = [1];
        for (var i = 0; i < 22; i++) 
            vv.push(0);
        this.gameStorageCheck('enableGunList', vv);

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

    },

    gameStorageCheck(key, value) {
        var ls = cc.sys.localStorage;
        var r = ls.getItem(key);
        if (r == "" || r == null) {
            ls.setItem(key, value);
        }
    },



});
