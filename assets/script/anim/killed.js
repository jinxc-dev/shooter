cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        }
    },

    onLoad() {
        // this.type = 'enemy';
    },
    start() {
        
    },

    init (game, type) {
        this.game = game;
        this.type = type;
        this.anim.getComponent('animKilled').init(this);
    },

    play () {
        if (this.type == 'enemy') {
            this.anim.play('killerEnemy');
        } else if (this.type == 'player') {
            this.anim.play('killerPlayer');
        }
    },

    despawn () {
        this.game.despawnKilledAnim(this.node, this.type);
    },


});