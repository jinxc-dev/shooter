cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        }
    },

    onLoad() {
        
    },
    start() {
        
    },

    init (game) {
        this.game = game;
        this.anim.getComponent('animKilled').init(this);
    },

    play () {
        this.anim.play('killerEnemy');
    },

    despawn () {
        this.game.despawnKilledEnemy(this.node);
    },


});