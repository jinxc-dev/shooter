
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.subCanvas = this.node.getComponent(cc.Sprite);
    },

    start () {
        
        if (window.wx != undefined) {
            window.wx.showShareMenu({withShareTicket: true});
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 640;
            window.sharedCanvas.height = 1136;
        }
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
