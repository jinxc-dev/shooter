
cc.Class({
    extends: cc.Component,

    properties: {
        subCanvas: {
            default: null,
            type: cc.Sprite
        },
        closeBtn: {
            default: null,
            type: cc.Node
        },
        startBtn: {
            default: null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        if (window.wx != undefined) {
            window.wx.showShareMenu({withShareTicket: true});
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 640;
            window.sharedCanvas.height = 1136;
        }

        var game = this.node.parent.getComponent('game');

        this.closeBtn.on('btnClicked', function(){
            game.startLayout.node.active = true;
            this.node.active = false;
            
        }, this);

        this.startBtn.on('btnClicked', function() {
            game.bgNode.getComponent('bgMap').startGame();
            this.node.active = false;
        }, this);
    },

    _updateSubCanvas() {
        if (window.sharedCanvas != undefined && this.tex) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.subCanvas.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubCanvas();
    }
});
