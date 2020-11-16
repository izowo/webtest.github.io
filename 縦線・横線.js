// 変数定義
var cs       = document.getElementById('myCanvas'),
    ctx      = cs.getContext('2d'),
    csWidth  = cs.width,
    csHeight = cs.height,
    center   = {
      x: csWidth / 2,
      y: csHeight / 2
    };

// 線の基本スタイル
ctx.strokeStyle = '#666';
ctx.lineWidth = 10;

var drawSlantLineAnimEase = function() {
  /**
   * イージング関数
   * http://gizma.com/easing/
   * @param  {[type]} t [経過時間（ミリ秒）]
   * @param  {[type]} b [初期値]
   * @param  {[type]} c [値の変化量、10->50なら40となる]
   * @param  {[type]} d [アニメーション時間（ミリ秒）]
   */
  var easeInQuad = function (t, b, c, d) {
    t /= d;
    return c*t*t + b;
  };

  var beginPos = {  // 開始座標
        x: 0,
        y: 0
      },
      movePos = {  // 移動座標（現在のxy座標）
        x: beginPos.x,
        y: beginPos.y
      },
      endPos = {  // 終了座標
        x: csWidth,
        y: csHeight
      },
      side = { // 移動する範囲の辺の長さ
        x: endPos.x - beginPos.x,
        y: endPos.y - beginPos.y
      },
      duration = 1000,  // アニメーション時間。最小でも300程度は取る
      beginTime = new Date().getTime(),
      // 経過時間
      getTime = function() {
        return (new Date().getTime() - beginTime);
      },
      isAnim = function() {
        // アニメーション時間が超えていないかどうか
        return getTime() < duration;
      };

  var render = function() {
    var draw = function() {
      ctx.clearRect(0, 0, csWidth, csHeight);
      ctx.beginPath();
      ctx.moveTo(beginPos.x, beginPos.y);
      ctx.lineTo(movePos.x, movePos.y);
      ctx.closePath();
      ctx.stroke();
    };

    if (isAnim() === true) {
      movePos.x = easeInQuad(getTime(), beginPos.x, side.x, duration);
      movePos.y = easeInQuad(getTime(), beginPos.y, side.y, duration);
      draw();
      requestAnimationFrame(render);
    } else {
      // 経過時間で条件を判断しているため、requestAnimationFrameだと微妙にずれる可能性がある
      // 足りない分を1回再描画して補う
      movePos.x = (isAnim() === false) ? endPos.x : movePos.x;
      movePos.y = (isAnim() === false) ? endPos.y : movePos.y;
      draw();
    }
  };
  render();
};
drawSlantLineAnimEase();