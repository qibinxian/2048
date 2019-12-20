// 2048

function GameStart(){
    this.Browser = Laya.Browser;
    this.WebGL = Laya.WebGL;
    this.Stage = Laya.Stage;
    this.Stat = Laya.Stat;
    this.Handler = Laya.Handler;
    this.Image = Laya.Image;
    this.Text = Laya.Text;
    this.Tween = Laya.Tween;
    
    // 不支持WebGL时自动切换至Canvas
    Laya.init(750, 1624, Laya.WebGL);
    //设置适配模式
    Laya.stage.scaleMode = "fixedwidth";
    //设置横竖屏
    Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
    //设置水平对齐
    Laya.stage.alignH = "center";
    //设置垂直对齐
    Laya.stage.alignV = "middle";
    this.loaded();

}
GameStart.prototype = {
    loaded : function(){
        this.loader = Laya.loader;
        this.loader.retryNum = 0;//无加载重试
        this.bg = 'image/gridbg.png';
        this.numall = 'image/numall.atlas';
        this.urls = ['image/num.jpg','image/sprite.png',this.bg,this.numall];
        this.loader.load(this.urls,this.Handler.create(this,this.onAssetloaded),this.Handler.create(this, this.onLoading, null, false));
    },
    onAssetloaded : function(){
        // var Clip = Laya.Clip;
        // var counter = new Clip(this.urls[0], 1, 10);
        // counter.autoPlay = true;
        // counter.interval = 1000;
        // Laya.stage.addChild(counter);

        // var clip = new Clip(this.urls[0], 1, 10);
        // // clip.index = clip.clipY - 1;
        // clip.index = 8;
        // clip.pos(50, 0);
        // Laya.stage.addChild(clip);//切片动画

        // var ape2 = new Laya.Sprite();
        // Laya.stage.addChild(ape2);
        // var ape2G = ape2.graphics;
        // ape2.pos(0,-85);
        // var ha = new Laya.HitArea();
        // ha.hit.drawRect(0,85,192,59, "#ff0000");
        // ape2.hitArea = ha;
        // ape2.on(Laya.Event.CLICK,this,function(){
        //     console.log(111)
        // })
        // ape2G.clipRect(0,85,192,59);
        // ape2G.drawTexture(Laya.loader.getRes(this.urls[1]), 0, 0);
        var Sprite = Laya.Sprite;
        this.box = new Sprite();
        Laya.stage.addChild(this.box);
        this.box.pos(Laya.stage.width / 2, Laya.stage.height / 2);

        this.bger = new Sprite();
        this.box.addChild(this.bger);
        this.bger.loadImage(this.bg);
        this.box.pivot(this.bger.width / 2,this.bger.height / 2);
        this.box.width = this.bger.width;
        this.box.height = this.bger.height;
        this.slideType = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onStratDrag);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onEndDrag);
        this.startGame();
        this.restart();
        this.withdraw();
        this.save();
        this.LoadMission();
    },
    restart : function(){
        this.restartBtn = new textBtn({
            fontSize : 30,
            width : 200,
            height : 50,
            leading : 10,
            bold : true,
            align : 'center',
            color : '#ffffff',
            x : 0,
            y : 20 ,
            overflow : Laya.Text.HIDDEN,
            text : '重新开始',
        },true)
        Laya.stage.addChild(this.restartBtn);
        this.restartBtn.on(Laya.Event.CLICK,this,function(){
            if (confirm("你确定重新开始游戏吗？")) { 
                this.startGame();
            } 
            else { } 
        })
    },
    withdraw : function(){
        this.withdrawBtn = new textBtn({
            fontSize : 30,
            width : 200,
            height : 50,
            leading : 10,
            bold : true,
            align : 'center',
            color : '#ffffff',
            x : 200,
            y : 20 ,
            overflow : Laya.Text.HIDDEN,
            text : '撤销',
        },true)
        Laya.stage.addChild(this.withdrawBtn);
        this.withdrawBtn.on(Laya.Event.CLICK,this,function(e){
            if(this.withdrawType){
                if (confirm("你确定撤销吗？")) { 
                    this.arrayInit = this.lastStepArray.dyadicCopy();
                    this.withdrawType = false;
                    this.box.removeChildren();
                    this.box.addChild(this.bger);
                    this.drawimg();
                } 
                else { } 
            }
            else{
                alert('注意游戏初始不可回退，且只可回推一次。');
            }
        })
    },
    save : function(){
        this.saveBtn = new textBtn({
            fontSize : 30,
            width : 200,
            height : 50,
            leading : 10,
            bold : true,
            align : 'center',
            color : '#ffffff',
            x : 0,
            y : 70 ,
            overflow : Laya.Text.HIDDEN,
            text : '保存进度',
        },true);
        Laya.stage.addChild(this.saveBtn);
        this.saveBtn.on(Laya.Event.CLICK,this,function(e){
            localStorage.setItem('game2048Data',this.arrayInit);
            alert('恭喜你，保存成功');
        })
    },
    LoadMission : function(){
        this.saveBtn = new textBtn({
            fontSize : 30,
            width : 200,
            height : 50,
            leading : 10,
            bold : true,
            align : 'center',
            color : '#ffffff',
            x : 200,
            y : 70 ,
            overflow : Laya.Text.HIDDEN,
            text : '读取进度',
        },true);
        Laya.stage.addChild(this.saveBtn);
        this.saveBtn.on(Laya.Event.CLICK,this,function(e){
            var mission = localStorage.getItem('game2048Data').split(',');
            if(mission){
                this.arrayInit = [];
                for(var i = 0;i < mission.length; i += 4){
                    this.arrayInit.push( mission.slice(i,i + 4) );
                }
                this.box.removeChildren();
                this.box.addChild(this.bger);
                this.drawimg();
            }else{
                alert('您未保存游戏进度');
            }
        })
    },
    startGame : function(){
        this.box.removeChildren();
        this.box.addChild(this.bger);
        this.lastStepArray = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];//上一步
        this.arrayInit = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];//数据数组
        this.arrObj = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];//对象列表
        this.width = this.arrayInit[0].length;
        this.height = this.arrayInit.length;

        this.dataLoad();//数据加载
        this.dataLoad();
        this.drawimg();
        this.withdrawType = false;
        console.log(this.arrayInit);
        console.log(this.lastStepArray);
        console.log(this.arrObj);
        console.log(this.box._children);
    },
    onStratDrag : function(e){
        this.startX = this.box.mouseX;
        this.startY = this.box.mouseY;
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                if(this.arrObj[i][j] != 0){
                    this.arrObj[i][j]._timer = 0;
                }
            }
        }
        this.lastStepArray = this.arrayInit.dyadicCopy();
    },
    onEndDrag : function(e){
        this.box.off(Laya.Event.MOUSE_DOWN,this,this.onStratDrag);
        this.box.off(Laya.Event.MOUSE_UP,this,this.onEndDrag);
        this.endX = this.box.mouseX;
        this.endY = this.box.mouseY;
        if(this.endX - this.startX > 0 && Math.abs(this.endX - this.startX) > Math.abs(this.endY - this.startY)){
            this.moveRight();
        }
        else if(this.endX - this.startX < 0 && Math.abs(this.endX - this.startX) > Math.abs(this.endY - this.startY)){
            this.moveLeft();
        }
        else if(this.endY - this.startY > 0 && Math.abs(this.endX - this.startX) < Math.abs(this.endY - this.startY)){
            this.moveDown();
        }
        else if(this.endY - this.startY < 0 && Math.abs(this.endX - this.startX) < Math.abs(this.endY - this.startY)){
            this.moveUp();
        }
    },
    changeNum : function(i1,j1,i2,j2,num){
        var timer = this.arrObj[i1][j1]._timer;
        this.arrObj[i1][j1].destroy();
        this.arrObj[i2][j2].destroy();
        this.arrObj[i2][j2] = 0;
        var img = new Laya.Image();
        img.skin = 'numall/num' + Math.log2(num) + '.png';
        this.box.addChild(img);
        img.pivot(77,77);
        img.x = 113 + j1 * 156;
        img.y = 108 + i1 * 156;
        this.arrObj[i1][j1] = img;
        Laya.timer.once(timer * 50,this, function(){
            this.Tween.to(img,{ scaleX : 1.2,scaleY : 1.2} , 80);
            Laya.timer.once(80, this, function(){
                this.Tween.to(img,{ scaleX : 1,scaleY : 1} , 80);
            });
        });
        // this.Tween.to(img,{ scaleX : 1.2,scaleY : 1.2} , 80);
        // Laya.timer.once(80, this, function(){
        //     this.Tween.to(img,{ scaleX : 1,scaleY : 1} , 80);
        // });
    },
    moveLeft : function(){
        this.slideType = false;
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                if(this.arrayInit[i][j] != 0){
                    var origin = 0;
                    for(var m = 0; m < j; m++){
                        if(this.arrayInit[i][m] == 0){
                            origin++;
                            this.slideType = true;
                        }
                    }
                    if(origin > 0){
                        this.arrayInit[i][j - origin] = this.arrayInit[i][j];
                        this.arrayInit[i][j] = 0;
                        this.arrObj[i][j - origin] = this.arrObj[i][j];
                        this.arrObj[i][j] = 0;
                        this.arrObj[i][j - origin]._timer = origin;
                        this.Tween.to(this.arrObj[i][j - origin], { x : 113 + (j - origin) * 156} ,50 * origin);
                    }
                }
            }
        }
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                if(this.arrayInit[i][j] != 0 && this.arrayInit[i][j] == this.arrayInit[i][j + 1] ){
                    this.slideType = true;
                    this.arrayInit[i][j] *= 2;
                    this.arrayInit[i].splice(j + 1,1);
                    this.arrayInit[i].push(0);
                    this.changeNum(i,j,i,j + 1,this.arrayInit[i][j]);
                    for(var m = j + 1; m < this.width - 1; m++){
                        this.arrObj[i][m] = this.arrObj[i][m + 1];
                        this.arrObj[i][m + 1] = 0;
                        if(this.arrObj[i][m] != 0){
                            this.Tween.to(this.arrObj[i][m],{ x : 113 + m * 156},(this.arrObj[i][m]._timer + 1) * 50);
                        }
                    }
                }
            }
        }
        this.move_over();
    },
    moveRight : function(){
        this.slideType = false;
        for(var i = 0; i < this.height; i++){
            for(var j = this.width - 1; j >= 0; j--){
                if(this.arrayInit[i][j] != 0){
                    var origin = 0;
                    for(var m = this.width - 1; m > j; m--){
                        if(this.arrayInit[i][m] == 0){
                            origin++;
                            this.slideType = true;
                        }
                    }
                    if(origin > 0){
                        this.arrayInit[i][j + origin] = this.arrayInit[i][j];
                        this.arrayInit[i][j] = 0;
                        this.arrObj[i][j + origin] = this.arrObj[i][j];
                        this.arrObj[i][j] = 0;
                        this.arrObj[i][j + origin]._timer = origin;
                        this.Tween.to(this.arrObj[i][j + origin], { x : 113 + (j + origin) * 156} , 50 * origin);
                    }
                }
            }
        }
        for(var i = 0; i < this.height; i++){
            for(var j = this.width - 1; j >= 0; j--){
                if(this.arrayInit[i][j] != 0 && this.arrayInit[i][j] == this.arrayInit[i][j - 1]){
                    this.slideType = true;
                    this.arrayInit[i][j] *= 2;
                    this.arrayInit[i].splice(j - 1,1);
                    this.arrayInit[i].unshift(0);
                    this.changeNum(i,j,i,j - 1,this.arrayInit[i][j]);
                    for(var m = j - 1; m > 0; m--){
                        this.arrObj[i][m] = this.arrObj[i][m - 1];
                        this.arrObj[i][m - 1] = 0;
                        if(this.arrObj[i][m] != 0){
                            this.Tween.to(this.arrObj[i][m], { x : 113 + m * 156},(this.arrObj[i][m]._timer + 1) * 50);
                        }
                    }
                }
            }
        }
        this.move_over();
    },
    moveDown : function(){
        this.slideType = false;
        for(var j = 0; j < this.width; j++){
            for(var i = this.height - 1; i >= 0; i--){
                if(this.arrayInit[i][j] != 0){
                    var origin = 0;
                    for(var m = this.height - 1; m > i; m--){
                        if(this.arrayInit[m][j] == 0){
                            this.slideType = true;
                            origin++;
                        }
                    }
                    if(origin > 0){
                        this.arrayInit[i + origin][j] = this.arrayInit[i][j];
                        this.arrayInit[i][j] = 0;
                        this.arrObj[i + origin][j] = this.arrObj[i][j];
                        this.arrObj[i][j] = 0;
                        this.arrObj[i + origin][j]._timer = origin;
                        this.Tween.to(this.arrObj[i + origin][j],{ y : 108 + (i + origin) * 156} , (this.arrObj[i + origin][j]._timer + 1) * 50);
                    }
                }
            }
        }
        for(var j = 0; j < this.width; j++){
            for(var i = this.height - 1; i > 0; i--){
                if(this.arrayInit[i][j] != 0 && this.arrayInit[i][j] == this.arrayInit[i - 1][j]){
                    this.slideType = true;
                    this.arrayInit[i][j] *= 2;
                    this.arrayInit[i - 1][j] = 0;
                    this.changeNum(i,j,i - 1,j,this.arrayInit[i][j]);
                    for(var m = i - 1; m >= 0; m--){
                        if(m == 0){
                            if(this.arrObj[m][j] != 0){
                                this.arrObj[m][j].destroy();
                            }
                            this.arrayInit[m][j] = 0;
                            this.arrObj[m][j] = 0;
                        }
                        else{
                            this.arrayInit[m][j] = this.arrayInit[m - 1][j];
                            this.arrayInit[m - 1][j] = 0;
                            this.arrObj[m][j] = this.arrObj[m - 1][j];
                            this.arrObj[m - 1][j] = 0;
                            if(this.arrObj[m][j] != 0){
                                this.Tween.to(this.arrObj[m][j],{ y : 108 + m * 156} , (this.arrObj[m][j]._timer + 1) * 50);
                            }
                        }
                    }
                }
            }
        }
        this.move_over();
    },
    moveUp : function(){
        this.slideType = false;
        for(var j = 0; j < this.width; j++){
            for(var i = 0; i < this.height; i++){
                if(this.arrayInit[i][j] != 0){
                    var origin = 0;
                    for(var m = 0; m < i; m++){
                        if(this.arrayInit[m][j] == 0){
                            this.slideType = true;
                            origin++;
                        }
                    }
                    if(origin > 0){
                        this.arrayInit[i - origin][j] = this.arrayInit[i][j];
                        this.arrayInit[i][j] = 0;
                        this.arrObj[i - origin][j] = this.arrObj[i][j];
                        this.arrObj[i][j] = 0;
                        this.arrObj[i - origin][j]._timer = origin;
                        this.Tween.to(this.arrObj[i - origin][j],{ y : 108 + (i - origin) * 156} , 50 * origin);
                    }
                }
            }
        }
        for(var j = 0; j < this.width; j++){
            for(var i = 0; i < this.height - 1; i++){
                if(this.arrayInit[i][j] != 0 && this.arrayInit[i][j] == this.arrayInit[i + 1][j]){
                    this.slideType = true;
                    this.arrayInit[i][j] *= 2;
                    this.arrayInit[i + 1][j] = 0;
                    this.changeNum(i,j,i + 1,j,this.arrayInit[i][j]);
                    for(var m = i + 1; m < this.height; m++){
                        if(m == this.height - 1){
                            if(this.arrObj[m][j] != 0){
                                this.arrObj[m][j].destroy();
                            }
                            this.arrayInit[m][j] = 0;
                            this.arrObj[m][j] = 0;
                        }
                        else{
                            this.arrayInit[m][j] = this.arrayInit[m + 1][j];
                            this.arrayInit[m + 1][j] = 0;
                            this.arrObj[m][j] = this.arrObj[m + 1][j];
                            this.arrObj[m + 1][j] = 0;
                            if(this.arrObj[m][j] != 0){
                                this.Tween.to(this.arrObj[m][j],{ y : 108 + m * 156} , (this.arrObj[m][j]._timer + 1) * 50);
                            }
                        }
                    }
                } 
            }
        }
        this.move_over();
    },
    move_over : function(){
        if(this.slideType){
            Laya.timer.once(180, this, function(){
                this.dataLoad(true);
            });
        }
    },
    drawimg : function(){
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                if(this.arrayInit[i][j] != 0){
                    this.drawOne(i,j);
                }
            }
        }
    },
    gameOver : function(){
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                if(this.arrayInit[i][j] == 0){
                    return false;
                }
                else if( (i != (this.height - 1) && (this.arrayInit[i][j] == this.arrayInit[i + 1][j]) )
                    || (j != (this.width - 1) && this.arrayInit[i][j] == this.arrayInit[i][j + 1]) ){
                    return false;
                }
                else if(i == this.height - 1 && j == this.width - 1){
                    return true;
                }
                else {
                    continue;
                }
            }
        }
    },
    drawOne : function(i,j){
        var img = new Laya.Image();
        img.skin = 'numall/num' + Math.log2(this.arrayInit[i][j]) + '.png';
        this.box.addChild(img);
        img.x = 113 + j * 156;
        img.y = 108 + i * 156;
        img.pivot(77,77);
        this.arrObj[i][j] = img;
        img.scaleX = 0;
        img.scaleY = 0;
        this.Tween.to(img,{ scaleX : 1,scaleY : 1} , 100);
    },
    dataLoad : function(type){
        var type = type || false;
        var point = this.obtainNum();
        var num = Math._rand(10,1);
        this.arrayInit[point.y][point.x] = num < 9 ? 2 : 4;
        if(type){
            this.withdrawType = true;
            this.drawOne(point.y,point.x);
            if(this.gameOver()){
                alert('游戏结束！');
                this.startGame();
            }
        }
    },
    obtainNum : function(){
        var voidr = [];
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                if(this.arrayInit[i][j] == 0){
                    voidr.push([i,j]);
                }
                // if(this.arrayInit[i][j] == 2048){
                //     alert('恭喜你获得2048');
                // }
            }
        }
        var num = Math._rand(voidr.length - 1,0);
        var point = {
            x : voidr[num][1],
            y : voidr[num][0]
        };
        return point;
    },
    onLoading :function(progress){
        console.log("加载进度: " + progress);
    }
}

new GameStart();
