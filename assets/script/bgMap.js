
cc.Class({
    extends: cc.Component,

    properties: {
        stepH : 40,
        startPos: cc.v2(50, 435),
        player: {
            default: null,
            type: cc.Node
        },
        enemyPrefab: {
            default: [],
            type:cc.Prefab
        },
        bulletPrefab: {
            default: null,
            type:cc.Prefab
        },
        circlePrefab: {
            default: null,
            type: cc.Prefab
        }
        
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.graphics = this.getComponent(cc.Graphics);        
        this.color = cc.color(73, 120, 228, 255);
        this.colorStep = cc.color(5, 9, 15);
        this.initCnt = 10;
        this.stairsPath;
        this.bulletPool = new cc.NodePool('bullet');
        this.circlePool = new cc.NodePool('circle');

    },

    start () {
        this.initGame();

        // this.node.parent
        // this.node.parent.on("touchend", function(){
        //     var p = this.stairsPath[0];
        //     this.player.getComponent('player').updatePos(p, this.stepH);
        // }, this);

        this.node.parent.on("touchend", function(){
            // this.spawnBullet();
            this.shootedPlayer();
            // this.spawnCircle(cc.v2(100, 100));
        }, this);
    },

    initGame() {
        this.stairsPath = this.generateStairs();
        this.drawStairs(this.stairsPath);

        this.player.x = this.node.width / 2;
        this.player.y = this.stairsPath[0].paths[0].y;
        this.spawnEnemy();
    },

    //. draw map
    drawStairs(stairs) {
        var initPath ={
            coff: 1,
            paths: [
                cc.v2(this.node.width, 0),
                cc.v2(this.node.width, stairs[0].paths[0].y)
            ]
        };
        this.drawPart(initPath, stairs[0], this.color);

        for (var i = 1; i < stairs.length; i++) {
            this.color = this.upgardColor(this.color, this.colorStep);
            this.drawPart(stairs[i - 1], stairs[i], this.color);
        }

    },

    drawPart(prevInfo, nowInfo, color) {
        var g = this.graphics;        
        var prev = prevInfo.paths;
        var now = nowInfo.paths;
        var n = now.length;

        g.fillColor = color;

        g.moveTo(now[0].x, now[0].y);
        for (var i = 1; i < n; i++) {
            g.lineTo(now[i].x, now[i].y);
        }
        var x = 0;
        if (nowInfo.coff == 1) {
            x = this.node.width;
        }

        g.lineTo(x, now[n - 1].y);
        g.lineTo(x, prev[0].y);

        for (var i = 0; i < prev.length; i++) {
            g.lineTo(prev[i].x, prev[i].y);
        }
        g.lineTo(now[0].x, now[0].y);
        console.log('---------------------');
        // g.stroke();
        g.close();
        g.fill();

    },
    upgardColor(color, step) {
        return cc.color(color.getR() - step.getR(), color.getG() - step.getG(), color.getB() - step.getB(), 255);
    },

    //. generate stairs information.
    generateStairs() {
        var paths = [];
        var w_flag = true;
        var w_prevPath = this.startPos;
        for (var i = 0; i < this.initCnt; i++) {
            w_flag = !w_flag;
            var coff = (w_flag) ? 1: -1;
            var w_path = this.generatePath(3, 2, w_prevPath, coff, this.stepH);
            paths.push({
                coff: coff,
                paths: w_path
            });
            w_prevPath = w_path[w_path.length - 1];
        }
        return paths;  
    },

    generatePath(maxN, minN, pos, coff, step) {
        var n = Math.round(cc.random0To1() * (maxN - minN)) + minN;
        console.log('N:' + n);
        var p = [];
        for (var i = 0; i < n; i++) {
            var x = coff * (i * step + this.startPos.x) + this.node.width / 2;
            var y = pos.y + i * step;
            p.push(cc.v2(x, y));
            p.push(cc.v2(x, y + step));
        }
        return p;

    },

    //. upgard map.
    upgardMap() {
        var p = this.stairsPath.shift();
        var w_h = p.paths[0].y - this.stairsPath[0].paths[0].y;
        console.log('delta:' + w_h);
        var move = cc.moveBy(0.3, 0, w_h);
        this.node.runAction(move);

        this.addMap();
        // this.node.y
    },
    addMap() {
        var n = this.stairsPath.length;
        var prev = this.stairsPath[n - 1];
        var coff = prev.coff * (-1); 
        var now = {
            coff: coff,
            paths: this.generatePath(3, 2, prev.paths[prev.paths.length - 1], coff, this.stepH)
        }
        this.color = this.upgardColor(this.color, this.colorStep);
        
        this.stairsPath.push(now);
        this.drawPart(prev, now, this.color);
    },

    //. 
    spawnBullet (angle, pos, normal) {
        var bullet;
        bullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(bullet);

        bullet.position = pos;
        var alpha =  angle * Math.PI / 180;
        
        var d = 2000;
        var xx = d * Math.cos(alpha) * normal.x;
        var yy = d * Math.sin(alpha) * normal.y;
        var _body = bullet.getComponent(cc.RigidBody);
        _body.linearVelocity = cc.v2(xx, yy);
    },

    despawnBullet(bullet) {
        this.bulletPool.put(bullet);

    },

    //. create enemy
    spawnEnemy() {
        var enemy = cc.instantiate(this.enemyPrefab[0]);
        this.node.addChild(enemy);
        var info = this.stairsPath[0];
        var pos = info.paths[info.paths.length - 1];
        enemy.setScale(info.coff, 1);
        enemy.x = pos.x + 50 * info.coff;
        enemy.y = pos.y;
    },

    shootedPlayer() {
        var a = this.player.getComponent('player').getAngle();
        var pos = cc.v2(this.player.x, this.player.y + 40);
        this.spawnBullet(a, pos, cc.v2(-1, 1));

    },

    spawnCircle(pos) {
        var obj =cc.instantiate(this.circlePrefab);
        this.node.addChild(obj);
        obj.position = pos;

        // var x;
        var comp = obj.getComponent('circle');
        comp.initGame(this);
        comp.play();
    },







});
