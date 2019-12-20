/**
 * 
 * @private {num 数组求和函数 返回数组和};
 * @param {ij 可选参数 第一个为起点下标  第二个为终点下标}; 
 */
Array.prototype.sum = function(i,j){
    var i = i || 0;
    var j = j || this.length;
    var result = 0;
    for(i; i < j; i++){
        result += this[i];
    }
    return result;
}
/**
 * 
 * @private {log2 获取以2为底的对数};
 * @param {参数为必选项 对数函数的真数}; 
 */
Math.log2 = function(x){
    return  Math.round(Math.LOG2E * Math.log(x)); 
}

/**
 * 
 * @private {_rand 获取以范围内任意整数};
 * @param {参数为必选项 max最大值 min最小值}; 
 */
Math._rand = function(max,min){
    return parseInt(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @private {dyadicCopy 二维数组copy函数};
 * @param {}; 
 */
Array.prototype.dyadicCopy = function(){
    var dyadic = [];
    for(var i = 0; i < this.length; i++){
        var [...arr] = this[i];
        dyadic.push(arr);
    } 
    return dyadic;
}

/**
 * 
 * @private {文字按钮类 按钮本身阻止冒泡};
 * @param {config 文字参数配置 其中text为必填项 bubblType是否阻止事件冒泡}; 
 */
var textBtn = function(config,bubblType){
    this.config = config || {};
    this.bubblType = bubblType || false;
    this.setInfo();
    this.bubbling();
}
textBtn.prototype = new Laya.Text();

textBtn.prototype.setInfo = function(){
    this.fontSize = this.config.fontSize || this.fontSize;
    this.width = this.config.width || this.width;
    this.height = this.config.height || this.height;
    this.leading = this.config.leading || this.leading;
    this.bold = this.config.bold || this.bold;
    this.align = this.config.align || this.align;
    this.color = this.config.color || this.color;
    this.x = this.config.x || this.x;
    this.y = this.config.y || this.y;
    this.overflow = this.config.overflow || this.overflow;
    this.text = this.config.text;
}
textBtn.prototype.bubbling = function(){
    this.on(Laya.Event.MOUSE_DOWN,this,function(e){
        if(this.bubblType){
            e.stopPropagation();
        }
    });
    this.on(Laya.Event.MOUSE_UP,this,function(e){
        if(this.bubblType){
            e.stopPropagation();
        }
    });
    this.on(Laya.Event.CLICK,this,function(e){
        if(this.bubblType){
            e.stopPropagation();
        }
    });
}
