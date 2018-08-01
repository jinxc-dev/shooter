cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        noNeedBtn: cc.Node,
        gunContainer: cc.Node,
        gunNameLabel: cc.Label,
        gunBufferLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.width = this.node.parent.width;
        this.node.height = this.node.parent.height;
        this.game;
        this.gunNum = 0;
        this.bufferCnt = 0;
    },

    setGameScene(game) {
        this.game = game;
    },

    start () {
        this.closeBtn.on('btnClicked', function() {
            this.node.active = false;
            this.game.resumeGameEvent();
            this.game.putGun(this.gunNum, this.bufferCnt);
        }, this);

        this.noNeedBtn.on('btnClicked', function() {
            this.game.resumeGameEvent();
            this.node.active = false;
        }, this);
    },

    onEnable() {
        console.log('Test');
        this.game.pushGameEvent();
        this.generateGun();
    },

    setInfoLabel(name, buffer) {
        this.gunBufferLabel.string = ", 可以亲" + buffer + "发!";
        this.gunNameLabel.string = name;
    },

    generateGun() {
        var guns = this.game.player.getComponent('player').gunPrefab;
        var name = "";        
        this.gunNum = Math.round((guns.length - 1) * cc.random0To1());
        this.bufferCnt = Math.floor( 5 * cc.random0To1()) +5;

        this.gunContainer.removeAllChildren();
        var g = cc.instantiate(guns[this.gunNum]);
        this.gunContainer.addChild(g);
        g.rotation = 20;
        g.scale = 2;
        name = g.getComponent('gun').gunName;
        this.setInfoLabel(name, this.bufferCnt);

    }

    // update (dt) {},
});
