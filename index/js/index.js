/**
 * [description]
 * @return {[type]} [description]
 */
function Pingames(options) {
  this.options = options || {};
  this._init();
  this._handle();
}

Pingames.prototype = {
  _init: function () {             //生成文档里面的标签
    this.width = this.options.width;
    this.arry = [];
    var goTime, indexs, time;
    this.ul = document.createElement("ul");
    this.ul.style.width = this.width * this.options.row + "px";
    this.ul.style.height = this.width * this.options.col + "px";
    this.btn = document.createElement("button");
    this.btn.innerText = "开始游戏";
    var item;
    for (var i = 0; i < (this.options.row * this.options.col); i++) {
      item = document.createElement("li");
      item.innerText = i + 1;
      item.style.width = this.width + 'px';
      item.style.height = this.width + 'px';
      item.style.lineHeight = this.width + 'px';

      this.ul.appendChild(item);
      if (i < this.options.row) {
        for (var j = 0; j < this.options.col; j++) {
          this.arry.push([j * this.width, i * this.width]);
        }
      }
    }
    this.options.el.appendChild(this.ul);
    this.options.el.appendChild(this.btn);
    this.li = document.getElementsByTagName("li");

    //调整每个方块的位置
    for (var i = 0; i < this.li.length; i++) {
      this.li[i].style.top = this.arry[i][1] + "px";
      this.li[i].style.left = this.arry[i][0] + "px";
      this.li[i].index = i;
      this.li[i].setAttribute("coordinate", this.arry[i][1] + ":" + this.arry[i][0]);
    }
  },

  _handle: function () {
    var _that = this;
    _that.li = document.getElementsByTagName("li");
    _that.btn = document.getElementsByTagName("button")[0];
    //排序
    _that.btn.onclick = function () {
      if (this.innerText == "开始游戏") {
        var random = parseInt(Math.random() * _that.li.length);
        _that.li[random].id = "hidden";
        this.innerText = "停止排序";

        goTime = setInterval(function () {
          _that._autoSort();
        }, 100);
        //开始游戏
      } else if (this.innerText == "停止排序") {
        var $this = this;
        clearInterval(goTime);
        for (var i = 0; i < _that.li.length; i++) {
          _that.li[i].onclick = function () {
            var hidden = document.getElementById("hidden");
            thisTop = parseInt(this.style.top),
              thisLeft = parseInt(this.style.left),
              hTop = parseInt(hidden.style.top),
              hLeft = parseInt(hidden.style.left);
            if ((hTop == thisTop && (hLeft == thisLeft + _that.width || hLeft == thisLeft - _that.width)) ||
              (hLeft == thisLeft && (hTop == thisTop + _that.width || hTop == thisTop - _that.width))) {
              _that._transposit(hidden, hTop, hLeft, this, thisTop, thisLeft);
              _that._resule();
            }
          }
        }
        var sected = _that.options.time || 30;
        time = window.setInterval(function () {
          sected--;
          $this.innerText = "倒计时" + (sected < 10 ? "0" + sected : sected) + "s结束";
          if (!sected) {
            clearInterval(time);
            $this.innerText = "挑战失败";
            $this.style.backgroundColor = "red";
            setTimeout(function () {
              document.getElementById("hidden").id = "";
            }, 500);
          }
        }, 1000);
      } else if (this.innerText == "挑战成功" || this.innerText == "挑战失败") {
        this.innerText = "开始游戏";
        this.style.backgroundColor = "rgba(86, 81, 81, .7)";
      }
    }
  },
  // 交换位置
  _transposit: function (hidden, hTop, hLeft, targets, tarTop, tarLtft) {
    targets.style.top = hTop + "px";
    targets.style.left = hLeft + "px";
    hidden.style.top = tarTop + "px";
    hidden.style.left = tarLtft + "px";
  },
  //排序
  _autoSort: function () {
    var _this = this;
    var hidden = document.getElementById("hidden"),
      list = document.getElementsByTagName("li"),
      top = parseInt(hidden.style.top),
      left = parseInt(hidden.style.left),
      result = [];
    for (var i = 0; i < list.length; i++) {
      var liTop = parseInt(list[i].style.top),
        liLeft = parseInt(list[i].style.left);
      if (liTop == top && (liLeft == left + _this.width || liLeft == left - _this.width) || liLeft == left && (liTop == top + _this.width || liTop == top - _this.width)) {
        result.push([list[i].index, liTop, liLeft, i]);//(注：result里面只存储两组数据)
      }
      ;

    }
    ;
    if (result.length != 0) {
      var num = parseInt(Math.random() * result.length);
      var index = result[num][0];
      if (index == _this.indexs) {
        _this._autoSort();   //递归
      } else {
        _this._transposit(hidden, top, left, list[result[num][3]], result[num][1], result[num][2]);
        _this.indexs = index;
      }
    }
  },
  //判断最后结果
  _resule: function () {
    var reslut = 0;
    for (var j = 0; j < this.li.length; j++) {
      if (parseInt(this.li[j].style.top) == this.li[j].getAttribute("coordinate").split(":")[0] && parseInt(this.li[j].style.left) == this.li[j].getAttribute("coordinate").split(":")[1]) {
        reslut++
      }
    }
    if (reslut == 9) {
      window.clearInterval(time);
      this.btn.innerHTML = "挑战成功";
      setTimeout(function () {
        document.getElementById("hidden").id = "";
      }, 500);
    }
  }

};


 
