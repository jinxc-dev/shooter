
cc.Class({
    extends: cc.Component,

    properties: {
        gunItem: cc.Prefab,
        pages: {
            default: [],
            type: cc.Node
        },
        gameMain: cc.Node,
        startGameLayout: cc.Layout,
        backBtn: cc.Node,
        pageViewContainer: cc.PageView
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gamePlayerComp = this.gameMain.getComponent('bgMap').player.getComponent('player');
        this.gunItmeObjs = [];
        this.selectedIdx = 0;
    },

    start () {
        this.createItem();
        this.node.on('selectGunItem', function(event) {
            var idx = event.getUserData();
            if (idx != this.selectedIdx) {                
                var oldItem = this.gunItmeObjs[this.selectedIdx];
                oldItem.getComponent('gunItem').drawUnSelect(false);
                oldItem.getComponent('gunItem').initItemPos();
                this.selectedIdx = idx;
                this.saveSelectedGun(this.selectedIdx);
            }
            this.gamePlayerComp.setTestGun(this.selectedIdx);     

        }, this);

        this.backBtn.on('touchstart', function(){
            this.node.active = false;
        }, this);

        this.pageViewContainer.node.on('page-turning', function() {
            console.log('NextPage');
        });
    },

    
    onEnable() {
        console.log('GameEvent');
        this.gameMain.y = 400;
        this.gamePlayerComp.setSelectGunReady();
        this.startGameLayout.node.active = false;
    },
    onDisable() {
        this.gameMain.y = 0;
        this.gamePlayerComp.destroySelectGunReady();
        this.startGameLayout.node.active = true;
    },

    createItem() {
        var gunCnt = [6, 6, 5, 6];
        var step = 40;
        var guns = this.gamePlayerComp.gunPrefab;
        var idx = 0;

        var gunIdx = [];
        var tmp = cc.sys.localStorage.getItem("enableGunList");
        if (!Array.isArray(tmp)) {
            gunIdx = tmp.split(",");
        } else {
            gunIdx = tmp;
        }

        for (var i = 0; i < gunIdx.length; i++) {
            gunIdx[i] = parseInt(gunIdx[i]);
        }
        
        for (var i = 0; i < gunCnt.length; i++) {
            var row = 0, col = 0;
            for (var j = 0; j < gunCnt[i]; j++) {
                var item = cc.instantiate(this.gunItem);
                this.pages[i].addChild(item);
                item.getComponent('gunItem').setItem(guns[idx], idx, gunIdx[idx]);

                if (row > 2) {
                    row = 0; col++;
                }
                var x, y;
                x = (row - 1) * (item.width + step);
                y = (1 - 2 * col) * (item.height + step) / 2;
                item.setPosition(x, y);
                row ++;
                idx ++;

                this.gunItmeObjs.push(item);
            }
        }
    },
    saveSelectedGun(idx) {
        var ls = cc.sys.localStorage;
        ls.setItem("gun_num", idx);
    }

    // update (dt) {},
});
