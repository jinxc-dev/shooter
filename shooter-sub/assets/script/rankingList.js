cc.Class({
    extends: cc.Component,

    properties: {
        rankItemPrefab: cc.Prefab,
        rankItemTopPrefab: cc.Prefab,
        prevBtn: cc.Node,
        nextBtn: cc.Node,
        content: cc.Node,
        myContent: cc.Node,
        topRankContent: cc.Node,
        rankListLayout: cc.Node,
        rankTopLayout: cc.Node
     
    },
    onLoad() {
        this.rankData = [];
        this.displayCnt = 6;
        this.pageNum = 0;
    },

    start() {
        this.removeChild();
        var dataKey = "k_crazy_shooter";
        if (window.wx != undefined) {
            window.wx.onMessage(data => {
                this.pageNum = 0;
                cc.log("Message：", data)
                if (data.messageType == 0) {
                    this.removeChild();
                } else if (data.messageType == "rankList") {
                    this.rankTopLayout.active = false;
                    this.rankListLayout.active = true;
                    this.fetchFriendData(dataKey, 'list');                    
                } else if (data.messageType == "rankTop") {
                    this.rankTopLayout.active = true;
                    this.rankListLayout.active = false;
                    this.topRankContent.removeAllChildren();
                    this.fetchFriendData(dataKey, 'top');
                    
                } else if (data.messageType == "sendScore") {
                    this.submitScore(dataKey, data.score);
                } 
            });
        } else {
            // this.fetchFriendData(1000);
            this.testData();
        }

        this.prevBtn.on('btnClicked', function(){
            this.pageNum --;
            this.pageNum = (this.pageNum < 0)? 0: this.pageNum;
            this.displayRank(this.rankData, this.pageNum, this.displayCnt);
        }, this);
        this.nextBtn.on('btnClicked', function(){
            this.pageNum ++;
            var end = Math.floor(this.rankData.length / this.displayCnt);
            this.pageNum = (this.pageNum > end)? end: this.pageNum;
            this.displayRank(this.rankData, this.pageNum, this.displayCnt);      
            
        }, this);

        this.displayRank(this.rankData, this.pageNum, this.displayCnt);
        this.displayRankTop(this.rankData);

    },
    submitScore(key, score) { 
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                keyList: [key],
                success: function (getres) {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {
                            return;
                        }
                    }
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: key, value: "" + score}],
                        success: function (res) {
                            console.log('setUserCloudStorage', 'success', res);
                            
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            cc.log("error:" + key + " : " + score)
        }
    },
    removeChild() {
        this.content.removeAllChildren();
    },
    fetchFriendData(key, type) {
        this.removeChild();
        // this.content.active = true;
        if (window.wx != undefined) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    wx.getFriendCloudStorage({
                        keyList: [key],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;                        
                            });
                            this.rankData = data;
                            if (type == 'top') {
                                this.displayRankTop(this.rankData);
                            } else {
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].avatarUrl == userData.avatarUrl) {
                                        this.displayMyRank(i, data[i]);
                                    }
                                }
                                this.displayRank(this.rankData, this.pageNum, this.displayCnt);
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },

    displayRank(data, page, cnt) {
        this.removeChild();
        var s = page * cnt;
        var e = (page + 1) * cnt;
        if (e > data.length) {
            e = data.length;
        }
        var nStep = 0;
        var nH = 85;
        var startY = -50;
        for (let i = s ; i < e; i++) {
            var playerInfo = data[i];
            var item = cc.instantiate(this.rankItemPrefab);
            this.content.addChild(item);
            item.getComponent('rankItem').init(i, playerInfo);
            // 
            item.setPositionY(-nStep * nH + startY);
            nStep ++;
        }        
    },

    displayMyRank(rank, data) {
        this.myContent.removeAllChildren();
        var item = cc.instantiate(this.rankItemPrefab);
        this.myContent.addChild(item);
        item.getComponent('rankItem').init(0, data);
        // item.getComponent(cc.Sprite).active = false;
    },

    displayRankTop(data) {
        this.topRankContent.removeAllChildren();
        var e = (data.length < 3) ? data.length: 3;
        for (let i = 0 ; i < e; i++) {
            var playerInfo = data[i];
            console.log(playerInfo);
            var item = cc.instantiate(this.rankItemTopPrefab);
            this.topRankContent.addChild(item);
            item.getComponent('rankItem').init(i, playerInfo);

            item.x = (i + 0.5) * item.width;
        }        
    },

    testData() {
        var data = [];
        for (var i = 0; i < 32; i++) {
            var tmp = {};
            tmp.avatarUrl = "/resources/close_red.png";
            tmp.KVDataList = [{value: i}];
            tmp.nickname = "AAAAAA";
            data.push(tmp);
        }
        
        this.rankData = data;
    },

    testFun() {
        window.wx.chooseAddress({
            success: function(res) {
                console.log(JSON.stringify(res));
            },
            fail: function(err) {
                console.log('fail');
            }
        })
    }
});
