var wexinHandler = require("wexinHandler");

cc.Class({
    extends: cc.Component,

    properties: {
        payBtn: cc.Node,
        nextBtn: cc.Node,
        backBtn: cc.Node,
        firstNode: cc.Node,
        nextNode: cc.Node,
        maxScoreLabel: cc.Label,
        gameScoreLabel: cc.Label,
        startLayout: cc.Layout,
        fightBtn: cc.Node,
        rankViewBtn: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.coinCnt = 0;
        this.gameSence;
        this.continueStatus = true;
    },

    start () {
        this.payBtn.on('btnClicked', function(){
            console.log("PayBtn clicked");
            if (this.coinCnt > 50) {
                this.coinCnt -= 50;
                this.gameSence.setCoinCount(this.coinCnt);
                this.node.active = false;
                this.gameSence.continueGame();
            }
        }, this);

        this.nextBtn.on('touchstart', function(){            
            this.firstNode.active = false;
            this.nextNode.active = true;
            wexinHandler.rankTop();
        }, this);

        this.backBtn.on('btnClicked', function() {
            console.log("BackBtn clicked");
            this.node.active = false;
            this.gameSence.exitGame();
            this.gameSence.readyStartGame();
            this.startLayout.node.active = true;
        }, this);

        this.rankViewBtn.on('touchend', function() {
            this.node.active = false;
            this.gameSence.exitGame();
            this.gameSence.readyStartGame();
            var event = new cc.Event.EventCustom("showRankView", true);
            this.node.dispatchEvent(event);            
        }, this);

        this.fightBtn.on('btnClicked', function() {
            if (window.wx != undefined) {
                console.log('share function');
                window.wx.shareAppMessage({title: 'Shooter', imageUrl: 'https://wx1.sinaimg.cn/mw1024/59a47337ly1frj7nve36uj20kd0cqamo.jpg', query: "from=group"});
            }
        }, this);
    },

    onEnable() {
        var b_continue = this.gameSence.gameContinueByCoin;
        this.firstNode.active = b_continue;
        this.nextNode.active = !b_continue;
        cc.find('/Main/sound').pauseSystemEvents(true);
    },

    onDisable() {
        cc.find('/Main/sound').resumeSystemEvents(true);
    },

    setGameInfo(score, coin_cnt) {
        //. setGame Info
        var ls = cc.sys.localStorage;
        var maxScore = ls.getItem('maxScore');
        if (maxScore == "" || maxScore == undefined) {
            maxScore = 0;
        }
        maxScore = parseInt(maxScore);
        this.coinCnt = coin_cnt;

        if (maxScore < score) {
            maxScore = score;
            ls.setItem("maxScore", maxScore);
            //. submit my score in wexin
            wexinHandler.submitScore(maxScore);
        }

        this.gameSence.setCoinCount(this.coinCnt);
        this.maxScoreLabel.string = "历史最高分 : " + maxScore;
        this.gameScoreLabel.string = score;
    },

    setGameScene(game) {
        this.gameSence = game;
    },

    // update (dt) {},
});
