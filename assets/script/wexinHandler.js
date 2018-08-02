var wexinHandler = {
    submitScore(score){
        if (window.wx != undefined) {
            window.wx.postMessage({
                messageType: "sendScore",
                score: score,
            });
        } else {
            cc.log("fail: x_total : " + score)
        }
    },
    rankList() {
        if (window.wx != undefined) {
            window.wx.postMessage({
                messageType: "rankList",
            });
        } else {
            cc.log("fail rank list:");
        }
    },
    rankTop() {
        if (window.wx != undefined) {
            window.wx.postMessage({
                messageType: "rankTop",
            });
        } else {
            cc.log("fail rank Top:");
        }
    }
};
module.exports = wexinHandler;