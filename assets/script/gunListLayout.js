
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
        gunPageView: cc.PageView,
        coinCntLabel: cc.Label,
        buyGunBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gamePlayerComp = this.gameMain.getComponent('bgMap').player.getComponent('player');
        this.gunItmeObjs = [];
        this.selectedIdx = 0;        
        this.nowPageIdx = 0;
        this.gunSelectedIdx = [];
        this.selectedIdx = parseInt(cc.sys.localStorage.getItem("gun_num"));
        this.payStatus = false;
        this.payCoinCnt = 20;
        this.coinCntLabel.string = this.payCoinCnt;

    },

    start () {
        this.createItem();

        //. 해당한 총을 선택하였을때의 사건이다.
        //. 총을 선택하면 이미 선택되였던 총은 비선택상태로 놓고 현재의 총을 선택상태로 놓은 다음 총의 시험을 진행한다.
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

        //. 비활성화된 총을 선택하였을때의 사건
        //. 총을 선택하면 활성화 상태로 놓고 총의 id를 1로 설정하고 보관한다.
        this.node.on('payGunItem', function(event) {
            var idx = event.getUserData();
            this.gunSelectedIdx[idx] = 1;
            cc.sys.localStorage.setItem('enableGunList', this.gunSelectedIdx);
            this.stopSelectGun();
            this.payStatus = false;
        }, this);

        this.backBtn.on('touchstart', function(){
            this.node.active = false;
        }, this);

        //. 현재 페지의 사건.
        //. 페지 이동에 따라 총의 가격이 달라진다.
        this.gunPageView.node.on('page-turning', function() {
            var idx = this.gunPageView.getCurrentPageIndex();

            if (idx == 0) {
                this.payCoinCnt = 20;//250;
            } else if (idx == 1 || idx == 2) {
                this.payCoinCnt = 50;//500;
            } else {
                this.payCoinCnt = 75;//750;
            }
            this.coinCntLabel.string = this.payCoinCnt;
        }, this);

        //. 총얻기 단추를 누룰때의 사건이다.
        this.buyGunBtn.on('touchstart', function() {
            if (this.payStatus) return;
                
            var coinCnt = parseInt(cc.sys.localStorage.getItem("coinCount"));
            if (coinCnt < this.payCoinCnt) return;
            var payStatus = this.startSelectGun();
            if (payStatus) {
                this.payStatus = true;
                this.gameMain.getComponent('bgMap').setCoinCount(this.payCoinCnt - coinCnt);
            }
        }, this);
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

    //. 총의 목록을 구성한다.
    createItem() {
        
        var gunCnt = [6, 6, 5, 6];
        var step = 40;
        var guns = this.gamePlayerComp.gunPrefab;
        var idx = 0;

        var gunIdx = [];
        var tmp = cc.sys.localStorage.getItem("enableGunList");
        //. 총의 활성상태를 얻어온다.
        if (!Array.isArray(tmp)) {
            gunIdx = tmp.split(",");
        } else {
            gunIdx = tmp;
        }
        for (var i = 0; i < gunIdx.length; i++) {
            gunIdx[i] = parseInt(gunIdx[i]);
        }        
        this.gunSelectedIdx = gunIdx;

        for (var i = 0; i < gunCnt.length; i++) {
            var row = 0, col = 0;
            for (var j = 0; j < gunCnt[i]; j++) {
                var item = cc.instantiate(this.gunItem);
                this.pages[i].addChild(item);
                item.getComponent('gunItem').setItem(guns[idx], idx, gunIdx[idx]);

                //. 현재 선택된 총이면 선택상태를 체크해준다.
                if (idx == this.selectedIdx) {
                    item.getComponent('gunItem').drawSelected();
                    item.getComponent('gunItem').updateItemsPos();
                }

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
    },

    //. 총의 선택이 시작되였을때의 처리.
    startSelectGun() {
        var startIdx = [0, 6, 12, 17];
        var gunCnt   = [6, 6,  5, 6];
        var existGun = false;
        var idx = this.gunPageView.getCurrentPageIndex();
        for (var i = startIdx[idx]; i < startIdx[idx] + gunCnt[idx]; i++) {
            this.gunItmeObjs[i].getComponent('gunItem').readySelectGun();
            this.existGun = true;
        }
        return existGun;
    },
    //. 총의 선택이 끝낱을때의 처리이다.
    stopSelectGun() {
        var startIdx = [0, 6, 12, 17];
        var gunCnt   = [6, 6,  5, 6];
        var idx = this.gunPageView.getCurrentPageIndex();
        for (var i = startIdx[idx]; i < startIdx[idx] + gunCnt[idx]; i++) {
            this.gunItmeObjs[i].getComponent('gunItem').stopSelectGun();
        }
    }

    // update (dt) {},
});
