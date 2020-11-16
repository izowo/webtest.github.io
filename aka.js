
var cs       = document.getElementById('myCanvas'),
    ctx      = cs.getContext('2d'),
    csWidth  = cs.width,
    csHeight = cs.height,
    center   = {
      x: csWidth / 2,
      y: csHeight / 2
    };

// 線の共通スタイル
ctx.strokeStyle = '#000';
ctx.lineWidth   = 3;
ctx.lineJoin    = 'round';


var Graph = function(arg) {
  this.initialize(arg);
  /* 共通の静的プロパティ */
  this.moveLength = 0;
  this.addLength  = 20;
  this.isAnim     = function() {
    return (this.moveLength < this.hypotenuse);
  };
};

(function (p) {
  /**
   * インスタンスごとの初期設定
   * @param  {array.obj} arg [beginPos.x, beginPos.y, endPos.x, endPos.y]
   */
  p.initialize = function(arg) {
    this.dfd = $.Deferred();
    // 左右に線が引かれるので位置に注意
    this.beginPos = {
      x: arg.beginPos.x,
      y: arg.beginPos.y
    };
    this.movePos = {
      x: arg.beginPos.x,
      y: arg.beginPos.y
    };
    this.endPos = {
      x: arg.endPos.x,
      y: arg.endPos.y
    };
    this.side = {
      x: this.endPos.x - this.beginPos.x,
      y: this.endPos.y - this.beginPos.y
    };
    this.hypotenuse = Math.sqrt(Math.pow(this.side.x, 2) + Math.pow(this.side.y, 2));
    this.radian = Math.atan2(this.side.y, this.side.x);
  };
  p.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.beginPos.x, this.beginPos.y);
    ctx.lineTo(this.movePos.x, this.movePos.y);
    ctx.closePath();
    ctx.stroke();
  };
  p.update = function() {
    this.moveLength += this.addLength;
    this.movePos.x += Math.cos(this.radian) * this.addLength;
    this.movePos.y += Math.sin(this.radian) * this.addLength;
  };
  p.render = function() {
    this.draw();
    if (this.isAnim() === true) {
      this.update();
      this.movePos.x = (this.isAnim() === false) ? this.endPos.x : this.movePos.x;
      this.movePos.y = (this.isAnim() === false) ? this.endPos.y : this.movePos.y;
      requestAnimationFrame(this.render.bind(this));
    } else {
      // アニメーションが完了したら通知する
      this.dfd.resolve();
    }
    return this.dfd.promise();
  };
})(Graph.prototype);





// 以降、グラフインスタンスの生成とレンダリング


function Add(){

if(document.fm.riyu.checked){
 ctx.clearRect(0, 0, csWidth, csHeight);
}

var pol=Number(document.fm.A.value)
var r=csWidth-10
var step=Number(document.fm.B.value)
var graphData = [];
document.fm.C.value = 180*pol-360*step

for (i = 0; i < pol; i++) {
	P = r/2
	Q = r/2 - r/2

graphData.push(
  {
    beginPos: { x: (P-r/2)*(Math.cos(2*i*step*Math.PI/pol)) - (Q-r/2)*(Math.sin(2*i*step*Math.PI/pol))+r/2, y: (P-r/2)*(Math.sin(2*i*step*Math.PI/pol)) + (Q-r/2)*(Math.cos(2*i*step*Math.PI/pol))+r/2},
    endPos:   { x: (P-r/2)*(Math.cos(2*(i+1)*step*Math.PI/pol)) - (Q-r/2)*(Math.sin(2*(i+1)*step*Math.PI/pol))+r/2, y: (P-r/2)*(Math.sin(2*(i+1)*step*Math.PI/pol)) + (Q-r/2)*(Math.cos(2*(i+1)*step*Math.PI/pol))+r/2}
  });

 };



var graphObj = {},
    i = 0,
    j = 0,
    l = graphData.length;
for (; i < l; i++) {
  graphObj[i] = new Graph(graphData[i]);
}

var d = (new $.Deferred()).resolve();
$.each(graphObj, function(i, obj){
  d = d.then(function() {
    return obj.render();
  });
});

}
