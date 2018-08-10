

var commonHandler = {
    getScale(){
        var screenSize = cc.sys.windowPixelResolution;
        return screenSize.width / screenSize.height / 0.5633;
    },
    
};
module.exports = commonHandler;