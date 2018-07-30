
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
            default: null,
            type:cc.Prefab
        },
        bossPrefab: {
            default: null,
            type: cc.Prefab
        },
        bulletPrefab: {
            default: null,
            type:cc.Prefab
        },
        circlePrefab: {
            default: null,
            type: cc.Prefab
        },
        killedAnim: {
            default: [],
            type: cc.Prefab
        },
        readyShooter: false,

        bonusPrefab: {
            default: [],
            type: cc.Prefab
        },
        coinImage: {
            default: null,
            type: cc.Node
        },

        coinScore: 0,
        coinLabel:{
            default: null,
            type: cc.Label
        },
        lifeValue: 1,

        gameScore: 0,
        gameScoreLabel: {
            default: null,
            type:cc.Label
        },
        gameLevelLabel: cc.Label,
        bulletCntNode: cc.Node,
        bulletCntLabel: cc.Label,
        lifeImgNode: {
            default: [],
            type: cc.Node
        },
        bossHealthLayout: cc.Node,
        enemyHealthLayout: cc.Node
 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.graphics = this.getComponent(cc.Graphics);        
        this.color = cc.color(73, 120, 228, 255);
        this.colorStep = cc.color(5, 9, 15);
        this.initCnt = 10;
        this.stairsPath;
        this.bonus=[];
        this.enemyCnt = 0;
        this.hasEnemy = false;
        this.readyEnemy =false;
        this.level = 1;

        this.killedEnemyPool = new cc.NodePool('killedEnemy');
        this.killedPlayerPool = new cc.NodePool('killedPlayer');
        this.enemyHited = false;
        this.enemyComp = null;
        this.deadBoss = false;
        this.gameScore = 0;
        this.maxEnemy = 5;
        this.displayEnemyType = 'enemy';
    },

    start () {
        // this.initGame();
        this.initStartGame();
        this.updateLifeDisplay();
        this.startGameLevel();
        this.node.parent.on("touchend", function(){
            if (this.readyShooter) {
                this.shootedPlayer();
                this.readyShooter = false;
            }
        }, this);

        this.node.on("end_shooter", function(){
            if (this.enemyHited) {
                if (this.hasEnemy) {
                    this.enemyComp.updatePos();
                }
                this.playerNextStep();

            } else {
                if (!this.readyShooter) {
                    this.enemyComp.readyShooter(this.player.position);
                    this.player.getComponent('player').stopShooter();
                    this.readyEnemy = true;
                    this.readyShooter = true;
                } else {
                    this.enemyComp.stopShooter();
                    this.player.getComponent('player').shooterReady = true;
                    this.readyEnemy = false;
                }
            }
        }, this);
    },

    initStartGame() {
        this.bulletCntNode.active = false;
        this.gameScore = 0;
    },

    initGame() {
        this.enemyCnt = 0;
        this.enemyHealthLayout.active = true;
        this.bossHealthLayout.active = false;
        this.stairsPath = this.generateStairs();
        this.drawStairs(this.stairsPath);
        this.deadBoss = false;
        this.node.position = cc.v2(0, 0);

        this.player.x = this.node.width / 2;
        this.player.y = this.stairsPath[0].paths[0].y;
        this.player.setScale(1, 1);
        this.hasEnemy = false;
        this.spawnEnemy();
        this.createPhyCollider(this.stairsPath[0]);
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

    //. create enemy
    spawnEnemy() {
        var enemy;
        var comp;
        this.enemyComp = null;
        if (this.enemyCnt < this.maxEnemy) {
            enemy = cc.instantiate(this.enemyPrefab);
            comp = 'enemy';

        } else {
            enemy = cc.instantiate(this.bossPrefab);
            comp = 'boss';
        }
        this.displayEnemyType = comp;
        this.node.addChild(enemy);
        enemy.getComponent(comp).display(this.stairsPath[0]);
        //. set boss health
        enemy.getComponent(comp).setHealth(this.level * 2);
        this.enemyCnt ++;
        this.readyEnemy = false;

        this.enemyComp =  enemy.getComponent(comp);
        this.enemyComp.correct = 1;
    },

    shootedPlayer() {
        this.player.getComponent('player').startShoot();
        // this.readyEnemy = true;
    },

    spawnCircle(pos, score) {
        var obj =cc.instantiate(this.circlePrefab);
        this.node.parent.addChild(obj);
        obj.position = pos;
        // var x;
        var comp = obj.getComponent('circle');
        comp.setScore(score);
        comp.play();
    },

    removeAnim: function (pos, type) {
        var coff = 1;
        if (pos.x < this.node.width / 2) {
            coff = -1;
        }
        var anim = this.spawnKilledAnim(type);
        this.node.parent.addChild(anim.node);
        anim.node.setPosition(pos);
        anim.node.setScale(coff, 1);
        anim.play();
    },

    spawnKilledAnim: function (type) {
        var fx;
        if (type == 'enemy') {
            if (this.killedEnemyPool.size() > 0) {
                fx = this.killedEnemyPool.get();
                return fx.getComponent('killed');
            } else {
                fx = cc.instantiate(this.killedAnim[0]).getComponent('killed');
                fx.init(this, type);
                return fx;
            }
        } else if (type == 'player') {
            if (this.killedPlayerPool.size() > 0) {
                fx = this.killedPlayerPool.get();
                return fx.getComponent('killed');
            } else {
                fx = cc.instantiate(this.killedAnim[1]).getComponent('killed');
                fx.init(this, type);
                return fx;
            }            
        }
    },
    despawnKilledAnim (anim, type) {
        if (type == 'enemy') {
            console.log('Anim');
            this.killedEnemyPool.put(anim);
        } else if (type == 'player') {
            this.killedPlayerPool.put(anim);
        }
    },


    // ********************** Recycle ********************************
    enemyHitedOK() {
        this.enemyHited = true;
    },

    playerNextStep() {
        var play = this.player.getComponent('player');
        var p = this.stairsPath[0];
        play.updatePos(p, this.stepH);
        this.createPhyCollider(this.stairsPath[1]);
        this.readyEnemy = false;
        if (this.enemyCnt == 5 && this.displayEnemyType != 'boss') {
            this.enemyHealthLayout.active = false;
            this.bossHealthLayout.active = true;
        }
    },

    readyPlayerShoot() {
        this.readyShooter = true;
        this.enemyHited = false;
        this.player.getComponent('player').shooterReady = true;
    },

    readyEnemyShoot() {
        this.readyShooter = false;
        
    },

    upgardMap() {
        var p = this.stairsPath.shift();
        var w_h = p.paths[0].y - this.stairsPath[0].paths[0].y;
        var move = cc.moveBy(0.3, 0, w_h);
        this.node.runAction(move);

        this.addMap();
        if (!this.hasEnemy) {
            this.spawnEnemy();
        } 
    },

    spawnBonus: function (pos, type) {
        var bonus;
        if (type == 0) {
            return;
        } else {
            bonus = cc.instantiate(this.bonusPrefab[type - 1]);
        }
        this.node.parent.addChild(bonus);

        bonus.getComponent('bonus').init(this);// bonus.init(this);
        bonus.position = pos;
        this.bonus.push(bonus);
    },

    addCoin: function() {
        this.coinScore ++;
        this.coinLabel.string = this.pad(this.coinScore, 3);
    },
    addLife: function() {
        if (this.lifeValue == 3)
            return;
        this.lifeValue ++;
        
        this.updateLifeDisplay();
    },
    deadLife: function() {
        console.log("deadLife");
        this.lifeValue --;
        if (this.lifeValue < 1) {
            console.log('GameOver');
            this.gameOver();
        } 
        this.updateLifeDisplay();
    },
    getBonus () {
        var n = this.bonus.length;
        var b_moveBouns = true;

        this.schedule(function() {
            if (this.bonus.length == 0 || b_moveBouns == false) {
                b_moveBouns = false;
                return;                
            }
            var b = this.bonus.pop();
            console.log('Move Bouns');
            b.getComponent('bonus').runMove();
        }, 0.1);

    },

    createPhyCollider(info) {
        var tmp = [];
        var coff = info.coff;
        var points = info.paths;
        var offset = points[0];
        for (var i = 0; i < points.length; i++) {
            tmp.push(cc.v2(points[i].x - offset.x,  points[i].y - offset.y));
        }
        var last = tmp[tmp.length - 1];
        tmp.push(cc.v2(last.x + this.stepH * coff, 0));
        tmp.push(cc.v2(0, 0));
        var c = this.node.getComponent(cc.PhysicsPolygonCollider);
        c.offset = offset;
        c.points = tmp;
        c.apply();
    },

    startGameLevel() {
        this.color = cc.color(73, 120, 228, 255);
        this.initGame();
        this.gameLevelLabel.string = "level " + this.level;
    },

    updateGameLevel() {
        this.level ++;
        this.startGameLevel();
    },

    putGun(gunNum, bullet_cnt) {
        this.bulletCntNode.active = true;
        this.player.getComponent('player').setGun(gunNum, bullet_cnt);
        this.updateGunCnt(bullet_cnt);
    },

    updateGunCnt(cnt) {
        this.bulletCntLabel.string = cnt; 
    },
    putOldGun() {
        this.bulletCntNode.active = false;
    },

    updateLifeDisplay() {
        for (var i = 0; i < 3; i++) {
            this.lifeImgNode[i].active = false;
        }
        console.log("LIFE:" + this.lifeValue);
        for (var i = 0; i < this.lifeValue; i++) {
            this.lifeImgNode[i].active = true;
        }
        
    },

    gameOver() {
        this.player.active = false;
    },

    updateScore(b_head) {
        var coff = (b_head) ? 2 : 1;
        this.gameScore += coff * this.level;
        this.gameScoreLabel.string = this.pad(this.gameScore, 5);
    },

    //. 000000 construct
    pad(a,b){
        return (1000000 + a + "").slice(-b) 
    },

    upgardeEnemyHealth() {
        if (this.enemyCnt < this.maxEnemy) {
            this.enemyHealthLayout.getComponent('enemyHealth').upgardeBar(this.enemyCnt);
        } 
    },

    upgardeBossHealth(init, now) {
        this.bossHealthLayout.getComponent('bossHealth').upgardeBar(init, now);
    }

});
