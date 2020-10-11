/**
 * Modified from the original Codepen:
 * https://codepen.io/tmrDevelops/pen/PPgjwz
 */

$(document).ready(function () {

  var c = $('#snowCanvas').get(0);
  var ctx = c.getContext('2d');
  var w = c.width = $('#app').innerWidth();
  var h = c.height = window.innerHeight - ($('header').innerHeight() + $('footer').innerHeight());
  var bg = '#181423';

  function Snowfall() {

    var snow, arr = [];
    var num = 100, tsc = 1, sp = 1;
    var sc = 1.3, t = 0, mv = 20, min = 1;

    for (var i = 0; i < num; ++i) {
      snow = new Flake();
      snow.y = Math.random() * (h + 50);
      snow.x = Math.random() * w;
      snow.t = Math.random() * (Math.PI * 2);
      snow.sz = (100 / (10 + (Math.random() * 100))) * sc;
      snow.sp = (Math.pow(snow.sz * .8, 2) * .15) * sp;
      snow.sp = snow.sp < min ? min : snow.sp;
      arr.push(snow);
    }

    go();

    function go() {

      window.requestAnimationFrame(go);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fill();

      for (var i = 0; i < arr.length; ++i) {
        f = arr[i];
        f.t += .05;
        f.t = f.t >= (Math.PI * 2) ? 0 : f.t;
        f.y += f.sp;
        f.x += Math.sin(f.t * tsc) * (f.sz * .3);
        if (f.y > h + 50) f.y = -10 - Math.random() * mv;
        if (f.x > w + mv) f.x = -mv;
        if (f.x < -mv) f.x = w + mv;
        f.draw();
      }
    }

    function Flake() {
      this.draw = function () {
        this.g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
        this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
        this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
        ctx.moveTo(this.x, this.y);
        ctx.fillStyle = this.g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }
  }

  /**
   * Taken from this article:
   * https://davidwalsh.name/javascript-debounce-function
   */
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  window.addEventListener('resize', debounce(function () {
    c.width = w = c.width = $('#app').innerWidth();
    c.height = h = window.innerHeight - ($('header').innerHeight() + $('footer').innerHeight());
    Snowfall();
  }, 250));

  Snowfall();
});
