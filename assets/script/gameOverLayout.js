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
        startLayout: cc.Layout
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
    },

    onEnable() {
        var b_continue = this.gameSence.gameContinueByCoin;
        this.firstNode.active = b_continue;
        this.nextNode.active = !b_continue;
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
