cc.Class({
    extends: cc.Component,

    init (parent) {
        this.parent = parent;
    },

    hideAnim: function () {
        this.parent.despawn();
    },
});