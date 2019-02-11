/*!
 * @license CreateJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011-2015 gskinner.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
this.createjs = this.createjs || {}, createjs.extend = function(a, b) {
    "use strict";

    function c() {
      this.constructor = a
    }
    return c.prototype = b.prototype, a.prototype = new c
  }, this.createjs = this.createjs || {}, createjs.promote = function(a, b) {
    "use strict";
    var c = a.prototype,
      d = Object.getPrototypeOf && Object.getPrototypeOf(c) || c.__proto__;
    if (d) {
      c[(b += "_") + "constructor"] = d.constructor;
      for (var e in d) c.hasOwnProperty(e) && "function" == typeof d[e] && (c[b + e] = d[e])
    }
    return a
  }, this.createjs = this.createjs || {}, createjs.indexOf = function(a, b) {
    "use strict";
    for (var c = 0, d = a.length; d > c; c++)
      if (b === a[c]) return c;
    return -1
  }, this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.type = a, this.target = null, this.currentTarget = null, this.eventPhase = 0, this.bubbles = !!b, this.cancelable = !!c, this.timeStamp = (new Date).getTime(), this.defaultPrevented = !1, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.removed = !1
    }
    var b = a.prototype;
    b.preventDefault = function() {
      this.defaultPrevented = this.cancelable && !0
    }, b.stopPropagation = function() {
      this.propagationStopped = !0
    }, b.stopImmediatePropagation = function() {
      this.immediatePropagationStopped = this.propagationStopped = !0
    }, b.remove = function() {
      this.removed = !0
    }, b.clone = function() {
      return new a(this.type, this.bubbles, this.cancelable)
    }, b.set = function(a) {
      for (var b in a) this[b] = a[b];
      return this
    }, b.toString = function() {
      return "[Event (type=" + this.type + ")]"
    }, createjs.Event = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this._listeners = null, this._captureListeners = null
    }
    var b = a.prototype;
    a.initialize = function(a) {
      a.addEventListener = b.addEventListener, a.on = b.on, a.removeEventListener = a.off = b.removeEventListener, a.removeAllEventListeners = b.removeAllEventListeners, a.hasEventListener = b.hasEventListener, a.dispatchEvent = b.dispatchEvent, a._dispatchEvent = b._dispatchEvent, a.willTrigger = b.willTrigger
    }, b.addEventListener = function(a, b, c) {
      var d;
      d = c ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
      var e = d[a];
      return e && this.removeEventListener(a, b, c), e = d[a], e ? e.push(b) : d[a] = [b], b
    }, b.on = function(a, b, c, d, e, f) {
      return b.handleEvent && (c = c || b, b = b.handleEvent), c = c || this, this.addEventListener(a, function(a) {
        b.call(c, a, e), d && a.remove()
      }, f)
    }, b.removeEventListener = function(a, b, c) {
      var d = c ? this._captureListeners : this._listeners;
      if (d) {
        var e = d[a];
        if (e)
          for (var f = 0, g = e.length; g > f; f++)
            if (e[f] == b) {
              1 == g ? delete d[a] : e.splice(f, 1);
              break
            }
      }
    }, b.off = b.removeEventListener, b.removeAllEventListeners = function(a) {
      a ? (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
    }, b.dispatchEvent = function(a, b, c) {
      if ("string" == typeof a) {
        var d = this._listeners;
        if (!(b || d && d[a])) return !0;
        a = new createjs.Event(a, b, c)
      } else a.target && a.clone && (a = a.clone());
      try {
        a.target = this
      } catch (e) {}
      if (a.bubbles && this.parent) {
        for (var f = this, g = [f]; f.parent;) g.push(f = f.parent);
        var h, i = g.length;
        for (h = i - 1; h >= 0 && !a.propagationStopped; h--) g[h]._dispatchEvent(a, 1 + (0 == h));
        for (h = 1; i > h && !a.propagationStopped; h++) g[h]._dispatchEvent(a, 3)
      } else this._dispatchEvent(a, 2);
      return !a.defaultPrevented
    }, b.hasEventListener = function(a) {
      var b = this._listeners,
        c = this._captureListeners;
      return !!(b && b[a] || c && c[a])
    }, b.willTrigger = function(a) {
      for (var b = this; b;) {
        if (b.hasEventListener(a)) return !0;
        b = b.parent
      }
      return !1
    }, b.toString = function() {
      return "[EventDispatcher]"
    }, b._dispatchEvent = function(a, b) {
      var c, d = 1 == b ? this._captureListeners : this._listeners;
      if (a && d) {
        var e = d[a.type];
        if (!e || !(c = e.length)) return;
        try {
          a.currentTarget = this
        } catch (f) {}
        try {
          a.eventPhase = b
        } catch (f) {}
        a.removed = !1, e = e.slice();
        for (var g = 0; c > g && !a.immediatePropagationStopped; g++) {
          var h = e[g];
          h.handleEvent ? h.handleEvent(a) : h(a), a.removed && (this.off(a.type, h, 1 == b), a.removed = !1)
        }
      }
    }, createjs.EventDispatcher = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "Ticker cannot be instantiated."
    }
    a.RAF_SYNCHED = "synched", a.RAF = "raf", a.TIMEOUT = "timeout", a.useRAF = !1, a.timingMode = null, a.maxDelta = 0, a.paused = !1, a.removeEventListener = null, a.removeAllEventListeners = null, a.dispatchEvent = null, a.hasEventListener = null, a._listeners = null, createjs.EventDispatcher.initialize(a), a._addEventListener = a.addEventListener, a.addEventListener = function() {
      return !a._inited && a.init(), a._addEventListener.apply(a, arguments)
    }, a._inited = !1, a._startTime = 0, a._pausedTime = 0, a._ticks = 0, a._pausedTicks = 0, a._interval = 50, a._lastTime = 0, a._times = null, a._tickTimes = null, a._timerId = null, a._raf = !0, a.setInterval = function(b) {
      a._interval = b, a._inited && a._setupTick()
    }, a.getInterval = function() {
      return a._interval
    }, a.setFPS = function(b) {
      a.setInterval(1e3 / b)
    }, a.getFPS = function() {
      return 1e3 / a._interval
    };
    try {
      Object.defineProperties(a, {
        interval: {
          get: a.getInterval,
          set: a.setInterval
        },
        framerate: {
          get: a.getFPS,
          set: a.setFPS
        }
      })
    } catch (b) {
      console.log(b)
    }
    a.init = function() {
      a._inited || (a._inited = !0, a._times = [], a._tickTimes = [], a._startTime = a._getTime(), a._times.push(a._lastTime = 0), a.interval = a._interval)
    }, a.reset = function() {
      if (a._raf) {
        var b = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
        b && b(a._timerId)
      } else clearTimeout(a._timerId);
      a.removeAllEventListeners("tick"), a._timerId = a._times = a._tickTimes = null, a._startTime = a._lastTime = a._ticks = 0, a._inited = !1
    }, a.getMeasuredTickTime = function(b) {
      var c = 0,
        d = a._tickTimes;
      if (!d || d.length < 1) return -1;
      b = Math.min(d.length, b || 0 | a.getFPS());
      for (var e = 0; b > e; e++) c += d[e];
      return c / b
    }, a.getMeasuredFPS = function(b) {
      var c = a._times;
      return !c || c.length < 2 ? -1 : (b = Math.min(c.length - 1, b || 0 | a.getFPS()), 1e3 / ((c[0] - c[b]) / b))
    }, a.setPaused = function(b) {
      a.paused = b
    }, a.getPaused = function() {
      return a.paused
    }, a.getTime = function(b) {
      return a._startTime ? a._getTime() - (b ? a._pausedTime : 0) : -1
    }, a.getEventTime = function(b) {
      return a._startTime ? (a._lastTime || a._startTime) - (b ? a._pausedTime : 0) : -1
    }, a.getTicks = function(b) {
      return a._ticks - (b ? a._pausedTicks : 0)
    }, a._handleSynch = function() {
      a._timerId = null, a._setupTick(), a._getTime() - a._lastTime >= .97 * (a._interval - 1) && a._tick()
    }, a._handleRAF = function() {
      a._timerId = null, a._setupTick(), a._tick()
    }, a._handleTimeout = function() {
      a._timerId = null, a._setupTick(), a._tick()
    }, a._setupTick = function() {
      if (null == a._timerId) {
        var b = a.timingMode || a.useRAF && a.RAF_SYNCHED;
        if (b == a.RAF_SYNCHED || b == a.RAF) {
          var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
          if (c) return a._timerId = c(b == a.RAF ? a._handleRAF : a._handleSynch), void(a._raf = !0)
        }
        a._raf = !1, a._timerId = setTimeout(a._handleTimeout, a._interval)
      }
    }, a._tick = function() {
      var b = a.paused,
        c = a._getTime(),
        d = c - a._lastTime;
      if (a._lastTime = c, a._ticks++, b && (a._pausedTicks++, a._pausedTime += d), a.hasEventListener("tick")) {
        var e = new createjs.Event("tick"),
          f = a.maxDelta;
        e.delta = f && d > f ? f : d, e.paused = b, e.time = c, e.runTime = c - a._pausedTime, a.dispatchEvent(e)
      }
      for (a._tickTimes.unshift(a._getTime() - c); a._tickTimes.length > 100;) a._tickTimes.pop();
      for (a._times.unshift(c); a._times.length > 100;) a._times.pop()
    };
    var c = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
    a._getTime = function() {
      return (c && c.call(performance) || (new Date).getTime()) - a._startTime
    }, createjs.Ticker = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "UID cannot be instantiated"
    }
    a._nextID = 0, a.get = function() {
      return a._nextID++
    }, createjs.UID = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d, e, f, g, h, i, j, k) {
      this.Event_constructor(a, b, c), this.stageX = d, this.stageY = e, this.rawX = null == i ? d : i, this.rawY = null == j ? e : j, this.nativeEvent = f, this.pointerID = g, this.primary = !!h, this.relatedTarget = k
    }
    var b = createjs.extend(a, createjs.Event);
    b._get_localX = function() {
      return this.currentTarget.globalToLocal(this.rawX, this.rawY).x
    }, b._get_localY = function() {
      return this.currentTarget.globalToLocal(this.rawX, this.rawY).y
    }, b._get_isTouch = function() {
      return -1 !== this.pointerID
    };
    try {
      Object.defineProperties(b, {
        localX: {
          get: b._get_localX
        },
        localY: {
          get: b._get_localY
        },
        isTouch: {
          get: b._get_isTouch
        }
      })
    } catch (c) {}
    b.clone = function() {
      return new a(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
    }, b.toString = function() {
      return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
    }, createjs.MouseEvent = createjs.promote(a, "Event")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d, e, f) {
      this.setValues(a, b, c, d, e, f)
    }
    var b = a.prototype;
    a.DEG_TO_RAD = Math.PI / 180, a.identity = null, b.setValues = function(a, b, c, d, e, f) {
      return this.a = null == a ? 1 : a, this.b = b || 0, this.c = c || 0, this.d = null == d ? 1 : d, this.tx = e || 0, this.ty = f || 0, this
    }, b.append = function(a, b, c, d, e, f) {
      var g = this.a,
        h = this.b,
        i = this.c,
        j = this.d;
      return (1 != a || 0 != b || 0 != c || 1 != d) && (this.a = g * a + i * b, this.b = h * a + j * b, this.c = g * c + i * d, this.d = h * c + j * d), this.tx = g * e + i * f + this.tx, this.ty = h * e + j * f + this.ty, this
    }, b.prepend = function(a, b, c, d, e, f) {
      var g = this.a,
        h = this.c,
        i = this.tx;
      return this.a = a * g + c * this.b, this.b = b * g + d * this.b, this.c = a * h + c * this.d, this.d = b * h + d * this.d, this.tx = a * i + c * this.ty + e, this.ty = b * i + d * this.ty + f, this
    }, b.appendMatrix = function(a) {
      return this.append(a.a, a.b, a.c, a.d, a.tx, a.ty)
    }, b.prependMatrix = function(a) {
      return this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty)
    }, b.appendTransform = function(b, c, d, e, f, g, h, i, j) {
      if (f % 360) var k = f * a.DEG_TO_RAD,
        l = Math.cos(k),
        m = Math.sin(k);
      else l = 1, m = 0;
      return g || h ? (g *= a.DEG_TO_RAD, h *= a.DEG_TO_RAD, this.append(Math.cos(h), Math.sin(h), -Math.sin(g), Math.cos(g), b, c), this.append(l * d, m * d, -m * e, l * e, 0, 0)) : this.append(l * d, m * d, -m * e, l * e, b, c), (i || j) && (this.tx -= i * this.a + j * this.c, this.ty -= i * this.b + j * this.d), this
    }, b.prependTransform = function(b, c, d, e, f, g, h, i, j) {
      if (f % 360) var k = f * a.DEG_TO_RAD,
        l = Math.cos(k),
        m = Math.sin(k);
      else l = 1, m = 0;
      return (i || j) && (this.tx -= i, this.ty -= j), g || h ? (g *= a.DEG_TO_RAD, h *= a.DEG_TO_RAD, this.prepend(l * d, m * d, -m * e, l * e, 0, 0), this.prepend(Math.cos(h), Math.sin(h), -Math.sin(g), Math.cos(g), b, c)) : this.prepend(l * d, m * d, -m * e, l * e, b, c), this
    }, b.rotate = function(b) {
      b *= a.DEG_TO_RAD;
      var c = Math.cos(b),
        d = Math.sin(b),
        e = this.a,
        f = this.b;
      return this.a = e * c + this.c * d, this.b = f * c + this.d * d, this.c = -e * d + this.c * c, this.d = -f * d + this.d * c, this
    }, b.skew = function(b, c) {
      return b *= a.DEG_TO_RAD, c *= a.DEG_TO_RAD, this.append(Math.cos(c), Math.sin(c), -Math.sin(b), Math.cos(b), 0, 0), this
    }, b.scale = function(a, b) {
      return this.a *= a, this.b *= a, this.c *= b, this.d *= b, this
    }, b.translate = function(a, b) {
      return this.tx += this.a * a + this.c * b, this.ty += this.b * a + this.d * b, this
    }, b.identity = function() {
      return this.a = this.d = 1, this.b = this.c = this.tx = this.ty = 0, this
    }, b.invert = function() {
      var a = this.a,
        b = this.b,
        c = this.c,
        d = this.d,
        e = this.tx,
        f = a * d - b * c;
      return this.a = d / f, this.b = -b / f, this.c = -c / f, this.d = a / f, this.tx = (c * this.ty - d * e) / f, this.ty = -(a * this.ty - b * e) / f, this
    }, b.isIdentity = function() {
      return 0 === this.tx && 0 === this.ty && 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d
    }, b.equals = function(a) {
      return this.tx === a.tx && this.ty === a.ty && this.a === a.a && this.b === a.b && this.c === a.c && this.d === a.d
    }, b.transformPoint = function(a, b, c) {
      return c = c || {}, c.x = a * this.a + b * this.c + this.tx, c.y = a * this.b + b * this.d + this.ty, c
    }, b.decompose = function(b) {
      null == b && (b = {}), b.x = this.tx, b.y = this.ty, b.scaleX = Math.sqrt(this.a * this.a + this.b * this.b), b.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
      var c = Math.atan2(-this.c, this.d),
        d = Math.atan2(this.b, this.a),
        e = Math.abs(1 - c / d);
      return 1e-5 > e ? (b.rotation = d / a.DEG_TO_RAD, this.a < 0 && this.d >= 0 && (b.rotation += b.rotation <= 0 ? 180 : -180), b.skewX = b.skewY = 0) : (b.skewX = c / a.DEG_TO_RAD, b.skewY = d / a.DEG_TO_RAD), b
    }, b.copy = function(a) {
      return this.setValues(a.a, a.b, a.c, a.d, a.tx, a.ty)
    }, b.clone = function() {
      return new a(this.a, this.b, this.c, this.d, this.tx, this.ty)
    }, b.toString = function() {
      return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
    }, a.identity = new a, createjs.Matrix2D = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d, e) {
      this.setValues(a, b, c, d, e)
    }
    var b = a.prototype;
    b.setValues = function(a, b, c, d, e) {
      return this.visible = null == a ? !0 : !!a, this.alpha = null == b ? 1 : b, this.shadow = c, this.compositeOperation = d, this.matrix = e || this.matrix && this.matrix.identity() || new createjs.Matrix2D, this
    }, b.append = function(a, b, c, d, e) {
      return this.alpha *= b, this.shadow = c || this.shadow, this.compositeOperation = d || this.compositeOperation, this.visible = this.visible && a, e && this.matrix.appendMatrix(e), this
    }, b.prepend = function(a, b, c, d, e) {
      return this.alpha *= b, this.shadow = this.shadow || c, this.compositeOperation = this.compositeOperation || d, this.visible = this.visible && a, e && this.matrix.prependMatrix(e), this
    }, b.identity = function() {
      return this.visible = !0, this.alpha = 1, this.shadow = this.compositeOperation = null, this.matrix.identity(), this
    }, b.clone = function() {
      return new a(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone())
    }, createjs.DisplayProps = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.setValues(a, b)
    }
    var b = a.prototype;
    b.setValues = function(a, b) {
      return this.x = a || 0, this.y = b || 0, this
    }, b.copy = function(a) {
      return this.x = a.x, this.y = a.y, this
    }, b.clone = function() {
      return new a(this.x, this.y)
    }, b.toString = function() {
      return "[Point (x=" + this.x + " y=" + this.y + ")]"
    }, createjs.Point = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d) {
      this.setValues(a, b, c, d)
    }
    var b = a.prototype;
    b.setValues = function(a, b, c, d) {
      return this.x = a || 0, this.y = b || 0, this.width = c || 0, this.height = d || 0, this
    }, b.extend = function(a, b, c, d) {
      return c = c || 0, d = d || 0, a + c > this.x + this.width && (this.width = a + c - this.x), b + d > this.y + this.height && (this.height = b + d - this.y), a < this.x && (this.width += this.x - a, this.x = a), b < this.y && (this.height += this.y - b, this.y = b), this
    }, b.pad = function(a, b, c, d) {
      return this.x -= b, this.y -= a, this.width += b + d, this.height += a + c, this
    }, b.copy = function(a) {
      return this.setValues(a.x, a.y, a.width, a.height)
    }, b.contains = function(a, b, c, d) {
      return c = c || 0, d = d || 0, a >= this.x && a + c <= this.x + this.width && b >= this.y && b + d <= this.y + this.height
    }, b.union = function(a) {
      return this.clone().extend(a.x, a.y, a.width, a.height)
    }, b.intersection = function(b) {
      var c = b.x,
        d = b.y,
        e = c + b.width,
        f = d + b.height;
      return this.x > c && (c = this.x), this.y > d && (d = this.y), this.x + this.width < e && (e = this.x + this.width), this.y + this.height < f && (f = this.y + this.height), c >= e || d >= f ? null : new a(c, d, e - c, f - d)
    }, b.intersects = function(a) {
      return a.x <= this.x + this.width && this.x <= a.x + a.width && a.y <= this.y + this.height && this.y <= a.y + a.height
    }, b.isEmpty = function() {
      return this.width <= 0 || this.height <= 0
    }, b.clone = function() {
      return new a(this.x, this.y, this.width, this.height)
    }, b.toString = function() {
      return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
    }, createjs.Rectangle = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d, e, f, g) {
      a.addEventListener && (this.target = a, this.overLabel = null == c ? "over" : c, this.outLabel = null == b ? "out" : b, this.downLabel = null == d ? "down" : d, this.play = e, this._isPressed = !1, this._isOver = !1, this._enabled = !1, a.mouseChildren = !1, this.enabled = !0, this.handleEvent({}), f && (g && (f.actionsEnabled = !1, f.gotoAndStop && f.gotoAndStop(g)), a.hitArea = f))
    }
    var b = a.prototype;
    b.setEnabled = function(a) {
      if (a != this._enabled) {
        var b = this.target;
        this._enabled = a, a ? (b.cursor = "pointer", b.addEventListener("rollover", this), b.addEventListener("rollout", this), b.addEventListener("mousedown", this), b.addEventListener("pressup", this), b._reset && (b.__reset = b._reset, b._reset = this._reset)) : (b.cursor = null, b.removeEventListener("rollover", this), b.removeEventListener("rollout", this), b.removeEventListener("mousedown", this), b.removeEventListener("pressup", this), b.__reset && (b._reset = b.__reset, delete b.__reset))
      }
    }, b.getEnabled = function() {
      return this._enabled
    };
    try {
      Object.defineProperties(b, {
        enabled: {
          get: b.getEnabled,
          set: b.setEnabled
        }
      })
    } catch (c) {}
    b.toString = function() {
      return "[ButtonHelper]"
    }, b.handleEvent = function(a) {
      var b, c = this.target,
        d = a.type;
      "mousedown" == d ? (this._isPressed = !0, b = this.downLabel) : "pressup" == d ? (this._isPressed = !1, b = this._isOver ? this.overLabel : this.outLabel) : "rollover" == d ? (this._isOver = !0, b = this._isPressed ? this.downLabel : this.overLabel) : (this._isOver = !1, b = this._isPressed ? this.overLabel : this.outLabel), this.play ? c.gotoAndPlay && c.gotoAndPlay(b) : c.gotoAndStop && c.gotoAndStop(b)
    }, b._reset = function() {
      var a = this.paused;
      this.__reset(), this.paused = a
    }, createjs.ButtonHelper = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d) {
      this.color = a || "black", this.offsetX = b || 0, this.offsetY = c || 0, this.blur = d || 0
    }
    var b = a.prototype;
    a.identity = new a("transparent", 0, 0, 0), b.toString = function() {
      return "[Shadow]"
    }, b.clone = function() {
      return new a(this.color, this.offsetX, this.offsetY, this.blur)
    }, createjs.Shadow = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.EventDispatcher_constructor(), this.complete = !0, this.framerate = 0, this._animations = null, this._frames = null, this._images = null, this._data = null, this._loadCount = 0, this._frameHeight = 0, this._frameWidth = 0, this._numFrames = 0, this._regX = 0, this._regY = 0, this._spacing = 0, this._margin = 0, this._parseData(a)
    }
    var b = createjs.extend(a, createjs.EventDispatcher);
    b.getAnimations = function() {
      return this._animations.slice()
    };
    try {
      Object.defineProperties(b, {
        animations: {
          get: b.getAnimations
        }
      })
    } catch (c) {}
    b.getNumFrames = function(a) {
      if (null == a) return this._frames ? this._frames.length : this._numFrames || 0;
      var b = this._data[a];
      return null == b ? 0 : b.frames.length
    }, b.getAnimation = function(a) {
      return this._data[a]
    }, b.getFrame = function(a) {
      var b;
      return this._frames && (b = this._frames[a]) ? b : null
    }, b.getFrameBounds = function(a, b) {
      var c = this.getFrame(a);
      return c ? (b || new createjs.Rectangle).setValues(-c.regX, -c.regY, c.rect.width, c.rect.height) : null
    }, b.toString = function() {
      return "[SpriteSheet]"
    }, b.clone = function() {
      throw "SpriteSheet cannot be cloned."
    }, b._parseData = function(a) {
      var b, c, d, e;
      if (null != a) {
        if (this.framerate = a.framerate || 0, a.images && (c = a.images.length) > 0)
          for (e = this._images = [], b = 0; c > b; b++) {
            var f = a.images[b];
            if ("string" == typeof f) {
              var g = f;
              f = document.createElement("img"), f.src = g
            }
            e.push(f), f.getContext || f.naturalWidth || (this._loadCount++, this.complete = !1, function(a, b) {
              f.onload = function() {
                a._handleImageLoad(b)
              }
            }(this, g), function(a, b) {
              f.onerror = function() {
                a._handleImageError(b)
              }
            }(this, g))
          }
        if (null == a.frames);
        else if (Array.isArray(a.frames))
          for (this._frames = [], e = a.frames, b = 0, c = e.length; c > b; b++) {
            var h = e[b];
            this._frames.push({
              image: this._images[h[4] ? h[4] : 0],
              rect: new createjs.Rectangle(h[0], h[1], h[2], h[3]),
              regX: h[5] || 0,
              regY: h[6] || 0
            })
          } else d = a.frames, this._frameWidth = d.width, this._frameHeight = d.height, this._regX = d.regX || 0, this._regY = d.regY || 0, this._spacing = d.spacing || 0, this._margin = d.margin || 0, this._numFrames = d.count, 0 == this._loadCount && this._calculateFrames();
        if (this._animations = [], null != (d = a.animations)) {
          this._data = {};
          var i;
          for (i in d) {
            var j = {
                name: i
              },
              k = d[i];
            if ("number" == typeof k) e = j.frames = [k];
            else if (Array.isArray(k))
              if (1 == k.length) j.frames = [k[0]];
              else
                for (j.speed = k[3], j.next = k[2], e = j.frames = [], b = k[0]; b <= k[1]; b++) e.push(b);
            else {
              j.speed = k.speed, j.next = k.next;
              var l = k.frames;
              e = j.frames = "number" == typeof l ? [l] : l.slice(0)
            }(j.next === !0 || void 0 === j.next) && (j.next = i), (j.next === !1 || e.length < 2 && j.next == i) && (j.next = null), j.speed || (j.speed = 1), this._animations.push(i), this._data[i] = j
          }
        }
      }
    }, b._handleImageLoad = function(a) {
      0 == --this._loadCount && (this._calculateFrames(), this.complete = !0, this.dispatchEvent("complete"))
    }, b._handleImageError = function(a) {
      var b = new createjs.Event("error");
      b.src = a, this.dispatchEvent(b), 0 == --this._loadCount && this.dispatchEvent("complete")
    }, b._calculateFrames = function() {
      if (!this._frames && 0 != this._frameWidth) {
        this._frames = [];
        var a = this._numFrames || 1e5,
          b = 0,
          c = this._frameWidth,
          d = this._frameHeight,
          e = this._spacing,
          f = this._margin;
        a: for (var g = 0, h = this._images; g < h.length; g++)
          for (var i = h[g], j = i.width, k = i.height, l = f; k - f - d >= l;) {
            for (var m = f; j - f - c >= m;) {
              if (b >= a) break a;
              b++, this._frames.push({
                image: i,
                rect: new createjs.Rectangle(m, l, c, d),
                regX: this._regX,
                regY: this._regY
              }), m += c + e
            }
            l += d + e
          }
        this._numFrames = b
      }
    }, createjs.SpriteSheet = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this.command = null, this._stroke = null, this._strokeStyle = null, this._oldStrokeStyle = null, this._strokeDash = null, this._oldStrokeDash = null, this._strokeIgnoreScale = !1, this._fill = null, this._instructions = [], this._commitIndex = 0, this._activeInstructions = [], this._dirty = !1, this._storeIndex = 0, this.clear()
    }
    var b = a.prototype,
      c = a;
    a.getRGB = function(a, b, c, d) {
      return null != a && null == c && (d = b, c = 255 & a, b = a >> 8 & 255, a = a >> 16 & 255), null == d ? "rgb(" + a + "," + b + "," + c + ")" : "rgba(" + a + "," + b + "," + c + "," + d + ")"
    }, a.getHSL = function(a, b, c, d) {
      return null == d ? "hsl(" + a % 360 + "," + b + "%," + c + "%)" : "hsla(" + a % 360 + "," + b + "%," + c + "%," + d + ")"
    }, a.BASE_64 = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      0: 52,
      1: 53,
      2: 54,
      3: 55,
      4: 56,
      5: 57,
      6: 58,
      7: 59,
      8: 60,
      9: 61,
      "+": 62,
      "/": 63
    }, a.STROKE_CAPS_MAP = ["butt", "round", "square"], a.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
    var d = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    d.getContext && (a._ctx = d.getContext("2d"), d.width = d.height = 1), b.getInstructions = function() {
      return this._updateInstructions(), this._instructions
    };
    try {
      Object.defineProperties(b, {
        instructions: {
          get: b.getInstructions
        }
      })
    } catch (e) {}
    b.isEmpty = function() {
      return !(this._instructions.length || this._activeInstructions.length)
    }, b.draw = function(a, b) {
      this._updateInstructions();
      for (var c = this._instructions, d = this._storeIndex, e = c.length; e > d; d++) c[d].exec(a, b)
    }, b.drawAsPath = function(a) {
      this._updateInstructions();
      for (var b, c = this._instructions, d = this._storeIndex, e = c.length; e > d; d++)(b = c[d]).path !== !1 && b.exec(a)
    }, b.moveTo = function(a, b) {
      return this.append(new c.MoveTo(a, b), !0)
    }, b.lineTo = function(a, b) {
      return this.append(new c.LineTo(a, b))
    }, b.arcTo = function(a, b, d, e, f) {
      return this.append(new c.ArcTo(a, b, d, e, f))
    }, b.arc = function(a, b, d, e, f, g) {
      return this.append(new c.Arc(a, b, d, e, f, g))
    }, b.quadraticCurveTo = function(a, b, d, e) {
      return this.append(new c.QuadraticCurveTo(a, b, d, e))
    }, b.bezierCurveTo = function(a, b, d, e, f, g) {
      return this.append(new c.BezierCurveTo(a, b, d, e, f, g))
    }, b.rect = function(a, b, d, e) {
      return this.append(new c.Rect(a, b, d, e))
    }, b.closePath = function() {
      return this._activeInstructions.length ? this.append(new c.ClosePath) : this
    }, b.clear = function() {
      return this._instructions.length = this._activeInstructions.length = this._commitIndex = 0, this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null, this._dirty = this._strokeIgnoreScale = !1, this
    }, b.beginFill = function(a) {
      return this._setFill(a ? new c.Fill(a) : null)
    }, b.beginLinearGradientFill = function(a, b, d, e, f, g) {
      return this._setFill((new c.Fill).linearGradient(a, b, d, e, f, g))
    }, b.beginRadialGradientFill = function(a, b, d, e, f, g, h, i) {
      return this._setFill((new c.Fill).radialGradient(a, b, d, e, f, g, h, i))
    }, b.beginBitmapFill = function(a, b, d) {
      return this._setFill(new c.Fill(null, d).bitmap(a, b))
    }, b.endFill = function() {
      return this.beginFill()
    }, b.setStrokeStyle = function(a, b, d, e, f) {
      return this._updateInstructions(!0), this._strokeStyle = this.command = new c.StrokeStyle(a, b, d, e, f), this._stroke && (this._stroke.ignoreScale = f), this._strokeIgnoreScale = f, this
    }, b.setStrokeDash = function(a, b) {
      return this._updateInstructions(!0), this._strokeDash = this.command = new c.StrokeDash(a, b), this
    }, b.beginStroke = function(a) {
      return this._setStroke(a ? new c.Stroke(a) : null)
    }, b.beginLinearGradientStroke = function(a, b, d, e, f, g) {
      return this._setStroke((new c.Stroke).linearGradient(a, b, d, e, f, g))
    }, b.beginRadialGradientStroke = function(a, b, d, e, f, g, h, i) {
      return this._setStroke((new c.Stroke).radialGradient(a, b, d, e, f, g, h, i))
    }, b.beginBitmapStroke = function(a, b) {
      return this._setStroke((new c.Stroke).bitmap(a, b))
    }, b.endStroke = function() {
      return this.beginStroke()
    }, b.curveTo = b.quadraticCurveTo, b.drawRect = b.rect, b.drawRoundRect = function(a, b, c, d, e) {
      return this.drawRoundRectComplex(a, b, c, d, e, e, e, e)
    }, b.drawRoundRectComplex = function(a, b, d, e, f, g, h, i) {
      return this.append(new c.RoundRect(a, b, d, e, f, g, h, i))
    }, b.drawCircle = function(a, b, d) {
      return this.append(new c.Circle(a, b, d))
    }, b.drawEllipse = function(a, b, d, e) {
      return this.append(new c.Ellipse(a, b, d, e))
    }, b.drawPolyStar = function(a, b, d, e, f, g) {
      return this.append(new c.PolyStar(a, b, d, e, f, g))
    }, b.append = function(a, b) {
      return this._activeInstructions.push(a), this.command = a, b || (this._dirty = !0), this
    }, b.decodePath = function(b) {
      for (var c = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath], d = [2, 2, 4, 6, 0], e = 0, f = b.length, g = [], h = 0, i = 0, j = a.BASE_64; f > e;) {
        var k = b.charAt(e),
          l = j[k],
          m = l >> 3,
          n = c[m];
        if (!n || 3 & l) throw "bad path data (@" + e + "): " + k;
        var o = d[m];
        m || (h = i = 0), g.length = 0, e++;
        for (var p = (l >> 2 & 1) + 2, q = 0; o > q; q++) {
          var r = j[b.charAt(e)],
            s = r >> 5 ? -1 : 1;
          r = (31 & r) << 6 | j[b.charAt(e + 1)], 3 == p && (r = r << 6 | j[b.charAt(e + 2)]), r = s * r / 10, q % 2 ? h = r += h : i = r += i, g[q] = r, e += p
        }
        n.apply(this, g)
      }
      return this
    }, b.store = function() {
      return this._updateInstructions(!0), this._storeIndex = this._instructions.length, this
    }, b.unstore = function() {
      return this._storeIndex = 0, this
    }, b.clone = function() {
      var b = new a;
      return b.command = this.command, b._stroke = this._stroke, b._strokeStyle = this._strokeStyle, b._strokeDash = this._strokeDash, b._strokeIgnoreScale = this._strokeIgnoreScale, b._fill = this._fill, b._instructions = this._instructions.slice(), b._commitIndex = this._commitIndex, b._activeInstructions = this._activeInstructions.slice(), b._dirty = this._dirty, b._storeIndex = this._storeIndex, b
    }, b.toString = function() {
      return "[Graphics]"
    }, b.mt = b.moveTo, b.lt = b.lineTo, b.at = b.arcTo, b.bt = b.bezierCurveTo, b.qt = b.quadraticCurveTo, b.a = b.arc, b.r = b.rect, b.cp = b.closePath, b.c = b.clear, b.f = b.beginFill, b.lf = b.beginLinearGradientFill, b.rf = b.beginRadialGradientFill, b.bf = b.beginBitmapFill, b.ef = b.endFill, b.ss = b.setStrokeStyle, b.sd = b.setStrokeDash, b.s = b.beginStroke, b.ls = b.beginLinearGradientStroke, b.rs = b.beginRadialGradientStroke, b.bs = b.beginBitmapStroke, b.es = b.endStroke, b.dr = b.drawRect, b.rr = b.drawRoundRect, b.rc = b.drawRoundRectComplex, b.dc = b.drawCircle, b.de = b.drawEllipse, b.dp = b.drawPolyStar, b.p = b.decodePath, b._updateInstructions = function(b) {
      var c = this._instructions,
        d = this._activeInstructions,
        e = this._commitIndex;
      if (this._dirty && d.length) {
        c.length = e, c.push(a.beginCmd);
        var f = d.length,
          g = c.length;
        c.length = g + f;
        for (var h = 0; f > h; h++) c[h + g] = d[h];
        this._fill && c.push(this._fill), this._stroke && (this._strokeDash !== this._oldStrokeDash && (this._oldStrokeDash = this._strokeDash, c.push(this._strokeDash)), this._strokeStyle !== this._oldStrokeStyle && (this._oldStrokeStyle = this._strokeStyle, c.push(this._strokeStyle)), c.push(this._stroke)), this._dirty = !1
      }
      b && (d.length = 0, this._commitIndex = c.length)
    }, b._setFill = function(a) {
      return this._updateInstructions(!0), this.command = this._fill = a, this
    }, b._setStroke = function(a) {
      return this._updateInstructions(!0), (this.command = this._stroke = a) && (a.ignoreScale = this._strokeIgnoreScale), this
    }, (c.LineTo = function(a, b) {
      this.x = a, this.y = b
    }).prototype.exec = function(a) {
      a.lineTo(this.x, this.y)
    }, (c.MoveTo = function(a, b) {
      this.x = a, this.y = b
    }).prototype.exec = function(a) {
      a.moveTo(this.x, this.y)
    }, (c.ArcTo = function(a, b, c, d, e) {
      this.x1 = a, this.y1 = b, this.x2 = c, this.y2 = d, this.radius = e
    }).prototype.exec = function(a) {
      a.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius)
    }, (c.Arc = function(a, b, c, d, e, f) {
      this.x = a, this.y = b, this.radius = c, this.startAngle = d, this.endAngle = e, this.anticlockwise = !!f
    }).prototype.exec = function(a) {
      a.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
    }, (c.QuadraticCurveTo = function(a, b, c, d) {
      this.cpx = a, this.cpy = b, this.x = c, this.y = d
    }).prototype.exec = function(a) {
      a.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y)
    }, (c.BezierCurveTo = function(a, b, c, d, e, f) {
      this.cp1x = a, this.cp1y = b, this.cp2x = c, this.cp2y = d, this.x = e, this.y = f
    }).prototype.exec = function(a) {
      a.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y)
    }, (c.Rect = function(a, b, c, d) {
      this.x = a, this.y = b, this.w = c, this.h = d
    }).prototype.exec = function(a) {
      a.rect(this.x, this.y, this.w, this.h)
    }, (c.ClosePath = function() {}).prototype.exec = function(a) {
      a.closePath()
    }, (c.BeginPath = function() {}).prototype.exec = function(a) {
      a.beginPath()
    }, b = (c.Fill = function(a, b) {
      this.style = a, this.matrix = b
    }).prototype, b.exec = function(a) {
      if (this.style) {
        a.fillStyle = this.style;
        var b = this.matrix;
        b && (a.save(), a.transform(b.a, b.b, b.c, b.d, b.tx, b.ty)), a.fill(), b && a.restore()
      }
    }, b.linearGradient = function(b, c, d, e, f, g) {
      for (var h = this.style = a._ctx.createLinearGradient(d, e, f, g), i = 0, j = b.length; j > i; i++) h.addColorStop(c[i], b[i]);
      return h.props = {
        colors: b,
        ratios: c,
        x0: d,
        y0: e,
        x1: f,
        y1: g,
        type: "linear"
      }, this
    }, b.radialGradient = function(b, c, d, e, f, g, h, i) {
      for (var j = this.style = a._ctx.createRadialGradient(d, e, f, g, h, i), k = 0, l = b.length; l > k; k++) j.addColorStop(c[k], b[k]);
      return j.props = {
        colors: b,
        ratios: c,
        x0: d,
        y0: e,
        r0: f,
        x1: g,
        y1: h,
        r1: i,
        type: "radial"
      }, this
    }, b.bitmap = function(b, c) {
      if (b.naturalWidth || b.getContext || b.readyState >= 2) {
        var d = this.style = a._ctx.createPattern(b, c || "");
        d.props = {
          image: b,
          repetition: c,
          type: "bitmap"
        }
      }
      return this
    }, b.path = !1, b = (c.Stroke = function(a, b) {
      this.style = a, this.ignoreScale = b
    }).prototype, b.exec = function(a) {
      this.style && (a.strokeStyle = this.style, this.ignoreScale && (a.save(), a.setTransform(1, 0, 0, 1, 0, 0)), a.stroke(), this.ignoreScale && a.restore())
    }, b.linearGradient = c.Fill.prototype.linearGradient, b.radialGradient = c.Fill.prototype.radialGradient, b.bitmap = c.Fill.prototype.bitmap, b.path = !1, b = (c.StrokeStyle = function(a, b, c, d, e) {
      this.width = a, this.caps = b, this.joints = c, this.miterLimit = d, this.ignoreScale = e
    }).prototype, b.exec = function(b) {
      b.lineWidth = null == this.width ? "1" : this.width, b.lineCap = null == this.caps ? "butt" : isNaN(this.caps) ? this.caps : a.STROKE_CAPS_MAP[this.caps], b.lineJoin = null == this.joints ? "miter" : isNaN(this.joints) ? this.joints : a.STROKE_JOINTS_MAP[this.joints], b.miterLimit = null == this.miterLimit ? "10" : this.miterLimit, b.ignoreScale = null == this.ignoreScale ? !1 : this.ignoreScale
    }, b.path = !1, (c.StrokeDash = function(a, b) {
      this.segments = a, this.offset = b || 0
    }).prototype.exec = function(a) {
      a.setLineDash && (a.setLineDash(this.segments || c.StrokeDash.EMPTY_SEGMENTS), a.lineDashOffset = this.offset || 0)
    }, c.StrokeDash.EMPTY_SEGMENTS = [], (c.RoundRect = function(a, b, c, d, e, f, g, h) {
      this.x = a, this.y = b, this.w = c, this.h = d, this.radiusTL = e, this.radiusTR = f, this.radiusBR = g, this.radiusBL = h
    }).prototype.exec = function(a) {
      var b = (j > i ? i : j) / 2,
        c = 0,
        d = 0,
        e = 0,
        f = 0,
        g = this.x,
        h = this.y,
        i = this.w,
        j = this.h,
        k = this.radiusTL,
        l = this.radiusTR,
        m = this.radiusBR,
        n = this.radiusBL;
      0 > k && (k *= c = -1), k > b && (k = b), 0 > l && (l *= d = -1), l > b && (l = b), 0 > m && (m *= e = -1), m > b && (m = b), 0 > n && (n *= f = -1), n > b && (n = b), a.moveTo(g + i - l, h), a.arcTo(g + i + l * d, h - l * d, g + i, h + l, l), a.lineTo(g + i, h + j - m), a.arcTo(g + i + m * e, h + j + m * e, g + i - m, h + j, m), a.lineTo(g + n, h + j), a.arcTo(g - n * f, h + j + n * f, g, h + j - n, n), a.lineTo(g, h + k), a.arcTo(g - k * c, h - k * c, g + k, h, k), a.closePath()
    }, (c.Circle = function(a, b, c) {
      this.x = a, this.y = b, this.radius = c
    }).prototype.exec = function(a) {
      a.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    }, (c.Ellipse = function(a, b, c, d) {
      this.x = a, this.y = b, this.w = c, this.h = d
    }).prototype.exec = function(a) {
      var b = this.x,
        c = this.y,
        d = this.w,
        e = this.h,
        f = .5522848,
        g = d / 2 * f,
        h = e / 2 * f,
        i = b + d,
        j = c + e,
        k = b + d / 2,
        l = c + e / 2;
      a.moveTo(b, l), a.bezierCurveTo(b, l - h, k - g, c, k, c), a.bezierCurveTo(k + g, c, i, l - h, i, l), a.bezierCurveTo(i, l + h, k + g, j, k, j), a.bezierCurveTo(k - g, j, b, l + h, b, l)
    }, (c.PolyStar = function(a, b, c, d, e, f) {
      this.x = a, this.y = b, this.radius = c, this.sides = d, this.pointSize = e, this.angle = f
    }).prototype.exec = function(a) {
      var b = this.x,
        c = this.y,
        d = this.radius,
        e = (this.angle || 0) / 180 * Math.PI,
        f = this.sides,
        g = 1 - (this.pointSize || 0),
        h = Math.PI / f;
      a.moveTo(b + Math.cos(e) * d, c + Math.sin(e) * d);
      for (var i = 0; f > i; i++) e += h, 1 != g && a.lineTo(b + Math.cos(e) * d * g, c + Math.sin(e) * d * g), e += h, a.lineTo(b + Math.cos(e) * d, c + Math.sin(e) * d);
      a.closePath()
    }, a.beginCmd = new c.BeginPath, createjs.Graphics = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this.EventDispatcher_constructor(), this.alpha = 1, this.cacheCanvas = null, this.cacheID = 0, this.id = createjs.UID.get(), this.mouseEnabled = !0, this.tickEnabled = !0, this.name = null, this.parent = null, this.regX = 0, this.regY = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1, this.skewX = 0, this.skewY = 0, this.shadow = null, this.visible = !0, this.x = 0, this.y = 0, this.transformMatrix = null, this.compositeOperation = null, this.snapToPixel = !0, this.filters = null,
        this.mask = null, this.hitArea = null, this.cursor = null, this._cacheOffsetX = 0, this._cacheOffsetY = 0, this._filterOffsetX = 0, this._filterOffsetY = 0, this._cacheScale = 1, this._cacheDataURLID = 0, this._cacheDataURL = null, this._props = new createjs.DisplayProps, this._rectangle = new createjs.Rectangle, this._bounds = null
    }
    var b = createjs.extend(a, createjs.EventDispatcher);
    a._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"], a.suppressCrossDomainErrors = !1, a._snapToPixelEnabled = !1;
    var c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    c.getContext && (a._hitTestCanvas = c, a._hitTestContext = c.getContext("2d"), c.width = c.height = 1), a._nextCacheID = 1, b.getStage = function() {
      for (var a = this, b = createjs.Stage; a.parent;) a = a.parent;
      return a instanceof b ? a : null
    };
    try {
      Object.defineProperties(b, {
        stage: {
          get: b.getStage
        }
      })
    } catch (d) {}
    b.isVisible = function() {
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY)
    }, b.draw = function(a, b) {
      var c = this.cacheCanvas;
      if (b || !c) return !1;
      var d = this._cacheScale;
      return a.drawImage(c, this._cacheOffsetX + this._filterOffsetX, this._cacheOffsetY + this._filterOffsetY, c.width / d, c.height / d), !0
    }, b.updateContext = function(b) {
      var c = this,
        d = c.mask,
        e = c._props.matrix;
      d && d.graphics && !d.graphics.isEmpty() && (d.getMatrix(e), b.transform(e.a, e.b, e.c, e.d, e.tx, e.ty), d.graphics.drawAsPath(b), b.clip(), e.invert(), b.transform(e.a, e.b, e.c, e.d, e.tx, e.ty)), this.getMatrix(e);
      var f = e.tx,
        g = e.ty;
      a._snapToPixelEnabled && c.snapToPixel && (f = f + (0 > f ? -.5 : .5) | 0, g = g + (0 > g ? -.5 : .5) | 0), b.transform(e.a, e.b, e.c, e.d, f, g), b.globalAlpha *= c.alpha, c.compositeOperation && (b.globalCompositeOperation = c.compositeOperation), c.shadow && this._applyShadow(b, c.shadow)
    }, b.cache = function(a, b, c, d, e) {
      e = e || 1, this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")), this._cacheWidth = c, this._cacheHeight = d, this._cacheOffsetX = a, this._cacheOffsetY = b, this._cacheScale = e, this.updateCache()
    }, b.updateCache = function(b) {
      var c = this.cacheCanvas;
      if (!c) throw "cache() must be called before updateCache()";
      var d = this._cacheScale,
        e = this._cacheOffsetX * d,
        f = this._cacheOffsetY * d,
        g = this._cacheWidth,
        h = this._cacheHeight,
        i = c.getContext("2d"),
        j = this._getFilterBounds();
      e += this._filterOffsetX = j.x, f += this._filterOffsetY = j.y, g = Math.ceil(g * d) + j.width, h = Math.ceil(h * d) + j.height, g != c.width || h != c.height ? (c.width = g, c.height = h) : b || i.clearRect(0, 0, g + 1, h + 1), i.save(), i.globalCompositeOperation = b, i.setTransform(d, 0, 0, d, -e, -f), this.draw(i, !0), this._applyFilters(), i.restore(), this.cacheID = a._nextCacheID++
    }, b.uncache = function() {
      this._cacheDataURL = this.cacheCanvas = null, this.cacheID = this._cacheOffsetX = this._cacheOffsetY = this._filterOffsetX = this._filterOffsetY = 0, this._cacheScale = 1
    }, b.getCacheDataURL = function() {
      return this.cacheCanvas ? (this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL()), this._cacheDataURL) : null
    }, b.localToGlobal = function(a, b, c) {
      return this.getConcatenatedMatrix(this._props.matrix).transformPoint(a, b, c || new createjs.Point)
    }, b.globalToLocal = function(a, b, c) {
      return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(a, b, c || new createjs.Point)
    }, b.localToLocal = function(a, b, c, d) {
      return d = this.localToGlobal(a, b, d), c.globalToLocal(d.x, d.y, d)
    }, b.setTransform = function(a, b, c, d, e, f, g, h, i) {
      return this.x = a || 0, this.y = b || 0, this.scaleX = null == c ? 1 : c, this.scaleY = null == d ? 1 : d, this.rotation = e || 0, this.skewX = f || 0, this.skewY = g || 0, this.regX = h || 0, this.regY = i || 0, this
    }, b.getMatrix = function(a) {
      var b = this,
        c = a && a.identity() || new createjs.Matrix2D;
      return b.transformMatrix ? c.copy(b.transformMatrix) : c.appendTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skewX, b.skewY, b.regX, b.regY)
    }, b.getConcatenatedMatrix = function(a) {
      for (var b = this, c = this.getMatrix(a); b = b.parent;) c.prependMatrix(b.getMatrix(b._props.matrix));
      return c
    }, b.getConcatenatedDisplayProps = function(a) {
      a = a ? a.identity() : new createjs.DisplayProps;
      var b = this,
        c = b.getMatrix(a.matrix);
      do a.prepend(b.visible, b.alpha, b.shadow, b.compositeOperation), b != this && c.prependMatrix(b.getMatrix(b._props.matrix)); while (b = b.parent);
      return a
    }, b.hitTest = function(b, c) {
      var d = a._hitTestContext;
      d.setTransform(1, 0, 0, 1, -b, -c), this.draw(d);
      var e = this._testHit(d);
      return d.setTransform(1, 0, 0, 1, 0, 0), d.clearRect(0, 0, 2, 2), e
    }, b.set = function(a) {
      for (var b in a) this[b] = a[b];
      return this
    }, b.getBounds = function() {
      if (this._bounds) return this._rectangle.copy(this._bounds);
      var a = this.cacheCanvas;
      if (a) {
        var b = this._cacheScale;
        return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, a.width / b, a.height / b)
      }
      return null
    }, b.getTransformedBounds = function() {
      return this._getBounds()
    }, b.setBounds = function(a, b, c, d) {
      null == a && (this._bounds = a), this._bounds = (this._bounds || new createjs.Rectangle).setValues(a, b, c, d)
    }, b.clone = function() {
      return this._cloneProps(new a)
    }, b.toString = function() {
      return "[DisplayObject (name=" + this.name + ")]"
    }, b._cloneProps = function(a) {
      return a.alpha = this.alpha, a.mouseEnabled = this.mouseEnabled, a.tickEnabled = this.tickEnabled, a.name = this.name, a.regX = this.regX, a.regY = this.regY, a.rotation = this.rotation, a.scaleX = this.scaleX, a.scaleY = this.scaleY, a.shadow = this.shadow, a.skewX = this.skewX, a.skewY = this.skewY, a.visible = this.visible, a.x = this.x, a.y = this.y, a.compositeOperation = this.compositeOperation, a.snapToPixel = this.snapToPixel, a.filters = null == this.filters ? null : this.filters.slice(0), a.mask = this.mask, a.hitArea = this.hitArea, a.cursor = this.cursor, a._bounds = this._bounds, a
    }, b._applyShadow = function(a, b) {
      b = b || Shadow.identity, a.shadowColor = b.color, a.shadowOffsetX = b.offsetX, a.shadowOffsetY = b.offsetY, a.shadowBlur = b.blur
    }, b._tick = function(a) {
      var b = this._listeners;
      b && b.tick && (a.target = null, a.propagationStopped = a.immediatePropagationStopped = !1, this.dispatchEvent(a))
    }, b._testHit = function(b) {
      try {
        var c = b.getImageData(0, 0, 1, 1).data[3] > 1
      } catch (d) {
        if (!a.suppressCrossDomainErrors) throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
      }
      return c
    }, b._applyFilters = function() {
      if (this.filters && 0 != this.filters.length && this.cacheCanvas)
        for (var a = this.filters.length, b = this.cacheCanvas.getContext("2d"), c = this.cacheCanvas.width, d = this.cacheCanvas.height, e = 0; a > e; e++) this.filters[e].applyFilter(b, 0, 0, c, d)
    }, b._getFilterBounds = function(a) {
      var b, c = this.filters,
        d = this._rectangle.setValues(0, 0, 0, 0);
      if (!c || !(b = c.length)) return d;
      for (var e = 0; b > e; e++) {
        var f = this.filters[e];
        f.getBounds && f.getBounds(d)
      }
      return d
    }, b._getBounds = function(a, b) {
      return this._transformBounds(this.getBounds(), a, b)
    }, b._transformBounds = function(a, b, c) {
      if (!a) return a;
      var d = a.x,
        e = a.y,
        f = a.width,
        g = a.height,
        h = this._props.matrix;
      h = c ? h.identity() : this.getMatrix(h), (d || e) && h.appendTransform(0, 0, 1, 1, 0, 0, 0, -d, -e), b && h.prependMatrix(b);
      var i = f * h.a,
        j = f * h.b,
        k = g * h.c,
        l = g * h.d,
        m = h.tx,
        n = h.ty,
        o = m,
        p = m,
        q = n,
        r = n;
      return (d = i + m) < o ? o = d : d > p && (p = d), (d = i + k + m) < o ? o = d : d > p && (p = d), (d = k + m) < o ? o = d : d > p && (p = d), (e = j + n) < q ? q = e : e > r && (r = e), (e = j + l + n) < q ? q = e : e > r && (r = e), (e = l + n) < q ? q = e : e > r && (r = e), a.setValues(o, q, p - o, r - q)
    }, b._hasMouseEventListener = function() {
      for (var b = a._MOUSE_EVENTS, c = 0, d = b.length; d > c; c++)
        if (this.hasEventListener(b[c])) return !0;
      return !!this.cursor
    }, createjs.DisplayObject = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this.DisplayObject_constructor(), this.children = [], this.mouseChildren = !0, this.tickChildren = !0
    }
    var b = createjs.extend(a, createjs.DisplayObject);
    b.getNumChildren = function() {
      return this.children.length
    };
    try {
      Object.defineProperties(b, {
        numChildren: {
          get: b.getNumChildren
        }
      })
    } catch (c) {}
    b.initialize = a, b.isVisible = function() {
      var a = this.cacheCanvas || this.children.length;
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
    }, b.draw = function(a, b) {
      if (this.DisplayObject_draw(a, b)) return !0;
      for (var c = this.children.slice(), d = 0, e = c.length; e > d; d++) {
        var f = c[d];
        f.isVisible() && (a.save(), f.updateContext(a), f.draw(a), a.restore())
      }
      return !0
    }, b.addChild = function(a) {
      if (null == a) return a;
      var b = arguments.length;
      if (b > 1) {
        for (var c = 0; b > c; c++) this.addChild(arguments[c]);
        return arguments[b - 1]
      }
      return a.parent && a.parent.removeChild(a), a.parent = this, this.children.push(a), a.dispatchEvent("added"), a
    }, b.addChildAt = function(a, b) {
      var c = arguments.length,
        d = arguments[c - 1];
      if (0 > d || d > this.children.length) return arguments[c - 2];
      if (c > 2) {
        for (var e = 0; c - 1 > e; e++) this.addChildAt(arguments[e], d + e);
        return arguments[c - 2]
      }
      return a.parent && a.parent.removeChild(a), a.parent = this, this.children.splice(b, 0, a), a.dispatchEvent("added"), a
    }, b.removeChild = function(a) {
      var b = arguments.length;
      if (b > 1) {
        for (var c = !0, d = 0; b > d; d++) c = c && this.removeChild(arguments[d]);
        return c
      }
      return this.removeChildAt(createjs.indexOf(this.children, a))
    }, b.removeChildAt = function(a) {
      var b = arguments.length;
      if (b > 1) {
        for (var c = [], d = 0; b > d; d++) c[d] = arguments[d];
        c.sort(function(a, b) {
          return b - a
        });
        for (var e = !0, d = 0; b > d; d++) e = e && this.removeChildAt(c[d]);
        return e
      }
      if (0 > a || a > this.children.length - 1) return !1;
      var f = this.children[a];
      return f && (f.parent = null), this.children.splice(a, 1), f.dispatchEvent("removed"), !0
    }, b.removeAllChildren = function() {
      for (var a = this.children; a.length;) this.removeChildAt(0)
    }, b.getChildAt = function(a) {
      return this.children[a]
    }, b.getChildByName = function(a) {
      for (var b = this.children, c = 0, d = b.length; d > c; c++)
        if (b[c].name == a) return b[c];
      return null
    }, b.sortChildren = function(a) {
      this.children.sort(a)
    }, b.getChildIndex = function(a) {
      return createjs.indexOf(this.children, a)
    }, b.swapChildrenAt = function(a, b) {
      var c = this.children,
        d = c[a],
        e = c[b];
      d && e && (c[a] = e, c[b] = d)
    }, b.swapChildren = function(a, b) {
      for (var c, d, e = this.children, f = 0, g = e.length; g > f && (e[f] == a && (c = f), e[f] == b && (d = f), null == c || null == d); f++);
      f != g && (e[c] = b, e[d] = a)
    }, b.setChildIndex = function(a, b) {
      var c = this.children,
        d = c.length;
      if (!(a.parent != this || 0 > b || b >= d)) {
        for (var e = 0; d > e && c[e] != a; e++);
        e != d && e != b && (c.splice(e, 1), c.splice(b, 0, a))
      }
    }, b.contains = function(a) {
      for (; a;) {
        if (a == this) return !0;
        a = a.parent
      }
      return !1
    }, b.hitTest = function(a, b) {
      return null != this.getObjectUnderPoint(a, b)
    }, b.getObjectsUnderPoint = function(a, b, c) {
      var d = [],
        e = this.localToGlobal(a, b);
      return this._getObjectsUnderPoint(e.x, e.y, d, c > 0, 1 == c), d
    }, b.getObjectUnderPoint = function(a, b, c) {
      var d = this.localToGlobal(a, b);
      return this._getObjectsUnderPoint(d.x, d.y, null, c > 0, 1 == c)
    }, b.getBounds = function() {
      return this._getBounds(null, !0)
    }, b.getTransformedBounds = function() {
      return this._getBounds()
    }, b.clone = function(b) {
      var c = this._cloneProps(new a);
      return b && this._cloneChildren(c), c
    }, b.toString = function() {
      return "[Container (name=" + this.name + ")]"
    }, b._tick = function(a) {
      if (this.tickChildren)
        for (var b = this.children.length - 1; b >= 0; b--) {
          var c = this.children[b];
          c.tickEnabled && c._tick && c._tick(a)
        }
      this.DisplayObject__tick(a)
    }, b._cloneChildren = function(a) {
      a.children.length && a.removeAllChildren();
      for (var b = a.children, c = 0, d = this.children.length; d > c; c++) {
        var e = this.children[c].clone(!0);
        e.parent = a, b.push(e)
      }
    }, b._getObjectsUnderPoint = function(b, c, d, e, f, g) {
      if (g = g || 0, !g && !this._testMask(this, b, c)) return null;
      var h, i = createjs.DisplayObject._hitTestContext;
      f = f || e && this._hasMouseEventListener();
      for (var j = this.children, k = j.length, l = k - 1; l >= 0; l--) {
        var m = j[l],
          n = m.hitArea;
        if (m.visible && (n || m.isVisible()) && (!e || m.mouseEnabled) && (n || this._testMask(m, b, c)))
          if (!n && m instanceof a) {
            var o = m._getObjectsUnderPoint(b, c, d, e, f, g + 1);
            if (!d && o) return e && !this.mouseChildren ? this : o
          } else {
            if (e && !f && !m._hasMouseEventListener()) continue;
            var p = m.getConcatenatedDisplayProps(m._props);
            if (h = p.matrix, n && (h.appendMatrix(n.getMatrix(n._props.matrix)), p.alpha = n.alpha), i.globalAlpha = p.alpha, i.setTransform(h.a, h.b, h.c, h.d, h.tx - b, h.ty - c), (n || m).draw(i), !this._testHit(i)) continue;
            if (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, 2, 2), !d) return e && !this.mouseChildren ? this : m;
            d.push(m)
          }
      }
      return null
    }, b._testMask = function(a, b, c) {
      var d = a.mask;
      if (!d || !d.graphics || d.graphics.isEmpty()) return !0;
      var e = this._props.matrix,
        f = a.parent;
      e = f ? f.getConcatenatedMatrix(e) : e.identity(), e = d.getMatrix(d._props.matrix).prependMatrix(e);
      var g = createjs.DisplayObject._hitTestContext;
      return g.setTransform(e.a, e.b, e.c, e.d, e.tx - b, e.ty - c), d.graphics.drawAsPath(g), g.fillStyle = "#000", g.fill(), this._testHit(g) ? (g.setTransform(1, 0, 0, 1, 0, 0), g.clearRect(0, 0, 2, 2), !0) : !1
    }, b._getBounds = function(a, b) {
      var c = this.DisplayObject_getBounds();
      if (c) return this._transformBounds(c, a, b);
      var d = this._props.matrix;
      d = b ? d.identity() : this.getMatrix(d), a && d.prependMatrix(a);
      for (var e = this.children.length, f = null, g = 0; e > g; g++) {
        var h = this.children[g];
        h.visible && (c = h._getBounds(d)) && (f ? f.extend(c.x, c.y, c.width, c.height) : f = c.clone())
      }
      return f
    }, createjs.Container = createjs.promote(a, "DisplayObject")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.Container_constructor(), this.autoClear = !0, this.canvas = "string" == typeof a ? document.getElementById(a) : a, this.mouseX = 0, this.mouseY = 0, this.drawRect = null, this.snapToPixelEnabled = !1, this.mouseInBounds = !1, this.tickOnUpdate = !0, this.mouseMoveOutside = !1, this.preventSelection = !0, this._pointerData = {}, this._pointerCount = 0, this._primaryPointerID = null, this._mouseOverIntervalID = null, this._nextStage = null, this._prevStage = null, this.enableDOMEvents(!0)
    }
    var b = createjs.extend(a, createjs.Container);
    b._get_nextStage = function() {
      return this._nextStage
    }, b._set_nextStage = function(a) {
      this._nextStage && (this._nextStage._prevStage = null), a && (a._prevStage = this), this._nextStage = a
    };
    try {
      Object.defineProperties(b, {
        nextStage: {
          get: b._get_nextStage,
          set: b._set_nextStage
        }
      })
    } catch (c) {}
    b.update = function(a) {
      if (this.canvas && (this.tickOnUpdate && this.tick(a), this.dispatchEvent("drawstart", !1, !0) !== !1)) {
        createjs.DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
        var b = this.drawRect,
          c = this.canvas.getContext("2d");
        c.setTransform(1, 0, 0, 1, 0, 0), this.autoClear && (b ? c.clearRect(b.x, b.y, b.width, b.height) : c.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)), c.save(), this.drawRect && (c.beginPath(), c.rect(b.x, b.y, b.width, b.height), c.clip()), this.updateContext(c), this.draw(c, !1), c.restore(), this.dispatchEvent("drawend")
      }
    }, b.tick = function(a) {
      if (this.tickEnabled && this.dispatchEvent("tickstart", !1, !0) !== !1) {
        var b = new createjs.Event("tick");
        if (a)
          for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
        this._tick(b), this.dispatchEvent("tickend")
      }
    }, b.handleEvent = function(a) {
      "tick" == a.type && this.update(a)
    }, b.clear = function() {
      if (this.canvas) {
        var a = this.canvas.getContext("2d");
        a.setTransform(1, 0, 0, 1, 0, 0), a.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
      }
    }, b.toDataURL = function(a, b) {
      var c, d = this.canvas.getContext("2d"),
        e = this.canvas.width,
        f = this.canvas.height;
      if (a) {
        c = d.getImageData(0, 0, e, f);
        var g = d.globalCompositeOperation;
        d.globalCompositeOperation = "destination-over", d.fillStyle = a, d.fillRect(0, 0, e, f)
      }
      var h = this.canvas.toDataURL(b || "image/png");
      return a && (d.putImageData(c, 0, 0), d.globalCompositeOperation = g), h
    }, b.enableMouseOver = function(a) {
      if (this._mouseOverIntervalID && (clearInterval(this._mouseOverIntervalID), this._mouseOverIntervalID = null, 0 == a && this._testMouseOver(!0)), null == a) a = 20;
      else if (0 >= a) return;
      var b = this;
      this._mouseOverIntervalID = setInterval(function() {
        b._testMouseOver()
      }, 1e3 / Math.min(50, a))
    }, b.enableDOMEvents = function(a) {
      null == a && (a = !0);
      var b, c, d = this._eventListeners;
      if (!a && d) {
        for (b in d) c = d[b], c.t.removeEventListener(b, c.f, !1);
        this._eventListeners = null
      } else if (a && !d && this.canvas) {
        var e = window.addEventListener ? window : document,
          f = this;
        d = this._eventListeners = {}, d.mouseup = {
          t: e,
          f: function(a) {
            f._handleMouseUp(a)
          }
        }, d.mousemove = {
          t: e,
          f: function(a) {
            f._handleMouseMove(a)
          }
        }, d.dblclick = {
          t: this.canvas,
          f: function(a) {
            f._handleDoubleClick(a)
          }
        }, d.mousedown = {
          t: this.canvas,
          f: function(a) {
            f._handleMouseDown(a)
          }
        };
        for (b in d) c = d[b], c.t.addEventListener(b, c.f, !1)
      }
    }, b.clone = function() {
      throw "Stage cannot be cloned."
    }, b.toString = function() {
      return "[Stage (name=" + this.name + ")]"
    }, b._getElementRect = function(a) {
      var b;
      try {
        b = a.getBoundingClientRect()
      } catch (c) {
        b = {
          top: a.offsetTop,
          left: a.offsetLeft,
          width: a.offsetWidth,
          height: a.offsetHeight
        }
      }
      var d = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0),
        e = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0),
        f = window.getComputedStyle ? getComputedStyle(a, null) : a.currentStyle,
        g = parseInt(f.paddingLeft) + parseInt(f.borderLeftWidth),
        h = parseInt(f.paddingTop) + parseInt(f.borderTopWidth),
        i = parseInt(f.paddingRight) + parseInt(f.borderRightWidth),
        j = parseInt(f.paddingBottom) + parseInt(f.borderBottomWidth);
      return {
        left: b.left + d + g,
        right: b.right + d - i,
        top: b.top + e + h,
        bottom: b.bottom + e - j
      }
    }, b._getPointerData = function(a) {
      var b = this._pointerData[a];
      return b || (b = this._pointerData[a] = {
        x: 0,
        y: 0
      }), b
    }, b._handleMouseMove = function(a) {
      a || (a = window.event), this._handlePointerMove(-1, a, a.pageX, a.pageY)
    }, b._handlePointerMove = function(a, b, c, d, e) {
      if ((!this._prevStage || void 0 !== e) && this.canvas) {
        var f = this._nextStage,
          g = this._getPointerData(a),
          h = g.inBounds;
        this._updatePointerPosition(a, b, c, d), (h || g.inBounds || this.mouseMoveOutside) && (-1 === a && g.inBounds == !h && this._dispatchMouseEvent(this, h ? "mouseleave" : "mouseenter", !1, a, g, b), this._dispatchMouseEvent(this, "stagemousemove", !1, a, g, b), this._dispatchMouseEvent(g.target, "pressmove", !0, a, g, b)), f && f._handlePointerMove(a, b, c, d, null)
      }
    }, b._updatePointerPosition = function(a, b, c, d) {
      var e = this._getElementRect(this.canvas);
      c -= e.left, d -= e.top;
      var f = this.canvas.width,
        g = this.canvas.height;
      c /= (e.right - e.left) / f, d /= (e.bottom - e.top) / g;
      var h = this._getPointerData(a);
      (h.inBounds = c >= 0 && d >= 0 && f - 1 >= c && g - 1 >= d) ? (h.x = c, h.y = d) : this.mouseMoveOutside && (h.x = 0 > c ? 0 : c > f - 1 ? f - 1 : c, h.y = 0 > d ? 0 : d > g - 1 ? g - 1 : d), h.posEvtObj = b, h.rawX = c, h.rawY = d, (a === this._primaryPointerID || -1 === a) && (this.mouseX = h.x, this.mouseY = h.y, this.mouseInBounds = h.inBounds)
    }, b._handleMouseUp = function(a) {
      this._handlePointerUp(-1, a, !1)
    }, b._handlePointerUp = function(a, b, c, d) {
      var e = this._nextStage,
        f = this._getPointerData(a);
      if (!this._prevStage || void 0 !== d) {
        var g = null,
          h = f.target;
        d || !h && !e || (g = this._getObjectsUnderPoint(f.x, f.y, null, !0)), f.down && (this._dispatchMouseEvent(this, "stagemouseup", !1, a, f, b, g), f.down = !1), g == h && this._dispatchMouseEvent(h, "click", !0, a, f, b), this._dispatchMouseEvent(h, "pressup", !0, a, f, b), c ? (a == this._primaryPointerID && (this._primaryPointerID = null), delete this._pointerData[a]) : f.target = null, e && e._handlePointerUp(a, b, c, d || g && this)
      }
    }, b._handleMouseDown = function(a) {
      this._handlePointerDown(-1, a, a.pageX, a.pageY)
    }, b._handlePointerDown = function(a, b, c, d, e) {
      this.preventSelection && b.preventDefault(), (null == this._primaryPointerID || -1 === a) && (this._primaryPointerID = a), null != d && this._updatePointerPosition(a, b, c, d);
      var f = null,
        g = this._nextStage,
        h = this._getPointerData(a);
      e || (f = h.target = this._getObjectsUnderPoint(h.x, h.y, null, !0)), h.inBounds && (this._dispatchMouseEvent(this, "stagemousedown", !1, a, h, b, f), h.down = !0), this._dispatchMouseEvent(f, "mousedown", !0, a, h, b), g && g._handlePointerDown(a, b, c, d, e || f && this)
    }, b._testMouseOver = function(a, b, c) {
      if (!this._prevStage || void 0 !== b) {
        var d = this._nextStage;
        if (!this._mouseOverIntervalID) return void(d && d._testMouseOver(a, b, c));
        var e = this._getPointerData(-1);
        if (e && (a || this.mouseX != this._mouseOverX || this.mouseY != this._mouseOverY || !this.mouseInBounds)) {
          var f, g, h, i = e.posEvtObj,
            j = c || i && i.target == this.canvas,
            k = null,
            l = -1,
            m = "";
          !b && (a || this.mouseInBounds && j) && (k = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, !0), this._mouseOverX = this.mouseX, this._mouseOverY = this.mouseY);
          var n = this._mouseOverTarget || [],
            o = n[n.length - 1],
            p = this._mouseOverTarget = [];
          for (f = k; f;) p.unshift(f), m || (m = f.cursor), f = f.parent;
          for (this.canvas.style.cursor = m, !b && c && (c.canvas.style.cursor = m), g = 0, h = p.length; h > g && p[g] == n[g]; g++) l = g;
          for (o != k && this._dispatchMouseEvent(o, "mouseout", !0, -1, e, i, k), g = n.length - 1; g > l; g--) this._dispatchMouseEvent(n[g], "rollout", !1, -1, e, i, k);
          for (g = p.length - 1; g > l; g--) this._dispatchMouseEvent(p[g], "rollover", !1, -1, e, i, o);
          o != k && this._dispatchMouseEvent(k, "mouseover", !0, -1, e, i, o), d && d._testMouseOver(a, b || k && this, c || j && this)
        }
      }
    }, b._handleDoubleClick = function(a, b) {
      var c = null,
        d = this._nextStage,
        e = this._getPointerData(-1);
      b || (c = this._getObjectsUnderPoint(e.x, e.y, null, !0), this._dispatchMouseEvent(c, "dblclick", !0, -1, e, a)), d && d._handleDoubleClick(a, b || c && this)
    }, b._dispatchMouseEvent = function(a, b, c, d, e, f, g) {
      if (a && (c || a.hasEventListener(b))) {
        var h = new createjs.MouseEvent(b, c, !1, e.x, e.y, f, d, d === this._primaryPointerID || -1 === d, e.rawX, e.rawY, g);
        a.dispatchEvent(h)
      }
    }, createjs.Stage = createjs.promote(a, "Container")
  }(), this.createjs = this.createjs || {},
  function() {
    function a(a) {
      this.DisplayObject_constructor(), "string" == typeof a ? (this.image = document.createElement("img"), this.image.src = a) : this.image = a, this.sourceRect = null
    }
    var b = createjs.extend(a, createjs.DisplayObject);
    b.initialize = a, b.isVisible = function() {
      var a = this.image,
        b = this.cacheCanvas || a && (a.naturalWidth || a.getContext || a.readyState >= 2);
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && b)
    }, b.draw = function(a, b) {
      if (this.DisplayObject_draw(a, b) || !this.image) return !0;
      var c = this.image,
        d = this.sourceRect;
      if (d) {
        var e = d.x,
          f = d.y,
          g = e + d.width,
          h = f + d.height,
          i = 0,
          j = 0,
          k = c.width,
          l = c.height;
        0 > e && (i -= e, e = 0), g > k && (g = k), 0 > f && (j -= f, f = 0), h > l && (h = l), a.drawImage(c, e, f, g - e, h - f, i, j, g - e, h - f)
      } else a.drawImage(c, 0, 0);
      return !0
    }, b.getBounds = function() {
      var a = this.DisplayObject_getBounds();
      if (a) return a;
      var b = this.image,
        c = this.sourceRect || b,
        d = b && (b.naturalWidth || b.getContext || b.readyState >= 2);
      return d ? this._rectangle.setValues(0, 0, c.width, c.height) : null
    }, b.clone = function() {
      var b = new a(this.image);
      return this.sourceRect && (b.sourceRect = this.sourceRect.clone()), this._cloneProps(b), b
    }, b.toString = function() {
      return "[Bitmap (name=" + this.name + ")]"
    }, createjs.Bitmap = createjs.promote(a, "DisplayObject")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.DisplayObject_constructor(), this.currentFrame = 0, this.currentAnimation = null, this.paused = !0, this.spriteSheet = a, this.currentAnimationFrame = 0, this.framerate = 0, this._animation = null, this._currentFrame = null, this._skipAdvance = !1, null != b && this.gotoAndPlay(b)
    }
    var b = createjs.extend(a, createjs.DisplayObject);
    b.initialize = a, b.isVisible = function() {
      var a = this.cacheCanvas || this.spriteSheet.complete;
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
    }, b.draw = function(a, b) {
      if (this.DisplayObject_draw(a, b)) return !0;
      this._normalizeFrame();
      var c = this.spriteSheet.getFrame(0 | this._currentFrame);
      if (!c) return !1;
      var d = c.rect;
      return d.width && d.height && a.drawImage(c.image, d.x, d.y, d.width, d.height, -c.regX, -c.regY, d.width, d.height), !0
    }, b.play = function() {
      this.paused = !1
    }, b.stop = function() {
      this.paused = !0
    }, b.gotoAndPlay = function(a) {
      this.paused = !1, this._skipAdvance = !0, this._goto(a)
    }, b.gotoAndStop = function(a) {
      this.paused = !0, this._goto(a)
    }, b.advance = function(a) {
      var b = this.framerate || this.spriteSheet.framerate,
        c = b && null != a ? a / (1e3 / b) : 1;
      this._normalizeFrame(c)
    }, b.getBounds = function() {
      return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle)
    }, b.clone = function() {
      return this._cloneProps(new a(this.spriteSheet))
    }, b.toString = function() {
      return "[Sprite (name=" + this.name + ")]"
    }, b._cloneProps = function(a) {
      return this.DisplayObject__cloneProps(a), a.currentFrame = this.currentFrame, a.currentAnimation = this.currentAnimation, a.paused = this.paused, a.currentAnimationFrame = this.currentAnimationFrame, a.framerate = this.framerate, a._animation = this._animation, a._currentFrame = this._currentFrame, a._skipAdvance = this._skipAdvance, a
    }, b._tick = function(a) {
      this.paused || (this._skipAdvance || this.advance(a && a.delta), this._skipAdvance = !1), this.DisplayObject__tick(a)
    }, b._normalizeFrame = function(a) {
      a = a || 0;
      var b, c = this._animation,
        d = this.paused,
        e = this._currentFrame;
      if (c) {
        var f = c.speed || 1,
          g = this.currentAnimationFrame;
        if (b = c.frames.length, g + a * f >= b) {
          var h = c.next;
          if (this._dispatchAnimationEnd(c, e, d, h, b - 1)) return;
          if (h) return this._goto(h, a - (b - g) / f);
          this.paused = !0, g = c.frames.length - 1
        } else g += a * f;
        this.currentAnimationFrame = g, this._currentFrame = c.frames[0 | g]
      } else if (e = this._currentFrame += a, b = this.spriteSheet.getNumFrames(), e >= b && b > 0 && !this._dispatchAnimationEnd(c, e, d, b - 1) && (this._currentFrame -= b) >= b) return this._normalizeFrame();
      e = 0 | this._currentFrame, this.currentFrame != e && (this.currentFrame = e, this.dispatchEvent("change"))
    }, b._dispatchAnimationEnd = function(a, b, c, d, e) {
      var f = a ? a.name : null;
      if (this.hasEventListener("animationend")) {
        var g = new createjs.Event("animationend");
        g.name = f, g.next = d, this.dispatchEvent(g)
      }
      var h = this._animation != a || this._currentFrame != b;
      return h || c || !this.paused || (this.currentAnimationFrame = e, h = !0), h
    }, b._goto = function(a, b) {
      if (this.currentAnimationFrame = 0, isNaN(a)) {
        var c = this.spriteSheet.getAnimation(a);
        c && (this._animation = c, this.currentAnimation = a, this._normalizeFrame(b))
      } else this.currentAnimation = this._animation = null, this._currentFrame = a, this._normalizeFrame()
    }, createjs.Sprite = createjs.promote(a, "DisplayObject")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.DisplayObject_constructor(), this.graphics = a ? a : new createjs.Graphics
    }
    var b = createjs.extend(a, createjs.DisplayObject);
    b.isVisible = function() {
      var a = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
    }, b.draw = function(a, b) {
      return this.DisplayObject_draw(a, b) ? !0 : (this.graphics.draw(a, this), !0)
    }, b.clone = function(b) {
      var c = b && this.graphics ? this.graphics.clone() : this.graphics;
      return this._cloneProps(new a(c))
    }, b.toString = function() {
      return "[Shape (name=" + this.name + ")]"
    }, createjs.Shape = createjs.promote(a, "DisplayObject")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.DisplayObject_constructor(), this.text = a, this.font = b, this.color = c, this.textAlign = "left", this.textBaseline = "top", this.maxWidth = null, this.outline = 0, this.lineHeight = 0, this.lineWidth = null
    }
    var b = createjs.extend(a, createjs.DisplayObject),
      c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    c.getContext && (a._workingContext = c.getContext("2d"), c.width = c.height = 1), a.H_OFFSETS = {
      start: 0,
      left: 0,
      center: -.5,
      end: -1,
      right: -1
    }, a.V_OFFSETS = {
      top: 0,
      hanging: -.01,
      middle: -.4,
      alphabetic: -.8,
      ideographic: -.85,
      bottom: -1
    }, b.isVisible = function() {
      var a = this.cacheCanvas || null != this.text && "" !== this.text;
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
    }, b.draw = function(a, b) {
      if (this.DisplayObject_draw(a, b)) return !0;
      var c = this.color || "#000";
      return this.outline ? (a.strokeStyle = c, a.lineWidth = 1 * this.outline) : a.fillStyle = c, this._drawText(this._prepContext(a)), !0
    }, b.getMeasuredWidth = function() {
      return this._getMeasuredWidth(this.text)
    }, b.getMeasuredLineHeight = function() {
      return 1.2 * this._getMeasuredWidth("M")
    }, b.getMeasuredHeight = function() {
      return this._drawText(null, {}).height
    }, b.getBounds = function() {
      var b = this.DisplayObject_getBounds();
      if (b) return b;
      if (null == this.text || "" === this.text) return null;
      var c = this._drawText(null, {}),
        d = this.maxWidth && this.maxWidth < c.width ? this.maxWidth : c.width,
        e = d * a.H_OFFSETS[this.textAlign || "left"],
        f = this.lineHeight || this.getMeasuredLineHeight(),
        g = f * a.V_OFFSETS[this.textBaseline || "top"];
      return this._rectangle.setValues(e, g, d, c.height)
    }, b.getMetrics = function() {
      var b = {
        lines: []
      };
      return b.lineHeight = this.lineHeight || this.getMeasuredLineHeight(), b.vOffset = b.lineHeight * a.V_OFFSETS[this.textBaseline || "top"], this._drawText(null, b, b.lines)
    }, b.clone = function() {
      return this._cloneProps(new a(this.text, this.font, this.color))
    }, b.toString = function() {
      return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
    }, b._cloneProps = function(a) {
      return this.DisplayObject__cloneProps(a), a.textAlign = this.textAlign, a.textBaseline = this.textBaseline, a.maxWidth = this.maxWidth, a.outline = this.outline, a.lineHeight = this.lineHeight, a.lineWidth = this.lineWidth, a
    }, b._prepContext = function(a) {
      return a.font = this.font || "10px sans-serif", a.textAlign = this.textAlign || "left", a.textBaseline = this.textBaseline || "top", a
    }, b._drawText = function(b, c, d) {
      var e = !!b;
      e || (b = a._workingContext, b.save(), this._prepContext(b));
      for (var f = this.lineHeight || this.getMeasuredLineHeight(), g = 0, h = 0, i = String(this.text).split(/(?:\r\n|\r|\n)/), j = 0, k = i.length; k > j; j++) {
        var l = i[j],
          m = null;
        if (null != this.lineWidth && (m = b.measureText(l).width) > this.lineWidth) {
          var n = l.split(/(\s)/);
          l = n[0], m = b.measureText(l).width;
          for (var o = 1, p = n.length; p > o; o += 2) {
            var q = b.measureText(n[o] + n[o + 1]).width;
            m + q > this.lineWidth ? (e && this._drawTextLine(b, l, h * f), d && d.push(l), m > g && (g = m), l = n[o + 1], m = b.measureText(l).width, h++) : (l += n[o] + n[o + 1], m += q)
          }
        }
        e && this._drawTextLine(b, l, h * f), d && d.push(l), c && null == m && (m = b.measureText(l).width), m > g && (g = m), h++
      }
      return c && (c.width = g, c.height = h * f), e || b.restore(), c
    }, b._drawTextLine = function(a, b, c) {
      this.outline ? a.strokeText(b, 0, c, this.maxWidth || 65535) : a.fillText(b, 0, c, this.maxWidth || 65535)
    }, b._getMeasuredWidth = function(b) {
      var c = a._workingContext;
      c.save();
      var d = this._prepContext(c).measureText(b).width;
      return c.restore(), d
    }, createjs.Text = createjs.promote(a, "DisplayObject")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.Container_constructor(), this.text = a || "", this.spriteSheet = b, this.lineHeight = 0, this.letterSpacing = 0, this.spaceWidth = 0, this._oldProps = {
        text: 0,
        spriteSheet: 0,
        lineHeight: 0,
        letterSpacing: 0,
        spaceWidth: 0
      }
    }
    var b = createjs.extend(a, createjs.Container);
    a.maxPoolSize = 100, a._spritePool = [], b.draw = function(a, b) {
      this.DisplayObject_draw(a, b) || (this._updateText(), this.Container_draw(a, b))
    }, b.getBounds = function() {
      return this._updateText(), this.Container_getBounds()
    }, b.isVisible = function() {
      var a = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
      return !!(this.visible && this.alpha > 0 && 0 !== this.scaleX && 0 !== this.scaleY && a)
    }, b.clone = function() {
      return this._cloneProps(new a(this.text, this.spriteSheet))
    }, b.addChild = b.addChildAt = b.removeChild = b.removeChildAt = b.removeAllChildren = function() {}, b._cloneProps = function(a) {
      return this.Container__cloneProps(a), a.lineHeight = this.lineHeight, a.letterSpacing = this.letterSpacing, a.spaceWidth = this.spaceWidth, a
    }, b._getFrameIndex = function(a, b) {
      var c, d = b.getAnimation(a);
      return d || (a != (c = a.toUpperCase()) || a != (c = a.toLowerCase()) || (c = null), c && (d = b.getAnimation(c))), d && d.frames[0]
    }, b._getFrame = function(a, b) {
      var c = this._getFrameIndex(a, b);
      return null == c ? c : b.getFrame(c)
    }, b._getLineHeight = function(a) {
      var b = this._getFrame("1", a) || this._getFrame("T", a) || this._getFrame("L", a) || a.getFrame(0);
      return b ? b.rect.height : 1
    }, b._getSpaceWidth = function(a) {
      var b = this._getFrame("1", a) || this._getFrame("l", a) || this._getFrame("e", a) || this._getFrame("a", a) || a.getFrame(0);
      return b ? b.rect.width : 1
    }, b._updateText = function() {
      var b, c = 0,
        d = 0,
        e = this._oldProps,
        f = !1,
        g = this.spaceWidth,
        h = this.lineHeight,
        i = this.spriteSheet,
        j = a._spritePool,
        k = this.children,
        l = 0,
        m = k.length;
      for (var n in e) e[n] != this[n] && (e[n] = this[n], f = !0);
      if (f) {
        var o = !!this._getFrame(" ", i);
        o || g || (g = this._getSpaceWidth(i)), h || (h = this._getLineHeight(i));
        for (var p = 0, q = this.text.length; q > p; p++) {
          var r = this.text.charAt(p);
          if (" " != r || o)
            if ("\n" != r && "\r" != r) {
              var s = this._getFrameIndex(r, i);
              null != s && (m > l ? b = k[l] : (k.push(b = j.length ? j.pop() : new createjs.Sprite), b.parent = this, m++), b.spriteSheet = i, b.gotoAndStop(s), b.x = c, b.y = d, l++, c += b.getBounds().width + this.letterSpacing)
            } else "\r" == r && "\n" == this.text.charAt(p + 1) && p++, c = 0, d += h;
          else c += g
        }
        for (; m > l;) j.push(b = k.pop()), b.parent = null, m--;
        j.length > a.maxPoolSize && (j.length = a.maxPoolSize)
      }
    }, createjs.BitmapText = createjs.promote(a, "Container")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(b, c, d, e) {
      this.Container_constructor(), !a.inited && a.init(), this.mode = b || a.INDEPENDENT, this.startPosition = c || 0, this.loop = d, this.currentFrame = 0, this.timeline = new createjs.Timeline(null, e, {
        paused: !0,
        position: c,
        useTicks: !0
      }), this.paused = !1, this.actionsEnabled = !0, this.autoReset = !0, this.frameBounds = this.frameBounds || null, this.framerate = null, this._synchOffset = 0, this._prevPos = -1, this._prevPosition = 0, this._t = 0, this._managed = {}
    }

    function b() {
      throw "MovieClipPlugin cannot be instantiated."
    }
    var c = createjs.extend(a, createjs.Container);
    a.INDEPENDENT = "independent", a.SINGLE_FRAME = "single", a.SYNCHED = "synched", a.inited = !1, a.init = function() {
      a.inited || (b.install(), a.inited = !0)
    }, c.getLabels = function() {
      return this.timeline.getLabels()
    }, c.getCurrentLabel = function() {
      return this._updateTimeline(), this.timeline.getCurrentLabel()
    }, c.getDuration = function() {
      return this.timeline.duration;
    };
    try {
      Object.defineProperties(c, {
        labels: {
          get: c.getLabels
        },
        currentLabel: {
          get: c.getCurrentLabel
        },
        totalFrames: {
          get: c.getDuration
        },
        duration: {
          get: c.getDuration
        }
      })
    } catch (d) {}
    c.initialize = a, c.isVisible = function() {
      return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY)
    }, c.draw = function(a, b) {
      return this.DisplayObject_draw(a, b) ? !0 : (this._updateTimeline(), this.Container_draw(a, b), !0)
    }, c.play = function() {
      this.paused = !1
    }, c.stop = function() {
      this.paused = !0
    }, c.gotoAndPlay = function(a) {
      this.paused = !1, this._goto(a)
    }, c.gotoAndStop = function(a) {
      this.paused = !0, this._goto(a)
    }, c.advance = function(b) {
      var c = a.INDEPENDENT;
      if (this.mode == c) {
        for (var d = this, e = d.framerate;
          (d = d.parent) && null == e;) d.mode == c && (e = d._framerate);
        this._framerate = e;
        var f = null != e && -1 != e && null != b ? b / (1e3 / e) + this._t : 1,
          g = 0 | f;
        for (this._t = f - g; !this.paused && g--;) this._prevPosition = this._prevPos < 0 ? 0 : this._prevPosition + 1, this._updateTimeline()
      }
    }, c.clone = function() {
      throw "MovieClip cannot be cloned."
    }, c.toString = function() {
      return "[MovieClip (name=" + this.name + ")]"
    }, c._tick = function(a) {
      this.advance(a && a.delta), this.Container__tick(a)
    }, c._goto = function(a) {
      var b = this.timeline.resolve(a);
      null != b && (-1 == this._prevPos && (this._prevPos = NaN), this._prevPosition = b, this._t = 0, this._updateTimeline())
    }, c._reset = function() {
      this._prevPos = -1, this._t = this.currentFrame = 0, this.paused = !1
    }, c._updateTimeline = function() {
      var b = this.timeline,
        c = this.mode != a.INDEPENDENT;
      b.loop = null == this.loop ? !0 : this.loop;
      var d = c ? this.startPosition + (this.mode == a.SINGLE_FRAME ? 0 : this._synchOffset) : this._prevPos < 0 ? 0 : this._prevPosition,
        e = c || !this.actionsEnabled ? createjs.Tween.NONE : null;
      if (this.currentFrame = b._calcPosition(d), b.setPosition(d, e), this._prevPosition = b._prevPosition, this._prevPos != b._prevPos) {
        this.currentFrame = this._prevPos = b._prevPos;
        for (var f in this._managed) this._managed[f] = 1;
        for (var g = b._tweens, h = 0, i = g.length; i > h; h++) {
          var j = g[h],
            k = j._target;
          if (k != this && !j.passive) {
            var l = j._stepPosition;
            k instanceof createjs.DisplayObject ? this._addManagedChild(k, l) : this._setState(k.state, l)
          }
        }
        var m = this.children;
        for (h = m.length - 1; h >= 0; h--) {
          var n = m[h].id;
          1 == this._managed[n] && (this.removeChildAt(h), delete this._managed[n])
        }
      }
    }, c._setState = function(a, b) {
      if (a)
        for (var c = a.length - 1; c >= 0; c--) {
          var d = a[c],
            e = d.t,
            f = d.p;
          for (var g in f) e[g] = f[g];
          this._addManagedChild(e, b)
        }
    }, c._addManagedChild = function(b, c) {
      b._off || (this.addChildAt(b, 0), b instanceof a && (b._synchOffset = c, b.mode == a.INDEPENDENT && b.autoReset && !this._managed[b.id] && b._reset()), this._managed[b.id] = 2)
    }, c._getBounds = function(a, b) {
      var c = this.DisplayObject_getBounds();
      return c || (this._updateTimeline(), this.frameBounds && (c = this._rectangle.copy(this.frameBounds[this.currentFrame]))), c ? this._transformBounds(c, a, b) : this.Container__getBounds(a, b)
    }, createjs.MovieClip = createjs.promote(a, "Container"), b.priority = 100, b.install = function() {
      createjs.Tween.installPlugin(b, ["startPosition"])
    }, b.init = function(a, b, c) {
      return c
    }, b.step = function() {}, b.tween = function(b, c, d, e, f, g, h, i) {
      return b.target instanceof a ? 1 == g ? f[c] : e[c] : d
    }
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "SpriteSheetUtils cannot be instantiated"
    }
    var b = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    b.getContext && (a._workingCanvas = b, a._workingContext = b.getContext("2d"), b.width = b.height = 1), a.addFlippedFrames = function(b, c, d, e) {
      if (c || d || e) {
        var f = 0;
        c && a._flip(b, ++f, !0, !1), d && a._flip(b, ++f, !1, !0), e && a._flip(b, ++f, !0, !0)
      }
    }, a.extractFrame = function(b, c) {
      isNaN(c) && (c = b.getAnimation(c).frames[0]);
      var d = b.getFrame(c);
      if (!d) return null;
      var e = d.rect,
        f = a._workingCanvas;
      f.width = e.width, f.height = e.height, a._workingContext.drawImage(d.image, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height);
      var g = document.createElement("img");
      return g.src = f.toDataURL("image/png"), g
    }, a.mergeAlpha = function(a, b, c) {
      c || (c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")), c.width = Math.max(b.width, a.width), c.height = Math.max(b.height, a.height);
      var d = c.getContext("2d");
      return d.save(), d.drawImage(a, 0, 0), d.globalCompositeOperation = "destination-in", d.drawImage(b, 0, 0), d.restore(), c
    }, a._flip = function(b, c, d, e) {
      for (var f = b._images, g = a._workingCanvas, h = a._workingContext, i = f.length / c, j = 0; i > j; j++) {
        var k = f[j];
        k.__tmp = j, h.setTransform(1, 0, 0, 1, 0, 0), h.clearRect(0, 0, g.width + 1, g.height + 1), g.width = k.width, g.height = k.height, h.setTransform(d ? -1 : 1, 0, 0, e ? -1 : 1, d ? k.width : 0, e ? k.height : 0), h.drawImage(k, 0, 0);
        var l = document.createElement("img");
        l.src = g.toDataURL("image/png"), l.width = k.width, l.height = k.height, f.push(l)
      }
      var m = b._frames,
        n = m.length / c;
      for (j = 0; n > j; j++) {
        k = m[j];
        var o = k.rect.clone();
        l = f[k.image.__tmp + i * c];
        var p = {
          image: l,
          rect: o,
          regX: k.regX,
          regY: k.regY
        };
        d && (o.x = l.width - o.x - o.width, p.regX = o.width - k.regX), e && (o.y = l.height - o.y - o.height, p.regY = o.height - k.regY), m.push(p)
      }
      var q = "_" + (d ? "h" : "") + (e ? "v" : ""),
        r = b._animations,
        s = b._data,
        t = r.length / c;
      for (j = 0; t > j; j++) {
        var u = r[j];
        k = s[u];
        var v = {
          name: u + q,
          speed: k.speed,
          next: k.next,
          frames: []
        };
        k.next && (v.next += q), m = k.frames;
        for (var w = 0, x = m.length; x > w; w++) v.frames.push(m[w] + n * c);
        s[v.name] = v, r.push(v.name)
      }
    }, createjs.SpriteSheetUtils = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.EventDispatcher_constructor(), this.maxWidth = 2048, this.maxHeight = 2048, this.spriteSheet = null, this.scale = 1, this.padding = 1, this.timeSlice = .3, this.progress = -1, this.framerate = a || 0, this._frames = [], this._animations = {}, this._data = null, this._nextFrameIndex = 0, this._index = 0, this._timerID = null, this._scale = 1
    }
    var b = createjs.extend(a, createjs.EventDispatcher);
    a.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions", a.ERR_RUNNING = "a build is already running", b.addFrame = function(b, c, d, e, f) {
      if (this._data) throw a.ERR_RUNNING;
      var g = c || b.bounds || b.nominalBounds;
      return !g && b.getBounds && (g = b.getBounds()), g ? (d = d || 1, this._frames.push({
        source: b,
        sourceRect: g,
        scale: d,
        funct: e,
        data: f,
        index: this._frames.length,
        height: g.height * d
      }) - 1) : null
    }, b.addAnimation = function(b, c, d, e) {
      if (this._data) throw a.ERR_RUNNING;
      this._animations[b] = {
        frames: c,
        next: d,
        speed: e
      }
    }, b.addMovieClip = function(b, c, d, e, f, g) {
      if (this._data) throw a.ERR_RUNNING;
      var h = b.frameBounds,
        i = c || b.bounds || b.nominalBounds;
      if (!i && b.getBounds && (i = b.getBounds()), i || h) {
        var j, k, l = this._frames.length,
          m = b.timeline.duration;
        for (j = 0; m > j; j++) {
          var n = h && h[j] ? h[j] : i;
          this.addFrame(b, n, d, this._setupMovieClipFrame, {
            i: j,
            f: e,
            d: f
          })
        }
        var o = b.timeline._labels,
          p = [];
        for (var q in o) p.push({
          index: o[q],
          label: q
        });
        if (p.length)
          for (p.sort(function(a, b) {
              return a.index - b.index
            }), j = 0, k = p.length; k > j; j++) {
            for (var r = p[j].label, s = l + p[j].index, t = l + (j == k - 1 ? m : p[j + 1].index), u = [], v = s; t > v; v++) u.push(v);
            (!g || (r = g(r, b, s, t))) && this.addAnimation(r, u, !0)
          }
      }
    }, b.build = function() {
      if (this._data) throw a.ERR_RUNNING;
      for (this._startBuild(); this._drawNext(););
      return this._endBuild(), this.spriteSheet
    }, b.buildAsync = function(b) {
      if (this._data) throw a.ERR_RUNNING;
      this.timeSlice = b, this._startBuild();
      var c = this;
      this._timerID = setTimeout(function() {
        c._run()
      }, 50 - 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)))
    }, b.stopAsync = function() {
      clearTimeout(this._timerID), this._data = null
    }, b.clone = function() {
      throw "SpriteSheetBuilder cannot be cloned."
    }, b.toString = function() {
      return "[SpriteSheetBuilder]"
    }, b._startBuild = function() {
      var b = this.padding || 0;
      this.progress = 0, this.spriteSheet = null, this._index = 0, this._scale = this.scale;
      var c = [];
      this._data = {
        images: [],
        frames: c,
        framerate: this.framerate,
        animations: this._animations
      };
      var d = this._frames.slice();
      if (d.sort(function(a, b) {
          return a.height <= b.height ? -1 : 1
        }), d[d.length - 1].height + 2 * b > this.maxHeight) throw a.ERR_DIMENSIONS;
      for (var e = 0, f = 0, g = 0; d.length;) {
        var h = this._fillRow(d, e, g, c, b);
        if (h.w > f && (f = h.w), e += h.h, !h.h || !d.length) {
          var i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
          i.width = this._getSize(f, this.maxWidth), i.height = this._getSize(e, this.maxHeight), this._data.images[g] = i, h.h || (f = e = 0, g++)
        }
      }
    }, b._setupMovieClipFrame = function(a, b) {
      var c = a.actionsEnabled;
      a.actionsEnabled = !1, a.gotoAndStop(b.i), a.actionsEnabled = c, b.f && b.f(a, b.d, b.i)
    }, b._getSize = function(a, b) {
      for (var c = 4; Math.pow(2, ++c) < a;);
      return Math.min(b, Math.pow(2, c))
    }, b._fillRow = function(b, c, d, e, f) {
      var g = this.maxWidth,
        h = this.maxHeight;
      c += f;
      for (var i = h - c, j = f, k = 0, l = b.length - 1; l >= 0; l--) {
        var m = b[l],
          n = this._scale * m.scale,
          o = m.sourceRect,
          p = m.source,
          q = Math.floor(n * o.x - f),
          r = Math.floor(n * o.y - f),
          s = Math.ceil(n * o.height + 2 * f),
          t = Math.ceil(n * o.width + 2 * f);
        if (t > g) throw a.ERR_DIMENSIONS;
        s > i || j + t > g || (m.img = d, m.rect = new createjs.Rectangle(j, c, t, s), k = k || s, b.splice(l, 1), e[m.index] = [j, c, t, s, d, Math.round(-q + n * p.regX - f), Math.round(-r + n * p.regY - f)], j += t)
      }
      return {
        w: j,
        h: k
      }
    }, b._endBuild = function() {
      this.spriteSheet = new createjs.SpriteSheet(this._data), this._data = null, this.progress = 1, this.dispatchEvent("complete")
    }, b._run = function() {
      for (var a = 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)), b = (new Date).getTime() + a, c = !1; b > (new Date).getTime();)
        if (!this._drawNext()) {
          c = !0;
          break
        } if (c) this._endBuild();
      else {
        var d = this;
        this._timerID = setTimeout(function() {
          d._run()
        }, 50 - a)
      }
      var e = this.progress = this._index / this._frames.length;
      if (this.hasEventListener("progress")) {
        var f = new createjs.Event("progress");
        f.progress = e, this.dispatchEvent(f)
      }
    }, b._drawNext = function() {
      var a = this._frames[this._index],
        b = a.scale * this._scale,
        c = a.rect,
        d = a.sourceRect,
        e = this._data.images[a.img],
        f = e.getContext("2d");
      return a.funct && a.funct(a.source, a.data), f.save(), f.beginPath(), f.rect(c.x, c.y, c.width, c.height), f.clip(), f.translate(Math.ceil(c.x - d.x * b), Math.ceil(c.y - d.y * b)), f.scale(b, b), a.source.draw(f), f.restore(), ++this._index < this._frames.length
    }, createjs.SpriteSheetBuilder = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.DisplayObject_constructor(), "string" == typeof a && (a = document.getElementById(a)), this.mouseEnabled = !1;
      var b = a.style;
      b.position = "absolute", b.transformOrigin = b.WebkitTransformOrigin = b.msTransformOrigin = b.MozTransformOrigin = b.OTransformOrigin = "0% 0%", this.htmlElement = a, this._oldProps = null
    }
    var b = createjs.extend(a, createjs.DisplayObject);
    b.isVisible = function() {
      return null != this.htmlElement
    }, b.draw = function(a, b) {
      return !0
    }, b.cache = function() {}, b.uncache = function() {}, b.updateCache = function() {}, b.hitTest = function() {}, b.localToGlobal = function() {}, b.globalToLocal = function() {}, b.localToLocal = function() {}, b.clone = function() {
      throw "DOMElement cannot be cloned."
    }, b.toString = function() {
      return "[DOMElement (name=" + this.name + ")]"
    }, b._tick = function(a) {
      var b = this.getStage();
      b && b.on("drawend", this._handleDrawEnd, this, !0), this.DisplayObject__tick(a)
    }, b._handleDrawEnd = function(a) {
      var b = this.htmlElement;
      if (b) {
        var c = b.style,
          d = this.getConcatenatedDisplayProps(this._props),
          e = d.matrix,
          f = d.visible ? "visible" : "hidden";
        if (f != c.visibility && (c.visibility = f), d.visible) {
          var g = this._oldProps,
            h = g && g.matrix,
            i = 1e4;
          if (!h || !h.equals(e)) {
            var j = "matrix(" + (e.a * i | 0) / i + "," + (e.b * i | 0) / i + "," + (e.c * i | 0) / i + "," + (e.d * i | 0) / i + "," + (e.tx + .5 | 0);
            c.transform = c.WebkitTransform = c.OTransform = c.msTransform = j + "," + (e.ty + .5 | 0) + ")", c.MozTransform = j + "px," + (e.ty + .5 | 0) + "px)", g || (g = this._oldProps = new createjs.DisplayProps(!0, NaN)), g.matrix.copy(e)
          }
          g.alpha != d.alpha && (c.opacity = "" + (d.alpha * i | 0) / i, g.alpha = d.alpha)
        }
      }
    }, createjs.DOMElement = createjs.promote(a, "DisplayObject")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {}
    var b = a.prototype;
    b.getBounds = function(a) {
      return a
    }, b.applyFilter = function(a, b, c, d, e, f, g, h) {
      f = f || a, null == g && (g = b), null == h && (h = c);
      try {
        var i = a.getImageData(b, c, d, e)
      } catch (j) {
        return !1
      }
      return this._applyFilter(i) ? (f.putImageData(i, g, h), !0) : !1
    }, b.toString = function() {
      return "[Filter]"
    }, b.clone = function() {
      return new a
    }, b._applyFilter = function(a) {
      return !0
    }, createjs.Filter = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      (isNaN(a) || 0 > a) && (a = 0), (isNaN(b) || 0 > b) && (b = 0), (isNaN(c) || 1 > c) && (c = 1), this.blurX = 0 | a, this.blurY = 0 | b, this.quality = 0 | c
    }
    var b = createjs.extend(a, createjs.Filter);
    a.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1], a.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9], b.getBounds = function(a) {
      var b = 0 | this.blurX,
        c = 0 | this.blurY;
      if (0 >= b && 0 >= c) return a;
      var d = Math.pow(this.quality, .2);
      return (a || new createjs.Rectangle).pad(b * d + 1, c * d + 1, b * d + 1, c * d + 1)
    }, b.clone = function() {
      return new a(this.blurX, this.blurY, this.quality)
    }, b.toString = function() {
      return "[BlurFilter]"
    }, b._applyFilter = function(b) {
      var c = this.blurX >> 1;
      if (isNaN(c) || 0 > c) return !1;
      var d = this.blurY >> 1;
      if (isNaN(d) || 0 > d) return !1;
      if (0 == c && 0 == d) return !1;
      var e = this.quality;
      (isNaN(e) || 1 > e) && (e = 1), e |= 0, e > 3 && (e = 3), 1 > e && (e = 1);
      var f = b.data,
        g = 0,
        h = 0,
        i = 0,
        j = 0,
        k = 0,
        l = 0,
        m = 0,
        n = 0,
        o = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        t = 0,
        u = 0,
        v = c + c + 1 | 0,
        w = d + d + 1 | 0,
        x = 0 | b.width,
        y = 0 | b.height,
        z = x - 1 | 0,
        A = y - 1 | 0,
        B = c + 1 | 0,
        C = d + 1 | 0,
        D = {
          r: 0,
          b: 0,
          g: 0,
          a: 0
        },
        E = D;
      for (i = 1; v > i; i++) E = E.n = {
        r: 0,
        b: 0,
        g: 0,
        a: 0
      };
      E.n = D;
      var F = {
          r: 0,
          b: 0,
          g: 0,
          a: 0
        },
        G = F;
      for (i = 1; w > i; i++) G = G.n = {
        r: 0,
        b: 0,
        g: 0,
        a: 0
      };
      G.n = F;
      for (var H = null, I = 0 | a.MUL_TABLE[c], J = 0 | a.SHG_TABLE[c], K = 0 | a.MUL_TABLE[d], L = 0 | a.SHG_TABLE[d]; e-- > 0;) {
        m = l = 0;
        var M = I,
          N = J;
        for (h = y; --h > -1;) {
          for (n = B * (r = f[0 | l]), o = B * (s = f[l + 1 | 0]), p = B * (t = f[l + 2 | 0]), q = B * (u = f[l + 3 | 0]), E = D, i = B; --i > -1;) E.r = r, E.g = s, E.b = t, E.a = u, E = E.n;
          for (i = 1; B > i; i++) j = l + ((i > z ? z : i) << 2) | 0, n += E.r = f[j], o += E.g = f[j + 1], p += E.b = f[j + 2], q += E.a = f[j + 3], E = E.n;
          for (H = D, g = 0; x > g; g++) f[l++] = n * M >>> N, f[l++] = o * M >>> N, f[l++] = p * M >>> N, f[l++] = q * M >>> N, j = m + ((j = g + c + 1) < z ? j : z) << 2, n -= H.r - (H.r = f[j]), o -= H.g - (H.g = f[j + 1]), p -= H.b - (H.b = f[j + 2]), q -= H.a - (H.a = f[j + 3]), H = H.n;
          m += x
        }
        for (M = K, N = L, g = 0; x > g; g++) {
          for (l = g << 2 | 0, n = C * (r = f[l]) | 0, o = C * (s = f[l + 1 | 0]) | 0, p = C * (t = f[l + 2 | 0]) | 0, q = C * (u = f[l + 3 | 0]) | 0, G = F, i = 0; C > i; i++) G.r = r, G.g = s, G.b = t, G.a = u, G = G.n;
          for (k = x, i = 1; d >= i; i++) l = k + g << 2, n += G.r = f[l], o += G.g = f[l + 1], p += G.b = f[l + 2], q += G.a = f[l + 3], G = G.n, A > i && (k += x);
          if (l = g, H = F, e > 0)
            for (h = 0; y > h; h++) j = l << 2, f[j + 3] = u = q * M >>> N, u > 0 ? (f[j] = n * M >>> N, f[j + 1] = o * M >>> N, f[j + 2] = p * M >>> N) : f[j] = f[j + 1] = f[j + 2] = 0, j = g + ((j = h + C) < A ? j : A) * x << 2, n -= H.r - (H.r = f[j]), o -= H.g - (H.g = f[j + 1]), p -= H.b - (H.b = f[j + 2]), q -= H.a - (H.a = f[j + 3]), H = H.n, l += x;
          else
            for (h = 0; y > h; h++) j = l << 2, f[j + 3] = u = q * M >>> N, u > 0 ? (u = 255 / u, f[j] = (n * M >>> N) * u, f[j + 1] = (o * M >>> N) * u, f[j + 2] = (p * M >>> N) * u) : f[j] = f[j + 1] = f[j + 2] = 0, j = g + ((j = h + C) < A ? j : A) * x << 2, n -= H.r - (H.r = f[j]), o -= H.g - (H.g = f[j + 1]), p -= H.b - (H.b = f[j + 2]), q -= H.a - (H.a = f[j + 3]), H = H.n, l += x
        }
      }
      return !0
    }, createjs.BlurFilter = createjs.promote(a, "Filter")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.alphaMap = a, this._alphaMap = null, this._mapData = null
    }
    var b = createjs.extend(a, createjs.Filter);
    b.clone = function() {
      var b = new a(this.alphaMap);
      return b._alphaMap = this._alphaMap, b._mapData = this._mapData, b
    }, b.toString = function() {
      return "[AlphaMapFilter]"
    }, b._applyFilter = function(a) {
      if (!this.alphaMap) return !0;
      if (!this._prepAlphaMap()) return !1;
      for (var b = a.data, c = this._mapData, d = 0, e = b.length; e > d; d += 4) b[d + 3] = c[d] || 0;
      return !0
    }, b._prepAlphaMap = function() {
      if (!this.alphaMap) return !1;
      if (this.alphaMap == this._alphaMap && this._mapData) return !0;
      this._mapData = null;
      var a, b = this._alphaMap = this.alphaMap,
        c = b;
      b instanceof HTMLCanvasElement ? a = c.getContext("2d") : (c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"), c.width = b.width, c.height = b.height, a = c.getContext("2d"), a.drawImage(b, 0, 0));
      try {
        var d = a.getImageData(0, 0, b.width, b.height)
      } catch (e) {
        return !1
      }
      return this._mapData = d.data, !0
    }, createjs.AlphaMapFilter = createjs.promote(a, "Filter")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.mask = a
    }
    var b = createjs.extend(a, createjs.Filter);
    b.applyFilter = function(a, b, c, d, e, f, g, h) {
      return this.mask ? (f = f || a, null == g && (g = b), null == h && (h = c), f.save(), a != f ? !1 : (f.globalCompositeOperation = "destination-in", f.drawImage(this.mask, g, h), f.restore(), !0)) : !0
    }, b.clone = function() {
      return new a(this.mask)
    }, b.toString = function() {
      return "[AlphaMaskFilter]"
    }, createjs.AlphaMaskFilter = createjs.promote(a, "Filter")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d, e, f, g, h) {
      this.redMultiplier = null != a ? a : 1, this.greenMultiplier = null != b ? b : 1, this.blueMultiplier = null != c ? c : 1, this.alphaMultiplier = null != d ? d : 1, this.redOffset = e || 0, this.greenOffset = f || 0, this.blueOffset = g || 0, this.alphaOffset = h || 0
    }
    var b = createjs.extend(a, createjs.Filter);
    b.toString = function() {
      return "[ColorFilter]"
    }, b.clone = function() {
      return new a(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset)
    }, b._applyFilter = function(a) {
      for (var b = a.data, c = b.length, d = 0; c > d; d += 4) b[d] = b[d] * this.redMultiplier + this.redOffset, b[d + 1] = b[d + 1] * this.greenMultiplier + this.greenOffset, b[d + 2] = b[d + 2] * this.blueMultiplier + this.blueOffset, b[d + 3] = b[d + 3] * this.alphaMultiplier + this.alphaOffset;
      return !0
    }, createjs.ColorFilter = createjs.promote(a, "Filter")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d) {
      this.setColor(a, b, c, d)
    }
    var b = a.prototype;
    a.DELTA_INDEX = [0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10], a.IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], a.LENGTH = a.IDENTITY_MATRIX.length, b.setColor = function(a, b, c, d) {
      return this.reset().adjustColor(a, b, c, d)
    }, b.reset = function() {
      return this.copy(a.IDENTITY_MATRIX)
    }, b.adjustColor = function(a, b, c, d) {
      return this.adjustHue(d), this.adjustContrast(b), this.adjustBrightness(a), this.adjustSaturation(c)
    }, b.adjustBrightness = function(a) {
      return 0 == a || isNaN(a) ? this : (a = this._cleanValue(a, 255), this._multiplyMatrix([1, 0, 0, 0, a, 0, 1, 0, 0, a, 0, 0, 1, 0, a, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this)
    }, b.adjustContrast = function(b) {
      if (0 == b || isNaN(b)) return this;
      b = this._cleanValue(b, 100);
      var c;
      return 0 > b ? c = 127 + b / 100 * 127 : (c = b % 1, c = 0 == c ? a.DELTA_INDEX[b] : a.DELTA_INDEX[b << 0] * (1 - c) + a.DELTA_INDEX[(b << 0) + 1] * c, c = 127 * c + 127), this._multiplyMatrix([c / 127, 0, 0, 0, .5 * (127 - c), 0, c / 127, 0, 0, .5 * (127 - c), 0, 0, c / 127, 0, .5 * (127 - c), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this
    }, b.adjustSaturation = function(a) {
      if (0 == a || isNaN(a)) return this;
      a = this._cleanValue(a, 100);
      var b = 1 + (a > 0 ? 3 * a / 100 : a / 100),
        c = .3086,
        d = .6094,
        e = .082;
      return this._multiplyMatrix([c * (1 - b) + b, d * (1 - b), e * (1 - b), 0, 0, c * (1 - b), d * (1 - b) + b, e * (1 - b), 0, 0, c * (1 - b), d * (1 - b), e * (1 - b) + b, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this
    }, b.adjustHue = function(a) {
      if (0 == a || isNaN(a)) return this;
      a = this._cleanValue(a, 180) / 180 * Math.PI;
      var b = Math.cos(a),
        c = Math.sin(a),
        d = .213,
        e = .715,
        f = .072;
      return this._multiplyMatrix([d + b * (1 - d) + c * -d, e + b * -e + c * -e, f + b * -f + c * (1 - f), 0, 0, d + b * -d + .143 * c, e + b * (1 - e) + .14 * c, f + b * -f + c * -.283, 0, 0, d + b * -d + c * -(1 - d), e + b * -e + c * e, f + b * (1 - f) + c * f, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this
    }, b.concat = function(b) {
      return b = this._fixMatrix(b), b.length != a.LENGTH ? this : (this._multiplyMatrix(b), this)
    }, b.clone = function() {
      return (new a).copy(this)
    }, b.toArray = function() {
      for (var b = [], c = 0, d = a.LENGTH; d > c; c++) b[c] = this[c];
      return b
    }, b.copy = function(b) {
      for (var c = a.LENGTH, d = 0; c > d; d++) this[d] = b[d];
      return this
    }, b.toString = function() {
      return "[ColorMatrix]"
    }, b._multiplyMatrix = function(a) {
      var b, c, d, e = [];
      for (b = 0; 5 > b; b++) {
        for (c = 0; 5 > c; c++) e[c] = this[c + 5 * b];
        for (c = 0; 5 > c; c++) {
          var f = 0;
          for (d = 0; 5 > d; d++) f += a[c + 5 * d] * e[d];
          this[c + 5 * b] = f
        }
      }
    }, b._cleanValue = function(a, b) {
      return Math.min(b, Math.max(-b, a))
    }, b._fixMatrix = function(b) {
      return b instanceof a && (b = b.toArray()), b.length < a.LENGTH ? b = b.slice(0, b.length).concat(a.IDENTITY_MATRIX.slice(b.length, a.LENGTH)) : b.length > a.LENGTH && (b = b.slice(0, a.LENGTH)), b
    }, createjs.ColorMatrix = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.matrix = a
    }
    var b = createjs.extend(a, createjs.Filter);
    b.toString = function() {
      return "[ColorMatrixFilter]"
    }, b.clone = function() {
      return new a(this.matrix)
    }, b._applyFilter = function(a) {
      for (var b, c, d, e, f = a.data, g = f.length, h = this.matrix, i = h[0], j = h[1], k = h[2], l = h[3], m = h[4], n = h[5], o = h[6], p = h[7], q = h[8], r = h[9], s = h[10], t = h[11], u = h[12], v = h[13], w = h[14], x = h[15], y = h[16], z = h[17], A = h[18], B = h[19], C = 0; g > C; C += 4) b = f[C], c = f[C + 1], d = f[C + 2], e = f[C + 3], f[C] = b * i + c * j + d * k + e * l + m, f[C + 1] = b * n + c * o + d * p + e * q + r, f[C + 2] = b * s + c * t + d * u + e * v + w, f[C + 3] = b * x + c * y + d * z + e * A + B;
      return !0
    }, createjs.ColorMatrixFilter = createjs.promote(a, "Filter")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "Touch cannot be instantiated"
    }
    a.isSupported = function() {
      return !!("ontouchstart" in window || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0)
    }, a.enable = function(b, c, d) {
      return b && b.canvas && a.isSupported() ? b.__touch ? !0 : (b.__touch = {
        pointers: {},
        multitouch: !c,
        preventDefault: !d,
        count: 0
      }, "ontouchstart" in window ? a._IOS_enable(b) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && a._IE_enable(b), !0) : !1
    }, a.disable = function(b) {
      b && ("ontouchstart" in window ? a._IOS_disable(b) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && a._IE_disable(b), delete b.__touch)
    }, a._IOS_enable = function(b) {
      var c = b.canvas,
        d = b.__touch.f = function(c) {
          a._IOS_handleEvent(b, c)
        };
      c.addEventListener("touchstart", d, !1), c.addEventListener("touchmove", d, !1), c.addEventListener("touchend", d, !1), c.addEventListener("touchcancel", d, !1)
    }, a._IOS_disable = function(a) {
      var b = a.canvas;
      if (b) {
        var c = a.__touch.f;
        b.removeEventListener("touchstart", c, !1), b.removeEventListener("touchmove", c, !1), b.removeEventListener("touchend", c, !1), b.removeEventListener("touchcancel", c, !1)
      }
    }, a._IOS_handleEvent = function(a, b) {
      if (a) {
        a.__touch.preventDefault && b.preventDefault && b.preventDefault();
        for (var c = b.changedTouches, d = b.type, e = 0, f = c.length; f > e; e++) {
          var g = c[e],
            h = g.identifier;
          g.target == a.canvas && ("touchstart" == d ? this._handleStart(a, h, b, g.pageX, g.pageY) : "touchmove" == d ? this._handleMove(a, h, b, g.pageX, g.pageY) : ("touchend" == d || "touchcancel" == d) && this._handleEnd(a, h, b))
        }
      }
    }, a._IE_enable = function(b) {
      var c = b.canvas,
        d = b.__touch.f = function(c) {
          a._IE_handleEvent(b, c)
        };
      void 0 === window.navigator.pointerEnabled ? (c.addEventListener("MSPointerDown", d, !1), window.addEventListener("MSPointerMove", d, !1), window.addEventListener("MSPointerUp", d, !1), window.addEventListener("MSPointerCancel", d, !1), b.__touch.preventDefault && (c.style.msTouchAction = "none")) : (c.addEventListener("pointerdown", d, !1), window.addEventListener("pointermove", d, !1), window.addEventListener("pointerup", d, !1), window.addEventListener("pointercancel", d, !1), b.__touch.preventDefault && (c.style.touchAction = "none")), b.__touch.activeIDs = {}
    }, a._IE_disable = function(a) {
      var b = a.__touch.f;
      void 0 === window.navigator.pointerEnabled ? (window.removeEventListener("MSPointerMove", b, !1), window.removeEventListener("MSPointerUp", b, !1), window.removeEventListener("MSPointerCancel", b, !1), a.canvas && a.canvas.removeEventListener("MSPointerDown", b, !1)) : (window.removeEventListener("pointermove", b, !1), window.removeEventListener("pointerup", b, !1), window.removeEventListener("pointercancel", b, !1), a.canvas && a.canvas.removeEventListener("pointerdown", b, !1))
    }, a._IE_handleEvent = function(a, b) {
      if (a) {
        a.__touch.preventDefault && b.preventDefault && b.preventDefault();
        var c = b.type,
          d = b.pointerId,
          e = a.__touch.activeIDs;
        if ("MSPointerDown" == c || "pointerdown" == c) {
          if (b.srcElement != a.canvas) return;
          e[d] = !0, this._handleStart(a, d, b, b.pageX, b.pageY)
        } else e[d] && ("MSPointerMove" == c || "pointermove" == c ? this._handleMove(a, d, b, b.pageX, b.pageY) : ("MSPointerUp" == c || "MSPointerCancel" == c || "pointerup" == c || "pointercancel" == c) && (delete e[d], this._handleEnd(a, d, b)))
      }
    }, a._handleStart = function(a, b, c, d, e) {
      var f = a.__touch;
      if (f.multitouch || !f.count) {
        var g = f.pointers;
        g[b] || (g[b] = !0, f.count++, a._handlePointerDown(b, c, d, e))
      }
    }, a._handleMove = function(a, b, c, d, e) {
      a.__touch.pointers[b] && a._handlePointerMove(b, c, d, e)
    }, a._handleEnd = function(a, b, c) {
      var d = a.__touch,
        e = d.pointers;
      e[b] && (d.count--, a._handlePointerUp(b, c, !0), delete e[b])
    }, createjs.Touch = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = createjs.EaselJS = createjs.EaselJS || {};
    a.version = "0.8.2", a.buildDate = "Thu, 26 Nov 2015 20:44:34 GMT"
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = createjs.PreloadJS = createjs.PreloadJS || {};
    a.version = "0.6.2", a.buildDate = "Thu, 26 Nov 2015 20:44:31 GMT"
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    createjs.proxy = function(a, b) {
      var c = Array.prototype.slice.call(arguments, 2);
      return function() {
        return a.apply(b, Array.prototype.slice.call(arguments, 0).concat(c))
      }
    }
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.Event_constructor("error"), this.title = a, this.message = b, this.data = c
    }
    var b = createjs.extend(a, createjs.Event);
    b.clone = function() {
      return new createjs.ErrorEvent(this.title, this.message, this.data)
    }, createjs.ErrorEvent = createjs.promote(a, "Event")
  }(), this.createjs = this.createjs || {},
  function(a) {
    "use strict";

    function b(a, b) {
      this.Event_constructor("progress"), this.loaded = a, this.total = null == b ? 1 : b, this.progress = 0 == b ? 0 : this.loaded / this.total
    }
    var c = createjs.extend(b, createjs.Event);
    c.clone = function() {
      return new createjs.ProgressEvent(this.loaded, this.total)
    }, createjs.ProgressEvent = createjs.promote(b, "Event")
  }(window),
  function() {
    function a(b, d) {
      function f(a) {
        if (f[a] !== q) return f[a];
        var b;
        if ("bug-string-char-index" == a) b = "a" != "a" [0];
        else if ("json" == a) b = f("json-stringify") && f("json-parse");
        else {
          var c, e = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
          if ("json-stringify" == a) {
            var i = d.stringify,
              k = "function" == typeof i && t;
            if (k) {
              (c = function() {
                return 1
              }).toJSON = c;
              try {
                k = "0" === i(0) && "0" === i(new g) && '""' == i(new h) && i(s) === q && i(q) === q && i() === q && "1" === i(c) && "[1]" == i([c]) && "[null]" == i([q]) && "null" == i(null) && "[null,null,null]" == i([q, s, null]) && i({
                  a: [c, !0, !1, null, "\x00\b\n\f\r	"]
                }) == e && "1" === i(null, c) && "[\n 1,\n 2\n]" == i([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == i(new j(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == i(new j(864e13)) && '"-000001-01-01T00:00:00.000Z"' == i(new j(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == i(new j(-1))
              } catch (l) {
                k = !1
              }
            }
            b = k
          }
          if ("json-parse" == a) {
            var m = d.parse;
            if ("function" == typeof m) try {
              if (0 === m("0") && !m(!1)) {
                c = m(e);
                var n = 5 == c.a.length && 1 === c.a[0];
                if (n) {
                  try {
                    n = !m('"	"')
                  } catch (l) {}
                  if (n) try {
                    n = 1 !== m("01")
                  } catch (l) {}
                  if (n) try {
                    n = 1 !== m("1.")
                  } catch (l) {}
                }
              }
            } catch (l) {
              n = !1
            }
            b = n
          }
        }
        return f[a] = !!b
      }
      b || (b = e.Object()), d || (d = e.Object());
      var g = b.Number || e.Number,
        h = b.String || e.String,
        i = b.Object || e.Object,
        j = b.Date || e.Date,
        k = b.SyntaxError || e.SyntaxError,
        l = b.TypeError || e.TypeError,
        m = b.Math || e.Math,
        n = b.JSON || e.JSON;
      "object" == typeof n && n && (d.stringify = n.stringify, d.parse = n.parse);
      var o, p, q, r = i.prototype,
        s = r.toString,
        t = new j(-0xc782b5b800cec);
      try {
        t = -109252 == t.getUTCFullYear() && 0 === t.getUTCMonth() && 1 === t.getUTCDate() && 10 == t.getUTCHours() && 37 == t.getUTCMinutes() && 6 == t.getUTCSeconds() && 708 == t.getUTCMilliseconds()
      } catch (u) {}
      if (!f("json")) {
        var v = "[object Function]",
          w = "[object Date]",
          x = "[object Number]",
          y = "[object String]",
          z = "[object Array]",
          A = "[object Boolean]",
          B = f("bug-string-char-index");
        if (!t) var C = m.floor,
          D = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
          E = function(a, b) {
            return D[b] + 365 * (a - 1970) + C((a - 1969 + (b = +(b > 1))) / 4) - C((a - 1901 + b) / 100) + C((a - 1601 + b) / 400)
          };
        if ((o = r.hasOwnProperty) || (o = function(a) {
            var b, c = {};
            return (c.__proto__ = null, c.__proto__ = {
              toString: 1
            }, c).toString != s ? o = function(a) {
              var b = this.__proto__,
                c = a in (this.__proto__ = null, this);
              return this.__proto__ = b, c
            } : (b = c.constructor, o = function(a) {
              var c = (this.constructor || b).prototype;
              return a in this && !(a in c && this[a] === c[a])
            }), c = null, o.call(this, a)
          }), p = function(a, b) {
            var d, e, f, g = 0;
            (d = function() {
              this.valueOf = 0
            }).prototype.valueOf = 0, e = new d;
            for (f in e) o.call(e, f) && g++;
            return d = e = null, g ? p = 2 == g ? function(a, b) {
              var c, d = {},
                e = s.call(a) == v;
              for (c in a) e && "prototype" == c || o.call(d, c) || !(d[c] = 1) || !o.call(a, c) || b(c)
            } : function(a, b) {
              var c, d, e = s.call(a) == v;
              for (c in a) e && "prototype" == c || !o.call(a, c) || (d = "constructor" === c) || b(c);
              (d || o.call(a, c = "constructor")) && b(c)
            } : (e = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], p = function(a, b) {
              var d, f, g = s.call(a) == v,
                h = !g && "function" != typeof a.constructor && c[typeof a.hasOwnProperty] && a.hasOwnProperty || o;
              for (d in a) g && "prototype" == d || !h.call(a, d) || b(d);
              for (f = e.length; d = e[--f]; h.call(a, d) && b(d));
            }), p(a, b)
          }, !f("json-stringify")) {
          var F = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t"
            },
            G = "000000",
            H = function(a, b) {
              return (G + (b || 0)).slice(-a)
            },
            I = "\\u00",
            J = function(a) {
              for (var b = '"', c = 0, d = a.length, e = !B || d > 10, f = e && (B ? a.split("") : a); d > c; c++) {
                var g = a.charCodeAt(c);
                switch (g) {
                  case 8:
                  case 9:
                  case 10:
                  case 12:
                  case 13:
                  case 34:
                  case 92:
                    b += F[g];
                    break;
                  default:
                    if (32 > g) {
                      b += I + H(2, g.toString(16));
                      break
                    }
                    b += e ? f[c] : a.charAt(c)
                }
              }
              return b + '"'
            },
            K = function(a, b, c, d, e, f, g) {
              var h, i, j, k, m, n, r, t, u, v, B, D, F, G, I, L;
              try {
                h = b[a]
              } catch (M) {}
              if ("object" == typeof h && h)
                if (i = s.call(h), i != w || o.call(h, "toJSON")) "function" == typeof h.toJSON && (i != x && i != y && i != z || o.call(h, "toJSON")) && (h = h.toJSON(a));
                else if (h > -1 / 0 && 1 / 0 > h) {
                if (E) {
                  for (m = C(h / 864e5), j = C(m / 365.2425) + 1970 - 1; E(j + 1, 0) <= m; j++);
                  for (k = C((m - E(j, 0)) / 30.42); E(j, k + 1) <= m; k++);
                  m = 1 + m - E(j, k), n = (h % 864e5 + 864e5) % 864e5, r = C(n / 36e5) % 24, t = C(n / 6e4) % 60, u = C(n / 1e3) % 60, v = n % 1e3
                } else j = h.getUTCFullYear(), k = h.getUTCMonth(), m = h.getUTCDate(), r = h.getUTCHours(), t = h.getUTCMinutes(), u = h.getUTCSeconds(), v = h.getUTCMilliseconds();
                h = (0 >= j || j >= 1e4 ? (0 > j ? "-" : "+") + H(6, 0 > j ? -j : j) : H(4, j)) + "-" + H(2, k + 1) + "-" + H(2, m) + "T" + H(2, r) + ":" + H(2, t) + ":" + H(2, u) + "." + H(3, v) + "Z"
              } else h = null;
              if (c && (h = c.call(b, a, h)), null === h) return "null";
              if (i = s.call(h), i == A) return "" + h;
              if (i == x) return h > -1 / 0 && 1 / 0 > h ? "" + h : "null";
              if (i == y) return J("" + h);
              if ("object" == typeof h) {
                for (G = g.length; G--;)
                  if (g[G] === h) throw l();
                if (g.push(h), B = [], I = f, f += e, i == z) {
                  for (F = 0, G = h.length; G > F; F++) D = K(F, h, c, d, e, f, g), B.push(D === q ? "null" : D);
                  L = B.length ? e ? "[\n" + f + B.join(",\n" + f) + "\n" + I + "]" : "[" + B.join(",") + "]" : "[]"
                } else p(d || h, function(a) {
                  var b = K(a, h, c, d, e, f, g);
                  b !== q && B.push(J(a) + ":" + (e ? " " : "") + b)
                }), L = B.length ? e ? "{\n" + f + B.join(",\n" + f) + "\n" + I + "}" : "{" + B.join(",") + "}" : "{}";
                return g.pop(), L
              }
            };
          d.stringify = function(a, b, d) {
            var e, f, g, h;
            if (c[typeof b] && b)
              if ((h = s.call(b)) == v) f = b;
              else if (h == z) {
              g = {};
              for (var i, j = 0, k = b.length; k > j; i = b[j++], h = s.call(i), (h == y || h == x) && (g[i] = 1));
            }
            if (d)
              if ((h = s.call(d)) == x) {
                if ((d -= d % 1) > 0)
                  for (e = "", d > 10 && (d = 10); e.length < d; e += " ");
              } else h == y && (e = d.length <= 10 ? d : d.slice(0, 10));
            return K("", (i = {}, i[""] = a, i), f, g, e, "", [])
          }
        }
        if (!f("json-parse")) {
          var L, M, N = h.fromCharCode,
            O = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "	",
              110: "\n",
              102: "\f",
              114: "\r"
            },
            P = function() {
              throw L = M = null, k()
            },
            Q = function() {
              for (var a, b, c, d, e, f = M, g = f.length; g > L;) switch (e = f.charCodeAt(L)) {
                case 9:
                case 10:
                case 13:
                case 32:
                  L++;
                  break;
                case 123:
                case 125:
                case 91:
                case 93:
                case 58:
                case 44:
                  return a = B ? f.charAt(L) : f[L], L++, a;
                case 34:
                  for (a = "@", L++; g > L;)
                    if (e = f.charCodeAt(L), 32 > e) P();
                    else if (92 == e) switch (e = f.charCodeAt(++L)) {
                    case 92:
                    case 34:
                    case 47:
                    case 98:
                    case 116:
                    case 110:
                    case 102:
                    case 114:
                      a += O[e], L++;
                      break;
                    case 117:
                      for (b = ++L, c = L + 4; c > L; L++) e = f.charCodeAt(L), e >= 48 && 57 >= e || e >= 97 && 102 >= e || e >= 65 && 70 >= e || P();
                      a += N("0x" + f.slice(b, L));
                      break;
                    default:
                      P()
                  } else {
                    if (34 == e) break;
                    for (e = f.charCodeAt(L), b = L; e >= 32 && 92 != e && 34 != e;) e = f.charCodeAt(++L);
                    a += f.slice(b, L)
                  }
                  if (34 == f.charCodeAt(L)) return L++, a;
                  P();
                default:
                  if (b = L, 45 == e && (d = !0, e = f.charCodeAt(++L)), e >= 48 && 57 >= e) {
                    for (48 == e && (e = f.charCodeAt(L + 1), e >= 48 && 57 >= e) && P(), d = !1; g > L && (e = f.charCodeAt(L), e >= 48 && 57 >= e); L++);
                    if (46 == f.charCodeAt(L)) {
                      for (c = ++L; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                      c == L && P(), L = c
                    }
                    if (e = f.charCodeAt(L), 101 == e || 69 == e) {
                      for (e = f.charCodeAt(++L), (43 == e || 45 == e) && L++, c = L; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                      c == L && P(), L = c
                    }
                    return +f.slice(b, L)
                  }
                  if (d && P(), "true" == f.slice(L, L + 4)) return L += 4, !0;
                  if ("false" == f.slice(L, L + 5)) return L += 5, !1;
                  if ("null" == f.slice(L, L + 4)) return L += 4, null;
                  P()
              }
              return "$"
            },
            R = function(a) {
              var b, c;
              if ("$" == a && P(), "string" == typeof a) {
                if ("@" == (B ? a.charAt(0) : a[0])) return a.slice(1);
                if ("[" == a) {
                  for (b = []; a = Q(), "]" != a; c || (c = !0)) c && ("," == a ? (a = Q(), "]" == a && P()) : P()), "," == a && P(), b.push(R(a));
                  return b
                }
                if ("{" == a) {
                  for (b = {}; a = Q(), "}" != a; c || (c = !0)) c && ("," == a ? (a = Q(), "}" == a && P()) : P()), ("," == a || "string" != typeof a || "@" != (B ? a.charAt(0) : a[0]) || ":" != Q()) && P(), b[a.slice(1)] = R(Q());
                  return b
                }
                P()
              }
              return a
            },
            S = function(a, b, c) {
              var d = T(a, b, c);
              d === q ? delete a[b] : a[b] = d
            },
            T = function(a, b, c) {
              var d, e = a[b];
              if ("object" == typeof e && e)
                if (s.call(e) == z)
                  for (d = e.length; d--;) S(e, d, c);
                else p(e, function(a) {
                  S(e, a, c)
                });
              return c.call(a, b, e)
            };
          d.parse = function(a, b) {
            var c, d;
            return L = 0, M = "" + a, c = R(Q()), "$" != Q() && P(), L = M = null, b && s.call(b) == v ? T((d = {}, d[""] = c, d), "", b) : c
          }
        }
      }
      return d.runInContext = a, d
    }
    var b = "function" == typeof define && define.amd,
      c = {
        "function": !0,
        object: !0
      },
      d = c[typeof exports] && exports && !exports.nodeType && exports,
      e = c[typeof window] && window || this,
      f = d && c[typeof module] && module && !module.nodeType && "object" == typeof global && global;
    if (!f || f.global !== f && f.window !== f && f.self !== f || (e = f), d && !b) a(e, d);
    else {
      var g = e.JSON,
        h = e.JSON3,
        i = !1,
        j = a(e, e.JSON3 = {
          noConflict: function() {
            return i || (i = !0, e.JSON = g, e.JSON3 = h, g = h = null), j
          }
        });
      e.JSON = {
        parse: j.parse,
        stringify: j.stringify
      }
    }
    b && define(function() {
      return j
    })
  }.call(this),
  function() {
    var a = {};
    a.appendToHead = function(b) {
      a.getHead().appendChild(b)
    }, a.getHead = function() {
      return document.head || document.getElementsByTagName("head")[0]
    }, a.getBody = function() {
      return document.body || document.getElementsByTagName("body")[0]
    }, createjs.DomUtils = a
  }(),
  function() {
    var a = {};
    a.parseXML = function(a, b) {
      var c = null;
      try {
        if (window.DOMParser) {
          var d = new DOMParser;
          c = d.parseFromString(a, b)
        }
      } catch (e) {}
      if (!c) try {
        c = new ActiveXObject("Microsoft.XMLDOM"), c.async = !1, c.loadXML(a)
      } catch (e) {
        c = null
      }
      return c
    }, a.parseJSON = function(a) {
      if (null == a) return null;
      try {
        return JSON.parse(a)
      } catch (b) {
        throw b
      }
    }, createjs.DataUtils = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this.src = null, this.type = null, this.id = null, this.maintainOrder = !1, this.callback = null, this.data = null, this.method = createjs.LoadItem.GET, this.values = null, this.headers = null, this.withCredentials = !1, this.mimeType = null, this.crossOrigin = null, this.loadTimeout = c.LOAD_TIMEOUT_DEFAULT
    }
    var b = a.prototype = {},
      c = a;
    c.LOAD_TIMEOUT_DEFAULT = 8e3, c.create = function(b) {
      if ("string" == typeof b) {
        var d = new a;
        return d.src = b, d
      }
      if (b instanceof c) return b;
      if (b instanceof Object && b.src) return null == b.loadTimeout && (b.loadTimeout = c.LOAD_TIMEOUT_DEFAULT), b;
      throw new Error("Type not recognized.")
    }, b.set = function(a) {
      for (var b in a) this[b] = a[b];
      return this
    }, createjs.LoadItem = c
  }(),
  function() {
    var a = {};
    a.ABSOLUTE_PATT = /^(?:\w+:)?\/{2}/i, a.RELATIVE_PATT = /^[.\/]*?\//i, a.EXTENSION_PATT = /\/?[^\/]+\.(\w{1,5})$/i, a.parseURI = function(b) {
      var c = {
        absolute: !1,
        relative: !1
      };
      if (null == b) return c;
      var d = b.indexOf("?");
      d > -1 && (b = b.substr(0, d));
      var e;
      return a.ABSOLUTE_PATT.test(b) ? c.absolute = !0 : a.RELATIVE_PATT.test(b) && (c.relative = !0), (e = b.match(a.EXTENSION_PATT)) && (c.extension = e[1].toLowerCase()), c
    }, a.formatQueryString = function(a, b) {
      if (null == a) throw new Error("You must specify data.");
      var c = [];
      for (var d in a) c.push(d + "=" + escape(a[d]));
      return b && (c = c.concat(b)), c.join("&")
    }, a.buildPath = function(a, b) {
      if (null == b) return a;
      var c = [],
        d = a.indexOf("?");
      if (-1 != d) {
        var e = a.slice(d + 1);
        c = c.concat(e.split("&"))
      }
      return -1 != d ? a.slice(0, d) + "?" + this.formatQueryString(b, c) : a + "?" + this.formatQueryString(b, c)
    }, a.isCrossDomain = function(a) {
      var b = document.createElement("a");
      b.href = a.src;
      var c = document.createElement("a");
      c.href = location.href;
      var d = "" != b.hostname && (b.port != c.port || b.protocol != c.protocol || b.hostname != c.hostname);
      return d
    }, a.isLocal = function(a) {
      var b = document.createElement("a");
      return b.href = a.src, "" == b.hostname && "file:" == b.protocol
    }, a.isBinary = function(a) {
      switch (a) {
        case createjs.AbstractLoader.IMAGE:
        case createjs.AbstractLoader.BINARY:
          return !0;
        default:
          return !1
      }
    }, a.isImageTag = function(a) {
      return a instanceof HTMLImageElement
    }, a.isAudioTag = function(a) {
      return window.HTMLAudioElement ? a instanceof HTMLAudioElement : !1
    }, a.isVideoTag = function(a) {
      return window.HTMLVideoElement ? a instanceof HTMLVideoElement : !1
    }, a.isText = function(a) {
      switch (a) {
        case createjs.AbstractLoader.TEXT:
        case createjs.AbstractLoader.JSON:
        case createjs.AbstractLoader.MANIFEST:
        case createjs.AbstractLoader.XML:
        case createjs.AbstractLoader.CSS:
        case createjs.AbstractLoader.SVG:
        case createjs.AbstractLoader.JAVASCRIPT:
        case createjs.AbstractLoader.SPRITESHEET:
          return !0;
        default:
          return !1
      }
    }, a.getTypeByExtension = function(a) {
      if (null == a) return createjs.AbstractLoader.TEXT;
      switch (a.toLowerCase()) {
        case "jpeg":
        case "jpg":
        case "gif":
        case "png":
        case "webp":
        case "bmp":
          return createjs.AbstractLoader.IMAGE;
        case "ogg":
        case "mp3":
        case "webm":
          return createjs.AbstractLoader.SOUND;
        case "mp4":
        case "webm":
        case "ts":
          return createjs.AbstractLoader.VIDEO;
        case "json":
          return createjs.AbstractLoader.JSON;
        case "xml":
          return createjs.AbstractLoader.XML;
        case "css":
          return createjs.AbstractLoader.CSS;
        case "js":
          return createjs.AbstractLoader.JAVASCRIPT;
        case "svg":
          return createjs.AbstractLoader.SVG;
        default:
          return createjs.AbstractLoader.TEXT
      }
    }, createjs.RequestUtils = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.EventDispatcher_constructor(), this.loaded = !1, this.canceled = !1, this.progress = 0, this.type = c, this.resultFormatter = null, a ? this._item = createjs.LoadItem.create(a) : this._item = null, this._preferXHR = b, this._result = null, this._rawResult = null, this._loadedItems = null, this._tagSrcAttribute = null, this._tag = null
    }
    var b = createjs.extend(a, createjs.EventDispatcher),
      c = a;
    c.POST = "POST", c.GET = "GET", c.BINARY = "binary", c.CSS = "css", c.IMAGE = "image", c.JAVASCRIPT = "javascript", c.JSON = "json", c.JSONP = "jsonp", c.MANIFEST = "manifest", c.SOUND = "sound", c.VIDEO = "video", c.SPRITESHEET = "spritesheet", c.SVG = "svg", c.TEXT = "text", c.XML = "xml", b.getItem = function() {
      return this._item
    }, b.getResult = function(a) {
      return a ? this._rawResult : this._result
    }, b.getTag = function() {
      return this._tag
    }, b.setTag = function(a) {
      this._tag = a
    }, b.load = function() {
      this._createRequest(), this._request.on("complete", this, this), this._request.on("progress", this, this), this._request.on("loadStart", this, this), this._request.on("abort", this, this), this._request.on("timeout", this, this), this._request.on("error", this, this);
      var a = new createjs.Event("initialize");
      a.loader = this._request, this.dispatchEvent(a), this._request.load()
    }, b.cancel = function() {
      this.canceled = !0, this.destroy()
    }, b.destroy = function() {
      this._request && (this._request.removeAllEventListeners(), this._request.destroy()), this._request = null, this._item = null, this._rawResult = null, this._result = null, this._loadItems = null, this.removeAllEventListeners()
    }, b.getLoadedItems = function() {
      return this._loadedItems
    }, b._createRequest = function() {
      this._preferXHR ? this._request = new createjs.XHRRequest(this._item) : this._request = new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute)
    }, b._createTag = function(a) {
      return null
    }, b._sendLoadStart = function() {
      this._isCanceled() || this.dispatchEvent("loadstart")
    }, b._sendProgress = function(a) {
      if (!this._isCanceled()) {
        var b = null;
        "number" == typeof a ? (this.progress = a, b = new createjs.ProgressEvent(this.progress)) : (b = a, this.progress = a.loaded / a.total, b.progress = this.progress, (isNaN(this.progress) || this.progress == 1 / 0) && (this.progress = 0)), this.hasEventListener("progress") && this.dispatchEvent(b)
      }
    }, b._sendComplete = function() {
      if (!this._isCanceled()) {
        this.loaded = !0;
        var a = new createjs.Event("complete");
        a.rawResult = this._rawResult, null != this._result && (a.result = this._result), this.dispatchEvent(a)
      }
    }, b._sendError = function(a) {
      !this._isCanceled() && this.hasEventListener("error") && (null == a && (a = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")), this.dispatchEvent(a))
    }, b._isCanceled = function() {
      return null == window.createjs || this.canceled ? !0 : !1
    }, b.resultFormatter = null, b.handleEvent = function(a) {
      switch (a.type) {
        case "complete":
          this._rawResult = a.target._response;
          var b = this.resultFormatter && this.resultFormatter(this);
          b instanceof Function ? b.call(this, createjs.proxy(this._resultFormatSuccess, this), createjs.proxy(this._resultFormatFailed, this)) : (this._result = b || this._rawResult, this._sendComplete());
          break;
        case "progress":
          this._sendProgress(a);
          break;
        case "error":
          this._sendError(a);
          break;
        case "loadstart":
          this._sendLoadStart();
          break;
        case "abort":
        case "timeout":
          this._isCanceled() || this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + a.type.toUpperCase() + "_ERROR"))
      }
    }, b._resultFormatSuccess = function(a) {
      this._result = a, this._sendComplete()
    }, b._resultFormatFailed = function(a) {
      this._sendError(a)
    }, b.buildPath = function(a, b) {
      return createjs.RequestUtils.buildPath(a, b)
    }, b.toString = function() {
      return "[PreloadJS AbstractLoader]"
    }, createjs.AbstractLoader = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.AbstractLoader_constructor(a, b, c), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src", this.on("initialize", this._updateXHR, this)
    }
    var b = createjs.extend(a, createjs.AbstractLoader);
    b.load = function() {
      this._tag || (this._tag = this._createTag(this._item.src)), this._tag.preload = "auto", this._tag.load(), this.AbstractLoader_load()
    }, b._createTag = function() {}, b._createRequest = function() {
      this._preferXHR ? this._request = new createjs.XHRRequest(this._item) : this._request = new createjs.MediaTagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute)
    }, b._updateXHR = function(a) {
      a.loader.setResponseType && a.loader.setResponseType("blob")
    }, b._formatResult = function(a) {
      if (this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.onstalled = null, this._preferXHR) {
        var b = window.URL || window.webkitURL,
          c = a.getResult(!0);
        a.getTag().src = b.createObjectURL(c)
      }
      return a.getTag()
    }, createjs.AbstractMediaLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = function(a) {
        this._item = a
      },
      b = createjs.extend(a, createjs.EventDispatcher);
    b.load = function() {}, b.destroy = function() {}, b.cancel = function() {}, createjs.AbstractRequest = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.AbstractRequest_constructor(a), this._tag = b, this._tagSrcAttribute = c, this._loadedHandler = createjs.proxy(this._handleTagComplete, this), this._addedToDOM = !1, this._startTagVisibility = null
    }
    var b = createjs.extend(a, createjs.AbstractRequest);
    b.load = function() {
      this._tag.onload = createjs.proxy(this._handleTagComplete, this), this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this), this._tag.onerror = createjs.proxy(this._handleError, this);
      var a = new createjs.Event("initialize");
      a.loader = this._tag, this.dispatchEvent(a), this._hideTag(), this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout), this._tag[this._tagSrcAttribute] = this._item.src, null == this._tag.parentNode && (window.document.body.appendChild(this._tag), this._addedToDOM = !0)
    }, b.destroy = function() {
      this._clean(), this._tag = null, this.AbstractRequest_destroy()
    }, b._handleReadyStateChange = function() {
      clearTimeout(this._loadTimeout);
      var a = this._tag;
      ("loaded" == a.readyState || "complete" == a.readyState) && this._handleTagComplete()
    }, b._handleError = function() {
      this._clean(), this.dispatchEvent("error")
    }, b._handleTagComplete = function() {
      this._rawResult = this._tag, this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult, this._clean(), this._showTag(), this.dispatchEvent("complete")
    }, b._handleTimeout = function() {
      this._clean(), this.dispatchEvent(new createjs.Event("timeout"))
    }, b._clean = function() {
      this._tag.onload = null, this._tag.onreadystatechange = null, this._tag.onerror = null, this._addedToDOM && null != this._tag.parentNode && this._tag.parentNode.removeChild(this._tag), clearTimeout(this._loadTimeout)
    }, b._hideTag = function() {
      this._startTagVisibility = this._tag.style.visibility, this._tag.style.visibility = "hidden"
    }, b._showTag = function() {
      this._tag.style.visibility = this._startTagVisibility
    }, b._handleStalled = function() {}, createjs.TagRequest = createjs.promote(a, "AbstractRequest")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.AbstractRequest_constructor(a), this._tag = b, this._tagSrcAttribute = c, this._loadedHandler = createjs.proxy(this._handleTagComplete, this)
    }
    var b = createjs.extend(a, createjs.TagRequest);
    b.load = function() {
      var a = createjs.proxy(this._handleStalled, this);
      this._stalledCallback = a;
      var b = createjs.proxy(this._handleProgress, this);
      this._handleProgress = b, this._tag.addEventListener("stalled", a), this._tag.addEventListener("progress", b), this._tag.addEventListener && this._tag.addEventListener("canplaythrough", this._loadedHandler, !1), this.TagRequest_load()
    }, b._handleReadyStateChange = function() {
      clearTimeout(this._loadTimeout);
      var a = this._tag;
      ("loaded" == a.readyState || "complete" == a.readyState) && this._handleTagComplete()
    }, b._handleStalled = function() {}, b._handleProgress = function(a) {
      if (a && !(a.loaded > 0 && 0 == a.total)) {
        var b = new createjs.ProgressEvent(a.loaded, a.total);
        this.dispatchEvent(b)
      }
    }, b._clean = function() {
      this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.removeEventListener("stalled", this._stalledCallback), this._tag.removeEventListener("progress", this._progressCallback), this.TagRequest__clean()
    }, createjs.MediaTagRequest = createjs.promote(a, "TagRequest")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractRequest_constructor(a), this._request = null, this._loadTimeout = null, this._xhrLevel = 1, this._response = null, this._rawResponse = null, this._canceled = !1, this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this), this._handleProgressProxy = createjs.proxy(this._handleProgress, this), this._handleAbortProxy = createjs.proxy(this._handleAbort, this), this._handleErrorProxy = createjs.proxy(this._handleError, this), this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this), this._handleLoadProxy = createjs.proxy(this._handleLoad, this), this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this), !this._createXHR(a)
    }
    var b = createjs.extend(a, createjs.AbstractRequest);
    a.ACTIVEX_VERSIONS = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b.getResult = function(a) {
      return a && this._rawResponse ? this._rawResponse : this._response
    }, b.cancel = function() {
      this.canceled = !0, this._clean(), this._request.abort()
    }, b.load = function() {
      if (null == this._request) return void this._handleError();
      null != this._request.addEventListener ? (this._request.addEventListener("loadstart", this._handleLoadStartProxy, !1), this._request.addEventListener("progress", this._handleProgressProxy, !1), this._request.addEventListener("abort", this._handleAbortProxy, !1), this._request.addEventListener("error", this._handleErrorProxy, !1), this._request.addEventListener("timeout", this._handleTimeoutProxy, !1), this._request.addEventListener("load", this._handleLoadProxy, !1), this._request.addEventListener("readystatechange", this._handleReadyStateChangeProxy, !1)) : (this._request.onloadstart = this._handleLoadStartProxy, this._request.onprogress = this._handleProgressProxy, this._request.onabort = this._handleAbortProxy, this._request.onerror = this._handleErrorProxy, this._request.ontimeout = this._handleTimeoutProxy, this._request.onload = this._handleLoadProxy, this._request.onreadystatechange = this._handleReadyStateChangeProxy), 1 == this._xhrLevel && (this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout));
      try {
        this._item.values && this._item.method != createjs.AbstractLoader.GET ? this._item.method == createjs.AbstractLoader.POST && this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)) : this._request.send()
      } catch (a) {
        this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, a))
      }
    }, b.setResponseType = function(a) {
      "blob" === a && (a = window.URL ? "blob" : "arraybuffer", this._responseType = a), this._request.responseType = a
    }, b.getAllResponseHeaders = function() {
      return this._request.getAllResponseHeaders instanceof Function ? this._request.getAllResponseHeaders() : null
    }, b.getResponseHeader = function(a) {
      return this._request.getResponseHeader instanceof Function ? this._request.getResponseHeader(a) : null
    }, b._handleProgress = function(a) {
      if (a && !(a.loaded > 0 && 0 == a.total)) {
        var b = new createjs.ProgressEvent(a.loaded, a.total);
        this.dispatchEvent(b)
      }
    }, b._handleLoadStart = function(a) {
      clearTimeout(this._loadTimeout), this.dispatchEvent("loadstart")
    }, b._handleAbort = function(a) {
      this._clean(), this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, a))
    }, b._handleError = function(a) {
      this._clean(), this.dispatchEvent(new createjs.ErrorEvent(a.message))
    }, b._handleReadyStateChange = function(a) {
      4 == this._request.readyState && this._handleLoad()
    }, b._handleLoad = function(a) {
      if (!this.loaded) {
        this.loaded = !0;
        var b = this._checkError();
        if (b) return void this._handleError(b);
        if (this._response = this._getResponse(), "arraybuffer" === this._responseType) try {
          this._response = new Blob([this._response])
        } catch (c) {
          if (window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, "TypeError" === c.name && window.BlobBuilder) {
            var d = new BlobBuilder;
            d.append(this._response), this._response = d.getBlob()
          }
        }
        this._clean(), this.dispatchEvent(new createjs.Event("complete"))
      }
    }, b._handleTimeout = function(a) {
      this._clean(), this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, a))
    }, b._checkError = function() {
      var a = parseInt(this._request.status);
      switch (a) {
        case 404:
        case 0:
          return new Error(a)
      }
      return null
    }, b._getResponse = function() {
      if (null != this._response) return this._response;
      if (null != this._request.response) return this._request.response;
      try {
        if (null != this._request.responseText) return this._request.responseText
      } catch (a) {}
      try {
        if (null != this._request.responseXML) return this._request.responseXML
      } catch (a) {}
      return null
    }, b._createXHR = function(a) {
      var b = createjs.RequestUtils.isCrossDomain(a),
        c = {},
        d = null;
      if (window.XMLHttpRequest) d = new XMLHttpRequest, b && void 0 === d.withCredentials && window.XDomainRequest && (d = new XDomainRequest);
      else {
        for (var e = 0, f = s.ACTIVEX_VERSIONS.length; f > e; e++) {
          var g = s.ACTIVEX_VERSIONS[e];
          try {
            d = new ActiveXObject(g);
            break
          } catch (h) {}
        }
        if (null == d) return !1
      }
      null == a.mimeType && createjs.RequestUtils.isText(a.type) && (a.mimeType = "text/plain; charset=utf-8"), a.mimeType && d.overrideMimeType && d.overrideMimeType(a.mimeType), this._xhrLevel = "string" == typeof d.responseType ? 2 : 1;
      var i = null;
      if (i = a.method == createjs.AbstractLoader.GET ? createjs.RequestUtils.buildPath(a.src, a.values) : a.src, d.open(a.method || createjs.AbstractLoader.GET, i, !0), b && d instanceof XMLHttpRequest && 1 == this._xhrLevel && (c.Origin = location.origin), a.values && a.method == createjs.AbstractLoader.POST && (c["Content-Type"] = "application/x-www-form-urlencoded"), b || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"), a.headers)
        for (var j in a.headers) c[j] = a.headers[j];
      for (j in c) d.setRequestHeader(j, c[j]);
      return d instanceof XMLHttpRequest && void 0 !== a.withCredentials && (d.withCredentials = a.withCredentials), this._request = d, !0
    }, b._clean = function() {
      clearTimeout(this._loadTimeout), null != this._request.removeEventListener ? (this._request.removeEventListener("loadstart", this._handleLoadStartProxy), this._request.removeEventListener("progress", this._handleProgressProxy), this._request.removeEventListener("abort", this._handleAbortProxy), this._request.removeEventListener("error", this._handleErrorProxy), this._request.removeEventListener("timeout", this._handleTimeoutProxy), this._request.removeEventListener("load", this._handleLoadProxy), this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy)) : (this._request.onloadstart = null, this._request.onprogress = null, this._request.onabort = null, this._request.onerror = null, this._request.ontimeout = null, this._request.onload = null, this._request.onreadystatechange = null)
    }, b.toString = function() {
      return "[PreloadJS XHRRequest]"
    }, createjs.XHRRequest = createjs.promote(a, "AbstractRequest")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.AbstractLoader_constructor(), this._plugins = [], this._typeCallbacks = {}, this._extensionCallbacks = {}, this.next = null, this.maintainScriptOrder = !0, this.stopOnError = !1, this._maxConnections = 1, this._availableLoaders = [createjs.ImageLoader, createjs.JavaScriptLoader, createjs.CSSLoader, createjs.JSONLoader, createjs.JSONPLoader, createjs.SoundLoader, createjs.ManifestLoader, createjs.SpriteSheetLoader, createjs.XMLLoader, createjs.SVGLoader, createjs.BinaryLoader, createjs.VideoLoader, createjs.TextLoader], this._defaultLoaderLength = this._availableLoaders.length, this.init(a, b, c)
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    b.init = function(a, b, c) {
      this.useXHR = !0, this.preferXHR = !0, this._preferXHR = !0, this.setPreferXHR(a), this._paused = !1, this._basePath = b, this._crossOrigin = c, this._loadStartWasDispatched = !1, this._currentlyLoadingScript = null, this._currentLoads = [], this._loadQueue = [], this._loadQueueBackup = [], this._loadItemsById = {}, this._loadItemsBySrc = {}, this._loadedResults = {}, this._loadedRawResults = {}, this._numItems = 0, this._numItemsLoaded = 0, this._scriptOrder = [], this._loadedScripts = [], this._lastProgress = NaN
    }, c.loadTimeout = 8e3, c.LOAD_TIMEOUT = 0, c.BINARY = createjs.AbstractLoader.BINARY, c.CSS = createjs.AbstractLoader.CSS, c.IMAGE = createjs.AbstractLoader.IMAGE, c.JAVASCRIPT = createjs.AbstractLoader.JAVASCRIPT, c.JSON = createjs.AbstractLoader.JSON, c.JSONP = createjs.AbstractLoader.JSONP, c.MANIFEST = createjs.AbstractLoader.MANIFEST, c.SOUND = createjs.AbstractLoader.SOUND, c.VIDEO = createjs.AbstractLoader.VIDEO, c.SVG = createjs.AbstractLoader.SVG, c.TEXT = createjs.AbstractLoader.TEXT, c.XML = createjs.AbstractLoader.XML, c.POST = createjs.AbstractLoader.POST, c.GET = createjs.AbstractLoader.GET, b.registerLoader = function(a) {
      if (!a || !a.canLoadItem) throw new Error("loader is of an incorrect type.");
      if (-1 != this._availableLoaders.indexOf(a)) throw new Error("loader already exists.");
      this._availableLoaders.unshift(a)
    }, b.unregisterLoader = function(a) {
      var b = this._availableLoaders.indexOf(a); - 1 != b && b < this._defaultLoaderLength - 1 && this._availableLoaders.splice(b, 1)
    }, b.setUseXHR = function(a) {
      return this.setPreferXHR(a)
    }, b.setPreferXHR = function(a) {
      return this.preferXHR = 0 != a && null != window.XMLHttpRequest, this.preferXHR
    }, b.removeAll = function() {
      this.remove()
    }, b.remove = function(a) {
      var b = null;
      if (a && !Array.isArray(a)) b = [a];
      else if (a) b = a;
      else if (arguments.length > 0) return;
      var c = !1;
      if (b) {
        for (; b.length;) {
          var d = b.pop(),
            e = this.getResult(d);
          for (f = this._loadQueue.length - 1; f >= 0; f--)
            if (g = this._loadQueue[f].getItem(), g.id == d || g.src == d) {
              this._loadQueue.splice(f, 1)[0].cancel();
              break
            } for (f = this._loadQueueBackup.length - 1; f >= 0; f--)
            if (g = this._loadQueueBackup[f].getItem(), g.id == d || g.src == d) {
              this._loadQueueBackup.splice(f, 1)[0].cancel();
              break
            } if (e) this._disposeItem(this.getItem(d));
          else
            for (var f = this._currentLoads.length - 1; f >= 0; f--) {
              var g = this._currentLoads[f].getItem();
              if (g.id == d || g.src == d) {
                this._currentLoads.splice(f, 1)[0].cancel(), c = !0;
                break
              }
            }
        }
        c && this._loadNext()
      } else {
        this.close();
        for (var h in this._loadItemsById) this._disposeItem(this._loadItemsById[h]);
        this.init(this.preferXHR, this._basePath)
      }
    }, b.reset = function() {
      this.close();
      for (var a in this._loadItemsById) this._disposeItem(this._loadItemsById[a]);
      for (var b = [], c = 0, d = this._loadQueueBackup.length; d > c; c++) b.push(this._loadQueueBackup[c].getItem());
      this.loadManifest(b, !1)
    }, b.installPlugin = function(a) {
      if (null != a && null != a.getPreloadHandlers) {
        this._plugins.push(a);
        var b = a.getPreloadHandlers();
        if (b.scope = a, null != b.types)
          for (var c = 0, d = b.types.length; d > c; c++) this._typeCallbacks[b.types[c]] = b;
        if (null != b.extensions)
          for (c = 0, d = b.extensions.length; d > c; c++) this._extensionCallbacks[b.extensions[c]] = b
      }
    }, b.setMaxConnections = function(a) {
      this._maxConnections = a, !this._paused && this._loadQueue.length > 0 && this._loadNext()
    }, b.loadFile = function(a, b, c) {
      if (null == a) {
        var d = new createjs.ErrorEvent("PRELOAD_NO_FILE");
        return void this._sendError(d)
      }
      this._addItem(a, null, c), b !== !1 ? this.setPaused(!1) : this.setPaused(!0)
    }, b.loadManifest = function(a, b, d) {
      var e = null,
        f = null;
      if (Array.isArray(a)) {
        if (0 == a.length) {
          var g = new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");
          return void this._sendError(g)
        }
        e = a
      } else if ("string" == typeof a) e = [{
        src: a,
        type: c.MANIFEST
      }];
      else {
        if ("object" != typeof a) {
          var g = new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");
          return void this._sendError(g)
        }
        if (void 0 !== a.src) {
          if (null == a.type) a.type = c.MANIFEST;
          else if (a.type != c.MANIFEST) {
            var g = new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");
            this._sendError(g)
          }
          e = [a]
        } else void 0 !== a.manifest && (e = a.manifest, f = a.path)
      }
      for (var h = 0, i = e.length; i > h; h++) this._addItem(e[h], f, d);
      b !== !1 ? this.setPaused(!1) : this.setPaused(!0)
    }, b.load = function() {
      this.setPaused(!1)
    }, b.getItem = function(a) {
      return this._loadItemsById[a] || this._loadItemsBySrc[a]
    }, b.getResult = function(a, b) {
      var c = this._loadItemsById[a] || this._loadItemsBySrc[a];
      if (null == c) return null;
      var d = c.id;
      return b && this._loadedRawResults[d] ? this._loadedRawResults[d] : this._loadedResults[d]
    }, b.getItems = function(a) {
      var b = [];
      for (var c in this._loadItemsById) {
        var d = this._loadItemsById[c],
          e = this.getResult(c);
        (a !== !0 || null != e) && b.push({
          item: d,
          result: e,
          rawResult: this.getResult(c, !0)
        })
      }
      return b
    }, b.setPaused = function(a) {
      this._paused = a, this._paused || this._loadNext()
    }, b.close = function() {
      for (; this._currentLoads.length;) this._currentLoads.pop().cancel();
      this._scriptOrder.length = 0, this._loadedScripts.length = 0, this.loadStartWasDispatched = !1, this._itemCount = 0, this._lastProgress = NaN
    }, b._addItem = function(a, b, c) {
      var d = this._createLoadItem(a, b, c);
      if (null != d) {
        var e = this._createLoader(d);
        null != e && ("plugins" in e && (e.plugins = this._plugins), d._loader = e, this._loadQueue.push(e), this._loadQueueBackup.push(e), this._numItems++, this._updateProgress(), (this.maintainScriptOrder && d.type == createjs.LoadQueue.JAVASCRIPT || d.maintainOrder === !0) && (this._scriptOrder.push(d), this._loadedScripts.push(null)))
      }
    }, b._createLoadItem = function(a, b, c) {
      var d = createjs.LoadItem.create(a);
      if (null == d) return null;
      var e = "",
        f = c || this._basePath;
      if (d.src instanceof Object) {
        if (!d.type) return null;
        if (b) {
          e = b;
          var g = createjs.RequestUtils.parseURI(b);
          null == f || g.absolute || g.relative || (e = f + e)
        } else null != f && (e = f)
      } else {
        var h = createjs.RequestUtils.parseURI(d.src);
        h.extension && (d.ext = h.extension), null == d.type && (d.type = createjs.RequestUtils.getTypeByExtension(d.ext));
        var i = d.src;
        if (!h.absolute && !h.relative)
          if (b) {
            e = b;
            var g = createjs.RequestUtils.parseURI(b);
            i = b + i, null == f || g.absolute || g.relative || (e = f + e)
          } else null != f && (e = f);
        d.src = e + d.src
      }
      d.path = e, (void 0 === d.id || null === d.id || "" === d.id) && (d.id = i);
      var j = this._typeCallbacks[d.type] || this._extensionCallbacks[d.ext];
      if (j) {
        var k = j.callback.call(j.scope, d, this);
        if (k === !1) return null;
        k === !0 || null != k && (d._loader = k), h = createjs.RequestUtils.parseURI(d.src), null != h.extension && (d.ext = h.extension)
      }
      return this._loadItemsById[d.id] = d, this._loadItemsBySrc[d.src] = d, null == d.crossOrigin && (d.crossOrigin = this._crossOrigin), d
    }, b._createLoader = function(a) {
      if (null != a._loader) return a._loader;
      for (var b = this.preferXHR, c = 0; c < this._availableLoaders.length; c++) {
        var d = this._availableLoaders[c];
        if (d && d.canLoadItem(a)) return new d(a, b)
      }
      return null
    }, b._loadNext = function() {
      if (!this._paused) {
        this._loadStartWasDispatched || (this._sendLoadStart(), this._loadStartWasDispatched = !0), this._numItems == this._numItemsLoaded ? (this.loaded = !0, this._sendComplete(), this.next && this.next.load && this.next.load()) : this.loaded = !1;
        for (var a = 0; a < this._loadQueue.length && !(this._currentLoads.length >= this._maxConnections); a++) {
          var b = this._loadQueue[a];
          this._canStartLoad(b) && (this._loadQueue.splice(a, 1), a--, this._loadItem(b))
        }
      }
    }, b._loadItem = function(a) {
      a.on("fileload", this._handleFileLoad, this), a.on("progress", this._handleProgress, this), a.on("complete", this._handleFileComplete, this), a.on("error", this._handleError, this), a.on("fileerror", this._handleFileError, this), this._currentLoads.push(a), this._sendFileStart(a.getItem()), a.load()
    }, b._handleFileLoad = function(a) {
      a.target = null, this.dispatchEvent(a)
    }, b._handleFileError = function(a) {
      var b = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, a.item);
      this._sendError(b)
    }, b._handleError = function(a) {
      var b = a.target;
      this._numItemsLoaded++, this._finishOrderedItem(b, !0), this._updateProgress();
      var c = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, b.getItem());
      this._sendError(c), this.stopOnError ? this.setPaused(!0) : (this._removeLoadItem(b), this._cleanLoadItem(b), this._loadNext())
    }, b._handleFileComplete = function(a) {
      var b = a.target,
        c = b.getItem(),
        d = b.getResult();
      this._loadedResults[c.id] = d;
      var e = b.getResult(!0);
      null != e && e !== d && (this._loadedRawResults[c.id] = e), this._saveLoadedItems(b), this._removeLoadItem(b), this._finishOrderedItem(b) || this._processFinishedLoad(c, b), this._cleanLoadItem(b)
    }, b._saveLoadedItems = function(a) {
      var b = a.getLoadedItems();
      if (null !== b)
        for (var c = 0; c < b.length; c++) {
          var d = b[c].item;
          this._loadItemsBySrc[d.src] = d, this._loadItemsById[d.id] = d, this._loadedResults[d.id] = b[c].result, this._loadedRawResults[d.id] = b[c].rawResult
        }
    }, b._finishOrderedItem = function(a, b) {
      var c = a.getItem();
      if (this.maintainScriptOrder && c.type == createjs.LoadQueue.JAVASCRIPT || c.maintainOrder) {
        a instanceof createjs.JavaScriptLoader && (this._currentlyLoadingScript = !1);
        var d = createjs.indexOf(this._scriptOrder, c);
        return -1 == d ? !1 : (this._loadedScripts[d] = b === !0 ? !0 : c, this._checkScriptLoadOrder(), !0)
      }
      return !1
    }, b._checkScriptLoadOrder = function() {
      for (var a = this._loadedScripts.length, b = 0; a > b; b++) {
        var c = this._loadedScripts[b];
        if (null === c) break;
        if (c !== !0) {
          var d = this._loadedResults[c.id];
          c.type == createjs.LoadQueue.JAVASCRIPT && createjs.DomUtils.appendToHead(d);
          var e = c._loader;
          this._processFinishedLoad(c, e), this._loadedScripts[b] = !0
        }
      }
    }, b._processFinishedLoad = function(a, b) {
      if (this._numItemsLoaded++, !this.maintainScriptOrder && a.type == createjs.LoadQueue.JAVASCRIPT) {
        var c = b.getTag();
        createjs.DomUtils.appendToHead(c)
      }
      this._updateProgress(), this._sendFileComplete(a, b), this._loadNext()
    }, b._canStartLoad = function(a) {
      if (!this.maintainScriptOrder || a.preferXHR) return !0;
      var b = a.getItem();
      if (b.type != createjs.LoadQueue.JAVASCRIPT) return !0;
      if (this._currentlyLoadingScript) return !1;
      for (var c = this._scriptOrder.indexOf(b), d = 0; c > d;) {
        var e = this._loadedScripts[d];
        if (null == e) return !1;
        d++
      }
      return this._currentlyLoadingScript = !0, !0
    }, b._removeLoadItem = function(a) {
      for (var b = this._currentLoads.length, c = 0; b > c; c++)
        if (this._currentLoads[c] == a) {
          this._currentLoads.splice(c, 1);
          break
        }
    }, b._cleanLoadItem = function(a) {
      var b = a.getItem();
      b && delete b._loader
    }, b._handleProgress = function(a) {
      var b = a.target;
      this._sendFileProgress(b.getItem(), b.progress), this._updateProgress()
    }, b._updateProgress = function() {
      var a = this._numItemsLoaded / this._numItems,
        b = this._numItems - this._numItemsLoaded;
      if (b > 0) {
        for (var c = 0, d = 0, e = this._currentLoads.length; e > d; d++) c += this._currentLoads[d].progress;
        a += c / b * (b / this._numItems)
      }
      this._lastProgress != a && (this._sendProgress(a), this._lastProgress = a)
    }, b._disposeItem = function(a) {
      delete this._loadedResults[a.id], delete this._loadedRawResults[a.id], delete this._loadItemsById[a.id], delete this._loadItemsBySrc[a.src]
    }, b._sendFileProgress = function(a, b) {
      if (!this._isCanceled() && !this._paused && this.hasEventListener("fileprogress")) {
        var c = new createjs.Event("fileprogress");
        c.progress = b, c.loaded = b, c.total = 1, c.item = a, this.dispatchEvent(c)
      }
    }, b._sendFileComplete = function(a, b) {
      if (!this._isCanceled() && !this._paused) {
        var c = new createjs.Event("fileload");
        c.loader = b, c.item = a, c.result = this._loadedResults[a.id], c.rawResult = this._loadedRawResults[a.id], a.completeHandler && a.completeHandler(c), this.hasEventListener("fileload") && this.dispatchEvent(c)
      }
    }, b._sendFileStart = function(a) {
      var b = new createjs.Event("filestart");
      b.item = a, this.hasEventListener("filestart") && this.dispatchEvent(b)
    }, b.toString = function() {
      return "[PreloadJS LoadQueue]"
    }, createjs.LoadQueue = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.TEXT)
    }
    var b = (createjs.extend(a, createjs.AbstractLoader), a);
    b.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.TEXT
    }, createjs.TextLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.BINARY), this.on("initialize", this._updateXHR, this)
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.BINARY
    }, b._updateXHR = function(a) {
      a.loader.setResponseType("arraybuffer")
    }, createjs.BinaryLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.CSS), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "href", b ? this._tag = document.createElement("style") : this._tag = document.createElement("link"), this._tag.rel = "stylesheet", this._tag.type = "text/css"
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.CSS
    }, b._formatResult = function(a) {
      if (this._preferXHR) {
        var b = a.getTag();
        if (b.styleSheet) b.styleSheet.cssText = a.getResult(!0);
        else {
          var c = document.createTextNode(a.getResult(!0));
          b.appendChild(c)
        }
      } else b = this._tag;
      return createjs.DomUtils.appendToHead(b), b
    }, createjs.CSSLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.IMAGE), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src", createjs.RequestUtils.isImageTag(a) ? this._tag = a : createjs.RequestUtils.isImageTag(a.src) ? this._tag = a.src : createjs.RequestUtils.isImageTag(a.tag) && (this._tag = a.tag), null != this._tag ? this._preferXHR = !1 : this._tag = document.createElement("img"), this.on("initialize", this._updateXHR, this)
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.IMAGE
    }, b.load = function() {
      if ("" != this._tag.src && this._tag.complete) return void this._sendComplete();
      var a = this._item.crossOrigin;
      1 == a && (a = "Anonymous"), null == a || createjs.RequestUtils.isLocal(this._item.src) || (this._tag.crossOrigin = a), this.AbstractLoader_load()
    }, b._updateXHR = function(a) {
      a.loader.mimeType = "text/plain; charset=x-user-defined-binary", a.loader.setResponseType && a.loader.setResponseType("blob")
    }, b._formatResult = function(a) {
      return this._formatImage
    }, b._formatImage = function(a, b) {
      var c = this._tag,
        d = window.URL || window.webkitURL;
      if (this._preferXHR)
        if (d) {
          var e = d.createObjectURL(this.getResult(!0));
          c.src = e, c.addEventListener("load", this._cleanUpURL, !1), c.addEventListener("error", this._cleanUpURL, !1)
        } else c.src = this._item.src;
      else;
      c.complete ? a(c) : (c.onload = createjs.proxy(function() {
        a(this._tag)
      }, this), c.onerror = createjs.proxy(function() {
        b(_this._tag)
      }, this))
    }, b._cleanUpURL = function(a) {
      var b = window.URL || window.webkitURL;
      b.revokeObjectURL(a.target.src)
    }, createjs.ImageLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.JAVASCRIPT), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src", this.setTag(document.createElement("script"))
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.JAVASCRIPT
    }, b._formatResult = function(a) {
      var b = a.getTag();
      return this._preferXHR && (b.text = a.getResult(!0)), b
    }, createjs.JavaScriptLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.JSON), this.resultFormatter = this._formatResult
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.JSON
    }, b._formatResult = function(a) {
      var b = null;
      try {
        b = createjs.DataUtils.parseJSON(a.getResult(!0))
      } catch (c) {
        var d = new createjs.ErrorEvent("JSON_FORMAT", null, c);
        return this._sendError(d), c
      }
      return b
    }, createjs.JSONLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, !1, createjs.AbstractLoader.JSONP), this.setTag(document.createElement("script")), this.getTag().type = "text/javascript"
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.JSONP
    }, b.cancel = function() {
      this.AbstractLoader_cancel(), this._dispose()
    }, b.load = function() {
      if (null == this._item.callback) throw new Error("callback is required for loading JSONP requests.");
      if (null != window[this._item.callback]) throw new Error("JSONP callback '" + this._item.callback + "' already exists on window. You need to specify a different callback or re-name the current one.");
      window[this._item.callback] = createjs.proxy(this._handleLoad, this), window.document.body.appendChild(this._tag), this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout), this._tag.src = this._item.src
    }, b._handleLoad = function(a) {
      this._result = this._rawResult = a, this._sendComplete(), this._dispose()
    }, b._handleTimeout = function() {
      this._dispose(), this.dispatchEvent(new createjs.ErrorEvent("timeout"))
    }, b._dispose = function() {
      window.document.body.removeChild(this._tag), delete window[this._item.callback], clearTimeout(this._loadTimeout)
    }, createjs.JSONPLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, null, createjs.AbstractLoader.MANIFEST), this.plugins = null, this._manifestQueue = null
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.MANIFEST_PROGRESS = .25, c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.MANIFEST
    }, b.load = function() {
      this.AbstractLoader_load()
    }, b._createRequest = function() {
      var a = this._item.callback;
      null != a ? this._request = new createjs.JSONPLoader(this._item) : this._request = new createjs.JSONLoader(this._item)
    }, b.handleEvent = function(a) {
      switch (a.type) {
        case "complete":
          return this._rawResult = a.target.getResult(!0), this._result = a.target.getResult(), this._sendProgress(c.MANIFEST_PROGRESS), void this._loadManifest(this._result);
        case "progress":
          return a.loaded *= c.MANIFEST_PROGRESS, this.progress = a.loaded / a.total, (isNaN(this.progress) || this.progress == 1 / 0) && (this.progress = 0), void this._sendProgress(a)
      }
      this.AbstractLoader_handleEvent(a)
    }, b.destroy = function() {
      this.AbstractLoader_destroy(), this._manifestQueue.close()
    }, b._loadManifest = function(a) {
      if (a && a.manifest) {
        var b = this._manifestQueue = new createjs.LoadQueue;
        b.on("fileload", this._handleManifestFileLoad, this), b.on("progress", this._handleManifestProgress, this), b.on("complete", this._handleManifestComplete, this, !0), b.on("error", this._handleManifestError, this, !0);
        for (var c = 0, d = this.plugins.length; d > c; c++) b.installPlugin(this.plugins[c]);
        b.loadManifest(a)
      } else this._sendComplete()
    }, b._handleManifestFileLoad = function(a) {
      a.target = null, this.dispatchEvent(a)
    }, b._handleManifestComplete = function(a) {
      this._loadedItems = this._manifestQueue.getItems(!0), this._sendComplete()
    }, b._handleManifestProgress = function(a) {
      this.progress = a.progress * (1 - c.MANIFEST_PROGRESS) + c.MANIFEST_PROGRESS, this._sendProgress(this.progress)
    }, b._handleManifestError = function(a) {
      var b = new createjs.Event("fileerror");
      b.item = a.data, this.dispatchEvent(b)
    }, createjs.ManifestLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractMediaLoader_constructor(a, b, createjs.AbstractLoader.SOUND), createjs.RequestUtils.isAudioTag(a) ? this._tag = a : createjs.RequestUtils.isAudioTag(a.src) ? this._tag = a : createjs.RequestUtils.isAudioTag(a.tag) && (this._tag = createjs.RequestUtils.isAudioTag(a) ? a : a.src), null != this._tag && (this._preferXHR = !1)
    }
    var b = createjs.extend(a, createjs.AbstractMediaLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.SOUND
    }, b._createTag = function(a) {
      var b = document.createElement("audio");
      return b.autoplay = !1, b.preload = "none", b.src = a, b
    }, createjs.SoundLoader = createjs.promote(a, "AbstractMediaLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractMediaLoader_constructor(a, b, createjs.AbstractLoader.VIDEO), createjs.RequestUtils.isVideoTag(a) || createjs.RequestUtils.isVideoTag(a.src) ? (this.setTag(createjs.RequestUtils.isVideoTag(a) ? a : a.src), this._preferXHR = !1) : this.setTag(this._createTag())
    }
    var b = createjs.extend(a, createjs.AbstractMediaLoader),
      c = a;
    b._createTag = function() {
      return document.createElement("video")
    }, c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.VIDEO
    }, createjs.VideoLoader = createjs.promote(a, "AbstractMediaLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.SPRITESHEET), this._manifestQueue = null
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.SPRITESHEET_PROGRESS = .25, c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.SPRITESHEET
    }, b.destroy = function() {
      this.AbstractLoader_destroy, this._manifestQueue.close()
    }, b._createRequest = function() {
      var a = this._item.callback;
      null != a ? this._request = new createjs.JSONPLoader(this._item) : this._request = new createjs.JSONLoader(this._item)
    }, b.handleEvent = function(a) {
      switch (a.type) {
        case "complete":
          return this._rawResult = a.target.getResult(!0), this._result = a.target.getResult(), this._sendProgress(c.SPRITESHEET_PROGRESS), void this._loadManifest(this._result);
        case "progress":
          return a.loaded *= c.SPRITESHEET_PROGRESS, this.progress = a.loaded / a.total, (isNaN(this.progress) || this.progress == 1 / 0) && (this.progress = 0), void this._sendProgress(a)
      }
      this.AbstractLoader_handleEvent(a)
    }, b._loadManifest = function(a) {
      if (a && a.images) {
        var b = this._manifestQueue = new createjs.LoadQueue(this._preferXHR, this._item.path, this._item.crossOrigin);
        b.on("complete", this._handleManifestComplete, this, !0), b.on("fileload", this._handleManifestFileLoad, this), b.on("progress", this._handleManifestProgress, this), b.on("error", this._handleManifestError, this, !0), b.loadManifest(a.images)
      }
    }, b._handleManifestFileLoad = function(a) {
      var b = a.result;
      if (null != b) {
        var c = this.getResult().images,
          d = c.indexOf(a.item.src);
        c[d] = b
      }
    }, b._handleManifestComplete = function(a) {
      this._result = new createjs.SpriteSheet(this._result), this._loadedItems = this._manifestQueue.getItems(!0), this._sendComplete()
    }, b._handleManifestProgress = function(a) {
      this.progress = a.progress * (1 - c.SPRITESHEET_PROGRESS) + c.SPRITESHEET_PROGRESS, this._sendProgress(this.progress)
    }, b._handleManifestError = function(a) {
      var b = new createjs.Event("fileerror");
      b.item = a.data, this.dispatchEvent(b)
    }, createjs.SpriteSheetLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b) {
      this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.SVG), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "data", b ? this.setTag(document.createElement("svg")) : (this.setTag(document.createElement("object")), this.getTag().type = "image/svg+xml")
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.SVG
    }, b._formatResult = function(a) {
      var b = createjs.DataUtils.parseXML(a.getResult(!0), "text/xml"),
        c = a.getTag();
      return !this._preferXHR && document.body.contains(c) && document.body.removeChild(c), null != b.documentElement ? (c.appendChild(b.documentElement), c.style.visibility = "visible", c) : b
    }, createjs.SVGLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.XML), this.resultFormatter = this._formatResult
    }
    var b = createjs.extend(a, createjs.AbstractLoader),
      c = a;
    c.canLoadItem = function(a) {
      return a.type == createjs.AbstractLoader.XML
    }, b._formatResult = function(a) {
      return createjs.DataUtils.parseXML(a.getResult(!0), "text/xml")
    }, createjs.XMLLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    var a = createjs.SoundJS = createjs.SoundJS || {};
    a.version = "0.6.2", a.buildDate = "Thu, 26 Nov 2015 20:44:31 GMT"
  }(), this.createjs = this.createjs || {}, createjs.indexOf = function(a, b) {
    "use strict";
    for (var c = 0, d = a.length; d > c; c++)
      if (b === a[c]) return c;
    return -1
  }, this.createjs = this.createjs || {},
  function() {
    "use strict";
    createjs.proxy = function(a, b) {
      var c = Array.prototype.slice.call(arguments, 2);
      return function() {
        return a.apply(b, Array.prototype.slice.call(arguments, 0).concat(c))
      }
    }
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "BrowserDetect cannot be instantiated"
    }
    var b = a.agent = window.navigator.userAgent;
    a.isWindowPhone = b.indexOf("IEMobile") > -1 || b.indexOf("Windows Phone") > -1, a.isFirefox = b.indexOf("Firefox") > -1, a.isOpera = null != window.opera, a.isChrome = b.indexOf("Chrome") > -1, a.isIOS = (b.indexOf("iPod") > -1 || b.indexOf("iPhone") > -1 || b.indexOf("iPad") > -1) && !a.isWindowPhone, a.isAndroid = b.indexOf("Android") > -1 && !a.isWindowPhone, a.isBlackberry = b.indexOf("Blackberry") > -1, createjs.BrowserDetect = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = function() {
        this.interrupt = null, this.delay = null, this.offset = null, this.loop = null, this.volume = null, this.pan = null, this.startTime = null, this.duration = null
      },
      b = a.prototype = {},
      c = a;
    c.create = function(a) {
      if (a instanceof c || a instanceof Object) {
        var b = new createjs.PlayPropsConfig;
        return b.set(a), b
      }
      throw new Error("Type not recognized.")
    }, b.set = function(a) {
      for (var b in a) this[b] = a[b];
      return this
    }, b.toString = function() {
      return "[PlayPropsConfig]"
    }, createjs.PlayPropsConfig = c
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "Sound cannot be instantiated"
    }

    function b(a, b) {
      this.init(a, b)
    }
    var c = a;
    c.INTERRUPT_ANY = "any", c.INTERRUPT_EARLY = "early", c.INTERRUPT_LATE = "late", c.INTERRUPT_NONE = "none", c.PLAY_INITED = "playInited", c.PLAY_SUCCEEDED = "playSucceeded", c.PLAY_INTERRUPTED = "playInterrupted", c.PLAY_FINISHED = "playFinished", c.PLAY_FAILED = "playFailed", c.SUPPORTED_EXTENSIONS = ["mp3", "ogg", "opus", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"], c.EXTENSION_MAP = {
      m4a: "mp4"
    }, c.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([\/.]*?(?:[^?]+)?\/)?((?:[^\/?]+)\.(\w+))(?:\?(\S+)?)?$/, c.defaultInterruptBehavior = c.INTERRUPT_NONE, c.alternateExtensions = [], c.activePlugin = null, c._masterVolume = 1, Object.defineProperty(c, "volume", {
      get: function() {
        return this._masterVolume
      },
      set: function(a) {
        if (null == Number(a)) return !1;
        if (a = Math.max(0, Math.min(1, a)), c._masterVolume = a, !this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(a))
          for (var b = this._instances, d = 0, e = b.length; e > d; d++) b[d].setMasterVolume(a)
      }
    }), c._masterMute = !1, Object.defineProperty(c, "muted", {
      get: function() {
        return this._masterMute
      },
      set: function(a) {
        if (null == a) return !1;
        if (this._masterMute = a, !this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a))
          for (var b = this._instances, c = 0, d = b.length; d > c; c++) b[c].setMasterMute(a);
        return !0
      }
    }), Object.defineProperty(c, "capabilities", {
      get: function() {
        return null == c.activePlugin ? null : c.activePlugin._capabilities
      },
      set: function(a) {
        return !1
      }
    }), c._pluginsRegistered = !1, c._lastID = 0, c._instances = [], c._idHash = {}, c._preloadHash = {}, c._defaultPlayPropsHash = {}, c.addEventListener = null, c.removeEventListener = null, c.removeAllEventListeners = null, c.dispatchEvent = null, c.hasEventListener = null, c._listeners = null, createjs.EventDispatcher.initialize(c), c.getPreloadHandlers = function() {
      return {
        callback: createjs.proxy(c.initLoad, c),
        types: ["sound"],
        extensions: c.SUPPORTED_EXTENSIONS
      }
    }, c._handleLoadComplete = function(a) {
      var b = a.target.getItem().src;
      if (c._preloadHash[b])
        for (var d = 0, e = c._preloadHash[b].length; e > d; d++) {
          var f = c._preloadHash[b][d];
          if (c._preloadHash[b][d] = !0, c.hasEventListener("fileload")) {
            var a = new createjs.Event("fileload");
            a.src = f.src, a.id = f.id, a.data = f.data, a.sprite = f.sprite, c.dispatchEvent(a)
          }
        }
    }, c._handleLoadError = function(a) {
      var b = a.target.getItem().src;
      if (c._preloadHash[b])
        for (var d = 0, e = c._preloadHash[b].length; e > d; d++) {
          var f = c._preloadHash[b][d];
          if (c._preloadHash[b][d] = !1, c.hasEventListener("fileerror")) {
            var a = new createjs.Event("fileerror");
            a.src = f.src, a.id = f.id, a.data = f.data, a.sprite = f.sprite, c.dispatchEvent(a)
          }
        }
    }, c._registerPlugin = function(a) {
      return a.isSupported() ? (c.activePlugin = new a, !0) : !1
    }, c.registerPlugins = function(a) {
      c._pluginsRegistered = !0;
      for (var b = 0, d = a.length; d > b; b++)
        if (c._registerPlugin(a[b])) return !0;
      return !1
    }, c.initializeDefaultPlugins = function() {
      return null != c.activePlugin ? !0 : c._pluginsRegistered ? !1 : c.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]) ? !0 : !1
    }, c.isReady = function() {
      return null != c.activePlugin
    }, c.getCapabilities = function() {
      return null == c.activePlugin ? null : c.activePlugin._capabilities
    }, c.getCapability = function(a) {
      return null == c.activePlugin ? null : c.activePlugin._capabilities[a]
    }, c.initLoad = function(a) {
      return c._registerSound(a)
    }, c._registerSound = function(a) {
      if (!c.initializeDefaultPlugins()) return !1;
      var d;
      if (a.src instanceof Object ? (d = c._parseSrc(a.src), d.src = a.path + d.src) : d = c._parsePath(a.src), null == d) return !1;
      a.src = d.src, a.type = "sound";
      var e = a.data,
        f = null;
      if (null != e && (isNaN(e.channels) ? isNaN(e) || (f = parseInt(e)) : f = parseInt(e.channels), e.audioSprite))
        for (var g, h = e.audioSprite.length; h--;) g = e.audioSprite[h], c._idHash[g.id] = {
          src: a.src,
          startTime: parseInt(g.startTime),
          duration: parseInt(g.duration)
        }, g.defaultPlayProps && (c._defaultPlayPropsHash[g.id] = createjs.PlayPropsConfig.create(g.defaultPlayProps));
      null != a.id && (c._idHash[a.id] = {
        src: a.src
      });
      var i = c.activePlugin.register(a);
      return b.create(a.src, f), null != e && isNaN(e) ? a.data.channels = f || b.maxPerChannel() : a.data = f || b.maxPerChannel(), i.type && (a.type = i.type), a.defaultPlayProps && (c._defaultPlayPropsHash[a.src] = createjs.PlayPropsConfig.create(a.defaultPlayProps)), i
    }, c.registerSound = function(a, b, d, e, f) {
      var g = {
        src: a,
        id: b,
        data: d,
        defaultPlayProps: f
      };
      a instanceof Object && a.src && (e = b, g = a), g = createjs.LoadItem.create(g), g.path = e, null == e || g.src instanceof Object || (g.src = e + a);
      var h = c._registerSound(g);
      if (!h) return !1;
      if (c._preloadHash[g.src] || (c._preloadHash[g.src] = []), c._preloadHash[g.src].push(g), 1 == c._preloadHash[g.src].length) h.on("complete", createjs.proxy(this._handleLoadComplete, this)), h.on("error", createjs.proxy(this._handleLoadError, this)), c.activePlugin.preload(h);
      else if (1 == c._preloadHash[g.src][0]) return !0;
      return g
    }, c.registerSounds = function(a, b) {
      var c = [];
      a.path && (b ? b += a.path : b = a.path, a = a.manifest);
      for (var d = 0, e = a.length; e > d; d++) c[d] = createjs.Sound.registerSound(a[d].src, a[d].id, a[d].data, b, a[d].defaultPlayProps);
      return c
    }, c.removeSound = function(a, d) {
      if (null == c.activePlugin) return !1;
      a instanceof Object && a.src && (a = a.src);
      var e;
      if (a instanceof Object ? e = c._parseSrc(a) : (a = c._getSrcById(a).src, e = c._parsePath(a)), null == e) return !1;
      a = e.src, null != d && (a = d + a);
      for (var f in c._idHash) c._idHash[f].src == a && delete c._idHash[f];
      return b.removeSrc(a), delete c._preloadHash[a], c.activePlugin.removeSound(a), !0
    }, c.removeSounds = function(a, b) {
      var c = [];
      a.path && (b ? b += a.path : b = a.path, a = a.manifest);
      for (var d = 0, e = a.length; e > d; d++) c[d] = createjs.Sound.removeSound(a[d].src, b);
      return c
    }, c.removeAllSounds = function() {
      c._idHash = {}, c._preloadHash = {}, b.removeAll(), c.activePlugin && c.activePlugin.removeAllSounds()
    }, c.loadComplete = function(a) {
      if (!c.isReady()) return !1;
      var b = c._parsePath(a);
      return a = b ? c._getSrcById(b.src).src : c._getSrcById(a).src, void 0 == c._preloadHash[a] ? !1 : 1 == c._preloadHash[a][0]
    }, c._parsePath = function(a) {
      "string" != typeof a && (a = a.toString());
      var b = a.match(c.FILE_PATTERN);
      if (null == b) return !1;
      for (var d = b[4], e = b[5], f = c.capabilities, g = 0; !f[e];)
        if (e = c.alternateExtensions[g++], g > c.alternateExtensions.length) return null;
      a = a.replace("." + b[5], "." + e);
      var h = {
        name: d,
        src: a,
        extension: e
      };
      return h
    }, c._parseSrc = function(a) {
      var b = {
          name: void 0,
          src: void 0,
          extension: void 0
        },
        d = c.capabilities;
      for (var e in a)
        if (a.hasOwnProperty(e) && d[e]) {
          b.src = a[e], b.extension = e;
          break
        } if (!b.src) return !1;
      var f = b.src.lastIndexOf("/");
      return -1 != f ? b.name = b.src.slice(f + 1) : b.name = b.src, b
    }, c.play = function(a, b, d, e, f, g, h, i, j) {
      var k;
      k = b instanceof Object || b instanceof createjs.PlayPropsConfig ? createjs.PlayPropsConfig.create(b) : createjs.PlayPropsConfig.create({
        interrupt: b,
        delay: d,
        offset: e,
        loop: f,
        volume: g,
        pan: h,
        startTime: i,
        duration: j
      });
      var l = c.createInstance(a, k.startTime, k.duration),
        m = c._playInstance(l, k);
      return m || l._playFailed(), l
    }, c.createInstance = function(a, d, e) {
      if (!c.initializeDefaultPlugins()) return new createjs.DefaultSoundInstance(a, d, e);
      var f = c._defaultPlayPropsHash[a];
      a = c._getSrcById(a);
      var g = c._parsePath(a.src),
        h = null;
      return null != g && null != g.src ? (b.create(g.src), null == d && (d = a.startTime), h = c.activePlugin.create(g.src, d, e || a.duration), f = f || c._defaultPlayPropsHash[g.src], f && h.applyPlayProps(f)) : h = new createjs.DefaultSoundInstance(a, d, e), h.uniqueId = c._lastID++, h
    }, c.stop = function() {
      for (var a = this._instances, b = a.length; b--;) a[b].stop()
    }, c.setVolume = function(a) {
      if (null == Number(a)) return !1;
      if (a = Math.max(0, Math.min(1, a)), c._masterVolume = a, !this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(a))
        for (var b = this._instances, d = 0, e = b.length; e > d; d++) b[d].setMasterVolume(a)
    }, c.getVolume = function() {
      return this._masterVolume
    }, c.setMute = function(a) {
      if (null == a) return !1;
      if (this._masterMute = a, !this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a))
        for (var b = this._instances, c = 0, d = b.length; d > c; c++) b[c].setMasterMute(a);
      return !0
    }, c.getMute = function() {
      return this._masterMute
    }, c.setDefaultPlayProps = function(a, b) {
      a = c._getSrcById(a), c._defaultPlayPropsHash[c._parsePath(a.src).src] = createjs.PlayPropsConfig.create(b)
    }, c.getDefaultPlayProps = function(a) {
      return a = c._getSrcById(a), c._defaultPlayPropsHash[c._parsePath(a.src).src]
    }, c._playInstance = function(a, b) {
      var d = c._defaultPlayPropsHash[a.src] || {};
      if (null == b.interrupt && (b.interrupt = d.interrupt || c.defaultInterruptBehavior), null == b.delay && (b.delay = d.delay || 0), null == b.offset && (b.offset = a.getPosition()), null == b.loop && (b.loop = a.loop), null == b.volume && (b.volume = a.volume), null == b.pan && (b.pan = a.pan), 0 == b.delay) {
        var e = c._beginPlaying(a, b);
        if (!e) return !1
      } else {
        var f = setTimeout(function() {
          c._beginPlaying(a, b)
        }, b.delay);
        a.delayTimeoutId = f
      }
      return this._instances.push(a), !0
    }, c._beginPlaying = function(a, c) {
      if (!b.add(a, c.interrupt)) return !1;
      var d = a._beginPlaying(c);
      if (!d) {
        var e = createjs.indexOf(this._instances, a);
        return e > -1 && this._instances.splice(e, 1), !1
      }
      return !0
    }, c._getSrcById = function(a) {
      return c._idHash[a] || {
        src: a
      }
    }, c._playFinished = function(a) {
      b.remove(a);
      var c = createjs.indexOf(this._instances, a);
      c > -1 && this._instances.splice(c, 1)
    }, createjs.Sound = a, b.channels = {}, b.create = function(a, c) {
      var d = b.get(a);
      return null == d ? (b.channels[a] = new b(a, c), !0) : !1
    }, b.removeSrc = function(a) {
      var c = b.get(a);
      return null == c ? !1 : (c._removeAll(), delete b.channels[a], !0)
    }, b.removeAll = function() {
      for (var a in b.channels) b.channels[a]._removeAll();
      b.channels = {}
    }, b.add = function(a, c) {
      var d = b.get(a.src);
      return null == d ? !1 : d._add(a, c)
    }, b.remove = function(a) {
      var c = b.get(a.src);
      return null == c ? !1 : (c._remove(a), !0)
    }, b.maxPerChannel = function() {
      return d.maxDefault
    }, b.get = function(a) {
      return b.channels[a]
    };
    var d = b.prototype;
    d.constructor = b, d.src = null, d.max = null, d.maxDefault = 100, d.length = 0, d.init = function(a, b) {
      this.src = a, this.max = b || this.maxDefault, -1 == this.max && (this.max = this.maxDefault), this._instances = []
    }, d._get = function(a) {
      return this._instances[a]
    }, d._add = function(a, b) {
      return this._getSlot(b, a) ? (this._instances.push(a), this.length++, !0) : !1
    }, d._remove = function(a) {
      var b = createjs.indexOf(this._instances, a);
      return -1 == b ? !1 : (this._instances.splice(b, 1), this.length--, !0)
    }, d._removeAll = function() {
      for (var a = this.length - 1; a >= 0; a--) this._instances[a].stop()
    }, d._getSlot = function(b, c) {
      var d, e;
      if (b != a.INTERRUPT_NONE && (e = this._get(0), null == e)) return !0;
      for (var f = 0, g = this.max; g > f; f++) {
        if (d = this._get(f), null == d) return !0;
        if (d.playState == a.PLAY_FINISHED || d.playState == a.PLAY_INTERRUPTED || d.playState == a.PLAY_FAILED) {
          e = d;
          break
        }
        b != a.INTERRUPT_NONE && (b == a.INTERRUPT_EARLY && d.getPosition() < e.getPosition() || b == a.INTERRUPT_LATE && d.getPosition() > e.getPosition()) && (e = d)
      }
      return null != e ? (e._interrupt(), this._remove(e), !0) : !1
    }, d.toString = function() {
      return "[Sound SoundChannel]"
    }
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = function(a, b, c, d) {
        this.EventDispatcher_constructor(), this.src = a, this.uniqueId = -1, this.playState = null, this.delayTimeoutId = null, this._volume = 1, Object.defineProperty(this, "volume", {
          get: this.getVolume,
          set: this.setVolume
        }), this._pan = 0, Object.defineProperty(this, "pan", {
          get: this.getPan,
          set: this.setPan
        }), this._startTime = Math.max(0, b || 0), Object.defineProperty(this, "startTime", {
          get: this.getStartTime,
          set: this.setStartTime
        }), this._duration = Math.max(0, c || 0), Object.defineProperty(this, "duration", {
          get: this.getDuration,
          set: this.setDuration
        }), this._playbackResource = null, Object.defineProperty(this, "playbackResource", {
          get: this.getPlaybackResource,
          set: this.setPlaybackResource
        }), d !== !1 && d !== !0 && this.setPlaybackResource(d), this._position = 0, Object.defineProperty(this, "position", {
          get: this.getPosition,
          set: this.setPosition
        }), this._loop = 0, Object.defineProperty(this, "loop", {
          get: this.getLoop,
          set: this.setLoop
        }), this._muted = !1, Object.defineProperty(this, "muted", {
          get: this.getMuted,
          set: this.setMuted
        }), this._paused = !1, Object.defineProperty(this, "paused", {
          get: this.getPaused,
          set: this.setPaused
        })
      },
      b = createjs.extend(a, createjs.EventDispatcher);
    b.play = function(a, b, c, d, e, f) {
      var g;
      return g = a instanceof Object || a instanceof createjs.PlayPropsConfig ? createjs.PlayPropsConfig.create(a) : createjs.PlayPropsConfig.create({
        interrupt: a,
        delay: b,
        offset: c,
        loop: d,
        volume: e,
        pan: f
      }), this.playState == createjs.Sound.PLAY_SUCCEEDED ? (this.applyPlayProps(g), void(this._paused && this.setPaused(!1))) : (this._cleanUp(), createjs.Sound._playInstance(this, g), this)
    }, b.stop = function() {
      return this._position = 0, this._paused = !1, this._handleStop(), this._cleanUp(), this.playState = createjs.Sound.PLAY_FINISHED, this
    }, b.destroy = function() {
      this._cleanUp(), this.src = null, this.playbackResource = null, this.removeAllEventListeners()
    }, b.applyPlayProps = function(a) {
      return null != a.offset && this.setPosition(a.offset), null != a.loop && this.setLoop(a.loop), null != a.volume && this.setVolume(a.volume), null != a.pan && this.setPan(a.pan), null != a.startTime && (this.setStartTime(a.startTime), this.setDuration(a.duration)), this
    }, b.toString = function() {
      return "[AbstractSoundInstance]"
    }, b.getPaused = function() {
      return this._paused
    }, b.setPaused = function(a) {
      return a !== !0 && a !== !1 || this._paused == a || 1 == a && this.playState != createjs.Sound.PLAY_SUCCEEDED ? void 0 : (this._paused = a, a ? this._pause() : this._resume(), clearTimeout(this.delayTimeoutId), this)
    }, b.setVolume = function(a) {
      return a == this._volume ? this : (this._volume = Math.max(0, Math.min(1, a)), this._muted || this._updateVolume(), this)
    }, b.getVolume = function() {
      return this._volume
    }, b.setMuted = function(a) {
      return a === !0 || a === !1 ? (this._muted = a, this._updateVolume(), this) : void 0
    }, b.getMuted = function() {
      return this._muted
    }, b.setPan = function(a) {
      return a == this._pan ? this : (this._pan = Math.max(-1, Math.min(1, a)), this._updatePan(), this)
    }, b.getPan = function() {
      return this._pan
    }, b.getPosition = function() {
      return this._paused || this.playState != createjs.Sound.PLAY_SUCCEEDED || (this._position = this._calculateCurrentPosition()), this._position
    }, b.setPosition = function(a) {
      return this._position = Math.max(0, a), this.playState == createjs.Sound.PLAY_SUCCEEDED && this._updatePosition(), this
    }, b.getStartTime = function() {
      return this._startTime
    }, b.setStartTime = function(a) {
      return a == this._startTime ? this : (this._startTime = Math.max(0, a || 0), this._updateStartTime(), this)
    }, b.getDuration = function() {
      return this._duration
    }, b.setDuration = function(a) {
      return a == this._duration ? this : (this._duration = Math.max(0, a || 0), this._updateDuration(), this)
    }, b.setPlaybackResource = function(a) {
      return this._playbackResource = a, 0 == this._duration && this._setDurationFromSource(), this
    }, b.getPlaybackResource = function() {
      return this._playbackResource
    }, b.getLoop = function() {
      return this._loop
    }, b.setLoop = function(a) {
      null != this._playbackResource && (0 != this._loop && 0 == a ? this._removeLooping(a) : 0 == this._loop && 0 != a && this._addLooping(a)), this._loop = a
    }, b._sendEvent = function(a) {
      var b = new createjs.Event(a);
      this.dispatchEvent(b)
    }, b._cleanUp = function() {
      clearTimeout(this.delayTimeoutId), this._handleCleanUp(), this._paused = !1, createjs.Sound._playFinished(this)
    }, b._interrupt = function() {
      this._cleanUp(), this.playState = createjs.Sound.PLAY_INTERRUPTED, this._sendEvent("interrupted")
    }, b._beginPlaying = function(a) {
      return this.setPosition(a.offset), this.setLoop(a.loop), this.setVolume(a.volume), this.setPan(a.pan), null != a.startTime && (this.setStartTime(a.startTime), this.setDuration(a.duration)), null != this._playbackResource && this._position < this._duration ? (this._paused = !1, this._handleSoundReady(), this.playState = createjs.Sound.PLAY_SUCCEEDED, this._sendEvent("succeeded"), !0) : (this._playFailed(), !1)
    }, b._playFailed = function() {
      this._cleanUp(), this.playState = createjs.Sound.PLAY_FAILED, this._sendEvent("failed")
    }, b._handleSoundComplete = function(a) {
      return this._position = 0, 0 != this._loop ? (this._loop--, this._handleLoop(), void this._sendEvent("loop")) : (this._cleanUp(), this.playState = createjs.Sound.PLAY_FINISHED, void this._sendEvent("complete"))
    }, b._handleSoundReady = function() {}, b._updateVolume = function() {}, b._updatePan = function() {}, b._updateStartTime = function() {}, b._updateDuration = function() {}, b._setDurationFromSource = function() {}, b._calculateCurrentPosition = function() {}, b._updatePosition = function() {}, b._removeLooping = function(a) {}, b._addLooping = function(a) {}, b._pause = function() {}, b._resume = function() {}, b._handleStop = function() {}, b._handleCleanUp = function() {}, b._handleLoop = function() {}, createjs.AbstractSoundInstance = createjs.promote(a, "EventDispatcher"), createjs.DefaultSoundInstance = createjs.AbstractSoundInstance
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = function() {
        this._capabilities = null, this._loaders = {}, this._audioSources = {}, this._soundInstances = {}, this._volume = 1, this._loaderClass, this._soundInstanceClass
      },
      b = a.prototype;
    a._capabilities = null, a.isSupported = function() {
      return !0
    }, b.register = function(a) {
      var b = this._loaders[a.src];
      return b && !b.canceled ? this._loaders[a.src] : (this._audioSources[a.src] = !0, this._soundInstances[a.src] = [], b = new this._loaderClass(a), b.on("complete", this._handlePreloadComplete, this), this._loaders[a.src] = b, b)
    }, b.preload = function(a) {
      a.on("error", this._handlePreloadError, this), a.load()
    }, b.isPreloadStarted = function(a) {
      return null != this._audioSources[a]
    }, b.isPreloadComplete = function(a) {
      return !(null == this._audioSources[a] || 1 == this._audioSources[a])
    }, b.removeSound = function(a) {
      if (this._soundInstances[a]) {
        for (var b = this._soundInstances[a].length; b--;) {
          var c = this._soundInstances[a][b];
          c.destroy()
        }
        delete this._soundInstances[a], delete this._audioSources[a], this._loaders[a] && this._loaders[a].destroy(), delete this._loaders[a]
      }
    }, b.removeAllSounds = function() {
      for (var a in this._audioSources) this.removeSound(a)
    }, b.create = function(a, b, c) {
      this.isPreloadStarted(a) || this.preload(this.register(a));
      var d = new this._soundInstanceClass(a, b, c, this._audioSources[a]);
      return this._soundInstances[a].push(d), d
    }, b.setVolume = function(a) {
      return this._volume = a, this._updateVolume(), !0
    }, b.getVolume = function() {
      return this._volume
    }, b.setMute = function(a) {
      return this._updateVolume(), !0
    }, b.toString = function() {
      return "[AbstractPlugin]"
    }, b._handlePreloadComplete = function(a) {
      var b = a.target.getItem().src;
      this._audioSources[b] = a.result;
      for (var c = 0, d = this._soundInstances[b].length; d > c; c++) {
        var e = this._soundInstances[b][c];
        e.setPlaybackResource(this._audioSources[b]);
      }
    }, b._handlePreloadError = function(a) {}, b._updateVolume = function() {}, createjs.AbstractPlugin = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a) {
      this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.SOUND)
    }
    var b = createjs.extend(a, createjs.AbstractLoader);
    a.context = null, b.toString = function() {
      return "[WebAudioLoader]"
    }, b._createRequest = function() {
      this._request = new createjs.XHRRequest(this._item, !1), this._request.setResponseType("arraybuffer")
    }, b._sendComplete = function(b) {
      a.context.decodeAudioData(this._rawResult, createjs.proxy(this._handleAudioDecoded, this), createjs.proxy(this._sendError, this))
    }, b._handleAudioDecoded = function(a) {
      this._result = a, this.AbstractLoader__sendComplete()
    }, createjs.WebAudioLoader = createjs.promote(a, "AbstractLoader")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, d, e) {
      this.AbstractSoundInstance_constructor(a, b, d, e), this.gainNode = c.context.createGain(), this.panNode = c.context.createPanner(), this.panNode.panningModel = c._panningModel, this.panNode.connect(this.gainNode), this._updatePan(), this.sourceNode = null, this._soundCompleteTimeout = null, this._sourceNodeNext = null, this._playbackStartTime = 0, this._endedHandler = createjs.proxy(this._handleSoundComplete, this)
    }
    var b = createjs.extend(a, createjs.AbstractSoundInstance),
      c = a;
    c.context = null, c._scratchBuffer = null, c.destinationNode = null, c._panningModel = "equalpower", b.destroy = function() {
      this.AbstractSoundInstance_destroy(), this.panNode.disconnect(0), this.panNode = null, this.gainNode.disconnect(0), this.gainNode = null
    }, b.toString = function() {
      return "[WebAudioSoundInstance]"
    }, b._updatePan = function() {
      this.panNode.setPosition(this._pan, 0, -.5)
    }, b._removeLooping = function(a) {
      this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext)
    }, b._addLooping = function(a) {
      this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0))
    }, b._setDurationFromSource = function() {
      this._duration = 1e3 * this.playbackResource.duration
    }, b._handleCleanUp = function() {
      this.sourceNode && this.playState == createjs.Sound.PLAY_SUCCEEDED && (this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext)), 0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0), clearTimeout(this._soundCompleteTimeout), this._playbackStartTime = 0
    }, b._cleanUpAudioNode = function(a) {
      if (a) {
        a.stop(0), a.disconnect(0);
        try {
          a.buffer = c._scratchBuffer
        } catch (b) {}
        a = null
      }
      return a
    }, b._handleSoundReady = function(a) {
      this.gainNode.connect(c.destinationNode);
      var b = .001 * this._duration,
        d = .001 * this._position;
      d > b && (d = b), this.sourceNode = this._createAndPlayAudioNode(c.context.currentTime - b, d), this._playbackStartTime = this.sourceNode.startTime - d, this._soundCompleteTimeout = setTimeout(this._endedHandler, 1e3 * (b - d)), 0 != this._loop && (this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0))
    }, b._createAndPlayAudioNode = function(a, b) {
      var d = c.context.createBufferSource();
      d.buffer = this.playbackResource, d.connect(this.panNode);
      var e = .001 * this._duration;
      return d.startTime = a + e, d.start(d.startTime, b + .001 * this._startTime, e - b), d
    }, b._pause = function() {
      this._position = 1e3 * (c.context.currentTime - this._playbackStartTime), this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext), 0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0), clearTimeout(this._soundCompleteTimeout)
    }, b._resume = function() {
      this._handleSoundReady()
    }, b._updateVolume = function() {
      var a = this._muted ? 0 : this._volume;
      a != this.gainNode.gain.value && (this.gainNode.gain.value = a)
    }, b._calculateCurrentPosition = function() {
      return 1e3 * (c.context.currentTime - this._playbackStartTime)
    }, b._updatePosition = function() {
      this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext), clearTimeout(this._soundCompleteTimeout), this._paused || this._handleSoundReady()
    }, b._handleLoop = function() {
      this._cleanUpAudioNode(this.sourceNode), this.sourceNode = this._sourceNodeNext, this._playbackStartTime = this.sourceNode.startTime, this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0), this._soundCompleteTimeout = setTimeout(this._endedHandler, this._duration)
    }, b._updateDuration = function() {
      this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._pause(), this._resume())
    }, createjs.WebAudioSoundInstance = createjs.promote(a, "AbstractSoundInstance")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this.AbstractPlugin_constructor(), this._panningModel = c._panningModel, this.context = c.context, this.dynamicsCompressorNode = this.context.createDynamicsCompressor(), this.dynamicsCompressorNode.connect(this.context.destination), this.gainNode = this.context.createGain(), this.gainNode.connect(this.dynamicsCompressorNode), createjs.WebAudioSoundInstance.destinationNode = this.gainNode, this._capabilities = c._capabilities, this._loaderClass = createjs.WebAudioLoader, this._soundInstanceClass = createjs.WebAudioSoundInstance, this._addPropsToClasses()
    }
    var b = createjs.extend(a, createjs.AbstractPlugin),
      c = a;
    c._capabilities = null, c._panningModel = "equalpower", c.context = null, c._scratchBuffer = null, c._unlocked = !1, c.isSupported = function() {
      var a = createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry;
      return "file:" != location.protocol || a || this._isFileXHRSupported() ? (c._generateCapabilities(), null == c.context ? !1 : !0) : !1
    }, c.playEmptySound = function() {
      if (null != c.context) {
        var a = c.context.createBufferSource();
        a.buffer = c._scratchBuffer, a.connect(c.context.destination), a.start(0, 0, 0)
      }
    }, c._isFileXHRSupported = function() {
      var a = !0,
        b = new XMLHttpRequest;
      try {
        b.open("GET", "WebAudioPluginTest.fail", !1)
      } catch (c) {
        return a = !1
      }
      b.onerror = function() {
        a = !1
      }, b.onload = function() {
        a = 404 == this.status || 200 == this.status || 0 == this.status && "" != this.response
      };
      try {
        b.send()
      } catch (c) {
        a = !1
      }
      return a
    }, c._generateCapabilities = function() {
      if (null == c._capabilities) {
        var a = document.createElement("audio");
        if (null == a.canPlayType) return null;
        if (null == c.context)
          if (window.AudioContext) c.context = new AudioContext;
          else {
            if (!window.webkitAudioContext) return null;
            c.context = new webkitAudioContext
          } null == c._scratchBuffer && (c._scratchBuffer = c.context.createBuffer(1, 1, 22050)), c._compatibilitySetUp(), "ontouchstart" in window && "running" != c.context.state && (c._unlock(), document.addEventListener("mousedown", c._unlock, !0), document.addEventListener("touchend", c._unlock, !0)), c._capabilities = {
          panning: !0,
          volume: !0,
          tracks: -1
        };
        for (var b = createjs.Sound.SUPPORTED_EXTENSIONS, d = createjs.Sound.EXTENSION_MAP, e = 0, f = b.length; f > e; e++) {
          var g = b[e],
            h = d[g] || g;
          c._capabilities[g] = "no" != a.canPlayType("audio/" + g) && "" != a.canPlayType("audio/" + g) || "no" != a.canPlayType("audio/" + h) && "" != a.canPlayType("audio/" + h)
        }
        c.context.destination.numberOfChannels < 2 && (c._capabilities.panning = !1)
      }
    }, c._compatibilitySetUp = function() {
      if (c._panningModel = "equalpower", !c.context.createGain) {
        c.context.createGain = c.context.createGainNode;
        var a = c.context.createBufferSource();
        a.__proto__.start = a.__proto__.noteGrainOn, a.__proto__.stop = a.__proto__.noteOff, c._panningModel = 0
      }
    }, c._unlock = function() {
      c._unlocked || (c.playEmptySound(), "running" == c.context.state && (document.removeEventListener("mousedown", c._unlock, !0), document.removeEventListener("touchend", c._unlock, !0), c._unlocked = !0))
    }, b.toString = function() {
      return "[WebAudioPlugin]"
    }, b._addPropsToClasses = function() {
      var a = this._soundInstanceClass;
      a.context = this.context, a._scratchBuffer = c._scratchBuffer, a.destinationNode = this.gainNode, a._panningModel = this._panningModel, this._loaderClass.context = this.context
    }, b._updateVolume = function() {
      var a = createjs.Sound._masterMute ? 0 : this._volume;
      a != this.gainNode.gain.value && (this.gainNode.gain.value = a)
    }, createjs.WebAudioPlugin = createjs.promote(a, "AbstractPlugin")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "HTMLAudioTagPool cannot be instantiated"
    }

    function b(a) {
      this._tags = []
    }
    var c = a;
    c._tags = {}, c._tagPool = new b, c._tagUsed = {}, c.get = function(a) {
      var b = c._tags[a];
      return null == b ? (b = c._tags[a] = c._tagPool.get(), b.src = a) : c._tagUsed[a] ? (b = c._tagPool.get(), b.src = a) : c._tagUsed[a] = !0, b
    }, c.set = function(a, b) {
      b == c._tags[a] ? c._tagUsed[a] = !1 : c._tagPool.set(b)
    }, c.remove = function(a) {
      var b = c._tags[a];
      return null == b ? !1 : (c._tagPool.set(b), delete c._tags[a], delete c._tagUsed[a], !0)
    }, c.getDuration = function(a) {
      var b = c._tags[a];
      return null != b && b.duration ? 1e3 * b.duration : 0
    }, createjs.HTMLAudioTagPool = a;
    var d = b.prototype;
    d.constructor = b, d.get = function() {
      var a;
      return a = 0 == this._tags.length ? this._createTag() : this._tags.pop(), null == a.parentNode && document.body.appendChild(a), a
    }, d.set = function(a) {
      var b = createjs.indexOf(this._tags, a); - 1 == b && (this._tags.src = null, this._tags.push(a))
    }, d.toString = function() {
      return "[TagPool]"
    }, d._createTag = function() {
      var a = document.createElement("audio");
      return a.autoplay = !1, a.preload = "none", a
    }
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c, d) {
      this.AbstractSoundInstance_constructor(a, b, c, d), this._audioSpriteStopTime = null, this._delayTimeoutId = null, this._endedHandler = createjs.proxy(this._handleSoundComplete, this), this._readyHandler = createjs.proxy(this._handleTagReady, this), this._stalledHandler = createjs.proxy(this._playFailed, this), this._audioSpriteEndHandler = createjs.proxy(this._handleAudioSpriteLoop, this), this._loopHandler = createjs.proxy(this._handleSoundComplete, this), c ? this._audioSpriteStopTime = .001 * (b + c) : this._duration = createjs.HTMLAudioTagPool.getDuration(this.src)
    }
    var b = createjs.extend(a, createjs.AbstractSoundInstance);
    b.setMasterVolume = function(a) {
      this._updateVolume()
    }, b.setMasterMute = function(a) {
      this._updateVolume()
    }, b.toString = function() {
      return "[HTMLAudioSoundInstance]"
    }, b._removeLooping = function() {
      null != this._playbackResource && (this._playbackResource.loop = !1, this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1))
    }, b._addLooping = function() {
      null == this._playbackResource || this._audioSpriteStopTime || (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.loop = !0)
    }, b._handleCleanUp = function() {
      var a = this._playbackResource;
      if (null != a) {
        a.pause(), a.loop = !1, a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1);
        try {
          a.currentTime = this._startTime
        } catch (b) {}
        createjs.HTMLAudioTagPool.set(this.src, a), this._playbackResource = null
      }
    }, b._beginPlaying = function(a) {
      return this._playbackResource = createjs.HTMLAudioTagPool.get(this.src), this.AbstractSoundInstance__beginPlaying(a)
    }, b._handleSoundReady = function(a) {
      if (4 !== this._playbackResource.readyState) {
        var b = this._playbackResource;
        return b.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), b.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), b.preload = "auto", void b.load()
      }
      this._updateVolume(), this._playbackResource.currentTime = .001 * (this._startTime + this._position), this._audioSpriteStopTime ? this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1) : (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), 0 != this._loop && (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.loop = !0)), this._playbackResource.play()
    }, b._handleTagReady = function(a) {
      this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), this._handleSoundReady()
    }, b._pause = function() {
      this._playbackResource.pause()
    }, b._resume = function() {
      this._playbackResource.play()
    }, b._updateVolume = function() {
      if (null != this._playbackResource) {
        var a = this._muted || createjs.Sound._masterMute ? 0 : this._volume * createjs.Sound._masterVolume;
        a != this._playbackResource.volume && (this._playbackResource.volume = a)
      }
    }, b._calculateCurrentPosition = function() {
      return 1e3 * this._playbackResource.currentTime - this._startTime
    }, b._updatePosition = function() {
      this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, !1);
      try {
        this._playbackResource.currentTime = .001 * (this._position + this._startTime)
      } catch (a) {
        this._handleSetPositionSeek(null)
      }
    }, b._handleSetPositionSeek = function(a) {
      null != this._playbackResource && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1))
    }, b._handleAudioSpriteLoop = function(a) {
      this._playbackResource.currentTime <= this._audioSpriteStopTime || (this._playbackResource.pause(), 0 == this._loop ? this._handleSoundComplete(null) : (this._position = 0, this._loop--, this._playbackResource.currentTime = .001 * this._startTime, this._paused || this._playbackResource.play(), this._sendEvent("loop")))
    }, b._handleLoop = function(a) {
      0 == this._loop && (this._playbackResource.loop = !1, this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1))
    }, b._updateStartTime = function() {
      this._audioSpriteStopTime = .001 * (this._startTime + this._duration), this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1))
    }, b._updateDuration = function() {
      this._audioSpriteStopTime = .001 * (this._startTime + this._duration), this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1))
    }, b._setDurationFromSource = function() {
      this._duration = createjs.HTMLAudioTagPool.getDuration(this.src), this._playbackResource = null
    }, createjs.HTMLAudioSoundInstance = createjs.promote(a, "AbstractSoundInstance")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      this.AbstractPlugin_constructor(), this.defaultNumChannels = 2, this._capabilities = c._capabilities, this._loaderClass = createjs.SoundLoader, this._soundInstanceClass = createjs.HTMLAudioSoundInstance
    }
    var b = createjs.extend(a, createjs.AbstractPlugin),
      c = a;
    c.MAX_INSTANCES = 30, c._AUDIO_READY = "canplaythrough", c._AUDIO_ENDED = "ended", c._AUDIO_SEEKED = "seeked", c._AUDIO_STALLED = "stalled", c._TIME_UPDATE = "timeupdate", c._capabilities = null, c.isSupported = function() {
      return c._generateCapabilities(), null != c._capabilities
    }, c._generateCapabilities = function() {
      if (null == c._capabilities) {
        var a = document.createElement("audio");
        if (null == a.canPlayType) return null;
        c._capabilities = {
          panning: !1,
          volume: !0,
          tracks: -1
        };
        for (var b = createjs.Sound.SUPPORTED_EXTENSIONS, d = createjs.Sound.EXTENSION_MAP, e = 0, f = b.length; f > e; e++) {
          var g = b[e],
            h = d[g] || g;
          c._capabilities[g] = "no" != a.canPlayType("audio/" + g) && "" != a.canPlayType("audio/" + g) || "no" != a.canPlayType("audio/" + h) && "" != a.canPlayType("audio/" + h)
        }
      }
    }, b.register = function(a) {
      var b = createjs.HTMLAudioTagPool.get(a.src),
        c = this.AbstractPlugin_register(a);
      return c.setTag(b), c
    }, b.removeSound = function(a) {
      this.AbstractPlugin_removeSound(a), createjs.HTMLAudioTagPool.remove(a)
    }, b.create = function(a, b, c) {
      var d = this.AbstractPlugin_create(a, b, c);
      return d.setPlaybackResource(null), d
    }, b.toString = function() {
      return "[HTMLAudioPlugin]"
    }, b.setVolume = b.getVolume = b.setMute = null, createjs.HTMLAudioPlugin = createjs.promote(a, "AbstractPlugin")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(b, c, d) {
      this.ignoreGlobalPause = !1, this.loop = !1, this.duration = 0, this.pluginData = d || {}, this.target = b, this.position = null, this.passive = !1, this._paused = !1, this._curQueueProps = {}, this._initQueueProps = {}, this._steps = [], this._actions = [], this._prevPosition = 0, this._stepPosition = 0, this._prevPos = -1, this._target = b, this._useTicks = !1, this._inited = !1, this._registered = !1, c && (this._useTicks = c.useTicks, this.ignoreGlobalPause = c.ignoreGlobalPause, this.loop = c.loop, c.onChange && this.addEventListener("change", c.onChange), c.override && a.removeTweens(b)), c && c.paused ? this._paused = !0 : createjs.Tween._register(this, !0), c && null != c.position && this.setPosition(c.position, a.NONE)
    }
    var b = createjs.extend(a, createjs.EventDispatcher);
    a.NONE = 0, a.LOOP = 1, a.REVERSE = 2, a.IGNORE = {}, a._tweens = [], a._plugins = {}, a.get = function(b, c, d, e) {
      return e && a.removeTweens(b), new a(b, c, d)
    }, a.tick = function(b, c) {
      for (var d = a._tweens.slice(), e = d.length - 1; e >= 0; e--) {
        var f = d[e];
        c && !f.ignoreGlobalPause || f._paused || f.tick(f._useTicks ? 1 : b)
      }
    }, a.handleEvent = function(a) {
      "tick" == a.type && this.tick(a.delta, a.paused)
    }, a.removeTweens = function(b) {
      if (b.tweenjs_count) {
        for (var c = a._tweens, d = c.length - 1; d >= 0; d--) {
          var e = c[d];
          e._target == b && (e._paused = !0, c.splice(d, 1))
        }
        b.tweenjs_count = 0
      }
    }, a.removeAllTweens = function() {
      for (var b = a._tweens, c = 0, d = b.length; d > c; c++) {
        var e = b[c];
        e._paused = !0, e.target && (e.target.tweenjs_count = 0)
      }
      b.length = 0
    }, a.hasActiveTweens = function(b) {
      return b ? null != b.tweenjs_count && !!b.tweenjs_count : a._tweens && !!a._tweens.length
    }, a.installPlugin = function(b, c) {
      var d = b.priority;
      null == d && (b.priority = d = 0);
      for (var e = 0, f = c.length, g = a._plugins; f > e; e++) {
        var h = c[e];
        if (g[h]) {
          for (var i = g[h], j = 0, k = i.length; k > j && !(d < i[j].priority); j++);
          g[h].splice(j, 0, b)
        } else g[h] = [b]
      }
    }, a._register = function(b, c) {
      var d = b._target,
        e = a._tweens;
      if (c && !b._registered) d && (d.tweenjs_count = d.tweenjs_count ? d.tweenjs_count + 1 : 1), e.push(b), !a._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", a), a._inited = !0);
      else if (!c && b._registered) {
        d && d.tweenjs_count--;
        for (var f = e.length; f--;)
          if (e[f] == b) {
            e.splice(f, 1);
            break
          }
      }
      b._registered = c
    }, b.wait = function(a, b) {
      if (null == a || 0 >= a) return this;
      var c = this._cloneProps(this._curQueueProps);
      return this._addStep({
        d: a,
        p0: c,
        e: this._linearEase,
        p1: c,
        v: b
      })
    }, b.to = function(a, b, c) {
      return (isNaN(b) || 0 > b) && (b = 0), this._addStep({
        d: b || 0,
        p0: this._cloneProps(this._curQueueProps),
        e: c,
        p1: this._cloneProps(this._appendQueueProps(a))
      })
    }, b.call = function(a, b, c) {
      return this._addAction({
        f: a,
        p: b ? b : [this],
        o: c ? c : this._target
      })
    }, b.set = function(a, b) {
      return this._addAction({
        f: this._set,
        o: this,
        p: [a, b ? b : this._target]
      })
    }, b.play = function(a) {
      return a || (a = this), this.call(a.setPaused, [!1], a)
    }, b.pause = function(a) {
      return a || (a = this), this.call(a.setPaused, [!0], a)
    }, b.setPosition = function(a, b) {
      0 > a && (a = 0), null == b && (b = 1);
      var c = a,
        d = !1;
      if (c >= this.duration && (this.loop ? c %= this.duration : (c = this.duration, d = !0)), c == this._prevPos) return d;
      var e = this._prevPos;
      if (this.position = this._prevPos = c, this._prevPosition = a, this._target)
        if (d) this._updateTargetProps(null, 1);
        else if (this._steps.length > 0) {
        for (var f = 0, g = this._steps.length; g > f && !(this._steps[f].t > c); f++);
        var h = this._steps[f - 1];
        this._updateTargetProps(h, (this._stepPosition = c - h.t) / h.d)
      }
      return 0 != b && this._actions.length > 0 && (this._useTicks ? this._runActions(c, c) : 1 == b && e > c ? (e != this.duration && this._runActions(e, this.duration), this._runActions(0, c, !0)) : this._runActions(e, c)), d && this.setPaused(!0), this.dispatchEvent("change"), d
    }, b.tick = function(a) {
      this._paused || this.setPosition(this._prevPosition + a)
    }, b.setPaused = function(b) {
      return this._paused === !!b ? this : (this._paused = !!b, a._register(this, !b), this)
    }, b.w = b.wait, b.t = b.to, b.c = b.call, b.s = b.set, b.toString = function() {
      return "[Tween]"
    }, b.clone = function() {
      throw "Tween can not be cloned."
    }, b._updateTargetProps = function(b, c) {
      var d, e, f, g, h, i;
      if (b || 1 != c) {
        if (this.passive = !!b.v, this.passive) return;
        b.e && (c = b.e(c, 0, 1, 1)), d = b.p0, e = b.p1
      } else this.passive = !1, d = e = this._curQueueProps;
      for (var j in this._initQueueProps) {
        null == (g = d[j]) && (d[j] = g = this._initQueueProps[j]), null == (h = e[j]) && (e[j] = h = g), f = g == h || 0 == c || 1 == c || "number" != typeof g ? 1 == c ? h : g : g + (h - g) * c;
        var k = !1;
        if (i = a._plugins[j])
          for (var l = 0, m = i.length; m > l; l++) {
            var n = i[l].tween(this, j, f, d, e, c, !!b && d == e, !b);
            n == a.IGNORE ? k = !0 : f = n
          }
        k || (this._target[j] = f)
      }
    }, b._runActions = function(a, b, c) {
      var d = a,
        e = b,
        f = -1,
        g = this._actions.length,
        h = 1;
      for (a > b && (d = b, e = a, f = g, g = h = -1);
        (f += h) != g;) {
        var i = this._actions[f],
          j = i.t;
        (j == e || j > d && e > j || c && j == a) && i.f.apply(i.o, i.p)
      }
    }, b._appendQueueProps = function(b) {
      var c, d, e, f, g;
      for (var h in b)
        if (void 0 === this._initQueueProps[h]) {
          if (d = this._target[h], c = a._plugins[h])
            for (e = 0, f = c.length; f > e; e++) d = c[e].init(this, h, d);
          this._initQueueProps[h] = this._curQueueProps[h] = void 0 === d ? null : d
        } else d = this._curQueueProps[h];
      for (var h in b) {
        if (d = this._curQueueProps[h], c = a._plugins[h])
          for (g = g || {}, e = 0, f = c.length; f > e; e++) c[e].step && c[e].step(this, h, d, b[h], g);
        this._curQueueProps[h] = b[h]
      }
      return g && this._appendQueueProps(g), this._curQueueProps
    }, b._cloneProps = function(a) {
      var b = {};
      for (var c in a) b[c] = a[c];
      return b
    }, b._addStep = function(a) {
      return a.d > 0 && (this._steps.push(a), a.t = this.duration, this.duration += a.d), this
    }, b._addAction = function(a) {
      return a.t = this.duration, this._actions.push(a), this
    }, b._set = function(a, b) {
      for (var c in a) b[c] = a[c]
    }, createjs.Tween = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a(a, b, c) {
      this.EventDispatcher_constructor(), this.ignoreGlobalPause = !1, this.duration = 0, this.loop = !1, this.position = null, this._paused = !1, this._tweens = [], this._labels = null, this._labelList = null, this._prevPosition = 0, this._prevPos = -1, this._useTicks = !1, this._registered = !1, c && (this._useTicks = c.useTicks, this.loop = c.loop, this.ignoreGlobalPause = c.ignoreGlobalPause, c.onChange && this.addEventListener("change", c.onChange)), a && this.addTween.apply(this, a), this.setLabels(b), c && c.paused ? this._paused = !0 : createjs.Tween._register(this, !0), c && null != c.position && this.setPosition(c.position, createjs.Tween.NONE)
    }
    var b = createjs.extend(a, createjs.EventDispatcher);
    b.addTween = function(a) {
      var b = arguments.length;
      if (b > 1) {
        for (var c = 0; b > c; c++) this.addTween(arguments[c]);
        return arguments[0]
      }
      return 0 == b ? null : (this.removeTween(a), this._tweens.push(a), a.setPaused(!0), a._paused = !1, a._useTicks = this._useTicks, a.duration > this.duration && (this.duration = a.duration), this._prevPos >= 0 && a.setPosition(this._prevPos, createjs.Tween.NONE), a)
    }, b.removeTween = function(a) {
      var b = arguments.length;
      if (b > 1) {
        for (var c = !0, d = 0; b > d; d++) c = c && this.removeTween(arguments[d]);
        return c
      }
      if (0 == b) return !1;
      for (var e = this._tweens, d = e.length; d--;)
        if (e[d] == a) return e.splice(d, 1), a.duration >= this.duration && this.updateDuration(), !0;
      return !1
    }, b.addLabel = function(a, b) {
      this._labels[a] = b;
      var c = this._labelList;
      if (c) {
        for (var d = 0, e = c.length; e > d && !(b < c[d].position); d++);
        c.splice(d, 0, {
          label: a,
          position: b
        })
      }
    }, b.setLabels = function(a) {
      this._labels = a ? a : {}
    }, b.getLabels = function() {
      var a = this._labelList;
      if (!a) {
        a = this._labelList = [];
        var b = this._labels;
        for (var c in b) a.push({
          label: c,
          position: b[c]
        });
        a.sort(function(a, b) {
          return a.position - b.position
        })
      }
      return a
    }, b.getCurrentLabel = function() {
      var a = this.getLabels(),
        b = this.position,
        c = a.length;
      if (c) {
        for (var d = 0; c > d && !(b < a[d].position); d++);
        return 0 == d ? null : a[d - 1].label
      }
      return null
    }, b.gotoAndPlay = function(a) {
      this.setPaused(!1), this._goto(a)
    }, b.gotoAndStop = function(a) {
      this.setPaused(!0), this._goto(a)
    }, b.setPosition = function(a, b) {
      var c = this._calcPosition(a),
        d = !this.loop && a >= this.duration;
      if (c == this._prevPos) return d;
      this._prevPosition = a, this.position = this._prevPos = c;
      for (var e = 0, f = this._tweens.length; f > e; e++)
        if (this._tweens[e].setPosition(c, b), c != this._prevPos) return !1;
      return d && this.setPaused(!0), this.dispatchEvent("change"), d
    }, b.setPaused = function(a) {
      this._paused = !!a, createjs.Tween._register(this, !a)
    }, b.updateDuration = function() {
      this.duration = 0;
      for (var a = 0, b = this._tweens.length; b > a; a++) {
        var c = this._tweens[a];
        c.duration > this.duration && (this.duration = c.duration)
      }
    }, b.tick = function(a) {
      this.setPosition(this._prevPosition + a)
    }, b.resolve = function(a) {
      var b = Number(a);
      return isNaN(b) && (b = this._labels[a]), b
    }, b.toString = function() {
      return "[Timeline]"
    }, b.clone = function() {
      throw "Timeline can not be cloned."
    }, b._goto = function(a) {
      var b = this.resolve(a);
      null != b && this.setPosition(b)
    }, b._calcPosition = function(a) {
      return 0 > a ? 0 : a < this.duration ? a : this.loop ? a % this.duration : this.duration
    }, createjs.Timeline = createjs.promote(a, "EventDispatcher")
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "Ease cannot be instantiated."
    }
    a.linear = function(a) {
      return a
    }, a.none = a.linear, a.get = function(a) {
      return -1 > a && (a = -1), a > 1 && (a = 1),
        function(b) {
          return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a))
        }
    }, a.getPowIn = function(a) {
      return function(b) {
        return Math.pow(b, a)
      }
    }, a.getPowOut = function(a) {
      return function(b) {
        return 1 - Math.pow(1 - b, a)
      }
    }, a.getPowInOut = function(a) {
      return function(b) {
        return (b *= 2) < 1 ? .5 * Math.pow(b, a) : 1 - .5 * Math.abs(Math.pow(2 - b, a))
      }
    }, a.quadIn = a.getPowIn(2), a.quadOut = a.getPowOut(2), a.quadInOut = a.getPowInOut(2), a.cubicIn = a.getPowIn(3), a.cubicOut = a.getPowOut(3), a.cubicInOut = a.getPowInOut(3), a.quartIn = a.getPowIn(4), a.quartOut = a.getPowOut(4), a.quartInOut = a.getPowInOut(4), a.quintIn = a.getPowIn(5), a.quintOut = a.getPowOut(5), a.quintInOut = a.getPowInOut(5), a.sineIn = function(a) {
      return 1 - Math.cos(a * Math.PI / 2)
    }, a.sineOut = function(a) {
      return Math.sin(a * Math.PI / 2)
    }, a.sineInOut = function(a) {
      return -.5 * (Math.cos(Math.PI * a) - 1)
    }, a.getBackIn = function(a) {
      return function(b) {
        return b * b * ((a + 1) * b - a)
      }
    }, a.backIn = a.getBackIn(1.7), a.getBackOut = function(a) {
      return function(b) {
        return --b * b * ((a + 1) * b + a) + 1
      }
    }, a.backOut = a.getBackOut(1.7), a.getBackInOut = function(a) {
      return a *= 1.525,
        function(b) {
          return (b *= 2) < 1 ? .5 * (b * b * ((a + 1) * b - a)) : .5 * ((b -= 2) * b * ((a + 1) * b + a) + 2)
        }
    }, a.backInOut = a.getBackInOut(1.7), a.circIn = function(a) {
      return -(Math.sqrt(1 - a * a) - 1)
    }, a.circOut = function(a) {
      return Math.sqrt(1 - --a * a)
    }, a.circInOut = function(a) {
      return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    }, a.bounceIn = function(b) {
      return 1 - a.bounceOut(1 - b)
    }, a.bounceOut = function(a) {
      return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
    }, a.bounceInOut = function(b) {
      return .5 > b ? .5 * a.bounceIn(2 * b) : .5 * a.bounceOut(2 * b - 1) + .5
    }, a.getElasticIn = function(a, b) {
      var c = 2 * Math.PI;
      return function(d) {
        if (0 == d || 1 == d) return d;
        var e = b / c * Math.asin(1 / a);
        return -(a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * c / b))
      }
    }, a.elasticIn = a.getElasticIn(1, .3), a.getElasticOut = function(a, b) {
      var c = 2 * Math.PI;
      return function(d) {
        if (0 == d || 1 == d) return d;
        var e = b / c * Math.asin(1 / a);
        return a * Math.pow(2, -10 * d) * Math.sin((d - e) * c / b) + 1
      }
    }, a.elasticOut = a.getElasticOut(1, .3), a.getElasticInOut = function(a, b) {
      var c = 2 * Math.PI;
      return function(d) {
        var e = b / c * Math.asin(1 / a);
        return (d *= 2) < 1 ? -.5 * (a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * c / b)) : a * Math.pow(2, -10 * (d -= 1)) * Math.sin((d - e) * c / b) * .5 + 1
      }
    }, a.elasticInOut = a.getElasticInOut(1, .3 * 1.5), createjs.Ease = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";

    function a() {
      throw "MotionGuidePlugin cannot be instantiated."
    }
    a.priority = 0, a._rotOffS, a._rotOffE, a._rotNormS, a._rotNormE, a.install = function() {
      return createjs.Tween.installPlugin(a, ["guide", "x", "y", "rotation"]), createjs.Tween.IGNORE
    }, a.init = function(a, b, c) {
      var d = a.target;
      return d.hasOwnProperty("x") || (d.x = 0), d.hasOwnProperty("y") || (d.y = 0), d.hasOwnProperty("rotation") || (d.rotation = 0), "rotation" == b && (a.__needsRot = !0), "guide" == b ? null : c
    }, a.step = function(b, c, d, e, f) {
      if ("rotation" == c && (b.__rotGlobalS = d, b.__rotGlobalE = e, a.testRotData(b, f)), "guide" != c) return e;
      var g, h = e;
      h.hasOwnProperty("path") || (h.path = []);
      var i = h.path;
      if (h.hasOwnProperty("end") || (h.end = 1), h.hasOwnProperty("start") || (h.start = d && d.hasOwnProperty("end") && d.path === i ? d.end : 0), h.hasOwnProperty("_segments") && h._length) return e;
      var j = i.length,
        k = 10;
      if (!(j >= 6 && (j - 2) % 4 == 0)) throw "invalid 'path' data, please see documentation for valid paths";
      h._segments = [], h._length = 0;
      for (var l = 2; j > l; l += 4) {
        for (var m, n, o = i[l - 2], p = i[l - 1], q = i[l + 0], r = i[l + 1], s = i[l + 2], t = i[l + 3], u = o, v = p, w = 0, x = [], y = 1; k >= y; y++) {
          var z = y / k,
            A = 1 - z;
          m = A * A * o + 2 * A * z * q + z * z * s, n = A * A * p + 2 * A * z * r + z * z * t, w += x[x.push(Math.sqrt((g = m - u) * g + (g = n - v) * g)) - 1], u = m, v = n
        }
        h._segments.push(w), h._segments.push(x), h._length += w
      }
      g = h.orient, h.orient = !0;
      var B = {};
      return a.calc(h, h.start, B), b.__rotPathS = Number(B.rotation.toFixed(5)), a.calc(h, h.end, B), b.__rotPathE = Number(B.rotation.toFixed(5)), h.orient = !1, a.calc(h, h.end, f), h.orient = g, h.orient ? (b.__guideData = h, a.testRotData(b, f), e) : e
    }, a.testRotData = function(a, b) {
      if (void 0 === a.__rotGlobalS || void 0 === a.__rotGlobalE) {
        if (a.__needsRot) return;
        void 0 !== a._curQueueProps.rotation ? a.__rotGlobalS = a.__rotGlobalE = a._curQueueProps.rotation : a.__rotGlobalS = a.__rotGlobalE = b.rotation = a.target.rotation || 0
      }
      if (void 0 !== a.__guideData) {
        var c = a.__guideData,
          d = a.__rotGlobalE - a.__rotGlobalS,
          e = a.__rotPathE - a.__rotPathS,
          f = d - e;
        if ("auto" == c.orient) f > 180 ? f -= 360 : -180 > f && (f += 360);
        else if ("cw" == c.orient) {
          for (; 0 > f;) f += 360;
          0 == f && d > 0 && 180 != d && (f += 360)
        } else if ("ccw" == c.orient) {
          for (f = d - (e > 180 ? 360 - e : e); f > 0;) f -= 360;
          0 == f && 0 > d && -180 != d && (f -= 360)
        }
        c.rotDelta = f, c.rotOffS = a.__rotGlobalS - a.__rotPathS, a.__rotGlobalS = a.__rotGlobalE = a.__guideData = a.__needsRot = void 0
      }
    }, a.tween = function(b, c, d, e, f, g, h, i) {
      var j = f.guide;
      if (void 0 == j || j === e.guide) return d;
      if (j.lastRatio != g) {
        var k = (j.end - j.start) * (h ? j.end : g) + j.start;
        switch (a.calc(j, k, b.target), j.orient) {
          case "cw":
          case "ccw":
          case "auto":
            b.target.rotation += j.rotOffS + j.rotDelta * g;
            break;
          case "fixed":
          default:
            b.target.rotation += j.rotOffS
        }
        j.lastRatio = g
      }
      return "rotation" != c || j.orient && "false" != j.orient ? b.target[c] : d
    }, a.calc = function(a, b, c) {
      if (void 0 == a._segments) throw "Missing critical pre-calculated information, please file a bug";
      void 0 == c && (c = {
        x: 0,
        y: 0,
        rotation: 0
      });
      for (var d = a._segments, e = a.path, f = a._length * b, g = d.length - 2, h = 0; f > d[h] && g > h;) f -= d[h], h += 2;
      var i = d[h + 1],
        j = 0;
      for (g = i.length - 1; f > i[j] && g > j;) f -= i[j], j++;
      var k = j / ++g + f / (g * i[j]);
      h = 2 * h + 2;
      var l = 1 - k;
      return c.x = l * l * e[h - 2] + 2 * l * k * e[h + 0] + k * k * e[h + 2], c.y = l * l * e[h - 1] + 2 * l * k * e[h + 1] + k * k * e[h + 3], a.orient && (c.rotation = 57.2957795 * Math.atan2((e[h + 1] - e[h - 1]) * l + (e[h + 3] - e[h + 1]) * k, (e[h + 0] - e[h - 2]) * l + (e[h + 2] - e[h + 0]) * k)), c
    }, createjs.MotionGuidePlugin = a
  }(), this.createjs = this.createjs || {},
  function() {
    "use strict";
    var a = createjs.TweenJS = createjs.TweenJS || {};
    a.version = "0.6.2", a.buildDate = "Thu, 26 Nov 2015 20:44:31 GMT"
  }();

/////////////////////////////////////////////////////
// Set position of Install banner
var installBannerPosition = "topRight"; // topLeft or bottomMid


// Set options

var bgTypeOpt = "varA"; //varA varB  varC
var cowUnlock = "varC"; //varA varB  varC
// Platform
var platformType = "ironsource"
// google   facebook  unity  appreciate  vungle adcolony tapjoy

var url = "https://itunes.apple.com/us/app/milk-factory/id1441292916?mt=8";
var android = "https://itunes.apple.com/us/app/ant-factory/id1436008834?mt=8";

// Store badges for the FINAL Window
var store = "appstore"; //	 googlePlay   appstore

var userAgent = navigator.userAgent || navigator.vendor;

if (/android/i.test(userAgent)) {
  store = "googlePlay";
  url = android;
}



//////////////////////////////
//var userLang = navigator.language || navigator.userLanguage;
////////////////////////////
// ru - Russian
// en - English
// de - German
// jp - Japanese
// kr - Korean
// ch - Chineese
// pt - Portuguese
// es - Spanish
// ar - Arabic
////////////////////////////
// Select language by yourself. Uncomment next line
userLang = "en"


/*
en: "",
de: "",
pt: "",
es: "",
jp: "",
ch: "",
kr: "",
ar: "",
ru: ""
*/


var LocalizedStrings = {
  tutorTxt: {
    en: "TAP TO PLAY!",
    de: "TIPPEN, UM ZU SPIELEN!",
    pt: "TOQUE PARA JOGAR!",
    es: "¡TOCA PARA JUGAR!",
    jp: "タップして再生する！",
    ch: "点击播放!",
    kr: "재생하려면 탭하세요!",
    ar: "",
    ru: "КОСНИТЕСЬ, ЧТОБЫ НАЧАТЬ!"
  },
  installBtn: {
    en: "INSTALL",
    de: "INSTALLIEREN",
    pt: "Instalar",
    es: "Instalar",
    jp: "インストール",
    ch: "安装",
    kr: "설치",
    ar: "",
    ru: "УСТАНОВИТЕ"
  },
  uiTxt: {
    levelTxt: {
      en: "Level",
      de: "Ebene",
      pt: "Nível",
      es: "Nivel",
      jp: "レベル",
      ch: "级",
      kr: "레벨",
      ar: "",
      ru: "Уровень"
    },
    toUnlok: {
      en: "to Unlock",
      de: "Aufschließen",
      pt: "Desbloquear",
      es: "Desbloquear",
      jp: "ロックを解除する",
      ch: "开锁",
      kr: "잠금 해제",
      ar: "",
      ru: "Разблокировать"
    },
    upgradeTxt: {
      en: "Upgrade",
      de: "Höherstufen",
      pt: "Upgrade",
      es: "Actualizar",
      jp: "",
      ch: "升级",
      kr: "",
      ar: "",
      ru: "Обновить"
    },
    unlockTxt: {
      en: "Unlock",
      de: "Freischalten",
      pt: "Desbloquear",
      es: "Desbloquear",
      jp: "アンロック",
      ch: "解锁",
      kr: "터놓다",
      ar: "",
      ru: "Разблокировать"
    },
    popUpTxt: {
      levelTxt: {
        en: "Level 1",
        de: "Ebene 1",
        pt: "Nível 1",
        es: "Nivel 1",
        jp: "レベル1",
        ch: "级 1",
        kr: "레벨 1",
        ar: "",
        ru: "Уровень 1"
      },
      stageTxt: {
        en: "Cow Stage",
        de: "Kuh Stadium",
        pt: "Vaca Fase",
        es: "Vaca Escenario",
        jp: "牛ステージ",
        ch: "牛 阶段",
        kr: "암소 단계",
        ar: "",
        ru: "Корова Этап"
      },
      speedTxt: {
        en: "Cow Speed",
        de: "Kuh Geschwindigkeit",
        pt: "Vaca Velocidade",
        es: "Vaca Velocidad",
        jp: "牛スピード",
        ch: "牛 速度",
        kr: "암소 속도",
        ar: "",
        ru: "Корова Скорость"
      },
      milkingMachineTxt: {
        en: "Milking Machines",
        de: "Melkmaschinen",
        pt: "Máquinas de ordenha",
        es: "Maquinas de ordeño",
        jp: "搾乳機",
        ch: "挤奶机",
        kr: "젖 짜는 기계",
        ar: "",
        ru: "Доильные машины"

      },
      levelUpTxt: {
        en: "Level Up",
        de: "Aufsteigen",
        pt: "Subir de nível",
        es: "Subir de nivel",
        jp: "",
        ch: "升级",
        kr: "",
        ar: "",
        ru: "Новый уровень"
      },
    },
    FinalTxt: {
      congratTxt: {
        en: "Congratulations!",
        de: "Gratulation!",
        pt: "Parabéns!",
        es: "¡Felicidades!",
        jp: "おめでとう",
        ch: "恭喜！",
        kr: "축하해.",
        ar: "",
        ru: "Поздравляем!"
      },
      discoverTxt: {
        en: "Unlock\nmore cows!",
        de: "Schalte mehr\nKühe frei!",
        pt: "Desbloqueie\nmais vacas",
        es: "Desbloquear\nmás vacas",
        jp: "より多くの牛の\nロックを解除",
        ch: "解锁更多的奶牛",
        kr: "더 많은 암소를\n자물쇠로여십시오.",
        ar: "",
        ru: "Разблокировать\nбольше коров"

      },
      btnTxt: {
        en: "Continue",
        de: "Fortsetzen",
        pt: "Continuar",
        es: "Continuar",
        jp: "持続する",
        ch: "继续",
        kr: "잇다",
        ar: "",
        ru: "Продолжить"
      }
    }
  }
};


function InitGameCanvas(lib, img, cjs, ss) {
  var p; // shortcut to reference prototypes

  // library properties:
  lib.properties = {
    width: 480,
    height: 480,
    fps: 60,
    color: "#999999",
    opacity: 1.00,
    manifest: [
      ////{src:"images/GameEngine_atlas_.png?1545570040170", id:"GameEngine_atlas_"}
    ]
  };



  lib.ssMetadata = [{
    name: "GameEngine_atlas_",
    frames: [
      [0, 0, 36, 85],
      [0, 87, 30, 30]
    ]
  }];


  // symbols:



  (lib.cow_backLeg = function() {
    this.spriteSheet = ss["GameEngine_atlas_"];
    this.gotoAndStop(0);
  }).prototype = p = new cjs.Sprite();



  (lib.tile = function() {
    this.spriteSheet = ss["GameEngine_atlas_"];
    this.gotoAndStop(1);
  }).prototype = p = new cjs.Sprite();



  (lib.topMenuBg1 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      varA: 0,
      varB: 1,
      varC: 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-240, 0, 480, 32);


  (lib.tapTextC = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tile.jpg
    this.instance = new lib.tile();
    this.instance.parent = this;
    this.instance.setTransform(-160, 0, 10.667, 1);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-160, 0, 320, 30);


  (lib.Shop = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(-150, 0, 150, 161, 4);

      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 11
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AiAhxQgNAAgIAJQgJAIAAANIAACnQAAANAJAIQAIAJANAAIEBAAQANAAAJgJQAIgIAAgNIAAinQAAgNgIgIQgJgJgNAAg");
    this.shape.setTransform(-55.3, 121.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#253453").s().p("AiAByQgNAAgIgJQgJgIAAgNIAAinQAAgNAJgIQAIgJANAAIEBAAQANAAAJAJQAIAIAAANIAACnQAAANgIAIQgJAJgNAAg");
    this.shape_1.setTransform(-55.3, 121.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 8
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AFVMkICnAAIAA5HIrzAAQg5AAgqApQgpApAAA6IAAImIAAAAQgyAEgjAlQgjAmAAAxIAABQQAAAZASARQASASAYAAQAZAAASgSQARgRAAgYQABAYARARQASASAYAAQAZAAASgSQARgRAAgYQABAYARARQASASAYAAQAZAAASgSQARgRAAgYQABAYARARQASASAYAAQAZAAARgSQARgRABgYQAAAYARARQAQASAZAAQAZAAARgSQARgRABgYQAAAYARARQASASAZAAQAZAAARgSQARgRABgYQAAAYARARQASASAZAAQAZAAARgSQASgRAAgZIAAjQIh4AAIh4AAIh2AAIAADRAiThxIh4AAIAADRABbhxIAADRAiThxIAADRAgbhxIh4AAAFVMkIAAuVIgKAAADThxIAADRAmDhxIAADRIAALEICCAAIGiAAIAAnpQAAgdgVgVQgUgUgdAAIkWAAQgdAAgUAUQgVAVAAAdIAAHpAChMkIC0AAAkLhxIh4AA");
    this.shape_2.setTransform(-50.4, 80.5);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#D6D6D6").s().p("AjQEXIAAnnQAAgdAUgVQAVgUAdAAIEVAAQAdAAAVAUQAUAVAAAdIAAHngAiVjbQgJAIAAANIAACpQAAANAJAIQAIAIANAAIEBAAQANAAAJgIQAIgIAAgNIAAipQAAgNgIgIQgJgJgNAAIkBAAQgNAAgIAJg");
    this.shape_3.setTransform(-55.3, 133);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AC4HLIAAnnQAAgdgUgVQgVgUgdAAIkVAAQgdAAgVAUQgUAVAAAdIAAHnIiCAAIAArCQAAAYARARQASASAZAAQAZAAARgSQARgRABgYQAAAYARARQASASAZAAQAZAAARgSQARgRABgYQAAAYARARQASASAYAAQAZAAASgSQARgRAAgYQABAYAPARQASASAYAAQAZAAASgSQARgRAAgYQABAYARARQASASAYAAQAZAAASgSQARgRAAgYQABAYARARQASASAYAAQAZAAASgSQARgRAAgZIAAjSIAKAAIAAOVg");
    this.shape_4.setTransform(-52.8, 115);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#47546E").s().p("AE9B1QgRgRgBgZIAAjQIAADQQAAAZgRARQgSASgZAAQgYAAgSgSQgRgRgBgZIAAjQIAADQQAAAZgRARQgSASgZAAQgYAAgSgSQgRgRgBgZQAAAZgRARQgSASgYAAQgXAAgSgSQgRgRAAgZIAAjQIAADQQgBAZgRARQgRASgZAAQgZAAgSgSQgRgRAAgZIAAjQIAADQQgBAZgRARQgRASgZAAQgZAAgSgSQgRgRAAgYIAAjRIAADRQgBAYgRARQgRASgZAAQgZAAgSgSQgRgRAAgZIAAhPQAAgyAjgmQAiglAzgEIAAAAIB4AAIB4AAIB1AAIAADQIAAjQIB4AAIB4AAIB4AAIAADQQAAAZgRARQgSASgZAAQgYAAgSgSg");
    this.shape_5.setTransform(-59.3, 82.5);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#F4A851").s().p("AEZMkIAAuVIgKAAIh4AAIh4AAIh2AAIh4AAIh4AAIh4AAIAAomQAAg6ApgpQAqgpA5AAILzAAIAAZHg");
    this.shape_6.setTransform(-44.4, 80.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }]
    }).wait(1));

    // Layer 9
    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ADGifQgBgQgLgKQgLgMgRAAIgIAAQgBAAgCAAIiBAAQABACAAAEQAAACAAACQAAAUgOAPQgNAPgVAAQgUAAgPgPQgOgOAAgUQAAgBAAAAIABgKIhvAAQgEAAgEADQgCAEAAAEQAAADADACQAAABABAAICPB4QAMgRAUAAQARAAAKAMQALALAAARQAAAQgLAMIBRBDQAFgEAEgEQApgnAZgvQAcg3AGg+IAAgEQAAgBAAgBgABtidQANAAAJAJQAIAIAAANQAAAMgIAJQgJAJgNAAQgMAAgJgJQgJgJAAgMQAAgNAJgIQAJgJAMAAgABjC6QAugrAag6QAcg/AAhEIAAhoQAAgFgBgEAATi/IhhAFAjDi1IgDAAIAABxQAAANAKAJICMB4QAEgFAFgDIAAAFAgnBCQAJgFALAAQAGAAAIACIAFADIAAAzIAAAOAgnhDIAACFAAAgKIAABMABjC6IAAAFAAAB1IBZBOQAFgFAFgEABiAyIABCI");
    this.shape_7.setTransform(-130, 33);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#F4A851").s().p("AAAB0IAAg0IgFgCQgIgDgGAAQgLAAgJAGIAAiFIAACFQgFADgEAFIiMh4QgKgJAAgNIAAhxIADAAIABABICPB4QAMgRAUAAQARgBAKAMQALAMAAAQQAAARgLAMIBRBCIAJgIIABCIIgKAJgAAABAIAAhLgABjC4gABiAwQApgmAZgwQAcg2AGg+IAAgEIAAgCIABAJIAABnQAABFgcA/QgaA5guArgAgnBBgABYhrQgJgJAAgNQAAgMAJgJQAJgJAMABQANgBAJAJQAIAJAAAMQAAANgIAJQgJAIgNABQgMgBgJgIgAhAiZQgOgPAAgTIBhgGIAAAFQAAAUgOAPQgNAOgVAAQgUAAgPgOg");
    this.shape_8.setTransform(-130, 33.1);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFD362").s().p("AAIA8QAMgNAAgQQAAgRgMgLQgJgKgRAAQgVAAgMAPIiPh2IgBAAQgCgDAAgDQgBgEADgEQADgDAEAAIBvAAIgBAKIAAABQABAUAOAOQAPAPAUAAQAVAAAMgPQAPgPAAgUIAAgEIgBgGICBAAIADAAIAHAAQARAAAMAMQALALABAPIAAADIAAADQgGA+gcA1QgaAxgoAnIgJAIgABZhOQgJAJAAAMQAAAMAJAJQAIAJANAAQAMAAAJgJQAJgJAAgMQAAgMgJgJQgJgJgMAAQgNAAgIAJg");
    this.shape_9.setTransform(-130.1, 26);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }]
    }).wait(1));

    // Layer 10
    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AC+gmIAABOIl7AAIAAhOg");
    this.shape_10.setTransform(-98.7, 29.3);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("Ai9AnIAAhOIF6AAIAABOg");
    this.shape_11.setTransform(-98.7, 29.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_11
      }, {
        t: this.shape_10
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-151, -1, 152.4, 163);


  (lib.separatorCrane_anim = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      dispense: 1,
      loop: 14,
      stop: 30
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_29 = function() {
      this.gotoAndPlay("loop")
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(29).call(this.frame_29).wait(2));

    // Layer 4
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("AgOAdIAAg5IAdAAIAAA5g");
    this.shape.setTransform(0, 2.9);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AgOBGIAAiLIAdAAIAACLg");
    this.shape_1.setTransform(0, 7);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AgOBuIAAjbIAdAAIAADbg");
    this.shape_2.setTransform(0, 11.1);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("AgOCXIAAktIAdAAIAAEtg");
    this.shape_3.setTransform(0, 15.1);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AgODAIAAl/IAdAAIAAF/g");
    this.shape_4.setTransform(0, 19.2);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("AgODoIAAnPIAdAAIAAHPg");
    this.shape_5.setTransform(0, 23.3);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AgOERIAAohIAdAAIAAIhg");
    this.shape_6.setTransform(0, 27.4);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("AgOE6IAApzIAdAAIAAJzg");
    this.shape_7.setTransform(0, 31.4);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AgOFiIAArDIAdAAIAALDg");
    this.shape_8.setTransform(0, 35.5);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("AgQFiIAArDIAhAAIAALDg");
    this.shape_9.setTransform(0, 35.5);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("AgRFiIAArDIAjAAIAALDg");
    this.shape_10.setTransform(0, 35.5);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("AgTFiIAArDIAnAAIAALDg");
    this.shape_11.setTransform(0, 35.5);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFFFFF").s().p("AgVFiIAArDIArAAIAALDg");
    this.shape_12.setTransform(0, 35.5);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("AgUFiIAArDIApAAIAALDg");
    this.shape_13.setTransform(0, 35.5);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FFFFFF").s().p("AgSFiIAArDIAlAAIAALDg");
    this.shape_14.setTransform(0, 35.5);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FFFFFF").s().p("AgRFiIAArDIAiAAIAALDg");
    this.shape_15.setTransform(0, 35.5);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("AgPFiIAArDIAfAAIAALDg");
    this.shape_16.setTransform(0, 35.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: []
    }).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: []
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-19.5, -26, 39, 52);


  (lib.separator_body = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAFAKIgJAAIAAgUIAJAAg");
    this.shape.setTransform(-32.6, 11.7);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF5A72").s().p("AgEAKIAAgTIAJAAIAAATg");
    this.shape_1.setTransform(-32.6, 11.7);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAmAWIhLAAQgJAAgGgHQgHgGAAgJQAAgIAHgGQAGgHAJAAIBLAAQAJAAAHAHQAGAGAAAIQAAAJgGAGQgHAHgJAAg");
    this.shape_2.setTransform(-32.5, 7.9);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FF5A72").s().p("AglAWQgJAAgHgHQgGgGAAgJQAAgIAGgGQAHgHAJAAIBLAAQAJAAAGAHQAHAGAAAIQAAAJgHAGQgGAHgJAAg");
    this.shape_3.setTransform(-32.5, 7.9);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAWA+IgrAAQgKAAgIgHQgHgIAAgKIAAhJQAAgKAHgHQAIgIAKAAIArAAQAKAAAIAIQAHAHAAAKIAABJQAAAKgHAIQgIAHgKAAg");
    this.shape_4.setTransform(-32.3, 19.3);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#D6D6D6").s().p("AgVA+QgLAAgGgHQgIgIAAgKIAAhJQAAgKAIgHQAGgIALAAIArAAQAKAAAHAIQAIAHAAAKIAABJQAAAKgIAIQgHAHgKAAg");
    this.shape_5.setTransform(-32.3, 19.3);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AgLAzIgoAAQAAgrAfgcQAcgeAsAAIAAAoQgbAAgTAQQgRATAAAag");
    this.shape_6.setTransform(-41.1, 22.6);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#D6D6D6").s().p("AgzAzQABgrAegcQAcgeAsAAIAAAoQgbAAgTAQQgQATgBAag");
    this.shape_7.setTransform(-41.1, 22.6);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABagnIAABFQAAADgDADQgEAEgDAAIifAAQgDAAgEgEQgDgDAAgDIAAhFg");
    this.shape_8.setTransform(3.2, 29.8);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#B0BBBF").s().p("AgYApIAAhRIAxAAIAABRg");
    this.shape_9.setTransform(-2.9, 29.6);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#D6D6D6").s().p("AhVApIAAhRICrAAIAABRg");
    this.shape_10.setTransform(3.2, 29.6);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f().s("#253453").ss(2, 0, 0, 4).p("Ah3hFIDvAAIAACBQAAADgDADQgEAEgDAAIjbAAQgDAAgEgEQgDgDAAgDg");
    this.shape_11.setTransform(3.2, 18.8);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#B0BBBF").s().p("AgeBGIAAiLIA9AAIAACLg");
    this.shape_12.setTransform(-5.7, 18.4);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#D6D6D6").s().p("Ah4BGIAAiLIDxAAIAACLg");
    this.shape_13.setTransform(3.2, 18.4);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("rgba(255,255,255,0.349)").s().p("AidATQgHAAgGgFQgHgGAAgIQAAgGAHgGQAGgHAHAAIFPAAIAAAmg");
    this.shape_14.setTransform(35, 55.8);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABQgdQADAAAEADQADADAAAEIAAAnQAAADgDADQgEAEgDAAIifAAQgDAAgEgEQgDgDAAgDIAAgnQAAgEADgDQAEgDADAAg");
    this.shape_15.setTransform(3.2, 46.8);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#B0BBBF").s().p("AgWAdIAAg5IAsAAIAAA5g");
    this.shape_16.setTransform(-3.1, 46.8);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#D6D6D6").s().p("AhYAdIAAg5ICyAAIAAA5g");
    this.shape_17.setTransform(3.2, 46.8);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AEVAeImUAAQgMAAgJgJQgJgJAAgMIAAiVIh4AAIAACVQAAA+AsAsQAsAsA+AAIGUAAg");
    this.shape_18.setTransform(25, 48.8);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#999999").s().p("Ah/CVQg+ABgsgtQgsgsAAg9IAAiVIB5AAIAACVQAAAMAJAIQAIAKAMAAIGUAAIAAB3g");
    this.shape_19.setTransform(25, 48.8);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AipAeIFRAAQgEgagTgPQgUgSgaAAIjGAAQgbAAgTASQgUAPgEAag");
    this.shape_20.setTransform(2.7, -60.7);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("AioAdQAEgZAUgPQATgRAbgBIDGAAQAaABAUARQATAPAEAZg");
    this.shape_21.setTransform(2.6, -60.7);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FFFFFF").s().p("AgNAUQgGgFABgJIAAgLQgBgJAGgFQAGgGAHAAQAIAAAGAGQAFAGAAAIIAAALQAAAJgFAFQgGAGgIAAQgHAAgGgGg");
    this.shape_22.setTransform(-6.3, -50.1);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFFFFF").s().p("AgUAeQgIgIgBgMIAAgSQABgNAIgJQAJgIALgBQAMABAJAIQAIAJABANIAAASQgBAMgIAIQgJAKgMgBQgLABgJgKg");
    this.shape_23.setTransform(-12.3, -24.7);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AjlgTIHLAAIAAAnInLAAg");
    this.shape_24.setTransform(2.7, -33.7);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("AjlAUIAAgmIHLAAIAAAmg");
    this.shape_25.setTransform(2.7, -33.7);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AjlgTIHLAAIAAAnInLAAg");
    this.shape_26.setTransform(2.7, 1.3);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("AjlAUIAAgnIHLAAIAAAng");
    this.shape_27.setTransform(2.7, 1.3);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ACClYIkDAAIAAAiQAAAmgWAiIgoA8QgSAbAAAiIAAF0QAAAkAbAbQAaAbAlAAIDvAAQAlAAAagbQAbgbAAgkIAAl0QAAghgTgcIgog8QgVghAAgng");
    this.shape_28.setTransform(2.7, -23.2);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.lf(["rgba(255,255,255,0.106)", "rgba(255,255,255,0.431)"], [0, 1], 14.3, -14.1, -15.7, 19.5).s().p("Ah2FZQgmgBgagaQgagaAAglIAAl0QgBgiATgbIAng7QAXgjAAgmIAAgiIEBAAIAAAiQABAnAVAiIAoA7QASAcAAAhIAAF0QAAAlgaAaQgaAagmABg");
    this.shape_29.setTransform(2.7, -23.2);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAoAZIhPAAIAAgnQAAgKAKAAIA7AAQADAAAEADQADADAAAEg");
    this.shape_30.setTransform(2.7, 8.8);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#CCCCCC").s().p("AgmAZIAAgnQAAgJAKgBIA5AAQAFAAACAEQADADAAADIAAAng");
    this.shape_31.setTransform(2.7, 8.8);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AiLAXIgSAAAiLAXIAAgtIgSAAAiFgWIEZAAIAAAtIkfAA");
    this.shape_32.setTransform(-17.2, 19.6);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#D6D6D6").s().p("AiGAXIAAgsIAGAAIEZAAIAAAsgAiGAXIgSAAIAAgsIASAAIAAAsg");
    this.shape_33.setTransform(-17.7, 19.6);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_33
      }, {
        t: this.shape_32
      }, {
        t: this.shape_31
      }, {
        t: this.shape_30
      }, {
        t: this.shape_29
      }, {
        t: this.shape_28
      }, {
        t: this.shape_27
      }, {
        t: this.shape_26
      }, {
        t: this.shape_25
      }, {
        t: this.shape_24
      }, {
        t: this.shape_23
      }, {
        t: this.shape_22
      }, {
        t: this.shape_21
      }, {
        t: this.shape_20
      }, {
        t: this.shape_19
      }, {
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-47.3, -65.3, 118.6, 130.1);


  (lib.redBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(-243, 0, 483, 175, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // grass copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#93CF56").s().p("AY7C0Mgx+AAAIAAjSIBvAAIAAg4QAAgHAGgGQAFgFAIAAQAIAAAFAFQAGAGAAAHIAAA4IGMAAQAAgfAXgWQAYgVAhAAQAfAAAXASQAKgaAXgXQArgrA+AAQA5AAAqAlIAGAGQArArAAA+IB8AAIAAg4QAAgHAGgGQAFgFAIAAQAHAAAGAFQAFAGAAAHIAAA4IAlAAIAAhdQAAgIAGgFQAFgFAIAAQAIAAAFAFQAGAFAAAIIAABdIAYAAIAAg4QAAgHAGgGQAFgFAIAAQAIAAAFAFQAFAGAAAHIAAA4IMWAAIAAgfQAAgIAGgFQAFgGAIABQAIgBAFAGQAGAFAAAIIAAAfIAdAAQAFgPAOgNIAHgFQAVgRAdABQAegBAXATQAIgUARgPQAXgXAfgGQAOgEAPAAQAwAAAjAhIAGAGQAUgOAbAAQAhAAAYAVQAXAWAAAfIAlAAIAAhdQAAgIAGgFQAFgFAIAAQAIAAAFAFQAGAFAAAIIAABdIAlAAIAAg4QAAgHAFgGQAFgFAIAAQAIAAAFAFQAGAGAAAHIAAA4IHdgBIAJAAIAADTg");
    this.shape.setTransform(-80.6, 143.4);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 10 copy
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#6CA038").s().p("AhWA3QAAgkAdgXQAdgZAnAAQAaAAAUAKIACgDQAlggAzAAQAzAAAlAgQAkAfAAAugAqQA3QAAg7grgsIgGgGIAMAAQA0AAAkAgQAkAfAAAugAI+AGQgcAAgWAQQAJgYAWgUQAkggAzAAQAkAAAcAQQgfAGgXAXQgRAOgIATQgXgSgeAAg");
    this.shape_1.setTransform(-78.8, 134.6);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

    // Layer 9 copy
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#6EA339").s().p("AY7AdMgx+AAAIAAg5MAx+AAAIAJAAIAAA5g");
    this.shape_2.setTransform(-80.6, 164.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

    // Layer 11 copy
    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("rgba(0,0,0,0.157)").s().p("AY3AdMgx2AAAIAAg6MAx2AAAIAJAAIAAA6g");
    this.shape_3.setTransform(-80, 170.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

    // trees
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#A82021").s().p("AgOIbQAAhGAwgyQAygxBGgBIAIAAQAPAAAPAEQAbg4AqgtQAsgsA1gcIAAiUQgbgJgRgZQgSgWAAgeIAAiFQAAgnAcgbQAbgcAnAAQAnAAAbAcQAbAbAAAnIAACFQAAAhgUAYQgUAZgfAHIAAB6QAjgNAkgEIAAijQAAgZATgSQASgTAaAAQAaAAASATQASASAAAZIAACjQAWACAXAHIAAkkQgjgKgXgdQgWgeAAgmIAAigQAAguAgghQAhggAugBQAuABAhAgQAhAhAAAuIAACgQAAAYgLAVQgIAWgRAPIAABKQAAATgNANQgOANgSAAIgJAAIAADBQBEg7BTggQBWghBdAAIAbAAQDPAACSCSQCSCSAADPgALCh5IAABEIAKAAQAIAAAEgFQAGgEAAgIIAAg9QgOAIgOACgAkZIbIAAjHQgfgIgUgYQgVgaAAggIAAiPQAAgnAcgbQAbgbAnAAQAnAAAcAbQAaAbAAAnIAACPQAAAggTAaQgVAYgfAIIAADHgA4ZIbQAAhVA7g8QA9g8BVAAIBqAAQAmAAAiAOIAAi8QgcgLgRgXQgSgZAAgeIAAh7QAAgnAcgaQAbgcAnAAQAQAAAPAFIAAhsQAAg1AmgmQAmgmA1AAQA2AAAmAmQAmAmAAA1IAACyQAAApgXAeQgWAggkAPIAABuQBJgdBPAAIBQAAQBjAABYAuIAAirIgSAAQgSAAgNgLQgNgNAAgSIAAiNQgkgqAAg2IAAhzQAAg9AsgrQArgsA9AAQA9AAArAsQAqAqAAA+IAABzQAAA+gsAsIAAA8QAAASgNANQgNANgTAAIgRAAIAAEtQA+A6AjBNQAkBPAABZgAweBHQAAAggTAbQgVAYgfAIIAACSQA0hMBSgwIAAh+QgigCgdgRgAoigvQAAAHAGAFQAFAFAHABIAJAAIAAhrQgPgGgMgHgAmtiFIAAAjIAMAAQAHAAAFgFQAFgEAAgIIAAgeQgOAHgPAFg");
    this.shape_4.setTransform(-84.2, 103.2);

    this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

    // back
    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#BA2121").s().p("A5EM/IAA59MAyJAAAIAAZ9g");
    this.shape_5.setTransform(-79.5, 83.1);

    this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-242.6, 0, 596.3, 173.4);


  (lib.ppUpBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#1C2B4C").ss(4.6, 0, 0, 4).p("Avd2cIe7AAQB8AABYBYQBYBYAAB8MAAAAjhQAAB8hYBYQhYBYh8AAI+7AAQh8AAhYhYQhYhYAAh8MAAAgjhQAAh8BYhYQBYhYB8AAg");
    this.shape.setTransform(129.1, 143.8);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AvdWdQh8AAhYhYQhYhYAAh8MAAAgjhQAAh8BYhYQBYhYB8AAIe7AAQB8AABYBYQBYBYAAB8MAAAAjhQAAB8hYBYQhYBYh8AAg");
    this.shape_1.setTransform(129.1, 143.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-2.2, -2.2, 262.7, 292.1);


  (lib.orangeBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(0, 0, 320, 174, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // grass copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#93CF56").s().p("AYuC0Mgx2AAAIAAjSIB4AAIAAg4QAAgHAGgGQAFgFAHAAQAIAAAGAFQAFAGAAAHIAAA4IGKAAQAAgfAYgWQAXgVAhAAQAeAAAXASQALgaAWgXQAsgrA8AAQA5AAAqAlIAGAGQAsArAAA+IB7AAIAAg4QAAgHAFgGQAFgFAIAAQAHAAAGAFQAGAGgBAHIAAA4IAmAAIAAhdQgBgIAGgFQAGgFAHAAQAIAAAFAFQAGAFAAAIIAABdIAYAAIAAg4QAAgHAGgGQAFgFAHAAQAJAAAFAFQAFAGAAAHIAAA4IMSAAIAAgfQAAgIAFgFQAGgGAHABQAIgBAGAGQAFAFAAAIIAAAfIAdAAQAFgPANgNIAHgFQAWgRAdABQAdgBAXATQAJgUAQgPQAYgXAdgGQAOgEAQAAQAwAAAiAhIAGAGQAUgOAbAAQAhAAAYAVQAXAWAAAfIAlAAIAAhdQgBgIAGgFQAGgFAHAAQAIAAAFAFQAGAFAAAIIAABdIAlAAIAAg4QAAgHAFgGQAGgFAHAAQAHAAAGAFQAFAGABAHIAAA4IHagBIAbAAIAADTg");
    this.shape.setTransform(160, 143.4);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 10 copy
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#6CA038").s().p("AhWA3QAAgkAdgXQAdgZAnAAQAaAAAUAKIADgDQAkggAzAAQA0AAAjAgQAlAfAAAugAqQA3QAAg7grgsIgGgGIAMAAQA0AAAkAgQAlAfAAAugAI+AGQgdAAgVAQQAJgYAWgUQAkggAzAAQAkAAAcAQQgeAGgYAXQgQAOgJATQgWgSgfAAg");
    this.shape_1.setTransform(162.2, 134.7);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

    // Layer 9 copy
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#6EA339").s().p("AYuAdMgx2AAAIAAg5MAx2AAAIAbAAIAAA5g");
    this.shape_2.setTransform(160, 164.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

    // Layer 11 copy
    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("rgba(0,0,0,0.157)").s().p("AYtAdMgxoAAAIAAg6MAxoAAAIAQAAIAAA6g");
    this.shape_3.setTransform(160.3, 170.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

    // trees
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#3E8AD6").s().p("AgOIbQAAhGAwgyQAygxBGgBIAIAAQAPAAAPAEQAbg4AqgtQAsgsA1gcIAAiUQgbgJgRgZQgSgWAAgeIAAiFQAAgnAcgbQAbgcAnAAQAnAAAbAcQAbAbAAAnIAACFQAAAhgUAYQgUAZgfAHIAAB6QAjgNAkgEIAAijQAAgZATgSQASgTAaAAQAaAAASATQASASAAAZIAACjQAWACAXAHIAAkkQgjgKgXgdQgWgeAAgmIAAigQAAguAgghQAhggAugBQAuABAhAgQAhAhAAAuIAACgQAAAYgLAVQgIAWgRAPIAABKQAAATgNANQgOANgSAAIgJAAIAADBQBEg7BTggQBWghBdAAIAbAAQDPAACSCSQCSCSAADPgALCh5IAABEIAKAAQAIAAAEgFQAGgEAAgIIAAg9QgOAIgOACgAkZIbIAAjHQgfgIgUgYQgVgaAAggIAAiPQAAgnAcgbQAbgbAnAAQAnAAAcAbQAaAbAAAnIAACPQAAAggTAaQgVAYgfAIIAADHgA4ZIbQAAhVA7g8QA9g8BVAAIBqAAQAmAAAiAOIAAi8QgcgLgRgXQgSgZAAgeIAAh7QAAgnAcgaQAbgcAnAAQAQAAAPAFIAAhsQAAg1AmgmQAmgmA1AAQA2AAAmAmQAmAmAAA1IAACyQAAApgXAeQgWAggkAPIAABuQBJgdBPAAIBQAAQBjAABYAuIAAirIgSAAQgSAAgNgLQgNgNAAgSIAAiNQgkgqAAg2IAAhzQAAg9AsgrQArgsA9AAQA9AAArAsQAqAqAAA+IAABzQAAA+gsAsIAAA8QAAASgNANQgNANgTAAIgRAAIAAEtQA+A6AjBNQAkBPAABZgAweBHQAAAggTAbQgVAYgfAIIAACSQA0hMBSgwIAAh+QgigCgdgRgAoigvQAAAHAGAFQAFAFAHABIAJAAIAAhrQgPgGgMgHgAmtiFIAAAjIAMAAQAHAAAFgFQAFgEAAgIIAAgeQgOAHgPAFg");
    this.shape_4.setTransform(156.8, 103.2);

    this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

    // back
    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#4D9DEE").s().p("A4/M/IAA59MAx/AAAIAAZ9g");
    this.shape_5.setTransform(160, 83.1);

    this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-242.6, 0, 596.3, 173.4);


  (lib.Locator = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#FF0000").ss(16.9, 1, 1).p("EgAIgjOMAAAAjGMAAAAjXEgjOgAIMAjGAAAMAjXAAA");
    this.shape.setTransform(0.2, 0.3);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-233.8, -233.7, 468.1, 468.1);


  (lib.locator = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("rgba(255,0,0,0)").ss(1, 1, 1).p("Ag/AAIA/AAIAABAAAAAAIBAAAAAAg/IAAA/");
    this.shape.setTransform(0, 0.1, 3.317, 3.317);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-22.3, -22.2, 44.7, 44.7);


  (lib.item_Container_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tile.jpg
    this.instance = new lib.tile();
    this.instance.parent = this;
    this.instance.setTransform(0, 0, 1.928, 1.059);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 57.9, 31.8);


  (lib.hand_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 8
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#000000").s().p("AgGBeIgegIIgBAAIAAgBIgBAAIgLgDIgBgBIgQgGIgdgPIgIgFIgCgBIAAAAIAAAAIgGgEIgcgXIgbgeIgFgHQAAAAAAgBQAAAAAAAAQAAgBAAAAQAAAAAAgBQAAgBAAAAQABgBAAAAQABgBAAAAQABAAAAAAIAJACIABAAIABAAIABABIAHABIABAAIAjAMIACAAIAEAAIABABIACABIAEACIABAAIAGADIACABIAAAAIABABIAKAGIABAAIAAAAIABAAIAMAIIABABIAGAEIABABIAHAFIABABIAKAIIACACIABAAIAAABIAIAIIACACIAAAAIABABIANAOIAFAIIABABIAAAAIAAABIAFAIIAAADQAAAAAAABQAAAAgBABQAAAAAAAAQgBAAAAAAIgCAAgACogEIgUgEIgBAAIAAgBIgBAAIgUgHIgGgDIgEgBIgRgKIAAAAIgcgTIgBgCIgRgRIgBAAIgQgUIAAgCQAAgBAAgBQAAAAABAAQAAgBABAAQABAAAAAAIALAAIAEAAIAFAAIAPADIACAAIAGACIADAAIAGACIACAAIAVAKIAFADIAKAHIAFAEIAMANIABABIAIAKIABACIABABIgBAAIALARIABAAIAAABIAEAJIAAABQAAABAAABQgBAAAAABQAAAAgBAAQgBAAAAAAIgBAAg");
    this.shape.setTransform(29.1, 8.4);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 9
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#000000").s().p("AkMGeIAAAAQgXgGgKgUQgeg1AGg9QAHg6AuglIAAAAQBBg1BTgNQgagwgpgkIAAgBQgvgng0gkQgqgdglghIAAAAQg7g2gdhJIAAABQgSgvAQguQAHgUAMgQIABAAQAcgmAsgNQAOgFAOAGIgCAAQA5AVApAuIAAAAQAlAqAkArQAdgyA9gTQAfgKAiACQAQABASAEQA5giBDABQASABARAGIAAAAQA/AXArA0QAgAmAdApQBNBxgDCFQA9AigQBMIAAAAQgMA4gjAwQg1BJhSAlIgBAAQg0AXg2gRQgggLgTgZIAAAAIgKgPIicACIgGAGIgBABQhCA3hPAcQgVAHgWAAQgPAAgQgEgAjsDgQgbAWgEAjQgFAqAVAkQATAEATgGQBFgZA5gvIAOgOQAIgIALAAIC4gBQAvgMAmgfIBCg2QA4gvAXhEIAAgCIABgCQAFh3hFhjQgbgogegkIAAAAQgigogwgSQgIgDgIAAIAAAAQg4gBgvAeQgKAHgMgDQgRgEgSAAIAAAAQgXgDgWAHIAAAAQg4ASgOA6QgCAMgLAGQgKAGgMgDQgLgDgGgKQgFgCgDgFQgug4gvg1QgdghgogRQgXAJgPAUIAAAAQgHAJgEAMIAAgBQgJAaAKAZQAYA9AxAsIAAAAQAiAfAnAbQA3AmAyAsQA5AyAiBHIAHAQQAEAIgCAKQgCAIgHAHQgHAGgJABIgbAEIgBAAQhKAKg5AugAECE4IAAAAQBEgfAsg9IAAAAQAcglAJgtQAFgXgLgOQgcA+g3AuIhDA3QgiAcgnAPQAGAFAJADIgBAAQAhAKAhgNgADZDGQgIgBgFgHIgLgOIAAgBQgdgpgogdQgHgFgBgIQgCgHAFgHQAFgGAIgCQAIgBAGAFQAuAhAhAuIAKAOQAFAGgBAJQgCAHgGAGQgFADgGAAIgDAAgAERCLQgIgBgEgHIhtiWQgFgGABgJQACgIAGgEQAHgFAHABQAIACAFAGIBtCWQAFAHgBAIQgCAIgGAFQgFADgGAAIgEAAgAE4BZQgHgEgCgIIgEgTQgOg4ghgtQgFgHACgIQABgHAGgFQAHgFAIACQAIABAFAGQAlA1AQA+IAEATQACAIgEAGQgFAHgHACIgFABQgFAAgFgDg");
    this.shape_1.setTransform(32.1, 29.6);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("Aj7FmQgUglAEgpQAEgjAcgWQA5guBKgKIABAAIAbgEQAJgBAHgGQAHgHABgIQACgKgDgIIgIgQQghhHg6gyQgygsg3gmQgmgbgigfIgBAAQgxgsgYg9QgKgZAJgaIAAABQAEgMAHgJIAAAAQAPgUAYgJQAnARAdAhQAwA1AtA4QAEAFAEACQAGAKAMADQALADALgGQAKgGADgMQAOg6A4gSIgBAAQAWgHAXACIABAAQARABARAEQAMADALgHQAvgeA3ABIABAAQAIAAAHADQAxASAiAoIgBAAQAeAkAcAnQBEBkgFB3IgBACIAAACQgWBEg4AvIhDA2QglAfgwAMIi3ABQgLAAgIAIIgPANQg5AwhFAYQgMAFgLAAQgIAAgHgCgACEBFQgIACgEAGQgFAHABAHQABAIAHAFQAoAdAeApIAAABIAKAOQAFAHAIABQAIABAHgFQAGgFABgHQABgJgEgGIgLgOQgggugughQgGgEgGAAIgDAAgACdgvQgHAEgBAIQgBAIAEAHIBtCWQAFAHAIABQAIABAGgEQAHgFABgIQABgIgEgHIhtiWQgFgGgIgCIgDAAQgGAAgFAEgAEBhHQgHAEgBAIQgBAIAFAHQAhAtANA4IAFATQACAIAHAEQAGAEAIgCQAIgCAEgHQAEgHgBgHIgFgTQgPg+gmg1QgFgGgHgCIgDAAQgHAAgFAEgADBE6IAAAAQgJgDgGgFQAogPAigcIBDg3QA3guAcg+QALAOgFAXQgKAtgbAlIgBAAQgrA9hFAeIABAAQgUAJgTAAQgOAAgNgFg");
    this.shape_2.setTransform(32.1, 29.7);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-14.7, -12.2, 93.6, 83.7);


  (lib.Logo = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.setBounds(0, 0, 107, 57);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 5 copy 6
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFCC").s().p("AFjDyIgEghQAKADANAAQAIAAAFgDQAGgEADgLIgwhzIgNAdQgJgEgFAAQgJAAgFAIQgHALAAAeIAAApIgwAAIAAh8IAsAAIAAAVQAHgOAHgEQAGgGALAAQAIAAAJAFIAAgCIAyAAIAaBTIAYhTIAvAAIgyCFQgIAXgJAIQgMALgaAAQgKAAgVgDgABsC2QgXgTAAgfQAAgcAUgSQATgTAgAAQAmAAATAWQAPARAAAaQAAAdgTASQgTASghABQgeAAgTgQgACMBsQgHAIAAAQQAAARAHAIQAHAIAKAAQAKAAAHgIQAGgIAAgRQAAgQgGgIQgHgIgKAAQgKAAgHAIgAALDAQgJgEgCgJQgEgKAAgUIAAgsIgRAAIAAgjIARAAIAAgXIAugZIAAAwIAaAAIAAAjIgaAAIAAAsQAAAIACACQACAFAGAAQAFAAAKgDIADAgQgRAFgQAAQgSgBgIgFgAiIDBQgNgDgKgIQgJgJgGgKQgFgMAAgSQAAgTAGgNQAFgJAJgIQAIgHAJgEQAOgGAVAAQAfAAAQALQAQALAGAVIgtAGQgCgIgFgEQgGgEgJAAQgMAAgHAJQgIAIAAARQAAAQAIAHQAHAJALgBQAKAAAGgEQAGgGADgJIAuAFQgEAOgIAKQgJALgNAGQgOAFgUABQgUAAgNgFgAlIC7QgLgLAAgOQAAgOAIgKQAIgJAXgEIAjgIIARgGQAAgJgEgDQgEgEgJAAQgMAAgFAFQgFACgDAIIgtgFQACgLAFgHQAFgHAJgFQAHgEALgCQAMgCANAAQAVAAANACQANADAJAIQAGAFAEAJQADAKAAAJIAAA3IABAOQABAFAEAHIgtAAIgDgHIgCgHQgJAIgJAEQgNAGgRAAQgWAAgMgLgAkNCNQgPAFgDADQgEAEAAAFQAAAFAEAEQADAEAIAAQAIAAAHgEQAHgEADgGQADgFAAgJIAAgHgAnqDCIAAisICDAAIAAAlIhOAAIAAAfIBDAAIAAAjIhDAAIAABFgADRhIIgZgyIgSASIAAAgIgxAAIAAisIAxAAIAABZIAkgpIA6AAIgsArIAvBRgAAnhIIAAisIAwAAIAACsgAgmhIIAAh8IAuAAIAAB8gAhyhIIAAiDIgiCDIgnAAIghiDIAACDIgsAAIAAisIBGAAIAbBoIAbhoIBFAAIAACsgAgmjUIAAggIAuAAIAAAgg");
    this.shape.setTransform(53.1, 28.1);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 5 copy 5
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f().s("#253453").ss(7.2, 1, 1).p("AD8DCIAwAAIAAgpQAAgeAHgLQAFgIAJAAQAFAAAJAEIANgdIAwBzQgDAKgGAFQgFADgIAAQgNAAgKgDIAEAhQAVADAKAAQAaAAAMgLQAJgIAIgXIAyiFIgvAAIgYBTIgahTIgyAAIAAACQgJgFgIAAQgLAAgGAGQgHAEgHANIAAgUIgsAAgAB1hIIAxAAIAAghIASgRIAZAyIA2AAIgvhRIAsgsIg6AAIgkAqIAAhZIgxAAgAAnhIIAwAAIAAisIgwAAgAgmjUIAuAAIAAggIguAAgAkIhIIAsAAIAAiDIAhCDIAnAAIAiiDIAACDIArAAIAAisIhFAAIgbBoIgbhoIhGAAgAgmhIIAuAAIAAh9IguAAgAgEAvIAAAXIgRAAIAAAjIARAAIAAAsQAAAUAEAKQACAJAJAFQAIAFASAAQAQAAARgEIgDgiQgKAEgFAAQgGAAgCgFQgCgCAAgIIAAgsIAaAAIAAgjIgaAAIAAgvgAhaCgQgGAFgKAAQgLAAgHgHQgIgJAAgPQAAgRAIgIQAHgJAMAAQAJAAAGAEQAFAEACAIIAtgGQgGgVgQgLQgQgLgfAAQgVAAgOAGQgJAEgIAHQgJAIgFAJQgGANAAATQAAASAFAMQAGALAJAIQAKAIANAEQANAEAUAAQAUAAAOgGQANgGAJgLQAIgKAEgOIgugFQgDAJgGAFgABsC2QATAQAeAAQAhAAATgTQATgTAAgcQAAgZgPgSQgTgWgmAAQggAAgTATQgUASAAAdQAAAeAXATgACMBsQAHgIAKAAQAKAAAHAIQAGAIAAAQQAAARgGAIQgHAIgKAAQgKAAgHgIQgHgIAAgQQAAgRAHgIgAnqDCIA1AAIAAhGIBDAAIAAgjIhDAAIAAgeIBOAAIAAgkIiDAAgAkaBjQAFgEAMAAQAJAAAEAEQAEAEAAAJIgRAFIgjAHQgXAFgIAKQgIAJAAAOQAAAPALAKQAMALAWAAQARAAANgGQAJgDAJgKIACAIIADAHIAtAAQgEgHgBgFQgBgFAAgJIAAg3QAAgJgDgKQgEgJgGgGQgJgHgNgDQgNgCgVAAQgNAAgMACQgLACgHAEQgJAFgFAHQgFAHgCALIAtAFQADgHAFgEgAj4CPQAAAJgDAGQgDAFgHAEQgHAEgIAAQgIAAgDgDQgEgEAAgGQAAgFAEgEQADgEAPgDIAVgHg");
    this.shape_1.setTransform(53.1, 28.1);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFEF7D").s().p("AFjDyIgEghQAKADANAAQAIAAAFgDQAGgEADgLIgwhzIgNAdQgJgEgFAAQgJAAgFAIQgHALAAAeIAAApIgwAAIAAh8IAsAAIAAAVQAHgOAHgEQAGgGALAAQAIAAAJAFIAAgCIAyAAIAaBTIAYhTIAvAAIgyCFQgIAXgJAIQgMALgaAAQgKAAgVgDgABsC2QgXgTAAgfQAAgcAUgSQATgTAgAAQAmAAATAWQAPARAAAaQAAAdgTASQgTASghABQgeAAgTgQgACMBsQgHAIAAAQQAAARAHAIQAHAIAKAAQAKAAAHgIQAGgIAAgRQAAgQgGgIQgHgIgKAAQgKAAgHAIgAALDAQgJgEgCgJQgEgKAAgUIAAgsIgRAAIAAgjIARAAIAAgXIAugZIAAAwIAaAAIAAAjIgaAAIAAAsQAAAIACACQACAFAGAAQAFAAAKgDIADAgQgRAFgQAAQgSgBgIgFgAiIDBQgNgDgKgIQgJgJgGgKQgFgMAAgSQAAgTAGgNQAFgJAJgIQAIgHAJgEQAOgGAVAAQAfAAAQALQAQALAGAVIgtAGQgCgIgFgEQgGgEgJAAQgMAAgHAJQgIAIAAARQAAAQAIAHQAHAJALgBQAKAAAGgEQAGgGADgJIAuAFQgEAOgIAKQgJALgNAGQgOAFgUABQgUAAgNgFgAlIC7QgLgLAAgOQAAgOAIgKQAIgJAXgEIAjgIIARgGQAAgJgEgDQgEgEgJAAQgMAAgFAFQgFACgDAIIgtgFQACgLAFgHQAFgHAJgFQAHgEALgCQAMgCANAAQAVAAANACQANADAJAIQAGAFAEAJQADAKAAAJIAAA3IABAOQABAFAEAHIgtAAIgDgHIgCgHQgJAIgJAEQgNAGgRAAQgWAAgMgLgAkNCNQgPAFgDADQgEAEAAAFQAAAFAEAEQADAEAIAAQAIAAAHgEQAHgEADgGQADgFAAgJIAAgHgAnqDCIAAisICDAAIAAAlIhOAAIAAAfIBDAAIAAAjIhDAAIAABFgADRhIIgZgyIgSASIAAAgIgxAAIAAisIAxAAIAABZIAkgpIA6AAIgsArIAvBRgAAnhIIAAisIAwAAIAACsgAgmhIIAAh8IAuAAIAAB8gAhyhIIAAiDIgiCDIgnAAIghiDIAACDIgsAAIAAisIBGAAIAbBoIAbhoIBFAAIAACsgAgmjUIAAggIAuAAIAAAgg");
    this.shape_2.setTransform(53.1, 28.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, -62, 105.9, 126.7);


  (lib.discover_textContainer_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tile.jpg
    this.instance = new lib.tile();
    this.instance.parent = this;
    this.instance.setTransform(0, 0, 7.905, 2.315);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 237.2, 69.5);


  (lib.circle_cursor_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#000000").ss(3, 1, 1).p("ACTAAQAAA9grArQgrArg9AAQg8AAgrgrQgrgrAAg9QAAg8ArgrQArgrA8AAQA9AAArArQArArAAA8g");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AhnBoQgrgsAAg8QAAg8ArgrQArgrA8AAQA8AAAsArQArArAAA8QAAA8grAsQgsArg8AAQg8AAgrgrg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-16.2, -16.2, 32.5, 32.5);


  (lib.btnUpgrade_textContainer_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tile.jpg
    this.instance = new lib.tile();
    this.instance.parent = this;
    this.instance.setTransform(0, 0, 2, 0.601);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 60, 18);


  (lib.btnUnlock_textContainer = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tile.jpg
    this.instance = new lib.tile();
    this.instance.parent = this;
    this.instance.setTransform(0, 0, 2.023, 0.601);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 60.7, 18);


  (lib.btnFinal_textContainer_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tile.jpg
    this.instance = new lib.tile();
    this.instance.parent = this;
    this.instance.setTransform(0, 0, 3.682, 1.094);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 110.5, 32.9);


  (lib.blackRect_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("rgba(0,0,0,0.498)").s().p("EglfAlgMAAAhK/MBK+AAAMAAABK/g");
    this.shape.setTransform(240, 240);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 480, 480);


  (lib.BgMatch = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      Vertical: 0,
      Horizontal: 1
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

    // Layer 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#B79D11").ss(5, 1, 1).p("Ayg38MAlBAAAQBkAAAABkMAAAAsxQAABkhkAAMglBAAAQhkAAAAhkMAAAgsxQAAhkBkAAg");
    this.shape.setTransform(121, 143.8);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#000000").s().p("AygX8QhkAAAAhjMAAAgswQAAhlBkAAMAlBAAAQBkAAAABlMAAAAswQAABjhkAAg");
    this.shape_1.setTransform(121, 143.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(2));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-15.4, -20.7, 282, 333);


  (lib.bg_square_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // real
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#0E0A09").s().p("EglpAlgMAAAhK/MBLTAAAMAAABK/g");

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-241, -240, 482, 480);


  (lib.bg_match3_square_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#00FF00").ss(1, 1, 1).p("EglfglfMBK/AAAMAAABK/MhK/AAAg");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("rgba(66,66,66,0.498)").s().p("EglfAlgMAAAhK/MBK/AAAMAAABK/g");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-241, -241, 482, 482);


  (lib.bg_endCard_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-241.9, -241.9, 484, 484);


  (lib.AreaClick_floor_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#070707").s().p("A34GZIAAsyMAvxAAAIAAMyg");
    this.shape.setTransform(153, 41);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 306, 82.7);


  (lib.af_logo_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      //this.cache(0, -65, 104, 65, 3);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 5 copy 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#FFFFFF").ss(0.1, 1, 1).p("AigiKIATg+IATA+gAhmhIIA3AAIhAisIg6AAIhBCsIA2AAIAJgdIA8AAgAnqDDIA1AAIAAhGIBDAAIAAgjIhDAAIAAgeIBOAAIAAglIiDAAgAkaBkQAFgEAMAAQAJAAAEADQAEAEAAAJIgRAFIgjAIQgXAEgIAKQgIAJAAAOQAAAPALAKQAMALAWAAQARAAANgGQAJgDAJgJIACAHIADAIIAtAAQgEgIgBgFQgBgFAAgJIAAg3QAAgIgDgKQgEgKgGgFQgJgIgNgCQgNgDgVAAQgNAAgMACQgLACgHAEQgJAFgFAHQgFAGgCANIAtAFQADgIAFgDgAhaChQgGAFgKAAQgLAAgHgIQgIgIAAgQQAAgRAIgIQAHgJAMAAQAJAAAGAEQAFAEACAIIAtgGQgGgVgQgLQgQgLgfAAQgVAAgOAGQgJAEgIAHQgJAIgFAJQgGANAAATQAAASAFAMQAGALAJAIQAKAIANAEQANAEAUAAQAUAAAOgGQANgGAJgKQAIgLAEgOIgugFQgDAKgGAFgAj4CPQAAAJgDAGQgDAFgHAEQgHAEgIAAQgIAAgDgDQgEgEAAgGQAAgFAEgDQADgEAPgEIAVgGgACGjcIAAAYIgRAAIAAAjIARAAIAAAsQAAAUAEAKQAEAIAJAFQAIAFASAAQAQAAARgEIgDghQgKADgFAAQgGAAgCgEQgCgDAAgHIAAgsIAaAAIAAgjIgaAAIAAgwgAghhIIAtAAIAAg8QAAgRAGgHQAFgGAJAAQAIAAAEAFQAEAFAAALIAABFIAwAAIAAhPQAAgZgLgMQgLgMgUAAQgPAAgKAGQgKAFgKANIAAgUIgqAAgAgEAvIAAAXIgRAAIAAAjIARAAIAAAsQAAAVAEAJQACAJAJAFQAIAFASAAQAQAAARgEIgDghQgKADgFAAQgGAAgCgEQgCgDAAgIIAAgsIAaAAIAAgjIgaAAIAAgvgABsC2QATAQAeAAQAhAAATgTQATgSAAgdQAAgZgPgSQgTgWgmAAQggAAgTATQgUASAAAdQAAAeAXATgACMBsQAHgIAKAAQAKAAAHAIQAGAIAAAQQAAASgGAHQgHAIgKAAQgKAAgHgIQgHgIAAgQQAAgRAHgIgAD8DDIAwAAIAAgqQAAgeAHgLQAFgHAJAAQAFAAAJADIANgdIAwB0QgDAKgGAEQgFADgIAAQgNAAgKgDIAEAhQAVADAKAAQAaAAAMgLQAJgIAIgXIAyiFIgvAAIgYBTIgahTIgyAAIAAACQgJgFgIAAQgLAAgGAGQgHAEgHAOIAAgVIgsAAg");
    this.shape.setTransform(52.9, -26.2);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF5518").s().p("AFjDyIgEghQAKADANAAQAIAAAFgDQAGgFADgKIgwhzIgNAdQgJgDgFgBQgJABgFAHQgHALAAAeIAAApIgwAAIAAh8IAsAAIAAAUQAHgNAHgFQAGgFALAAQAIAAAJAEIAAgBIAyAAIAaBTIAYhTIAvAAIgyCFQgIAXgJAIQgMALgaAAQgKAAgVgDgABsC2QgXgTAAgfQAAgcAUgSQATgTAgAAQAmAAATAWQAPASAAAZQAAAcgTATQgTASghAAQgeAAgTgPgACMBsQgHAIAAAQQAAARAHAIQAHAIAKAAQAKAAAHgIQAGgHAAgSQAAgQgGgIQgHgIgKAAQgKAAgHAIgAALDBQgJgFgCgJQgEgJAAgVIAAgsIgRAAIAAgjIARAAIAAgXIAugYIAAAvIAaAAIAAAjIgaAAIAAAsQAAAIACACQACAEAGABQAFgBAKgDIADAiQgRADgQAAQgSAAgIgEgAiIDCQgNgEgKgIQgJgJgGgLQgFgLAAgSQAAgUAGgMQAFgKAJgHQAIgHAJgEQAOgGAVAAQAfAAAQALQAQALAGAVIgtAGQgCgIgFgEQgGgEgJAAQgMAAgHAIQgIAJAAARQAAAPAIAJQAHAHALABQAKAAAGgGQAGgEADgKIAuAFQgEAOgIALQgJAKgNAGQgOAFgUAAQgUAAgNgDgAlIC7QgLgLAAgPQAAgOAIgIQAIgKAXgFIAjgHIARgFQAAgKgEgDQgEgDgJgBQgMAAgFAEQgFAEgDAIIgtgGQACgMAFgGQAFgHAJgFQAHgEALgCQAMgCANAAQAVAAANACQANADAJAHQAGAGAEAKQADAKAAAIIAAA3IABAOQABAFAEAHIgtAAIgDgHIgCgIQgJAKgJADQgNAGgRgBQgWAAgMgKgAkNCNQgPAEgDAEQgEAEAAAFQAAAGAEADQADAEAIAAQAIAAAHgEQAHgEADgFQADgGAAgJIAAgIgAnqDCIAAirICDAAIAAAkIhOAAIAAAeIBDAAIAAAjIhDAAIAABGgACXhKQgJgEgEgKQgEgJAAgVIAAgsIgRAAIAAgjIARAAIAAgWIAwgZIAAAvIAaAAIAAAjIgaAAIAAAsQAAAJACACQACAEAGAAQAFAAAKgDIADAhQgRAEgQAAQgSAAgIgFgAAwhIIAAhEQAAgMgEgFQgEgFgIAAQgJAAgFAHQgGAGAAARIAAA8IgtAAIAAh9IAqAAIAAAVQAKgMAKgGQAKgFAPgBQAUAAALAMQALAMAAAZIAABPgAhmhIIgJgdIg8AAIgJAdIg2AAIBBisIA6AAIBACsgAh6iJIgTg/IgTA/IAmAAg");
    this.shape_1.setTransform(52.9, -26.2);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 5 copy 3
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#FFFFFF").ss(3, 1, 1).p("AigiKIATg+IATA+gAhmhIIA3AAIhAisIg6AAIhBCsIA2AAIAJgdIA8AAgAkaBkQAFgEAMAAQAJAAAEADQAEAEAAAJIgRAFIgjAIQgXAEgIAKQgIAJAAAOQAAAPALAKQAMALAWAAQARAAANgGQAJgDAJgJIACAHIADAIIAtAAQgEgIgBgFQgBgFAAgJIAAg3QAAgIgDgKQgEgKgGgFQgJgIgNgCQgNgDgVAAQgNAAgMACQgLACgHAEQgJAFgFAHQgFAGgCANIAtAFQADgIAFgDgAnqDDIA1AAIAAhGIBDAAIAAgjIhDAAIAAgeIBOAAIAAglIiDAAgAhaChQgGAFgKAAQgLAAgHgIQgIgIAAgQQAAgRAIgIQAHgJAMAAQAJAAAGAEQAFAEACAIIAtgGQgGgVgQgLQgQgLgfAAQgVAAgOAGQgJAEgIAHQgJAIgFAJQgGANAAATQAAASAFAMQAGALAJAIQAKAIANAEQANAEAUAAQAUAAAOgGQANgGAJgKQAIgLAEgOIgugFQgDAKgGAFgAj4CPQAAAJgDAGQgDAFgHAEQgHAEgIAAQgIAAgDgDQgEgEAAgGQAAgFAEgDQADgEAPgEIAVgGgACGjcIAAAYIgRAAIAAAjIARAAIAAAsQAAAUAEAKQAEAIAJAFQAIAFASAAQAQAAARgEIgDghQgKADgFAAQgGAAgCgEQgCgDAAgHIAAgsIAaAAIAAgjIgaAAIAAgwgAghhIIAtAAIAAg8QAAgRAGgHQAFgGAJAAQAIAAAEAFQAEAFAAALIAABFIAwAAIAAhPQAAgZgLgMQgLgMgUAAQgPAAgKAGQgKAFgKANIAAgUIgqAAgAgEAvIAAAXIgRAAIAAAjIARAAIAAAsQAAAVAEAJQACAJAJAFQAIAFASAAQAQAAARgEIgDghQgKADgFAAQgGAAgCgEQgCgDAAgIIAAgsIAaAAIAAgjIgaAAIAAgvgABsC2QATAQAeAAQAhAAATgTQATgSAAgdQAAgZgPgSQgTgWgmAAQggAAgTATQgUASAAAdQAAAeAXATgACMBsQAHgIAKAAQAKAAAHAIQAGAIAAAQQAAASgGAHQgHAIgKAAQgKAAgHgIQgHgIAAgQQAAgRAHgIgAD8DDIAwAAIAAgqQAAgeAHgLQAFgHAJAAQAFAAAJADIANgdIAwB0QgDAKgGAEQgFADgIAAQgNAAgKgDIAEAhQAVADAKAAQAaAAAMgLQAJgIAIgXIAyiFIgvAAIgYBTIgahTIgyAAIAAACQgJgFgIAAQgLAAgGAGQgHAEgHAOIAAgVIgsAAg");
    this.shape_2.setTransform(52.9, -26.2);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FF5518").s().p("AFjDyIgEghQAKADANAAQAIAAAFgDQAGgFADgKIgwhzIgNAdQgJgDgFgBQgJABgFAHQgHALAAAeIAAApIgwAAIAAh8IAsAAIAAAUQAHgNAHgFQAGgFALAAQAIAAAJAEIAAgBIAyAAIAaBTIAYhTIAvAAIgyCFQgIAXgJAIQgMALgaAAQgKAAgVgDgABsC2QgXgTAAgfQAAgcAUgSQATgTAgAAQAmAAATAWQAPASAAAZQAAAcgTATQgTASghAAQgeAAgTgPgACMBsQgHAIAAAQQAAARAHAIQAHAIAKAAQAKAAAHgIQAGgHAAgSQAAgQgGgIQgHgIgKAAQgKAAgHAIgAALDBQgJgFgCgJQgEgJAAgVIAAgsIgRAAIAAgjIARAAIAAgXIAugYIAAAvIAaAAIAAAjIgaAAIAAAsQAAAIACACQACAEAGABQAFgBAKgDIADAiQgRADgQAAQgSAAgIgEgAiIDCQgNgEgKgIQgJgJgGgLQgFgLAAgSQAAgUAGgMQAFgKAJgHQAIgHAJgEQAOgGAVAAQAfAAAQALQAQALAGAVIgtAGQgCgIgFgEQgGgEgJAAQgMAAgHAIQgIAJAAARQAAAPAIAJQAHAHALABQAKAAAGgGQAGgEADgKIAuAFQgEAOgIALQgJAKgNAGQgOAFgUAAQgUAAgNgDgAlIC7QgLgLAAgPQAAgOAIgIQAIgKAXgFIAjgHIARgFQAAgKgEgDQgEgDgJgBQgMAAgFAEQgFAEgDAIIgtgGQACgMAFgGQAFgHAJgFQAHgEALgCQAMgCANAAQAVAAANACQANADAJAHQAGAGAEAKQADAKAAAIIAAA3IABAOQABAFAEAHIgtAAIgDgHIgCgIQgJAKgJADQgNAGgRgBQgWAAgMgKgAkNCNQgPAEgDAEQgEAEAAAFQAAAGAEADQADAEAIAAQAIAAAHgEQAHgEADgFQADgGAAgJIAAgIgAnqDCIAAirICDAAIAAAkIhOAAIAAAeIBDAAIAAAjIhDAAIAABGgACXhKQgJgEgEgKQgEgJAAgVIAAgsIgRAAIAAgjIARAAIAAgWIAwgZIAAAvIAaAAIAAAjIgaAAIAAAsQAAAJACACQACAEAGAAQAFAAAKgDIADAhQgRAEgQAAQgSAAgIgFgAAwhIIAAhEQAAgMgEgFQgEgFgIAAQgJAAgFAHQgGAGAAARIAAA8IgtAAIAAh9IAqAAIAAAVQAKgMAKgGQAKgFAPgBQAUAAALAMQALAMAAAZIAABPgAhmhIIgJgdIg8AAIgJAdIg2AAIBBisIA6AAIBACsgAh6iJIgTg/IgTA/IAmAAg");
    this.shape_3.setTransform(52.9, -26.2);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-94.6, -84.7, 294.7, 149.4);


  (lib.Rectangle_7 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("Ak/ATIAAgmIJ+AAIAAAmg");
    this.shape.setTransform(32, 2);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 64, 4);


  (lib.CompoundPath_0 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("Ag1BnQgmAAgcgeQgbgfgBgqQABgpAbgeQAcgfAmAAIBqAAQAnAAAcAfQAbAeABApQgBAqgbAfQgcAegnAAg");
    this.shape.setTransform(14.8, 10.4);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 29.6, 20.7);


  (lib.liftTube = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAmAXIhLAAQgKAAgHgHQgHgHAAgJQAAgIAHgHQAHgHAKAAIBLAAQAKAAAHAHQAHAHAAAIQAAAJgHAHQgHAHgKAAg");
    this.shape.setTransform(0, 12.7);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#D6D6D6").s().p("AglAXQgKAAgHgHQgHgHAAgJQAAgIAHgHQAHgHAKAAIBLAAQAKAAAHAHQAHAHAAAIQAAAJgHAHQgHAHgKAAg");
    this.shape_1.setTransform(0, 12.7);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAmAXIhLAAQgKAAgHgHQgHgHAAgJQAAgIAHgHQAHgHAKAAIBLAAQAKAAAHAHQAHAHAAAIQAAAJgHAHQgHAHgKAAg");
    this.shape_2.setTransform(0, -23);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#D6D6D6").s().p("AglAXQgJAAgIgHQgHgHAAgJQAAgIAHgHQAHgHAKAAIBLAAQAKAAAHAHQAHAHAAAIQAAAJgHAHQgHAHgKAAg");
    this.shape_3.setTransform(0, -23);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAeIJIg8AAIAAwRIA8AAg");

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#D6D6D6").s().p("AgeIJIAAwRIA8AAIAAQRg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-7.2, -53.1, 14.5, 106.3);


  (lib.liftBody = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AkrgdQgMAAgJAJQgJAJAAALQAAAMAJAIQAJAKAMAAIJXAAQAMAAAIgKQAKgIAAgMQAAgLgKgJQgIgJgMAAg");
    this.shape.setTransform(0, 45.3);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#D6D6D6").s().p("AjSAdQgMABgIgKQgJgIAAgMQAAgLAJgJQAIgIAMgBIGlAAQAMABAJAIQAHAJAAALQAAAMgHAIQgJAKgMgBg");
    this.shape_1.setTransform(-0.8, 45.3);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AhFAdQgPABgMgKQgLgIAAgMQAAgLALgJQAMgIAPgBICxAAIAAA6g");
    this.shape_2.setTransform(-22.1, 45.3);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#B0BBBF").s().p("AkiAdQgPABgMgKQgLgIAAgMQAAgLALgJQAMgIAPgBIJEAAQAQABAMAIQALAJAAALQAAAMgLAIQgMAKgQgBg");
    this.shape_3.setTransform(0, 45.3);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AkXiBQgMAAgJAJQgJAJAAAMIAABjQAAA1AmAmQAmAnA2AAIFnAAQA1AAAmgnQAngmAAg1IAAhjQAAgMgKgJQgIgJgMAAg");
    this.shape_4.setTransform(0, 55.3);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#D6D6D6").s().p("AiGCBQgrABgfgnQgfgmAAg1IAAhbQAAgQAJgKQAJgMAMAAIGjAAQAMAAAJAMQAJAKAAAQIAABbQAAA1gfAmQgfAngrgBg");
    this.shape_5.setTransform(-0.8, 55.3);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AgbBbQgngmAAg1IAAhbQAAgQALgKQAMgMAPAAIBfECQg4ABgmgng");
    this.shape_6.setTransform(-24.2, 55.3);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#B0BBBF").s().p("AitCBQg4ABgognQgogmAAg1IAAhbQAAgQAMgKQAMgMAPAAIIdAAQAPAAAMAMQALAKAAAQIAABbQAAA1gnAmQgoAng4gBg");
    this.shape_7.setTransform(0, 55.3);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AgiBQQgOgOAAgWIAAhYQAAgUAOgPQAPgOATAAQAUAAAPAOQAPAPAAAUIAABYQAAAWgPAOQgPAOgUAAQgTAAgPgOg");
    this.shape_8.setTransform(-21, -6.2);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 2
    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AArAXIhVAAQgKAAgGgHQgHgHAAgJQAAgIAHgHQAGgGAKAAIBVAAQAKAAAGAGQAHAHAAAIQAAAJgHAHQgGAHgKAAg");
    this.shape_9.setTransform(26.3, -45.6);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#D6D6D6").s().p("AgqAWQgKABgGgIQgHgGAAgJQAAgIAHgHQAGgGAKgBIBVAAQAKABAGAGQAHAHAAAIQAAAJgHAGQgGAIgKgBg");
    this.shape_10.setTransform(26.3, -45.6);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_10
      }, {
        t: this.shape_9
      }]
    }).wait(1));

    // Layer 3
    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AkrgdQgMAAgJAJQgJAJAAALQAAAMAJAIQAJAKAMAAIJXAAQAMAAAIgKQAKgIAAgMQAAgLgKgJQgIgJgMAAg");
    this.shape_11.setTransform(0, -22.7);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#D6D6D6").s().p("AkeAdQgRAAgKgJQgMgIAAgMQAAgLAMgIQAKgKARABII+AAQAQgBALAKQALAIAAALQAAAMgLAIQgLAJgQAAg");
    this.shape_12.setTransform(0, -22.7);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_12
      }, {
        t: this.shape_11
      }]
    }).wait(1));

    // Layer 4
    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#253453").s().p("AgQARQgHgHAAgKQAAgJAHgHQAIgHAIAAQAJAAAIAHQAIAHgBAJQABAKgIAHQgIAHgJAAQgIAAgIgHg");
    this.shape_13.setTransform(0, -54.1);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAAhBQAbAAATAUQATATAAAaQAAAbgTATQgTAUgbAAQgaAAgTgUQgUgTAAgbQAAgaAUgTQATgUAaAAg");
    this.shape_14.setTransform(0, -54.1);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#B9B9B9").s().p("AgtAuQgQgQADgYQACgXAUgTQATgUAXgCQAZgDAPAQQAQAQgDAYQgCAXgUATQgTAUgXACIgHABQgUAAgNgOg");
    this.shape_15.setTransform(0.9, -53.2);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("AgtAuQgTgTgBgbQABgaATgTQATgUAaAAQAbAAATAUQAUATgBAaQABAbgUATQgTAUgbAAQgaAAgTgUg");
    this.shape_16.setTransform(0, -54.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }]
    }).wait(1));

    // Layer 5
    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ADXoZIAAAbQgcgKgbAAIk/AAQg+AAgsAsQgsAsAAA+IAAL2QAAA+AsAsQAsAsA+AAIE/AAQA+AAAsgsQAsgsAAg+IAAudg");
    this.shape_17.setTransform(0, 10.5);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.lf(["rgba(255,255,255,0.106)", "rgba(255,255,255,0.431)"], [0, 1], -31, 0, 31, 0).s().p("AifIaQg9AAgtgsQgrgsAAg+IAAr2QAAg+ArgsQAtgsA9AAIE/AAQAbAAAcAKIAAgbIBeAAIAAOdQAAA+grAsQgsAsg+AAg");
    this.shape_18.setTransform(0, 10.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_18
      }, {
        t: this.shape_17
      }]
    }).wait(1));

    // Layer 6
    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AiTCEIEnAAIAAh0QAAg8grgrQgsgsg9AAQg8AAgsAsQgrArAAA8g");
    this.shape_19.setTransform(0, -55.1);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#D6D6D6").s().p("AhuB6IAAhsQAAg3AhgoQAggoAtAAQAtAAAhAoQAgAoAAA3IAABsg");
    this.shape_20.setTransform(0, -55.1);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("AhPCEIAAh1QAAg7AsgrQApgsA9AAIANEHg");
    this.shape_21.setTransform(-6.7, -55.1);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#B0BBBF").s().p("AiSCEIAAh1QAAg7ArgrQArgsA8AAQA8AAAsAsQArArAAA7IAAB1g");
    this.shape_22.setTransform(0, -55.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_22
      }, {
        t: this.shape_21
      }, {
        t: this.shape_20
      }, {
        t: this.shape_19
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-34, -69.3, 68, 138.6);


  (lib.liftBlock_body = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAykAIAKAAQAMAAAJgJQAJgJAAgMIAAhQIizAAIAABQQAAAMAJAJQAJAJAMAAIAKAAIAAEFQgGAEgGAGQgOANgDASQgBAFAAAEQAAABAAABIAAAjIAABAABQCbIAAhdIAAgFQAAgBAAgBQAAgEgBgFQgDgSgOgNQgGgHgGgDQgOgGgQAAIgnAAQgQAAgOAGABPAuQAWAMATATQAyAyAABGQAABHgyAyQgyAxhGAAQhFAAgygxQgygyAAhHQAAhGAygyQATgTAWgMAAyAFIAAkFAAACnQAMAAAJAJQAJAJAAAMQAAANgJAIQgJAJgMAAQgLAAgJgJQgJgIAAgNQAAgMAJgJQAJgJALAAgABQCbQAKATAAAXQAAAlgaAbQgbAaglAAQgkAAgagaQgbgbAAglQAAgXAKgSQAHgMAKgKQAagbAkAAQAlAAAbAbQAKAKAGALgAgxkAIBjAA");
    this.shape.setTransform(0, 36.8);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF7070").s().p("AhxBtIgDgCQgogrADg+QADg+AwgvIANgMIAAA/QgKATAAAXQAAAjAaAaQAbAbAlAAQAjAAAbgbQAagaAAgjQAAgYgKgSIAAhdQATAIARAOIADACIABABIAGAGQArArgEBAQgCAugbAnIgVAZIgZAVQgnAbguACIgIABQg7AAgogpg");
    this.shape_1.setTransform(1.1, 58.1);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFB3AB").s().p("AhbB8QgvgwAAhDQAAhBAvgwQARgQASgLIAAACIAAAjIgNAMQgvAwgEA9QgDA/ApAqIgJgIgABmh8IAAgFIAAgCQATALAQAQIACACQgRgOgUgIg");
    this.shape_2.setTransform(-2.3, 55.6);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#D6D6D6").s().p("Ag+EsQgbgaAAglQAAgXAKgSQAHgMAKgLQAagaAkAAQAlAAAaAaQAKAKAHAMQgHgMgKgKQgagaglAAQgkAAgaAaQgKALgHAMIAAhAIAAgjIAAgCIABgJQADgRAOgOIAMgKQAOgIARAAIAlAAQARAAAOAIQgOgIgRAAIglAAQgRAAgOAIIAAkFIgKAAQgMAAgJgJQgJgIAAgNIAAhQICzAAIAABQQAAANgKAIQgIAJgMAAIgKAAIhjAAIBjAAIAAEFQAGAEAGAGQAOAOADARIABAJIAAACIAAAFIAABdQAKASAAAYQgBAlgaAaQgaAbglAAQgkAAgagbgAgcDtQAAAMAJAJQAIAJALAAQAMAAAIgJQAJgJAAgMQAAgMgJgJQgIgJgMAAQAMAAAIAJQAJAJAAAMQAAAMgJAJQgIAJgMAAQgLAAgIgJQgJgJAAgMQAAgMAJgJQAIgJALAAQgLAAgIAJQgJAJAAAMIAAAAgAAyjYg");
    this.shape_3.setTransform(0, 32.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-18, -1, 36, 75.5);


  (lib.lift_rope = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.rope.cache(-3, 0, 5, 625, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 3
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#73828E").s().p("EgAUAwyIAAhRIApAdIAAA0gEgAUAuHIAAhnIApAfIAABmgEgAUArHIAAhtIApAfIAABsgEgAUAoBIAAhnIApAeIAABngEgAUAlBIAAhtIApAeIAABtgEgAUAh7IAAhmIApAdIAABngAgUe7IAAhsIApAdIAABtgAgUb1IAAhnIApAfIAABmgAgUY1IAAhoIApAdIAABpgAgUVzIAAhmIApAeIAABmgAgUSzIAAhsIApAeIAABsgAgUPtIAAhnIApAfIAABmgAgUMtIAAhtIApAfIAABsgAgUJnIAAhmIApAdIAABngAgUGnIAAhsIApAdIAABtgAgUDhIAAhmIApAeIAABmgAgUAhIAAhmIApAdIAABngAgUifIAAhmIApAdIAABngAgUlfIAAhsIApAeIAABsgAgUolIAAhnIApAfIAABmgAgUrlIAAhtIApAfIAABsgAgUurIAAhnIApAeIAABngAgUxrIAAhtIApAeIAABtgAgU0xIAAhmIApAdIAABngAgU3xIAAhpIApAeIAABpgAgU6zIAAhmIApAdIAABngAgU9zIAAhsIApAdIAABtgEgAUgg5IAAhnIApAfIAABmgEgAUgj5IAAhtIApAfIAABsgEgAUgm/IAAhnIApAeIAABngEgAUgp/IAAhtIApAeIAABtgEgAUgtFIAAhmIApAdIAABngEgAUgwFIAAgsIApAAIAABKg");
    this.shape.setTransform(0, 312.2);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#9EAAB8").s().p("EgAUAvkIAAhZIApAeIAABZgEgAUAskIAAhZIApAeIAABZgEgAUApeIAAhZIApAeIAABZgEgAUAmeIAAhZIApAeIAABZgEgAUAjYIAAhZIApAeIAABZgEgAUAgYIAAhZIApAeIAABZgAgUdSIAAhZIApAeIAABZgAgUaSIAAhZIApAeIAABZgAgUXQIAAhZIApAeIAABZgAgUUQIAAhZIApAeIAABZgAgURKIAAhZIApAeIAABZgAgUOKIAAhZIApAeIAABZgAgULEIAAhZIApAeIAABZgAgUIEIAAhZIApAeIAABZgAgUE+IAAhZIApAeIAABZgAgUB+IAAhZIApAeIAABZgAgUhCIAAhZIApAeIAABZgAgUkCIAAhZIApAeIAABZgAgUnIIAAhZIApAeIAABZgAgUqIIAAhZIApAeIAABZgAgUtOIAAhZIApAeIAABZgAgUwOIAAhZIApAeIAABZgAgUzUIAAhZIApAeIAABZgAgU2UIAAhZIApAeIAABZgAgU5WIAAhZIApAeIAABZgAgU8WIAAhZIApAeIAABZgAgU/cIAAhZIApAeIAABZgEgAUgicIAAhZIApAeIAABZgEgAUgliIAAhZIApAeIAABZgEgAUgoiIAAhZIApAeIAABZgEgAUgroIAAhZIApAeIAABZgEgAUguoIAAhZIApAeIAABZg");
    this.shape_1.setTransform(0, 311.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 3 copy
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 0, 0, 4).p("EAAWgwxMAAABhjIgrAAMAAAhhjg");
    this.shape_2.setTransform(0, 312.2);

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-3.2, -313.2, 6.4, 938.6);


  (lib.floor_grass = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#6CA038").s().p("AOiAsIAAgYQAAgHgEgEQgEgEgHAAQgGAAgEAEQgFAEAAAHIAAAYIgUAAIAAgsQAAgEgFgFQgEgFgGABQgGgBgEAFQgFAFAAAEIAAAsIhGAAQAAgkAegZQAdgbApAAQApAAAeAbQALAKAHAKQgTAQAAAZgAnUAsQAAgcAXgTQAYgUAhAAQAVAAARAHIABgBQAegbApAAQAqAAAdAbQAdAZAAAkgAugAsQAAgvgjgjIgFgFIAKgBQAqAAAdAbQAdAZAAAkgABBAFQgYgBgQANQAGgRATgRQAdgbApAAQAcAAAXANQgYAGgTASQgNALgHAPQgSgOgZAAg");
    this.shape.setTransform(182.3, 7.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#93CF56").s().p("A4/BaIAAg9IDMAAIAAgrQgBgFAFgFQAFgFAFABQAHgBAEAFQAEAFABAFIAAArIE/AAQAAgZAUgPQATgRAbAAQAZAAASAPQAJgWASgSQAjgjAygBQAuABAiAeIAEAFQAkAjgBAvIBGAAIAeAAIAAgrQAAgFAFgFQAFgFAFABQAHgBAEAFQAFAFAAAFIAAArIAdAAIAAhJQABgFAEgFQAEgFAHAAQAGAAAEAFQAFAFgBAFIAABJIAVAAIAAgrQgBgFAFgFQAFgFAFABQAHgBAEAFQAEAFABAFIAAArIDbAAIEhAAICCAAIAAgYQAAgFAEgEQAEgEAHAAQAGAAAEAEQAFAEgBAFIAAAYIAYAAQAFgMALgKIAFgFQARgLAYABQAYAAASAMQAHgNAOgNQASgSAZgGQALgDAMAAQAoAAAcAbIAEAFQARgLAVAAQAbAAAUARQATAPAAAZIAeAAIAAhJQAAgFAEgFQAEgFAHAAQAGAAAEAFQAFAFgBAFIAABJIAfAAIAAgrQgBgFAFgFQAFgFAFABQAHgBAEAFQAEAFABAFIAAArIEhAAIBGAAIAAgrQABgFAEgFQAEgFAHABQAGgBAEAFQAFAFgBAFIAAArIAVAAIAAgYQgBgFAFgEQAFgEAFAAQAHAAAEAEQAEAEABAFIAAAYIATAAQABgZASgOIAAgBQAUgRAaAAQAbAAATARQAHgLAKgKQAcgbAoAAQAnAAAbAbQAcAbAAAiICKAAIAAA9g");
    this.shape_1.setTransform(160, 9);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#6EA339").s().p("A4/AeIAAg7MAx/AAAIAAA7g");
    this.shape_2.setTransform(160, 21);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 320, 24);


  (lib.fan_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#86828E").s().p("AAFBmIABhOQgKgBgHgHQgJgJAAgJIhSABQgDghATgcIBHAqIAEgEQAGgHAIgBQAJgBAJAEIAnhIQAHAEARARQAQAQAEAHIhGApQAEAIgCAIQgBAJgHAHIgEADIApBCQgZARgeAAIgFAAg");
    this.shape.setTransform(-0.5, 0.2, 0.582, 0.579);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-6.5, -5.7, 12.1, 11.8);


  (lib.cursorWave_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#000000").ss(2, 1, 1).p("AidA7QAAAHABAHQABALAIAHQAJAHAMgBQALgBAHgJQAHgJgBgLQAAgEAAgEQAAgEAAgFIAAAAQADgmAbgYIAAAAQAegeAqAAQAqAAAfAeIAAAAQAbAYACAmIABADQAAADAAADQAAAGAAAFQAAALAIAIQAIAIAMAAQALAAAIgIQAIgIAAgLQAAgFAAgGQAAgHgBgGQgEg4gqgpQgvguhAAAQhAAAgvAuQgqApgEA3QAAAHAAAHg");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AiSBbQgJgHgBgLIgBgOIAAgOQAEg3ArgpQAuguBAAAQBAAAAvAuQAqApAEA4IABANIAAALQAAALgIAIQgIAIgLAAQgMAAgIgIQgIgIAAgLIAAgLIgBgGIAAgDQgCgmgcgYIAAAAQgegegqAAQgqAAgeAeIAAAAQgbAYgCAmIAAAAIgBAJIABAIQAAALgGAJQgIAJgLABIgDABQgKAAgHgHg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-16.8, -10.8, 33.7, 21.6);


  (lib.cursorShp = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#000000").ss(2, 0, 0, 4).p("AB6AAQAAAOgIAKQgJALgMAAIi5AAQgMAAgIgLQgJgKAAgOQAAgOAJgLQAIgJAMAAIC5AAQAMAAAJAJQAIALAAAOg");
    this.shape.setTransform(0.2, 27.4);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f().s("#000000").ss(2, 0, 1).p("AhngGQgBglAggHQAhgFAMAkQAAgpAbgMQAdgMASAfIACAFIAAiwQAAgSANgOQAOgNASAAQATAAANANQANAOAAASIAAEGQAUAHAMAMQAMANADAiQAAAGAAAuIAAAOQAAApgdAdQgdAegqAAIioAAQgpAAgegeQgdgdAAgpIAAgOQgDgxAAgjQgBhCAMgKQAQgPATgCQAVgBAPAQg");
    this.shape_1.setTransform(0, -4);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AhaE1QgNAAgIgLQgJgKAAgOQAAgQAJgKQAIgKANAAIC5AAQALAAAJAKQAJAKAAAQQAAAOgJAKQgJALgLAAgAhSDmQgpAAgegeQgdgdAAgqIAAgNQgDgxAAgjQgBhAAMgMQAQgPATgCQAVAAAPAQQgBgmAggGQAhgGAMAjQAAgoAbgMQAdgMASAgIACAEIAAivQAAgTANgOQAOgMASAAQATAAANAMQANAOAAATIAAEHQAUAFAMAMQAMANADAhIAAA1IAAANQAAAqgdAdQgdAegqAAg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-19.6, -32, 39.3, 64);


  (lib.cow_unicorn_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AgmgjIAAAiQAAAOAMAMQALALAPAAQAQAAALgLQAMgMAAgOIAAgig");
    this.shape.setTransform(77.5, 69.9);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#61FFCA").s().p("AgaAYQgMgLAAgOIAAgiIBNAAIAAAiQAAAOgMALQgLAMgQAAQgPAAgLgMg");
    this.shape_1.setTransform(77.5, 69.9);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLQgMgMAAgQIAAie");
    this.shape_2.setTransform(77.5, 63.6);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("AgaBYQgMgMAAgQIAAieIBNAAIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLg");
    this.shape_3.setTransform(77.5, 63.6);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#253453").ss(2, 1, 1).p("AAAAfQgLAAgKgJQgJgKAAgMIAAgeIA9AAIAAAeQAAAMgJAKQgJAJgNAAg");
    this.shape_4.setTransform(20.4, 54.9);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FF7B78").s().p("AgVAWQgJgKAAgMIAAgeIA9AAIAAAeQAAAMgJAKQgJAJgNAAQgLAAgKgJg");
    this.shape_5.setTransform(20.4, 54.9);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f().s("#253453").ss(2, 1, 1).p("AAZAMQAAgKgIgGQgHgHgKAAQgJAAgHAHQgIAGAAAK");
    this.shape_6.setTransform(28.8, 23.9);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#253453").ss(2, 1, 1).p("AAZAMQAAgKgIgGQgHgHgKAAQgJAAgHAHQgIAGAAAK");
    this.shape_7.setTransform(15.8, 23.9);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAXgKQAAAKgHAFQgGAHgKAAQgJAAgHgHQgHgFAAgK");
    this.shape_8.setTransform(22.3, 6);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAjgQQAAAOgKAJQgLAKgOAAQgNAAgLgKQgKgJAAgO");
    this.shape_9.setTransform(22.3, 10.6);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAABVQgUAAgOgSQgNgRAGgWIAihqQACgHAFAAQAHAAACAHIAhBqQAHAWgOARQgNASgWAAg");
    this.shape_10.setTransform(22.2, 8.6);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FDFFB5").s().p("AgiBDQgNgSAGgUIAihrQACgGAFgBQAHABACAGIAhBrQAHAUgOASQgNASgWAAQgUAAgOgSg");
    this.shape_11.setTransform(22.2, 8.6);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#253453").s().p("AgLAdQgFgFAAgIIAAgfQAAgIAFgFQAFgFAGAAQAHAAAFAFQAFAFAAAIIAAAfQAAAIgFAFQgFAFgHAAQgGAAgFgFg");
    this.shape_12.setTransform(31.8, 42.1);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#253453").s().p("AgLAdQgFgFAAgIIAAgfQAAgIAFgFQAFgFAGAAQAHAAAFAFQAFAFAAAIIAAAfQAAAIgFAFQgFAFgHAAQgGAAgFgFg");
    this.shape_13.setTransform(13.7, 42.1);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABJBgIiRAAQgmAAgbgbQgagaAAgmIAAgJQAAgmAagaQAbgbAmAAICRAAQAmAAAaAbQAbAaAAAmIAAAJQAAAmgbAaQgaAbgmAAg");
    this.shape_14.setTransform(22.8, 42.1);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#61FFCA").s().p("AhIBgQgmAAgbgbQgagaAAgmIAAgJQAAgmAagaQAbgbAmAAICRAAQAmAAAaAbQAbAaAAAmIAAAJQAAAmgbAaQgaAbgmAAg");
    this.shape_15.setTransform(22.8, 42.1);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ACECtIkHAAIAAjVQAAg3AngnQAmgnA2AAQA3AAAmAnQAnAnAAA3g");
    this.shape_16.setTransform(22.8, 27.4);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFFFFF").s().p("AiDCtIAAjVQAAg3AngnQAngnA1ABQA2gBAnAnQAnAnAAA3IAADVg");
    this.shape_17.setTransform(22.8, 27.4);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgZAAgTgTQgUgRAAgbIBxAAg");
    this.shape_18.setTransform(39.5, 18.2, 1, 1, 0, 0, 180);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("AAIAgQgZAAgTgTQgTgRgBgbIBwAAIAAA/g");
    this.shape_19.setTransform(39.5, 18.2, 1, 1, 0, 0, 180);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgZAAgTgTQgUgRAAgbIBxAAg");
    this.shape_20.setTransform(5.7, 18.2);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("AAIAgQgZAAgTgTQgTgRgBgbIBwAAIAAA/g");
    this.shape_21.setTransform(5.7, 18.2);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AgmgjIAAAiQAAAOAMAMQALALAPAAQAQAAALgLQAMgMAAgOIAAgig");
    this.shape_22.setTransform(44.4, 69.9);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#61FFCA").s().p("AgaAYQgMgLAAgOIAAgiIBNAAIAAAiQAAAOgMALQgLAMgQAAQgPAAgLgMg");
    this.shape_23.setTransform(44.4, 69.9);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLQgMgMAAgQIAAie");
    this.shape_24.setTransform(44.4, 63.6);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("AgaBYQgMgMAAgQIAAieIBNAAIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLg");
    this.shape_25.setTransform(44.4, 63.6);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAyECIhiAAQhrAAhMhMQhMhLAAhrQAAhpBMhMQBMhMBrAAIBiAAQBrAABLBMQBMBMAABpQAABrhMBLQhLBMhrAAg");
    this.shape_26.setTransform(56.2, 38.8);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("AgwECQhrAAhMhMQhMhLAAhrQAAhpBMhMQBMhMBrAAIBiAAQBrAABLBMQBMBMAABpQAABrhMBLQhLBMhrAAg");
    this.shape_27.setTransform(56.2, 38.8);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#253453").s().p("AAABOQgIANgQAAIgKgBQgMgFgFgLQgEgIABgIIgIABQgSAAgJgPQgFgKACgLQACgMAJgHIgBgKQAAgjAYgZQAZgYAhAAQAiAAAZAYQAZAZAAAjIgBAKQAHAGADAKQADANgGALQgJAPgSAAIgIgBQABAJgDAHQgGALgMAFIgKABQgQAAgJgNgAAPBAQACAHAIAAIADAAQAFgCACgEQABgEgBgEIgEgKQALgGAHgJIAJAGIAFABQAHAAADgFQACgEgBgEQgBgFgEgCIgJgFQAEgLAAgJQAAgbgTgTQgTgSgaAAQgZAAgTASQgSATAAAbQAAAJAEALIgJAFQgEACgBAFQgCAEADAEQADAFAGAAQADAAACgBIAJgGQAIAJAKAGIgEAKQgBAEACAEQACAEAEACIADAAQAIAAADgHIADgJIAKABIALgBg");
    this.shape_28.setTransform(61.7, 62.8);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#FFEF7D").s().p("AAUBGQgEgCgCgEIgDgJIgLABIgKgBIgDAJQgCAEgEACQgFACgEgBQgDgCgCgEQgDgEACgEIADgKQgKgGgHgJIgJAGQgEACgEgBQgEgBgDgEQgCgEABgEQACgFAEgCIAJgFQgEgLgBgJQAAgbATgTQATgSAZAAQAaAAATASQATATAAAbQgBAJgEALIAJAFQAEACACAFQABAEgCAEQgDAEgEABQgEABgEgCIgKgGQgGAJgLAGIADAKQACAEgCAEQgCAEgEACIgDAAIgFgBg");
    this.shape_29.setTransform(61.8, 62.8);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AgmgjIAAAiQAAAOAMAMQALALAPAAQAQAAALgLQAMgMAAgOIAAgig");
    this.shape_30.setTransform(69, 69);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#61FFCA").s().p("AgaAYQgMgLAAgOIAAgiIBNAAIAAAiQAAAOgMALQgLAMgQAAQgPAAgLgMg");
    this.shape_31.setTransform(69, 69);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLQgMgMAAgQIAAie");
    this.shape_32.setTransform(69, 62.7);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FFFFFF").s().p("AgaBYQgMgMAAgQIAAieIBNAAIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLg");
    this.shape_33.setTransform(69, 62.7);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AgmgjIAAAiQAAAOAMAMQALALAPAAQAQAAALgLQAMgMAAgOIAAgig");
    this.shape_34.setTransform(34.6, 68.7);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#61FFCA").s().p("AgaAYQgMgLAAgOIAAgiIBNAAIAAAiQAAAOgMALQgLAMgQAAQgPAAgLgMg");
    this.shape_35.setTransform(34.6, 68.7);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLQgMgMAAgQIAAie");
    this.shape_36.setTransform(34.6, 62.3);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f("#FFFFFF").s().p("AgaBYQgMgMAAgQIAAieIBNAAIAACeQAAAQgMAMQgLALgQAAQgPAAgLgLg");
    this.shape_37.setTransform(34.6, 62.3);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABSBqQgYABgPgdQgSgmAXg7IAFgLIALAIQALgYgKgZQgKgZgZgQQgZgRgtACQgnADgJAGQgDADAbAXQAaAjgLA3QgUBjBDAZQAWAIAdgDQAZgCAMgJQAEgCgCgEQgBgEgFAAg");
    this.shape_38.setTransform(91.8, 38.9);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#61FFCA").s().p("AgCB6QhDgZAUhjQALg3gagjQgbgXADgDQAJgGAngDQAtgCAZARQAZAQAKAZQAKAZgLAYIgLgIIgFALQgXA7ASAmQAPAdAYgBQAFAAABAEQACAEgEACQgMAJgZACIgPABQgUAAgQgGg");
    this.shape_39.setTransform(91.8, 38.9);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_39
      }, {
        t: this.shape_38
      }, {
        t: this.shape_37
      }, {
        t: this.shape_36
      }, {
        t: this.shape_35
      }, {
        t: this.shape_34
      }, {
        t: this.shape_33
      }, {
        t: this.shape_32
      }, {
        t: this.shape_31
      }, {
        t: this.shape_30
      }, {
        t: this.shape_29
      }, {
        t: this.shape_28
      }, {
        t: this.shape_27
      }, {
        t: this.shape_26
      }, {
        t: this.shape_25
      }, {
        t: this.shape_24
      }, {
        t: this.shape_23
      }, {
        t: this.shape_22
      }, {
        t: this.shape_21
      }, {
        t: this.shape_20
      }, {
        t: this.shape_19
      }, {
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, -3.4, 105.3, 78);


  (lib.cow_First_tail = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(3, 1, 1).p("AAsAxIAAhQQAAgagSgSQgSgSgYAAIg8AAABNBSIghghAAsBeIAAgtAALBSIAhgh");
    this.shape.setTransform(7.7, 9.5);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1.5, -1.5, 18.5, 22);


  (lib.cow_First_headRun = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAuizIAAgXQAAgLAIgHQAIgIALAAQALAAAIAIQAHAHAAALIAAA8QAhAlAAAyIAABsQAHAEAGAHQAcAbAAAnIAAAGQAAAngcAbQgbAbgnAAIidAAQgnAAgbgbQgcgbAAgnIAAgGQAAgnAcgbQAGgHAHgEQAXgRAeAAICdAAQAeAAAXARAAuizQAaAKAVAUQADAEADADAg3ivQAZgMAeAAQAYAAAWAIAhsiCIAAhIQAAgLAHgHQAIgIALAAQALAAAIAIQAIAHAAALIAAAbAhsiCQAHgJAJgKQARgQAUgKAiDA1IAAhsQAAgqAXgh");
    this.shape.setTransform(0.1, 0);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#253453").s().p("ABNB+QgFgFAAgHIAAgiQAAgIAFgFQAGgFAHAAQAHAAAFAFQAFAFAAAIIAAAiQAAAHgFAFQgFAFgHAAQgHAAgGgFgAhlB+QgFgFAAgHIAAgiQAAgIAFgFQAFgFAHAAQAHAAAGAFQAFAFAAAIIAAAiQAAAHgFAFQgGAFgHAAQgHAAgFgFgAAkhWQgIgHAAgLQAAgLAIgIQAHgHALAAQALAAAIAHQAHAIAAALQAAALgHAHQgIAHgLAAQgLAAgHgHgAhShWQgHgHAAgLQAAgLAHgIQAIgHALAAQALAAAHAHQAIAIAAALQAAALgIAHQgHAHgLAAQgLAAgIgHg");
    this.shape_1.setTransform(0.1, 3.6);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFB2B2").s().p("AhOBgQgnAAgbgbQgcgbAAgnIAAgFQAAgmAcgcIANgKQAXgRAeAAICdAAQAeAAAXARIANAKQAcAcAAAmIAAAFQAAAngcAbQgbAbgnAAgABNgcQgFAFAAAIIAAAgQAAAHAFAFQAGAFAHAAQAHAAAFgFQAFgFAAgHIAAggQAAgIgFgFQgFgFgHAAQgHAAgGAFgAhlgcQgFAFAAAIIAAAgQAAAHAFAFQAFAFAHAAQAHAAAGgFQAFgFAAgHIAAggQAAgIgFgFQgGgFgHAAQgHAAgFAFg");
    this.shape_2.setTransform(0.1, 13.3);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("ABPBoIidAAQgeAAgXAQIAAhtQAAgoAXghQAHgKAJgJQARgRAUgJQAZgMAeAAQAYAAAWAIQAaAJAVAVIAGAHQAhAlAAAwIAABtQgXgQgeAAgAAkgTQgIAIAAALQAAAIAIAIQAHAHALAAQALAAAIgHQAHgIAAgIQAAgLgHgIQgIgHgLAAQgLAAgHAHgAhSgTQgHAIAAALQAAAIAHAIQAIAHALAAQALAAAHgHQAIgIAAgIQAAgLgIgIQgHgHgLAAQgLAAgIAHg");
    this.shape_3.setTransform(0.1, -6.8);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FDFFB5").s().p("AhngVQAAgLAHgIQAIgIALAAQALAAAIAIQAIAIAAALIAAAYQgUAKgRARQgJAJgHAKgABiAeQgVgVgagJIAAgVQAAgLAIgIQAIgIALAAQALAAAIAIQAHAIAAALIAAA5IgGgGg");
    this.shape_4.setTransform(-0.4, -18);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 4 copy
    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgZAAgTgTQgUgRAAgbIBxAAg");
    this.shape_5.setTransform(15.8, -8.8, 1, 1, 0, 0, 180);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AAIAgQgZAAgTgTQgTgRAAgbIBvAAIAAA/g");
    this.shape_6.setTransform(15.8, -8.8, 1, 1, 0, 0, 180);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_6
      }, {
        t: this.shape_5
      }]
    }).wait(1));

    // Layer 3
    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgZAAgTgTQgUgRAAgbIBxAAg");
    this.shape_7.setTransform(-15.8, -8.8);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AAIAgQgZAAgTgTQgTgRAAgbIBvAAIAAA/g");
    this.shape_8.setTransform(-15.8, -8.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_8
      }, {
        t: this.shape_7
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-22.9, -23.9, 45.8, 47.9);


  (lib.cow_First_headMilk = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 1, 1).p("ABaAMQAAgLgHgFQgIgHgKAAQgLAAgHAHQgHAFAAALAgnAMQAAgLgHgFQgHgHgLAAQgKAAgHAHQgIAFAAAL");
    this.shape.setTransform(0, -10.7);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAvjRIAAgXQAAgLAHgHQAIgIALAAQALAAAIAIQAIAHAAALIAAA8Ag4jNQAagMAeAAQAZAAAWAIQAZAKAVAUQADAEAEADQAgAlAAAyIAABrQAHAFAHAHQAbAbAAAnIAAAGQAAAngbAbQgbAaglABIg3AAIAAAeQAAANAJAIQAJAJAMAAQANAAAIgJQAJgIAAgNIAAgeIgFAAAiDAWQAXgQAdAAICfAAQAdAAAXAQAhtifIAAhJQAAgLAIgHQAIgIALAAQALAAAIAIQAHAHAAALIAAAbAhtifQAIgKAJgKQARgQATgKAiDAWIAAhrQAAgpAWghAAbDHIhqAAQgmAAgcgbQgbgbAAgnIAAgGQAAgnAbgbQAHgHAHgF");

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FF6348").s().p("AgTAUQgJgIAAgMIAAgcIA0AAIAFAAIAAAcQABAMgKAIQgIAJgMAAQgLAAgIgJg");
    this.shape_2.setTransform(5.8, 23);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#253453").s().p("ABOAdQgGgFAAgIIAAgfQAAgIAGgFQAEgFAIAAQAHAAAFAFQAGAFAAAIIAAAfQAAAIgGAFQgFAFgHAAQgIAAgEgFgAhlAdQgGgFAAgIIAAgfQAAgIAGgFQAFgFAHAAQAHAAAGAFQAFAFAAAIIAAAfQAAAIgFAFQgGAFgHAAQgHAAgFgFg");
    this.shape_3.setTransform(0, 10.3);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFB2B2").s().p("AAbBgIhqAAQgmAAgbgbQgbgbAAgnIAAgFQAAgmAbgbIANgMQAXgQAdAAICfAAQAdAAAXAQIANAMQAbAbAAAmIAAAFQAAAngbAbQgaAagmABgABOgcQgGAFAAAIIAAAfQAAAIAGAFQAEAFAIAAQAHAAAFgFQAGgFAAgIIAAgfQAAgIgGgFQgFgFgHAAQgIAAgEAFgAhlgcQgGAFAAAIIAAAfQAAAIAGAFQAFAFAHAAQAHAAAGgFQAFgFAAgIIAAgfQAAgIgFgFQgGgFgHAAQgHAAgFAFg");
    this.shape_4.setTransform(0, 10.3);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("ABQBoIifAAQgdAAgXAQIAAhtQAAgnAXghQAHgKAJgKQARgQAUgKQAZgMAeAAQAZAAAVAIQAaAKAVAUIAGAIQAhAkAAAwIAABtQgXgQgdAAgABSgMQAIAGAAAJQAAgJgIgGQgHgIgLAAQgKAAgHAIQgIAGAAAJQAAgJAIgGQAHgIAKAAQALAAAHAIgAgtgMQAGAGABAJQgBgJgGgGQgIgIgKAAQgLAAgHAIQgHAGgBAJQABgJAHgGQAHgIALAAQAKAAAIAIg");
    this.shape_5.setTransform(0, -9.8);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FDFFB5").s().p("AhngWQgBgLAJgHQAHgIALAAQALAAAIAIQAIAHAAALIAAAZQgUAKgRAQQgJAKgHAKgABiAdQgVgUgagJIAAgWQAAgLAIgHQAIgIALAAQALAAAHAIQAJAHgBALIAAA6IgGgHg");
    this.shape_6.setTransform(-0.5, -21);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 4 copy
    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgZAAgTgTQgUgRAAgbIBxAAg");
    this.shape_7.setTransform(15.8, -11.7, 1, 1, 0, 0, 180);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AAIAgQgZAAgTgTQgTgRAAgbIBvAAIAAA/g");
    this.shape_8.setTransform(15.8, -11.7, 1, 1, 0, 0, 180);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_8
      }, {
        t: this.shape_7
      }]
    }).wait(1));

    // Layer 4
    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgZAAgTgTQgUgRAAgbIBxAAg");
    this.shape_9.setTransform(-15.8, -11.7);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("AAIAgQgZAAgTgTQgTgRAAgbIBvAAIAAA/g");
    this.shape_10.setTransform(-15.8, -11.7);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_10
      }, {
        t: this.shape_9
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-23.7, -28.2, 46.5, 55.9);


  (lib.cow_First_frontLeg = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhnIAACCIAAAkQAAARgMAMQgLAMgQAAQgPAAgLgMQgMgMAAgRIAAgkIAAiC");
    this.shape.setTransform(0, 0.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#253453").s().p("AgaAaQgLgMAAgPIAAgkIBLAAIAAAkQAAAPgLAMQgMAMgPAAQgOAAgMgMg");
    this.shape_1.setTransform(0, 7.1);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AglBBIAAiCIBLAAIAACCg");
    this.shape_2.setTransform(0, -3.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-5.1, -11, 10.5, 23);


  (lib.cow_First_dug = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#253453").s().p("AAABPQgIANgQgBQgGAAgEgBQgKgEgGgJQgFgJABgKIgIABQgSAAgJgPQgGgKACgLQADgMAIgGIgBgMQAAgiAZgYQAZgZAhAAQAiAAAZAZQAYAYAAAiIgBAMQAJAGACAMQACAKgFALQgJAPgSAAIgIgBQABAKgFAJQgGAJgKAEQgEABgGAAQgQABgJgNgAAPBAIAAABQACAGAFAAIADAAIADAAQAEgCACgEQACgEgBgEIgEgKQAKgGAIgIIAJAEIAFACIABAAQAEAAACgDIABAAIABgCQADgEgBgEQgBgEgEgDIgKgFQAEgLAAgKQAAgagSgTQgTgSgagBQgZABgTASQgTAUAAAZQAAAKAEALIgJAFQgEADgBAEQgBAEACAEIABABQADAEAGAAIAFgCIAJgEQAIAIAKAGIgEAKQgBAEACAEQACAEAEACIADAAIADAAQAFAAACgGIAAgBIAEgKIAKABIALgBg");
    this.shape.setTransform(-3.7, 0);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFB2B2").s().p("AAWBHIgCAAQgDgCgCgEIAAgBIgEgKIgLABIgKgBIgEAKIAAABQgCAEgDACIgCAAIgDAAIgDAAQgEgCgCgEQgCgEABgEIAEgKQgKgGgIgIIgJAEIgFACQgGAAgDgEIgBgBQgCgEABgEQABgEAEgDIAJgFQgEgLAAgKQAAgZATgUQATgSAZgBQAaABATASQASATAAAaQAAAKgEALIAKAFQAEADABAEQABAEgDAEIgBACIgBAAIgEACIgCABIgBAAIgFgCIgJgEQgIAIgKAGIAEAKQABAEgCAEQgCAEgEACIgDAAIgDAAg");
    this.shape_1.setTransform(-3.7, 0);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-13.2, -9.2, 18.9, 18.7);


  (lib.cow_First_body = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 5
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAyEDIhjAAQhrAAhLhMQhMhLAAhrQAAhAAcg1QAAgMAKgJQADgDADgCQAOgUASgTQBLhLBrAAIAmAAQABgBAZgBQAcAAAMACQATACARAEQBKAUAtAdQAoAaARAjQABACABACQAnA9AABMQAABrhMBLQhLBMhrAAgAgIgxQAIgQAWgCQAbgDAVAVQAXAXAOACQANADAegMQAPgGAKAMQALAMABARQACAwgxAAQgyAAgLAbQgKAZAfAcQAPAMgEAQQgDAOgQAKQgqAXgygjQgqggAHgmQASgmAEgOQAEgQgCgkQgBgiAEgLg");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#253453").s().p("AgIDLQgsgfAHgmQASgnADgNQAFgRgCglQgCggAFgLQAHgQAXgCQAbgDAVAVQAWAVAOACQANADAfgLQAOgFALAKQAKAMABASQADAwgxAAQgzAAgKAbQgLAaAgAbQAOANgDAPQgDAPgRAJQgQAKgSAAQgbAAgcgWgADfAvQgmgYAPgdQAHgNgEgXQgGgigYgdQgagfgbAAQgPAAgSAJIgdAQQglATgngYQhEgnBBhDQABgBAYgBQAdAAALACQAUACAQAEQBKAUAtAdQApAaAQAjIACAEQAgBHAABJQgQAQgSAAQgQAAgRgLgAiEgQQhdgSgugUQgPgGgDgQIAAgGQAAgMAKgJIAFgFIAkglQA1g3AcABQAVABAiAqQBDBUAIAUQAQAsg7AAQgZAAglgIg");
    this.shape_1.setTransform(1.1, -3.4);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AgxECQhrAAhLhMQhMhLAAhrQAAg/Acg2IABAGQACAQAPAHQAvATBcATQB+AZgVg+QgHgThEhUQgigqgUgBQgdgCg0A4IgkAkQAOgUASgSQBLhMBrAAIAmAAQhABEBEAnQAnAXAkgSIAegQQARgJAQAAQAbAAAaAfQAYAdAGAiQAEAWgHAOQgQAfAmAWQAnAYAdgdQAAhKgghGQAnA9AABLQAABrhMBLQhLBMhrAAgAAWhDQgWACgIAQQgEAKABAjQACAjgEAQQgEAOgSAmQgHAmAqAgQAyAjAqgXQAQgKADgOQAEgQgPgMQgfgcAKgZQALgbAyAAQAxAAgCgwQgBgRgLgLQgKgMgPAFQgeAMgNgCQgOgDgXgWQgSgTgXAAIgHABgABbj6QgRgEgTgDQBYACBDA1QgtgdhKgTg");
    this.shape_2.setTransform(0, 0.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-31.8, -29.9, 63.7, 56.9);


  (lib.cow_First_backLeg = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#253453").s().p("AgaBiQgLgNAAgSIAAiwIBLAAIAACwQAAASgLANQgMAMgPAAQgOAAgMgMg");
    this.shape.setTransform(0, 1.1);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 2
    this.instance = new lib.cow_backLeg();
    this.instance.parent = this;
    this.instance.setTransform(-1.8, -2.6, 0.1, 0.1);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-3.9, -10, 7.8, 22.2);


  (lib.conveer_wheel = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#333333").s().p("AgBAKIAAgTIADAAIAAATg");

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 1
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#939393").s().p("AgRASQgHgIAAgKQAAgJAHgHQAIgIAJAAQALAAAGAIQAIAHAAAJQAAAKgIAIQgGAHgLAAQgJAAgIgHg");
    this.shape_1.setTransform(0, 0, 0.582, 0.582);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1.5, -1.5, 3, 3);


  (lib.collectorCraneBody = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 1, 1).p("AB9hPIAUAAIAAA8IgUAAIh4AAIgTAAIAAg8IATAAgAgijlIAKAAQA9AAAsAsQAsAsAAA+AB9BQIAUAAIAAA8IgCAAIAUAzAggC/QAEgBAEAAICzAAQAEAAAEABQAHACAGAFQAJAJAAANQAAAMgJAJQgJAJgMAAIizAAQgMAAgJgJQgJgJAAgMQAAgNAJgJQAGgFAHgCIAUgzIAIgUICLAAIAIAUAAFBQIB4AAAAFBQIAAhjAB9gTIAABjAh8htIAAAUIg8AAIAAigIA8AAIAAAUIAeAAIAAgUIA8AAIAAAUIAAB4IAAAUIg8AAIAAgUgAAFhPQAAgMgIgJQgIgJgNAAIgKAAAh8jlIAAB4AhehtIAAh4AgMCMIgCAAIAAg8IATAA");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF7070").s().p("AhZBBQgMgBgIgIQgKgJABgNQgBgMAKgJQAFgGAHgCIAIgBICyAAIAJABQAHACAGAGQAIAJABAMQgBANgIAJQgJAIgNABgABZAEIiyAAIgIABIAVgwIAHgVICLAAIAIAVIAUAwIgJgBg");
    this.shape_1.setTransform(6.5, 18.5);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#7E7E7E").s().p("ACjDDIgIgVIiNAAIgHAVIgDAAIAAg8IAVAAIB4AAIATAAIAAA8gACRAjIh4AAIgVAAIAAg7IAVAAIB4AAIATAAIAAA7gAhKgiIAAgTIAAh5IAAgUIA8AAIAAAUIAAB5IAAATgAikgiIAAigIA8AAIAAAUIAAB5IAAATg");
    this.shape_2.setTransform(-2, -5.5);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#888888").s().p("AAFCbIAAhkIB4AAIAABkgAAFgEQgBgMgGgJQgJgIgNAAIgKAAIAAh5IAKAAQA9AAArAsQAsAtABA9gAh8ghIAAh5IAeAAIAAB5g");
    this.shape_3.setTransform(0, -7.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-19.5, -26, 39, 52);


  (lib.collectorBody = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("rgba(255,255,255,0.247)").s().p("AgrAoIAAhOIBYAAIAABOg");
    this.shape.setTransform(-31.8, 24.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f().s("#253453").ss(2, 1, 1).p("AmqggINVAAQAQAAALAKQACAAABACQABABAAABIAEAGQAEAFAAAHQAAADgBADQAAAAAAABIAAABIgBADQgDAHgHAFQgLAKgQAAItVAAQgQAAgLgKQgGgFgDgGIgCgGIAAAAQgBgDAAgDQAAAAAAAAQABgHADgFIACgEQACgEAEgCQALgKAQAAg");
    this.shape_1.setTransform(-0.5, 24.5);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#D6D6D6").s().p("AmqAhQgPABgMgKQgGgFgDgHIgCgGIAAAAIAAgGIAAAAQAAgGADgGIACgEIAGgGQAMgLAPAAINVAAQAQAAALALIACACIACACIAEAGQAEAGgBAGIAAAGIgBABIAAAAIgBAEQgCAHgHAGQgLAKgQgBg");
    this.shape_2.setTransform(-0.5, 24.5);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("rgba(255,255,255,0.247)").s().p("AgeCnQgOgNAAgSIAAkPQAAgSAOgOQANgNARAAQATAAANANQAMAOAAASIAAEPQAAASgMANQgOAOgSAAQgRAAgNgOg");
    this.shape_3.setTransform(-28.5, 23.4);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AgeBSQgOgNAAgUIAAhiQAAgSAOgNQANgNARgBQATABANANQAMANAAASIAABiQAAAUgMANQgNANgTgBQgRABgNgNg");
    this.shape_4.setTransform(-28.5, 3.8);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f().s("#253453").ss(2, 1, 1).p("AESBIIAABHQAAAHgFAGQgFAFgIAAIg/AAQgHAAgFgFQgGgGAAgHIAAhHIiuAAIilAAIAABGQAAAIgFAFQgGAFgHAAIg/AAQgHAAgGgFQgFgFAAgIIAAhGIhrAAQgYAAgRgRQgSgRAAgYIAAiHQAAgQAMgMQALgLAQAAIGaAAIFzAAQAQAAALALQAMAMAAAQIAACHQAAAYgRARQgRARgZAAIhhAAIhjAAAikBIIhjAA");
    this.shape_5.setTransform(0, 72.9);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AAnB1IhhAAIhrAAQgYAAgRgRQgSgRAAgZIAAiHQAAgQAMgLQALgMAQAAIGaAAIgBAIIlcAAQgNAAgKAKQgKALAAAPIAAB/QAAAWAPARQAOAQAVAAIE5AAIgBAHg");
    this.shape_6.setTransform(-20.5, 68.5);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#D6D6D6").s().p("AABBtIk5AAQgVAAgOgPQgOgRAAgXIAAh+QAAgQAKgKQAJgKANAAIFcAAIE3AAQAOAAAJAKQAJAKAAAQIAAB+QAAAXgOARQgOAPgVAAg");
    this.shape_7.setTransform(0, 68.5);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#B0BBBF").s().p("ABuChQgIAAgFgFQgFgGAAgHIAAhHIitAAIABgHIE2AAQAVAAAOgPQAOgRAAgXIAAh+QAAgQgJgKQgJgKgOAAIk1AAIABgIIFwAAQARAAALALQAMAMAAAQIAACHQgBAZgQAQQgRARgZAAIhhAAIhjAAIBjAAIAABHQAAAHgFAGQgFAFgIAAgAlIChQgHAAgGgGQgEgFAAgHIAAhHIBiAAIAABHQAAAHgFAFQgFAGgIAAgAC/BIg");
    this.shape_8.setTransform(8.3, 72.9);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f().s("#253453").ss(2, 1, 1).p("AgfjSIAkAAQABAAABAAAAvAcQgEADgGAAIgeAAQgSAAgPgPQgPgPAAgSIAAg8QAAgVAPgPQAPgOASAAIAeAAQAGAAAEADAA5jSIAAGlAAvjPIhoAA");
    this.shape_9.setTransform(37.2, -35.6);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AF7mYIAFAAIAtAAIAiAAQAUAAAIgWIAAAAQAFgOgEgPQgFgOgLgHImXjmQghgSgjgDQgDAAgFAAQgBAAgCAAQgqAAgmAXImCDlQgRAJAAAYQAAAQAJALQAJALAMAAIAYAAIA/AAILLAAAF7BIIAsAAIAHAAQANAAAIgJQAIgHABgLIAAgGQgBgKgIgIQgIgJgNAAIgBAAIgDAAIgHAAIhqAAIq9AAIgpAAIgFAAIgFAAIgBAAQgMAAgJAJQgIAIAAAKIgBADIABADQAAALAIAHQAJAJAMAAIAIAAIArAAIAAKUIMAAAgAE5mWIq9AAIgpAAIAAGiAmFBIIMAAA");
    this.shape_10.setTransform(0, -15.8);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#CCCCCC").s().p("AgTDSIAAmjIAnAAIgBGjg");
    this.shape_11.setTransform(-40.9, -35.5);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("rgba(119,119,119,0.098)").s().p("Al/FKIAAqSIL/AAIAAKSg");
    this.shape_12.setTransform(-0.5, 24.5);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#D6D6D6").s().p("AGAAeIr/AAIgrAAQgQgBgLgIQgKgIgBgKIAAgDIAAgBQABgLAKgIQAIgGALgCIAFAAIAFAAIApAAIK+AAIBqAAIAGAAIAEAAQALACAIAGQAKAIABALIAAAEQgBAKgKAIQgLAIgPABg");
    this.shape_13.setTransform(-0.5, -11.5);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#666666").s().p("AgzDSIAAmjIBoAAIAABTQgFgDgFAAIgfAAQgSAAgPAPQgOAOAAAWIAAA7QAAATAOAPQAPAPASAAIAfAAQAFgBAFgCIAAC3g");
    this.shape_14.setTransform(36.7, -35.5);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#888888").s().p("AGvDTIgGAAIAAi3QgFACgFABIgfAAQgUAAgPgPQgOgPAAgTIAAg7QAAgWAOgOQAPgPAUAAIAfAAQAFAAAFADIAAhTIhqAAIAAGjIq+AAIABmjIK9AAIq9AAIgqAAIAAGjIgFAAIgFAAIAFAAIgFAAIAAAAIAAmlIA/AAILMAAIAlAAIACAAIAGAAIAtAAIAAGlIgEAAIAEAAIAAAAIgEAAgAmtDTg");
    this.shape_15.setTransform(-0.5, -35.6);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FF6E79").s().p("AF4ChIglAAIrLAAQgGAAgFgDIgGgIQgHgLAAgPQAAgYAOgKIExjdIAIgGQAegVAhgCIADAAIAIAAQAdADAaASIFKDkQAKAHADAOQAEAOgEAPQgDAKgGAGQgGAFgFABIgDAAg");
    this.shape_16.setTransform(0, -72.9);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFCAD3").s().p("AGvCVIgtAAQA5gBAXgEQAVgFAFgLQgIAVgTAAgAm1CVIgYAAQgNAAgIgLQgJgLAAgPQAAgYARgJIGCjkIAJAHIkyDdQgOAJAAAYQAAAPAHALIAHAIQAFADAFAAg");
    this.shape_17.setTransform(-0.1, -71.7);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#D36376").s().p("ACyChQAFgBAFgFQAGgGADgKQAEgPgDgOQgEgOgJgHIlJjkQgagSgcgDQAjADAgASIGVDkQAMAHAEAOQAEAPgFAOIAAABQgFALgVAEQgXAEg5ACgAkjiJQAmgXAqAAQghACgeAVIgIAGg");
    this.shape_18.setTransform(20.2, -72.9);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-50.4, -90.4, 102, 180.5);


  (lib.chainPart = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 3
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#4C4C4C").s().p("AgQAIIAAgPIAhAAIAAAPg");
    this.shape.setTransform(3.3, -7.4, 0.742, 0.742);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#4C4C4C").s().p("AgQAIIAAgPIAhAAIAAAPg");
    this.shape_1.setTransform(-3.7, -7.4, 0.742, 0.742);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#32312F").s().p("AgQAdIAAg5IAhAAIAAA5g");
    this.shape_2.setTransform(3.3, -5.8, 0.742, 0.742);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#32312F").s().p("AgQAdIAAg5IAhAAIAAA5g");
    this.shape_3.setTransform(-3.7, -5.8, 0.742, 0.742);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#161311").s().p("AgcAdIAAg6IA5AAIAAA6g");
    this.shape_4.setTransform(-0.2, 0.3, 0.742, 0.742);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#161311").s().p("Ag/ARIAAghIB/AAIAAAhg");
    this.shape_5.setTransform(-0.2, 6.4, 0.742, 0.742);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#32312F").s().p("Ag/BBIAAiBIB/AAIAACBg");
    this.shape_6.setTransform(-0.2, 0.3, 0.742, 0.742);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-5, -8, 9.6, 15.7);


  (lib.carBodyAnim_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 3
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AHTjMIAcAAQAMAAAJgJQAJgIAAgNQAAgMgJgJQgJgJgMAAIh4AAIkYAAQgBAAAAAAQgBAAgBAAIghAKQgIAFgGAGQgDACgCADIgNAbIAAABQgCADAAADIAAAAQAAAFAAAFIAABGIgnAAIAAgoIg8AAIAAAoInCAAIAAgoIg8AAIAAAoIgoAAIAAAyIAoAAIA8AAIHCAAIAAAeInCAAIg8AAIgoAAIAAAwIAoAAIAAAoIA8AAIAAgoIHCAAIAAAoIA8AAIAnAAAE9jMIA6AAQANAAAHgJQAKgIAAgNQAAgMgKgJQgHgIgNgBAGyAEIhrAAIgDAAQgMgBgIgIQgIgKACgMIABgJQgCgDAAgFIAAgCIAPiCQABgEACgDIACgVABViuICbAAQANAAAJAJQAIAJAAAMIgMBoQgCALgJAIQgIAHgLAAIiPAAQgNAAgJgJQgIgIAAgNIAAhkQAAgMAIgJQAJgJANAAgAHdAEIgDAAQgMgBgIgIQgIgKACgMIATixAF3jMIBcAAAI1A2IAAgUQAAgMgJgJQgJgJgMAAIg6AAIgrAAQgMABgJAIQgIAJAAAMIAAAUIiWAAQgbAAgTASQgUARgEAZIBmAAQAkABAZAaQAbAaAAAmIAAAUIgKAAIAAAoIAoAAIAKAAICqAAIAAgoIgUAAIigAAAHkByIABAAQAMAAAIgJQAKgIAAgNQAAgMgKgJQgIgJgMAAIgBAAQgMABgJAIQgIAJAAAMQAAANAIAIQAJAJAMAAgAJSA2QgMABgJAIQgIAIAAANAI1BVQAAAMAIAIQAJAJAMAAIABAAQAEAAAEgBQAHgCAGgGQAJgIAAgNQAAgMgJgJQgGgGgHgCQgEgBgEAAIgBAAIgdAAAI1ByIAAgdIAAgBIAAgeAGVByIBPAAAHkA2IhPAAAGVByIAABvAI1DhIAAhvIAdAAAEfByIB2AAAF3DhIAeAAIAAAoAA7j+QgGAEgEAEQgFAEgEAEAAZhKIAAgyAgOgsIAAgeIAnAAIAAAeIgnAAIg8AAAhKhKIA8AAAgOh8Ig8AAAoMgsIAAgeApIhKIAAAeAoMh8Ig8AAAoUDhIANg1QAIgeAYgTQAYgTAfAAIB2AAQAlAAAbAbQAaAaAAAmIAAAeIAAAoID5AAIAiAAIAGgXIAPg8QAHgeAZgTQAXgTAgAAIASAAApSD/IgKAAIAAjTIAUAAApIAEIA8AAApSD/IAAAKIA3AAIAKgoIgDAAIg+AAgAAZAEIAAAoIAAC1IAAAoAgOAEIAnAAIAAgwAgOAsIAAgoAA7EJIAGAAIAAgKAhKAEIA8AAAAZDhIj5AAAoMAsIHCAAAAZjMIEkAA");
    this.shape.setTransform(62.5, 49.7);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#39507F").s().p("AgMBUIgeioIA3AAIAeCnIAAACg");
    this.shape_1.setTransform(101.7, 38.7);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#253453").s().p("AitBZQgNABgJgJQgJgJABgMIAAhiQgBgNAJgJQAJgJANAAICbAAQANAAAHAJQAIAJABANIgMBlQgBALgJAIQgIAHgLAAgAAqBJIgDgFQgCgEAAgEIAAgDIAPiAQABgEABgDIAFgFQAFgGAIAAIAPAAIAfCoIg9ABQgIAAgHgHgACQhZIA8AAIgSCXQAAAHgHAFIgEAEg");
    this.shape_2.setTransform(88.5, 39.2);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#C1C1C1").s().p("AhOATIgLAAIAAglICeAAIAUAAIAAAlg");
    this.shape_3.setTransform(112, 74.2);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#D8222D").s().p("AgZD1IAAhvIBOAAIAAAAQANAAAIgJQAJgIAAgNQAAgMgJgJQgIgIgNAAIAAAAIhOAAIAAgUQAAgNAJgJQAIgIALgBIhpAAIgDAAQgNgBgHgKQgIgJABgLIABgIIAEAFQAGAHAJAAIA9gBIA2ABIAAgCIAFgEQAGgFABgHIASiZIg6AAIg5AAIgPAAQgIAAgFAGIgFAFIACgUIA7AAIBaAAIgUCwQgBALAIAJQAHAKANABIADAAIA5AAQANAAAIAJQAJAJAAANIAAAUIAAAdIAAABIAAAdIAABvgAAGDFQgDAEAAADQAAAFADACQADADAEAAIBQAAQAEAAADgDQADgCAAgFQAAgDgDgEQgDgDgEAAIhQAAQgEAAgDADgAAGCnQgDAEAAAEQAAADADAEQADACAEABIBQAAQAEgBADgCQADgEAAgDQAAgEgDgEQgDgCgEAAIhQAAQgEAAgDACgAAuAYIgrAAgAAki3IhaAAQAMgBAIgIQAJgJAAgMQAAgNgJgJQgIgIgMgBIB1AAQANAAAIAJQAJAJAAANQAAAMgJAJQgIAJgNAAgAAki3g");
    this.shape_4.setTransform(105.6, 47.7);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#182338").s().p("An9BUIAAgTIAKAAIAAAJIA3AAIAKgnIgDAAIAOgyQAHgeAYgUQAZgTAeAAIB2AAQAlAAAbAbQAaAaAAAjIAAAfIAAAnID4AAIAjAAIAGAAIAAgJIAAgMIAOg7QAIgdAZgTQAYgUAeAAIATAAIBmAAQAkACAZAZQAbAagBAjIAAAVIgJAAIAAAnIAnAAIALAAIAAAKg");
    this.shape_5.setTransform(53, 68.7);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FF3945").s().p("ABAEIIAGgVIAAAMIAAAJgABAEIIgiAAIAAgnIj4AAID4AAIAAAnIj4AAIAAgnIAAgfQAAglgbgaQgagbglAAIh2AAQgfAAgYATQgZAUgHAeIgNA0IACAAIgKAnIg2AAIAAgJIgKAAIAAjSIAUAAIA8AAIHCAAIA8AAIAmAAIAAC0IAAi0IAAgpIAAgvIAAgfIAAgxIAAhHIABgJIEjAAIgCAUQgCADgBAEIgPCCIAAADQAAAEACAEIgBAIQgCANAIAJQAIAIAMABIADAAIBrAAQgMABgJAIQgIAJAAANIAAAUIBPAAQgMAAgJAIQgIAJAAAMQAAANAIAIQAJAJAMAAIhPAAIh2AAIhmAAQAEgZAUgRQATgRAbAAICWAAIiWAAQgbAAgTARQgUARgEAZIgSAAQgfAAgYAUQgZATgHAdIgPA9IgGAVgApMD/IAAgeIA+AAIg+AAgABEilQgIAJAAANIAABkQAAAMAIAIQAJAKANgBICPAAQALAAAJgHQAIgIACgLIANhnQAAgNgJgJQgJgJgMAAIicAAQgNAAgJAJgAF8DhIAAgVQAAglgbgaQgZgZgkgCIB2AAIAABvgAAeDhgAHCDCQgEAAgDgDQgDgCAAgFQAAgDADgEQADgDAEAAIBQAAQAEAAADADQADAEAAADQAAAFgDACQgDADgEAAgAHCClQgEgBgDgCQgDgEAAgDQAAgEADgEQADgCAEAAIBQAAQAEAAADACQADAEAAAEQAAADgDAEQgDACgEABgAI6ByIAAgdQAAANAIAHQAJAJAMAAgAEkBygAI6A3IAdAAQgMAAgJAIQgIAJAAAMgAFCjLIkjAAIgBAAIACgHIAAgBIANgbIAJgIIAKgIIAigKIABAAIABAAIEZAAQAMABAIAIQAJAJAAANQAAAMgJAJQgIAIgMABgAAyjzQAGgGAIgFIgKAIIgJAIIAFgFg");
    this.shape_6.setTransform(62, 49.7);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("AFtDWIAAgnIAJAAIAeAAIAAAngAJSBAQgNAAgIgJQgIgHgBgNIAAgBQABgMAIgJQAIgIANAAIABAAIAIABQAHACAGAFQAJAJAAAMQAAANgJAIQgGAHgHABIgIABgAHkBAQgMAAgJgJQgIgIAAgNQAAgMAIgJQAJgIAMAAIAAAAQANAAAJAIQAIAJABAMQgBANgIAIQgJAJgNAAgAhKgDIAAgpInCAAIg8AAIgoAAIAAgxIAoAAIA8AAIHCAAIAAgfIA9AAIg9AAInCAAIg8AAIA8AAIAAAfIg8AAIAAgfIgoAAIAAgxIAoAAIAAgpIA8AAIAAApIg8AAIA8AAIHCAAIAAgpIA9AAIAAApIg9AAIA9AAIAlAAIAAAxIglAAIAAAfIg9AAIA9AAIAlAAIAAAxIglAAIg9AAIA9AAIAAApgApIgDIAAgpIA8AAIAAApgAoMh8g");
    this.shape_7.setTransform(62.5, 54.7);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 4
    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("rgba(255,255,255,0.247)").s().p("AgQBfQgHgHAAgLIAAiyQAAAJAHAHQAHAHAJAAQAKAAAHgHQAHgHABgJIAACyQAAALgIAHQgHAHgKAAQgJAAgHgHg");
    this.shape_8.setTransform(7.9, 25.3);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("AgQAfQgHgHAAgKIAAgaQAAgLAHgHQAHgHAJgBQAKABAHAHQAIAHAAALIAAAaQAAAKgIAHQgHAIgKAAQgJAAgHgIg");
    this.shape_9.setTransform(7.9, 13.5);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AEWEfIABAAQAaAAARgRQASgSAAgZIAAmiQAAgYgSgSQgRgSgaAAIgBAAQgYABgRARQgSARAAAZIAAGiQAAAZASASQARARAYAAgAgFj7IgCAAIAAgjIC3AAIAAAjIi1AAIkSAAQgZAAgRASQgSARAAAZIAAGiQAAAZASASQARARAZAAIItAAAEWj7IhmAA");
    this.shape_10.setTransform(35.4, 28.8);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.lf(["rgba(164,164,164,0.118)", "rgba(165,165,165,0.431)"], [0, 1], -30.1, -19.6, -30.1, -19.6).s().p("Aj4EOQgZAAgRgSQgSgRAAgZIAAmiQAAgZASgSQARgRAZAAIEQAAIC3gBIBmABQgYAAgRARQgSASAAAZIAAGiQAAAZASARQARARAYABg");
    this.shape_11.setTransform(32.3, 30.5);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.lf(["rgba(62,62,62,0.345)", "rgba(103,103,103,0.216)"], [0, 1], 4.3, -3.4, -3.8, 5.8).s().p("AAAENQgYAAgRgRQgRgRAAgZIAAmjQAAgZARgRQARgRAYgBIAAAAQAYABASARQARASAAAYIAAGjQAAAZgRARQgSARgYAAg");
    this.shape_12.setTransform(63.4, 30.6);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#D6D6D6").s().p("AhbARIAAghIC3AAIAAAhIi1AAg");
    this.shape_13.setTransform(43.8, 1.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, -1, 127, 78.2);


  (lib.car_wheelBack = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#182338").s().p("AhGBHQgcgeAAgpQAAgoAcgdQAegeAoABQApgBAdAeQAeAegBAnQABApgeAeQgdAcgpAAQgoAAgegcg");

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-10, -10, 20, 20);


  (lib.car_wheel = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAAhtQAtAAAgAhQAhAgAAAsQAAAtghAhQggAggtAAQgsAAghggQggggAAguQAAgsAgggQAhghAsAAg");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AgiAjQgPgPAAgUQAAgTAPgPQAOgPAUAAQAUAAAPAPQAPAPAAATQAAAUgPAPQgPAPgUAAQgUAAgOgPg");

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#55627E").s().p("AhNBOQgfghAAgtQAAgsAfggQAhghAsABQAtgBAgAhQAhAggBAsQABAtghAhQggAfgtAAQgsAAghgfgAgigiQgPAPAAATQAAAUAPAPQAOAPAUAAQAUAAAPgPQAPgPAAgUQAAgTgPgPQgPgPgUAAQgUAAgOAPg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-12, -12, 24, 24);


  (lib.car_bumper = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("AgIAUQgJgBgGgGQgFgFAAgIQAAgHAFgFQAGgHAJAAIARAAQAJAAAGAHQAGAFgBAHQABAIgGAFQgGAGgJABg");
    this.shape.setTransform(-13.6, -6.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("rgba(255,255,255,0.247)").s().p("AhPATQgHAAgGgFQgHgGAAgIQAAgGAHgGQAGgHAHAAICfAAQAIAAAGAHQAGAFgBAHQABAIgGAGQgGAFgIAAg");
    this.shape_1.setTransform(-6.6, -6.5);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AC/BfIAqAAIgMh9QgCgbgUgSQgUgTgbAAIkaAAQgZAAgTAPQgTAQgFAXIghCHIB5AAIAKgkQAIgcAYgSQAYgRAeAAIBtAAQAeAAAYARQAXASAJAcg");
    this.shape_2.setTransform(-0.1, 0);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FF3945").s().p("AC+BfIgKgkQgIgcgYgTQgYgQgeAAIhtAAQgdAAgZAQQgYATgIAcIgKAkIh5AAIAhiHQAGgXASgQQAUgPAYAAIEaAAQAbABAUASQAUASADAbIAMB9g");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-24.5, -10.5, 49, 21);


  (lib.box_progress = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(100));

    // Layer 3 copy (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AjbAaIAAgzIG3AAIAAAzg");

    // Layer 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FEE4A0").s().p("Ah1AZIAAgxIDsAAIAAAxg");
    this.shape.setTransform(-22.6, 0, 0.042, 1.047);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FEE4A0").s().p("AgGAaIAAgzIANAAIAAAzg");
    this.shape_1.setTransform(-22.4, 0);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FEE4A0").s().p("AgIAaIAAgzIARAAIAAAzg");
    this.shape_2.setTransform(-22.2, 0);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FEE4A0").s().p("AgKAaIAAgzIAVAAIAAAzg");
    this.shape_3.setTransform(-21.9, 0);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FEE4A0").s().p("AgMAaIAAgzIAZAAIAAAzg");
    this.shape_4.setTransform(-21.7, 0);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FEE4A0").s().p("AgPAaIAAgzIAfAAIAAAzg");
    this.shape_5.setTransform(-21.5, 0);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FEE4A0").s().p("AgRAaIAAgzIAjAAIAAAzg");
    this.shape_6.setTransform(-21.3, 0);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FEE4A0").s().p("AgTAaIAAgzIAnAAIAAAzg");
    this.shape_7.setTransform(-21, 0);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FEE4A0").s().p("AgVAaIAAgzIArAAIAAAzg");
    this.shape_8.setTransform(-20.8, 0);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FEE4A0").s().p("AgXAaIAAgzIAvAAIAAAzg");
    this.shape_9.setTransform(-20.6, 0);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FEE4A0").s().p("AgZAaIAAgzIA0AAIAAAzg");
    this.shape_10.setTransform(-20.3, 0);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FEE4A0").s().p("AgcAaIAAgzIA5AAIAAAzg");
    this.shape_11.setTransform(-20.1, 0);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FEE4A0").s().p("AgeAaIAAgzIA9AAIAAAzg");
    this.shape_12.setTransform(-19.9, 0);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FEE4A0").s().p("AggAaIAAgzIBBAAIAAAzg");
    this.shape_13.setTransform(-19.6, 0);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FEE4A0").s().p("AgiAaIAAgzIBFAAIAAAzg");
    this.shape_14.setTransform(-19.4, 0);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FEE4A0").s().p("AglAaIAAgzIBLAAIAAAzg");
    this.shape_15.setTransform(-19.2, 0);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FEE4A0").s().p("AgnAaIAAgzIBPAAIAAAzg");
    this.shape_16.setTransform(-19, 0);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FEE4A0").s().p("AgpAaIAAgzIBTAAIAAAzg");
    this.shape_17.setTransform(-18.7, 0);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#FEE4A0").s().p("AgrAaIAAgzIBXAAIAAAzg");
    this.shape_18.setTransform(-18.5, 0);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FEE4A0").s().p("AgtAaIAAgzIBbAAIAAAzg");
    this.shape_19.setTransform(-18.3, 0);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#FEE4A0").s().p("AgwAaIAAgzIBhAAIAAAzg");
    this.shape_20.setTransform(-18, 0);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FEE4A0").s().p("AgyAaIAAgzIBlAAIAAAzg");
    this.shape_21.setTransform(-17.8, 0);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FEE4A0").s().p("Ag0AaIAAgzIBpAAIAAAzg");
    this.shape_22.setTransform(-17.6, 0);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FEE4A0").s().p("Ag2AaIAAgzIBtAAIAAAzg");
    this.shape_23.setTransform(-17.3, 0);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#FEE4A0").s().p("Ag4AaIAAgzIBxAAIAAAzg");
    this.shape_24.setTransform(-17.1, 0);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FEE4A0").s().p("Ag6AaIAAgzIB2AAIAAAzg");
    this.shape_25.setTransform(-16.9, 0);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FEE4A0").s().p("Ag9AaIAAgzIB7AAIAAAzg");
    this.shape_26.setTransform(-16.7, 0);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FEE4A0").s().p("Ag/AaIAAgzIB/AAIAAAzg");
    this.shape_27.setTransform(-16.4, 0);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FEE4A0").s().p("AhBAaIAAgzICDAAIAAAzg");
    this.shape_28.setTransform(-16.2, 0);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#FEE4A0").s().p("AhDAaIAAgzICHAAIAAAzg");
    this.shape_29.setTransform(-16, 0);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FEE4A0").s().p("AhGAaIAAgzICNAAIAAAzg");
    this.shape_30.setTransform(-15.7, 0);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#FEE4A0").s().p("AhIAaIAAgzICRAAIAAAzg");
    this.shape_31.setTransform(-15.5, 0);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#FEE4A0").s().p("AhKAaIAAgzICVAAIAAAzg");
    this.shape_32.setTransform(-15.3, 0);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FEE4A0").s().p("AhMAaIAAgzICZAAIAAAzg");
    this.shape_33.setTransform(-15, 0);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FEE4A0").s().p("AhOAaIAAgzICdAAIAAAzg");
    this.shape_34.setTransform(-14.8, 0);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#FEE4A0").s().p("AhQAaIAAgzICiAAIAAAzg");
    this.shape_35.setTransform(-14.6, 0);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FEE4A0").s().p("AhTAaIAAgzICnAAIAAAzg");
    this.shape_36.setTransform(-14.4, 0);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f("#FEE4A0").s().p("AhVAaIAAgzICrAAIAAAzg");
    this.shape_37.setTransform(-14.1, 0);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FEE4A0").s().p("AhXAaIAAgzICvAAIAAAzg");
    this.shape_38.setTransform(-13.9, 0);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#FEE4A0").s().p("AhZAaIAAgzICzAAIAAAzg");
    this.shape_39.setTransform(-13.7, 0);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FEE4A0").s().p("AhcAaIAAgzIC5AAIAAAzg");
    this.shape_40.setTransform(-13.4, 0);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f("#FEE4A0").s().p("AheAaIAAgzIC9AAIAAAzg");
    this.shape_41.setTransform(-13.2, 0);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FEE4A0").s().p("AhgAaIAAgzIDBAAIAAAzg");
    this.shape_42.setTransform(-13, 0);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f("#FEE4A0").s().p("AhiAaIAAgzIDFAAIAAAzg");
    this.shape_43.setTransform(-12.7, 0);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FEE4A0").s().p("AhkAaIAAgzIDJAAIAAAzg");
    this.shape_44.setTransform(-12.5, 0);

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f("#FEE4A0").s().p("AhmAaIAAgzIDOAAIAAAzg");
    this.shape_45.setTransform(-12.3, 0);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FEE4A0").s().p("AhpAaIAAgzIDTAAIAAAzg");
    this.shape_46.setTransform(-12.1, 0);

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#FEE4A0").s().p("AhrAaIAAgzIDXAAIAAAzg");
    this.shape_47.setTransform(-11.8, 0);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FEE4A0").s().p("AhtAaIAAgzIDbAAIAAAzg");
    this.shape_48.setTransform(-11.6, 0);

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#FEE4A0").s().p("AhvAaIAAgzIDfAAIAAAzg");
    this.shape_49.setTransform(-11.4, 0);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#FEE4A0").s().p("AhxAaIAAgzIDjAAIAAAzg");
    this.shape_50.setTransform(-11.2, 0);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f("#FEE4A0").s().p("Ah0AaIAAgzIDoAAIAAAzg");
    this.shape_51.setTransform(-10.9, 0);

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#FEE4A0").s().p("Ah1AaIAAgzIDrAAIAAAzg");
    this.shape_52.setTransform(-10.7, 0);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f("#FEE4A0").s().p("Ah4AaIAAgzIDxAAIAAAzg");
    this.shape_53.setTransform(-10.5, 0);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FEE4A0").s().p("Ah6AaIAAgzID1AAIAAAzg");
    this.shape_54.setTransform(-10.2, 0);

    this.shape_55 = new cjs.Shape();
    this.shape_55.graphics.f("#FEE4A0").s().p("Ah8AaIAAgzID5AAIAAAzg");
    this.shape_55.setTransform(-10, 0);

    this.shape_56 = new cjs.Shape();
    this.shape_56.graphics.f("#FEE4A0").s().p("Ah+AaIAAgzID9AAIAAAzg");
    this.shape_56.setTransform(-9.8, 0);

    this.shape_57 = new cjs.Shape();
    this.shape_57.graphics.f("#FEE4A0").s().p("AiBAaIAAgzIECAAIAAAzg");
    this.shape_57.setTransform(-9.5, 0);

    this.shape_58 = new cjs.Shape();
    this.shape_58.graphics.f("#FEE4A0").s().p("AiDAaIAAgzIEHAAIAAAzg");
    this.shape_58.setTransform(-9.3, 0);

    this.shape_59 = new cjs.Shape();
    this.shape_59.graphics.f("#FEE4A0").s().p("AiFAaIAAgzIELAAIAAAzg");
    this.shape_59.setTransform(-9.1, 0);

    this.shape_60 = new cjs.Shape();
    this.shape_60.graphics.f("#FEE4A0").s().p("AiHAaIAAgzIEPAAIAAAzg");
    this.shape_60.setTransform(-8.9, 0);

    this.shape_61 = new cjs.Shape();
    this.shape_61.graphics.f("#FEE4A0").s().p("AiKAaIAAgzIEUAAIAAAzg");
    this.shape_61.setTransform(-8.6, 0);

    this.shape_62 = new cjs.Shape();
    this.shape_62.graphics.f("#FEE4A0").s().p("AiMAaIAAgzIEYAAIAAAzg");
    this.shape_62.setTransform(-8.4, 0);

    this.shape_63 = new cjs.Shape();
    this.shape_63.graphics.f("#FEE4A0").s().p("AiOAaIAAgzIEdAAIAAAzg");
    this.shape_63.setTransform(-8.2, 0);

    this.shape_64 = new cjs.Shape();
    this.shape_64.graphics.f("#FEE4A0").s().p("AiQAaIAAgzIEhAAIAAAzg");
    this.shape_64.setTransform(-7.9, 0);

    this.shape_65 = new cjs.Shape();
    this.shape_65.graphics.f("#FEE4A0").s().p("AiSAaIAAgzIElAAIAAAzg");
    this.shape_65.setTransform(-7.7, 0);

    this.shape_66 = new cjs.Shape();
    this.shape_66.graphics.f("#FEE4A0").s().p("AiVAaIAAgzIEqAAIAAAzg");
    this.shape_66.setTransform(-7.5, 0);

    this.shape_67 = new cjs.Shape();
    this.shape_67.graphics.f("#FEE4A0").s().p("AiWAaIAAgzIEtAAIAAAzg");
    this.shape_67.setTransform(-7.2, 0);

    this.shape_68 = new cjs.Shape();
    this.shape_68.graphics.f("#FEE4A0").s().p("AiZAaIAAgzIEzAAIAAAzg");
    this.shape_68.setTransform(-7, 0);

    this.shape_69 = new cjs.Shape();
    this.shape_69.graphics.f("#FEE4A0").s().p("AibAaIAAgzIE3AAIAAAzg");
    this.shape_69.setTransform(-6.8, 0);

    this.shape_70 = new cjs.Shape();
    this.shape_70.graphics.f("#FEE4A0").s().p("AidAaIAAgzIE7AAIAAAzg");
    this.shape_70.setTransform(-6.6, 0);

    this.shape_71 = new cjs.Shape();
    this.shape_71.graphics.f("#FEE4A0").s().p("AifAaIAAgzIE/AAIAAAzg");
    this.shape_71.setTransform(-6.3, 0);

    this.shape_72 = new cjs.Shape();
    this.shape_72.graphics.f("#FEE4A0").s().p("AiiAaIAAgzIFEAAIAAAzg");
    this.shape_72.setTransform(-6.1, 0);

    this.shape_73 = new cjs.Shape();
    this.shape_73.graphics.f("#FEE4A0").s().p("AikAaIAAgzIFJAAIAAAzg");
    this.shape_73.setTransform(-5.9, 0);

    this.shape_74 = new cjs.Shape();
    this.shape_74.graphics.f("#FEE4A0").s().p("AimAaIAAgzIFNAAIAAAzg");
    this.shape_74.setTransform(-5.6, 0);

    this.shape_75 = new cjs.Shape();
    this.shape_75.graphics.f("#FEE4A0").s().p("AioAaIAAgzIFRAAIAAAzg");
    this.shape_75.setTransform(-5.4, 0);

    this.shape_76 = new cjs.Shape();
    this.shape_76.graphics.f("#FEE4A0").s().p("AirAaIAAgzIFWAAIAAAzg");
    this.shape_76.setTransform(-5.2, 0);

    this.shape_77 = new cjs.Shape();
    this.shape_77.graphics.f("#FEE4A0").s().p("AisAaIAAgzIFZAAIAAAzg");
    this.shape_77.setTransform(-4.9, 0);

    this.shape_78 = new cjs.Shape();
    this.shape_78.graphics.f("#FEE4A0").s().p("AivAaIAAgzIFfAAIAAAzg");
    this.shape_78.setTransform(-4.7, 0);

    this.shape_79 = new cjs.Shape();
    this.shape_79.graphics.f("#FEE4A0").s().p("AixAaIAAgzIFjAAIAAAzg");
    this.shape_79.setTransform(-4.5, 0);

    this.shape_80 = new cjs.Shape();
    this.shape_80.graphics.f("#FEE4A0").s().p("AizAaIAAgzIFnAAIAAAzg");
    this.shape_80.setTransform(-4.3, 0);

    this.shape_81 = new cjs.Shape();
    this.shape_81.graphics.f("#FEE4A0").s().p("Ai1AaIAAgzIFrAAIAAAzg");
    this.shape_81.setTransform(-4, 0);

    this.shape_82 = new cjs.Shape();
    this.shape_82.graphics.f("#FEE4A0").s().p("Ai4AaIAAgzIFwAAIAAAzg");
    this.shape_82.setTransform(-3.8, 0);

    this.shape_83 = new cjs.Shape();
    this.shape_83.graphics.f("#FEE4A0").s().p("Ai6AaIAAgzIF1AAIAAAzg");
    this.shape_83.setTransform(-3.6, 0);

    this.shape_84 = new cjs.Shape();
    this.shape_84.graphics.f("#FEE4A0").s().p("Ai8AaIAAgzIF5AAIAAAzg");
    this.shape_84.setTransform(-3.3, 0);

    this.shape_85 = new cjs.Shape();
    this.shape_85.graphics.f("#FEE4A0").s().p("Ai+AaIAAgzIF9AAIAAAzg");
    this.shape_85.setTransform(-3.1, 0);

    this.shape_86 = new cjs.Shape();
    this.shape_86.graphics.f("#FEE4A0").s().p("AjBAaIAAgzIGCAAIAAAzg");
    this.shape_86.setTransform(-2.9, 0);

    this.shape_87 = new cjs.Shape();
    this.shape_87.graphics.f("#FEE4A0").s().p("AjCAaIAAgzIGFAAIAAAzg");
    this.shape_87.setTransform(-2.6, 0);

    this.shape_88 = new cjs.Shape();
    this.shape_88.graphics.f("#FEE4A0").s().p("AjFAaIAAgzIGLAAIAAAzg");
    this.shape_88.setTransform(-2.4, 0);

    this.shape_89 = new cjs.Shape();
    this.shape_89.graphics.f("#FEE4A0").s().p("AjHAaIAAgzIGPAAIAAAzg");
    this.shape_89.setTransform(-2.2, 0);

    this.shape_90 = new cjs.Shape();
    this.shape_90.graphics.f("#FEE4A0").s().p("AjJAaIAAgzIGTAAIAAAzg");
    this.shape_90.setTransform(-2, 0);

    this.shape_91 = new cjs.Shape();
    this.shape_91.graphics.f("#FEE4A0").s().p("AjLAaIAAgzIGXAAIAAAzg");
    this.shape_91.setTransform(-1.7, 0);

    this.shape_92 = new cjs.Shape();
    this.shape_92.graphics.f("#FEE4A0").s().p("AjOAaIAAgzIGcAAIAAAzg");
    this.shape_92.setTransform(-1.5, 0);

    this.shape_93 = new cjs.Shape();
    this.shape_93.graphics.f("#FEE4A0").s().p("AjQAaIAAgzIGhAAIAAAzg");
    this.shape_93.setTransform(-1.3, 0);

    this.shape_94 = new cjs.Shape();
    this.shape_94.graphics.f("#FEE4A0").s().p("AjSAaIAAgzIGlAAIAAAzg");
    this.shape_94.setTransform(-1, 0);

    this.shape_95 = new cjs.Shape();
    this.shape_95.graphics.f("#FEE4A0").s().p("AjUAaIAAgzIGpAAIAAAzg");
    this.shape_95.setTransform(-0.8, 0);

    this.shape_96 = new cjs.Shape();
    this.shape_96.graphics.f("#FEE4A0").s().p("AjXAaIAAgzIGuAAIAAAzg");
    this.shape_96.setTransform(-0.6, 0);

    this.shape_97 = new cjs.Shape();
    this.shape_97.graphics.f("#FEE4A0").s().p("AjYAaIAAgzIGxAAIAAAzg");
    this.shape_97.setTransform(-0.3, 0);

    this.shape_98 = new cjs.Shape();
    this.shape_98.graphics.f("#FEE4A0").s().p("AjbAaIAAgzIG3AAIAAAzg");
    this.shape_98.setTransform(-0.1, 0);

    this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = this.shape_10.mask = this.shape_11.mask = this.shape_12.mask = this.shape_13.mask = this.shape_14.mask = this.shape_15.mask = this.shape_16.mask = this.shape_17.mask = this.shape_18.mask = this.shape_19.mask = this.shape_20.mask = this.shape_21.mask = this.shape_22.mask = this.shape_23.mask = this.shape_24.mask = this.shape_25.mask = this.shape_26.mask = this.shape_27.mask = this.shape_28.mask = this.shape_29.mask = this.shape_30.mask = this.shape_31.mask = this.shape_32.mask = this.shape_33.mask = this.shape_34.mask = this.shape_35.mask = this.shape_36.mask = this.shape_37.mask = this.shape_38.mask = this.shape_39.mask = this.shape_40.mask = this.shape_41.mask = this.shape_42.mask = this.shape_43.mask = this.shape_44.mask = this.shape_45.mask = this.shape_46.mask = this.shape_47.mask = this.shape_48.mask = this.shape_49.mask = this.shape_50.mask = this.shape_51.mask = this.shape_52.mask = this.shape_53.mask = this.shape_54.mask = this.shape_55.mask = this.shape_56.mask = this.shape_57.mask = this.shape_58.mask = this.shape_59.mask = this.shape_60.mask = this.shape_61.mask = this.shape_62.mask = this.shape_63.mask = this.shape_64.mask = this.shape_65.mask = this.shape_66.mask = this.shape_67.mask = this.shape_68.mask = this.shape_69.mask = this.shape_70.mask = this.shape_71.mask = this.shape_72.mask = this.shape_73.mask = this.shape_74.mask = this.shape_75.mask = this.shape_76.mask = this.shape_77.mask = this.shape_78.mask = this.shape_79.mask = this.shape_80.mask = this.shape_81.mask = this.shape_82.mask = this.shape_83.mask = this.shape_84.mask = this.shape_85.mask = this.shape_86.mask = this.shape_87.mask = this.shape_88.mask = this.shape_89.mask = this.shape_90.mask = this.shape_91.mask = this.shape_92.mask = this.shape_93.mask = this.shape_94.mask = this.shape_95.mask = this.shape_96.mask = this.shape_97.mask = this.shape_98.mask = mask;

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape,
        p: {
          scaleX: 0.042,
          x: -22.6
        }
      }]
    }).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_17
      }]
    }, 1).to({
      state: [{
        t: this.shape_18
      }]
    }, 1).to({
      state: [{
        t: this.shape_19
      }]
    }, 1).to({
      state: [{
        t: this.shape_20
      }]
    }, 1).to({
      state: [{
        t: this.shape_21
      }]
    }, 1).to({
      state: [{
        t: this.shape_22
      }]
    }, 1).to({
      state: [{
        t: this.shape_23
      }]
    }, 1).to({
      state: [{
        t: this.shape_24
      }]
    }, 1).to({
      state: [{
        t: this.shape_25
      }]
    }, 1).to({
      state: [{
        t: this.shape_26
      }]
    }, 1).to({
      state: [{
        t: this.shape_27
      }]
    }, 1).to({
      state: [{
        t: this.shape_28
      }]
    }, 1).to({
      state: [{
        t: this.shape_29
      }]
    }, 1).to({
      state: [{
        t: this.shape_30
      }]
    }, 1).to({
      state: [{
        t: this.shape_31
      }]
    }, 1).to({
      state: [{
        t: this.shape_32
      }]
    }, 1).to({
      state: [{
        t: this.shape_33
      }]
    }, 1).to({
      state: [{
        t: this.shape_34
      }]
    }, 1).to({
      state: [{
        t: this.shape_35
      }]
    }, 1).to({
      state: [{
        t: this.shape_36
      }]
    }, 1).to({
      state: [{
        t: this.shape_37
      }]
    }, 1).to({
      state: [{
        t: this.shape_38
      }]
    }, 1).to({
      state: [{
        t: this.shape_39
      }]
    }, 1).to({
      state: [{
        t: this.shape_40
      }]
    }, 1).to({
      state: [{
        t: this.shape_41
      }]
    }, 1).to({
      state: [{
        t: this.shape_42
      }]
    }, 1).to({
      state: [{
        t: this.shape_43
      }]
    }, 1).to({
      state: [{
        t: this.shape_44
      }]
    }, 1).to({
      state: [{
        t: this.shape_45
      }]
    }, 1).to({
      state: [{
        t: this.shape_46
      }]
    }, 1).to({
      state: [{
        t: this.shape_47
      }]
    }, 1).to({
      state: [{
        t: this.shape_48
      }]
    }, 1).to({
      state: [{
        t: this.shape_49
      }]
    }, 1).to({
      state: [{
        t: this.shape_50
      }]
    }, 1).to({
      state: [{
        t: this.shape_51
      }]
    }, 1).to({
      state: [{
        t: this.shape_52
      }]
    }, 1).to({
      state: [{
        t: this.shape_53
      }]
    }, 1).to({
      state: [{
        t: this.shape_54
      }]
    }, 1).to({
      state: [{
        t: this.shape_55
      }]
    }, 1).to({
      state: [{
        t: this.shape_56
      }]
    }, 1).to({
      state: [{
        t: this.shape_57
      }]
    }, 1).to({
      state: [{
        t: this.shape_58
      }]
    }, 1).to({
      state: [{
        t: this.shape_59
      }]
    }, 1).to({
      state: [{
        t: this.shape_60
      }]
    }, 1).to({
      state: [{
        t: this.shape_61
      }]
    }, 1).to({
      state: [{
        t: this.shape_62
      }]
    }, 1).to({
      state: [{
        t: this.shape_63
      }]
    }, 1).to({
      state: [{
        t: this.shape_64
      }]
    }, 1).to({
      state: [{
        t: this.shape_65
      }]
    }, 1).to({
      state: [{
        t: this.shape_66
      }]
    }, 1).to({
      state: [{
        t: this.shape_67
      }]
    }, 1).to({
      state: [{
        t: this.shape_68
      }]
    }, 1).to({
      state: [{
        t: this.shape_69
      }]
    }, 1).to({
      state: [{
        t: this.shape_70
      }]
    }, 1).to({
      state: [{
        t: this.shape_71
      }]
    }, 1).to({
      state: [{
        t: this.shape_72
      }]
    }, 1).to({
      state: [{
        t: this.shape_73
      }]
    }, 1).to({
      state: [{
        t: this.shape_74
      }]
    }, 1).to({
      state: [{
        t: this.shape_75
      }]
    }, 1).to({
      state: [{
        t: this.shape_76
      }]
    }, 1).to({
      state: [{
        t: this.shape_77
      }]
    }, 1).to({
      state: [{
        t: this.shape_78
      }]
    }, 1).to({
      state: [{
        t: this.shape_79
      }]
    }, 1).to({
      state: [{
        t: this.shape_80
      }]
    }, 1).to({
      state: [{
        t: this.shape_81
      }]
    }, 1).to({
      state: [{
        t: this.shape_82
      }]
    }, 1).to({
      state: [{
        t: this.shape_83
      }]
    }, 1).to({
      state: [{
        t: this.shape_84
      }]
    }, 1).to({
      state: [{
        t: this.shape_85
      }]
    }, 1).to({
      state: [{
        t: this.shape_86
      }]
    }, 1).to({
      state: [{
        t: this.shape_87
      }]
    }, 1).to({
      state: [{
        t: this.shape_88
      }]
    }, 1).to({
      state: [{
        t: this.shape_89
      }]
    }, 1).to({
      state: [{
        t: this.shape_90
      }]
    }, 1).to({
      state: [{
        t: this.shape_91
      }]
    }, 1).to({
      state: [{
        t: this.shape_92
      }]
    }, 1).to({
      state: [{
        t: this.shape_93
      }]
    }, 1).to({
      state: [{
        t: this.shape_94
      }]
    }, 1).to({
      state: [{
        t: this.shape_95
      }]
    }, 1).to({
      state: [{
        t: this.shape_96
      }]
    }, 1).to({
      state: [{
        t: this.shape_97
      }]
    }, 1).to({
      state: [{
        t: this.shape_98
      }]
    }, 1).to({
      state: [{
        t: this.shape,
        p: {
          scaleX: 1.87,
          x: 0.1
        }
      }]
    }, 1).wait(1));

    // Layer 3
    this.shape_99 = new cjs.Shape();
    this.shape_99.graphics.f("#DE8324").s().p("AjRAlQgFAAgEgDQgDgEAAgFIAAgxQAAgFADgEQAEgDAFAAIGjAAQAFAAAEADQADAEAAAFIAAAxQAAAFgDAEQgEADgFAAgAjRAZIGjAAIAAgxImjAAg");
    this.shape_99.setTransform(0, 0, 1.047, 1.047);

    this.shape_100 = new cjs.Shape();
    this.shape_100.graphics.f("#8D4D10").s().p("AjRAZIAAgxIGjAAIAAAxg");
    this.shape_100.setTransform(0, 0, 1.047, 1.047);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_100
      }, {
        t: this.shape_99
      }]
    }).wait(100));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-23.3, -3.9, 46.6, 7.9);


  (lib.box_cap = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#F6BA4F").s().p("ABSCjQgHgCgDgFIitkuIAcgRICtEvQADAFgCAGQgBAHgGADQgDADgFAAIgEgBg");

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-10.2, -16.4, 20.5, 32.8);


  (lib.box_body = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // <Path>_6
    this.shape = new cjs.Shape();
    this.shape.graphics.f("rgba(207,119,29,0.427)").s().p("AlCAcQgLAAgHgIQgJgHAAgLIAAgdIK7AAIAAAdQAAALgIAHQgHAIgLAAg");
    this.shape.setTransform(0, 25.6, 1.047, 1.047);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 3
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FECF6E").s().p("AhMA2IAAhUIAAAAIAAgBIAagWIAZAWIABAAIAYgWIAZAWIABAAIAZgWIAaAWIAAAAIAABVg");
    this.shape_1.setTransform(0, 22.9, 1.047, 1.047);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

    // <Path>_5
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("rgba(254,207,110,0.576)").s().p("AldASIAAgNQAAgJAIgGQAGgIALAAIKKAAQAKABAHAGQAGAHABAHIAAAPg");
    this.shape_2.setTransform(0, -26.6, 1.047, 1.047);

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

    // Layer 5
    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#F6BA4F").s().p("AlFEQQgKAAgHgHQgGgGAAgKIAAnxQAAgKAGgGQAHgHAKAAIKLAAQAKAAAHAHQAGAHAAAJIAAHxQAAAKgGAGQgHAHgKAAg");
    this.shape_3.setTransform(0, 0, 1.047, 1.047);

    this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-36.7, -28.5, 73.4, 57.2);


  (lib.blackBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(-243, 0, 483, 175, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // grass copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#93CF56").s().p("AY7C0Mgx+AAAIAAjSIBvAAIAAg4QAAgHAGgGQAFgFAIAAQAIAAAFAFQAGAGAAAHIAAA4IGMAAQAAgfAXgWQAYgVAhAAQAfAAAXASQAKgaAXgXQArgrA+AAQA5AAAqAlIAGAGQArArAAA+IB8AAIAAg4QAAgHAGgGQAFgFAIAAQAHAAAGAFQAFAGAAAHIAAA4IAlAAIAAhdQAAgIAGgFQAFgFAIAAQAIAAAFAFQAGAFAAAIIAABdIAYAAIAAg4QAAgHAGgGQAFgFAIAAQAIAAAFAFQAFAGAAAHIAAA4IMWAAIAAgfQAAgIAGgFQAFgGAIABQAIgBAFAGQAGAFAAAIIAAAfIAdAAQAFgPAOgNIAHgFQAVgRAdABQAegBAXATQAIgUARgPQAXgXAfgGQAOgEAPAAQAwAAAjAhIAGAGQAUgOAbAAQAhAAAYAVQAXAWAAAfIAlAAIAAhdQAAgIAGgFQAFgFAIAAQAIAAAFAFQAGAFAAAIIAABdIAlAAIAAg4QAAgHAFgGQAFgFAIAAQAIAAAFAFQAGAGAAAHIAAA4IHdgBIAJAAIAADTg");
    this.shape.setTransform(-80.6, 143.4);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 10 copy
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#6CA038").s().p("AhWA3QAAgkAdgXQAdgZAnAAQAaAAAUAKIACgDQAlggAzAAQAzAAAlAgQAkAfAAAugAqQA3QAAg7grgsIgGgGIAMAAQA0AAAkAgQAkAfAAAugAI+AGQgcAAgWAQQAJgYAWgUQAkggAzAAQAkAAAcAQQgfAGgXAXQgRAOgIATQgXgSgeAAg");
    this.shape_1.setTransform(-78.8, 134.6);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

    // Layer 9 copy
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#6EA339").s().p("AY7AdMgx+AAAIAAg5MAx+AAAIAJAAIAAA5g");
    this.shape_2.setTransform(-80.6, 164.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

    // Layer 11 copy
    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("rgba(0,0,0,0.157)").s().p("AY3AdMgx2AAAIAAg6MAx2AAAIAJAAIAAA6g");
    this.shape_3.setTransform(-80, 170.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1));

    // trees
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#252525").s().p("AgOIbQAAhGAwgyQAygxBGgBIAIAAQAPAAAPAEQAbg4AqgtQAsgsA1gcIAAiUQgbgJgRgZQgSgWAAgeIAAiFQAAgnAcgbQAbgcAnAAQAnAAAbAcQAbAbAAAnIAACFQAAAhgUAYQgUAZgfAHIAAB6QAjgNAkgEIAAijQAAgZATgSQASgTAaAAQAaAAASATQASASAAAZIAACjQAWACAXAHIAAkkQgjgKgXgdQgWgeAAgmIAAigQAAguAgghQAhggAugBQAuABAhAgQAhAhAAAuIAACgQAAAYgLAVQgIAWgRAPIAABKQAAATgNANQgOANgSAAIgJAAIAADBQBEg7BTggQBWghBdAAIAbAAQDPAACSCSQCSCSAADPgALCh5IAABEIAKAAQAIAAAEgFQAGgEAAgIIAAg9QgOAIgOACgAkZIbIAAjHQgfgIgUgYQgVgaAAggIAAiPQAAgnAcgbQAbgbAnAAQAnAAAcAbQAaAbAAAnIAACPQAAAggTAaQgVAYgfAIIAADHgA4ZIbQAAhVA7g8QA9g8BVAAIBqAAQAmAAAiAOIAAi8QgcgLgRgXQgSgZAAgeIAAh7QAAgnAcgaQAbgcAnAAQAQAAAPAFIAAhsQAAg1AmgmQAmgmA1AAQA2AAAmAmQAmAmAAA1IAACyQAAApgXAeQgWAggkAPIAABuQBJgdBPAAIBQAAQBjAABYAuIAAirIgSAAQgSAAgNgLQgNgNAAgSIAAiNQgkgqAAg2IAAhzQAAg9AsgrQArgsA9AAQA9AAArAsQAqAqAAA+IAABzQAAA+gsAsIAAA8QAAASgNANQgNANgTAAIgRAAIAAEtQA+A6AjBNQAkBPAABZgAweBHQAAAggTAbQgVAYgfAIIAACSQA0hMBSgwIAAh+QgigCgdgRgAoigvQAAAHAGAFQAFAFAHABIAJAAIAAhrQgPgGgMgHgAmtiFIAAAjIAMAAQAHAAAFgFQAFgEAAgIIAAgeQgOAHgPAFg");
    this.shape_4.setTransform(-84.2, 103.2);

    this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1));

    // back
    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#191919").s().p("A5EM/IAA59MAyJAAAIAAZ9g");
    this.shape_5.setTransform(-79.5, 83.1);

    this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-242.6, 0, 596.3, 173.4);


  (lib.BlackSq = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.setBounds(0, 0, 10, 10);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 1 copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("rgba(0,0,0,0.498)").s().p("AgxAxIAAhiIBiAAIAABig");
    this.shape.setTransform(5, 5);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // Layer 1
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("rgba(0,0,0,0.498)").s().p("AgxAxIAAhiIBiAAIAABig");
    this.shape_1.setTransform(5, 5);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 10, 10);


  (lib.Background = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#4E9EED").s().p("EglfAlfMAAAhK+MBK+AAAMAAABK+g");
    this.shape.setTransform(240, 240);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#BA2121").s().p("EglfAlfMAAAhK+MBK+AAAMAAABK+g");
    this.shape_1.setTransform(240, 240);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#191919").s().p("EglfAlfMAAAhK+MBK+AAAMAAABK+g");
    this.shape_2.setTransform(240, 240);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape
      }]
    }).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0, 0, 480, 480);


  (lib.warehouse_fan = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "loop": 1
    });

    // timeline functions:
    this.frame_29 = function() {
      this.gotoAndPlay("loop");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).wait(29).call(this.frame_29).wait(1));

    // bg copy (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AgnAoQgRgRAAgXQAAgWARgRQARgRAWAAQAXAAARARQARARAAAWQAAAXgRARQgRARgXAAQgWAAgRgRg");

    // fan
    this.instance = new lib.fan_mc();
    this.instance.parent = this;

    this.instance.mask = mask;

    this.timeline.addTween(cjs.Tween.get(this.instance).to({
      rotation: 360
    }, 29).wait(1));

    // bg
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#363247").s().p("AhEBFQgdgcAAgpQAAgnAdgdQAdgdAnAAQAoAAAdAdQAdAdAAAnQAAApgdAcQgdAdgoAAQgnAAgdgdg");
    this.shape.setTransform(0, 0, 0.582, 0.582);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(30));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-5.7, -5.7, 11.5, 11.5);


  (lib.Conveyor = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      off: 0,
      on: 1
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_14 = function() {
      this.gotoAndPlay("on");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(14).call(this.frame_14).wait(1));

    // Layer 1 copy (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AjHAdQgKABgIgKQgHgIAAgLQAAgKAHgJQAIgLAKABIGPAAQAKgBAIALQAHAJAAAKQAAALgHAIQgIAKgKgBg");
    mask.setTransform(0, -0.1);

    // Layer 3 copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#727272").s().p("AECAFIgmgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAlABQABAAAAAAQABAAAAAAQABABAAAAQABAAAAABQAAAAABAAQAAABAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAQAAABAAAAQAAABgBAAQAAAAAAABIgEABIAAAAgAChAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgABlAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAApAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAgRAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAmAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAhNAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAiJAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAjFAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAkBAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAg");
    this.shape.setTransform(-6.1, 2.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#727272").s().p("AECAFIgmgBQAAAAAAAAQgBAAAAAAQgBgBAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAlABQABAAAAAAQABAAAAAAQABABAAAAQABAAAAABQAAAAABAAQAAABAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAQAAABAAAAQAAABgBAAQAAAAAAABIgEABIAAAAgAChAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgABlAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAApAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAgRAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAmAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAhNAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAiJAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAjFAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAkBAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBAAQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBABQAAAAgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAg");
    this.shape_1.setTransform(-0.1, 2.5);

    this.shape.mask = this.shape_1.mask = mask;

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape
      }]
    }).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          x: -0.1
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          x: 0.7
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          x: 1.6
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape
      }]
    }, 1).wait(1));
    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({
      x: -5.3
    }, 0).wait(1).to({
      x: -4.4
    }, 0).wait(1).to({
      x: -3.6
    }, 0).wait(1).to({
      x: -2.7
    }, 0).wait(1).to({
      x: -1.8
    }, 0).wait(1).to({
      x: -1
    }, 0).to({
      _off: true
    }, 1).wait(3).to({
      _off: false,
      x: 2.4
    }, 0).wait(1).to({
      x: 3.3
    }, 0).wait(1).to({
      x: 4.2
    }, 0).wait(1).to({
      x: 5
    }, 0).wait(1).to({
      x: 5.9
    }, 0).wait(1));

    // Layer 3
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#727272").s().p("AECAFIgmgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAlABQABAAAAAAQABAAAAAAQABABAAAAQABAAAAAAQAAABABAAQAAABAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAQAAABAAAAQAAABgBAAQAAAAAAABIgEABIAAAAgAChAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgABlAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAApAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAgRAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAmAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAhNAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAiJAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAjFAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAkBAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAg");
    this.shape_2.setTransform(5.9, -2.5);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#727272").s().p("AECAFIgmgBQAAAAAAAAQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAlABQABAAAAAAQABAAAAAAQABABAAAAQABAAAAAAQAAABABAAQAAABAAAAQAAAAAAAAQAAAAAAAAQAAABAAAAQAAABAAAAQAAABgBAAQAAAAAAABIgEABIAAAAgAChAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgABlAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAApAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAgRAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAmAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAhNAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAiJAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAjFAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAgAkBAEQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAABgBQAAAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAoAAQAAAAABAAQAAAAABAAQAAABAAAAQABAAAAAAQABABAAAAQAAABAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQAAAAgBAAQAAABgBAAQAAAAAAABQgBAAAAAAQgBAAAAAAg");
    this.shape_3.setTransform(3.4, -2.5);
    this.shape_3._off = true;

    this.shape_2.mask = this.shape_3.mask = mask;

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1).to({
      x: 5
    }, 0).wait(1).to({
      x: 4.2
    }, 0).to({
      _off: true
    }, 1).wait(3).to({
      _off: false,
      x: 0.9
    }, 0).wait(1).to({
      x: 0
    }, 0).wait(1).to({
      x: -0.8
    }, 0).wait(1).to({
      x: -1.6
    }, 0).to({
      _off: true
    }, 1).wait(3).to({
      _off: false,
      x: -5
    }, 0).wait(1).to({
      x: -5.8
    }, 0).wait(1));
    this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(3).to({
      _off: false
    }, 0).wait(1).to({
      x: 2.5
    }, 0).wait(1).to({
      x: 1.7
    }, 0).to({
      _off: true
    }, 1).wait(4).to({
      _off: false,
      x: -2.5
    }, 0).wait(1).to({
      x: -3.3
    }, 0).wait(1).to({
      x: -4.2
    }, 0).to({
      _off: true
    }, 1).wait(2));

    // Layer 4 copy
    this.instance = new lib.conveer_wheel();
    this.instance.parent = this;
    this.instance.setTransform(-19.7, 0, 1, 1, 30);

    this.timeline.addTween(cjs.Tween.get(this.instance).to({
      rotation: -330
    }, 14).wait(1));

    // Layer 4
    this.instance_1 = new lib.conveer_wheel();
    this.instance_1.parent = this;
    this.instance_1.setTransform(19.8, 0);

    this.timeline.addTween(cjs.Tween.get(this.instance_1).to({
      rotation: -360
    }, 14).wait(1));

    // Layer 1
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#727272").ss(0.8, 1, 1).p("ADZgRQABAAAAABQAIAHAAAJQAAAKgIAHQAAABgBAAAjZASQAAgBgBAAQgHgHAAgKQAAgJAHgHQABAAAAgB");

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#232323").s().p("AjHAZQgLgBgHgGIAAgBQgIgHABgKQgBgJAIgHIAAgBQAHgHALAAIGPAAQAKABAHAGIABABQAHAHAAAJQAAAKgHAHIgBABQgHAHgKAAg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_5
      }, {
        t: this.shape_4
      }]
    }).wait(15));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-23.6, -3.5, 47.2, 7);


  (lib.verticalChain_anim = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*this.snapToPixel = true;
      this.cache(-5, -505, 10, 810, 3);
      this.updateCache();
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 1
    this.instance = new lib.chainPart();
    this.instance.parent = this;
    this.instance.setTransform(0, 252.6);

    this.instance_1 = new lib.chainPart();
    this.instance_1.parent = this;
    this.instance_1.setTransform(0, 274.6);

    this.instance_2 = new lib.chainPart();
    this.instance_2.parent = this;
    this.instance_2.setTransform(0, 296.8);

    this.instance_3 = new lib.chainPart();
    this.instance_3.parent = this;
    this.instance_3.setTransform(0, 186.4);

    this.instance_4 = new lib.chainPart();
    this.instance_4.parent = this;
    this.instance_4.setTransform(0, 208.5);

    this.instance_5 = new lib.chainPart();
    this.instance_5.parent = this;
    this.instance_5.setTransform(0, 230.5);

    this.instance_6 = new lib.chainPart();
    this.instance_6.parent = this;
    this.instance_6.setTransform(0, -497.1);

    this.instance_7 = new lib.chainPart();
    this.instance_7.parent = this;
    this.instance_7.setTransform(0, -475.1);

    this.instance_8 = new lib.chainPart();
    this.instance_8.parent = this;
    this.instance_8.setTransform(0, -453);

    this.instance_9 = new lib.chainPart();
    this.instance_9.parent = this;
    this.instance_9.setTransform(0, -431);

    this.instance_10 = new lib.chainPart();
    this.instance_10.parent = this;
    this.instance_10.setTransform(0, -408.9);

    this.instance_11 = new lib.chainPart();
    this.instance_11.parent = this;
    this.instance_11.setTransform(0, -386.9);

    this.instance_12 = new lib.chainPart();
    this.instance_12.parent = this;
    this.instance_12.setTransform(0, -364.8);

    this.instance_13 = new lib.chainPart();
    this.instance_13.parent = this;
    this.instance_13.setTransform(0, -342.8);

    this.instance_14 = new lib.chainPart();
    this.instance_14.parent = this;
    this.instance_14.setTransform(0, -320.7);

    this.instance_15 = new lib.chainPart();
    this.instance_15.parent = this;
    this.instance_15.setTransform(0, -298.7);

    this.instance_16 = new lib.chainPart();
    this.instance_16.parent = this;
    this.instance_16.setTransform(0, -276.6);

    this.instance_17 = new lib.chainPart();
    this.instance_17.parent = this;
    this.instance_17.setTransform(0, -254.6);

    this.instance_18 = new lib.chainPart();
    this.instance_18.parent = this;
    this.instance_18.setTransform(0, -232.5);

    this.instance_19 = new lib.chainPart();
    this.instance_19.parent = this;
    this.instance_19.setTransform(0, -210.5);

    this.instance_20 = new lib.chainPart();
    this.instance_20.parent = this;
    this.instance_20.setTransform(0, -188.4);

    this.instance_21 = new lib.chainPart();
    this.instance_21.parent = this;
    this.instance_21.setTransform(0, -166.4);

    this.instance_22 = new lib.chainPart();
    this.instance_22.parent = this;
    this.instance_22.setTransform(0, -144.3);

    this.instance_23 = new lib.chainPart();
    this.instance_23.parent = this;
    this.instance_23.setTransform(0, -122.3);

    this.instance_24 = new lib.chainPart();
    this.instance_24.parent = this;
    this.instance_24.setTransform(0, -100.2);

    this.instance_25 = new lib.chainPart();
    this.instance_25.parent = this;
    this.instance_25.setTransform(0, -78.2);

    this.instance_26 = new lib.chainPart();
    this.instance_26.parent = this;
    this.instance_26.setTransform(0, -56.1);

    this.instance_27 = new lib.chainPart();
    this.instance_27.parent = this;
    this.instance_27.setTransform(0, -34.1);

    this.instance_28 = new lib.chainPart();
    this.instance_28.parent = this;
    this.instance_28.setTransform(0, -12);

    this.instance_29 = new lib.chainPart();
    this.instance_29.parent = this;
    this.instance_29.setTransform(0, 10);

    this.instance_30 = new lib.chainPart();
    this.instance_30.parent = this;
    this.instance_30.setTransform(0, 32.1);

    this.instance_31 = new lib.chainPart();
    this.instance_31.parent = this;
    this.instance_31.setTransform(0, 54.1);

    this.instance_32 = new lib.chainPart();
    this.instance_32.parent = this;
    this.instance_32.setTransform(0, 76.2);

    this.instance_33 = new lib.chainPart();
    this.instance_33.parent = this;
    this.instance_33.setTransform(0, 98.2);

    this.instance_34 = new lib.chainPart();
    this.instance_34.parent = this;
    this.instance_34.setTransform(0, 120.3);

    this.instance_35 = new lib.chainPart();
    this.instance_35.parent = this;
    this.instance_35.setTransform(0, 142.3);

    this.instance_36 = new lib.chainPart();
    this.instance_36.parent = this;
    this.instance_36.setTransform(0, 164.4);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.instance_36
      }, {
        t: this.instance_35
      }, {
        t: this.instance_34
      }, {
        t: this.instance_33
      }, {
        t: this.instance_32
      }, {
        t: this.instance_31
      }, {
        t: this.instance_30
      }, {
        t: this.instance_29
      }, {
        t: this.instance_28
      }, {
        t: this.instance_27
      }, {
        t: this.instance_26
      }, {
        t: this.instance_25
      }, {
        t: this.instance_24
      }, {
        t: this.instance_23
      }, {
        t: this.instance_22
      }, {
        t: this.instance_21
      }, {
        t: this.instance_20
      }, {
        t: this.instance_19
      }, {
        t: this.instance_18
      }, {
        t: this.instance_17
      }, {
        t: this.instance_16
      }, {
        t: this.instance_15
      }, {
        t: this.instance_14
      }, {
        t: this.instance_13
      }, {
        t: this.instance_12
      }, {
        t: this.instance_11
      }, {
        t: this.instance_10
      }, {
        t: this.instance_9
      }, {
        t: this.instance_8
      }, {
        t: this.instance_7
      }, {
        t: this.instance_6
      }, {
        t: this.instance_5
      }, {
        t: this.instance_4
      }, {
        t: this.instance_3
      }, {
        t: this.instance_2
      }, {
        t: this.instance_1
      }, {
        t: this.instance
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-5, -505.1, 9.6, 809.6);


  (lib.Chain = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 3
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#22211F").s().p("EgALAlfMAAAhK+IAXAAMAAABK+g");
    this.shape.setTransform(7.2, 356.5, 1, 1.486);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(30));

    // Layer 5 (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("EgBjA3nMAAAhvNIDGAAMAAABvNg");
    mask.setTransform(1, 355.9);

    // chainPart
    this.instance = new lib.verticalChain_anim();
    this.instance.parent = this;
    this.instance.setTransform(-0.2, 394.5);

    this.instance.mask = mask;

    this.timeline.addTween(cjs.Tween.get(this.instance).to({
      y: 350.3
    }, 29).wait(1));

    // Layer 4
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#22211F").s().p("EgAUAoAMAAAhP+IApAAMAAABP+g");
    this.shape_1.setTransform(-7.7, 356.5, 0.582, 1.393);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(30));

    // Layer 6
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#101010").s().p("EgBWA3tMAAAhvZICtAAMAAABvZg");
    this.shape_2.setTransform(-0.3, 356.5);

    this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(30));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-9, 0, 17.5, 713.1);


  (lib.TopMenu = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // progressMoney
    this.moneyTxt = new cjs.Text("$ 100", "bold 15px 'Tahoma'");
    this.moneyTxt.name = "moneyTxt";
    this.moneyTxt.textAlign = "center";
    this.moneyTxt.lineHeight = 22;
    this.moneyTxt.lineWidth = 102;
    this.moneyTxt.parent = this;
    this.moneyTxt.setTransform(0.3, 9.7);

    this.timeline.addTween(cjs.Tween.get(this.moneyTxt).wait(3));

    // Layer 3
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("Am6DcQg0AAgmgjQgngjgJgyIsZAAIAAk/MAq7AAAIAAE/IsZAAQgIAygnAjQgnAjg0AAg");
    this.shape.setTransform(0.9, 22);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(3));

    // Layer 8
    this.menuBG = new lib.topMenuBg1();
    this.menuBG.parent = this;
    this.menuBG.setTransform(0, 15.6, 1, 1, 0, 0, 0, 0, 15.7);

    this.timeline.addTween(cjs.Tween.get(this.menuBG).wait(3));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-241, -1, 482, 482);


  (lib.TopBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      this.setBounds(0, 0, 319, 168);
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // bg
    this.instance = new lib.orangeBG();
    this.instance.parent = this;

    this.instance_1 = new lib.redBG();
    this.instance_1.parent = this;
    this.instance_1.setTransform(241, 83.2, 1, 1, 0, 0, 0, 0, 83.2);

    this.instance_2 = new lib.blackBG();
    this.instance_2.parent = this;
    this.instance_2.setTransform(241, 83.2, 1, 1, 0, 0, 0, 0, 83.2);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.instance
      }]
    }).to({
      state: [{
        t: this.instance_1
      }]
    }, 1).to({
      state: [{
        t: this.instance_2
      }]
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, -1, 481, 482);


  (lib.topMid_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("top middle", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 60;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(0, 2);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(0, 10);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-32, -11.7, 147.9, 78);


  (lib.topLeft_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("top left", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 42;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(22.8, 2);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(10, 10);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-11.8, -36.7, 465.2, 516.8);


  (lib.TapTile = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // tapTxt
    this.tapTxt = new cjs.Text("КОСНИТЕСЬ, ЧТОБЫ НАЧАТЬ!", "bold 20px 'Tahoma'", "#FFFFFF");
    this.tapTxt.name = "tapTxt";
    this.tapTxt.textAlign = "center";
    this.tapTxt.lineHeight = 26;
    this.tapTxt.lineWidth = 316;
    this.tapTxt.parent = this;
    this.tapTxt.setTransform(0, 3.1);

    this.timeline.addTween(cjs.Tween.get(this.tapTxt).wait(1));

    // tapTxt copy
    this.tapTxtStroke = new cjs.Text("КОСНИТЕСЬ, ЧТОБЫ НАЧАТЬ!", "bold 20px 'Tahoma'", "#FFFFFF");
    this.tapTxtStroke.name = "tapTxtStroke";
    this.tapTxtStroke.textAlign = "center";
    this.tapTxtStroke.lineHeight = 26;
    this.tapTxtStroke.lineWidth = 316;
    this.tapTxtStroke.parent = this;
    this.tapTxtStroke.setTransform(0, 3.1);

    this.timeline.addTween(cjs.Tween.get(this.tapTxtStroke).wait(1));

    // tapTextC
    this.tapLoc = new lib.tapTextC();
    this.tapLoc.parent = this;
    this.tapLoc.setTransform(0, 15.1, 1, 1, 0, 0, 0, 0, 15.1);
    this.tapLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.tapLoc).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-160, 0, 320, 30);


  (lib.popUp_Locators_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "Vertical": 0,
      "Horizontal": 1
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

    // pointLoc0
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(-0.5, 105.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(2));

    // pointLoc1
    this.pointLoc1 = new lib.locator();
    this.pointLoc1.parent = this;
    this.pointLoc1.setTransform(-0.5, 105.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc1).wait(2));

    // pointLoc2
    this.pointLoc2 = new lib.locator();
    this.pointLoc2.parent = this;
    this.pointLoc2.setTransform(-0.5, 105.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc2).wait(2));

    // pointLoc3
    this.pointLoc3 = new lib.locator();
    this.pointLoc3.parent = this;
    this.pointLoc3.setTransform(-0.5, 105.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc3).wait(2));

    // pointLoc4
    this.pointLoc4 = new lib.locator();
    this.pointLoc4.parent = this;
    this.pointLoc4.setTransform(-0.5, 105.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc4).wait(2));

    // pointLoc5
    this.pointLoc5 = new lib.locator();
    this.pointLoc5.parent = this;
    this.pointLoc5.setTransform(0.1, -23.8);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc5).wait(2));

    // pointLoc6
    this.pointLoc6 = new lib.locator();
    this.pointLoc6.parent = this;
    this.pointLoc6.setTransform(0.1, 89.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc6).wait(2));

    // pointLoc7
    this.pointLoc7 = new lib.locator();
    this.pointLoc7.parent = this;
    this.pointLoc7.setTransform(0.1, 100.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc7).wait(2));

    // pointLoc8
    this.pointLoc8 = new lib.locator();
    this.pointLoc8.parent = this;
    this.pointLoc8.setTransform(0.1, 100.7);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc8).wait(2));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-131.8, -45.6, 262.7, 377.4);


  (lib.midRight_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("middle right", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 67;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(-35.7, -6);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-71.3, -21.7, 187.2, 88);


  (lib.midLeft_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("middle left", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 59;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(31.7, -6);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-21.8, -21.7, 137.7, 88);


  (lib.downRight_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("bottom right", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 70;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(-37.4, -15.4);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(-92, -28.4);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-181, -55.4, 180.8, 55.3);


  (lib.cursor_Btn_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 2
    this.instance = new lib.hand_mc();
    this.instance.parent = this;
    this.instance.setTransform(31.2, 22.4, 1.15, 1.15, 0, 0, 0, 0.1, 0.1);

    this.timeline.addTween(cjs.Tween.get(this.instance).to({
      regX: 0
    }, 4, cjs.Ease.get(1)).to({
      regX: 0.1,
      regY: 0.2,
      scaleX: 0.9,
      scaleY: 0.9,
      rotation: -5.8,
      x: 6.1,
      y: 4.3
    }, 13, cjs.Ease.get(1)).wait(5).to({
      regX: 0.3,
      regY: 0.4,
      scaleX: 0.9,
      scaleY: 0.9,
      x: 6.2,
      y: 4.4
    }, 0).to({
      regX: 0.1,
      regY: 0.1,
      scaleX: 1.15,
      scaleY: 1.15,
      rotation: 0,
      x: 31.2,
      y: 22.4
    }, 7).wait(8));

    // Layer 3
    this.instance_1 = new lib.circle_cursor_mc();
    this.instance_1.parent = this;
    this.instance_1.setTransform(0.1, -0.6, 0.424, 0.424);
    this.instance_1.alpha = 0.57;
    this.instance_1._off = true;

    this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(17).to({
      _off: false
    }, 0).to({
      scaleX: 2.06,
      scaleY: 2.06,
      alpha: 0
    }, 5).to({
      _off: true
    }, 1).wait(14));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(14.2, 8.2, 107.7, 96.3);


  (lib.Cow_first = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      run: 1,
      milk: 14,
      click: 25,
      wait: 35
    });

    // timeline functions:
    this.frame_0 = function() {
      var hit = new createjs.Shape();
      hit.graphics.beginFill("#000").drawRect(-50, -50, 100, 90);
      this.hitArea = hit;

      this.cowHead1.snapToPixel = true;
      this.cowHead1.cache(-23, -24, 45, 48, 4);

      this.headMilk.snapToPixel = true;
      this.headMilk.cache(-22, -27, 45, 53, 4);

      this.body.snapToPixel = true;
      this.body.cache(-31, -26, 62, 52, 4);

      this.frontLeg1.snapToPixel = true;
      this.frontLeg1.cache(-4, -10, 8, 21, 4);

      this.frontLeg2.snapToPixel = true;
      this.frontLeg2.cache(-4, -10, 8, 21, 4);

      this.backLeg2.snapToPixel = true;
      this.backLeg2.cache(-4, -10, 8, 21, 4);
      this.backLeg1.snapToPixel = true;
      this.backLeg1.cache(-4, -10, 8, 21, 4);

      this.tail.snapToPixel = true;
      this.tail.cache(0, 0, 16, 19, 4);

      this.dug.snapToPixel = true;
      this.dug.cache(-10, -10, 19, 19, 4);

      this.setBounds(-49, -43, 94, 78);
    }
    this.frame_13 = function() {
      this.gotoAndPlay("run");
    }
    this.frame_24 = function() {
      this.gotoAndPlay("milk");
    }
    this.frame_34 = function() {
      this.gotoAndPlay("milk");
    }
    this.frame_45 = function() {
      this.gotoAndPlay("wait");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(13).call(this.frame_13).wait(11).call(this.frame_24).wait(10).call(this.frame_34).wait(11).call(this.frame_45).wait(1));

    // cow_First_headMilk
    this.headMilk = new lib.cow_First_headMilk();
    this.headMilk.parent = this;
    this.headMilk.setTransform(-26.6, -14.7);
    this.headMilk.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.headMilk).wait(13).to({
      alpha: 1
    }, 1).to({
      y: -11
    }, 6).to({
      y: -14.7
    }, 4).to({
      y: -9.7
    }, 5).to({
      y: -14.7
    }, 5).to({
      _off: true
    }, 1).wait(11));

    // cow_First_headRun
    this.cowHead1 = new lib.cow_First_headRun();
    this.cowHead1.parent = this;
    this.cowHead1.setTransform(-27.2, -17.5, 1, 1, 0, 0, 0, -0.6, 0);

    this.timeline.addTween(cjs.Tween.get(this.cowHead1).to({
      y: -19.2
    }, 7).to({
      y: -17.7
    }, 6).to({
      _off: true
    }, 1).wait(21).to({
      _off: false,
      y: -17.5
    }, 0).to({
      y: -19.2
    }, 4).to({
      y: -17.7
    }, 6).wait(1));

    // cow_First_frontLeg
    this.frontLeg1 = new lib.cow_First_frontLeg();
    this.frontLeg1.parent = this;
    this.frontLeg1.setTransform(16.2, 16.1, 1, 1, 24, 0, 0, 0.1, -8.1);

    this.timeline.addTween(cjs.Tween.get(this.frontLeg1).to({
      rotation: -33.5,
      y: 14.3
    }, 7).to({
      scaleX: 1,
      scaleY: 1,
      rotation: 15.8,
      y: 15.8
    }, 6).to({
      rotation: -43,
      x: 16.1,
      y: 15.9
    }, 1).to({
      regY: -8,
      scaleX: 1,
      scaleY: 1,
      rotation: -42.9,
      x: 16.2,
      y: 15.2
    }, 4).to({
      x: 16.5,
      y: 15.6
    }, 4).to({
      regY: -8.1,
      scaleX: 1,
      scaleY: 1,
      rotation: -43,
      x: 16.1,
      y: 15.9
    }, 2).to({
      regY: -8,
      rotation: -64.9,
      x: 16.3
    }, 5).to({
      regY: -8.1,
      rotation: -43,
      x: 16.1
    }, 5).wait(1).to({
      regY: -8,
      scaleX: 1,
      scaleY: 1,
      rotation: -42.9,
      x: 16.2,
      y: 15.2
    }, 4).to({
      x: 16.5,
      y: 15.6
    }, 4).to({
      regY: -8.1,
      scaleX: 1,
      scaleY: 1,
      rotation: -43,
      x: 16.1,
      y: 15.9
    }, 2).wait(1));

    // cow_First_frontLeg
    this.frontLeg2 = new lib.cow_First_frontLeg();
    this.frontLeg2.parent = this;
    this.frontLeg2.setTransform(-13.9, 16, 1, 1, -23.7, 0, 0, -0.1, -8.2);

    this.timeline.addTween(cjs.Tween.get(this.frontLeg2).to({
      regX: 0,
      regY: -8.1,
      rotation: 35,
      x: -13.8,
      y: 14.3
    }, 7).to({
      regX: -0.1,
      scaleX: 1,
      scaleY: 1,
      rotation: -15.3,
      y: 15.8
    }, 6).to({
      rotation: 29.5
    }, 1).to({
      scaleX: 1,
      scaleY: 1,
      rotation: 29.4,
      x: -14.2
    }, 4).to({
      regY: -8,
      scaleX: 1,
      scaleY: 1,
      rotation: 29.3,
      x: -13.7
    }, 4).to({
      regY: -8.1,
      scaleX: 1,
      scaleY: 1,
      rotation: 29.5,
      x: -13.8
    }, 2).to({
      rotation: 50.2
    }, 5).to({
      rotation: 29.5
    }, 5).wait(1).to({
      scaleX: 1,
      scaleY: 1,
      rotation: 29.4,
      x: -14.2
    }, 4).to({
      regY: -8,
      scaleX: 1,
      scaleY: 1,
      rotation: 29.3,
      x: -13.7
    }, 4).to({
      regY: -8.1,
      scaleX: 1,
      scaleY: 1,
      rotation: 29.5,
      x: -13.8
    }, 2).wait(1));

    // cow_First_body
    this.body = new lib.cow_First_body();
    this.body.parent = this;
    this.body.setTransform(1.4, 1, 1, 1, 0, 0, 0, 0, 0.1);

    this.timeline.addTween(cjs.Tween.get(this.body).to({
      y: -0.7
    }, 7).to({
      y: 0.8
    }, 6).wait(1).to({
      y: 0.4
    }, 2).to({
      x: 1.1,
      y: 0.5
    }, 2).to({
      x: 1.2,
      y: 1
    }, 2).to({
      x: 2,
      y: 0.9
    }, 2).to({
      x: 1.4,
      y: 0.8
    }, 2).wait(11).to({
      y: 0.4
    }, 2).to({
      x: 1.1,
      y: 0.5
    }, 2).to({
      x: 1.2,
      y: 1
    }, 2).to({
      x: 2,
      y: 0.9
    }, 2).to({
      x: 1.4,
      y: 0.8
    }, 2).wait(1));

    // cow_First_tail
    this.tail = new lib.cow_First_tail();
    this.tail.parent = this;
    this.tail.setTransform(25.1, -6.3);

    this.timeline.addTween(cjs.Tween.get(this.tail).to({
      rotation: -16.7,
      y: -8
    }, 7).to({
      rotation: 0,
      y: -6.5
    }, 6).wait(1).to({
      rotation: -5.5
    }, 2).to({
      rotation: 3
    }, 2).to({
      rotation: 8
    }, 2).to({
      rotation: 0,
      x: 25.8
    }, 2).to({
      x: 25.1
    }, 2).to({
      rotation: -12
    }, 5).to({
      rotation: 0
    }, 5).wait(1).to({
      rotation: -5.5
    }, 2).to({
      rotation: 3
    }, 2).to({
      rotation: 8
    }, 2).to({
      rotation: 0,
      x: 25.8
    }, 2).to({
      x: 25.1
    }, 2).wait(1));

    // cow_First_dug
    this.dug = new lib.cow_First_dug();
    this.dug.parent = this;
    this.dug.setTransform(8.8, 24.1);

    this.timeline.addTween(cjs.Tween.get(this.dug).to({
      y: 22.3
    }, 7).to({
      y: 23.8
    }, 6).wait(33));

    // cow_First_backLeg
    this.backLeg1 = new lib.cow_First_backLeg();
    this.backLeg1.parent = this;
    this.backLeg1.setTransform(-4.6, 16, 1, 1, 0, 0, 0, 0.2, -7.5);

    this.timeline.addTween(cjs.Tween.get(this.backLeg1).to({
      regX: 0.1,
      regY: -7.4,
      rotation: 29.9,
      x: -4.7,
      y: 14.3
    }, 7).to({
      rotation: 4.3,
      x: -4.6,
      y: 15.8
    }, 6).to({
      regY: -7.3,
      rotation: 19,
      y: 15.9
    }, 1).to({
      regX: 0,
      regY: -7.2,
      scaleX: 1,
      scaleY: 1,
      rotation: 18.8,
      x: -5,
      y: 16
    }, 4).to({
      scaleX: 1,
      scaleY: 1,
      x: -4.4
    }, 4).to({
      regX: 0.1,
      regY: -7.3,
      scaleX: 1,
      scaleY: 1,
      rotation: 19,
      x: -4.6,
      y: 15.9
    }, 2).to({
      rotation: 36.9,
      x: -4.5
    }, 5).to({
      rotation: 19,
      x: -4.6
    }, 5).wait(1).to({
      regX: 0,
      regY: -7.2,
      scaleX: 1,
      scaleY: 1,
      rotation: 18.8,
      x: -5,
      y: 16
    }, 4).to({
      scaleX: 1,
      scaleY: 1,
      x: -4.4
    }, 4).to({
      regX: 0.1,
      regY: -7.3,
      scaleX: 1,
      scaleY: 1,
      rotation: 19,
      x: -4.6,
      y: 15.9
    }, 2).wait(1));

    // cow_First_backLeg
    this.backLeg2 = new lib.cow_First_backLeg();
    this.backLeg2.parent = this;
    this.backLeg2.setTransform(22.3, 16.4, 1, 1, 28, 0, 0, 0.2, -7.4);

    this.timeline.addTween(cjs.Tween.get(this.backLeg2).to({
      rotation: -43.3,
      y: 14.6
    }, 7).to({
      scaleX: 1,
      scaleY: 1,
      rotation: 17.8,
      y: 16.1
    }, 6).to({
      regX: 0.4,
      regY: -7.3,
      rotation: -20.7,
      y: 16.2
    }, 1).to({
      regY: -7.2,
      scaleX: 1,
      scaleY: 1,
      rotation: -20.6,
      x: 22.4,
      y: 15.6
    }, 4).to({
      scaleX: 1,
      scaleY: 1,
      x: 22.8,
      y: 16
    }, 4).to({
      regY: -7.3,
      scaleX: 1,
      scaleY: 1,
      rotation: -20.7,
      x: 22.3,
      y: 16.2
    }, 2).to({
      regY: -7.2,
      rotation: -54.4,
      x: 22.5
    }, 5).to({
      regY: -7.3,
      rotation: -20.7,
      x: 22.3
    }, 5).to({
      rotation: -20.7
    }, 1).to({
      regY: -7.2,
      scaleX: 1,
      scaleY: 1,
      rotation: -20.6,
      x: 22.4,
      y: 15.6
    }, 4).to({
      scaleX: 1,
      scaleY: 1,
      x: 22.8,
      y: 16
    }, 4).to({
      regY: -7.3,
      scaleX: 1,
      scaleY: 1,
      rotation: -20.7,
      x: 22.3,
      y: 16.2
    }, 2).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-49.2, -41.7, 91.2, 78);


  (lib.clickerLocators_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "Vertical": 0,
      "Horizontal": 1
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

    // pointLoc0
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(2));

    // pointLoc1
    this.pointLoc1 = new lib.locator();
    this.pointLoc1.parent = this;
    this.pointLoc1.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc1).wait(2));

    // pointLoc2
    this.pointLoc2 = new lib.locator();
    this.pointLoc2.parent = this;
    this.pointLoc2.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc2).wait(2));

    // pointLoc3
    this.pointLoc3 = new lib.locator();
    this.pointLoc3.parent = this;
    this.pointLoc3.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc3).wait(2));

    // pointLoc4
    this.pointLoc4 = new lib.locator();
    this.pointLoc4.parent = this;
    this.pointLoc4.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc4).wait(2));

    // pointLoc5
    this.pointLoc5 = new lib.locator();
    this.pointLoc5.parent = this;
    this.pointLoc5.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc5).wait(2));

    // pointLoc6
    this.pointLoc6 = new lib.locator();
    this.pointLoc6.parent = this;
    this.pointLoc6.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc6).wait(2));

    // pointLoc7
    this.pointLoc7 = new lib.locator();
    this.pointLoc7.parent = this;
    this.pointLoc7.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc7).wait(2));

    // pointLoc8
    this.pointLoc8 = new lib.locator();
    this.pointLoc8.parent = this;
    this.pointLoc8.setTransform(-1978.7, -47.9);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc8).wait(2));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-2000.5, -350, 2370.5, 590.5);


  (lib.clickArea = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.hit_mc = new lib.item_Container_mc();
    this.hit_mc.parent = this;
    this.hit_mc.setTransform(-0.1, -0.1, 1, 1.45);
    this.hit_mc.alpha = 0.219;

    this.timeline.addTween(cjs.Tween.get(this.hit_mc).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-0.1, -0.1, 57.9, 46.1);


  (lib.bottomMid_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("bottom middle", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 81;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(0, -15.2);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(0, -21.4);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-42.6, -43.1, 85.2, 43.7);


  (lib.bottomLeft_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("bottom left", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 65;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(34.4, -15.2);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // logoLoc
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(10, -10);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-11.8, -31.7, 127.7, 78);


  (lib.Background2 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "Vertical": 0,
      "Horizontal": 1
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

    // bg end card
    this.bg_endCard = new lib.bg_endCard_mc();
    this.bg_endCard.parent = this;
    this.bg_endCard.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.bg_endCard).wait(2));

    // black
    this.blackRect = new lib.blackRect_mc();
    this.blackRect.parent = this;
    this.blackRect.setTransform(-0.1, 0, 1.5, 1, 0, 0, 0, 233.3, 350);
    this.blackRect.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.blackRect).wait(2));

    // match3 bg
    this.bgMatch3 = new lib.bg_match3_square_mc();
    this.bgMatch3.parent = this;
    this.bgMatch3.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.bgMatch3).wait(2));

    // bg
    this.bg = new lib.bg_square_mc();
    this.bg.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.bg).wait(2));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-350, -350, 720, 590.5);


  (lib.bankBar_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // serviceInfo
    this.serviceInfo = new cjs.Text("top right", "bold 11px 'Tahoma'", "#FFFFFF");
    this.serviceInfo.name = "serviceInfo";
    this.serviceInfo.textAlign = "center";
    this.serviceInfo.lineHeight = 15;
    this.serviceInfo.lineWidth = 50;
    this.serviceInfo.parent = this;
    this.serviceInfo.setTransform(-27.3, 2);

    this.timeline.addTween(cjs.Tween.get(this.serviceInfo).wait(1));

    // bankBar
    this.pointLoc0 = new lib.locator();
    this.pointLoc0.parent = this;
    this.pointLoc0.setTransform(-56.9, 10.2);

    this.timeline.addTween(cjs.Tween.get(this.pointLoc0).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-157.7, -11.6, 157.5, 63.7);


  (lib.LiftBlock = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.body.snapToPixel = true;
      this.body.cache(-19, -1, 38, 76, 4);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 36
    this.body = new lib.liftBlock_body();
    this.body.parent = this;
    this.body.setTransform(0, 1);

    this.timeline.addTween(cjs.Tween.get(this.body).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-18, 0, 36, 75.5);


  (lib.Lift = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      full: 99
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      this.body.snapToPixel = true;
      this.body.cache(-34, -70, 68, 139, 4);

      this.tube.snapToPixel = true;
      this.tube.cache(-7, -53, 13, 105, 4);
      /*
      this.rope.snapToPixel = true;
      this.rope.cache(0, -600, 4, 625, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(102));

    // Layer 3
    this.body = new lib.liftBody();
    this.body.parent = this;
    this.body.setTransform(0, 52.9);

    this.timeline.addTween(cjs.Tween.get(this.body).wait(102));

    // Layer 5 (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AifJJQg9ABgtgtQgrgrAAg+IAAr3QAAg9ArgtQAtgsA9AAIE/AAQAbAAAcALIAAgbIBeAAIAAOdQAAA+grArQgsAtg+gBg");
    mask.setTransform(0, 58.6);

    // Layer 4
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("Ak+AHIAAgNIJ+AAIAAANg");
    this.shape.setTransform(-0.6, 95.3);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("Ak+ALIAAgVIJ+AAIAAAVg");
    this.shape_1.setTransform(-0.6, 94.9);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("Ak+APIAAgdIJ+AAIAAAdg");
    this.shape_2.setTransform(-0.6, 94.5);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("Ak+ATIAAglIJ+AAIAAAlg");
    this.shape_3.setTransform(-0.6, 94);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("Ak+AYIAAgvIJ+AAIAAAvg");
    this.shape_4.setTransform(-0.6, 93.6);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("Ak+AcIAAg3IJ+AAIAAA3g");
    this.shape_5.setTransform(-0.6, 93.2);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("Ak+AgIAAg/IJ+AAIAAA/g");
    this.shape_6.setTransform(-0.6, 92.8);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("Ak+AkIAAhHIJ+AAIAABHg");
    this.shape_7.setTransform(-0.6, 92.4);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("Ak+AoIAAhPIJ+AAIAABPg");
    this.shape_8.setTransform(-0.6, 92);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("Ak+AsIAAhXIJ+AAIAABXg");
    this.shape_9.setTransform(-0.6, 91.5);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("Ak+AwIAAhfIJ+AAIAABfg");
    this.shape_10.setTransform(-0.6, 91.1);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("Ak+A0IAAhnIJ+AAIAABng");
    this.shape_11.setTransform(-0.6, 90.7);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFFFFF").s().p("Ak+A4IAAhwIJ+AAIAABwg");
    this.shape_12.setTransform(-0.6, 90.3);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("Ak+A8IAAh3IJ+AAIAAB3g");
    this.shape_13.setTransform(-0.6, 89.9);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FFFFFF").s().p("Ak+BBIAAiBIJ+AAIAACBg");
    this.shape_14.setTransform(-0.6, 89.4);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FFFFFF").s().p("Ak+BFIAAiJIJ+AAIAACJg");
    this.shape_15.setTransform(-0.6, 89);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("Ak+BJIAAiRIJ+AAIAACRg");
    this.shape_16.setTransform(-0.6, 88.6);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFFFFF").s().p("Ak+BNIAAiZIJ+AAIAACZg");
    this.shape_17.setTransform(-0.6, 88.2);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#FFFFFF").s().p("Ak+BRIAAihIJ+AAIAAChg");
    this.shape_18.setTransform(-0.6, 87.8);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("Ak+BVIAAipIJ+AAIAACpg");
    this.shape_19.setTransform(-0.6, 87.4);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#FFFFFF").s().p("Ak+BaIAAizIJ+AAIAACzg");
    this.shape_20.setTransform(-0.6, 86.9);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("Ak+BeIAAi7IJ+AAIAAC7g");
    this.shape_21.setTransform(-0.6, 86.5);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FFFFFF").s().p("Ak+BiIAAjDIJ+AAIAADDg");
    this.shape_22.setTransform(-0.6, 86.1);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFFFFF").s().p("Ak+BmIAAjLIJ+AAIAADLg");
    this.shape_23.setTransform(-0.6, 85.7);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#FFFFFF").s().p("Ak+BqIAAjTIJ+AAIAADTg");
    this.shape_24.setTransform(-0.6, 85.3);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("Ak+BuIAAjbIJ+AAIAADbg");
    this.shape_25.setTransform(-0.6, 84.8);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FFFFFF").s().p("Ak+BzIAAjkIJ+AAIAADkg");
    this.shape_26.setTransform(-0.6, 84.4);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("Ak+B3IAAjtIJ+AAIAADtg");
    this.shape_27.setTransform(-0.6, 84);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FFFFFF").s().p("Ak+B7IAAj1IJ+AAIAAD1g");
    this.shape_28.setTransform(-0.6, 83.6);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#FFFFFF").s().p("Ak+B/IAAj9IJ+AAIAAD9g");
    this.shape_29.setTransform(-0.6, 83.2);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FFFFFF").s().p("Ak+CDIAAkFIJ+AAIAAEFg");
    this.shape_30.setTransform(-0.6, 82.8);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#FFFFFF").s().p("Ak+CHIAAkNIJ+AAIAAENg");
    this.shape_31.setTransform(-0.6, 82.3);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#FFFFFF").s().p("Ak+CLIAAkVIJ+AAIAAEVg");
    this.shape_32.setTransform(-0.6, 81.9);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FFFFFF").s().p("Ak+CQIAAkeIJ+AAIAAEeg");
    this.shape_33.setTransform(-0.6, 81.5);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FFFFFF").s().p("Ak+CUIAAknIJ+AAIAAEng");
    this.shape_34.setTransform(-0.6, 81.1);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#FFFFFF").s().p("Ak+CYIAAkvIJ+AAIAAEvg");
    this.shape_35.setTransform(-0.6, 80.7);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FFFFFF").s().p("Ak+CcIAAk3IJ+AAIAAE3g");
    this.shape_36.setTransform(-0.6, 80.3);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f("#FFFFFF").s().p("Ak+CgIAAk/IJ+AAIAAE/g");
    this.shape_37.setTransform(-0.6, 79.8);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FFFFFF").s().p("Ak+CkIAAlHIJ+AAIAAFHg");
    this.shape_38.setTransform(-0.6, 79.4);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#FFFFFF").s().p("Ak+CpIAAlRIJ+AAIAAFRg");
    this.shape_39.setTransform(-0.6, 79);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FFFFFF").s().p("Ak+CtIAAlZIJ+AAIAAFZg");
    this.shape_40.setTransform(-0.6, 78.6);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f("#FFFFFF").s().p("Ak+CxIAAlhIJ+AAIAAFhg");
    this.shape_41.setTransform(-0.6, 78.2);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FFFFFF").s().p("Ak+C1IAAlpIJ+AAIAAFpg");
    this.shape_42.setTransform(-0.6, 77.7);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f("#FFFFFF").s().p("Ak+C5IAAlxIJ+AAIAAFxg");
    this.shape_43.setTransform(-0.6, 77.3);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FFFFFF").s().p("Ak+C9IAAl5IJ+AAIAAF5g");
    this.shape_44.setTransform(-0.6, 76.9);

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f("#FFFFFF").s().p("Ak+DBIAAmBIJ+AAIAAGBg");
    this.shape_45.setTransform(-0.6, 76.5);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FFFFFF").s().p("Ak+DFIAAmJIJ+AAIAAGJg");
    this.shape_46.setTransform(-0.6, 76.1);

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#FFFFFF").s().p("Ak+DJIAAmSIJ+AAIAAGSg");
    this.shape_47.setTransform(-0.6, 75.7);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FFFFFF").s().p("Ak+DOIAAmbIJ+AAIAAGbg");
    this.shape_48.setTransform(-0.6, 75.2);

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#FFFFFF").s().p("Ak+DSIAAmjIJ+AAIAAGjg");
    this.shape_49.setTransform(-0.6, 74.8);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#FFFFFF").s().p("Ak+DWIAAmrIJ+AAIAAGrg");
    this.shape_50.setTransform(-0.6, 74.4);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f("#FFFFFF").s().p("Ak+DaIAAmzIJ+AAIAAGzg");
    this.shape_51.setTransform(-0.6, 74);

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#FFFFFF").s().p("Ak+DeIAAm7IJ+AAIAAG7g");
    this.shape_52.setTransform(-0.6, 73.6);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f("#FFFFFF").s().p("Ak+DiIAAnDIJ+AAIAAHDg");
    this.shape_53.setTransform(-0.6, 73.2);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FFFFFF").s().p("Ak+DmIAAnLIJ+AAIAAHLg");
    this.shape_54.setTransform(-0.6, 72.8);

    this.shape_55 = new cjs.Shape();
    this.shape_55.graphics.f("#FFFFFF").s().p("Ak+DrIAAnVIJ+AAIAAHVg");
    this.shape_55.setTransform(-0.6, 72.3);

    this.shape_56 = new cjs.Shape();
    this.shape_56.graphics.f("#FFFFFF").s().p("Ak+DvIAAndIJ+AAIAAHdg");
    this.shape_56.setTransform(-0.6, 71.9);

    this.shape_57 = new cjs.Shape();
    this.shape_57.graphics.f("#FFFFFF").s().p("Ak+DzIAAnlIJ+AAIAAHlg");
    this.shape_57.setTransform(-0.6, 71.5);

    this.shape_58 = new cjs.Shape();
    this.shape_58.graphics.f("#FFFFFF").s().p("Ak+D3IAAntIJ+AAIAAHtg");
    this.shape_58.setTransform(-0.6, 71.1);

    this.shape_59 = new cjs.Shape();
    this.shape_59.graphics.f("#FFFFFF").s().p("Ak+D7IAAn1IJ+AAIAAH1g");
    this.shape_59.setTransform(-0.6, 70.6);

    this.shape_60 = new cjs.Shape();
    this.shape_60.graphics.f("#FFFFFF").s().p("Ak+D/IAAn9IJ+AAIAAH9g");
    this.shape_60.setTransform(-0.6, 70.2);

    this.shape_61 = new cjs.Shape();
    this.shape_61.graphics.f("#FFFFFF").s().p("Ak+EDIAAoFIJ+AAIAAIFg");
    this.shape_61.setTransform(-0.6, 69.8);

    this.shape_62 = new cjs.Shape();
    this.shape_62.graphics.f("#FFFFFF").s().p("Ak+EHIAAoNIJ+AAIAAINg");
    this.shape_62.setTransform(-0.6, 69.4);

    this.shape_63 = new cjs.Shape();
    this.shape_63.graphics.f("#FFFFFF").s().p("Ak+EMIAAoXIJ+AAIAAIXg");
    this.shape_63.setTransform(-0.6, 69);

    this.shape_64 = new cjs.Shape();
    this.shape_64.graphics.f("#FFFFFF").s().p("Ak+EQIAAofIJ+AAIAAIfg");
    this.shape_64.setTransform(-0.6, 68.6);

    this.shape_65 = new cjs.Shape();
    this.shape_65.graphics.f("#FFFFFF").s().p("Ak+EUIAAonIJ+AAIAAIng");
    this.shape_65.setTransform(-0.6, 68.2);

    this.shape_66 = new cjs.Shape();
    this.shape_66.graphics.f("#FFFFFF").s().p("Ak+EYIAAovIJ+AAIAAIvg");
    this.shape_66.setTransform(-0.6, 67.7);

    this.shape_67 = new cjs.Shape();
    this.shape_67.graphics.f("#FFFFFF").s().p("Ak+EcIAAo4IJ+AAIAAI4g");
    this.shape_67.setTransform(-0.6, 67.3);

    this.shape_68 = new cjs.Shape();
    this.shape_68.graphics.f("#FFFFFF").s().p("Ak+EgIAApAIJ+AAIAAJAg");
    this.shape_68.setTransform(-0.6, 66.9);

    this.shape_69 = new cjs.Shape();
    this.shape_69.graphics.f("#FFFFFF").s().p("Ak+ElIAApJIJ+AAIAAJJg");
    this.shape_69.setTransform(-0.6, 66.5);

    this.shape_70 = new cjs.Shape();
    this.shape_70.graphics.f("#FFFFFF").s().p("Ak+EpIAApRIJ+AAIAAJRg");
    this.shape_70.setTransform(-0.6, 66.1);

    this.shape_71 = new cjs.Shape();
    this.shape_71.graphics.f("#FFFFFF").s().p("Ak+EtIAApZIJ+AAIAAJZg");
    this.shape_71.setTransform(-0.6, 65.7);

    this.shape_72 = new cjs.Shape();
    this.shape_72.graphics.f("#FFFFFF").s().p("Ak+ExIAAphIJ+AAIAAJhg");
    this.shape_72.setTransform(-0.6, 65.2);

    this.shape_73 = new cjs.Shape();
    this.shape_73.graphics.f("#FFFFFF").s().p("Ak+E1IAAppIJ+AAIAAJpg");
    this.shape_73.setTransform(-0.6, 64.8);

    this.shape_74 = new cjs.Shape();
    this.shape_74.graphics.f("#FFFFFF").s().p("Ak+E5IAApxIJ+AAIAAJxg");
    this.shape_74.setTransform(-0.6, 64.4);

    this.shape_75 = new cjs.Shape();
    this.shape_75.graphics.f("#FFFFFF").s().p("Ak+E+IAAp7IJ+AAIAAJ7g");
    this.shape_75.setTransform(-0.6, 64);

    this.shape_76 = new cjs.Shape();
    this.shape_76.graphics.f("#FFFFFF").s().p("Ak+FCIAAqDIJ+AAIAAKDg");
    this.shape_76.setTransform(-0.6, 63.6);

    this.shape_77 = new cjs.Shape();
    this.shape_77.graphics.f("#FFFFFF").s().p("Ak+FGIAAqLIJ+AAIAAKLg");
    this.shape_77.setTransform(-0.6, 63.1);

    this.shape_78 = new cjs.Shape();
    this.shape_78.graphics.f("#FFFFFF").s().p("Ak+FKIAAqTIJ+AAIAAKTg");
    this.shape_78.setTransform(-0.6, 62.7);

    this.shape_79 = new cjs.Shape();
    this.shape_79.graphics.f("#FFFFFF").s().p("Ak+FOIAAqbIJ+AAIAAKbg");
    this.shape_79.setTransform(-0.6, 62.3);

    this.shape_80 = new cjs.Shape();
    this.shape_80.graphics.f("#FFFFFF").s().p("Ak+FSIAAqjIJ+AAIAAKjg");
    this.shape_80.setTransform(-0.6, 61.9);

    this.shape_81 = new cjs.Shape();
    this.shape_81.graphics.f("#FFFFFF").s().p("Ak+FXIAAqsIJ+AAIAAKsg");
    this.shape_81.setTransform(-0.6, 61.5);

    this.shape_82 = new cjs.Shape();
    this.shape_82.graphics.f("#FFFFFF").s().p("Ak+FbIAAq0IJ+AAIAAK0g");
    this.shape_82.setTransform(-0.6, 61.1);

    this.shape_83 = new cjs.Shape();
    this.shape_83.graphics.f("#FFFFFF").s().p("Ak+FfIAAq9IJ+AAIAAK9g");
    this.shape_83.setTransform(-0.6, 60.6);

    this.shape_84 = new cjs.Shape();
    this.shape_84.graphics.f("#FFFFFF").s().p("Ak+FjIAArFIJ+AAIAALFg");
    this.shape_84.setTransform(-0.6, 60.2);

    this.shape_85 = new cjs.Shape();
    this.shape_85.graphics.f("#FFFFFF").s().p("Ak+FnIAArNIJ+AAIAALNg");
    this.shape_85.setTransform(-0.6, 59.8);

    this.shape_86 = new cjs.Shape();
    this.shape_86.graphics.f("#FFFFFF").s().p("Ak+FrIAArVIJ+AAIAALVg");
    this.shape_86.setTransform(-0.6, 59.4);

    this.shape_87 = new cjs.Shape();
    this.shape_87.graphics.f("#FFFFFF").s().p("Ak+FvIAArdIJ+AAIAALdg");
    this.shape_87.setTransform(-0.6, 59);

    this.shape_88 = new cjs.Shape();
    this.shape_88.graphics.f("#FFFFFF").s().p("Ak+F0IAArnIJ+AAIAALng");
    this.shape_88.setTransform(-0.6, 58.6);

    this.shape_89 = new cjs.Shape();
    this.shape_89.graphics.f("#FFFFFF").s().p("Ak+F4IAArvIJ+AAIAALvg");
    this.shape_89.setTransform(-0.6, 58.1);

    this.shape_90 = new cjs.Shape();
    this.shape_90.graphics.f("#FFFFFF").s().p("Ak+F8IAAr3IJ+AAIAAL3g");
    this.shape_90.setTransform(-0.6, 57.7);

    this.shape_91 = new cjs.Shape();
    this.shape_91.graphics.f("#FFFFFF").s().p("Ak+GAIAAr/IJ+AAIAAL/g");
    this.shape_91.setTransform(-0.6, 57.3);

    this.shape_92 = new cjs.Shape();
    this.shape_92.graphics.f("#FFFFFF").s().p("Ak+GEIAAsHIJ+AAIAAMHg");
    this.shape_92.setTransform(-0.6, 56.9);

    this.shape_93 = new cjs.Shape();
    this.shape_93.graphics.f("#FFFFFF").s().p("Ak+GIIAAsPIJ+AAIAAMPg");
    this.shape_93.setTransform(-0.6, 56.5);

    this.shape_94 = new cjs.Shape();
    this.shape_94.graphics.f("#FFFFFF").s().p("Ak+GMIAAsXIJ+AAIAAMXg");
    this.shape_94.setTransform(-0.6, 56);

    this.shape_95 = new cjs.Shape();
    this.shape_95.graphics.f("#FFFFFF").s().p("Ak+GQIAAsfIJ+AAIAAMfg");
    this.shape_95.setTransform(-0.6, 55.6);

    this.shape_96 = new cjs.Shape();
    this.shape_96.graphics.f("#FFFFFF").s().p("Ak+GUIAAsoIJ+AAIAAMog");
    this.shape_96.setTransform(-0.6, 55.2);

    this.shape_97 = new cjs.Shape();
    this.shape_97.graphics.f("#FFFFFF").s().p("Ak+GZIAAsxIJ+AAIAAMxg");
    this.shape_97.setTransform(-0.6, 54.8);

    this.shape_98 = new cjs.Shape();
    this.shape_98.graphics.f("#FFFFFF").s().p("Ak+GdIAAs5IJ+AAIAAM5g");
    this.shape_98.setTransform(-0.6, 54.4);

    this.shape_99 = new cjs.Shape();
    this.shape_99.graphics.f("#FFFFFF").s().p("Ak+GhIAAtBIJ+AAIAANBg");
    this.shape_99.setTransform(-0.6, 54);

    this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = this.shape_10.mask = this.shape_11.mask = this.shape_12.mask = this.shape_13.mask = this.shape_14.mask = this.shape_15.mask = this.shape_16.mask = this.shape_17.mask = this.shape_18.mask = this.shape_19.mask = this.shape_20.mask = this.shape_21.mask = this.shape_22.mask = this.shape_23.mask = this.shape_24.mask = this.shape_25.mask = this.shape_26.mask = this.shape_27.mask = this.shape_28.mask = this.shape_29.mask = this.shape_30.mask = this.shape_31.mask = this.shape_32.mask = this.shape_33.mask = this.shape_34.mask = this.shape_35.mask = this.shape_36.mask = this.shape_37.mask = this.shape_38.mask = this.shape_39.mask = this.shape_40.mask = this.shape_41.mask = this.shape_42.mask = this.shape_43.mask = this.shape_44.mask = this.shape_45.mask = this.shape_46.mask = this.shape_47.mask = this.shape_48.mask = this.shape_49.mask = this.shape_50.mask = this.shape_51.mask = this.shape_52.mask = this.shape_53.mask = this.shape_54.mask = this.shape_55.mask = this.shape_56.mask = this.shape_57.mask = this.shape_58.mask = this.shape_59.mask = this.shape_60.mask = this.shape_61.mask = this.shape_62.mask = this.shape_63.mask = this.shape_64.mask = this.shape_65.mask = this.shape_66.mask = this.shape_67.mask = this.shape_68.mask = this.shape_69.mask = this.shape_70.mask = this.shape_71.mask = this.shape_72.mask = this.shape_73.mask = this.shape_74.mask = this.shape_75.mask = this.shape_76.mask = this.shape_77.mask = this.shape_78.mask = this.shape_79.mask = this.shape_80.mask = this.shape_81.mask = this.shape_82.mask = this.shape_83.mask = this.shape_84.mask = this.shape_85.mask = this.shape_86.mask = this.shape_87.mask = this.shape_88.mask = this.shape_89.mask = this.shape_90.mask = this.shape_91.mask = this.shape_92.mask = this.shape_93.mask = this.shape_94.mask = this.shape_95.mask = this.shape_96.mask = this.shape_97.mask = this.shape_98.mask = this.shape_99.mask = mask;

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape
      }]
    }).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_17
      }]
    }, 1).to({
      state: [{
        t: this.shape_18
      }]
    }, 1).to({
      state: [{
        t: this.shape_19
      }]
    }, 1).to({
      state: [{
        t: this.shape_20
      }]
    }, 1).to({
      state: [{
        t: this.shape_21
      }]
    }, 1).to({
      state: [{
        t: this.shape_22
      }]
    }, 1).to({
      state: [{
        t: this.shape_23
      }]
    }, 1).to({
      state: [{
        t: this.shape_24
      }]
    }, 1).to({
      state: [{
        t: this.shape_25
      }]
    }, 1).to({
      state: [{
        t: this.shape_26
      }]
    }, 1).to({
      state: [{
        t: this.shape_27
      }]
    }, 1).to({
      state: [{
        t: this.shape_28
      }]
    }, 1).to({
      state: [{
        t: this.shape_29
      }]
    }, 1).to({
      state: [{
        t: this.shape_30
      }]
    }, 1).to({
      state: [{
        t: this.shape_31
      }]
    }, 1).to({
      state: [{
        t: this.shape_32
      }]
    }, 1).to({
      state: [{
        t: this.shape_33
      }]
    }, 1).to({
      state: [{
        t: this.shape_34
      }]
    }, 1).to({
      state: [{
        t: this.shape_35
      }]
    }, 1).to({
      state: [{
        t: this.shape_36
      }]
    }, 1).to({
      state: [{
        t: this.shape_37
      }]
    }, 1).to({
      state: [{
        t: this.shape_38
      }]
    }, 1).to({
      state: [{
        t: this.shape_39
      }]
    }, 1).to({
      state: [{
        t: this.shape_40
      }]
    }, 1).to({
      state: [{
        t: this.shape_41
      }]
    }, 1).to({
      state: [{
        t: this.shape_42
      }]
    }, 1).to({
      state: [{
        t: this.shape_43
      }]
    }, 1).to({
      state: [{
        t: this.shape_44
      }]
    }, 1).to({
      state: [{
        t: this.shape_45
      }]
    }, 1).to({
      state: [{
        t: this.shape_46
      }]
    }, 1).to({
      state: [{
        t: this.shape_47
      }]
    }, 1).to({
      state: [{
        t: this.shape_48
      }]
    }, 1).to({
      state: [{
        t: this.shape_49
      }]
    }, 1).to({
      state: [{
        t: this.shape_50
      }]
    }, 1).to({
      state: [{
        t: this.shape_51
      }]
    }, 1).to({
      state: [{
        t: this.shape_52
      }]
    }, 1).to({
      state: [{
        t: this.shape_53
      }]
    }, 1).to({
      state: [{
        t: this.shape_54
      }]
    }, 1).to({
      state: [{
        t: this.shape_55
      }]
    }, 1).to({
      state: [{
        t: this.shape_56
      }]
    }, 1).to({
      state: [{
        t: this.shape_57
      }]
    }, 1).to({
      state: [{
        t: this.shape_58
      }]
    }, 1).to({
      state: [{
        t: this.shape_59
      }]
    }, 1).to({
      state: [{
        t: this.shape_60
      }]
    }, 1).to({
      state: [{
        t: this.shape_61
      }]
    }, 1).to({
      state: [{
        t: this.shape_62
      }]
    }, 1).to({
      state: [{
        t: this.shape_63
      }]
    }, 1).to({
      state: [{
        t: this.shape_64
      }]
    }, 1).to({
      state: [{
        t: this.shape_65
      }]
    }, 1).to({
      state: [{
        t: this.shape_66
      }]
    }, 1).to({
      state: [{
        t: this.shape_67
      }]
    }, 1).to({
      state: [{
        t: this.shape_68
      }]
    }, 1).to({
      state: [{
        t: this.shape_69
      }]
    }, 1).to({
      state: [{
        t: this.shape_70
      }]
    }, 1).to({
      state: [{
        t: this.shape_71
      }]
    }, 1).to({
      state: [{
        t: this.shape_72
      }]
    }, 1).to({
      state: [{
        t: this.shape_73
      }]
    }, 1).to({
      state: [{
        t: this.shape_74
      }]
    }, 1).to({
      state: [{
        t: this.shape_75
      }]
    }, 1).to({
      state: [{
        t: this.shape_76
      }]
    }, 1).to({
      state: [{
        t: this.shape_77
      }]
    }, 1).to({
      state: [{
        t: this.shape_78
      }]
    }, 1).to({
      state: [{
        t: this.shape_79
      }]
    }, 1).to({
      state: [{
        t: this.shape_80
      }]
    }, 1).to({
      state: [{
        t: this.shape_81
      }]
    }, 1).to({
      state: [{
        t: this.shape_82
      }]
    }, 1).to({
      state: [{
        t: this.shape_83
      }]
    }, 1).to({
      state: [{
        t: this.shape_84
      }]
    }, 1).to({
      state: [{
        t: this.shape_85
      }]
    }, 1).to({
      state: [{
        t: this.shape_86
      }]
    }, 1).to({
      state: [{
        t: this.shape_87
      }]
    }, 1).to({
      state: [{
        t: this.shape_88
      }]
    }, 1).to({
      state: [{
        t: this.shape_89
      }]
    }, 1).to({
      state: [{
        t: this.shape_90
      }]
    }, 1).to({
      state: [{
        t: this.shape_91
      }]
    }, 1).to({
      state: [{
        t: this.shape_92
      }]
    }, 1).to({
      state: [{
        t: this.shape_93
      }]
    }, 1).to({
      state: [{
        t: this.shape_94
      }]
    }, 1).to({
      state: [{
        t: this.shape_95
      }]
    }, 1).to({
      state: [{
        t: this.shape_96
      }]
    }, 1).to({
      state: [{
        t: this.shape_97
      }]
    }, 1).to({
      state: [{
        t: this.shape_98
      }]
    }, 1).to({
      state: [{
        t: this.shape_99
      }]
    }, 1).to({
      state: [{
        t: this.shape_99
      }]
    }, 1).to({
      state: [{
        t: this.shape_99
      }]
    }, 1).wait(1));

    // Layer 8
    this.shape_100 = new cjs.Shape();
    this.shape_100.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABrgwIAAByIjVAAIAAhyQAAgHAFgFQAFgFAGAAIC0AAQAHAAAFAFQAFAFAAAHg");
    this.shape_100.setTransform(0, 10.6);

    this.shape_101 = new cjs.Shape();
    this.shape_101.graphics.f("#999999").s().p("AhqBCIAAhyQAAgHAFgFQAFgFAHAAIC0AAQAGAAAFAFQAFAFAAAHIAAByg");
    this.shape_101.setTransform(0, 10.6);

    this.shape_102 = new cjs.Shape();
    this.shape_102.graphics.f("#999999").s().p("AhqBCIAAhyQAAgHAFgFQAFgFAHAAIC0AAQAGAAAFAFQAFAFAAAHIAAByg");
    this.shape_102.setTransform(0, 10.6);

    this.shape_103 = new cjs.Shape();
    this.shape_103.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AhiA5IDFAAIAAhpQAAgIgIAAIi1AAQgIAAAAAIg");
    this.shape_103.setTransform(0, 10.6);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_103
      }, {
        t: this.shape_102
      }, {
        t: this.shape_101
      }, {
        t: this.shape_100
      }]
    }).wait(102));

    // Layer 2
    this.tube = new lib.liftTube();
    this.tube.parent = this;
    this.tube.setTransform(0, 64.9);

    this.timeline.addTween(cjs.Tween.get(this.tube).wait(102));

    // Layer 6
    this.rope = new lib.lift_rope();
    this.rope.parent = this;
    this.rope.setTransform(0, -604.8, 1.364, 1);

    this.timeline.addTween(cjs.Tween.get(this.rope).wait(102));

    // Layer 7
    this.crane = new lib.separatorCrane_anim();
    this.crane.parent = this;
    this.crane.setTransform(26, -14.3, 1.5, 1.5);

    this.timeline.addTween(cjs.Tween.get(this.crane).wait(102));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-34, -605.8, 68, 728);


  (lib.InstallBtn = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      violet: 0,
      yellow: 1,
      green: 2,
      red: 3
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      //this.hit_Area.alpha = 1;
      this.hitArea = this.hit_Area;
      this.setBounds(0, 0, 134, 42);
    }
    this.frame_1 = function() {
      this.stop();
      //this.hit_Area.alpha = 1;
      this.hitArea = this.hit_Area;
    }
    this.frame_2 = function() {
      this.stop();
    }
    this.frame_3 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1).call(this.frame_3).wait(1));

    // upgradeTxt
    this.btnText = new cjs.Text("Установите", "bold 19px 'Nunito Sans'", "#FFFFFF");
    this.btnText.name = "btnText";
    this.btnText.textAlign = "center";
    this.btnText.lineHeight = 23;
    this.btnText.lineWidth = 114;
    this.btnText.parent = this;
    this.btnText.setTransform(58.9, 2);
    this.btnText.shadow = new cjs.Shadow("rgba(0,0,0,1)", 1, 1, 0);

    this.timeline.addTween(cjs.Tween.get(this.btnText).wait(4));

    // Layer 2
    this.textLoc = new lib.btnFinal_textContainer_mc();
    this.textLoc.parent = this;
    this.textLoc.setTransform(9.5, 2.6);
    this.textLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.textLoc).wait(4));

    // Layer 4
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 1, 1).p("AqnAjQgBgIAAgGIAAgqQAAhJA6g0QA6gzBSAAIPFAAQBRAAA6AzQA6A0AABJIAAAFIABAAIAABgAKogQIAAAlQAABKg6AzQg6A0hRAAIvFAAQhSAAg6g0Qg0gugFhBAqnBQIAAgt");
    this.shape.setTransform(66.1, 18.9);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF66CC").s().p("AniDGQhSAAg6g0Qg0gugFhCIAAgNIAAgqQAAhJA5g0QA6gzBSAAIPFAAQBRAAA6AzQA6A0AABJIAAAFIAAAlQAABKg6AzQg6A0hRAAg");
    this.shape_1.setTransform(66.1, 18.9);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(4));

    // Layer 5
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 1, 1).p("AKohhQAABSgzA4QgzA5hJAAIvwAAQhJAAgzg5Qg0g4AAhR");
    this.shape_2.setTransform(66.1, 34.3);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#9B3E7C").s().p("An3CSQhJAAgzg4Qg0g6AAhQIAAgtQAFBBA0AtQA6AzBRAAIPFAAQBSAAA6gzQA6gyAAhJIAAgoIAAAAIAABiQAABQgzA6QgzA4hJAAg");
    this.shape_3.setTransform(66.1, 29.4);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }]
    }).wait(4));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-35.4, -18, 170.6, 63.2);


  (lib.FloorRedBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(0, 0, 320, 129, 4);
      this.grass.snapToPixel = true;
      this.grass.cache(0, 104, 320, 24, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 2 copy
    this.grass = new lib.floor_grass();
    this.grass.parent = this;
    this.grass.setTransform(160, 99.1, 1.006, 1, 0, 0, 0, 160, 12);

    this.timeline.addTween(cjs.Tween.get(this.grass).wait(1));

    // trees copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#A82021").s().p("AB2HhQAAg/AsgsQAtgtA+AAIAIAAQANAAANADQAYgwAmgpQAngnAvgaIAAiDQgYgJgPgWQgQgTAAgbIAAh2QAAgkAZgYQAYgZAjAAQAiAAAZAZQAYAYAAAkIAAB2QAAAegSAVQgSAWgbAGIAABsQAegKAhgFIAAiRQAAgWAQgQQARgQAXAAQAXAAAQAQQAQAQAAAWIAACRQAUADAUAFIAAkEQgfgIgUgaQgUgbAAghIAAiQQAAgpAdgcQAdgdApAAQApAAAdAdQAdAcAAApIAACQQAAAUgJAUQgIATgOAOIAABBQAAARgMAMQgMALgQAAIgIAAIAACtQA8g1BKgcQBNgeBTAAIAXAAQC5AACDCCQCCCCAAC5gAL6hsIAAA9IAJAAQAGAAAEgEQAGgFAAgGIAAg2QgNAGgMACgAl/HhIAAixQgbgIgSgVQgSgYAAgdIAAh/QAAgiAZgYQAYgZAiAAQAjAAAZAZQAXAYAAAiIAAB/QAAAdgRAYQgSAVgcAIIAACxgA30HhQAAhMA1g1QA2g2BMAAIBfAAQAhAAAfAMIAAioQgZgIgPgWQgQgWAAgaIAAhuQAAgjAYgXQAZgZAiAAQAPAAANAEIAAhfQAAgwAigiQAighAvAAQAwAAAiAhQAiAiAAAwIAACeQAAAkgUAcQgUAcggANIAABiQBBgaBGAAIBIAAQBYAABPApIAAiYIgQAAQgRAAgLgJQgMgNAAgQIAAh8QgggmAAgxIAAhnQAAg1AngnQAmgoA3AAQA2AAAnAoQAlAmAAA2IAABnQAAA4gnAnIAAA1QAAAQgLANQgMAKgRABIgQAAIAAEMQA4AzAfBFQAgBHAABPgAwvBAQAAAdgSAWQgSAXgcAHIAACCQAvhEBJgrIAAhxQgegBgagPgApqgqQAAAHAFAFQAEAEAHAAIAIAAIAAhfQgOgFgKgGgAoDh2IAAAgIALAAQAHgBAEgFQAFgDAAgHIAAgbQgNAHgOAEg");
    this.shape.setTransform(159.6, 57.6);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // back copy
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#BA2121").s().p("A5IIlIAAxKMAySAAAIAARKg");
    this.shape_1.setTransform(160, 55);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, 0, 322, 111.1);


  (lib.floorBlueBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(0, 0, 320, 129, 4);
      this.grass.snapToPixel = true;
      this.grass.cache(0, 104, 320, 24, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 2 copy
    this.grass = new lib.floor_grass();
    this.grass.parent = this;
    this.grass.setTransform(160, 99.1, 1.006, 1, 0, 0, 0, 160, 12);

    this.timeline.addTween(cjs.Tween.get(this.grass).wait(1));

    // trees copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#3E8AD6").s().p("AB2HhQAAg/AsgsQAtgtA+AAIAIAAQANAAANADQAYgwAmgpQAngnAvgaIAAiDQgYgJgPgWQgQgTAAgbIAAh2QAAgkAZgYQAYgZAjAAQAiAAAZAZQAYAYAAAkIAAB2QAAAegSAVQgSAWgbAGIAABsQAegKAhgFIAAiRQAAgWAQgQQARgQAXAAQAXAAAQAQQAQAQAAAWIAACRQAUADAUAFIAAkEQgfgIgUgaQgUgbAAghIAAiQQAAgpAdgcQAdgdApAAQApAAAdAdQAdAcAAApIAACQQAAAUgJAUQgIATgOAOIAABBQAAARgMAMQgMALgQAAIgIAAIAACtQA8g1BKgcQBNgeBTAAIAXAAQC5AACDCCQCCCCAAC5gAL6hsIAAA9IAJAAQAGAAAEgEQAGgFAAgGIAAg2QgNAGgMACgAl/HhIAAixQgbgIgSgVQgSgYAAgdIAAh/QAAgiAZgYQAYgZAiAAQAjAAAZAZQAXAYAAAiIAAB/QAAAdgRAYQgSAVgcAIIAACxgA30HhQAAhMA1g1QA2g2BMAAIBfAAQAhAAAfAMIAAioQgZgIgPgWQgQgWAAgaIAAhuQAAgjAYgXQAZgZAiAAQAPAAANAEIAAhfQAAgwAigiQAighAvAAQAwAAAiAhQAiAiAAAwIAACeQAAAkgUAcQgUAcggANIAABiQBBgaBGAAIBIAAQBYAABPApIAAiYIgQAAQgRAAgLgJQgMgNAAgQIAAh8QgggmAAgxIAAhnQAAg1AngnQAmgoA3AAQA2AAAnAoQAlAmAAA2IAABnQAAA4gnAnIAAA1QAAAQgLANQgMAKgRABIgQAAIAAEMQA4AzAfBFQAgBHAABPgAwvBAQAAAdgSAWQgSAXgcAHIAACCQAvhEBJgrIAAhxQgegBgagPgApqgqQAAAHAFAFQAEAEAHAAIAIAAIAAhfQgOgFgKgGgAoDh2IAAAgIALAAQAHgBAEgFQAFgDAAgHIAAgbQgNAHgOAEg");
    this.shape.setTransform(159.6, 57.6);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // back copy
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#4D9DEE").s().p("A5IIlIAAxKMAySAAAIAARKg");
    this.shape_1.setTransform(160, 55);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, 0, 322, 111.1);


  (lib.FloorBlackBG = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      /*
      this.snapToPixel = true;
      this.cache(0, 0, 320, 129, 4);
      this.grass.snapToPixel = true;
      this.grass.cache(0, 104, 320, 24, 4);
      */
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 2 copy
    this.grass = new lib.floor_grass();
    this.grass.parent = this;
    this.grass.setTransform(160, 99.1, 1.006, 1, 0, 0, 0, 160, 12);

    this.timeline.addTween(cjs.Tween.get(this.grass).wait(1));

    // trees copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#252525").s().p("AB2HhQAAg/AsgsQAtgtA+AAIAIAAQANAAANADQAYgwAmgpQAngnAvgaIAAiDQgYgJgPgWQgQgTAAgbIAAh2QAAgkAZgYQAYgZAjAAQAiAAAZAZQAYAYAAAkIAAB2QAAAegSAVQgSAWgbAGIAABsQAegKAhgFIAAiRQAAgWAQgQQARgQAXAAQAXAAAQAQQAQAQAAAWIAACRQAUADAUAFIAAkEQgfgIgUgaQgUgbAAghIAAiQQAAgpAdgcQAdgdApAAQApAAAdAdQAdAcAAApIAACQQAAAUgJAUQgIATgOAOIAABBQAAARgMAMQgMALgQAAIgIAAIAACtQA8g1BKgcQBNgeBTAAIAXAAQC5AACDCCQCCCCAAC5gAL6hsIAAA9IAJAAQAGAAAEgEQAGgFAAgGIAAg2QgNAGgMACgAl/HhIAAixQgbgIgSgVQgSgYAAgdIAAh/QAAgiAZgYQAYgZAiAAQAjAAAZAZQAXAYAAAiIAAB/QAAAdgRAYQgSAVgcAIIAACxgA30HhQAAhMA1g1QA2g2BMAAIBfAAQAhAAAfAMIAAioQgZgIgPgWQgQgWAAgaIAAhuQAAgjAYgXQAZgZAiAAQAPAAANAEIAAhfQAAgwAigiQAighAvAAQAwAAAiAhQAiAiAAAwIAACeQAAAkgUAcQgUAcggANIAABiQBBgaBGAAIBIAAQBYAABPApIAAiYIgQAAQgRAAgLgJQgMgNAAgQIAAh8QgggmAAgxIAAhnQAAg1AngnQAmgoA3AAQA2AAAnAoQAlAmAAA2IAABnQAAA4gnAnIAAA1QAAAQgLANQgMAKgRABIgQAAIAAEMQA4AzAfBFQAgBHAABPgAwvBAQAAAdgSAWQgSAXgcAHIAACCQAvhEBJgrIAAhxQgegBgagPgApqgqQAAAHAFAFQAEAEAHAAIAIAAIAAhfQgOgFgKgGgAoDh2IAAAgIALAAQAHgBAEgFQAFgDAAgHIAAgbQgNAHgOAEg");
    this.shape.setTransform(159.6, 57.6);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // back copy
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#191919").s().p("A5IIlIAAxKMAySAAAIAARKg");
    this.shape_1.setTransform(160, 55);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, 0, 322, 111.1);


  (lib.Floor = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      this.setBounds(0, 0, 320, 111);
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // bg
    this.instance = new lib.floorBlueBG();
    this.instance.parent = this;

    this.instance_1 = new lib.FloorRedBG();
    this.instance_1.parent = this;

    this.instance_2 = new lib.FloorBlackBG();
    this.instance_2.parent = this;

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.instance
      }]
    }).to({
      state: [{
        t: this.instance_1
      }]
    }, 1).to({
      state: [{
        t: this.instance_2
      }]
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, 0, 322, 111.1);


  (lib.DugPoint = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.instance = new lib.Rectangle_7();
    this.instance.parent = this;
    this.instance.setTransform(1.6, 41.6, 1, 1, 0, 0, 0, 32, 2);
    this.instance.alpha = 0.328;

    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAUhZQADAAAEADQADADAAAEIAACfQAAADgDADQgEAEgDAAIgnAAQgDAAgEgEQgDgDAAgDIAAifQAAgEADgDQAEgDADAAg");
    this.shape.setTransform(-34.4, 43.6);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#B0BBBF").s().p("AgMBbIAAi1IAZAAIAAC1g");
    this.shape_1.setTransform(-36.1, 43.6);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#D6D6D6").s().p("AgRBbQgHgBgFgFQgGgFAAgHIAAiQQAAgIAGgFQAFgGAHAAIAjAAQAHAAAGAGQAFAFAAAIIAACQQAAAHgFAFQgGAFgHABg");
    this.shape_2.setTransform(-34.4, 43.6);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("rgba(255,255,255,0.329)").s().p("AgGAfQgCgDgBgDIAAgxQABgDACgEQAEgCACgBQADABAEACQACAEAAADIAAAxQAAADgCADQgEAEgDAAQgCAAgEgEg");
    this.shape_3.setTransform(0.4, 25.5);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AgGAMQgCgEAAgDIAAgIQAAgFACgCQADgDADAAQADAAAEADQACACAAAFIAAAIQAAADgCAEQgEADgDAAQgDAAgDgDg");
    this.shape_4.setTransform(0.4, 22.5);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABkgTQAIAAAFAGQAHAGAAAHQAAAIgHAFQgFAHgIAAIjHAAQgHAAgGgHQgHgFAAgIQAAgHAHgGQAGgGAHAAg");
    this.shape_5.setTransform(2.4, 3);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#B0BBBF").s().p("AhjAUQgHAAgGgHQgHgFABgIQgBgHAHgGQAGgFAHgBIDGAAQAJABAGAFQAFAGABAHQgBAIgFAFQgGAHgJAAg");
    this.shape_6.setTransform(2.4, 3);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#D6D6D6").s().p("AgyARQgWgXABgiICPAAQABAigWAXQgVAYgeAAQgdAAgVgYg");
    this.shape_7.setTransform(0.7, 9.7);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABkgxIjGAAQAEArAcAaQAdAeAlAAQAnAAAcgeQAdgaAEgrg");
    this.shape_8.setTransform(2.3, 10);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#B0BBBF").s().p("AhCAVQgdgbgDgqIDFAAQgDAqgdAbQgdAdgmAAQgmAAgcgdg");
    this.shape_9.setTransform(2.4, 10);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAyhFIAACLIhjAAIAAiLg");
    this.shape_10.setTransform(2.4, 26);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#999999").s().p("AgwBGIAAiLIBiAAIAACLg");
    this.shape_11.setTransform(2.4, 26);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABGgxIAABZQAAADgDADQgEAEgDAAIh3AAQgDAAgEgEQgDgDAAgDIAAhZg");
    this.shape_12.setTransform(2.4, 14);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#B0BBBF").s().p("AgUAeIAAg7IApAAIAAA7g");
    this.shape_13.setTransform(-1.8, 15.5);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#D6D6D6").s().p("AhBAxIAAhiICDAAIAABig");
    this.shape_14.setTransform(2.4, 14);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABGAUIiLAAIAAgdQAAgEADgCQAEgEADAAIB3AAQADAAAEAEQADACAAAEg");
    this.shape_15.setTransform(2.4, 35);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#D6D6D6").s().p("AhPAdIAAgmQABgIAFgGQAGgFAJAAIB2AAQAIAAAFAFQAHAGgBAIIAAAmg");
    this.shape_16.setTransform(2.4, 35);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AlnA8ILPAAIAAh3IrPAAg");
    this.shape_17.setTransform(1.6, 43.6);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#999999").s().p("AlmA7IAAh1ILOAAIAAB1g");
    this.shape_18.setTransform(1.6, 43.6);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }, {
        t: this.instance
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-38.4, 0, 77, 53.6);


  (lib.Cursor = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "loop": 1
    });

    // timeline functions:
    this.frame_0 = function() {
      this.cursor.snapToPixel = true;
      this.cursor.cache(-19, -31, 38, 62, 4);
    }
    this.frame_29 = function() {
      this.gotoAndPlay("loop");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(29).call(this.frame_29).wait(1));

    // Layer 2
    this.instance = new lib.cursorWave_mc();
    this.instance.parent = this;
    this.instance.setTransform(-0.8, -4.8);
    this.instance._off = true;

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(14).to({
      _off: false
    }, 0).to({
      scaleX: 1.38,
      scaleY: 1.38,
      alpha: 0.012
    }, 6).to({
      _off: true
    }, 2).wait(8));

    // Layer 1
    this.cursor = new lib.cursorShp();
    this.cursor.parent = this;
    this.cursor.setTransform(-9.7, 46.2);

    this.timeline.addTween(cjs.Tween.get(this.cursor).to({
      y: 26.2
    }, 14).wait(3).to({
      y: 44.6
    }, 12).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-29.4, 14.2, 39.3, 64);


  (lib.cow_unicorn = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.cow_unicorn.snapToPixel = true;
      this.cow_unicorn.cache(-1, -1, 105, 80, 4);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 1
    this.cow_unicorn = new lib.cow_unicorn_mc();
    this.cow_unicorn.parent = this;
    this.cow_unicorn.setTransform(53, 36.8, 1, 1, 0, 0, 0, 51.6, 35.6);

    this.timeline.addTween(cjs.Tween.get(this.cow_unicorn).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0.4, -2.2, 105.3, 78);


  (lib.cow_rainbow_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AgdgdIAAAdQAAAMAJAJQAJAJALAAQAMAAAIgJQAKgJAAgMIAAgdg");
    this.shape.setTransform(28, 54.1);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF6348").s().p("AgUAVQgJgJABgMIAAgdIA6AAIAAAdQgBAMgIAJQgJAIgMABQgLgBgJgIg");
    this.shape_1.setTransform(28, 54.1);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(2, 1, 1).p("AAZAMQAAgKgIgGQgHgHgKAAQgJAAgHAHQgIAGAAAK");
    this.shape_2.setTransform(29.2, 25.6);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f().s("#253453").ss(2, 1, 1).p("AAZAMQAAgKgIgGQgHgHgKAAQgJAAgHAHQgIAGAAAK");
    this.shape_3.setTransform(16.2, 25.6);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#61FFCA").s().p("AgOAHIgEghIAdgDQAFAPADAQIAAAaIgYACg");
    this.shape_4.setTransform(34.4, 18.2);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#61FFCA").s().p("AgZAgIgEhBIA7AAIgMBDg");
    this.shape_5.setTransform(31, 18.5);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#61FFCA").s().p("AgZAbIADg3IAwACIgLA3g");
    this.shape_6.setTransform(26, 18.2);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#61FFCA").s().p("AgVgaIAlgEIAGA5IglAEg");
    this.shape_7.setTransform(20.8, 17);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#61FFCA").s().p("AgXAcIADg5IAsACIgEA5g");
    this.shape_8.setTransform(16.6, 17.9);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#61FFCA").s().p("AgXAVIgBgUIAxgaIgNA0g");
    this.shape_9.setTransform(12.3, 18.8);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#EABD4E").s().p("AgOAHIgEghIAdgDQAFAPADAPIAAAaIgYADg");
    this.shape_10.setTransform(34.4, 20.2);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#EABD4E").s().p("AgZAfIgEhAIA7ABIgMBCg");
    this.shape_11.setTransform(31, 20.5);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#EABD4E").s().p("AgaAXIgCgaIA5gVIgPAwg");
    this.shape_12.setTransform(26.1, 20.7);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#EABD4E").s().p("AgggKIBBgUIgNA4IgmAFg");
    this.shape_13.setTransform(21.1, 19.1);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#EABD4E").s().p("AgXAcIADg5IAsACIgEA5g");
    this.shape_14.setTransform(16.6, 19.9);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#EABD4E").s().p("AgYAQIABgYIAwgRIgMAzg");
    this.shape_15.setTransform(12.3, 20.8);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#253453").s().p("AgVAWQgDgDAAgEQAAgEADgDIAdgdQADgDAEAAQAEAAADADQADADAAAEQAAAEgDADIgdAdQgDADgEAAQgEAAgDgDg");
    this.shape_16.setTransform(31.7, 40.7);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#253453").s().p("AAIAWIgdgdQgDgDAAgEQAAgEADgDQADgDAEAAQAEAAADADIAdAdQADADAAAEQAAAEgDADQgDADgEAAQgEAAgDgDg");
    this.shape_17.setTransform(31.7, 40.7);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#253453").s().p("AgVAWQgDgDAAgEQAAgEADgDIAdgdQADgDAEAAQAEAAADADQADADAAAEQAAAEgDADIgdAdQgDADgEAAQgEAAgDgDg");
    this.shape_18.setTransform(14.8, 40.7);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#253453").s().p("AAIAWIgdgdQgDgDAAgEQAAgEADgDQADgDAEAAQAEAAADADIAdAdQADADAAAEQAAAEgDADQgDADgEAAQgEAAgDgDg");
    this.shape_19.setTransform(14.8, 40.7);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABPBgIidAAQgnAAgbgbQgcgcAAgmIAAgFQAAgmAcgcQAbgbAnAAICdAAQAnAAAbAbQAcAcAAAmIAAAFQAAAmgcAcQgbAbgnAAg");
    this.shape_20.setTransform(23, 40.7);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFA766").s().p("AhOBgQgnAAgbgbQgcgcAAgmIAAgFQAAgmAcgcQAbgbAnAAICdAAQAnAAAbAbQAcAcAAAmIAAAFQAAAmgcAcQgbAbgnAAg");
    this.shape_21.setTransform(23, 40.7);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#61FFCA").s().p("AgNATQACgXALgYIAIgBIAGA4IgcADg");
    this.shape_22.setTransform(11.3, 15.9);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFEF7D").s().p("AiDByIAAjVIAAgDIABgLIEFAAIABAOIAADVg");
    this.shape_23.setTransform(23, 29.4);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#61FFCA").s().p("AiDCtIAAjVIAAgCIABgLQACgaANgYQARggAfgSQAfgUAkAAIAAAAQAqAAAiAZQAiAXAOAnQAGAPABASIABANIAADVg");
    this.shape_24.setTransform(23, 23.4);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#253453").s().p("AiXDCIAAjqIAAgDIABgMQADgeAOgcQAUglAkgVQAkgWApAAIAAAAQAvAAAoAcQAnAbARAtQAGAQACAVIABD6gAhDiaQgfATgRAgQgNAYgCAaIgBALIAAACIAADWIEHAAIAAjWIgBgNQgBgRgGgQQgOgngigXQgigZgqAAIAAAAQgkAAgfATg");
    this.shape_25.setTransform(23, 23.3);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FFFFFF").s().p("AiDCuIAAjWIAAgCIABgLQACgaANgYQARggAfgTQAfgTAkAAIAAAAQAqAAAiAZQAiAXAOAnQAGAQABARIABANIAADWg");
    this.shape_26.setTransform(23, 23.3);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAAA+QgJAAgIgIQgIgHAAgLIAAhHQAAgLAIgHQAIgIAJAAQAKAAAJAIQAHAHAAALIAABHQAAALgHAHQgJAIgKAAg");
    this.shape_27.setTransform(30.9, 6.3);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FDFFB5").s().p("AgRA2QgIgHAAgLIAAhHQAAgLAIgHQAHgIAKAAQALAAAHAIQAIAHAAALIAABHQAAALgIAHQgHAIgLAAQgKAAgHgIg");
    this.shape_28.setTransform(30.9, 6.3);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAAA+QgJAAgIgIQgIgHAAgLIAAhHQAAgLAIgHQAIgIAJAAQALAAAHAIQAIAHAAALIAABHQAAALgIAHQgHAIgLAAg");
    this.shape_29.setTransform(15.2, 6.3);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FDFFB5").s().p("AgSA2QgHgHAAgLIAAhHQAAgLAHgHQAIgIAKAAQAKAAAIAIQAIAHAAALIAABHQAAALgIAHQgIAIgKAAQgKAAgIgIg");
    this.shape_30.setTransform(15.2, 6.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_30
      }, {
        t: this.shape_29
      }, {
        t: this.shape_28
      }, {
        t: this.shape_27
      }, {
        t: this.shape_26
      }, {
        t: this.shape_25
      }, {
        t: this.shape_24
      }, {
        t: this.shape_23
      }, {
        t: this.shape_22
      }, {
        t: this.shape_21
      }, {
        t: this.shape_20
      }, {
        t: this.shape_19
      }, {
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 3
    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_31.setTransform(76, 67.7);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgMALgPAAQgOAAgMgLQgMgMAAgQIAAie");
    this.shape_32.setTransform(76, 61.3);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FF5A72").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_33.setTransform(76, 61.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_33
      }, {
        t: this.shape_32
      }, {
        t: this.shape_31
      }]
    }).wait(1));

    // Layer 4
    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_34.setTransform(44.6, 67.3);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgMALgPAAQgOAAgMgLQgMgMAAgQIAAie");
    this.shape_35.setTransform(44.6, 61);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FF5A72").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_36.setTransform(44.6, 61);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_36
      }, {
        t: this.shape_35
      }, {
        t: this.shape_34
      }]
    }).wait(1));

    // Layer 6
    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgaAAgSgTQgUgRAAgbIBxAAg");
    this.shape_37.setTransform(37.9, 16.7, 1, 1, 0, 0, 180);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FF6E79").s().p("AAIAgQgaAAgSgTQgTgRAAgbIBwAAIAAA/g");
    this.shape_38.setTransform(37.9, 16.7, 1, 1, 0, 0, 180);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_38
      }, {
        t: this.shape_37
      }]
    }).wait(1));

    // Layer 5
    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#FFFFFF").s().p("AgYBIIABgWIAAANIAAAKIgBACgAAZhKIAAABIgFAIg");
    this.shape_39.setTransform(30.6, 29.8);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FF5A72").s().p("AguA3QgzAAgtgUQgtgVghgiIAkACIACgkIACAAIADAdIAngDIgBgOIASgCIgCAUIAnAFIABgKIAnABIACgaIACAAIADAdIAlgDIAAgEIAoACIACgYIAAAAIACAiIAuACIAFgdIACAWIAngDIgBgOIASgCIgCAUIAnAFIABgKIAnABIgGAAIgPARQggAegrARQgrATgwAAgAjqgmIAGgOIgBAUIADAFgADog2IACAAIABALIgEAHgAgBg2IABAAIAAAKg");
    this.shape_40.setTransform(56.1, 54.9);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f("#61FFCA").s().p("Aj9A/QAJgTAMgQIACgCIAGgIIAAgBIAKgMIAFgEIACgBIAFgEQAggeAogRQAqgRAuAAIBZAAQBcAABEA/QARAOALAQIACADIgCAAIgBAaIgngCIgCAKIgmgEIACgUIgTACIACANIgnAEIgCgWIgGAdIgtgDIgCghIgBAAIgBAYIgpgCIABADIglAEIgDgdIgDAAIgBAaIgngCIgBAKIgngEIACgUIgSACIABANIgnAEIgDgdIgCAAIgCAkIgugDIACgfIgRAngAACAmIABgKIgCAAgADuAdQAJANAHAOIgNABg");
    this.shape_41.setTransform(55.7, 20.5);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FFA766").s().p("AAuBRIgCgiIgBAAIgBAZIgpgCIABADIglAEIgDgeIgDAAIgBAaIgogBIgBAKIgmgEIACgVIgTADIACANIgnAEIgDgeIgDAAIgCAkIgjgCIgGgHIgEgEIABgUIgGANQgFgGgFgKIgBAAQgLgSgGgPQgNgfgDgiIAhAPIASgoIgCAgIAtADIACgpIACAAIAEAjIAngFIgCgMIATgDIgCAVIAmADIABgKIAoACIABgfIACAAIAEAjIAlgFIgBgCIApABIABgdIABAAIACAmIAtADIAFgeIADAYIAngFIgCgMIATgDIgCAVIAmADIABgKIAoACIABgfIACAAIAEAjIAngFIAAgDIAAACQgDAmgPAfQgFANgLASIAAAAIgHAMIgBgMIgDAAIAAASIgBAAIAAAIIgogBIgBAKIgmgEIACgVIgTADIACANIgnAEIgDgXIgFAdgAAAA5IABgKIgBAAgAAAhSIABAAIgBAPgAkVhSIAEAAIgEAKg");
    this.shape_42.setTransform(55.9, 44.6);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f("#FFEF7D").s().p("AkVBIIAAgCIgBgSIABgCIAEgKIgEAAIAAgMQADgoASgmIAMAFIARgnIgBAgIAtACIACgkIADAAIADAdIAngDIgCgOIATgCIgCAUIAmAFIABgKIAoACIABgbIADAAIADAdIAlgDIgBgEIApADIABgZIABAAIACAiIAtACIAFgdIADAWIAngDIgCgOIATgCIgCAUIAmAFIABgKIAoACIABgbIACAAIABAAIAAABIADAcIANgBQASAhAGAmIADAkIAAAPIgBADIAAAEIgnAEIgEgjIgCAAIgBAgIgogCIgBAKIgmgEIACgUIgTACIACANIgnAEIgDgXIgFAeIgtgDIgCgnIgBAAIgBAeIgpgCIABADIglAEIgEgjIgCAAIgBAgIgogCIgBAKIgmgEIACgUIgTACIACANIgnAEIgEgjIgCAAIgCAqIgtgDIACggIgSAngAAAA4IABgQIgBAAgAAAhWIABAAIgBAKg");
    this.shape_43.setTransform(55.9, 32.1);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#253453").s().p("AgsD+QgaAAgYgFQgbgGgagLQgygWgkgoIgbgkIgBgCQgKgPgIgUQgOgjgEglIgBgZIABgVQADgtAUgqQALgVAMgRIAhgmQAkghAsgSQAtgSAxAAIBZAAQAwAAAtASQAtASAjAhQAQAOAPAUIACADIACACQAJANAIAQQATAjAHAsIACAPQABAMAAAKIgBAXQgDAogQAkQgIATgJAOIgBACIgNASIAAABIgXAaQgkAkgvAUQgWAJgYAFQgZAFgaAAgAiEjYQgoARggAeIgGAFIgBACIgFAEIgKAMIgGAJIgDACQgLAQgKATQgSAmgDAqIgBAUIAAADIABASIAAACQADAhANAhQAGAPALASIABABQAFAJAFAHIAJAKIAGAIQAhAkAsAUQAuAVAzAAIBZAAQAvAAAsgTQAqgRAgghIAQgQIAGAAIAAgJIABAAIAEgGIAHgLIAAgBQALgRAFgOQAPghADglIAAgDIABgEIAAgOIgDgiQgGgogSghQgHgOgJgNIAAgBIgBAAIgCgDQgMgQgQgQQhEg/hcAAIhZAAQguAAgqARg");
    this.shape_44.setTransform(55.9, 37);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_44
      }, {
        t: this.shape_43
      }, {
        t: this.shape_42
      }, {
        t: this.shape_41
      }, {
        t: this.shape_40
      }, {
        t: this.shape_39
      }]
    }).wait(1));

    // Layer 7
    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA5AgIgxAAQgaAAgSgTQgUgRAAgbIBxAAg");
    this.shape_45.setTransform(5.7, 16.7);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FF6E79").s().p("AAIAgQgaAAgSgTQgTgRAAgbIBwAAIAAA/g");
    this.shape_46.setTransform(5.7, 16.7);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_46
      }, {
        t: this.shape_45
      }]
    }).wait(1));

    // Layer 8
    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#253453").s().p("AAABOQgIANgQAAIgKgBQgKgEgFgJQgGgJABgKIgIABQgSAAgJgPQgFgLACgLQACgLAJgHIgBgLQAAgiAYgZQAZgYAhAAQAiAAAZAYQAZAZAAAiIgBALQAIAHADALQACAMgGAKQgJAPgSAAIgIgBQABAKgFAJQgGAJgKAEIgKABQgQAAgJgNgAAPBAQACAHAIABIADgBQAFgCACgEQABgEgBgEIgEgKQALgGAHgIIAJAEIAFACQAHAAADgFQACgEgBgEQgBgFgEgCIgJgGQAEgKAAgKQAAgagTgTQgTgSgaAAQgZAAgTASQgSATAAAaQAAAKAEAKIgKAGQgDACgBAFQgBAEACAEQADAFAGAAQADAAACgCIAJgEQAIAIAKAGIgEAKQgBAEACAEQACAEAEACIADABQAHgBAEgHIADgKIAKABIALgBg");
    this.shape_47.setTransform(61.7, 61.2);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FFEF7D").s().p("AgcBHQgEgCgBgEQgCgEABgEIADgKQgKgGgHgIIgJAFQgEACgEgBQgEgBgDgEQgCgEABgEQABgEAEgDIAKgFQgEgLAAgJQAAgbASgSQATgTAZAAQAaAAATATQASATABAaQAAAJgFALIAJAFQAFADABAEQAAAEgBAEQgDAEgEABQgFABgEgCIgJgFQgHAIgKAGIAEAKQABAEgBAEQgDAEgEACQgEABgEgBQgEgCgCgFIgDgJIgLABIgKgBIgDAJQgDAHgHAAIgFAAg");
    this.shape_48.setTransform(61.8, 61.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_48
      }, {
        t: this.shape_47
      }]
    }).wait(1));

    // Layer 9
    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_49.setTransform(68.3, 67.7);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgMALgPAAQgOAAgMgLQgMgMAAgQIAAie");
    this.shape_50.setTransform(68.3, 61.3);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f("#FF5A72").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_51.setTransform(68.3, 61.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_51
      }, {
        t: this.shape_50
      }, {
        t: this.shape_49
      }]
    }).wait(1));

    // Layer 10
    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_52.setTransform(36.9, 67.3);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgMALgPAAQgOAAgMgLQgMgMAAgQIAAie");
    this.shape_53.setTransform(36.9, 61);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FF5A72").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_54.setTransform(36.9, 61);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_54
      }, {
        t: this.shape_53
      }, {
        t: this.shape_52
      }]
    }).wait(1));

    // Layer 1
    this.instance = new lib.cow_First_tail();
    this.instance.parent = this;
    this.instance.setTransform(86.2, 35.3, 1, 1, 0, 0, 0, 7.7, 9.5);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, -1, 96.5, 73.3);


  (lib.cow_rainbow = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.cow_rainbow.snapToPixel = true;
      this.cow_rainbow.cache(-1, -1, 105, 100, 4);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 1
    this.cow_rainbow = new lib.cow_rainbow_mc();
    this.cow_rainbow.parent = this;
    this.cow_rainbow.setTransform(43.9, 37.1, 1, 1, 0, 0, 0, 42.5, 35.6);

    this.timeline.addTween(cjs.Tween.get(this.cow_rainbow).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(0.4, 0.5, 96.5, 73.3);


  (lib.cow_austronaut_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape.setTransform(47.9, 61.3);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgOAAgMgLQgLgMAAgQIAAie");
    this.shape_1.setTransform(47.9, 54.9);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#D4E2E8").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_2.setTransform(47.9, 54.9);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_3.setTransform(83.5, 61.1);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgOAAgMgLQgLgMAAgQIAAie");
    this.shape_4.setTransform(83.5, 54.7);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#D4E2E8").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_5.setTransform(83.5, 54.7);

    this.instance = new lib.CompoundPath_0();
    this.instance.parent = this;
    this.instance.setTransform(23, 18.2, 1, 1, 0, 0, 0, 14.8, 10.3);
    this.instance.alpha = 0.18;

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f().s("#253453").ss(2, 1, 1).p("AASAJQAAgIgGgDQgFgGgHAAQgGAAgFAGQgGADAAAI");
    this.shape_6.setTransform(31.7, 13.8);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#253453").ss(2, 1, 1).p("AASAJQAAgIgGgDQgFgGgHAAQgGAAgGAGQgFADAAAI");
    this.shape_7.setTransform(22.1, 13.8);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AgBBFQgQAGgOgLQgPgKAAgRIAAhKQAAgQAOgKQANgKAQAEQAWAHANAUQAPATAAAXQAAAXgNAUQgOATgVAHg");
    this.shape_8.setTransform(48, 17.7);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#D4E2E8").s().p("AggBAQgOgKAAgRIAAhKQAAgQANgKQAOgKAQAEQAVAHAOAUQAPATAAAXQAAAXgNAUQgOATgVAHQgGACgFAAQgKAAgKgHg");
    this.shape_9.setTransform(48, 17.7);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("AgBATQgGAAgEgHQgDgGABgHQABgIAFgFQAFgFAEAAQAGABADAGQAEAHgBAGQgBAIgFAGQgEAFgEAAIgBgBg");
    this.shape_10.setTransform(11.3, 18.6);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("AgWAYQgHgIABgMQACgLAKgJQAKgKAKgBQAMgCAIAGQAHAIgCAMQgCAKgKAKQgKAKgKABIgFABQgJAAgFgFg");
    this.shape_11.setTransform(13.8, 12.9);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAki1IhGAAQhLAAg1A1Qg0A2AABKQAABLA0A2QA1A1BLAAIBGAAQBKAAA1g1QA1g2AAhLQAAhKg1g2Qg1g1hKAAgAB6AAQAAAvgdAhQgdAhgpAAIhwAAQgqAAgdghQgdghAAgvQAAguAdghQAdgiAqAAIBwAAQApAAAdAiQAdAhAAAug");
    this.shape_12.setTransform(26.4, 18.3);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#D4E2E8").s().p("AgiC2QhLAAg1g1Qg1g2ABhLQgBhKA1g2QA1g1BLAAIBGAAQBKAAA1A1QA0A2ABBKQgBBLg0A2Qg1A1hKAAgAighPQgdAhAAAuQAAAvAdAhQAdAhAqAAIBvAAQAqAAAdghQAdghAAgvQAAgugdghQgdgigqAAIhvAAQgqAAgdAig");
    this.shape_13.setTransform(26.4, 18.3);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#253453").s().p("AgIAVQgEgEAAgFIAAgXQAAgGAEgEQAEgDAEAAQAFAAAEADQAEAEAAAGIAAAXQAAAFgEAEQgEAEgFAAQgEAAgEgEg");
    this.shape_14.setTransform(34, 26.7);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#253453").s().p("AgIAVQgEgEAAgFIAAgXQAAgGAEgEQAEgDAEAAQAFAAAEADQAEAEAAAGIAAAXQAAAFgEAEQgEAEgFAAQgEAAgEgEg");
    this.shape_15.setTransform(20.5, 26.7);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AA7BIIh1AAQgdAAgUgVQgUgUAAgdIAAgDQAAgdAUgUQAUgVAdAAIB1AAQAdAAAUAVQAVAUAAAdIAAADQAAAdgVAUQgUAVgdAAg");
    this.shape_16.setTransform(27.3, 26.7);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFB2B2").s().p("Ag6BIQgdAAgUgVQgVgUAAgdIAAgDQAAgdAVgUQAUgVAdABIB1AAQAdgBAUAVQAUAUAAAdIAAADQAAAdgUAUQgUAVgdAAg");
    this.shape_17.setTransform(27.3, 26.7);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABiCBIjDAAIAAifQAAgpAdgcQAdgdAnAAQApAAAcAdQAdAcAAApg");
    this.shape_18.setTransform(27.2, 15.7);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("AhhCBIAAifQAAgpAdgcQAdgdAnAAQApAAAcAdQAdAcAAApIAACfg");
    this.shape_19.setTransform(27.2, 15.7);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#365387").s().p("AgiC2QhLAAg1g1Qg1g2ABhLQgBhKA1g2QA1g1BLAAIBGAAQBKAAA1A1QA0A2ABBKQgBBLg0A2Qg1A1hKAAg");
    this.shape_20.setTransform(27.6, 18.3);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f().s("#253453").ss(2, 0, 0, 4).p("ABlAAQAAAlgYAbQgYAbgjAAIhdAAQgiAAgYgbQgZgbAAglQAAgkAZgbQAYgaAiAAIBdAAQAjAAAYAaQAYAbAAAkgAAeiQIg7AAQg+AAgsAqQgsArAAA7QAAA8AsArQAsArA+AAIA7AAQA9AAAsgrQAtgrAAg8QAAg7gtgrQgsgqg9AAg");
    this.shape_21.setTransform(29.3, 25.2);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#D4E2E8").s().p("AgdCRQg9AAgsgrQgtgqABg8QgBg7AtgrQAsgqA9AAIA7AAQA9AAAtAqQAsArAAA7QAAA8gsAqQgtArg9AAgAiFg/QgZAaAAAlQAAAlAZAbQAYAaAiABIBeAAQAigBAYgaQAZgbgBglQABglgZgaQgYgagiAAIheAAQgiAAgYAag");
    this.shape_22.setTransform(29.3, 25.2);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAChEQARgGAOALQAOAKAAARIAABKQAAAQgNAKQgOAKgQgEQgVgHgOgUQgPgTAAgYQAAgWAOgUQANgTAVgHg");
    this.shape_23.setTransform(4.8, 17.7);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#D4E2E8").s().p("AAEBGQgVgHgPgUQgOgTAAgYQAAgWAOgUQAOgTAUgHQAQgGAPALQAOAKAAARIAABKQAAAQgNAKQgKAHgKAAIgKgBg");
    this.shape_24.setTransform(4.8, 17.7);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJASIgSAAQgHAAAAgIIAAgTQAAgHAHAAIASAAQADAAADACQACACAAADIAAATQAAADgCACQgDADgDAAg");
    this.shape_25.setTransform(67.3, 42);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#DBD1D2").s().p("AgJASQgHgBAAgHIAAgSQAAgJAHABIASAAQADgBADADQADACAAAEIAAASQAAADgDACQgDACgDABg");
    this.shape_26.setTransform(67.3, 42);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAIAiIgPAAQgHAAgEgFQgEgFACgGIAIgnQACgMAKAAQAGAAAEAEQAEADAAAFIAHAnQABAGgEAFQgEAFgGAAg");
    this.shape_27.setTransform(67.2, 46.2);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#DBD1D2").s().p("AgHAiQgHAAgEgFQgEgFACgGIAIgnQACgMAKAAQAGAAAEAEQAEADAAAFIAHAnQABAGgEAFQgEAFgGAAg");
    this.shape_28.setTransform(67.2, 46.2);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJgIIgRAR");
    this.shape_29.setTransform(67.2, 43.4);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJgIIgRAR");
    this.shape_30.setTransform(68.9, 45);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJgIIgQAR");
    this.shape_31.setTransform(70.7, 46.6);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJgIIgRAR");
    this.shape_32.setTransform(72.4, 48.2);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJgIIgRAR");
    this.shape_33.setTransform(74.1, 49.9);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAJgIIgRAR");
    this.shape_34.setTransform(75.8, 51.5);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f().s("#253453").ss(1, 0, 0, 4).p("Ag0gxIBpBj");
    this.shape_35.setTransform(71.7, 47.6);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AgKgFIAVAL");
    this.shape_36.setTransform(60.2, 54.7);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AgKgFIAVAL");
    this.shape_37.setTransform(61.3, 52.6);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AgKgFIAVAL");
    this.shape_38.setTransform(62.4, 50.5);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AgKgFIAVAL");
    this.shape_39.setTransform(63.5, 48.5);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AgKgFIAVAL");
    this.shape_40.setTransform(64.6, 46.4);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AgKgFIAVAL");
    this.shape_41.setTransform(65.7, 44.3);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AAihAIhDCB");
    this.shape_42.setTransform(63.1, 49.3);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f().s("#253453").ss(1, 0, 0, 4).p("AhOA5IA9AAQBAgDAfgSIhlhZg");
    this.shape_43.setTransform(68.8, 48.9);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FFFFFF").s().p("AhNA4IA2hvIBlBaQgeARhBAEg");
    this.shape_44.setTransform(68.8, 49.1);

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAyECIhiAAQhrAAhMhMQhMhMAAhqQAAhqBMhLQBMhMBrAAIBiAAQBrAABLBMQBMBLAABqQAABqhMBMQhLBMhrAAg");
    this.shape_45.setTransform(61.7, 29.8);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#D4E2E8").s().p("AgwECQhrAAhMhMQhMhMAAhqQAAhqBMhLQBMhMBrAAIBiAAQBrAABLBMQBMBLAABqQAABqhMBMQhLBMhrAAg");
    this.shape_46.setTransform(61.7, 29.8);

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_47.setTransform(42.2, 59.8);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgOAAgMgLQgLgMAAgQIAAie");
    this.shape_48.setTransform(42.2, 53.4);

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#D4E2E8").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_49.setTransform(42.2, 53.4);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#253453").s().p("AgaAYQgMgLAAgOIAAgiIBMAAIAAAiQAAAOgLALQgMAMgPAAQgOAAgMgMg");
    this.shape_50.setTransform(79.6, 59.6);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f().s("#253453").ss(2, 1, 0, 4).p("AAnhiIAACeQAAAQgMAMQgLALgQAAQgOAAgMgLQgLgMAAgQIAAie");
    this.shape_51.setTransform(79.6, 53.2);

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#D4E2E8").s().p("AgaBYQgMgMAAgQIAAieIBMAAIAACeQAAAQgLAMQgMALgPAAQgOAAgMgLg");
    this.shape_52.setTransform(79.6, 53.2);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f("#253453").s().p("AAABOQgIANgQAAIgLgBQgLgFgGgLQgEgIABgIIgIABQgRAAgJgPQgGgLADgNQACgJAIgHIgBgKQAAgjAZgZQAYgYAiAAQAiAAAZAYQAYAZAAAjIgBAKQAIAGADAKQADANgHALQgIAPgSAAIgIgBQABAIgEAIQgFALgMAFIgLABQgQAAgIgNgAAOBAQADAHAHAAIAEAAQAEgCACgEQACgEgCgEIgDgKQALgGAGgJIAKAGIAFABQAGAAADgFQADgEgCgEQgBgFgEgCIgJgFQAEgLAAgJQAAgbgTgTQgSgSgaAAQgZAAgTASQgTATAAAbQAAAJAEALIgJAFQgEACgBAFQgBAEACAEQADAFAGAAQAEAAACgBIAJgGQAHAJAKAGIgDAKQgCAEACAEQACAEAEACIAEAAQAHAAADgHIAEgJIAKABIALgBg");
    this.shape_53.setTransform(68.1, 54.2);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FFB2B2").s().p("AAUBGQgEgCgCgEIgDgJIgLABIgKgBIgDAJQgCAEgEACQgFACgEgBQgDgCgCgEQgCgEABgEIADgKQgKgGgHgJIgJAGQgEACgEgBQgEgBgDgEQgCgEABgEQACgFAEgCIAJgFQgFgLAAgJQABgbASgTQATgSAZAAQAaAAATASQATATAAAbQAAAJgFALIAJAFQAEACACAFQABAEgCAEQgDAEgEABQgEABgEgCIgJgGQgHAJgLAGIADAKQACAEgCAEQgBAEgFACIgDAAIgFgBg");
    this.shape_54.setTransform(68.1, 54.2);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_54
      }, {
        t: this.shape_53
      }, {
        t: this.shape_52
      }, {
        t: this.shape_51
      }, {
        t: this.shape_50
      }, {
        t: this.shape_49
      }, {
        t: this.shape_48
      }, {
        t: this.shape_47
      }, {
        t: this.shape_46
      }, {
        t: this.shape_45
      }, {
        t: this.shape_44
      }, {
        t: this.shape_43
      }, {
        t: this.shape_42
      }, {
        t: this.shape_41
      }, {
        t: this.shape_40
      }, {
        t: this.shape_39
      }, {
        t: this.shape_38
      }, {
        t: this.shape_37
      }, {
        t: this.shape_36
      }, {
        t: this.shape_35
      }, {
        t: this.shape_34
      }, {
        t: this.shape_33
      }, {
        t: this.shape_32
      }, {
        t: this.shape_31
      }, {
        t: this.shape_30
      }, {
        t: this.shape_29
      }, {
        t: this.shape_28
      }, {
        t: this.shape_27
      }, {
        t: this.shape_26
      }, {
        t: this.shape_25
      }, {
        t: this.shape_24
      }, {
        t: this.shape_23
      }, {
        t: this.shape_22
      }, {
        t: this.shape_21
      }, {
        t: this.shape_20
      }, {
        t: this.shape_19
      }, {
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }, {
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.instance
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

    // Layer 2
    this.instance_1 = new lib.cow_First_tail();
    this.instance_1.parent = this;
    this.instance_1.setTransform(94.6, 32.3, 1, 1, 0, 0, 0, 7.7, 9.5);

    this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1.7, -1, 105.5, 66.9);


  (lib.cow_austronaut = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.cow_austronaut.snapToPixel = true;
      this.cow_austronaut.cache(-1, -1, 105, 80, 4);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // Layer 1
    this.cow_austronaut = new lib.cow_austronaut_mc();
    this.cow_austronaut.parent = this;
    this.cow_austronaut.setTransform(47.4, 34, 1, 1, 0, 0, 0, 45.9, 32.5);

    this.timeline.addTween(cjs.Tween.get(this.cow_austronaut).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-0.2, 0.5, 105.5, 66.9);


  (lib.collectorCrane = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "dispense": 1,
      "loop": 14,
      "stop": 30
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_29 = function() {
      this.gotoAndPlay("loop")
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(29).call(this.frame_29).wait(2));

    // Layer 1
    this.body = new lib.collectorCraneBody();
    this.body.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.body).wait(31));

    // Layer 4
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("AgkAdIAAg5IBJAAIAAA5g");
    this.shape.setTransform(7.1, 14.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AgkBBIAAiBIBJAAIAACBg");
    this.shape_1.setTransform(7.1, 18.1);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AgkBmIAAjLIBJAAIAADLg");
    this.shape_2.setTransform(7.1, 21.8);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("AgkCKIAAkTIBJAAIAAETg");
    this.shape_3.setTransform(7.1, 25.4);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AgkCuIAAlbIBJAAIAAFbg");
    this.shape_4.setTransform(7.1, 29);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("AgkDSIAAmjIBJAAIAAGjg");
    this.shape_5.setTransform(7.1, 32.6);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AgkD3IAAntIBJAAIAAHtg");
    this.shape_6.setTransform(7.1, 36.3);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("AgkEbIAAo1IBJAAIAAI1g");
    this.shape_7.setTransform(7.1, 39.9);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AgkE/IAAp9IBJAAIAAJ9g");
    this.shape_8.setTransform(7.1, 43.5);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("AgoE/IAAp9IBRAAIAAJ9g");
    this.shape_9.setTransform(7.2, 43.5);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("AgtE/IAAp9IBbAAIAAJ9g");
    this.shape_10.setTransform(7.2, 43.5);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("AgxE/IAAp9IBjAAIAAJ9g");
    this.shape_11.setTransform(7.2, 43.5);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFFFFF").s().p("Ag1E/IAAp9IBrAAIAAJ9g");
    this.shape_12.setTransform(7.2, 43.5);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("AgzE/IAAp9IBnAAIAAJ9g");
    this.shape_13.setTransform(7.2, 43.5);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FFFFFF").s().p("AgvE/IAAp9IBfAAIAAJ9g");
    this.shape_14.setTransform(7.2, 43.5);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FFFFFF").s().p("AgqE/IAAp9IBVAAIAAJ9g");
    this.shape_15.setTransform(7.2, 43.5);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("AgmE/IAAp9IBNAAIAAJ9g");
    this.shape_16.setTransform(7.1, 43.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: []
    }).to({
      state: [{
        t: this.shape
      }]
    }, 1).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: []
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-19.5, -26, 39, 52);


  (lib.car_body = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      empty: 0,
      "full": 100
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(101));

    // Layer 4
    this.body = new lib.carBodyAnim_mc();
    this.body.parent = this;
    this.body.setTransform(0, -12, 1, 1, 0, 0, 0, 62.5, 38.1);

    this.timeline.addTween(cjs.Tween.get(this.body).wait(101));

    // Layer 22 (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AkWENQgaAAgRgRQgSgSAAgYIAAmiQAAgaASgRQARgSAaAAIEQAAIAZAAIAAABIBkAAIAEgBIAWAAICGAAQAaAAARASQASASAAAZIAAGiQAAAYgSASQgRARgaAAg");
    mask.setTransform(-27.1, -19.6);

    // milk
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("AlTATIAAglIKnAAIAAAlg");
    this.shape.setTransform(-27.3, 5.5);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AlTAVIAAgpIKnAAIAAApg");
    this.shape_1.setTransform(-27.3, 5.2);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AlTAYIAAgvIKnAAIAAAvg");
    this.shape_2.setTransform(-27.3, 5);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("AlTAaIAAgzIKnAAIAAAzg");
    this.shape_3.setTransform(-27.3, 4.7);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AlTAdIAAg5IKnAAIAAA5g");
    this.shape_4.setTransform(-27.3, 4.4);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("AlTAfIAAg9IKnAAIAAA9g");
    this.shape_5.setTransform(-27.3, 4.2);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AlTAiIAAhDIKnAAIAABDg");
    this.shape_6.setTransform(-27.3, 3.9);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("AlTAkIAAhHIKnAAIAABHg");
    this.shape_7.setTransform(-27.3, 3.7);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AlTAnIAAhNIKnAAIAABNg");
    this.shape_8.setTransform(-27.3, 3.4);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("AlTAqIAAhTIKnAAIAABTg");
    this.shape_9.setTransform(-27.3, 3.2);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("AlTAsIAAhXIKnAAIAABXg");
    this.shape_10.setTransform(-27.3, 2.9);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("AlTAvIAAhdIKnAAIAABdg");
    this.shape_11.setTransform(-27.3, 2.7);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFFFFF").s().p("AlTAxIAAhhIKnAAIAABhg");
    this.shape_12.setTransform(-27.3, 2.4);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("AlTA0IAAhnIKnAAIAABng");
    this.shape_13.setTransform(-27.3, 2.1);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FFFFFF").s().p("AlTA2IAAhrIKnAAIAABrg");
    this.shape_14.setTransform(-27.3, 1.9);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FFFFFF").s().p("AlTA5IAAhxIKnAAIAABxg");
    this.shape_15.setTransform(-27.3, 1.6);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("AlTA7IAAh1IKnAAIAAB1g");
    this.shape_16.setTransform(-27.3, 1.4);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFFFFF").s().p("AlTA+IAAh7IKnAAIAAB7g");
    this.shape_17.setTransform(-27.3, 1.1);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#FFFFFF").s().p("AlTBAIAAh/IKnAAIAAB/g");
    this.shape_18.setTransform(-27.3, 0.9);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("AlTBDIAAiFIKnAAIAACFg");
    this.shape_19.setTransform(-27.3, 0.6);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#FFFFFF").s().p("AlTBGIAAiLIKnAAIAACLg");
    this.shape_20.setTransform(-27.3, 0.4);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("AlTBIIAAiPIKnAAIAACPg");
    this.shape_21.setTransform(-27.3, 0.1);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FFFFFF").s().p("AlTBLIAAiVIKnAAIAACVg");
    this.shape_22.setTransform(-27.3, -0.1);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFFFFF").s().p("AlTBNIAAiZIKnAAIAACZg");
    this.shape_23.setTransform(-27.3, -0.4);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#FFFFFF").s().p("AlTBQIAAifIKnAAIAACfg");
    this.shape_24.setTransform(-27.3, -0.7);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("AlTBSIAAijIKnAAIAACjg");
    this.shape_25.setTransform(-27.3, -0.9);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FFFFFF").s().p("AlTBVIAAipIKnAAIAACpg");
    this.shape_26.setTransform(-27.3, -1.2);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("AlTBXIAAitIKnAAIAACtg");
    this.shape_27.setTransform(-27.3, -1.4);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FFFFFF").s().p("AlTBaIAAizIKnAAIAACzg");
    this.shape_28.setTransform(-27.3, -1.7);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#FFFFFF").s().p("AlTBdIAAi5IKnAAIAAC5g");
    this.shape_29.setTransform(-27.3, -1.9);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FFFFFF").s().p("AlTBfIAAi9IKnAAIAAC9g");
    this.shape_30.setTransform(-27.3, -2.2);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#FFFFFF").s().p("AlTBiIAAjCIKnAAIAADCg");
    this.shape_31.setTransform(-27.3, -2.4);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#FFFFFF").s().p("AlTBkIAAjHIKnAAIAADHg");
    this.shape_32.setTransform(-27.3, -2.7);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FFFFFF").s().p("AlTBnIAAjMIKnAAIAADMg");
    this.shape_33.setTransform(-27.3, -2.9);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FFFFFF").s().p("AlTBpIAAjRIKnAAIAADRg");
    this.shape_34.setTransform(-27.3, -3.2);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#FFFFFF").s().p("AlTBsIAAjXIKnAAIAADXg");
    this.shape_35.setTransform(-27.3, -3.5);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FFFFFF").s().p("AlTBuIAAjbIKnAAIAADbg");
    this.shape_36.setTransform(-27.3, -3.7);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f("#FFFFFF").s().p("AlTBxIAAjhIKnAAIAADhg");
    this.shape_37.setTransform(-27.3, -4);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FFFFFF").s().p("AlTBzIAAjlIKnAAIAADlg");
    this.shape_38.setTransform(-27.3, -4.2);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#FFFFFF").s().p("AlTB2IAAjrIKnAAIAADrg");
    this.shape_39.setTransform(-27.3, -4.5);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FFFFFF").s().p("AlTB5IAAjwIKnAAIAADwg");
    this.shape_40.setTransform(-27.3, -4.7);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f("#FFFFFF").s().p("AlTB7IAAj1IKnAAIAAD1g");
    this.shape_41.setTransform(-27.3, -5);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FFFFFF").s().p("AlTB+IAAj6IKnAAIAAD6g");
    this.shape_42.setTransform(-27.3, -5.2);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f("#FFFFFF").s().p("AlTCAIAAj/IKnAAIAAD/g");
    this.shape_43.setTransform(-27.3, -5.5);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FFFFFF").s().p("AlTCDIAAkFIKnAAIAAEFg");
    this.shape_44.setTransform(-27.3, -5.8);

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f("#FFFFFF").s().p("AlTCFIAAkJIKnAAIAAEJg");
    this.shape_45.setTransform(-27.3, -6);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FFFFFF").s().p("AlTCIIAAkPIKnAAIAAEPg");
    this.shape_46.setTransform(-27.3, -6.3);

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#FFFFFF").s().p("AlTCKIAAkTIKnAAIAAETg");
    this.shape_47.setTransform(-27.3, -6.5);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FFFFFF").s().p("AlTCNIAAkZIKnAAIAAEZg");
    this.shape_48.setTransform(-27.3, -6.8);

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#FFFFFF").s().p("AlTCPIAAkdIKnAAIAAEdg");
    this.shape_49.setTransform(-27.3, -7);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#FFFFFF").s().p("AlTCSIAAkjIKnAAIAAEjg");
    this.shape_50.setTransform(-27.3, -7.3);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f("#FFFFFF").s().p("AlTCVIAAkoIKnAAIAAEog");
    this.shape_51.setTransform(-27.3, -7.5);

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#FFFFFF").s().p("AlTCXIAAktIKnAAIAAEtg");
    this.shape_52.setTransform(-27.3, -7.8);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f("#FFFFFF").s().p("AlTCaIAAkzIKnAAIAAEzg");
    this.shape_53.setTransform(-27.3, -8);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FFFFFF").s().p("AlTCcIAAk3IKnAAIAAE3g");
    this.shape_54.setTransform(-27.3, -8.3);

    this.shape_55 = new cjs.Shape();
    this.shape_55.graphics.f("#FFFFFF").s().p("AlTCfIAAk9IKnAAIAAE9g");
    this.shape_55.setTransform(-27.3, -8.6);

    this.shape_56 = new cjs.Shape();
    this.shape_56.graphics.f("#FFFFFF").s().p("AlTChIAAlBIKnAAIAAFBg");
    this.shape_56.setTransform(-27.3, -8.8);

    this.shape_57 = new cjs.Shape();
    this.shape_57.graphics.f("#FFFFFF").s().p("AlTCkIAAlHIKnAAIAAFHg");
    this.shape_57.setTransform(-27.3, -9.1);

    this.shape_58 = new cjs.Shape();
    this.shape_58.graphics.f("#FFFFFF").s().p("AlTCmIAAlLIKnAAIAAFLg");
    this.shape_58.setTransform(-27.3, -9.3);

    this.shape_59 = new cjs.Shape();
    this.shape_59.graphics.f("#FFFFFF").s().p("AlTCpIAAlRIKnAAIAAFRg");
    this.shape_59.setTransform(-27.3, -9.6);

    this.shape_60 = new cjs.Shape();
    this.shape_60.graphics.f("#FFFFFF").s().p("AlTCsIAAlXIKnAAIAAFXg");
    this.shape_60.setTransform(-27.3, -9.8);

    this.shape_61 = new cjs.Shape();
    this.shape_61.graphics.f("#FFFFFF").s().p("AlTCuIAAlbIKnAAIAAFbg");
    this.shape_61.setTransform(-27.3, -10.1);

    this.shape_62 = new cjs.Shape();
    this.shape_62.graphics.f("#FFFFFF").s().p("AlTCxIAAlhIKnAAIAAFhg");
    this.shape_62.setTransform(-27.3, -10.3);

    this.shape_63 = new cjs.Shape();
    this.shape_63.graphics.f("#FFFFFF").s().p("AlTCzIAAllIKnAAIAAFlg");
    this.shape_63.setTransform(-27.3, -10.6);

    this.shape_64 = new cjs.Shape();
    this.shape_64.graphics.f("#FFFFFF").s().p("AlTC2IAAlrIKnAAIAAFrg");
    this.shape_64.setTransform(-27.3, -10.8);

    this.shape_65 = new cjs.Shape();
    this.shape_65.graphics.f("#FFFFFF").s().p("AlTC4IAAlvIKnAAIAAFvg");
    this.shape_65.setTransform(-27.3, -11.1);

    this.shape_66 = new cjs.Shape();
    this.shape_66.graphics.f("#FFFFFF").s().p("AlTC7IAAl1IKnAAIAAF1g");
    this.shape_66.setTransform(-27.3, -11.4);

    this.shape_67 = new cjs.Shape();
    this.shape_67.graphics.f("#FFFFFF").s().p("AlTC9IAAl5IKnAAIAAF5g");
    this.shape_67.setTransform(-27.3, -11.6);

    this.shape_68 = new cjs.Shape();
    this.shape_68.graphics.f("#FFFFFF").s().p("AlTDAIAAl/IKnAAIAAF/g");
    this.shape_68.setTransform(-27.3, -11.9);

    this.shape_69 = new cjs.Shape();
    this.shape_69.graphics.f("#FFFFFF").s().p("AlTDCIAAmDIKnAAIAAGDg");
    this.shape_69.setTransform(-27.3, -12.1);

    this.shape_70 = new cjs.Shape();
    this.shape_70.graphics.f("#FFFFFF").s().p("AlTDFIAAmJIKnAAIAAGJg");
    this.shape_70.setTransform(-27.3, -12.4);

    this.shape_71 = new cjs.Shape();
    this.shape_71.graphics.f("#FFFFFF").s().p("AlTDIIAAmPIKnAAIAAGPg");
    this.shape_71.setTransform(-27.3, -12.6);

    this.shape_72 = new cjs.Shape();
    this.shape_72.graphics.f("#FFFFFF").s().p("AlTDKIAAmTIKnAAIAAGTg");
    this.shape_72.setTransform(-27.3, -12.9);

    this.shape_73 = new cjs.Shape();
    this.shape_73.graphics.f("#FFFFFF").s().p("AlTDNIAAmZIKnAAIAAGZg");
    this.shape_73.setTransform(-27.3, -13.1);

    this.shape_74 = new cjs.Shape();
    this.shape_74.graphics.f("#FFFFFF").s().p("AlTDPIAAmdIKnAAIAAGdg");
    this.shape_74.setTransform(-27.3, -13.4);

    this.shape_75 = new cjs.Shape();
    this.shape_75.graphics.f("#FFFFFF").s().p("AlTDSIAAmjIKnAAIAAGjg");
    this.shape_75.setTransform(-27.3, -13.7);

    this.shape_76 = new cjs.Shape();
    this.shape_76.graphics.f("#FFFFFF").s().p("AlTDUIAAmnIKnAAIAAGng");
    this.shape_76.setTransform(-27.3, -13.9);

    this.shape_77 = new cjs.Shape();
    this.shape_77.graphics.f("#FFFFFF").s().p("AlTDXIAAmtIKnAAIAAGtg");
    this.shape_77.setTransform(-27.3, -14.2);

    this.shape_78 = new cjs.Shape();
    this.shape_78.graphics.f("#FFFFFF").s().p("AlTDZIAAmxIKnAAIAAGxg");
    this.shape_78.setTransform(-27.3, -14.4);

    this.shape_79 = new cjs.Shape();
    this.shape_79.graphics.f("#FFFFFF").s().p("AlTDcIAAm3IKnAAIAAG3g");
    this.shape_79.setTransform(-27.3, -14.7);

    this.shape_80 = new cjs.Shape();
    this.shape_80.graphics.f("#FFFFFF").s().p("AlTDfIAAm9IKnAAIAAG9g");
    this.shape_80.setTransform(-27.3, -14.9);

    this.shape_81 = new cjs.Shape();
    this.shape_81.graphics.f("#FFFFFF").s().p("AlTDhIAAnBIKnAAIAAHBg");
    this.shape_81.setTransform(-27.3, -15.2);

    this.shape_82 = new cjs.Shape();
    this.shape_82.graphics.f("#FFFFFF").s().p("AlTDkIAAnHIKnAAIAAHHg");
    this.shape_82.setTransform(-27.3, -15.4);

    this.shape_83 = new cjs.Shape();
    this.shape_83.graphics.f("#FFFFFF").s().p("AlTDmIAAnLIKnAAIAAHLg");
    this.shape_83.setTransform(-27.3, -15.7);

    this.shape_84 = new cjs.Shape();
    this.shape_84.graphics.f("#FFFFFF").s().p("AlTDpIAAnQIKnAAIAAHQg");
    this.shape_84.setTransform(-27.3, -15.9);

    this.shape_85 = new cjs.Shape();
    this.shape_85.graphics.f("#FFFFFF").s().p("AlTDrIAAnVIKnAAIAAHVg");
    this.shape_85.setTransform(-27.3, -16.2);

    this.shape_86 = new cjs.Shape();
    this.shape_86.graphics.f("#FFFFFF").s().p("AlTDuIAAnbIKnAAIAAHbg");
    this.shape_86.setTransform(-27.3, -16.5);

    this.shape_87 = new cjs.Shape();
    this.shape_87.graphics.f("#FFFFFF").s().p("AlTDwIAAnfIKnAAIAAHfg");
    this.shape_87.setTransform(-27.3, -16.7);

    this.shape_88 = new cjs.Shape();
    this.shape_88.graphics.f("#FFFFFF").s().p("AlTDzIAAnlIKnAAIAAHlg");
    this.shape_88.setTransform(-27.3, -17);

    this.shape_89 = new cjs.Shape();
    this.shape_89.graphics.f("#FFFFFF").s().p("AlTD1IAAnpIKnAAIAAHpg");
    this.shape_89.setTransform(-27.3, -17.2);

    this.shape_90 = new cjs.Shape();
    this.shape_90.graphics.f("#FFFFFF").s().p("AlTD4IAAnvIKnAAIAAHvg");
    this.shape_90.setTransform(-27.3, -17.5);

    this.shape_91 = new cjs.Shape();
    this.shape_91.graphics.f("#FFFFFF").s().p("AlTD7IAAn0IKnAAIAAH0g");
    this.shape_91.setTransform(-27.3, -17.7);

    this.shape_92 = new cjs.Shape();
    this.shape_92.graphics.f("#FFFFFF").s().p("AlTD9IAAn5IKnAAIAAH5g");
    this.shape_92.setTransform(-27.3, -18);

    this.shape_93 = new cjs.Shape();
    this.shape_93.graphics.f("#FFFFFF").s().p("AlTEAIAAn+IKnAAIAAH+g");
    this.shape_93.setTransform(-27.3, -18.2);

    this.shape_94 = new cjs.Shape();
    this.shape_94.graphics.f("#FFFFFF").s().p("AlTECIAAoDIKnAAIAAIDg");
    this.shape_94.setTransform(-27.3, -18.5);

    this.shape_95 = new cjs.Shape();
    this.shape_95.graphics.f("#FFFFFF").s().p("AlTEFIAAoIIKnAAIAAIIg");
    this.shape_95.setTransform(-27.3, -18.7);

    this.shape_96 = new cjs.Shape();
    this.shape_96.graphics.f("#FFFFFF").s().p("AlTEHIAAoNIKnAAIAAINg");
    this.shape_96.setTransform(-27.3, -19);

    this.shape_97 = new cjs.Shape();
    this.shape_97.graphics.f("#FFFFFF").s().p("AlTEKIAAoTIKnAAIAAITg");
    this.shape_97.setTransform(-27.3, -19.3);

    this.shape_98 = new cjs.Shape();
    this.shape_98.graphics.f("#FFFFFF").s().p("AlTEMIAAoXIKnAAIAAIXg");
    this.shape_98.setTransform(-27.3, -19.5);

    this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = this.shape_10.mask = this.shape_11.mask = this.shape_12.mask = this.shape_13.mask = this.shape_14.mask = this.shape_15.mask = this.shape_16.mask = this.shape_17.mask = this.shape_18.mask = this.shape_19.mask = this.shape_20.mask = this.shape_21.mask = this.shape_22.mask = this.shape_23.mask = this.shape_24.mask = this.shape_25.mask = this.shape_26.mask = this.shape_27.mask = this.shape_28.mask = this.shape_29.mask = this.shape_30.mask = this.shape_31.mask = this.shape_32.mask = this.shape_33.mask = this.shape_34.mask = this.shape_35.mask = this.shape_36.mask = this.shape_37.mask = this.shape_38.mask = this.shape_39.mask = this.shape_40.mask = this.shape_41.mask = this.shape_42.mask = this.shape_43.mask = this.shape_44.mask = this.shape_45.mask = this.shape_46.mask = this.shape_47.mask = this.shape_48.mask = this.shape_49.mask = this.shape_50.mask = this.shape_51.mask = this.shape_52.mask = this.shape_53.mask = this.shape_54.mask = this.shape_55.mask = this.shape_56.mask = this.shape_57.mask = this.shape_58.mask = this.shape_59.mask = this.shape_60.mask = this.shape_61.mask = this.shape_62.mask = this.shape_63.mask = this.shape_64.mask = this.shape_65.mask = this.shape_66.mask = this.shape_67.mask = this.shape_68.mask = this.shape_69.mask = this.shape_70.mask = this.shape_71.mask = this.shape_72.mask = this.shape_73.mask = this.shape_74.mask = this.shape_75.mask = this.shape_76.mask = this.shape_77.mask = this.shape_78.mask = this.shape_79.mask = this.shape_80.mask = this.shape_81.mask = this.shape_82.mask = this.shape_83.mask = this.shape_84.mask = this.shape_85.mask = this.shape_86.mask = this.shape_87.mask = this.shape_88.mask = this.shape_89.mask = this.shape_90.mask = this.shape_91.mask = this.shape_92.mask = this.shape_93.mask = this.shape_94.mask = this.shape_95.mask = this.shape_96.mask = this.shape_97.mask = this.shape_98.mask = mask;

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape
      }]
    }).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_17
      }]
    }, 1).to({
      state: [{
        t: this.shape_18
      }]
    }, 1).to({
      state: [{
        t: this.shape_19
      }]
    }, 1).to({
      state: [{
        t: this.shape_20
      }]
    }, 1).to({
      state: [{
        t: this.shape_21
      }]
    }, 1).to({
      state: [{
        t: this.shape_22
      }]
    }, 1).to({
      state: [{
        t: this.shape_23
      }]
    }, 1).to({
      state: [{
        t: this.shape_24
      }]
    }, 1).to({
      state: [{
        t: this.shape_25
      }]
    }, 1).to({
      state: [{
        t: this.shape_26
      }]
    }, 1).to({
      state: [{
        t: this.shape_27
      }]
    }, 1).to({
      state: [{
        t: this.shape_28
      }]
    }, 1).to({
      state: [{
        t: this.shape_29
      }]
    }, 1).to({
      state: [{
        t: this.shape_30
      }]
    }, 1).to({
      state: [{
        t: this.shape_31
      }]
    }, 1).to({
      state: [{
        t: this.shape_32
      }]
    }, 1).to({
      state: [{
        t: this.shape_33
      }]
    }, 1).to({
      state: [{
        t: this.shape_34
      }]
    }, 1).to({
      state: [{
        t: this.shape_35
      }]
    }, 1).to({
      state: [{
        t: this.shape_36
      }]
    }, 1).to({
      state: [{
        t: this.shape_37
      }]
    }, 1).to({
      state: [{
        t: this.shape_38
      }]
    }, 1).to({
      state: [{
        t: this.shape_39
      }]
    }, 1).to({
      state: [{
        t: this.shape_40
      }]
    }, 1).to({
      state: [{
        t: this.shape_41
      }]
    }, 1).to({
      state: [{
        t: this.shape_42
      }]
    }, 1).to({
      state: [{
        t: this.shape_43
      }]
    }, 1).to({
      state: [{
        t: this.shape_44
      }]
    }, 1).to({
      state: [{
        t: this.shape_45
      }]
    }, 1).to({
      state: [{
        t: this.shape_46
      }]
    }, 1).to({
      state: [{
        t: this.shape_47
      }]
    }, 1).to({
      state: [{
        t: this.shape_48
      }]
    }, 1).to({
      state: [{
        t: this.shape_49
      }]
    }, 1).to({
      state: [{
        t: this.shape_50
      }]
    }, 1).to({
      state: [{
        t: this.shape_51
      }]
    }, 1).to({
      state: [{
        t: this.shape_52
      }]
    }, 1).to({
      state: [{
        t: this.shape_53
      }]
    }, 1).to({
      state: [{
        t: this.shape_54
      }]
    }, 1).to({
      state: [{
        t: this.shape_55
      }]
    }, 1).to({
      state: [{
        t: this.shape_56
      }]
    }, 1).to({
      state: [{
        t: this.shape_57
      }]
    }, 1).to({
      state: [{
        t: this.shape_58
      }]
    }, 1).to({
      state: [{
        t: this.shape_59
      }]
    }, 1).to({
      state: [{
        t: this.shape_60
      }]
    }, 1).to({
      state: [{
        t: this.shape_61
      }]
    }, 1).to({
      state: [{
        t: this.shape_62
      }]
    }, 1).to({
      state: [{
        t: this.shape_63
      }]
    }, 1).to({
      state: [{
        t: this.shape_64
      }]
    }, 1).to({
      state: [{
        t: this.shape_65
      }]
    }, 1).to({
      state: [{
        t: this.shape_66
      }]
    }, 1).to({
      state: [{
        t: this.shape_67
      }]
    }, 1).to({
      state: [{
        t: this.shape_68
      }]
    }, 1).to({
      state: [{
        t: this.shape_69
      }]
    }, 1).to({
      state: [{
        t: this.shape_70
      }]
    }, 1).to({
      state: [{
        t: this.shape_71
      }]
    }, 1).to({
      state: [{
        t: this.shape_72
      }]
    }, 1).to({
      state: [{
        t: this.shape_73
      }]
    }, 1).to({
      state: [{
        t: this.shape_74
      }]
    }, 1).to({
      state: [{
        t: this.shape_75
      }]
    }, 1).to({
      state: [{
        t: this.shape_76
      }]
    }, 1).to({
      state: [{
        t: this.shape_77
      }]
    }, 1).to({
      state: [{
        t: this.shape_78
      }]
    }, 1).to({
      state: [{
        t: this.shape_79
      }]
    }, 1).to({
      state: [{
        t: this.shape_80
      }]
    }, 1).to({
      state: [{
        t: this.shape_81
      }]
    }, 1).to({
      state: [{
        t: this.shape_82
      }]
    }, 1).to({
      state: [{
        t: this.shape_83
      }]
    }, 1).to({
      state: [{
        t: this.shape_84
      }]
    }, 1).to({
      state: [{
        t: this.shape_85
      }]
    }, 1).to({
      state: [{
        t: this.shape_86
      }]
    }, 1).to({
      state: [{
        t: this.shape_87
      }]
    }, 1).to({
      state: [{
        t: this.shape_88
      }]
    }, 1).to({
      state: [{
        t: this.shape_89
      }]
    }, 1).to({
      state: [{
        t: this.shape_90
      }]
    }, 1).to({
      state: [{
        t: this.shape_91
      }]
    }, 1).to({
      state: [{
        t: this.shape_92
      }]
    }, 1).to({
      state: [{
        t: this.shape_93
      }]
    }, 1).to({
      state: [{
        t: this.shape_94
      }]
    }, 1).to({
      state: [{
        t: this.shape_95
      }]
    }, 1).to({
      state: [{
        t: this.shape_96
      }]
    }, 1).to({
      state: [{
        t: this.shape_97
      }]
    }, 1).to({
      state: [{
        t: this.shape_98
      }]
    }, 1).wait(3));

    // Layer 20
    this.shape_99 = new cjs.Shape();
    this.shape_99.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AgxghIAAAlQAAAIAGAGQAGAGAIAAIA7AAQAIAAAGgGQAGgGAAgIIAAgl");
    this.shape_99.setTransform(-18.3, -43);

    this.shape_100 = new cjs.Shape();
    this.shape_100.graphics.f("#999999").s().p("AgcAdQgJAAgGgGQgGgGABgIIAAglIBiAAIAAAlQgBAIgGAGQgFAGgJAAg");
    this.shape_100.setTransform(-18.3, -43.5);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_100
      }, {
        t: this.shape_99
      }]
    }).wait(101));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-63.5, -51.1, 127, 78.2);


  (lib.Car = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      move: 1,
      fill: 30
    });

    // timeline functions:
    this.frame_0 = function() {
      var hit = new createjs.Shape();
      hit.graphics.beginFill("#000").drawRect(-55, -74, 111, 77);
      this.hitArea = hit;
      this.setBounds(-55, -74, 111, 77);


      this.body.body.snapToPixel = true;
      this.body.body.cache(0, 0, 125, 78, 4);
    }
    this.frame_29 = function() {
      this.gotoAndPlay("move")
    }
    this.frame_49 = function() {
      this.gotoAndPlay("fill");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(29).call(this.frame_29).wait(20).call(this.frame_49).wait(1));

    // Layer 2
    this.test = new cjs.Text("", "bold 15px 'Tahoma'");
    this.test.name = "test";
    this.test.textAlign = "center";
    this.test.lineHeight = 22;
    this.test.lineWidth = 100;
    this.test.parent = this;
    this.test.setTransform(1.8, -111.4);

    this.timeline.addTween(cjs.Tween.get(this.test).wait(50));

    // car_bumper
    this.instance = new lib.car_bumper();
    this.instance.parent = this;
    this.instance.setTransform(21.1, -14.7, 0.685, 0.887);

    this.timeline.addTween(cjs.Tween.get(this.instance).to({
      regX: -0.1,
      x: 21,
      y: -12.9
    }, 14).to({
      regX: 0,
      x: 21.1,
      y: -14.7
    }, 15).wait(21));

    // car_bumper
    this.instance_1 = new lib.car_bumper();
    this.instance_1.parent = this;
    this.instance_1.setTransform(-35.8, -14.8, 0.764, 0.887, 0, 0, 0, -0.2, -0.1);

    this.timeline.addTween(cjs.Tween.get(this.instance_1).to({
      regY: 0,
      y: -12.9
    }, 14).to({
      regY: -0.1,
      y: -14.8
    }, 15).wait(21));

    // car_wheel
    this.instance_2 = new lib.car_wheel();
    this.instance_2.parent = this;
    this.instance_2.setTransform(23.5, -7.2, 0.887, 0.887);

    this.timeline.addTween(cjs.Tween.get(this.instance_2).to({
      scaleX: 0.91,
      scaleY: 0.78,
      y: -6
    }, 14).to({
      scaleX: 0.89,
      scaleY: 0.89,
      y: -7.2
    }, 15).wait(21));

    // car_wheel
    this.instance_3 = new lib.car_wheel();
    this.instance_3.parent = this;
    this.instance_3.setTransform(-32.9, -7.2, 0.887, 0.887);

    this.timeline.addTween(cjs.Tween.get(this.instance_3).to({
      regX: -0.1,
      regY: -0.1,
      scaleX: 0.95,
      scaleY: 0.77,
      x: -33,
      y: -6.3
    }, 14).to({
      regX: 0,
      regY: 0,
      scaleX: 0.89,
      scaleY: 0.89,
      x: -32.9,
      y: -7.2
    }, 15).wait(21));

    // car_body
    this.body = new lib.car_body();
    this.body.parent = this;
    this.body.setTransform(0.4, -29.9, 0.887, 0.887, 0, 0, 0, -0.1, -0.5);

    this.timeline.addTween(cjs.Tween.get(this.body).to({
      y: -28.1
    }, 14).to({
      y: -29.9
    }, 15).wait(21));

    // car_wheelBack
    this.instance_4 = new lib.car_wheelBack();
    this.instance_4.parent = this;
    this.instance_4.setTransform(36.4, -6.6, 0.887, 0.887);

    this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(50));

    // car_wheelBack
    this.instance_5 = new lib.car_wheelBack();
    this.instance_5.parent = this;
    this.instance_5.setTransform(-21.1, -6.6, 0.887, 0.887);

    this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(50));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-55.9, -113.4, 112.7, 116.8);


  (lib.UpgradeBtn = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      var hit = new createjs.Shape();
      hit.graphics.beginFill("#000").drawRect(-30, -30, 100, 60);
      this.hitArea = hit;

      this.setBounds(-27, -28, 51, 51);
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // Layer 6
    this.cursor = new lib.Cursor();
    this.cursor.parent = this;
    this.cursor.setTransform(16.1, 33.5, 0.8, 0.8, -20.7, 0, 0, -9.6, 46.1);

    this.timeline.addTween(cjs.Tween.get(this.cursor).wait(3));

    // Layer 5 copy
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#33CC99").s().p("AgJAcIgHgDQgDgDgBgDQgCgCABgEQgBgFADgEQADgDAFgBIAAAAQgFgCgCgDQgCgEAAgFIABgGIAFgEIAGgDQAFgCADAAIAJABIAGADIAFAFQABADAAACQAAAFgDADQgCAEgFACQAGABADADQADAEAAAFIgCAHIgFAGIgHADQgEACgFAAQgEAAgFgCgAgGAGQgCACAAADQAAAEAEADQACACACAAIADgBIACAAIACgDIABgDIgBgEIgFgEIgCgCIgDgBIgDAEgAgDgRQgBAAAAAAQgBABAAAAQAAABAAAAQAAABAAAAIABAEIADADIABABIAEABIACgDIABgFQAAgCgCgCQgCgCgDAAQgBAAgCACg");
    this.shape.setTransform(9.8, 9.7);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#33CC99").s().p("AgJAcIgHgDQgDgDgBgDQgBgCAAgEQAAgFACgEQADgDAFgBIAAAAQgFgCgCgDQgCgEAAgFIACgGIADgEIAHgDQAFgCADAAIAJABIAGADIAEAFQACADAAACQAAAFgDADQgCAEgFACQAGABACADQAEAEAAAFIgCAHIgFAGIgHADQgEACgFAAQgEAAgFgCgAgGAGQgBACgBADQAAAEAEADQACACACAAIADgBIADAAIABgDIABgDIgBgEIgGgEIgBgCIgDgBIgDAEgAgDgRQgBAAAAAAQgBABAAAAQAAABAAAAQgBABAAAAIACAEIADADIABABIAEABIACgDIABgFQAAgCgCgCQgCgCgDAAQgBAAgCACg");
    this.shape_1.setTransform(4.7, 9.7);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#33CC99").s().p("AgUAdIAAgJIAKgIIAHgIIAFgGQACgDAAgEQAAgEgDgCQgBgCgEAAIgEABIgEABIgDACIgCABIgBAAIAAgMIAHgDQAFgBAFAAQAJAAAFAFQAFAEAAAJQAAAFgCAFQgCADgGAFIgHAGIgDAEIAXAAIAAALg");
    this.shape_2.setTransform(-0.2, 9.6);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#33CC99").s().p("AgEA0IAAgUIgMgBIgLgEIAAgQIACAAQACADAHACIANACIAAgPIgFgBIgIgCIgHgDQgDgCgBgDQgCgEAAgFQAAgIAHgHQAGgFAMgBIAAgNIAHAAIAAANIAMABIAJADIAAAQIgCAAIgIgFQgFgBgGAAIAAAOIAFABQALACAGAEQAFADAAAJQAAAFgCAEIgFAHQgDACgFACQgGACgGABIAAAUgAADASIAGgCQACgCAAgDQAAgBAAAAQAAgBAAAAQgBgBAAAAQgBgBAAAAIgGgDgAgIgXQgBABAAAAQAAABgBAAQAAABAAABQAAAAAAABIABAEQABABAFABIAAgMQgCAAgDABg");
    this.shape_3.setTransform(-8.6, 9.4);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(3));

    // Layer 5
    this.text = new cjs.Text("lvl. 1", "bold 9px 'Tahoma'", "#253453");
    this.text.textAlign = "center";
    this.text.lineHeight = 12;
    this.text.lineWidth = 28;
    this.text.parent = this;
    this.text.setTransform(2.1, -13.6);

    this.timeline.addTween(cjs.Tween.get(this.text).wait(3));

    // Layer 4
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AAtAVIAAAyQAAARgMAMQgMALgQAAIgIAAQgRAAgLgLQgMgMAAgRIAAgyIgOAAQgMAAgJgIQgJgJAAgLQAAgJAGgJIA4hJQAIgKAMgCQALgCAKAIIAFAFIA8BJQAIAKgBAMQgBALgKAIQgIAGgLAAg");
    this.shape_4.setTransform(-17.9, -16.2);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFAB34").s().p("AgDBvQgRAAgLgLQgMgMAAgRIAAgyIgOAAQgMAAgJgIQgJgJAAgLQAAgJAGgJIA4hJQAIgKAMgCQALgCAKAIIAFAFIA8BJQAIAKgBAMQgBALgKAIQgIAGgLAAIgNAAIAAAyQAAARgMAMQgMALgQAAg");
    this.shape_5.setTransform(-17.9, -16.2);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AhuBTQghAAgXgZQgYgXAAghIAAg4QAAgLAIgIQAIgIALgBIFHAAQALABAIAHQAIAJAAAKIAAA5QAAAhgYAXQgXAZghAAg");
    this.shape_6.setTransform(0, 4.9);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#EFF4F9").s().p("Ah4C2QglAAgagaQgagaAAglIAAi5QAAglAagaQAagaAlAAIDyAAQAlAAAZAaQAaAaAAAlIAAC5QAAAlgaAaQgZAaglAAg");
    this.shape_7.setTransform(0, -2.8);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#8699AD").s().p("Ah4DSQglAAgagaQgagbAAgkIAAjwQAAgmAagaQAagaAlAAIDxAAQAkAAAbAaQAaAaAAAmIAADwQAAAkgaAbQgbAagkAAg");

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#253453").s().p("Ah3DrQgwAAghgiQgighAAgwIAAjvQAAgwAighQAhgiAwAAIDvAAQAwAAAhAiQAiAhAAAwIAADvQAAAwgiAhQghAigwAAgAi3i3QgaAbAAAlIAADvQAAAlAaAbQAbAaAlAAIDvAAQAlAAAbgaQAagbAAglIAAjvQAAglgagbQgbgaglAAIjvAAQglAAgbAag");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }]
    }).wait(3));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-35.4, -28.4, 75.2, 91.4);


  (lib.UnlockBtn = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      var hit = new createjs.Shape();
      hit.graphics.beginFill("#000").drawRect(-60, -75, 120, 90);
      this.hitArea = hit;
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // cursor
    this.cursor = new lib.Cursor();
    this.cursor.parent = this;
    this.cursor.setTransform(-2.3, 24.8, 0.65, 0.65, 0, 0, 0, -9.7, 46);

    this.timeline.addTween(cjs.Tween.get(this.cursor).wait(3));

    // upgradeTxt
    this.btnText = new cjs.Text("UNLOCK", "bold 9px 'Nunito Sans'", "#253453");
    this.btnText.name = "btnText";
    this.btnText.textAlign = "center";
    this.btnText.lineHeight = 15;
    this.btnText.lineWidth = 55;
    this.btnText.parent = this;
    this.btnText.setTransform(-0.1, -6.8);

    this.timeline.addTween(cjs.Tween.get(this.btnText).wait(3));

    // textLoc
    this.textLoc = new lib.btnUnlock_textContainer();
    this.textLoc.parent = this;
    this.textLoc.setTransform(-30.5, -10);
    this.textLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.textLoc).wait(3));

    // Layer 2
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#253453").ss(1.3, 1, 1).p("AFoirQBHAAAzAzQAyAyAABGQAABHgyAyQgyAzhIAAIrPAAQhHAAgzgzQgygyAAhHQAAhGAygyQAzgzBHAAg");
    this.shape.setTransform(0, -2.6, 0.63, 0.63);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFEF7D").s().p("AlnCsQhHAAgygzQgzgyAAhHQAAhGAzgyQAygzBHAAILPAAQBHAAAzAzQAyAyAABGQAABHgyAyQgzAzhHAAg");
    this.shape_1.setTransform(0, -2.6, 0.63, 0.63);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f().s("#253453").ss(1.3, 1, 1).p("AIUh+IAABVQAABFgyAxQgyAyhIAAIrPAAQhIAAgygxQgygyAAhFIAAhVg");
    this.shape_2.setTransform(0, 5.4, 0.63, 0.63);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFA766").s().p("AlnB/QhIAAgxgxQgzgyAAhFIAAhVIQnAAIAABVQAABFgyAxQgzAyhHAAg");
    this.shape_3.setTransform(0, 5.4, 0.63, 0.63);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(3));

    // button
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FCD431").s().p("AngCxQgSAAgNgNQgMgNAAgRIAAkLQAAgRAMgNQANgNASAAIPCAAQASAAAMANQAMANAAARIAAELQAAARgMANQgMANgSAAg");
    this.shape_4.setTransform(0, -1.1, 0.581, 0.581);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#71B304").s().p("AngCxQgSAAgNgNQgMgNAAgRIAAkLQAAgRAMgNQANgNASAAIPCAAQASAAAMANQAMANAAARIAAELQAAARgMANQgMANgSAAg");
    this.shape_5.setTransform(0, -1.1, 0.581, 0.581, 0, 0, 0, 0, -0.1);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FF5454").s().p("AngCxQgSAAgNgNQgMgNAAgRIAAkLQAAgRAMgNQANgNASAAIPCAAQASAAAMANQAMANAAARIAAELQAAARgMANQgMANgSAAg");
    this.shape_6.setTransform(0, -1.1, 0.581, 0.581, 0, 0, 0, 0, -0.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_4
      }]
    }).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).wait(1));

    // shadow
    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#F47123").s().p("AngCiQgSAAgNgMQgMgNAAgSIAAjtQAAgSAMgMQANgNASAAIPCAAQASAAAMANQAMAMAAASIAADtQAAASgMANQgMAMgSAAg");
    this.shape_7.setTransform(0, 2, 0.581, 0.581);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#497400").s().p("AngCiQgSAAgNgMQgMgNAAgSIAAjtQAAgSAMgMQANgNASAAIPCAAQASAAAMANQAMAMAAASIAADtQAAASgMANQgMAMgSAAg");
    this.shape_8.setTransform(0, 2, 0.581, 0.581);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#8A3030").s().p("AngCiQgSAAgNgMQgMgNAAgSIAAjtQAAgSAMgMQANgNASAAIPCAAQASAAAMANQAMAMAAASIAADtQAAASgMANQgMAMgSAAg");
    this.shape_9.setTransform(0, 2, 0.581, 0.581);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_7
      }]
    }).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).wait(1));

    // Layer 3
    this.hit_Area = new lib.AreaClick_floor_mc();
    this.hit_Area.parent = this;
    this.hit_Area.setTransform(-0.1, 0, 0.197, 0.238, 0, 0, 0, 152.5, 40.8);

    this.timeline.addTween(cjs.Tween.get(this.hit_Area).wait(3));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-38.5, -18, 77, 63.7);


  (lib.button_popUp = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // static
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#000033").s().p("AgSA2QgIgDgFgEQgGgEgCgGQgDgGAAgGQAAgKAGgGQAFgGAKgDIAAAAQgKgFgEgGQgEgHAAgIQAAgGADgGQADgFAFgEQAFgEAIgCQAHgDAIAAQAKABAHACQAIACAFADQAFAEACAFQADAFAAAGQAAAIgFAGQgEAGgJAEIAAABQAKADAGAHQAFAHAAAJQAAAHgDAHQgDAFgGAFQgFAEgIADQgIADgKgBQgKABgIgDgAgNAMQgCAEAAAFQAAAHAFAFQAFAEAGAAIAFAAIAEgCIAEgEQACgDAAgDQAAgFgDgDQgCgEgHgDIgEgCIgIgEIgFAIgAgIgiQgEADAAAFQAAAEADACQACADAEACIADACIAIAEIAEgIIABgIQAAgFgDgDQgEgEgGAAQgEAAgEADg");
    this.shape.setTransform(15.9, -4.2);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#000033").s().p("AgSA2QgIgDgFgEQgGgEgCgGQgDgGAAgGQAAgKAGgGQAFgGAKgDIAAAAQgKgFgEgGQgEgHAAgIQAAgGADgGQADgFAFgEQAFgEAIgCQAHgDAIAAQAKABAHACQAIACAFADQAFAEACAFQADAFAAAGQAAAIgFAGQgEAGgJAEIAAABQAKADAGAHQAFAHAAAJQAAAHgDAHQgDAFgGAFQgFAEgIADQgIADgKgBQgKABgIgDgAgNAMQgCAEAAAFQAAAHAFAFQAFAEAGAAIAFAAIAEgCIAEgEQACgDAAgDQAAgFgDgDQgCgEgHgDIgEgCIgIgEIgFAIgAgIgiQgEADAAAFQAAAEADACQACADAEACIADACIAIAEIAEgIIABgIQAAgFgDgDQgEgEgGAAQgEAAgEADg");
    this.shape_1.setTransform(6.3, -4.2);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#000033").s().p("AgnA3IAAgSIATgPIAOgNQAGgJADgFQAEgGAAgGQAAgIgFgEQgCgFgIABIgIABIgIACIgGAEIgDADIgDAAIAAgZIAOgEQALgCAIAAQASAAAKAIQAKAJAAAQQAAAKgFAIQgEAIgKAKIgOAMIgHAIIAsAAIAAAUg");
    this.shape_2.setTransform(-2.9, -4.3);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#000033").s().p("AgHBeIAAgjQgLAAgNgCQgMgDgIgEIAAgcIADAAQAFADAMAEQAMAEANAAIAAgbIgJgCIgPgEQgGgBgGgFQgFgEgDgGQgDgHAAgKQAAgPAMgKQAMgKAWgCIAAgXIAOAAIAAAWQAJABALACQALACAHADIAAAcIgEAAQgHgEgIgDQgJgCgLgBIAAAZIAJACQAUAEAKAJQAKAGAAAQQAAAIgEAHQgDAIgGAFQgHAGgIADQgJAEgLABIAAAjgAAFAhQAHgBAEgCQAEgDAAgGQAAgFgDgDQgEgDgIgCgAgPgqQgFADAAAFQAAAEADADQACADAJACIAAgXQgFABgEACg");
    this.shape_3.setTransform(-14.2, -4.7);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(3));

    // loc
    this.textLoc = new lib.btnUpgrade_textContainer_mc();
    this.textLoc.parent = this;
    this.textLoc.setTransform(-30, -10);
    this.textLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.textLoc).wait(3));

    // Layer 3
    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f().s("rgba(238,255,248,0.698)").ss(5, 1, 1).p("AhggsIBnAAQAmAAAaAbQAaAYAAAm");
    this.shape_4.setTransform(45.7, -15.4, 1.219, 1.118);

    this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(3));

    // Layer 4
    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f().s("#253453").ss(2, 1, 1).p("AHKDAIuUAAQhNAAg3gyQg3gyAAhIIAAgnQAAhIA3gyQA3gyBNAAIOUAAQBOAAA3AyQA3AyAABIIAAAnQAABIg3AyQg3AyhOAAg");
    this.shape_5.setTransform(0, -7.8);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#61FFCA").s().p("AnKDAQhNAAg3gzQg3gyAAhHIAAgoQAAhGA3gzQA3gyBNAAIOUAAQBOAAA3AyQA3AzAABGIAAAoQAABHg3AyQg3AzhOAAg");
    this.shape_6.setTransform(0, -7.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_6
      }, {
        t: this.shape_5
      }]
    }).wait(3));

    // Layer 6
    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#253453").ss(2, 1, 1).p("AKGiNIAABfQAABNgxA4QgxA3hFAAIu9AAQhFAAgxg3Qgxg3AAhOIAAhfg");
    this.shape_7.setTransform(0, 6.4);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#30BFC6").s().p("AneCOQhFAAgxg3Qgxg4AAhNIAAhfIULAAIAABfQAABNgxA4QgxA3hFAAg");
    this.shape_8.setTransform(0, 6.4);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_8
      }, {
        t: this.shape_7
      }]
    }).wait(3));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-90, -28, 185.8, 52.9);


  (lib.FinalBtn = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "violet": 0,
      "yellow": 1,
      "green": 2,
      "red": 3
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      /*
      var hit = new createjs.Shape();
      hit.graphics.beginFill("#000").drawRect(-65, -20, 130, 50);
      this.hitArea = hit;
      */
      this.hitArea = this.hit_Area;
    }
    this.frame_1 = function() {
      this.stop();
      //this.hit_Area.alpha = 1;
      this.hitArea = this.hit_Area;
    }
    this.frame_2 = function() {
      this.stop();
    }
    this.frame_3 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1).call(this.frame_3).wait(1));

    // upgradeTxt
    this.btnText = new cjs.Text("インストール", "bold 17px 'Arial'", "#253453");
    this.btnText.name = "btnText";
    this.btnText.textAlign = "center";
    this.btnText.lineHeight = 26;
    this.btnText.lineWidth = 106;
    this.btnText.parent = this;
    this.btnText.setTransform(1.3, -12.9);

    this.timeline.addTween(cjs.Tween.get(this.btnText).wait(4));

    // Layer 2
    this.textLoc = new lib.btnFinal_textContainer_mc();
    this.textLoc.parent = this;
    this.textLoc.setTransform(-54, -16);
    this.textLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.textLoc).wait(4));

    // bg
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("rgba(238,255,248,0.698)").ss(5, 1, 1).p("AhggsIBnAAQAmAAAaAbQAaAYAAAm");
    this.shape.setTransform(45.7, -7.7, 1.219, 1.118);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f().s("#253453").ss(2, 1, 1).p("AHKDAIuUAAQhNAAg3gyQg3gyAAhIIAAgoQAAhHA3gyQA3gyBNAAIOUAAQBOAAA3AyQA3AyAABHIAAAoQAABIg3AyQg3AyhOAAg");
    this.shape_1.setTransform(0, -0.1);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#61FFCA").s().p("AnKDAQhNAAg3gzQg3gyAAhHIAAgoQAAhGA3gzQA3gyBNAAIOUAAQBOAAA3AyQA3AzAABGIAAAoQAABHg3AyQg3AzhOAAg");
    this.shape_2.setTransform(0, -0.1);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f().s("#253453").ss(2, 1, 1).p("AKGiNIAABeQAABOgxA4QgxA3hFAAIu9AAQhFAAgxg3Qgxg4AAhNIAAhfg");
    this.shape_3.setTransform(0, 14.1);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#30BFC6").s().p("AneCOQhFAAgxg3Qgxg4AAhNIAAhfIULAAIAABfQAABNgxA4QgxA3hFAAg");
    this.shape_4.setTransform(0, 14.1);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }, {
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(4));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-99.9, -201.3, 200.5, 245.6);


  (lib.Box = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "on": 1,
      idle: 11,
      "off": 12
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }
    this.frame_11 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(11).call(this.frame_11).wait(11));

    // boxProgress
    this.boxProgress = new lib.box_progress();
    this.boxProgress.parent = this;
    this.boxProgress.setTransform(-0.3, 5, 0.618, 0.618, 0, 0, 0, 0, -0.1);
    this.boxProgress.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.boxProgress).wait(8).to({
      alpha: 1
    }, 3).wait(1).to({
      regX: -0.1,
      regY: 0,
      x: -0.4,
      alpha: 0.012
    }, 4).wait(6));

    // box
    this.instance = new lib.box_body();
    this.instance.parent = this;
    this.instance.setTransform(-0.3, -0.6, 0.542, 0.542, 0, 0, 0, -0.1, 0);

    this.timeline.addTween(cjs.Tween.get(this.instance).to({
      regX: 0,
      scaleX: 0.66,
      scaleY: 0.66
    }, 2).to({
      scaleX: 0.62,
      scaleY: 0.62
    }, 9).wait(11));

    // box_cap
    this.instance_1 = new lib.box_cap();
    this.instance_1.parent = this;
    this.instance_1.setTransform(-19.4, -7.7, 0.542, 0.542, 0, -117.8, 62.2, -8.7, -15.1);

    this.timeline.addTween(cjs.Tween.get(this.instance_1).to({
      scaleX: 0.66,
      scaleY: 0.66,
      skewX: -111,
      skewY: 69,
      x: -23.6,
      y: -17.8
    }, 2).to({
      regX: -8.6,
      regY: -15,
      scaleX: 0.64,
      scaleY: 0.64,
      skewX: -212.7,
      skewY: -32.7,
      x: -22.9,
      y: -17.3
    }, 3).to({
      regX: -8.4,
      regY: -15.1,
      scaleX: 0.63,
      scaleY: 0.63,
      skewX: -378.6,
      skewY: -198.6,
      x: -22.4,
      y: -16.9
    }, 3).to({
      regX: -8.5,
      scaleX: 0.62,
      scaleY: 0.62,
      skewX: -360,
      skewY: -180,
      x: -22,
      y: -16.7
    }, 3).wait(1).to({
      regX: -8.4,
      scaleX: 0.63,
      scaleY: 0.63,
      skewX: -378.6,
      skewY: -198.6,
      x: -22.4,
      y: -16.9
    }, 3).to({
      regX: -8.6,
      regY: -15,
      scaleX: 0.64,
      scaleY: 0.64,
      skewX: -212.7,
      skewY: -32.7,
      x: -22.9,
      y: -17.3
    }, 3).to({
      regX: -8.7,
      regY: -15.1,
      scaleX: 0.54,
      scaleY: 0.54,
      skewX: -117.8,
      skewY: 62.2,
      x: -19.4,
      y: -7.7
    }, 3).wait(1));

    // box_cap
    this.instance_2 = new lib.box_cap();
    this.instance_2.parent = this;
    this.instance_2.setTransform(18.8, -7.6, 0.542, 0.542, 116.5, 0, 0, -8.7, -15.2);

    this.timeline.addTween(cjs.Tween.get(this.instance_2).to({
      regX: -8.6,
      regY: -15.1,
      scaleX: 0.66,
      scaleY: 0.66,
      x: 23.1,
      y: -17.8
    }, 2).to({
      regY: -15,
      scaleX: 0.64,
      scaleY: 0.64,
      rotation: 214.5,
      x: 22.4,
      y: -17.3
    }, 3).to({
      regY: -15.1,
      scaleX: 0.63,
      scaleY: 0.63,
      rotation: 379.9,
      x: 21.8,
      y: -16.9
    }, 3).to({
      regX: -8.5,
      scaleX: 0.62,
      scaleY: 0.62,
      rotation: 360,
      x: 21.5,
      y: -16.7
    }, 3).wait(1).to({
      regX: -8.6,
      scaleX: 0.63,
      scaleY: 0.63,
      rotation: 379.9,
      x: 21.8,
      y: -16.9
    }, 3).to({
      regY: -15,
      scaleX: 0.64,
      scaleY: 0.64,
      rotation: 214.5,
      x: 22.4,
      y: -17.3
    }, 3).to({
      regX: -8.7,
      regY: -15.2,
      scaleX: 0.54,
      scaleY: 0.54,
      rotation: 116.5,
      x: 18.8,
      y: -7.6
    }, 3).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-20.4, -16.4, 40.2, 31.3);


  (lib.BoxFake = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // boxProgress
    this.boxProgress = new lib.box_progress();
    this.boxProgress.parent = this;
    this.boxProgress.setTransform(-0.4, 5, 0.618, 0.618, 0, 0, 0, -0.1, 0);
    this.boxProgress.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.boxProgress).wait(1));

    // box
    this.instance = new lib.box_body();
    this.instance.parent = this;
    this.instance.setTransform(-0.3, -0.6, 0.618, 0.618);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    // box_cap
    this.instance_1 = new lib.box_cap();
    this.instance_1.parent = this;
    this.instance_1.setTransform(-19.4, -7.7, 0.542, 0.542, 0, -117.8, 62.2, -8.7, -15.1);

    this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

    // box_cap
    this.instance_2 = new lib.box_cap();
    this.instance_2.parent = this;
    this.instance_2.setTransform(18.8, -7.6, 0.542, 0.542, 116.5, 0, 0, -8.7, -15.2);

    this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-23, -18.3, 45.3, 35.3);


  (lib.Warehouse = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 2
    this.fan2 = new lib.warehouse_fan();
    this.fan2.parent = this;
    this.fan2.setTransform(38, -54.6, 1, 1, 158);

    this.fan1 = new lib.warehouse_fan();
    this.fan1.parent = this;
    this.fan1.setTransform(14.9, -54.6);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.fan1
      }, {
        t: this.fan2
      }]
    }).wait(1));

    // Layer 6 (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AoqClIAAlJIRVAAIAAFJg");
    mask.setTransform(90.6, 5.4);

    // Layer 5
    this.box = new lib.BoxFake();
    this.box.parent = this;
    this.box.setTransform(54.9, 8.6, 0.75, 0.75, 0, 0, 0, -0.2, -0.6);

    this.box.mask = mask;

    this.timeline.addTween(cjs.Tween.get(this.box).wait(1));

    // Layer 3
    this.conveyer = new lib.Conveyor();
    this.conveyer.parent = this;
    this.conveyer.setTransform(97.1, 24.9, 1, 1, 0, 0, 180);

    this.timeline.addTween(cjs.Tween.get(this.conveyer).wait(1));

    // Layer 4
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#6C0738").s().p("AlGAQIAAgfIJ8AAQAIAAAEAFQAFAFAAAFQAAAGgFAFQgEAFgIAAg");
    this.shape.setTransform(98.3, -9.6, 0.582, 0.582);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#0E0A09").s().p("AkwEKIAAoTIJhAAIAAITg");
    this.shape_1.setTransform(97, 6.9, 0.582, 0.582);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1
      }, {
        t: this.shape
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-7.6, -63.8, 137.2, 129);


  (lib.Separator = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(101));

    // dugPoint3
    this.dugPoint3 = new lib.DugPoint();
    this.dugPoint3.parent = this;
    this.dugPoint3.setTransform(272.2, -25.8);
    this.dugPoint3.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.dugPoint3).wait(101));

    // dugPoint2
    this.dugPoint2 = new lib.DugPoint();
    this.dugPoint2.parent = this;
    this.dugPoint2.setTransform(198.2, -25.8);
    this.dugPoint2.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.dugPoint2).wait(101));

    // dugPoint1
    this.dugPoint1 = new lib.DugPoint();
    this.dugPoint1.parent = this;
    this.dugPoint1.setTransform(124.2, -25.8);
    this.dugPoint1.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.dugPoint1).wait(101));

    // Layer 2 copy
    this.separatorCount = new cjs.Text("399", "bold 12px 'Tahoma'", "#FFFFFF");
    this.separatorCount.name = "separatorCount";
    this.separatorCount.textAlign = "center";
    this.separatorCount.lineHeight = 17;
    this.separatorCount.lineWidth = 31;
    this.separatorCount.parent = this;
    this.separatorCount.setTransform(36.6, -122);

    this.instance = new lib.separator_body();
    this.instance.parent = this;
    this.instance.setTransform(42.8, -39.9, 1, 1, 0, 0, 0, 8.8, -0.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.instance
      }, {
        t: this.separatorCount
      }]
    }).wait(101));

    // Layer 2
    this.separatorStroke = new cjs.Text("399", "bold 12px 'Tahoma'", "#FFFFFF");
    this.separatorStroke.name = "separatorStroke";
    this.separatorStroke.textAlign = "center";
    this.separatorStroke.lineHeight = 17;
    this.separatorStroke.lineWidth = 31;
    this.separatorStroke.parent = this;
    this.separatorStroke.setTransform(36.6, -122);

    this.instance_1 = new lib.separator_body();
    this.instance_1.parent = this;
    this.instance_1.setTransform(42.8, -39.9, 1, 1, 0, 0, 0, 8.8, -0.3);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.instance_1
      }, {
        t: this.separatorStroke
      }]
    }).wait(101));

    // Layer 10
    this.crane = new lib.separatorCrane_anim();
    this.crane.parent = this;
    this.crane.setTransform(-13, -11);

    this.timeline.addTween(cjs.Tween.get(this.crane).wait(101));

    // mask (mask)
    var mask = new cjs.Shape();
    mask._off = true;
    mask.graphics.p("AgnDKQgmAAgagaQgagbAAglIAAlzQgBgiATgbIAog7QAWgjgBgmIAAghIECAAIAAAhQABAnAVAiIAoA7QASAcAAAhIAAFzQABAlgbAbQgaAagmAAg");
    mask.setTransform(28.9, -48.7);

    // Layer 6
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("AjkASIAAgjIHJAAIAAAjg");
    this.shape.setTransform(36.3, -27.4);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("AjkAVIAAgpIHJAAIAAApg");
    this.shape_1.setTransform(36.3, -27.7);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("AjkAZIAAgxIHJAAIAAAxg");
    this.shape_2.setTransform(36.3, -28.1);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("AjkAcIAAg3IHJAAIAAA3g");
    this.shape_3.setTransform(36.3, -28.4);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("AjkAfIAAg9IHJAAIAAA9g");
    this.shape_4.setTransform(36.3, -28.8);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("AjkAiIAAhDIHJAAIAABDg");
    this.shape_5.setTransform(36.3, -29.1);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("AjkAlIAAhJIHJAAIAABJg");
    this.shape_6.setTransform(36.3, -29.4);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("AjkApIAAhRIHJAAIAABRg");
    this.shape_7.setTransform(36.3, -29.8);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("AjkAsIAAhXIHJAAIAABXg");
    this.shape_8.setTransform(36.3, -30.1);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("AjkAvIAAhdIHJAAIAABdg");
    this.shape_9.setTransform(36.3, -30.5);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("AjkAzIAAhlIHJAAIAABlg");
    this.shape_10.setTransform(36.3, -30.8);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("AjkA2IAAhrIHJAAIAABrg");
    this.shape_11.setTransform(36.3, -31.2);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFFFFF").s().p("AjkA5IAAhxIHJAAIAABxg");
    this.shape_12.setTransform(36.3, -31.5);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("AjkA9IAAh5IHJAAIAAB5g");
    this.shape_13.setTransform(36.3, -31.8);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FFFFFF").s().p("AjkA/IAAh+IHJAAIAAB+g");
    this.shape_14.setTransform(36.3, -32.2);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FFFFFF").s().p("AjkBDIAAiFIHJAAIAACFg");
    this.shape_15.setTransform(36.3, -32.5);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("AjkBGIAAiLIHJAAIAACLg");
    this.shape_16.setTransform(36.3, -32.9);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFFFFF").s().p("AjkBKIAAiTIHJAAIAACTg");
    this.shape_17.setTransform(36.3, -33.2);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#FFFFFF").s().p("AjkBNIAAiZIHJAAIAACZg");
    this.shape_18.setTransform(36.3, -33.6);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("AjkBQIAAifIHJAAIAACfg");
    this.shape_19.setTransform(36.3, -33.9);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#FFFFFF").s().p("AjkBTIAAilIHJAAIAAClg");
    this.shape_20.setTransform(36.3, -34.3);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("AjkBWIAAirIHJAAIAACrg");
    this.shape_21.setTransform(36.3, -34.6);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FFFFFF").s().p("AjkBaIAAizIHJAAIAACzg");
    this.shape_22.setTransform(36.3, -34.9);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFFFFF").s().p("AjkBdIAAi5IHJAAIAAC5g");
    this.shape_23.setTransform(36.3, -35.3);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#FFFFFF").s().p("AjkBgIAAi/IHJAAIAAC/g");
    this.shape_24.setTransform(36.3, -35.6);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("AjkBkIAAjHIHJAAIAADHg");
    this.shape_25.setTransform(36.3, -36);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FFFFFF").s().p("AjkBnIAAjNIHJAAIAADNg");
    this.shape_26.setTransform(36.3, -36.3);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("AjkBqIAAjTIHJAAIAADTg");
    this.shape_27.setTransform(36.3, -36.7);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FFFFFF").s().p("AjkBtIAAjZIHJAAIAADZg");
    this.shape_28.setTransform(36.3, -37);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#FFFFFF").s().p("AjkBxIAAjhIHJAAIAADhg");
    this.shape_29.setTransform(36.3, -37.3);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FFFFFF").s().p("AjkB0IAAjnIHJAAIAADng");
    this.shape_30.setTransform(36.3, -37.7);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#FFFFFF").s().p("AjkB3IAAjtIHJAAIAADtg");
    this.shape_31.setTransform(36.3, -38);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#FFFFFF").s().p("AjkB6IAAjzIHJAAIAADzg");
    this.shape_32.setTransform(36.3, -38.4);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FFFFFF").s().p("AjkB+IAAj7IHJAAIAAD7g");
    this.shape_33.setTransform(36.3, -38.7);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FFFFFF").s().p("AjkCBIAAkBIHJAAIAAEBg");
    this.shape_34.setTransform(36.3, -39.1);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#FFFFFF").s().p("AjkCEIAAkHIHJAAIAAEHg");
    this.shape_35.setTransform(36.3, -39.4);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FFFFFF").s().p("AjkCHIAAkOIHJAAIAAEOg");
    this.shape_36.setTransform(36.3, -39.7);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f("#FFFFFF").s().p("AjkCLIAAkVIHJAAIAAEVg");
    this.shape_37.setTransform(36.3, -40.1);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FFFFFF").s().p("AjkCOIAAkbIHJAAIAAEbg");
    this.shape_38.setTransform(36.3, -40.4);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#FFFFFF").s().p("AjkCRIAAkhIHJAAIAAEhg");
    this.shape_39.setTransform(36.3, -40.8);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FFFFFF").s().p("AjkCUIAAkoIHJAAIAAEog");
    this.shape_40.setTransform(36.3, -41.1);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f("#FFFFFF").s().p("AjkCYIAAkvIHJAAIAAEvg");
    this.shape_41.setTransform(36.3, -41.5);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FFFFFF").s().p("AjkCbIAAk1IHJAAIAAE1g");
    this.shape_42.setTransform(36.3, -41.8);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f("#FFFFFF").s().p("AjkCeIAAk7IHJAAIAAE7g");
    this.shape_43.setTransform(36.3, -42.2);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FFFFFF").s().p("AjkCiIAAlCIHJAAIAAFCg");
    this.shape_44.setTransform(36.3, -42.5);

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f("#FFFFFF").s().p("AjkClIAAlJIHJAAIAAFJg");
    this.shape_45.setTransform(36.3, -42.8);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FFFFFF").s().p("AjkCoIAAlPIHJAAIAAFPg");
    this.shape_46.setTransform(36.3, -43.2);

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#FFFFFF").s().p("AjkCrIAAlVIHJAAIAAFVg");
    this.shape_47.setTransform(36.3, -43.5);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FFFFFF").s().p("AjkCvIAAldIHJAAIAAFdg");
    this.shape_48.setTransform(36.3, -43.9);

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#FFFFFF").s().p("AjkCyIAAljIHJAAIAAFjg");
    this.shape_49.setTransform(36.3, -44.2);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#FFFFFF").s().p("AjkC1IAAlpIHJAAIAAFpg");
    this.shape_50.setTransform(36.3, -44.5);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f("#FFFFFF").s().p("AjkC5IAAlwIHJAAIAAFwg");
    this.shape_51.setTransform(36.3, -44.9);

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#FFFFFF").s().p("AjkC7IAAl2IHJAAIAAF2g");
    this.shape_52.setTransform(36.3, -45.2);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f("#FFFFFF").s().p("AjkC/IAAl9IHJAAIAAF9g");
    this.shape_53.setTransform(36.3, -45.6);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FFFFFF").s().p("AjkDCIAAmDIHJAAIAAGDg");
    this.shape_54.setTransform(36.3, -45.9);

    this.shape_55 = new cjs.Shape();
    this.shape_55.graphics.f("#FFFFFF").s().p("AjkDFIAAmJIHJAAIAAGJg");
    this.shape_55.setTransform(36.3, -46.3);

    this.shape_56 = new cjs.Shape();
    this.shape_56.graphics.f("#FFFFFF").s().p("AjkDJIAAmRIHJAAIAAGRg");
    this.shape_56.setTransform(36.3, -46.6);

    this.shape_57 = new cjs.Shape();
    this.shape_57.graphics.f("#FFFFFF").s().p("AjkDMIAAmXIHJAAIAAGXg");
    this.shape_57.setTransform(36.3, -46.9);

    this.shape_58 = new cjs.Shape();
    this.shape_58.graphics.f("#FFFFFF").s().p("AjkDPIAAmdIHJAAIAAGdg");
    this.shape_58.setTransform(36.3, -47.3);

    this.shape_59 = new cjs.Shape();
    this.shape_59.graphics.f("#FFFFFF").s().p("AjkDSIAAmkIHJAAIAAGkg");
    this.shape_59.setTransform(36.3, -47.6);

    this.shape_60 = new cjs.Shape();
    this.shape_60.graphics.f("#FFFFFF").s().p("AjkDWIAAmrIHJAAIAAGrg");
    this.shape_60.setTransform(36.3, -48);

    this.shape_61 = new cjs.Shape();
    this.shape_61.graphics.f("#FFFFFF").s().p("AjkDZIAAmxIHJAAIAAGxg");
    this.shape_61.setTransform(36.3, -48.3);

    this.shape_62 = new cjs.Shape();
    this.shape_62.graphics.f("#FFFFFF").s().p("AjkDcIAAm3IHJAAIAAG3g");
    this.shape_62.setTransform(36.3, -48.7);

    this.shape_63 = new cjs.Shape();
    this.shape_63.graphics.f("#FFFFFF").s().p("AjkDgIAAm/IHJAAIAAG/g");
    this.shape_63.setTransform(36.3, -49);

    this.shape_64 = new cjs.Shape();
    this.shape_64.graphics.f("#FFFFFF").s().p("AjkDjIAAnFIHJAAIAAHFg");
    this.shape_64.setTransform(36.3, -49.4);

    this.shape_65 = new cjs.Shape();
    this.shape_65.graphics.f("#FFFFFF").s().p("AjkDmIAAnLIHJAAIAAHLg");
    this.shape_65.setTransform(36.3, -49.7);

    this.shape_66 = new cjs.Shape();
    this.shape_66.graphics.f("#FFFFFF").s().p("AjkDqIAAnSIHJAAIAAHSg");
    this.shape_66.setTransform(36.3, -50);

    this.shape_67 = new cjs.Shape();
    this.shape_67.graphics.f("#FFFFFF").s().p("AjkDsIAAnXIHJAAIAAHXg");
    this.shape_67.setTransform(36.3, -50.4);

    this.shape_68 = new cjs.Shape();
    this.shape_68.graphics.f("#FFFFFF").s().p("AjkDwIAAnfIHJAAIAAHfg");
    this.shape_68.setTransform(36.3, -50.7);

    this.shape_69 = new cjs.Shape();
    this.shape_69.graphics.f("#FFFFFF").s().p("AjkDzIAAnlIHJAAIAAHlg");
    this.shape_69.setTransform(36.3, -51.1);

    this.shape_70 = new cjs.Shape();
    this.shape_70.graphics.f("#FFFFFF").s().p("AjkD2IAAnrIHJAAIAAHrg");
    this.shape_70.setTransform(36.3, -51.4);

    this.shape_71 = new cjs.Shape();
    this.shape_71.graphics.f("#FFFFFF").s().p("AjkD6IAAnzIHJAAIAAHzg");
    this.shape_71.setTransform(36.3, -51.8);

    this.shape_72 = new cjs.Shape();
    this.shape_72.graphics.f("#FFFFFF").s().p("AjkD9IAAn5IHJAAIAAH5g");
    this.shape_72.setTransform(36.3, -52.1);

    this.shape_73 = new cjs.Shape();
    this.shape_73.graphics.f("#FFFFFF").s().p("AjkEAIAAn/IHJAAIAAH/g");
    this.shape_73.setTransform(36.3, -52.4);

    this.shape_74 = new cjs.Shape();
    this.shape_74.graphics.f("#FFFFFF").s().p("AjkEDIAAoGIHJAAIAAIGg");
    this.shape_74.setTransform(36.3, -52.8);

    this.shape_75 = new cjs.Shape();
    this.shape_75.graphics.f("#FFFFFF").s().p("AjkEHIAAoNIHJAAIAAINg");
    this.shape_75.setTransform(36.3, -53.1);

    this.shape_76 = new cjs.Shape();
    this.shape_76.graphics.f("#FFFFFF").s().p("AjkEKIAAoTIHJAAIAAITg");
    this.shape_76.setTransform(36.3, -53.5);

    this.shape_77 = new cjs.Shape();
    this.shape_77.graphics.f("#FFFFFF").s().p("AjkENIAAoZIHJAAIAAIZg");
    this.shape_77.setTransform(36.3, -53.8);

    this.shape_78 = new cjs.Shape();
    this.shape_78.graphics.f("#FFFFFF").s().p("AjkEQIAAofIHJAAIAAIfg");
    this.shape_78.setTransform(36.3, -54.2);

    this.shape_79 = new cjs.Shape();
    this.shape_79.graphics.f("#FFFFFF").s().p("AjkEUIAAonIHJAAIAAIng");
    this.shape_79.setTransform(36.3, -54.5);

    this.shape_80 = new cjs.Shape();
    this.shape_80.graphics.f("#FFFFFF").s().p("AjkEXIAAotIHJAAIAAItg");
    this.shape_80.setTransform(36.3, -54.8);

    this.shape_81 = new cjs.Shape();
    this.shape_81.graphics.f("#FFFFFF").s().p("AjkEaIAAozIHJAAIAAIzg");
    this.shape_81.setTransform(36.3, -55.2);

    this.shape_82 = new cjs.Shape();
    this.shape_82.graphics.f("#FFFFFF").s().p("AjkEeIAAo7IHJAAIAAI7g");
    this.shape_82.setTransform(36.3, -55.5);

    this.shape_83 = new cjs.Shape();
    this.shape_83.graphics.f("#FFFFFF").s().p("AjkEhIAApBIHJAAIAAJBg");
    this.shape_83.setTransform(36.3, -55.9);

    this.shape_84 = new cjs.Shape();
    this.shape_84.graphics.f("#FFFFFF").s().p("AjkEkIAApHIHJAAIAAJHg");
    this.shape_84.setTransform(36.3, -56.2);

    this.shape_85 = new cjs.Shape();
    this.shape_85.graphics.f("#FFFFFF").s().p("AjkEnIAApNIHJAAIAAJNg");
    this.shape_85.setTransform(36.3, -56.6);

    this.shape_86 = new cjs.Shape();
    this.shape_86.graphics.f("#FFFFFF").s().p("AjkErIAApVIHJAAIAAJVg");
    this.shape_86.setTransform(36.3, -56.9);

    this.shape_87 = new cjs.Shape();
    this.shape_87.graphics.f("#FFFFFF").s().p("AjkEuIAApbIHJAAIAAJbg");
    this.shape_87.setTransform(36.3, -57.3);

    this.shape_88 = new cjs.Shape();
    this.shape_88.graphics.f("#FFFFFF").s().p("AjkExIAAphIHJAAIAAJhg");
    this.shape_88.setTransform(36.3, -57.6);

    this.shape_89 = new cjs.Shape();
    this.shape_89.graphics.f("#FFFFFF").s().p("AjkE0IAApnIHJAAIAAJng");
    this.shape_89.setTransform(36.3, -57.9);

    this.shape_90 = new cjs.Shape();
    this.shape_90.graphics.f("#FFFFFF").s().p("AjkE4IAApuIHJAAIAAJug");
    this.shape_90.setTransform(36.3, -58.3);

    this.shape_91 = new cjs.Shape();
    this.shape_91.graphics.f("#FFFFFF").s().p("AjkE7IAAp1IHJAAIAAJ1g");
    this.shape_91.setTransform(36.3, -58.6);

    this.shape_92 = new cjs.Shape();
    this.shape_92.graphics.f("#FFFFFF").s().p("AjkE+IAAp7IHJAAIAAJ7g");
    this.shape_92.setTransform(36.3, -59);

    this.shape_93 = new cjs.Shape();
    this.shape_93.graphics.f("#FFFFFF").s().p("AjkFBIAAqBIHJAAIAAKBg");
    this.shape_93.setTransform(36.3, -59.3);

    this.shape_94 = new cjs.Shape();
    this.shape_94.graphics.f("#FFFFFF").s().p("AjkFFIAAqJIHJAAIAAKJg");
    this.shape_94.setTransform(36.3, -59.7);

    this.shape_95 = new cjs.Shape();
    this.shape_95.graphics.f("#FFFFFF").s().p("AjkFIIAAqPIHJAAIAAKPg");
    this.shape_95.setTransform(36.3, -60);

    this.shape_96 = new cjs.Shape();
    this.shape_96.graphics.f("#FFFFFF").s().p("AjkFLIAAqVIHJAAIAAKVg");
    this.shape_96.setTransform(36.3, -60.3);

    this.shape_97 = new cjs.Shape();
    this.shape_97.graphics.f("#FFFFFF").s().p("AjkFPIAAqdIHJAAIAAKdg");
    this.shape_97.setTransform(36.3, -60.7);

    this.shape_98 = new cjs.Shape();
    this.shape_98.graphics.f("#FFFFFF").s().p("AjkFSIAAqjIHJAAIAAKjg");
    this.shape_98.setTransform(36.3, -61);

    this.shape_99 = new cjs.Shape();
    this.shape_99.graphics.f("#FFFFFF").s().p("AjkFVIAAqpIHJAAIAAKpg");
    this.shape_99.setTransform(36.3, -61.4);

    this.shape_100 = new cjs.Shape();
    this.shape_100.graphics.f("#FFFFFF").s().p("AjkFYIAAqvIHJAAIAAKvg");
    this.shape_100.setTransform(36.3, -61.7);

    this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = this.shape_10.mask = this.shape_11.mask = this.shape_12.mask = this.shape_13.mask = this.shape_14.mask = this.shape_15.mask = this.shape_16.mask = this.shape_17.mask = this.shape_18.mask = this.shape_19.mask = this.shape_20.mask = this.shape_21.mask = this.shape_22.mask = this.shape_23.mask = this.shape_24.mask = this.shape_25.mask = this.shape_26.mask = this.shape_27.mask = this.shape_28.mask = this.shape_29.mask = this.shape_30.mask = this.shape_31.mask = this.shape_32.mask = this.shape_33.mask = this.shape_34.mask = this.shape_35.mask = this.shape_36.mask = this.shape_37.mask = this.shape_38.mask = this.shape_39.mask = this.shape_40.mask = this.shape_41.mask = this.shape_42.mask = this.shape_43.mask = this.shape_44.mask = this.shape_45.mask = this.shape_46.mask = this.shape_47.mask = this.shape_48.mask = this.shape_49.mask = this.shape_50.mask = this.shape_51.mask = this.shape_52.mask = this.shape_53.mask = this.shape_54.mask = this.shape_55.mask = this.shape_56.mask = this.shape_57.mask = this.shape_58.mask = this.shape_59.mask = this.shape_60.mask = this.shape_61.mask = this.shape_62.mask = this.shape_63.mask = this.shape_64.mask = this.shape_65.mask = this.shape_66.mask = this.shape_67.mask = this.shape_68.mask = this.shape_69.mask = this.shape_70.mask = this.shape_71.mask = this.shape_72.mask = this.shape_73.mask = this.shape_74.mask = this.shape_75.mask = this.shape_76.mask = this.shape_77.mask = this.shape_78.mask = this.shape_79.mask = this.shape_80.mask = this.shape_81.mask = this.shape_82.mask = this.shape_83.mask = this.shape_84.mask = this.shape_85.mask = this.shape_86.mask = this.shape_87.mask = this.shape_88.mask = this.shape_89.mask = this.shape_90.mask = this.shape_91.mask = this.shape_92.mask = this.shape_93.mask = this.shape_94.mask = this.shape_95.mask = this.shape_96.mask = this.shape_97.mask = this.shape_98.mask = this.shape_99.mask = this.shape_100.mask = mask;

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape
      }]
    }).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_17
      }]
    }, 1).to({
      state: [{
        t: this.shape_18
      }]
    }, 1).to({
      state: [{
        t: this.shape_19
      }]
    }, 1).to({
      state: [{
        t: this.shape_20
      }]
    }, 1).to({
      state: [{
        t: this.shape_21
      }]
    }, 1).to({
      state: [{
        t: this.shape_22
      }]
    }, 1).to({
      state: [{
        t: this.shape_23
      }]
    }, 1).to({
      state: [{
        t: this.shape_24
      }]
    }, 1).to({
      state: [{
        t: this.shape_25
      }]
    }, 1).to({
      state: [{
        t: this.shape_26
      }]
    }, 1).to({
      state: [{
        t: this.shape_27
      }]
    }, 1).to({
      state: [{
        t: this.shape_28
      }]
    }, 1).to({
      state: [{
        t: this.shape_29
      }]
    }, 1).to({
      state: [{
        t: this.shape_30
      }]
    }, 1).to({
      state: [{
        t: this.shape_31
      }]
    }, 1).to({
      state: [{
        t: this.shape_32
      }]
    }, 1).to({
      state: [{
        t: this.shape_33
      }]
    }, 1).to({
      state: [{
        t: this.shape_34
      }]
    }, 1).to({
      state: [{
        t: this.shape_35
      }]
    }, 1).to({
      state: [{
        t: this.shape_36
      }]
    }, 1).to({
      state: [{
        t: this.shape_37
      }]
    }, 1).to({
      state: [{
        t: this.shape_38
      }]
    }, 1).to({
      state: [{
        t: this.shape_39
      }]
    }, 1).to({
      state: [{
        t: this.shape_40
      }]
    }, 1).to({
      state: [{
        t: this.shape_41
      }]
    }, 1).to({
      state: [{
        t: this.shape_42
      }]
    }, 1).to({
      state: [{
        t: this.shape_43
      }]
    }, 1).to({
      state: [{
        t: this.shape_44
      }]
    }, 1).to({
      state: [{
        t: this.shape_45
      }]
    }, 1).to({
      state: [{
        t: this.shape_46
      }]
    }, 1).to({
      state: [{
        t: this.shape_47
      }]
    }, 1).to({
      state: [{
        t: this.shape_48
      }]
    }, 1).to({
      state: [{
        t: this.shape_49
      }]
    }, 1).to({
      state: [{
        t: this.shape_50
      }]
    }, 1).to({
      state: [{
        t: this.shape_51
      }]
    }, 1).to({
      state: [{
        t: this.shape_52
      }]
    }, 1).to({
      state: [{
        t: this.shape_53
      }]
    }, 1).to({
      state: [{
        t: this.shape_54
      }]
    }, 1).to({
      state: [{
        t: this.shape_55
      }]
    }, 1).to({
      state: [{
        t: this.shape_56
      }]
    }, 1).to({
      state: [{
        t: this.shape_57
      }]
    }, 1).to({
      state: [{
        t: this.shape_58
      }]
    }, 1).to({
      state: [{
        t: this.shape_59
      }]
    }, 1).to({
      state: [{
        t: this.shape_60
      }]
    }, 1).to({
      state: [{
        t: this.shape_61
      }]
    }, 1).to({
      state: [{
        t: this.shape_62
      }]
    }, 1).to({
      state: [{
        t: this.shape_63
      }]
    }, 1).to({
      state: [{
        t: this.shape_64
      }]
    }, 1).to({
      state: [{
        t: this.shape_65
      }]
    }, 1).to({
      state: [{
        t: this.shape_66
      }]
    }, 1).to({
      state: [{
        t: this.shape_67
      }]
    }, 1).to({
      state: [{
        t: this.shape_68
      }]
    }, 1).to({
      state: [{
        t: this.shape_69
      }]
    }, 1).to({
      state: [{
        t: this.shape_70
      }]
    }, 1).to({
      state: [{
        t: this.shape_71
      }]
    }, 1).to({
      state: [{
        t: this.shape_72
      }]
    }, 1).to({
      state: [{
        t: this.shape_73
      }]
    }, 1).to({
      state: [{
        t: this.shape_74
      }]
    }, 1).to({
      state: [{
        t: this.shape_75
      }]
    }, 1).to({
      state: [{
        t: this.shape_76
      }]
    }, 1).to({
      state: [{
        t: this.shape_77
      }]
    }, 1).to({
      state: [{
        t: this.shape_78
      }]
    }, 1).to({
      state: [{
        t: this.shape_79
      }]
    }, 1).to({
      state: [{
        t: this.shape_80
      }]
    }, 1).to({
      state: [{
        t: this.shape_81
      }]
    }, 1).to({
      state: [{
        t: this.shape_82
      }]
    }, 1).to({
      state: [{
        t: this.shape_83
      }]
    }, 1).to({
      state: [{
        t: this.shape_84
      }]
    }, 1).to({
      state: [{
        t: this.shape_85
      }]
    }, 1).to({
      state: [{
        t: this.shape_86
      }]
    }, 1).to({
      state: [{
        t: this.shape_87
      }]
    }, 1).to({
      state: [{
        t: this.shape_88
      }]
    }, 1).to({
      state: [{
        t: this.shape_89
      }]
    }, 1).to({
      state: [{
        t: this.shape_90
      }]
    }, 1).to({
      state: [{
        t: this.shape_91
      }]
    }, 1).to({
      state: [{
        t: this.shape_92
      }]
    }, 1).to({
      state: [{
        t: this.shape_93
      }]
    }, 1).to({
      state: [{
        t: this.shape_94
      }]
    }, 1).to({
      state: [{
        t: this.shape_95
      }]
    }, 1).to({
      state: [{
        t: this.shape_96
      }]
    }, 1).to({
      state: [{
        t: this.shape_97
      }]
    }, 1).to({
      state: [{
        t: this.shape_98
      }]
    }, 1).to({
      state: [{
        t: this.shape_99
      }]
    }, 1).to({
      state: [{
        t: this.shape_100
      }]
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-13.3, -124, 324.2, 151.9);


  (lib.PopUp = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // Layer 2
    this.instance = new lib.Cursor();
    this.instance.parent = this;
    this.instance.setTransform(29.9, 149.5, 1.282, 1.282, 0, 0, 0, -9.7, 46.2);

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    // cross
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#262F4B").ss(5, 1, 1).p("AAAAAIBVBUABUhTIhUBTIhUBUAhThTIBTBT");
    this.shape.setTransform(99.7, -117.1);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    // arrow
    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#DC6B81").s().p("AAZA0QgBgCAAgDIgBgiIh6AAIAAgZIB6AAIABgiQAAgDABgCQABgBAAAAQABAAAAAAQABgBABAAQAAAAABAAQADAAACACIA+AvIADADIAAAAIAAADQAAABAAAAQAAABgBAAQAAABgBAAQAAAAgBAAIg+AvQgCACgDAAQgBAAAAAAQgBAAgBAAQAAgBgBAAQAAAAgBgBg");
    this.shape_1.setTransform(7.8, -32.4);

    this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

    // static texts
    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#5C85CA").s().p("AgaA6QgKgDgGgDIAAgZIADAAQAHAFAIADQAJACAHAAIAIgBQAEAAADgCQADgCACgEQABgCAAgGQAAgEgCgDQgCgDgEgCQgEgBgDAAIgJAAIgFAAIAAgSIAEAAIAKgBIAGgCIAFgEQABgDAAgFQAAgDgBgCIgEgEIgFgBIgGgBIgJABIgJADIgHADIgFADIgCAAIAAgZIAQgFQAKgCALAAQAIAAAIACQAHABAGAEQAGADADAGQADAGAAAHQAAAKgGAIQgGAGgJADIAAABIAIACQAEAAAEADQADADACAFQADAEAAAIQAAAIgDAHQgEAHgGAFQgGAFgIADQgJACgKAAQgNAAgKgCg");
    this.shape_2.setTransform(12.6, 34.8);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#5C85CA").s().p("AgVApQgIgCgFgDIAAgVIACAAIAEACIAHAEIAIADIAKABQADAAAEgBQAEgCAAgEQAAgBAAAAQAAgBAAAAQAAgBgBAAQAAgBAAAAIgHgDIgGgCIgIgCQgKgCgFgFQgFgFAAgKQAAgGADgEQACgFAFgEQAFgDAIgDQAHgCAHAAQAIAAAIACIAMAEIAAAUIgCAAIgEgCIgGgDIgHgDIgIgBQgEAAgEADQgDACAAACQAAABAAABQAAABAAAAQAAABABAAQAAABAAAAIAHADIAHABIAJACQAIAEAFADQAFAGAAAJQAAAFgDAGQgDAFgFADQgFAEgHADQgHACgIAAQgJAAgJgCg");
    this.shape_3.setTransform(-11.8, -30.8);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#5C85CA").s().p("AgfBEIAqiHIAVAAIgqCHg");
    this.shape_4.setTransform(-20.4, -31.3);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#5C85CA").s().p("AADA2IAAgaIguAAIAAgUIAtg9IAbAAIAAA+IAPAAIAAATIgPAAIAAAagAgXAJIAaAAIAAgjg");
    this.shape_5.setTransform(-29.2, -32.2);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#5C85CA").s().p("AgjA2IAAgTIAYAAIAAg3IgYAAIAAgSIAKgBIAIgCQAEgCACgDIACgHIAWAAIAABYIAWAAIAAATg");
    this.shape_6.setTransform(-38.5, -32.2);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#DC6B81").s().p("AgVApQgIgCgFgDIAAgVIACAAIAEACIAHAEIAIADIAKABQADAAAEgBQAEgCAAgEQAAgBAAAAQAAgBAAAAQAAgBgBAAQAAgBAAAAIgHgDIgGgCIgIgBQgKgEgFgEQgFgGAAgJQAAgGADgEQACgFAFgEQAFgEAIgCQAHgCAHAAQAIAAAIABIAMAFIAAAUIgCAAIgEgCIgGgDIgHgDIgIgBQgEAAgEACQgDACAAAEQAAAAAAABQAAABAAAAQAAABABAAQAAABAAAAIAHADIAHACIAJABQAIADAFAEQAFAGAAAJQAAAGgDAFQgDAFgFAEQgFADgHADQgHACgIAAQgJAAgJgCg");
    this.shape_7.setTransform(53.4, -31.5);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#DC6B81").s().p("AgfBEIAqiHIAVAAIgqCHg");
    this.shape_8.setTransform(44.9, -31.9);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#DC6B81").s().p("AgPA1QgHgCgFgGQgGgGgEgKQgDgKAAgOQAAgMADgLQADgMAHgIQAHgIAKgFQAKgEAOAAIALAAIAHABIAAAWIgCAAIgGgCIgKgBQgNAAgFAGQgHAHgCANIALgGQAEgCAHAAQAGAAAFACQAFABAEADQAGAFADAGQADAGAAALQAAARgLALQgLALgTAAQgHAAgIgDgAgHABIgGACIAAACIAAAEQAAAKACAFQABAGADADIAEADIADABIAFgBIAEgDIAEgGIABgJIgBgJQgCgDgCgCIgGgDIgEgBg");
    this.shape_9.setTransform(36.1, -32.8);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#DC6B81").s().p("AgjA2IAAgTIAYAAIAAg3IgYAAIAAgSIAKgBIAIgCQAEgCACgDIACgHIAWAAIAABYIAWAAIAAATg");
    this.shape_10.setTransform(26.8, -32.9);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_10
      }, {
        t: this.shape_9
      }, {
        t: this.shape_8
      }, {
        t: this.shape_7
      }, {
        t: this.shape_6
      }, {
        t: this.shape_5
      }, {
        t: this.shape_4
      }, {
        t: this.shape_3
      }, {
        t: this.shape_2
      }]
    }).wait(1));

    // btn
    this.popUpBtn = new lib.button_popUp();
    this.popUpBtn.parent = this;
    this.popUpBtn.setTransform(-4.6, 101.9, 1, 1, 0, 0, 0, -2.4, -3.2);

    this.timeline.addTween(cjs.Tween.get(this.popUpBtn).wait(1));

    // Milking machines
    this.milkingMachineTxt = new cjs.Text("Milking Machines", "bold 13px 'Tahoma'", "#2A344E");
    this.milkingMachineTxt.name = "milkingMachineTxt";
    this.milkingMachineTxt.textAlign = "center";
    this.milkingMachineTxt.lineHeight = 15;
    this.milkingMachineTxt.lineWidth = 168;
    this.milkingMachineTxt.parent = this;
    this.milkingMachineTxt.setTransform(17, 3.2);

    this.timeline.addTween(cjs.Tween.get(this.milkingMachineTxt).wait(1));

    // cowSpeedTxt
    this.speedTxt = new cjs.Text("Cow Speed", "bold 13px 'Tahoma'", "#2A344E");
    this.speedTxt.name = "speedTxt";
    this.speedTxt.textAlign = "center";
    this.speedTxt.lineHeight = 18;
    this.speedTxt.lineWidth = 150;
    this.speedTxt.parent = this;
    this.speedTxt.setTransform(9.3, -62.4);

    this.timeline.addTween(cjs.Tween.get(this.speedTxt).wait(1));

    // levelTxt
    this.levelTxt = new cjs.Text("Level 1", "bold 15px 'Tahoma'", "#6C98E1");
    this.levelTxt.name = "levelTxt";
    this.levelTxt.lineHeight = 20;
    this.levelTxt.lineWidth = 149;
    this.levelTxt.parent = this;
    this.levelTxt.setTransform(-54, -103);

    this.timeline.addTween(cjs.Tween.get(this.levelTxt).wait(1));

    // stageTxt
    this.stageTxt = new cjs.Text("Cow stage", "bold 13px 'Tahoma'", "#232C49");
    this.stageTxt.name = "stageTxt";
    this.stageTxt.lineHeight = 18;
    this.stageTxt.lineWidth = 148;
    this.stageTxt.parent = this;
    this.stageTxt.setTransform(-53.4, -120.5);

    this.timeline.addTween(cjs.Tween.get(this.stageTxt).wait(1));

    // icon
    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f().s("#253453").ss(2, 0, 0, 4).p("AB0iSIAAgzQAAgJgHgHQgGgHgKAAQgJAAgIAHQgGAHAAAJIAAAXQgVgJgZAAQgYAAgUAJIAAgXQAAgJgHgHQgHgHgKAAQgJAAgHAHQgHAHAAAJIAAAzIAGAAAB0iSIgcgSQgJgGgJgEAB+iIIACAJIgMgTACPA4IAAhYIAAgTIAAgMQAAgFAAgFAhfhIIgSAAQgZgBgSgPQgSgRgDgXIBlAAQgQAZgDAfQAAAEAAAFIAAB2AgUiuQgWAIgRASQgBABgBABQgIAJgHAJACPA4QgYgTghAAIh+gBQgfAAgYATQgFAEgFAEQgbAbAAAnQAAAmAbAbQAbAbAmAAICDAAQAlAAAagbQAagbAAglQgBgngbgbQgEgEgFgEg");
    this.shape_11.setTransform(-89.6, -100.2);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFB2B2").s().p("Ag/BcQgnAAgbgbQgbgbAAgmQAAglAbgbIALgJQAXgSAgAAIB9AAQAhABAZATIAIAHQAcAcAAAlQABAlgaAbQgaAbgmAAgABFgeQgFAGAAAIIAAAjQAAAHAFAFQAGAGAHAAQAIAAAGgGQAFgFAAgHIAAgjQAAgIgFgGQgGgFgIAAQgHAAgGAFgAhfgeQgFAFAAAIIAAAjQAAAIAFAFQAFAGAIAAQAIAAAFgGQAGgFAAgIIAAgjQAAgIgGgFQgFgGgIAAQgHAAgGAGg");
    this.shape_12.setTransform(-87.3, -87.2);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("ABnBlIh9gBQggAAgXATIAAh3IAAgIQACgfARgZQAGgJAJgJIABgCQASgSAVgIQATgJAZAAQAZAAAVAJQAKAEAIAGQhPgOAPBXQAGAnAeARQAbAQA5gPIAABaQgZgTghAAgAgigdQgGAHAAAJQAAAKAGAEQAHAHAKAAQAKAAAGgHQAFgEAAgKQAAgJgFgHQgGgHgKAAQgKAAgHAHgACfgNIABAEIABAAIAAAJIAAAMIgCgZgABVACQgHgFAAgKQAAgJAHgHQAGgHAKAAQAJAAAHAHQAHAHAAAKQAAAJgHAFQgHAGgJAAQgKAAgGgGgAhggIQgYgBgSgPQgSgRgEgXIBmAAQgRAZgCAfgAg6hAg");
    this.shape_13.setTransform(-91.4, -106.6);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FDFFB5").s().p("AA/ASQgIgGgKgDIAAgVQABgKAGgHQAHgGAKAAQAKAAAGAGQAHAHAAAKIgBAxgAhbAkIAAgxQAAgJAHgHQAGgHAKAAQAKAAAGAHQAIAHgBAJIAAAVQgVAJgRASIgCABg");
    this.shape_14.setTransform(-87.2, -118.6);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#253453").s().p("AASChQgFgFAAgIIAAglQAAgHAFgGQAGgFAHAAQAIAAAGAFQAFAGAAAHIAAAlQAAAIgFAFQgGAGgIAAQgHAAgGgGgAiSChQgFgGAAgHIAAglQAAgIAFgFQAGgGAHAAQAIAAAFAGQAGAFAAAIIAAAlQAAAHgGAGQgFAFgIAAQgIAAgFgFgAgNggQgegRgGgpQgPhXBNANIAcATIANASIgDgIIBjgaQAHAagOAXQgNAXgaAHIgjAJIgBAAIgBgDIACAaIAAATQgcAHgUAAQgVAAgNgIgAgFhcQgHAGAAAKQAAAJAHAHQAFAHAJAAQAJAAAHgHQAHgHAAgJQAAgKgHgGQgHgHgJAAQgJAAgFAHgAh+g8QgGgHAAgJQAAgKAGgHQAHgHAKAAQAKAAAGAHQAHAHAAAKQAAAJgHAHQgGAGgKAAQgKAAgHgGg");
    this.shape_15.setTransform(-82.2, -100.2);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f().s("#253453").ss(3, 1, 1).p("AiOAvIAgAJAhngRIAWAUAglg4IAIAfAAmg4IgIAgACPAvIggAKABogRIgWAU");
    this.shape_16.setTransform(-73.8, -47.7);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f().s("#253453").ss(2, 1, 1).p("ADUAAQAABXg+A/Qg/A+hXAAQhXAAg+g+Qg/g/AAhXQAAhXA/g+QA+g/BXAAQBXAAA/A/QA+A+AABXgAhpgPQAKglAegXQAfgXAlABQAmABAdAYQAbAXAJAkAAAApQAAAAAAAAQgNAAgKgKQgJgKAAgNQAAgLAJgKQAKgJANAAQAJAAAIAF");
    this.shape_17.setTransform(-73.8, -40.3);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#253453").s().p("AgeAeQgLgBgGgIIgBgDQgHgKADgJIAFgSQACgIAIgGIAHgEIAJgBQAGAAAFACIAwAXQAJAFAEAIQAFAHgDAKQgCAKgHAGQgIAGgKAAgAgbgOIgFARQAAAAAAABQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQABABAAAAQABAAAAAAQABABABAAIA0AIIABAAQAGAAABgFQACgGgGgDIgwgVIgCgBQgFAAgBAEg");
    this.shape_18.setTransform(-69, -38.3);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("AiVCWQg+g+AAhYQAAhWA+g/QA/g/BWABQBYgBA+A/QA+A/AABWQAABYg+A+Qg+A/hYAAQhWAAg/g/gAAKgNQgIAGgCAHIgDARQgDAMAGAKIAAACQAGAIAKACIA7AJQAJgBAJgGQAHgGACgKQADgKgFgJQgEgIgKgEIgxgWQgFgCgHAAIgIABQgIgFgJAAQgNAAgJAJQgKAKAAALQAAANAKALQAJAJANAAIAAAAIAAAAQgNAAgJgJQgKgLAAgNQAAgLAKgKQAJgJANAAQAJAAAIAFIgHAEgAAEhhQAlABAcAYQAdAXAIAkQgIgkgdgXQgcgYglgBIgDAAIgBAAIAAAAIAAAAQghABgbASIgBAAIAAABIgBAAIgDACQgeAXgJAlQAJglAegXIADgCIABAAIAAgBIABAAQAbgSAhgBIAAAAIAAAAIABAAIADAAIAAAAgABwgQIAfgJgAhugRIgggJgABShFIAWgWgAhRhFIgWgWgAAehjIAIgfgAgdhkIgIgegABKAmIg2gIQgBAAgBAAQAAgBgBAAQAAAAgBgBQAAAAgBgBQAAAAAAgBQAAAAAAgBQAAAAAAgBQAAAAAAgBIAFgSQABgFAEAAIADABIAyAXQAFADgBAGQgBAGgGAAgAARgRIAAAAg");
    this.shape_19.setTransform(-73.8, -40.3);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f().s("#253453").ss(2, 1, 1).p("AAogcIBdAAQAKAAAHAHQAIAIAAAKQAAAIgIAHQgEAEgGACQgDABgEAAIkJAAQgEAAgEgBQgFgCgEgEQgIgHAAgIQAAgKAIgIQAHgHAKAAIBXAAQACAAACAAQADgBADgBQAGgDADgHIAFgQQANACAHAAQAEAAANgCIAFAQQADAHAHADQACABADABQACAAACAAQACgBACAAQAHgDADgHQAEgGgDgHIgGgRQARgJAMgPIAPAIQAHAEAHgBQAGgDAFgGQADgGgCgHQgCgHgGgEIgPgJQAGgRAAgUAhrihQAAAUAGARIgPAJQgGAEgCAHQgCAHADAGQAFAGAHADQAGABAHgEIAPgIQALAOASAKIgGARQgCAHADAGQADAHAHADQACAAACABAgpgcIBNAAABYB1QAGgFAFgFQAmgmADgzAhdBxQAoAjA1AAQAyAAAmgfABYCvIAAg6ADbAAQAABahABBQhABAhbAAQhaAAhAhAQhAhBAAhaQAAhZBAhBQBAhABaAAQBbAABABAQBABBAABZgAiMASQAEAzAlAmQADADADADIAAA+");
    this.shape_20.setTransform(-74.1, 24.8);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("AiaCbQhAhBAAhaQAAhZBAhBQBAhABaAAQBbAABABAQBABBAABZQAABahABBQhABAhbAAQhaAAhAhAgABYCvIAAg6gAhdCvIAAg/IgGgFQglgmgEgzQAEAzAlAmIAGAFgAAACUQAyAAAmgfQgmAfgyAAQg1AAgogkQAoAkA1AAIAAAAgABjBrIgLAKIALgKQAmgmADgzQAGgCAEgEQAIgHAAgIQAAgKgIgIQgHgHgKAAIhdAAIAEgBQAHgDADgHQACgDAAgEIgBgGIgGgRQARgJAMgPIAPAIQAFADAFAAIAAAAIAAAAIADAAIABAAQAGgDAFgGQACgEAAgEIgBgFQgCgHgGgEIgPgJQAGgRAAgUQAAAUgGARIAPAJQAGAEACAHIABAFQAAAEgCAEQgFAGgGADIgBAAIgDAAIAAAAIAAAAQgFAAgFgDIgPgIQgMAPgRAJIAGARIABAGQAAAEgCADQgDAHgHADIgEABIgCAAIgCAAIACAAIACAAIBdAAQAKAAAHAHQAIAIAAAKQAAAIgIAHQgEAEgGACIgHABIkJAAQgEAAgEgBQgFgCgEgEQgIgHAAgIQAAgKAIgIQAHgHAKAAIBXAAIhXAAQgKAAgHAHQgIAIAAAKQAAAIAIAHQAEAEAFACQAEABAEAAIEJAAIAHgBQgDAzgmAmgAg7gnQADAHAHADIAEABIAEAAIBNAAIgFgCQgHgDgDgHIgFgQIgRACIgUgCIgFAQQgDAHgGADIgGACIgEAAIgEgBQgHgDgDgHQgCgDAAgEIABgGIAGgRQgSgKgLgOIgPAIQgFADgEAAIgBAAIAAAAIgDAAIAAAAQgHgDgFgGQgCgEAAgEIABgFQACgHAGgEIAPgJQgGgRAAgUQAAAUAGARIgPAJQgGAEgCAHIgBAFQAAAEACAEQAFAGAHADIAAAAIADAAIAAAAIABAAQAEAAAFgDIAPgIQALAOASAKIgGARIgBAGQAAAEACADgAgpgcIAGgCQAGgDADgHIAFgQIAUACIARgCIAFAQQADAHAHADIAFACgAgpgcg");
    this.shape_21.setTransform(-74.1, 24.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_21
      }, {
        t: this.shape_20
      }, {
        t: this.shape_19
      }, {
        t: this.shape_18
      }, {
        t: this.shape_17
      }, {
        t: this.shape_16
      }, {
        t: this.shape_15
      }, {
        t: this.shape_14
      }, {
        t: this.shape_13
      }, {
        t: this.shape_12
      }, {
        t: this.shape_11
      }]
    }).wait(1));

    // segments
    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f().s("#8F95A2").ss(2.3, 0, 0, 4).p("ArTkfIWnAAQB3AABUBVQBVBUAAB2IAAAAQAAB3hVBUQhUBVh3AAI2nAAQh3AAhUhVQhVhUAAh3IAAAAQAAh2BVhUQBUhVB3AAg");
    this.shape_22.setTransform(0, 26.8);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFFFFF").s().p("ArTEgQh3AAhUhVQhUhUgBh3IAAAAQABh2BUhUQBUhVB3AAIWnAAQB3AABUBVQBUBUABB2IAAAAQgBB3hUBUQhUBVh3AAg");
    this.shape_23.setTransform(0, 26.8);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f().s("#8F95A2").ss(2.3, 0, 0, 4).p("ArTkfIWnAAQB3AABUBVQBVBUAAB2IAAAAQAAB3hVBUQhUBVh3AAI2nAAQh3AAhUhVQhVhUAAh3IAAAAQAAh2BVhUQBUhVB3AAg");
    this.shape_24.setTransform(0, -40.8);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("ArTEgQh3AAhUhVQhUhUgBh3IAAAAQABh2BUhUQBUhVB3AAIWnAAQB3AABUBVQBUBUABB2IAAAAQgBB3hUBUQhUBVh3AAg");
    this.shape_25.setTransform(0, -40.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_25
      }, {
        t: this.shape_24
      }, {
        t: this.shape_23
      }, {
        t: this.shape_22
      }]
    }).wait(1));

    // bg
    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f().s("#1C2B4C").ss(4.6, 0, 0, 4).p("Avd2cIe7AAQB8AABYBYQBYBYAAB8MAAAAjhQAAB8hYBYQhYBYh8AAI+7AAQh8AAhYhYQhYhYAAh8MAAAgjhQAAh8BYhYQBYhYB8AAg");

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("AvdWdQh8AAhYhYQhYhYAAh8MAAAgjhQAAh8BYhYQBYhYB8AAIe7AAQB8AABYBYQBYBYAAB8MAAAAjhQAAB8hYBYQhYBYh8AAg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_27
      }, {
        t: this.shape_26
      }]
    }).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-131.3, -146, 278.9, 336.5);


  (lib.gameElementsLocators_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "Vertical": 0
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // clickerContainer
    this.clickerContainer = new lib.clickerLocators_mc();
    this.clickerContainer.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.clickerContainer).wait(1));

    // houseLoc
    this.houseLoc = new lib.locator();
    this.houseLoc.parent = this;
    this.houseLoc.setTransform(27, -30);

    this.timeline.addTween(cjs.Tween.get(this.houseLoc).wait(1));

    // bridgeLoc
    this.bridgeLoc = new lib.locator();
    this.bridgeLoc.parent = this;
    this.bridgeLoc.setTransform(29.4, 87.8);

    this.timeline.addTween(cjs.Tween.get(this.bridgeLoc).wait(1));

    // flowersLoc
    this.flowersLoc = new lib.locator();
    this.flowersLoc.parent = this;
    this.flowersLoc.setTransform(10.7, -13.1);

    this.timeline.addTween(cjs.Tween.get(this.flowersLoc).wait(1));

    // matchBgLoc
    this.matchBgLoc = new lib.locator();
    this.matchBgLoc.parent = this;
    this.matchBgLoc.setTransform(-95.5, -155.1);

    this.timeline.addTween(cjs.Tween.get(this.matchBgLoc).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-2000.5, -350, 2370.5, 828.3);


  (lib.FinalPopUp = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "varA": 0,
      "varB": 1,
      "varC": 2
    });

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
      var hit = new createjs.Shape();
      hit.graphics.beginFill("#000").drawRect(-130, -145, 260, 290);
      this.hitArea = hit;
    }
    this.frame_1 = function() {
      this.stop();
    }
    this.frame_2 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

    // Layer 6
    this.instance = new lib.cow_rainbow();
    this.instance.parent = this;
    this.instance.setTransform(-65.8, -100.7, 1.328, 1.328);

    this.instance_1 = new lib.cow_unicorn();
    this.instance_1.parent = this;
    this.instance_1.setTransform(2.9, -55.4, 1.328, 1.328, 0, 0, 0, 51.6, 35.5);

    this.instance_2 = new lib.cow_austronaut();
    this.instance_2.parent = this;
    this.instance_2.setTransform(-11.2, -47.1, 1.328, 1.328, 0, 0, 0, 45.9, 32.4);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.instance
      }]
    }).to({
      state: [{
        t: this.instance_1
      }]
    }, 1).to({
      state: [{
        t: this.instance_2
      }]
    }, 1).wait(1));

    // Layer 7
    this.shape = new cjs.Shape();
    this.shape.graphics.f("rgba(69,69,69,0.498)").s().p("AnCBTQi7giAAgxQAAgwC7gjQC7gjEHABQEIgBC7AjQC7AjAAAwQAAAxi7AiQi7AkkIgBQkHABi7gkg");
    this.shape.setTransform(9.5, -5.6, 0.781, 0.946);

    this.timeline.addTween(cjs.Tween.get(this.shape).wait(3));

    // CURSOR
    this.cursor = new lib.Cursor();
    this.cursor.parent = this;
    this.cursor.setTransform(0, 167.6, 1.282, 1.282, 0, 0, 0, -9.7, 46.2);

    this.timeline.addTween(cjs.Tween.get(this.cursor).wait(3));

    // btn
    this.btn = new lib.FinalBtn();
    this.btn.parent = this;
    this.btn.setTransform(0, 101.2, 1.197, 1.197);

    this.timeline.addTween(cjs.Tween.get(this.btn).wait(3));

    // congratTxt
    this.congratTxt = new cjs.Text("Congratulations!", "bold 25px 'Tahoma'", "#1C2C4C");
    this.congratTxt.name = "congratTxt";
    this.congratTxt.textAlign = "center";
    this.congratTxt.lineHeight = 32;
    this.congratTxt.lineWidth = 230;
    this.congratTxt.parent = this;
    this.congratTxt.setTransform(0, -137);

    this.timeline.addTween(cjs.Tween.get(this.congratTxt).wait(3));

    // congratLoc
    this.congratLoc = new lib.discover_textContainer_mc();
    this.congratLoc.parent = this;
    this.congratLoc.setTransform(-118.1, -146.3);
    this.congratLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.congratLoc).wait(3));

    // discoverTxt
    this.discoverTxt = new cjs.Text("Unlock more cows", "bold 30px 'Tahoma'", "#1C2B4C");
    this.discoverTxt.name = "discoverTxt";
    this.discoverTxt.textAlign = "center";
    this.discoverTxt.lineHeight = 35;
    this.discoverTxt.lineWidth = 230;
    this.discoverTxt.parent = this;
    this.discoverTxt.setTransform(0, 0.8);

    this.timeline.addTween(cjs.Tween.get(this.discoverTxt).wait(3));

    // discoverLoc
    this.discoverLoc = new lib.discover_textContainer_mc();
    this.discoverLoc.parent = this;
    this.discoverLoc.setTransform(-119.7, 2.2);
    this.discoverLoc.alpha = 0;

    this.timeline.addTween(cjs.Tween.get(this.discoverLoc).wait(3));

    // bg
    this.hit_mc = new lib.ppUpBG();
    this.hit_mc.parent = this;
    this.hit_mc.setTransform(0, 0, 1, 1, 0, 0, 0, 129.1, 143.8);

    this.timeline.addTween(cjs.Tween.get(this.hit_mc).wait(3));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-131.3, -146.3, 262.7, 354.9);


  (lib.Cow_second = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {
      "run": 1,
      "milk": 18,
      "click": 37
    });

    // timeline functions:
    this.frame_0 = function() {
      //this.hit_mc.alpha = 0.01;
      this.hitArea = this.hit_mc;
    }
    this.frame_17 = function() {
      this.gotoAndPlay("milk");
    }
    this.frame_36 = function() {
      this.gotoAndPlay("milk");
    }
    this.frame_51 = function() {
      this.gotoAndPlay("milk");
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(17).call(this.frame_17).wait(19).call(this.frame_36).wait(15).call(this.frame_51).wait(1));

    // Layer 2
    this.hit_mc = new lib.clickArea();
    this.hit_mc.parent = this;
    this.hit_mc.setTransform(3.4, 2.2);

    this.timeline.addTween(cjs.Tween.get(this.hit_mc).wait(52));

    // body
    this.shape = new cjs.Shape();
    this.shape.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjbjCIG3AAIAAGFIm3AAg");

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FF9900").s().p("AjaDDIAAmFIG1AAIAAGFg");

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FF9900").s().p("AjaDCIAAmEIG1AAIAAGEg");
    this.shape_2.setTransform(0, -0.6);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FF9900").s().p("AjaDCIAAmDIG1AAIAAGDg");
    this.shape_3.setTransform(0, -2.6);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FF9900").s().p("AjaDDIAAmEIG1AAIAAGEg");
    this.shape_4.setTransform(0, -6);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjfjCIG/AAIAAGFIm/AAg");

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FF9900").s().p("AjfDDIAAmFIG/AAIAAGFg");

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjkjCIHJAAIAAGFInJAAg");

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FF9900").s().p("AjjDDIAAmFIHHAAIAAGFg");

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjojCIHRAAIAAGFInRAAg");

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FF9900").s().p("AjoDDIAAmFIHRAAIAAGFg");

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjtjCIHbAAIAAGFInbAAg");

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FF9900").s().p("AjsDDIAAmFIHZAAIAAGFg");

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjxjCIHjAAIAAGFInjAAg");

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FF9900").s().p("AjxDDIAAmFIHjAAIAAGFg");

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f().s("#FF3300").ss(2, 1, 1).p("Aj2jCIHtAAIAAGFIntAAg");

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FF9900").s().p("Aj1DDIAAmFIHrAAIAAGFg");

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f().s("#FF3300").ss(2, 1, 1).p("Aj7jCIH3AAIAAGFIn3AAg");

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#FF9900").s().p("Aj7DDIAAmFIH2AAIAAGFg");

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f().s("#FF3300").ss(2, 1, 1).p("Aj/jCIH/AAIAAGFIn/AAg");

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#FF9900").s().p("Aj/DDIAAmFIH/AAIAAGFg");

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f().s("#FF3300").ss(2, 1, 1).p("AkEjCIIJAAIAAGFIoJAAg");

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FF9900").s().p("AkEDDIAAmFIIJAAIAAGFg");

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f().s("#FF3300").ss(2, 1, 1).p("AkIjCIIRAAIAAGFIoRAAg");

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#FF9900").s().p("AkIDDIAAmFIIRAAIAAGFg");

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f().s("#FF3300").ss(2, 1, 1).p("AkNjCIIbAAIAAGFIobAAg");

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FF9900").s().p("AkNDDIAAmFIIbAAIAAGFg");

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f().s("#FF3300").ss(2, 1, 1).p("AkRjCIIjAAIAAGFIojAAg");

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FF9900").s().p("AkRDDIAAmFIIjAAIAAGFg");

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f().s("#FF3300").ss(2, 1, 1).p("AkWjCIItAAIAAGFIotAAg");

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FF9900").s().p("AkWDDIAAmFIIsAAIAAGFg");

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f().s("#FF3300").ss(2, 1, 1).p("AkKjCIIVAAIAAGFIoVAAg");

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#FF9900").s().p("AkKDDIAAmFIIVAAIAAGFg");

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f().s("#FF3300").ss(2, 1, 1).p("Aj+jCIH9AAIAAGFIn9AAg");

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FF9900").s().p("Aj+DDIAAmFIH9AAIAAGFg");

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjyjCIHlAAIAAGFInlAAg");

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FF9900").s().p("AjyDDIAAmFIHlAAIAAGFg");

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjnjCIHPAAIAAGFInPAAg");

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FF9900").s().p("AjnDDIAAmFIHPAAIAAGFg");

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjTjJIGnAAIAAGTImnAAg");

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FF9900").s().p("AjTDKIAAmTIGnAAIAAGTg");

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjLjRIGXAAIAAGjImXAAg");

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FF9900").s().p("AjLDRIAAmhIGXAAIAAGhg");

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjEjZIGJAAIAAGzImJAAg");

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FF9900").s().p("AjEDZIAAmxIGJAAIAAGxg");

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f().s("#FF3300").ss(2, 1, 1).p("Ai8jgIF5AAIAAHBIl5AAg");

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FF9900").s().p("Ai8DhIAAnBIF5AAIAAHBg");

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f().s("#FF3300").ss(2, 1, 1).p("Ai0joIFpAAIAAHRIlpAAg");

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FF9900").s().p("Ai0DpIAAnRIFpAAIAAHRg");

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f().s("#FF3300").ss(2, 1, 1).p("AitjvIFbAAIAAHfIlbAAg");

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#FF9900").s().p("AisDwIAAnfIFZAAIAAHfg");

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f().s("#FF3300").ss(2, 1, 1).p("Ailj3IFLAAIAAHvIlLAAg");

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#FF9900").s().p("AilD4IAAnvIFLAAIAAHvg");

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f().s("#FF3300").ss(2, 1, 1).p("Aidj/IE7AAIAAH/Ik7AAg");

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FF9900").s().p("AidD/IAAn9IE7AAIAAH9g");

    this.shape_55 = new cjs.Shape();
    this.shape_55.graphics.f().s("#FF3300").ss(2, 1, 1).p("AiWkGIEtAAIAAINIktAAg");

    this.shape_56 = new cjs.Shape();
    this.shape_56.graphics.f("#FF9900").s().p("AiWEHIAAoNIEtAAIAAINg");

    this.shape_57 = new cjs.Shape();
    this.shape_57.graphics.f().s("#FF3300").ss(2, 1, 1).p("Aikj5IFJAAIAAHzIlJAAg");

    this.shape_58 = new cjs.Shape();
    this.shape_58.graphics.f("#FF9900").s().p("AijD6IAAnzIFHAAIAAHzg");

    this.shape_59 = new cjs.Shape();
    this.shape_59.graphics.f().s("#FF3300").ss(2, 1, 1).p("AixjrIFjAAIAAHXIljAAg");

    this.shape_60 = new cjs.Shape();
    this.shape_60.graphics.f("#FF9900").s().p("AixDrIAAnVIFjAAIAAHVg");

    this.shape_61 = new cjs.Shape();
    this.shape_61.graphics.f().s("#FF3300").ss(2, 1, 1).p("Ai/jdIF/AAIAAG7Il/AAg");

    this.shape_62 = new cjs.Shape();
    this.shape_62.graphics.f("#FF9900").s().p("Ai/DeIAAm7IF/AAIAAG7g");

    this.shape_63 = new cjs.Shape();
    this.shape_63.graphics.f().s("#FF3300").ss(2, 1, 1).p("AjNjPIGbAAIAAGfImbAAg");

    this.shape_64 = new cjs.Shape();
    this.shape_64.graphics.f("#FF9900").s().p("AjNDQIAAmfIGbAAIAAGfg");

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_1,
        p: {
          y: 0
        }
      }, {
        t: this.shape,
        p: {
          y: 0
        }
      }]
    }).to({
      state: [{
        t: this.shape_2,
        p: {
          y: -0.6
        }
      }, {
        t: this.shape,
        p: {
          y: -0.6
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: -1.3
        }
      }, {
        t: this.shape,
        p: {
          y: -1.3
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_2,
        p: {
          y: -2
        }
      }, {
        t: this.shape,
        p: {
          y: -2
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_3,
        p: {
          y: -2.6
        }
      }, {
        t: this.shape,
        p: {
          y: -2.6
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_2,
        p: {
          y: -3.3
        }
      }, {
        t: this.shape,
        p: {
          y: -3.3
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_3,
        p: {
          y: -4
        }
      }, {
        t: this.shape,
        p: {
          y: -4
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_3,
        p: {
          y: -4.6
        }
      }, {
        t: this.shape,
        p: {
          y: -4.6
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_3,
        p: {
          y: -5.3
        }
      }, {
        t: this.shape,
        p: {
          y: -5.3
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_4,
        p: {
          y: -6
        }
      }, {
        t: this.shape,
        p: {
          y: -6
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_2,
        p: {
          y: -5.2
        }
      }, {
        t: this.shape,
        p: {
          y: -5.2
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: -4.5
        }
      }, {
        t: this.shape,
        p: {
          y: -4.5
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_4,
        p: {
          y: -3.7
        }
      }, {
        t: this.shape,
        p: {
          y: -3.7
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_2,
        p: {
          y: -3
        }
      }, {
        t: this.shape,
        p: {
          y: -3
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: -2.2
        }
      }, {
        t: this.shape,
        p: {
          y: -2.2
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_4,
        p: {
          y: -1.5
        }
      }, {
        t: this.shape,
        p: {
          y: -1.5
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_2,
        p: {
          y: -0.7
        }
      }, {
        t: this.shape,
        p: {
          y: -0.7
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: 0
        }
      }, {
        t: this.shape,
        p: {
          y: 0
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: 0
        }
      }, {
        t: this.shape,
        p: {
          y: 0
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }, {
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }, {
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }, {
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }, {
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }, {
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }, {
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_18
      }, {
        t: this.shape_17
      }]
    }, 1).to({
      state: [{
        t: this.shape_20
      }, {
        t: this.shape_19
      }]
    }, 1).to({
      state: [{
        t: this.shape_22
      }, {
        t: this.shape_21
      }]
    }, 1).to({
      state: [{
        t: this.shape_24
      }, {
        t: this.shape_23
      }]
    }, 1).to({
      state: [{
        t: this.shape_26
      }, {
        t: this.shape_25
      }]
    }, 1).to({
      state: [{
        t: this.shape_28
      }, {
        t: this.shape_27
      }]
    }, 1).to({
      state: [{
        t: this.shape_30
      }, {
        t: this.shape_29
      }]
    }, 1).to({
      state: [{
        t: this.shape_32
      }, {
        t: this.shape_31
      }]
    }, 1).to({
      state: [{
        t: this.shape_34
      }, {
        t: this.shape_33
      }]
    }, 1).to({
      state: [{
        t: this.shape_36
      }, {
        t: this.shape_35
      }]
    }, 1).to({
      state: [{
        t: this.shape_38
      }, {
        t: this.shape_37
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: 0
        }
      }, {
        t: this.shape,
        p: {
          y: 0
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: 0
        }
      }, {
        t: this.shape,
        p: {
          y: 0
        }
      }]
    }, 1).to({
      state: [{
        t: this.shape_40
      }, {
        t: this.shape_39
      }]
    }, 1).to({
      state: [{
        t: this.shape_42
      }, {
        t: this.shape_41
      }]
    }, 1).to({
      state: [{
        t: this.shape_44
      }, {
        t: this.shape_43
      }]
    }, 1).to({
      state: [{
        t: this.shape_46
      }, {
        t: this.shape_45
      }]
    }, 1).to({
      state: [{
        t: this.shape_48
      }, {
        t: this.shape_47
      }]
    }, 1).to({
      state: [{
        t: this.shape_50
      }, {
        t: this.shape_49
      }]
    }, 1).to({
      state: [{
        t: this.shape_52
      }, {
        t: this.shape_51
      }]
    }, 1).to({
      state: [{
        t: this.shape_54
      }, {
        t: this.shape_53
      }]
    }, 1).to({
      state: [{
        t: this.shape_56
      }, {
        t: this.shape_55
      }]
    }, 1).to({
      state: [{
        t: this.shape_58
      }, {
        t: this.shape_57
      }]
    }, 1).to({
      state: [{
        t: this.shape_60
      }, {
        t: this.shape_59
      }]
    }, 1).to({
      state: [{
        t: this.shape_62
      }, {
        t: this.shape_61
      }]
    }, 1).to({
      state: [{
        t: this.shape_64
      }, {
        t: this.shape_63
      }]
    }, 1).to({
      state: [{
        t: this.shape_1,
        p: {
          y: 0
        }
      }, {
        t: this.shape,
        p: {
          y: 0
        }
      }]
    }, 1).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-23, -20.5, 84.1, 68.6);


  (lib.MilkCollector = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      //this.stop();

      this.body.snapToPixel = true;
      this.body.cache(-50, -90, 100, 179, 4);

      this.crane.body.snapToPixel = true;
      this.crane.body.cache(-20, -27, 40, 54, 4);
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(101));

    // crane
    this.crane = new lib.collectorCrane();
    this.crane.parent = this;
    this.crane.setTransform(110.8, 65.5);

    this.timeline.addTween(cjs.Tween.get(this.crane).wait(101));

    // body
    this.body = new lib.collectorBody();
    this.body.parent = this;
    this.body.setTransform(50, 88.9, 1, 1, 0, 0, 0, 0.6, -0.2);

    this.timeline.addTween(cjs.Tween.get(this.body).wait(101));

    // milk
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#FFFFFF").s().p("Al5ATIAAglILzAAIAAAlg");
    this.shape.setTransform(48.1, 146.8);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FFFFFF").s().p("Al5AWIAAgrILzAAIAAArg");
    this.shape_1.setTransform(48.1, 146.4);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#FFFFFF").s().p("Al5AZIAAgyILzAAIAAAyg");
    this.shape_2.setTransform(48.1, 146.1);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#FFFFFF").s().p("Al5AdIAAg5ILzAAIAAA5g");
    this.shape_3.setTransform(48.1, 145.8);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#FFFFFF").s().p("Al5AgIAAg/ILzAAIAAA/g");
    this.shape_4.setTransform(48.1, 145.4);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#FFFFFF").s().p("Al5AkIAAhHILzAAIAABHg");
    this.shape_5.setTransform(48.1, 145.1);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#FFFFFF").s().p("Al5AnIAAhNILzAAIAABNg");
    this.shape_6.setTransform(48.1, 144.7);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#FFFFFF").s().p("Al5AqIAAhTILzAAIAABTg");
    this.shape_7.setTransform(48.1, 144.4);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#FFFFFF").s().p("Al5AuIAAhbILzAAIAABbg");
    this.shape_8.setTransform(48.1, 144.1);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#FFFFFF").s().p("Al5AxIAAhhILzAAIAABhg");
    this.shape_9.setTransform(48.1, 143.7);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#FFFFFF").s().p("Al5A1IAAhpILzAAIAABpg");
    this.shape_10.setTransform(48.1, 143.4);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#FFFFFF").s().p("Al5A4IAAhvILzAAIAABvg");
    this.shape_11.setTransform(48.1, 143);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#FFFFFF").s().p("Al5A7IAAh1ILzAAIAAB1g");
    this.shape_12.setTransform(48.1, 142.7);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FFFFFF").s().p("Al5A/IAAh9ILzAAIAAB9g");
    this.shape_13.setTransform(48.1, 142.4);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#FFFFFF").s().p("Al5BCIAAiDILzAAIAACDg");
    this.shape_14.setTransform(48.1, 142);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#FFFFFF").s().p("Al5BGIAAiLILzAAIAACLg");
    this.shape_15.setTransform(48.1, 141.7);

    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#FFFFFF").s().p("Al5BJIAAiRILzAAIAACRg");
    this.shape_16.setTransform(48.1, 141.3);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#FFFFFF").s().p("Al5BMIAAiYILzAAIAACYg");
    this.shape_17.setTransform(48.1, 141);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#FFFFFF").s().p("Al5BQIAAifILzAAIAACfg");
    this.shape_18.setTransform(48.1, 140.7);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#FFFFFF").s().p("Al5BTIAAilILzAAIAAClg");
    this.shape_19.setTransform(48.1, 140.3);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#FFFFFF").s().p("Al5BXIAAitILzAAIAACtg");
    this.shape_20.setTransform(48.1, 140);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#FFFFFF").s().p("Al5BaIAAizILzAAIAACzg");
    this.shape_21.setTransform(48.1, 139.6);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#FFFFFF").s().p("Al5BdIAAi6ILzAAIAAC6g");
    this.shape_22.setTransform(48.1, 139.3);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#FFFFFF").s().p("Al5BhIAAjBILzAAIAADBg");
    this.shape_23.setTransform(48.1, 139);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#FFFFFF").s().p("Al5BkIAAjHILzAAIAADHg");
    this.shape_24.setTransform(48.1, 138.6);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#FFFFFF").s().p("Al5BoIAAjPILzAAIAADPg");
    this.shape_25.setTransform(48.1, 138.3);

    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#FFFFFF").s().p("Al5BrIAAjVILzAAIAADVg");
    this.shape_26.setTransform(48.1, 137.9);

    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#FFFFFF").s().p("Al5BuIAAjbILzAAIAADbg");
    this.shape_27.setTransform(48.1, 137.6);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#FFFFFF").s().p("Al5ByIAAjjILzAAIAADjg");
    this.shape_28.setTransform(48.1, 137.3);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#FFFFFF").s().p("Al5B1IAAjpILzAAIAADpg");
    this.shape_29.setTransform(48.1, 136.9);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#FFFFFF").s().p("Al5B5IAAjxILzAAIAADxg");
    this.shape_30.setTransform(48.1, 136.6);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#FFFFFF").s().p("Al5B8IAAj3ILzAAIAAD3g");
    this.shape_31.setTransform(48.1, 136.2);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#FFFFFF").s().p("Al5B/IAAj9ILzAAIAAD9g");
    this.shape_32.setTransform(48.1, 135.9);

    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#FFFFFF").s().p("Al5CDIAAkFILzAAIAAEFg");
    this.shape_33.setTransform(48.1, 135.6);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FFFFFF").s().p("Al5CGIAAkLILzAAIAAELg");
    this.shape_34.setTransform(48.1, 135.2);

    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#FFFFFF").s().p("Al5CKIAAkTILzAAIAAETg");
    this.shape_35.setTransform(48.1, 134.9);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#FFFFFF").s().p("Al5CNIAAkZILzAAIAAEZg");
    this.shape_36.setTransform(48.1, 134.5);

    this.shape_37 = new cjs.Shape();
    this.shape_37.graphics.f("#FFFFFF").s().p("Al5CQIAAkgILzAAIAAEgg");
    this.shape_37.setTransform(48.1, 134.2);

    this.shape_38 = new cjs.Shape();
    this.shape_38.graphics.f("#FFFFFF").s().p("Al5CUIAAknILzAAIAAEng");
    this.shape_38.setTransform(48.1, 133.9);

    this.shape_39 = new cjs.Shape();
    this.shape_39.graphics.f("#FFFFFF").s().p("Al5CXIAAktILzAAIAAEtg");
    this.shape_39.setTransform(48.1, 133.5);

    this.shape_40 = new cjs.Shape();
    this.shape_40.graphics.f("#FFFFFF").s().p("Al5CbIAAk1ILzAAIAAE1g");
    this.shape_40.setTransform(48.1, 133.2);

    this.shape_41 = new cjs.Shape();
    this.shape_41.graphics.f("#FFFFFF").s().p("Al5CeIAAk7ILzAAIAAE7g");
    this.shape_41.setTransform(48.1, 132.8);

    this.shape_42 = new cjs.Shape();
    this.shape_42.graphics.f("#FFFFFF").s().p("Al5ChIAAlCILzAAIAAFCg");
    this.shape_42.setTransform(48.1, 132.5);

    this.shape_43 = new cjs.Shape();
    this.shape_43.graphics.f("#FFFFFF").s().p("Al5ClIAAlJILzAAIAAFJg");
    this.shape_43.setTransform(48.1, 132.2);

    this.shape_44 = new cjs.Shape();
    this.shape_44.graphics.f("#FFFFFF").s().p("Al5CoIAAlPILzAAIAAFPg");
    this.shape_44.setTransform(48.1, 131.8);

    this.shape_45 = new cjs.Shape();
    this.shape_45.graphics.f("#FFFFFF").s().p("Al5CsIAAlXILzAAIAAFXg");
    this.shape_45.setTransform(48.1, 131.5);

    this.shape_46 = new cjs.Shape();
    this.shape_46.graphics.f("#FFFFFF").s().p("Al5CvIAAldILzAAIAAFdg");
    this.shape_46.setTransform(48.1, 131.1);

    this.shape_47 = new cjs.Shape();
    this.shape_47.graphics.f("#FFFFFF").s().p("Al5CyIAAlkILzAAIAAFkg");
    this.shape_47.setTransform(48.1, 130.8);

    this.shape_48 = new cjs.Shape();
    this.shape_48.graphics.f("#FFFFFF").s().p("Al5C2IAAlrILzAAIAAFrg");
    this.shape_48.setTransform(48.1, 130.5);

    this.shape_49 = new cjs.Shape();
    this.shape_49.graphics.f("#FFFFFF").s().p("Al5C5IAAlxILzAAIAAFxg");
    this.shape_49.setTransform(48.1, 130.1);

    this.shape_50 = new cjs.Shape();
    this.shape_50.graphics.f("#FFFFFF").s().p("Al5C9IAAl5ILzAAIAAF5g");
    this.shape_50.setTransform(48.1, 129.8);

    this.shape_51 = new cjs.Shape();
    this.shape_51.graphics.f("#FFFFFF").s().p("Al5DAIAAl/ILzAAIAAF/g");
    this.shape_51.setTransform(48.1, 129.4);

    this.shape_52 = new cjs.Shape();
    this.shape_52.graphics.f("#FFFFFF").s().p("Al5DDIAAmFILzAAIAAGFg");
    this.shape_52.setTransform(48.1, 129.1);

    this.shape_53 = new cjs.Shape();
    this.shape_53.graphics.f("#FFFFFF").s().p("Al5DHIAAmNILzAAIAAGNg");
    this.shape_53.setTransform(48.1, 128.7);

    this.shape_54 = new cjs.Shape();
    this.shape_54.graphics.f("#FFFFFF").s().p("Al5DKIAAmTILzAAIAAGTg");
    this.shape_54.setTransform(48.1, 128.4);

    this.shape_55 = new cjs.Shape();
    this.shape_55.graphics.f("#FFFFFF").s().p("Al5DOIAAmaILzAAIAAGag");
    this.shape_55.setTransform(48.1, 128.1);

    this.shape_56 = new cjs.Shape();
    this.shape_56.graphics.f("#FFFFFF").s().p("Al5DRIAAmhILzAAIAAGhg");
    this.shape_56.setTransform(48.1, 127.7);

    this.shape_57 = new cjs.Shape();
    this.shape_57.graphics.f("#FFFFFF").s().p("Al5DUIAAmnILzAAIAAGng");
    this.shape_57.setTransform(48.1, 127.4);

    this.shape_58 = new cjs.Shape();
    this.shape_58.graphics.f("#FFFFFF").s().p("Al5DYIAAmvILzAAIAAGvg");
    this.shape_58.setTransform(48.1, 127);

    this.shape_59 = new cjs.Shape();
    this.shape_59.graphics.f("#FFFFFF").s().p("Al5DbIAAm1ILzAAIAAG1g");
    this.shape_59.setTransform(48.1, 126.7);

    this.shape_60 = new cjs.Shape();
    this.shape_60.graphics.f("#FFFFFF").s().p("Al5DfIAAm9ILzAAIAAG9g");
    this.shape_60.setTransform(48.1, 126.4);

    this.shape_61 = new cjs.Shape();
    this.shape_61.graphics.f("#FFFFFF").s().p("Al5DiIAAnDILzAAIAAHDg");
    this.shape_61.setTransform(48.1, 126);

    this.shape_62 = new cjs.Shape();
    this.shape_62.graphics.f("#FFFFFF").s().p("Al5DlIAAnJILzAAIAAHJg");
    this.shape_62.setTransform(48.1, 125.7);

    this.shape_63 = new cjs.Shape();
    this.shape_63.graphics.f("#FFFFFF").s().p("Al5DpIAAnRILzAAIAAHRg");
    this.shape_63.setTransform(48.1, 125.3);

    this.shape_64 = new cjs.Shape();
    this.shape_64.graphics.f("#FFFFFF").s().p("Al5DsIAAnXILzAAIAAHXg");
    this.shape_64.setTransform(48.1, 125);

    this.shape_65 = new cjs.Shape();
    this.shape_65.graphics.f("#FFFFFF").s().p("Al5DwIAAnfILzAAIAAHfg");
    this.shape_65.setTransform(48.1, 124.7);

    this.shape_66 = new cjs.Shape();
    this.shape_66.graphics.f("#FFFFFF").s().p("Al5DzIAAnlILzAAIAAHlg");
    this.shape_66.setTransform(48.1, 124.3);

    this.shape_67 = new cjs.Shape();
    this.shape_67.graphics.f("#FFFFFF").s().p("Al5D2IAAnrILzAAIAAHrg");
    this.shape_67.setTransform(48.1, 124);

    this.shape_68 = new cjs.Shape();
    this.shape_68.graphics.f("#FFFFFF").s().p("Al5D6IAAnzILzAAIAAHzg");
    this.shape_68.setTransform(48.1, 123.6);

    this.shape_69 = new cjs.Shape();
    this.shape_69.graphics.f("#FFFFFF").s().p("Al5D9IAAn5ILzAAIAAH5g");
    this.shape_69.setTransform(48.1, 123.3);

    this.shape_70 = new cjs.Shape();
    this.shape_70.graphics.f("#FFFFFF").s().p("Al5EBIAAoAILzAAIAAIAg");
    this.shape_70.setTransform(48.1, 123);

    this.shape_71 = new cjs.Shape();
    this.shape_71.graphics.f("#FFFFFF").s().p("Al5EEIAAoHILzAAIAAIHg");
    this.shape_71.setTransform(48.1, 122.6);

    this.shape_72 = new cjs.Shape();
    this.shape_72.graphics.f("#FFFFFF").s().p("Al5EHIAAoNILzAAIAAINg");
    this.shape_72.setTransform(48.1, 122.3);

    this.shape_73 = new cjs.Shape();
    this.shape_73.graphics.f("#FFFFFF").s().p("Al5ELIAAoVILzAAIAAIVg");
    this.shape_73.setTransform(48.1, 121.9);

    this.shape_74 = new cjs.Shape();
    this.shape_74.graphics.f("#FFFFFF").s().p("Al5EOIAAobILzAAIAAIbg");
    this.shape_74.setTransform(48.1, 121.6);

    this.shape_75 = new cjs.Shape();
    this.shape_75.graphics.f("#FFFFFF").s().p("Al5ESIAAoiILzAAIAAIig");
    this.shape_75.setTransform(48.1, 121.3);

    this.shape_76 = new cjs.Shape();
    this.shape_76.graphics.f("#FFFFFF").s().p("Al5EVIAAopILzAAIAAIpg");
    this.shape_76.setTransform(48.1, 120.9);

    this.shape_77 = new cjs.Shape();
    this.shape_77.graphics.f("#FFFFFF").s().p("Al5EYIAAovILzAAIAAIvg");
    this.shape_77.setTransform(48.1, 120.6);

    this.shape_78 = new cjs.Shape();
    this.shape_78.graphics.f("#FFFFFF").s().p("Al5EcIAAo3ILzAAIAAI3g");
    this.shape_78.setTransform(48.1, 120.2);

    this.shape_79 = new cjs.Shape();
    this.shape_79.graphics.f("#FFFFFF").s().p("Al5EfIAAo9ILzAAIAAI9g");
    this.shape_79.setTransform(48.1, 119.9);

    this.shape_80 = new cjs.Shape();
    this.shape_80.graphics.f("#FFFFFF").s().p("Al5EjIAApFILzAAIAAJFg");
    this.shape_80.setTransform(48.1, 119.6);

    this.shape_81 = new cjs.Shape();
    this.shape_81.graphics.f("#FFFFFF").s().p("Al5EmIAApLILzAAIAAJLg");
    this.shape_81.setTransform(48.1, 119.2);

    this.shape_82 = new cjs.Shape();
    this.shape_82.graphics.f("#FFFFFF").s().p("Al5EpIAApRILzAAIAAJRg");
    this.shape_82.setTransform(48.1, 118.9);

    this.shape_83 = new cjs.Shape();
    this.shape_83.graphics.f("#FFFFFF").s().p("Al5EtIAApZILzAAIAAJZg");
    this.shape_83.setTransform(48.1, 118.5);

    this.shape_84 = new cjs.Shape();
    this.shape_84.graphics.f("#FFFFFF").s().p("Al5EwIAApfILzAAIAAJfg");
    this.shape_84.setTransform(48.1, 118.2);

    this.shape_85 = new cjs.Shape();
    this.shape_85.graphics.f("#FFFFFF").s().p("Al5E0IAApnILzAAIAAJng");
    this.shape_85.setTransform(48.1, 117.9);

    this.shape_86 = new cjs.Shape();
    this.shape_86.graphics.f("#FFFFFF").s().p("Al5E3IAAptILzAAIAAJtg");
    this.shape_86.setTransform(48.1, 117.5);

    this.shape_87 = new cjs.Shape();
    this.shape_87.graphics.f("#FFFFFF").s().p("Al5E6IAApzILzAAIAAJzg");
    this.shape_87.setTransform(48.1, 117.2);

    this.shape_88 = new cjs.Shape();
    this.shape_88.graphics.f("#FFFFFF").s().p("Al5E+IAAp7ILzAAIAAJ7g");
    this.shape_88.setTransform(48.1, 116.8);

    this.shape_89 = new cjs.Shape();
    this.shape_89.graphics.f("#FFFFFF").s().p("Al5FBIAAqBILzAAIAAKBg");
    this.shape_89.setTransform(48.1, 116.5);

    this.shape_90 = new cjs.Shape();
    this.shape_90.graphics.f("#FFFFFF").s().p("Al5FFIAAqJILzAAIAAKJg");
    this.shape_90.setTransform(48.1, 116.2);

    this.shape_91 = new cjs.Shape();
    this.shape_91.graphics.f("#FFFFFF").s().p("Al5FIIAAqPILzAAIAAKPg");
    this.shape_91.setTransform(48.1, 115.8);

    this.shape_92 = new cjs.Shape();
    this.shape_92.graphics.f("#FFFFFF").s().p("Al5FLIAAqVILzAAIAAKVg");
    this.shape_92.setTransform(48.1, 115.5);

    this.shape_93 = new cjs.Shape();
    this.shape_93.graphics.f("#FFFFFF").s().p("Al5FPIAAqdILzAAIAAKdg");
    this.shape_93.setTransform(48.1, 115.1);

    this.shape_94 = new cjs.Shape();
    this.shape_94.graphics.f("#FFFFFF").s().p("Al5FSIAAqjILzAAIAAKjg");
    this.shape_94.setTransform(48.1, 114.8);

    this.shape_95 = new cjs.Shape();
    this.shape_95.graphics.f("#FFFFFF").s().p("Al5FWIAAqqILzAAIAAKqg");
    this.shape_95.setTransform(48.1, 114.5);

    this.shape_96 = new cjs.Shape();
    this.shape_96.graphics.f("#FFFFFF").s().p("Al5FZIAAqxILzAAIAAKxg");
    this.shape_96.setTransform(48.1, 114.1);

    this.shape_97 = new cjs.Shape();
    this.shape_97.graphics.f("#FFFFFF").s().p("Al5FcIAAq3ILzAAIAAK3g");
    this.shape_97.setTransform(48.1, 113.8);

    this.shape_98 = new cjs.Shape();
    this.shape_98.graphics.f("#FFFFFF").s().p("Al5FgIAAq/ILzAAIAAK/g");
    this.shape_98.setTransform(48.1, 113.4);

    this.shape_99 = new cjs.Shape();
    this.shape_99.graphics.f("#FFFFFF").s().p("Al5FjIAArFILzAAIAALFg");
    this.shape_99.setTransform(48.1, 113.1);

    this.shape_100 = new cjs.Shape();
    this.shape_100.graphics.f("#FFFFFF").s().p("Al5FnIAArMILzAAIAALMg");
    this.shape_100.setTransform(48.1, 112.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape
      }]
    }).to({
      state: [{
        t: this.shape_1
      }]
    }, 1).to({
      state: [{
        t: this.shape_2
      }]
    }, 1).to({
      state: [{
        t: this.shape_3
      }]
    }, 1).to({
      state: [{
        t: this.shape_4
      }]
    }, 1).to({
      state: [{
        t: this.shape_5
      }]
    }, 1).to({
      state: [{
        t: this.shape_6
      }]
    }, 1).to({
      state: [{
        t: this.shape_7
      }]
    }, 1).to({
      state: [{
        t: this.shape_8
      }]
    }, 1).to({
      state: [{
        t: this.shape_9
      }]
    }, 1).to({
      state: [{
        t: this.shape_10
      }]
    }, 1).to({
      state: [{
        t: this.shape_11
      }]
    }, 1).to({
      state: [{
        t: this.shape_12
      }]
    }, 1).to({
      state: [{
        t: this.shape_13
      }]
    }, 1).to({
      state: [{
        t: this.shape_14
      }]
    }, 1).to({
      state: [{
        t: this.shape_15
      }]
    }, 1).to({
      state: [{
        t: this.shape_16
      }]
    }, 1).to({
      state: [{
        t: this.shape_17
      }]
    }, 1).to({
      state: [{
        t: this.shape_18
      }]
    }, 1).to({
      state: [{
        t: this.shape_19
      }]
    }, 1).to({
      state: [{
        t: this.shape_20
      }]
    }, 1).to({
      state: [{
        t: this.shape_21
      }]
    }, 1).to({
      state: [{
        t: this.shape_22
      }]
    }, 1).to({
      state: [{
        t: this.shape_23
      }]
    }, 1).to({
      state: [{
        t: this.shape_24
      }]
    }, 1).to({
      state: [{
        t: this.shape_25
      }]
    }, 1).to({
      state: [{
        t: this.shape_26
      }]
    }, 1).to({
      state: [{
        t: this.shape_27
      }]
    }, 1).to({
      state: [{
        t: this.shape_28
      }]
    }, 1).to({
      state: [{
        t: this.shape_29
      }]
    }, 1).to({
      state: [{
        t: this.shape_30
      }]
    }, 1).to({
      state: [{
        t: this.shape_31
      }]
    }, 1).to({
      state: [{
        t: this.shape_32
      }]
    }, 1).to({
      state: [{
        t: this.shape_33
      }]
    }, 1).to({
      state: [{
        t: this.shape_34
      }]
    }, 1).to({
      state: [{
        t: this.shape_35
      }]
    }, 1).to({
      state: [{
        t: this.shape_36
      }]
    }, 1).to({
      state: [{
        t: this.shape_37
      }]
    }, 1).to({
      state: [{
        t: this.shape_38
      }]
    }, 1).to({
      state: [{
        t: this.shape_39
      }]
    }, 1).to({
      state: [{
        t: this.shape_40
      }]
    }, 1).to({
      state: [{
        t: this.shape_41
      }]
    }, 1).to({
      state: [{
        t: this.shape_42
      }]
    }, 1).to({
      state: [{
        t: this.shape_43
      }]
    }, 1).to({
      state: [{
        t: this.shape_44
      }]
    }, 1).to({
      state: [{
        t: this.shape_45
      }]
    }, 1).to({
      state: [{
        t: this.shape_46
      }]
    }, 1).to({
      state: [{
        t: this.shape_47
      }]
    }, 1).to({
      state: [{
        t: this.shape_48
      }]
    }, 1).to({
      state: [{
        t: this.shape_49
      }]
    }, 1).to({
      state: [{
        t: this.shape_50
      }]
    }, 1).to({
      state: [{
        t: this.shape_51
      }]
    }, 1).to({
      state: [{
        t: this.shape_52
      }]
    }, 1).to({
      state: [{
        t: this.shape_53
      }]
    }, 1).to({
      state: [{
        t: this.shape_54
      }]
    }, 1).to({
      state: [{
        t: this.shape_55
      }]
    }, 1).to({
      state: [{
        t: this.shape_56
      }]
    }, 1).to({
      state: [{
        t: this.shape_57
      }]
    }, 1).to({
      state: [{
        t: this.shape_58
      }]
    }, 1).to({
      state: [{
        t: this.shape_59
      }]
    }, 1).to({
      state: [{
        t: this.shape_60
      }]
    }, 1).to({
      state: [{
        t: this.shape_61
      }]
    }, 1).to({
      state: [{
        t: this.shape_62
      }]
    }, 1).to({
      state: [{
        t: this.shape_63
      }]
    }, 1).to({
      state: [{
        t: this.shape_64
      }]
    }, 1).to({
      state: [{
        t: this.shape_65
      }]
    }, 1).to({
      state: [{
        t: this.shape_66
      }]
    }, 1).to({
      state: [{
        t: this.shape_67
      }]
    }, 1).to({
      state: [{
        t: this.shape_68
      }]
    }, 1).to({
      state: [{
        t: this.shape_69
      }]
    }, 1).to({
      state: [{
        t: this.shape_70
      }]
    }, 1).to({
      state: [{
        t: this.shape_71
      }]
    }, 1).to({
      state: [{
        t: this.shape_72
      }]
    }, 1).to({
      state: [{
        t: this.shape_73
      }]
    }, 1).to({
      state: [{
        t: this.shape_74
      }]
    }, 1).to({
      state: [{
        t: this.shape_75
      }]
    }, 1).to({
      state: [{
        t: this.shape_76
      }]
    }, 1).to({
      state: [{
        t: this.shape_77
      }]
    }, 1).to({
      state: [{
        t: this.shape_78
      }]
    }, 1).to({
      state: [{
        t: this.shape_79
      }]
    }, 1).to({
      state: [{
        t: this.shape_80
      }]
    }, 1).to({
      state: [{
        t: this.shape_81
      }]
    }, 1).to({
      state: [{
        t: this.shape_82
      }]
    }, 1).to({
      state: [{
        t: this.shape_83
      }]
    }, 1).to({
      state: [{
        t: this.shape_84
      }]
    }, 1).to({
      state: [{
        t: this.shape_85
      }]
    }, 1).to({
      state: [{
        t: this.shape_86
      }]
    }, 1).to({
      state: [{
        t: this.shape_87
      }]
    }, 1).to({
      state: [{
        t: this.shape_88
      }]
    }, 1).to({
      state: [{
        t: this.shape_89
      }]
    }, 1).to({
      state: [{
        t: this.shape_90
      }]
    }, 1).to({
      state: [{
        t: this.shape_91
      }]
    }, 1).to({
      state: [{
        t: this.shape_92
      }]
    }, 1).to({
      state: [{
        t: this.shape_93
      }]
    }, 1).to({
      state: [{
        t: this.shape_94
      }]
    }, 1).to({
      state: [{
        t: this.shape_95
      }]
    }, 1).to({
      state: [{
        t: this.shape_96
      }]
    }, 1).to({
      state: [{
        t: this.shape_97
      }]
    }, 1).to({
      state: [{
        t: this.shape_98
      }]
    }, 1).to({
      state: [{
        t: this.shape_99
      }]
    }, 1).to({
      state: [{
        t: this.shape_100
      }]
    }, 1).wait(1));

    // Layer 3
    this.shape_101 = new cjs.Shape();
    this.shape_101.graphics.f().s("#253453").ss(2, 1, 1).p("AAqgtIAAgiQAAgHgFgFQgFgFgHAAIgyAAQgGAAgFAFQgFAFAAAHIAAAiIAAAJIBTAAgABxBhQACgBACgCQADgDAAgEIAAiAIgBAAIAAgEIhNAAAgpgtIhNAAIAAAEIgBAAIAACAQAAAEAEADQABACADAA");
    this.shape_101.setTransform(49.2, 144);

    this.shape_102 = new cjs.Shape();
    this.shape_102.graphics.f("#ABABAB").s().p("AgpAdIAAgIIAAggQAAgHAFgFQAFgFAHAAIAxAAQAHAAAFAFQAFAFAAAHIAAAgIAAAIg");
    this.shape_102.setTransform(49.1, 137.3);

    this.shape_103 = new cjs.Shape();
    this.shape_103.graphics.f("#D6D6D6").s().p("AhkBJQgHAAgEgEIgCgBQgFgGAAgHIAAh7IAAgEIBMAAIAAAIIBUAAIAAgIIBNAAIAAAEIAAB7QAAAHgFAGIgBABQgGAEgHAAg");
    this.shape_103.setTransform(49.2, 146.8);

    this.timeline.addTween(cjs.Tween.get({}).to({
      state: [{
        t: this.shape_103
      }, {
        t: this.shape_102
      }, {
        t: this.shape_101
      }]
    }).wait(101));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1, -1.4, 131.3, 180.5);


  (lib.main_mc = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      this.stop();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // popupContainer
    this.popupContainer = new lib.popUp_Locators_mc();
    this.popupContainer.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.popupContainer).wait(1));

    // topRight BTN
    this.topRightBTN = new lib.bankBar_mc();
    this.topRightBTN.parent = this;
    this.topRightBTN.setTransform(240, -240);

    this.timeline.addTween(cjs.Tween.get(this.topRightBTN).wait(1));

    // topMid
    this.topMid = new lib.topMid_mc();
    this.topMid.parent = this;
    this.topMid.setTransform(0, -240);

    this.timeline.addTween(cjs.Tween.get(this.topMid).wait(1));

    // bottomLeft
    this.bottomLeft = new lib.bottomLeft_mc();
    this.bottomLeft.parent = this;
    this.bottomLeft.setTransform(-240, 240);

    this.timeline.addTween(cjs.Tween.get(this.bottomLeft).wait(1));

    // topLeft2
    this.topLeft2 = new lib.topLeft_mc();
    this.topLeft2.parent = this;
    this.topLeft2.setTransform(-240, -240);

    this.timeline.addTween(cjs.Tween.get(this.topLeft2).wait(1));

    // topRight
    this.topRight = new lib.bankBar_mc();
    this.topRight.parent = this;
    this.topRight.setTransform(240, -240);

    this.timeline.addTween(cjs.Tween.get(this.topRight).wait(1));

    // topBG
    this.topBG = new lib.topLeft_mc();
    this.topBG.parent = this;
    this.topBG.setTransform(-240, -240);

    this.timeline.addTween(cjs.Tween.get(this.topBG).wait(1));

    // bottomRight
    this.bottomRight = new lib.downRight_mc();
    this.bottomRight.parent = this;
    this.bottomRight.setTransform(240, 240);

    this.timeline.addTween(cjs.Tween.get(this.bottomRight).wait(1));

    // bottomMid
    this.bottomMid = new lib.bottomMid_mc();
    this.bottomMid.parent = this;
    this.bottomMid.setTransform(0, 240);

    this.timeline.addTween(cjs.Tween.get(this.bottomMid).wait(1));

    // topLeft
    this.topLeft = new lib.topLeft_mc();
    this.topLeft.parent = this;
    this.topLeft.setTransform(-240, -240);

    this.timeline.addTween(cjs.Tween.get(this.topLeft).wait(1));

    // midRight
    this.midRight = new lib.midRight_mc();
    this.midRight.parent = this;
    this.midRight.setTransform(240, 0);

    this.timeline.addTween(cjs.Tween.get(this.midRight).wait(1));

    // midLeft
    this.midLeft = new lib.midLeft_mc();
    this.midLeft.parent = this;
    this.midLeft.setTransform(-240, 0);

    this.timeline.addTween(cjs.Tween.get(this.midLeft).wait(1));

    // gameElements
    this.gameElements = new lib.gameElementsLocators_mc();
    this.gameElements.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.gameElements).wait(1));

    // bg
    this.bg = new lib.Background2();
    this.bg.parent = this;

    this.timeline.addTween(cjs.Tween.get(this.bg).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-2000.5, -350, 2370.5, 601.9);


  // stage content:
  (lib.GameEngine = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {});

    // timeline functions:
    this.frame_0 = function() {
      // TEST SECTION
      var test = false; // switch on/off test mode
      //var test = true; 				// switch on/off test mode

      var frequency = 30;
      stage.enableMouseOver(frequency);
      var th = this.main;
      th.x = th.y = 0;
      var thh = this;
      var background = th.bg;

      //layout
      var topLeft = th.topLeft;
      var topLeft2 = th.topLeft2;
      var topBG = th.topBG;
      var topMid = th.topMid;
      var topRight = th.topRight;
      var topRightBTN = th.topRightBTN;
      var bottomLeft = th.bottomLeft;
      var bottomRight = th.bottomRight;
      var bottomMid = th.bottomMid;
      var midLeft = th.midLeft;
      var midRight = th.midRight;
      var popupContainer = th.popupContainer;



      var layout = [
        topLeft,
        topLeft2,
        topBG,
        topMid,
        topRightBTN,
        topRight,
        bottomLeft,
        bottomMid,
        bottomRight,
        midLeft,
        midRight,
        popupContainer
      ]

      // POP UP Variables
      var popUp, popUpText;
      var blackSq; // pop up shading
      var speed = 500;

      ///////////================
      var c = createjs,
        w = stage.canvas.width,
        h = stage.canvas.height;
      c.MotionGuidePlugin.install();
      var mainTicker;
      var cursor, cursorCar, topBGBlock;
      var shapeGrad = new createjs.Shape();
      shapeGrad.used = false;
      var topLeftRect;
      var topLeftOffsetY = 0;
      var tapText, tapTextStroke;
      var tapTile;
      // Floors
      var numFloors = 5;
      var floorPos = [
        topLeft.levelLoc1,
        topLeft.levelLoc2,
        topLeft.levelLoc3,
      ]
      var floorsArray = [];
      var firstTap = false;
      var firstMoney = false;
      var oneTimeFlag = false;
      var levelAccel = 1; // acceleration depends on level
      var showUnlockFlag = false;
      var shading; // shading for tutorial
      var tapCounter = 0;



      // REsponsive variables
      var widthReal, heightReal;

      var widthSrc = 320;
      var heightSrc = 480;
      var gameOrient;
      var scaleFactor = 1;
      var multypl = 1.75 // multiplier for Horizontal orient
      var widthInWidth = lib.properties.width;
      var heightInHeight = lib.properties.width;

      var FPS = 60;

      var thDrag = false; // check if scene draggable
      var dragOffset = new c.Point(); // check offset point between scene and cursor



      /// SCALES
      var topBGScale = 0.6;
      var topLeftScale = 0.6;




      //// DEFINE STRUCTURES
      var milkCollector, shop, car;
      var separator;
      var liftContainer;
      var lift;
      /*
      var milkStationsArr = [
      	thh.milkSt_1,
      	thh.milkSt_2,
      	thh.milkSt_3,
      ]
      */
      var milkStationsArr = [];

      var milkStationsBusyArr = [
        false,
        false,
        false
      ]

      // Bank
      var bankBar;
      var coinsCurrent,
        LEVELLIM = 1000,
        currentLevel = 1,
        coinsNum = 200,
        bankTimer;
      milkPrice = 200;
      var milkPriceTxt;
      // Cow
      var milkCapacity = 2 * FPS;
      var cowArr = [];
      var levelCowNum = 1;
      var cowCounter = 0;


      //////
      var tutorFlag = true;
      var tutorFlag2 = true;
      var firstTimeProfit = true;



      var carArr = [];

      var bgType, btnType;
      var cowType = "first";
      var currentVar;


      /* //////////////////////////////////////////////////
      	Marketing settings
      */ //////////////////////////////////////////////////

      // установка цвета кнопки для InstallButton
      function btnColorSwitcher(obj, color) {
        switch (color) {
          case "green":
            obj.greenBtn.alpha = 1;
            break;
          case "red":
            obj.redBtn.alpha = 1;
            break;
          case "orange":
            obj.orangeBtn.alpha = 1;
            break;
          case "blue":
            obj.blueBtn.alpha = 1;
            break;
          case "lilac":
            obj.lilacBtn.alpha = 1;
            break;
          case "violet":
            obj.violetBtn.alpha = 1;
            break;
          default:
            obj.greenBtn.alpha = 1;
            break;
        }
      }

      function SetOptions() {
        var colorBG;
        switch (bgTypeOpt) {
          case "varA":
            colorBG = "#3E8AD6";
            break;
          case "varB":
            colorBG = "#A82021";
            break;
          case "varC":
            colorBG = "#252525";
            break;
          default:
            colorBG = "#3E8AD6";
            break;
        }

        currentVar = {
          bgColor: colorBG,
          background: bgTypeOpt,
          cowUnlock: cowUnlock,
          installBtnPos: installBannerPosition,
        };
      }

      function initOptions() {
        SetOptions();

        // LOGO
        logo = new lib.Logo();
        logo.name = "logo";
        var logoScale = 0.7;
        logo.scaleX = logo.scaleY = logoScale;

        var logoB = logo.getBounds();
        //	cl("logo: logoB.height=" + logoB.height)
        var logoLoc = bottomLeft.pointLoc0;
        logo.x = logoLoc.x;
        logo.y = -logoB.height * logoScale

        logo.snapToPixel = true;
        logo.cache(0, 0, logoB.width, logoB.height, 4);

        logo.alpha = 0;

        bottomLeft.addChild(logo);

        // INSTALL BTN
        var iBtnScale = 0.4;
        var iBtnB;
        if (currentVar.installBtnPos == "topLeft") {
          installButton = new lib.InstallBtn();
          iBtnB = installButton.getBounds();
          var btnLoc = topLeft2.pointLoc0;
          installButton.x = 5; //bounds.width*0.5;
          installButton.y = 3; //bounds.height*0.5;

          topLeft2.addChild(installButton);
        } else if (currentVar.installBtnPos == "topRight") {
          installButton = new lib.InstallBtn();
          iBtnB = installButton.getBounds();
          var btnLoc = topRight.pointLoc0;
          installButton.x = - 2*iBtnB.width * iBtnScale;
          installButton.y = 3; //bounds.height*0.5;

          topRightBTN.addChild(installButton);
        } else {
          installButton = new lib.FinalBtn();
          var btnLoc = bottomMid.pointLoc0;
          installButton.x = btnLoc.x;
          installButton.y = btnLoc.y;
          bottomMid.addChild(installButton);
        }


        installButton.btnText.text = LocalizedStrings.installBtn[userLang];
        txtSrc = installButton.btnText;
        textLoc = installButton.textLoc;
        TextSizerPlacer(txtSrc, textLoc, 17, "bold");

        installButton.btnText.x = iBtnB.width * 0.5 //*iBtnScale;
        installButton.btnText.y = iBtnB.height * 0.5 * iBtnScale;


        //installButton._funcClick = installButton.on("click", function () {
        installButton._funcClick = installButton.addEventListener("click", function() {
          if (platformType == "appreciate") {
            try {
              Appreciate.inAdEvent("Continue playing");
            } catch (e) {}
            cl("Continue playing");
          }
          downloadGame();
        });

        installButton.scaleX = installButton.scaleY = iBtnScale;


      }

      /* //////////////////////////////////////////////////
      	END Marketing settings
      */ //////////////////////////////////////////////////


      /////////////////////////
      // START
      function Init() {
        if (c.Touch.isSupported()) {
          c.Touch.enable(stage, true);
        }

        widthReal = canvas.width;
        heightReal = canvas.height;

        //initStructures();
        //


        GameInit();

      }

      function GameInit() {
        gameStarted = true;

        initOptions();
        initStructures();
        //gEInit();
        //InitBank();
        popUpInit();


        topLeft.on("pressup", UnitStopDrag, {
          capture: true
        });
        topLeft.on("pressmove", UnitDrag, {
          capture: true
        });

        mainTicker = thh.on("tick", MainTickerF);


        serviceInfo();
        RecalulateLoc();
      }


      function UnitDrag(evt) {
        var p = th.globalToLocal(evt.stageX, evt.stageY);
        if (!thDrag) {
          thDrag = true;
          dragOffset.y = p.y - topLeft.y;
        }
        if (gameOrient === "Horizontal") {
          if (!shapeGrad.used) {
            shapeGrad.used = true;
            shapeGrad.alpha = 0;
          }
          doDrag(p.y);
        }
      }

      function doDrag(posY) {
        //cl("topLeft.y= " + topLeft.y)
        //cl("heightInHeight= " + heightInHeight)
        var moveY = posY - dragOffset.y
        if (moveY > -heightInHeight && moveY <= -heightInHeight * 0.5) {
          topLeft.y = moveY;

        }
      }


      function UnitStopDrag(evt) {
        thDrag = false;
        if (gameOrient === "Horizontal") {
          //th.y += p.y;
        }
      }



      function MainTickerF() {
        OrientationChecker();

        if (gameStarted) {
          CarManager();
          CollectorManager();
          BankControl();
          CowManager();
          SeparatorSM();
          LiftSM()
        }

      }

      function MainTickerOFF() {
        gameStarted = false;
        //thh.off("tick", mainTicker);
      }

      // RESPONSIVE FUNCTIONS  ====================================
      function RecalulateLoc() {
        xRatioIn = 1;
        yRatioIn = 1;

        widthReal = canvas.width;
        heightReal = canvas.height;

        widthInWidth = lib.properties.width;
        heightInHeight = lib.properties.height;

        th.x = widthReal / pRatio * 0.5;
        th.y = heightReal / pRatio * 0.5;


        scaleFactor = 0;

        if (heightReal / widthReal >= 1.01) {
          background.scaleX = background.scaleY = heightReal / (480 * pRatio);
          scaleFactor = (widthReal / (widthSrc * pRatio));
          gameOrient = "Vertical";
        } else {
          background.scaleX = background.scaleY = widthReal / (480 * pRatio);
          scaleFactor = (heightReal / (heightSrc * pRatio));
          gameOrient = "Horizontal";
        }

        if (gameOrient == "Vertical") {

          for (var i = 0; i < layout.length; i++) {
            layout[i].scaleX = layout[i].scaleY = scaleFactor;
          }

          //gE.scaleX = gE.scaleY = scaleFactor;

        } else if (gameOrient == "Horizontal") {
          scaleFactor *= multypl;
          for (var i = 0; i < layout.length; i++) {
            layout[i].scaleX = layout[i].scaleY = scaleFactor;
          }



        }

        cl("widthInWidth = " + widthInWidth + "; heightInHeight = " + heightInHeight);
        cl("widthReal = " + widthReal + "; heightReal = " + heightReal);
        /*	cl("pRatio = " + pRatio);
        	cl("scaleFactor = " + scaleFactor);
        	*/
        topLeft.x = -widthInWidth * 0.5;
        topLeft.y = -heightInHeight * 0.5;

        topLeft2.x = -widthInWidth * 0.5;
        topLeft2.y = -heightInHeight * 0.5;

        topBG.x = -widthInWidth * 0.5;
        topBG.y = -heightInHeight * 0.5;

        topMid.x = 0;
        topMid.y = -heightInHeight * 0.5;

        topRight.x = widthInWidth * 0.5;
        topRight.y = -heightInHeight * 0.5;

        topRightBTN.x = widthInWidth * 0.5;
        topRightBTN.y = -heightInHeight * 0.5;

        midLeft.x = -widthInWidth * 0.5;
        midLeft.y = 0;

        midRight.x = widthInWidth * 0.5;
        midRight.y = 0;

        bottomLeft.x = -widthInWidth * 0.5;
        bottomLeft.y = heightInHeight * 0.5;

        bottomMid.x = 0;
        bottomMid.y = heightInHeight * 0.5;

        bottomRight.x = widthInWidth * 0.5;
        bottomRight.y = heightInHeight * 0.5;

      }

      function OrientationChecker(e) {
        if (resizeCanvasFlag) {
          cl("resizeCanvasFlag=" + resizeCanvasFlag)
          resizeCanvasFlag = false;
          RecalulateLoc();
          BankBarMenuBGScale();
          //IncreaseTopBG();
          FloorRepos();
          UnlockBtnPosUpdate();
          //	ShadingRepos();
          //CursorPosition();
        }
        //cl(gameOrient);
        popUpPos();

        finalWindowDraw();
      }


      // END RESPONSIVE FUNCTIONS  ====================================



      // INIT STRUCTURES ====================================
      function initStructures() {
        InitBank();
        initTopBG();


        initMilkCollector();
        initShop();
        CarGenerator(4);

        //topLeft.scaleX = topLeft.scaleY = topLeftScale;
        //topLeft2.scaleX = topLeft2.scaleY = topBGScale;

        initFloors();
        initLift();
        initSeparator(floorsArray[0]);

        topLeft.setChildIndex(separator, topLeft.getNumChildren() - 1);

        //AntsCreate(2, floorsArray[0]);
        cursorInit();
        topLeft2.setChildIndex(shapeGrad, topLeft2.getNumChildren() - 1);
        //ShadingInit();
        //BoxInit(floorsArray[0]);
        cl("initStructures");

      }

      function initTopBG() {
        topBGBlock = new c.Container();
        topBGBlock.name = "topBGBlock";

        //if(widthReal/(widthSrc*pRatio) >1)
        //{
        var numBG = Math.ceil(widthReal / (widthSrc)) //*pRatio
        for (i = 0; i < numBG; i++) {
          var bg = new lib.TopBG();
          var b = bg.getBounds();
          bg.x = b.width * i;
          bg.gotoAndStop(currentVar.background);
          topBGBlock.addChild(bg);
        }

        topBG.addChild(topBGBlock);
        topBG.snapToPixel = true;

        //topBG.scaleX = topBG.scaleY = topBGScale;

        var topBGBounds = topBG.getBounds();
        topLeftOffsetY = topBGBounds.height;
        topBG.cache(0, 0, topBGBounds.width, topBGBounds.height, 4);

      }

      // END INIT STRUCTURES ====================================

      // MILK COLLECTOR SECTION  ====================================

      function CollectorManager() {
        CollectorSM();
      }

      // Collector state machine
      function CollectorSM() {
        //cl("here")
        if (milkCollector.o.currentFill > 0) {
          milkCollector.o.dispense = true;
        } else {
          milkCollector.o.dispense = false;
          //cl("milkCollector.o.dispense =" + milkCollector.o.dispense);
        }


        if (milkCollector.o.dispense) {
          var countRequest = 0;
          for (var i = 0; i < carArr.length; i++) {
            var car = carArr[i];

            if (car.o.requestFill) {
              countRequest++;
            }
          }
          // if any request
          if (countRequest > 0) {
            milkCollector.o.startDispense = true;
          } else {
            milkCollector.o.startDispense = false;
          }


          if (milkCollector.o.startDispense) {
            if (milkCollector.o.craneAnimation) {
              milkCollector.o.craneAnimation = false;
              milkCollector.crane.gotoAndPlay("dispense");
            }
            milkCollector.o.currentFill--;
          } else {
            milkCollector.o.craneAnimation = true;
            milkCollector.crane.gotoAndStop("stop");
          }
        } else if (!milkCollector.o.dispense) {
          milkCollector.o.startDispense = false;
          milkCollector.o.craneAnimation = true;
          milkCollector.crane.gotoAndStop("stop");
        }


        if (milkCollector.o.startFill) {
          milkCollector.o.fill = true;
          milkCollector.o.currentFill++;
        } else {
          milkCollector.o.fill = false;
        }

        if (milkCollector.o.currentFill < milkCollector.o.capacity) {
          milkCollector.o.readyToRecieve = true;
        } else {
          milkCollector.o.readyToRecieve = false;
        }

        var curFrame = (milkCollector.o.currentFill / milkCollector.o.capacity) * 100;
        //cl("curFrame="+curFrame)
        milkCollector.gotoAndStop(curFrame);

      }


      function initMilkCollector() {
        milkCollector = new lib.MilkCollector();
        milkCollector.name = "milkCollector";
        milkCollector.gotoAndStop("full");
        milkCollector.scaleX = milkCollector.scaleY = topBGScale;
        milkCollector.y = 45;

        milkCollector.o = {
          startFill: false,
          fill: false,
          startDispense: false,
          dispense: false,
          capacity: 1000,
          currentFill: 0,
          bookedBy: "",
          free: true,
          craneAnimation: false,
          readyToRecieve: false,
        }



        //	milkCollector.on("click", MilkCollectorTest);

        topLeft2.addChild(milkCollector);
      }


      function MilkCollectorTest(e) {
        var col = e.currentTarget;
        cl("startFill: " + col.o.startFill +
          "\nfill: " + col.o.startFill +
          "\nstartDispense: " + col.o.startDispense +
          "\ndispense: " + col.o.dispense +
          "\ncapacity: " + col.o.capacity +
          "\ncurrentFill: " + col.o.currentFill +
          "\nbookedBy: " + col.o.bookedBy +
          "\nfree: " + col.o.free +
          "\ncraneAnimation: " + col.o.craneAnimation);

      }

      // END MILK COLLECTOR SECTION  ================================

      // SHOP COLLECTOR SECTION  ====================================
      function initShop() {
        shop = new lib.Shop();
        shop.name = "shop";
        shop.y = 55;
        // sshop.x = widthInWidth //* 0.5;
        //cl("widthInWidth =" + widthInWidth)
        shop.scaleX = shop.scaleY = topBGScale;
        shop.o = {
          buyMilk: false,
        }

        shop.snapToPixel = true;
        shop.cache(-150, -1, 151, 163, 4);

        topRight.addChild(shop);
        MilkPriceTxt();
      }

      // END SHOP COLLECTOR SECTION  ================================

      function MilkPriceTxt() {
        milkPriceTxt = new c.Container();
        var priceText = new c.Text("$20", "bold 12px Arial", "#ffffff");
        priceText.textAlign = "center";

        priceTextStroke = priceText.clone();
        priceTextStroke.outline = 3;
        priceTextStroke.color = "#253453";

        milkPriceTxt.x = -100;
        milkPriceTxt.y = 100;
        milkPriceTxt.startBlink = false;
        milkPriceTxt.alpha = 0;

        milkPriceTxt.addChild(priceTextStroke);
        milkPriceTxt.addChild(priceText);
        topRight.addChild(milkPriceTxt);
      }



      // CAR SECTION  ====================================
      function CarGenerator(amount) {
        var counter = 0
        var t1 = setInterval(
          function() {
            if (counter >= amount) {
              clearInterval(t1);
              //cl("stop generate")
            } else {
              initCar(counter);
              counter++;
            }

          }, 1000);
      }

      function initCar(counter) {
        car = new lib.Car();

        car.scaleX = car.scaleY = topBGScale;
        car.name = "car_" + counter;

        //car.carTxt.text = car.name;

        var carBounds = car.getBounds();
        car.o = {
          startMove: true,
          canMove: false,
          move: true,
          speed: widthInWidth / 2000,
          accel: 1,
          direction: 1,
          width: carBounds.width,
          clicked: false,
          requestFill: false,
          startFill: false,
          fill: false,
          fillFinish: false,
          milkAmount: 100,
          milkCounter: 0,
          nextDist: -carBounds.width,

        };

        car.y = 155;
        car.x = -car.o.width;
        car.o.startX = car.x;
        car._funcClick = car.on("click", CarClick);

        if (tutorFlag2 && counter == 0) {
          cursorCar = new lib.Cursor();
          cursorCar.alpha = 0;
          cursorCar.name = "cursorCar";
          car.addChild(cursorCar);
        }

        topLeft2.addChild(car);
        topLeft2.setChildIndex(topLeftRect, topLeft2.getNumChildren() - 1);
        //thh.addChild(car);
        carArr.push(car);
      }

      function CarManager() {
        for (i = 0; i < carArr.length; i++) {
          var car = carArr[i];
          /*
          cl("==================");
          cl("car.name = " + car.name);
          cl("car.o.move = " + car.o.move);
          */

          CarSM(car);
        }

      }

      // Cow state machine
      function CarSM(car) {
        if (car.o.move) {

          if (car.o.clicked) {
            car.o.accel = 2;
            car.o.clicked = false;
            var accelTimer = setInterval(function() {
              clearInterval(accelTimer);

              car.o.accel = 1;
            }, 2000);
          }
          if (milkCollector.o.free) {
            milkCollector.o.free = false;
            milkCollector.o.bookedBy = car.name;
            car.o.canMove = true;
          }

          if (car.o.fillFinish) {
            //	milkCollector.o.free = true;
            //milkCollector.o.bookedBy = "";
            //car.o.nextDist = widthInWidth;
          }

          if (car.o.canMove) {
            CarMove(car);
          }

        } else if (car.o.fill) {
          //cl("Fill")
          if (car.o.clicked) {
            car.o.accel = 1.5;
          }
          CarFillMilk(car);
        } else {
          // wait
        }
      }

      function CarFillMilk(car) {
        if (car.o.startFill) {
          car.o.startFill = false;
          car.gotoAndPlay("fill");
        }

        if (car.o.milkCounter <= car.o.milkAmount && milkCollector.o.startDispense) {

          var curFrame = (car.o.milkCounter / car.o.milkAmount) * 100 //car.body.totalFrames;
          car.body.gotoAndStop(curFrame);
          car.o.milkCounter++;

        } else if (car.o.milkCounter >= car.o.milkAmount) {
          car.o.requestFill = false;
          car.o.fill = false;
          car.body.gotoAndStop("full");
          car.o.fillFinish = true;
          car.o.startMove = true;
          car.o.move = true;
          milkCollector.o.free = true;
          if (tutorFlag2 && car.name == "car_0") {
            cursorCar.alpha = 1;
          }

        }

      }

      function CarMove(car) {

        if (car.o.startMove) {
          car.o.startMove = false;
          car.gotoAndPlay("move");
        }

        if (gameOrient == "Vertical") {
          car.o.speed = (widthInWidth / 2000) / 10;
        } else {
          car.o.speed = (widthInWidth / 2000) / 15;
        }

        car.x += car.o.speed * car.o.accel * FPS;
        if (test) {
          //car.test.text = car.x;
        }

        if (car.x >= widthInWidth / scaleFactor - car.o.width && car.x < widthInWidth / scaleFactor - car.o.width * 0.1) {
          if (!milkPriceTxt.startBlink) {
            milkPriceTxt.startBlink = true;
            //milkPriceTxt.alpha = 1;
            priceMoveAlpha(milkPriceTxt, milkPriceTxt.x, 85, 1)
            //objectAlpha(milkPriceTxt, 0);
            //objBlink(milkPriceTxt);
          }
        }

        if (car.x >= widthInWidth / scaleFactor + car.o.width * 0.5) // OUT OF THE SCENE
        {
          coinsCurrent += milkPrice; // Buy milk
          milkPriceTxt.startBlink = false;
          car.x = -car.o.width;
          car.o.fillFinish = false;
          car.o.accel = 1;
          car.body.gotoAndStop("empty");
          car.o.milkCounter = 0;
          car.o.canMove = false;

          if (firstTimeProfit) {
            cl("firstTimeProfit");
            firstTimeProfit = false;
            InitButtonUpgrade(0);
            if (car.getChildByName("cursorCar")) {
              car.removeChild(cursorCar);
            }
          }

        }

        // near collector
        //else if (car.x > milkCollector.x + car.o.width && car.x <= milkCollector.x + 2* car.o.width && !car.o.fillFinish)
        else if (car.x > milkCollector.x + 132 * topBGScale && car.x <= milkCollector.x + 132 * topBGScale + 0.5 * car.o.width && !car.o.fillFinish) {
          car.o.move = false;
          car.o.fill = true;
          car.o.startFill = true;
          car.o.requestFill = true;
        }
      }

      function CarRemove() {
        //car.off("tick", car._funcTick);
      }

      function CarClick(e) {
        var car = e.currentTarget;
        cl("CarClick: click");
        if (tutorFlag2) {
          tutorFlag2 = false;
          car.removeChild(cursorCar);
        }
        car.o.clicked = true;
        /*
        	cl("=================")
        	cl("car.name"+car.name);
        	cl("startMove: "+ car.o.startMove+
        	"\ncanMove: "+ car.o.canMove+
        	"\nmove: "+ car.o.move+
        	"\nspeed: "+ car.o.speed+
        	"\naccel: "+ car.o.accel+
        	"\ndirection: "+ car.o.direction+
        	"\nwidth: "+ car.o.width+
        	"\nclicked: "+ car.o.clicked+
        	"\nrequestFill: "+ car.o.requestFill+
        	"\nstartFill: "+ car.o.startFill+
        	"\nfill: "+ car.o.fill+
        	"\nfillFinish: "+ car.o.fillFinish+
        	"\nmilkAmount: "+ car.o.milkAmount+
        	"\nmilkCounter: "+ car.o.milkCounter+
        	"\nnextDist: "+ car.o.nextDist);
        */
      }
      // END CAR SECTION  ====================================

      // BANK ====================================

      function InitBank() {
        bankBar = new lib.TopMenu();
        bankBar.name = "bankBar";
        coinsCurrent = coinsNum;
        BankBarMenuBGScale();
        topMid.addChild(bankBar);

        bankTimer = setInterval(function() {
          coinsCurrent += 20;
        }, 1000);

        cl("InitBank: was inited");
      }

      function BankBarMenuBGScale() {
        bankBar.menuBG.scaleX = (widthReal / widthSrc) * pRatio;
        var rect = new createjs.Shape();
        rect.graphics.beginFill("#FFF").drawRect(-widthReal * 0.5, 0, widthReal, 32);
        bankBar.menuBG.addChild(rect);
      }

      function BankControl() {
        bankBar.moneyTxt.text = "$ " + coinsCurrent;
        var progress = LEVELLIM * currentLevel
        var num = coinsCurrent % LEVELLIM;
        var frame = (num / LEVELLIM) * 100;

        if (coinsCurrent >= progress) {
          currentLevel++;
        }

        //bankBar.levelTxt.text = " ";
        //bankBar.levelTxt.text = LocalizedStrings.uiTxt.levelTxt[userLang] + " " + currentLevel;
      }

      function RemoveBank() {
        topMid.removeChild(bankBar);
        //topMid.removeEventListener("tick", BankControl);
        cl("RemoveBank: Bank was removed");
      }

      function BankCounter() {
        coinsCurrent -= price;
        cl("BankCounter: amount of coins decreases");
      }

      function CoinsCheck() {
        if (coinsCurrent > price) {
          return true;
        } else {
          return false;
        }
      }


      // END BANK====================================

      // FLOORS  ====================================

      function initFloors() {
        var multyplIntern;

        var numBG = Math.ceil(widthReal / (widthSrc));

        for (i = 0; i < numFloors; i++) {
          var floorC = new c.Container(); // floor container
          var floorCBG = new c.Container(); // floor background container

          for (j = 0; j < numBG; j++) {
            var floorBG = new lib.Floor();
            var f = floorBG.getBounds();
            floorBG.gotoAndStop(currentVar.background);
            floorBG.x = f.width * j;
            floorCBG.addChild(floorBG);
          }

          //	floorC.scaleX = floorC.scaleY = topLeftScale;
          var floorBounds = floorCBG.getBounds();
          floorCBG.snapToPixel = true;
          floorCBG.cache(0, 0, floorBounds.width, floorBounds.height, 4);
          floorC.addChild(floorCBG);

          floorC.widthB = floorBounds.width;
          floorC.heightB = floorBounds.height;

          floorC.x = widthSrc * 0.15;
          floorC.y = i * floorBounds.height + topLeftOffsetY - 2;

          floorC.name = "floor_" + i;
          //floor.stageTxt.text = LocalizedStrings.uiTxt.popUpTxt.stageTxt[userLang] + " " +(i+1)+ ":";
          if (i == 0) {
            CowGenerator(1, floorC);
            //floor.itemTxt.text = currentVar.stageItem;
          } else {


            var floorText = LocalizedStrings.uiTxt.levelTxt[userLang] + " " + i * 5 + " " + LocalizedStrings.uiTxt.toUnlok[userLang];
            //cl(tapTxt)
            var floorTxt = new c.Text(floorText, "bold 16px Arial", "#ffffff");

            floorTxt.textAlign = "center";
            //floorTxt.outline = 3;

            floorTxt.shadow = new c.Shadow("rgba(0,0,0,1)", 1, 1, 1);
            floorTxt.alpha = 1;
            floorTxt.x = ((widthInWidth / scaleFactor) * 0.5 - widthSrc * 0.15) * 0.5;
            floorTxt.y = floorC.heightB * 0.3 //(heightInHeight/scaleFactor)*0.5;

            var floorTxtStroke = floorTxt.clone();
            floorTxtStroke.outline = 3;
            floorTxtStroke.color = "#253453";

            floorC.textObj = floorTxt;
            floorC.textStroke = floorTxtStroke;

            floorC.addChild(floorTxtStroke);
            floorC.addChild(floorTxt);

          }
          //	floor.itemTxt.text = LocalizedStrings.uiTxt.popUpTxt.itemsTxt.burger[userLang];


          cl("initFloors: floorC.y= " + floorC.y);
          //	FloorLonger(floor);
          //	floor._funcClick = floor.on("click", FloorClicked);

          floorsArray.push(floorC);
          //	InitButtonUpgrade(floor);
          topLeft.addChild(floorC);
          //	BoxInit(floor);
        }
        //BoxInit(floorsArray[0]);


      }


      function FloorRepos() {
        /*var bounds = topBGBlock.getBounds();
        var floor = floorsArray[1];*/
        //cl("bounds.height= "+bounds.height);

        for (i = 1; i < floorsArray.length; i++) {
          if (floorsArray[i].textObj) {
            var textObj = floorsArray[i].textObj;
            var textStroke = floorsArray[i].textStroke;
            textObj.x = textStroke.x = (widthInWidth / scaleFactor - widthSrc * 0.15) * 0.5;
            textObj.y = textStroke.y = floorsArray[i].heightB * 0.3;
          }
        }

        //if (gameOrient == "Vertical") {
        //	multyplIntern = 1;
        //} else {
        //	multyplIntern = multypl;
        //}
        //	if (floor.getChildByName("unlockBtn")) {
        //		//var unlockBtn = floor.getChildByName("unlockBtn");
        //		UnlockBtnPosUpdate();
        //	}
      }

      // SEPARATOR  ====================================
      function initSeparator(floor) {
        cl("name" + floor.name)
        var floorB = floor.getBounds();
        separator = new lib.Separator();
        separator.name = "separator";
        var separatorScale = 0.8
        separator.scaleX = separator.scaleY = separatorScale;

        separator.x = floor.x;
        separator.y = floor.y + floorB.height;
        separator.dugPoint1.alpha = 1;

        separator.o = {
          capacity: milkCapacity,
          currentAmount: 0,
          waitForLift: false,
          startSendMilk: false,
          sendMilk: false,
          readyToMilk: true,
          empty: true,
        }
        /*
        milkStationsArr = [
        	separator.dugPoint1.x,
        	separator.dugPoint2,
        	separator.dugPoint3
        ]
        */

        milkStationsArr = [
          186 * separatorScale,
          255 * separatorScale,
          330 * separatorScale
        ]

        topLeft.addChild(separator);

        cl("BuildFloorSeparator: here")
      }

      function SeparatorSM() {
        var frame = (separator.o.currentAmount / separator.o.capacity) * 100;
        separator.gotoAndStop(frame);

        /*
					separator.separatorCount.fillStyle = "white";
					separator.separatorCount.strokeStyle = "#253453";
					separator.separatorCount.lineWidth = 3;  //define the width of the stroke line
					separator.separatorCount.text = separator.o.currentAmount;
					separator.separatorCount.fillText(separator.o.currentAmount, separator.separatorCount.x, separator.separatorCount.y);
					separator.separatorCount.strokeText(separator.o.currentAmount, separator.separatorCount.x, separator.separatorCount.y);
				*/

        separator.separatorCount.text = separator.o.currentAmount;
        separator.separatorStroke.text = separator.separatorCount.text;
        separator.separatorStroke.outline = 3;
        separator.separatorStroke.color = "#253453";


        if (separator.o.currentAmount > 0) {
          separator.o.waitForLift = true;
        }

        if (separator.o.currentAmount >= separator.o.capacity) {
          separator.o.readyToMilk = false;
          separator.o.empty = false;
          //separator.o.currentAmount=separator.o.capacity;

          if (separator.o.startSendMilk) {
            separator.o.startSendMilk = false;
            separator.o.sendMilk = true;
            //lift.crane.gotoAndPlay("dispense");
          } else if (separator.o.sendMilk && lift.o.readyToRecieve) {
            separator.o.currentAmount--;
          } else if (lift.o.readyToRecieve) {
            separator.o.startSendMilk = true;
          }

        } else if (separator.o.currentAmount <= 0) {
          separator.o.sendMilk = false;
          separator.o.readyToMilk = true;
          separator.o.empty = true;
          separator.o.currentAmount = 0;
        }
        /*
        else if(separator.o.currentAmount < separator.o.capacity)
        	{
        		separator.o.currentAmount +=cow.o.milkAccel;
        	}
        */
        else {
          if (separator.o.sendMilk && lift.o.readyToRecieve && !separator.o.empty) {
            separator.o.currentAmount--;
          } else {
            //	lift.crane.gotoAndPlay("stop");
          }
        }

      }

      // END SEPARATOR  ====================================
      function InitButtonUpgrade(floor) {
        upgradeBtn = new lib.UpgradeBtn();
        upgradeBtn.name = "upgradeBtn";
        upgradeBtn.scaleX = upgradeBtn.scaleY = 0.8;
        //upgradeBtn.gotoAndStop(currentVar.upgradeBtn);
        //upgradeBtn.btnText.text = LocalizedStrings.uiTxt.upgradeTxt[userLang];
        var upgradeBtnB = upgradeBtn.getBounds();
        //var txtSrc = upgradeBtn.btnText;
        //var textLoc = upgradeBtn.textLoc;
        //var oneWord = true;
        //TextSizerPlacer(txtSrc, textLoc, 10, "bold", oneWord);

        upgradeBtn.alpha = 1;
        upgradeBtn.o = {
          btnFloor: floor,
          width: upgradeBtnB.width,
          height: upgradeBtnB.height,
          enableClick: true,

        }
        upgradeBtn.x = -upgradeBtnB.width;
        upgradeBtn.y = topLeftOffsetY + upgradeBtnB.height * 0.5;

        //upgradeBtn._funcTick = upgradeBtn.on("tick", UpgrdBtnShow, null, false);
        upgradeBtn._funcClick = upgradeBtn.on("click", ShowUpgradeWindow, null, false);

        //UpgradeBtnPosUpdate(upgradeBtn);


        //topLeft.addChild(upgradeBtn);
        topRight.addChild(upgradeBtn);

      }

      function UpgrdBtnShow(e) {
        var btn = e.currentTarget
        if (firstMoney && !oneTimeFlag && btn.o.btnFloor.name == "floor_0") {
          e.currentTarget.off("tick", e.currentTarget._funcTick);
          topLeft.setChildIndex(btn.o.btnFloor, topLeft.getNumChildren() - 1);
          topLeft.setChildIndex(btn.o.btnFloor.box, topLeft.getNumChildren() - 1);
          btn.alpha = 1;
          btn.o.enableClick = true;
          var floor = btn.o.btnFloor;

          if (gameOrient == "Horizontal") {
            var currentOffset = topLeft.y;


            var topBGBlock = topLeft.getChildByName("topBGBlock");


            var bound = topBGBlock.getBounds();
            objectMove(topLeft, topLeft.x, topLeft.y - bound.height * 0.25);
          }
        }


      }

      function UpgradeBtnPosUpdate(btn) {
        var floorBounds = btn.o.btnFloor.getBounds();
        btn.y = 1.2 * btn.o.height //floorBounds.height*0.5;
        btn.x = widthInWidth / scaleFactor - 1.5 * btn.o.width //*0.5;
        /*
        cl("UpgradeBtnPosUpdate")
        var floorBounds = upgradeBtn.o.btnFloor.getBounds();
        upgradeBtn.y = 1.2*upgradeBtn.o.height  //floorBounds.height*0.5;
        upgradeBtn.x = widthInWidth/scaleFactor - upgradeBtn.o.width*0.5 //- 1.5*upgradeBtn.o.width//*0.5;
        */
        cl("UpgradeBtnPosUpdate: upgradeBtn.x=" + upgradeBtn.x)
      }


      function ShowUpgradeWindow(e) {

        if (e.currentTarget.o.enableClick) {
          e.currentTarget.alpha = 0;
          oneTimeFlag = true;

          //popUp.alpha = 1;
          popUpShow();
          e.currentTarget.off("click", e.currentTarget._funcClick);

        }
      }


      function InitButtonUnlock(floor) {
        unlockBtn = new lib.UnlockBtn();
        unlockBtn.name = "unlockBtn";
        //unlockBtn.gotoAndStop(currentVar.upgradeBtn);
        unlockBtn.btnText.text = LocalizedStrings.uiTxt.unlockTxt[userLang];
        var bounds = unlockBtn.getBounds();
        var txtSrc = unlockBtn.btnText;
        var textLoc = unlockBtn.textLoc;
        var oneWord = true;
        TextSizerPlacer(txtSrc, textLoc, 10, "bold", oneWord);

        unlockBtn.alpha = 1;
        unlockBtn.o = {
          btnFloor: floor,
          width: bounds.width,
          height: bounds.height,

        }

        //var floor = floorsArray[1];
        var floorB = floor.getBounds();

        unlockBtn.x = (widthInWidth / scaleFactor) * 0.5 - widthSrc * 0.15;
        unlockBtn.y = floorB.height * 0.5;
        unlockBtn.scaleX = unlockBtn.scaleY = 1.5;
        //unlockBtn.on("tick", UnlockBtnShow);
        unlockBtn._funcClick = unlockBtn.on("click", function func(e) {
          unlockBtn.cursor.alpha = 0;
          unlockBtn.off("click", unlockBtn._funcClick);
          floor.removeChild(unlockBtn);
          cleanUp();
        }, null, false);


        //topLeft2.addChild(unlockBtn);
        //UnlockBtnPosUpdate(unlockBtn);
        //topLeft.setChildIndex(floor, topLeft.getNumChildren() - 1);

        floor.addChild(unlockBtn);
      }

      function UnlockBtnPosUpdate() {
        if (floorsArray[1].getChildByName("unlockBtn")) {
          var floor = unlockBtn.o.btnFloor;
          var floorB = floor.getBounds();
          unlockBtn.x = (widthInWidth / scaleFactor) * 0.5 - widthSrc * 0.15;
          unlockBtn.y = floorB.height * 0.5;
        }
      }

      // END FLOORS  ====================================

      // LIFT  ====================================

      function initLift() {
        liftContainer = new c.Container();
        //liftContainer.y = topLeftOffsetY - 3;
        liftBG = new c.Shape();
        liftBG.graphics.s("#1A528E").f(currentVar.bgColor).r(0, 0, widthSrc * 0.15, heightReal + topLeftOffsetY);
        liftBG.graphics.setStrokeStyle(3);
        liftBG.setBounds(0, 0, widthSrc * 0.15, heightInHeight / scaleFactor);
        var bgB = liftBG.getBounds();
        liftContainer.addChild(liftBG);

        lift = new lib.Lift();
        lift.scaleX = lift.scaleY = 0.6;
        lift.x = bgB.width * 0.5;
        lift.y = topLeftOffsetY + 23;
        //lift.y =  50;

        lift.o = {
          startMove: false,
          move: false,
          readyToRecieve: false, // from separator
          readyToSend: false, // to milk collector
          send: false,
          dockPos: topLeftOffsetY + 23,
          dock: true, // default position
          separator: false,
          capacity: milkCapacity,
          currentAmount: 0,

        }



        liftContainer.addChild(lift);

        var liftBlock = new lib.LiftBlock();
        liftBlock.scaleX = liftBlock.scaleY = 0.6;
        liftBlock.x = bgB.width * 0.5;
        liftBlock.y = topLeftOffsetY - 10;
        //liftBlock.y = - 10;
        liftContainer.addChild(liftBlock);

        topLeft.addChild(liftContainer);

      }


      function LiftSM() {
        if (lift.o.dock) {
          //cl("lift.o.dock");
          if (lift.o.currentAmount <= 0) {
            lift.o.send = false;
            milkCollector.o.startFill = false;
            if (separator.o.waitForLift) {
              lift.o.startMove = true;
              MoveLiftDown(separator.y);
            }

          } else if (lift.o.currentAmount >= lift.o.capacity) {
            if (milkCollector.o.readyToRecieve) {
              lift.o.send = true;
              milkCollector.o.startFill = true;
              lift.o.currentAmount--;
            } else {
              milkCollector.o.startFill = false;
            }
          } else if (lift.o.currentAmount > 0) {
            if (milkCollector.o.readyToRecieve) {
              milkCollector.o.startFill = true;
              lift.o.currentAmount--;
            } else {
              milkCollector.o.startFill = false;
            }
          }


        } else if (lift.o.move) {

        } else if (lift.o.separator) {
          if (lift.o.currentAmount <= 0) {
            lift.o.readyToRecieve = true;

            if (separator.o.startSendMilk) {
              lift.o.currentAmount++;
              lift.crane.gotoAndPlay("dispense");
            }
          } else if (separator.o.sendMilk) {
            //	cl("separator.o.sendMilk")
            //	cl("lift.o.currentAmount" + lift.o.currentAmount)

            lift.o.currentAmount++;
          } else if (lift.o.currentAmount >= lift.o.capacity) {
            lift.crane.gotoAndPlay("stop");
            lift.o.readyToRecieve = false;
            lift.o.startMove = true;
            MoveLiftUp(lift.o.dockPos);
          }
        }

        var frame = (lift.o.currentAmount / lift.o.capacity) * 100;
        if (frame >= 100) {
          lift.gotoAndStop("full");
        } else {
          lift.gotoAndStop(frame);
        }
      }

      function MoveLiftDown(posY) {
        lift.o.dock = false;
        lift.o.startMove = false;
        lift.o.move = true;
        c.Tween.get(lift, {
          override: true
        }).to({
          y: posY,
          alpha: 1
        }, 1000, c.Ease.linear).call(function() {

          lift.o.separator = true;
          lift.o.move = false;
          lift.o.readyToRecieve = true;
        });
      }

      function MoveLiftUp(posY) {
        lift.o.separator = false;
        lift.o.startMove = false;
        lift.o.move = true;
        c.Tween.get(lift, {
          override: true
        }).to({
          y: posY,
          alpha: 1
        }, 1000, c.Ease.linear).call(function() {
          lift.o.move = false;
          lift.o.dock = true;
          lift.o.readyToSend = true;
        });
      }

      // END LIFT  ====================================

      // COW SECTION
      function CowManager() {

        for (i = 0; i < cowArr.length; i++) {
          var cow = cowArr[i];

          CowSM(cow);
        }

      }

      // Cow state machine
      function CowSM(cow) {
        if (cow.o.run) {

          if (cow.o.clicked) {
            cow.o.accel = 2;
            cow.o.clicked = false;
            var accelTimer = setInterval(function() {
              clearInterval(accelTimer);
              cow.o.clicked = true;
              cow.o.accel = 1;
            }, 2000);
          }

          if (cow.o.milkFinish) {
            cow.o.nextDist = 0;
          } else {
            cow.o.nextDist = milkStationsArr[cow.o.milkPoint] //.x;
          }

          //cl(moveToPoint)
          CowMove(cow, cow.o.nextDist);
        } else if (cow.o.milk) {
          if (cow.o.clicked) {
            cow.o.accel = 2;
            cow.o.clicked = false;
            var accelTimer = setInterval(function() {
              clearInterval(accelTimer);
              cow.o.clicked = true;
              cow.o.accel = 1;
            }, 2000);
          }
          CowMilk(cow);
        } else {
          // wait
        }
      }

      function CowGenerator(amount, floor) {
        var counter = 0;
        var t1 = setInterval(
          function() {
            if (counter >= amount) {
              clearInterval(t1);
              //cl("stop generate")
            } else {
              CowInit(cowCounter, floor);
            }
            counter++;
          }, 1000);
      }


      function CowInit(counter, floor) {
        //for(i=0; i<levelCowNum; i++)
        //	{
        //cl("build cow in " + parentObj);
        var floorB = floor.getBounds()

        var cow = SetCowBody();
        var cowScale = 0.8;
        cow.scaleX = cow.scaleY = cowScale;
        var cowB = cow.getBounds();
        cow.name = "cow_" + counter;
        cow.x = widthInWidth / scaleFactor;
        cow.y = floor.y + floor.getBounds().height - cowB.height * cowScale * 0.6;
        //cl()
        cow.o = {
          startRun: true,
          run: true,
          startMilk: true,
          milk: false,
          startWait: true,
          clicked: false,
          speed: (widthInWidth / 2000), //*FPS,
          accel: 1,
          milkPoint: counter,
          milkFinish: false,
          milkAmount: milkCapacity,
          milkCounter: milkCapacity,
          milkAccel: 1,
          direction: 1,
          nextDist: 0,
          scale: cowScale,
          width: cowB.width,
        }

        cow._funcClick = cow.on("click", CowClick);

        //parentObj.addChild(cow);
        topLeft.addChild(cow);
        topLeft.setChildIndex(liftContainer, topLeft.getNumChildren() - 1);
        topLeft.setChildIndex(separator, topLeft.getNumChildren() - 1);

        if (tutorFlag) {
          topLeft.setChildIndex(cursor, topLeft.getNumChildren() - 1);
          topLeft.setChildIndex(shapeGrad, topLeft.getNumChildren() - 1);
        }

        cowArr.push(cow);
        cowCounter++;
        //}
      }



      function CowClick(e) {

        cl("click");
        if (tutorFlag) {
          var cow = cowArr[0];
          tutorFlag = false;
          cow.o.direction = 1;
          cow.scaleX = cow.o.scale;
          shapeGrad.off("click", shapeGrad._funcClick);

        } else {
          var cow = e.currentTarget;
        }

        if (!cow.o.run) {
          cow.gotoAndPlay("click");
          if (!cow.o.clicked) {
            cow.o.milkAccel = 2;
            cow.o.clicked = true;
            var t1 = setInterval(function() {
              clearInterval(t1);
              cow.o.clicked = false;
              cow.o.milkAccel = 1;
            }, 2000);
          }
        } else { // if run

          //cow.gotoAndPlay("click");
          if (!cow.o.clicked) {
            cow.o.accel = 2;
            cow.o.clicked = true;
            var t1 = setInterval(function() {
              clearInterval(t1);
              cow.o.clicked = false;
              cow.o.accel = 1;
            }, 2000);
          }
        }
      }

      function SetCowBody() {
        var body;
        switch (cowType) {
          case "first":
            body = new lib.Cow_first();
            break;
          case "second":
            body = new lib.Cow_second();
            break;
          default:
            body = new lib.Cow_first();
        }
        return body;
      }

      function CowMove(cow, varX) {
        //cow.o.run = false;
        if (cow.o.startRun) {
          cow.o.startRun = false;
          cow.gotoAndPlay("run");
        }

        cow.o.speed = widthInWidth / (scaleFactor * 120)

        cow.x -= cow.o.speed * cow.o.direction * cow.o.accel //*FPS/10;

        if (cow.x <= varX && tutorFlag || cow.x >= widthInWidth / scaleFactor) {
          if (cow.x > widthInWidth / scaleFactor) {
            cow.x = widthInWidth / scaleFactor - 20;

          }
          cow.o.direction *= (-1);
          cow.scaleX *= (-1);
        } else if (cow.x <= varX && varX <= 0) // if cow went out, start from the begining
        {
          cow.x = widthInWidth / scaleFactor - 20; // cow.o.width;
          cow.o.milkFinish = false;
          cow.o.accel = 1;
          cow.o.run = true;
          //cl("here")


        } else if (cow.x <= varX) {
          cow.o.milk = true;
          cow.o.startMilk = true;
          cow.o.run = false;
          cow.o.startRun = true;
        }
        //cl("CowMove: widthInWidth/scaleFactor = "+widthInWidth/scaleFactor )
        //cl("CowMove: cow.x = "+ cow.x)


        if (tutorFlag) {
          cursor.alpha = 1;
          cursorShow(cow.x, cow.y);
          if (!shapeGrad.used) {
            shapeGrad.used = true;
            tapTile.alpha = 1;
            shapeGrad.alpha = 1;
            topLeftRect.alpha = 1;
          }
          shapeGrad.x = cow.x;
          shapeGrad.y = cow.y;
        } else if (!tutorFlag) {

          tapTile.alpha = 0;
          cursor.alpha = 0;
          shapeGrad.alpha = 0;
          topLeftRect.alpha = 0;

        }
        //cl("Then cow.o.run =" + cow.o.run);

      }

      function CowMilk(cow) {
        if (separator.o.readyToMilk) {
          if (cow.o.startMilk) {
            cow.o.startMilk = false;
            //cow.o.milkCounter = cow.o.milkAmount;
            cow.gotoAndPlay("milk");
            cow.o.startWait = true;

          }

          if (cow.o.milkCounter > 0) {
            cow.o.milkCounter -= cow.o.milkAccel;
            if (separator.o.currentAmount < separator.o.capacity) {
              separator.o.currentAmount += cow.o.milkAccel;
              if (separator.o.currentAmount >= separator.o.capacity) {
                separator.o.currentAmount = separator.o.capacity;
              }
            }

          } else if (cow.o.milkCounter <= 0) {
            cow.o.milkCounter = cow.o.milkAmount;
            cow.o.milkAccel = 1;
            cow.o.milkFinish = true;
            cow.o.run = true;
          }

        } else if (cow.o.milkCounter <= 0) {
          cow.o.milkCounter = cow.o.milkAmount;

          cow.o.milkAccel = 1;
          cow.o.milkFinish = true;
          cow.o.run = true;
        } else {

          if (cow.o.startWait) {
            cow.o.startWait = false;
            //cow.o.milkCounter = cow.o.milkAmount;
            cow.gotoAndPlay("wait");
          }

        }
      }


      // END COW SECTION


      //////////////////////////////////////////////////////////
      // UTILITIES
      //////////////////////////////////////////////////////////
      function downloadGame(e) {
        cl("Click to download");
        if (platformType == "google") {
          ExitApi.exit();
        } else if (platformType == "facebook") {
          FbPlayableAd.onCTAClick();
        } else if (platformType == "vungle") {
          callSDK('download');
        } else if (platformType == "unity") {
          mraid.open(url);
        } else if (platformType == "applovin") {
          mraid.open(url);
        } else if (platformType == "appreciate") {
          mraid.open(landingUrl);
        } else if (platformType == "adcolony") {
          mraid.openStore(url);
        } else if (platformType == "tapjoy") {
          window.TJ_API && window.TJ_API.click();
        } else if (platformType == "ironsource") {
          mraid.openStoreUrl();
        }
      }


      function cursorInit() {
        //shapeGrad= new createjs.Shape();
        //shapeGrad.used = false;
        shapeGrad.alpha = 0;
        shapeGrad.x = 0;
        shapeGrad.y = 0;
        shapeGrad.graphics.rf(["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.5)"], [0.004, 0.09, 0.141, 1], 0, 0, 0, 0, 0, 400).s().p("EjqXDqXMAAAnUuMHUuAAAMAAAHUug");

        shapeGrad._funcClick = shapeGrad.on("click", CowClick);
        topLeft.addChild(shapeGrad);

        topLeftRect = new c.Shape();
        topLeftRect.name = "tempRect";
        topLeftRect.alpha = 0;
        var topB = topBG.getBounds();
        topLeftRect.graphics.f("rgba(0,0,0,0.5)").r(-topB.width * 0.5, 0, topB.width, topB.height);
        topMid.addChild(topLeftRect);


        cursor = new lib.Cursor();
        cursor.name = "cursor";
        cursor.x = cursor.y = -300;
        cursor.show = false;
        cursor.currX = -200;
        cursor.currY = -200;
        cursor.alpha = 1;
        cursor.objPos = null;
        cursor.scaleX = cursor.scaleY = 0.7;
        topLeft.addChild(cursor);


        tapTile = new lib.TapTile();
        tapTile.scaleX = tapTile.scaleY = topMid.scaleX //*pRatio;
        cl(tapTile.scaleX)

        //tapTile.setBounds(0,0, widthInWidth)


        //var topMidB = topMid.getBounds();
        //cl("topMidB.width = " + topMidB.width)



        tapTile.tapTxt.text = LocalizedStrings.tutorTxt[userLang];
        tapTile.tapTxtStroke.text = LocalizedStrings.tutorTxt[userLang];
        var textSize = 50;
        var fontWeight = "bold";
        TapTextSizerPlacer(tapTile.tapTxt, tapTile.tapLoc, textSize, fontWeight, false)


        tapTile.tapTxtStroke.outline = 4;
        tapTile.tapTxtStroke.color = "#253453";

        TapTextSizerPlacer(tapTile.tapTxtStroke, tapTile.tapLoc, textSize, fontWeight, false)


        tapTile.y = topLeftOffsetY;
        topMid.addChild(tapTile);

        /*
        tapText = new c.Text(tapTxt, "bold 100px Arial", "#ffffff");

        tapText.font = "bold" + " " + textSize + "px Tahoma";

        tapText.textAlign = "center";
        //tapText.shadow = new c.Shadow("rgba(0,0,0,1)",1,1,1);
        tapText.alpha = 1;
        //tapText.x = (widthInWidth/scaleFactor)*0.5;
        //TapTextSizerPlacer(tapText, topMid, 40, "bold")

        cl("tapText.getMeasuredWidth = " + tapText.getMeasuredWidth());


        if(tapText.getMeasuredWidth() / widthInWidth >= 1.01)
        {
        	var ratioTap = tapText.getMeasuredWidth()/widthInWidth;
        	cl("text bigger: ratioTap= "+ratioTap)
        }
        else{
        	var ratioTap = widthInWidth/tapText.getMeasuredWidth();
        	cl("text smaller: ratioTap= "+ratioTap)
        }


        while(tapText.getMeasuredWidth() > widthReal/scaleFactor*0.75)
        {
        	tapText.font = "bold" + " " + textSize + "px Tahoma";
        		cl("tapText.getMeasuredWidth = " + tapText.getMeasuredWidth());
        	textSize--;
        }

        cl("textSize = " + textSize);
        //tapText.scaleX = tapText.scaleY = ratioTap;


        tapText.y = topLeftOffsetY;

        tapTextStroke = tapText.clone();
        tapTextStroke.outline = 4;
        tapTextStroke.color = "#253453";
        //tapText.scaleX = tapText.scaleY = scaleFactor;

        topMid.addChild(tapTextStroke);
        topMid.addChild(tapText);

         */

      }

      function cursorShow(posX, posY) {
        cursor.currX = posX;
        cursor.currY = posY;

        cursor.x = cursor.currX;
        cursor.y = cursor.currY;

      }


      // POP UP WINDOWS =========================
      function popUpInit() {

        blackSq = new lib.BlackSq();
        blackSq.alpha = 0;
        popupContainer.addChild(blackSq);

        PopUpShadingRepos();

        popUp = new lib.PopUp();
        popUp.name = "popUp";
        popUp.show = false; // popUp status

        popUp.stageTxt.text = LocalizedStrings.uiTxt.popUpTxt.stageTxt[userLang];
        popUp.levelTxt.text = LocalizedStrings.uiTxt.popUpTxt.levelTxt[userLang];
        popUp.speedTxt.text = LocalizedStrings.uiTxt.popUpTxt.speedTxt[userLang];
        popUp.milkingMachineTxt.text = LocalizedStrings.uiTxt.popUpTxt.milkingMachineTxt[userLang];

        popUp.popUpBtn.on("click", LevelUpClick);

        popUp.alpha = 0;
        popupContainer.addChild(popUp);
        cl("PopUp Init");

      }

      function PopUpShadingRepos() {
        var blckSqBounds = blackSq.getBounds();
        blackSq.regX = blackSq.regY = blckSqBounds.width * 0.5;
        blackSq.scaleX = 1.1 * widthInWidth / blckSqBounds.width;
        blackSq.scaleY = 1.1 * heightInHeight / blckSqBounds.height;
      }

      function LevelUpClick(e) {
        CowGenerator(2, floorsArray[0]);
        separator.dugPoint2.alpha = 1;
        separator.dugPoint3.alpha = 1;
        separator.o.currentAmount = 0;
        separator.o.capacity = milkCapacity * 3;
        lift.o.capacity = milkCapacity * 3;

        coinsCurrent -= 288;

        var t1 = setInterval(function() {
          clearInterval(t1);
          InitButtonUnlock(floorsArray[1]);
          floorsArray[1].textObj.alpha = 0;
          floorsArray[1].textStroke.alpha = 0;

          if (gameOrient == "Horizontal") {
            var bound = floorsArray[1].getBounds();
            var offsetContainerY = 0
            if (topLeft.y < 0) // check if topLeft container not in the Y=0
            {
              offsetContainerY = Math.abs(topLeft.y);
            }

            if (floorsArray[1].y * scaleFactor > heightInHeight) {

              offsetY = floorsArray[1].y * scaleFactor - heightInHeight + bound.height;
              objectMoveY(topLeft, (topLeft.y - offsetY))
              //cl("================  more than heightInHeight")
            } else {
              //cl(heightInHeight +"-"+floorsArray[1].y*scaleFactor+"+"+bound.height+"="+(heightInHeight-floorsArray[1].y+ bound.height));

              offsetY = heightInHeight - floorsArray[1].y * scaleFactor + bound.height;
              objectMoveY(topLeft, (topLeft.y + offsetY))
              //cl("================  less than heightInHeight")
            }
          }
        }, 7000);

        popUpHide();
      }

      function popUpRemove() {
        popupContainer.removeChild(popUp);
        //cursorRemove();
      }

      function popUpPos() {


        //cl("popUpPos: ");
        if (popUp) {
          PopUpShadingRepos();
          if (gameOrient == "Horizontal") {
            popUp.scaleX = popUp.scaleY = 0.75 //1/multypl;
          } else {
            popUp.scaleX = popUp.scaleY = 1;
          }

          //var loc = scenesAll[sceneNames[sceneNum]].popUpLoc;
          //cl("sceneNames[sceneNum] = " + sceneNames[sceneNum]);
          //popUp.x = loc.x * xRatioIn;
          //popUp.y = loc.y * yRatioIn;
          //cl("loc.x = "+ loc.x +"; loc.y = "+ loc.y);
        }
      }

      function popUpShow() {

        objectAlpha(blackSq, 1);
        objectMoveAlpha(popUp, popUp.x, popUp.y, 1);
      }

      function popUpShowTutor(sceneNumber, someText) {
        popUpText.text = someText;
        //cl("Text size = " +  popUpText.getMeasuredHeight());
        TextSizerPlacer(popUpText, popUp.textLoc, 25, "bold");
        objectAlphaSpeed(popUp, 1, 300);
        popupContainer.setChildIndex(popUp, th.getNumChildren() - 1);
        popUpPos();
      }

      function popUpHide() {

        objectAlpha(blackSq, 0);
        objectMoveAlpha(popUp, popUp.x, popUp.y, 0);

      }

      //END POP UP WINDOWS =========================

      function objectMoveAlpha(obj, varX, varY, alphaVal) {

        c.Tween.get(obj, {
          override: true
        }).to({
          x: varX,
          y: varY,
          alpha: alphaVal
        }, 750, c.Ease.backOut)
        /*.call(
        		function()
        		{
        			obj.move = false;
        		}
        	);
        */
      }

      function priceMoveAlpha(obj, varX, varY, alphaVal) {
        c.Tween.get(obj, {
            override: true
          }).to({
            x: varX,
            y: varY,
            alpha: alphaVal
          }, 750, c.Ease.backOut)
          .call(
            function() {
              var t1 = setInterval(function() {
                clearInterval(t1);
                objectAlpha(obj, 0);
              }, 500);
            }
          );

      }

      function objectAlpha(obj, alphaVar) {
        c.Tween.get(obj, {
          override: true
        }).to({
          alpha: alphaVar
        }, speed, c.Ease.quadraticOut);
      }

      function objectMoveY(obj, varY) {
        c.Tween.get(obj, {
          override: true
        }).to({
          y: varY,
          alpha: 1
        }, speed, c.Ease.backOut).call(function() {
          obj.move = false;
        });
      }


      // объект мигает
      function objBlink(obj) {

        obj.alpha = 1;
        objScaleUp(obj);
      }

      // уменьшение объекта
      function objScaleUp(obj) {
        c.Tween.get(obj, {
          override: true
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, c.Ease.backIn).call(
          function() {
            var t1 = setInterval(function() {
              clearInterval(t1);
              objScaleDown(obj);
            }, 100);
          }
        );
      }

      // увеличение объекта
      function objScaleDown(obj) {
        c.Tween.get(obj, {
          override: true
        }).to({
          scaleX: 1,
          scaleY: 1
        }, 300, c.Ease.backIn).call(
          function() {
            obj.alpha = 0;
            obj.startBlink = false;
          });
      }




      // FORMAT TEXT
      function TextSizerPlacer(txtSrc, textLoc, textSizeSrc, fontWeight, oneWord) {
        var textParams = textLoc.getBounds();
        txtSrc.y = textLoc.y;

        var textSize = textSizeSrc;
        var lineHeight = textSize * 1.15;
        var ratioHeight = textSize / lineHeight;

        txtSrc.font = fontWeight + " " + textSize + "px Tahoma";
        txtSrc.lineWidth = textParams.width;
        txtSrc.lineHeight = lineHeight;

        var textHeight = txtSrc.getMeasuredHeight();
        var textWidth = txtSrc.getMeasuredWidth();

        if (oneWord) {
          while (textWidth > textParams.width) {
            txtSrc.font = fontWeight + " " + textSize + "px Tahoma";
            //txtSrc.lineWidth = textSize / ratioHeight;
            textWidth = txtSrc.getMeasuredWidth();
            textSize--;
            txtSrc.y = textParams.height * 0.5;
          }
        } else {
          while (textHeight > textParams.height) {
            txtSrc.font = fontWeight + " " + textSize + "px Tahoma";
            txtSrc.lineHeight = textSize / ratioHeight;
            textHeight = txtSrc.getMeasuredHeight();
            textSize--;
          }
        }


        txtSrc.y = textLoc.y + (textParams.height - textHeight) * 0.5;
        txtSrc.x = textLoc.x + textParams.width * 0.5;
      }

      function TapTextSizerPlacer(txtSrc, textLoc, textSizeSrc, fontWeight, oneWord) {
        var textParams = textLoc.getBounds();
        txtSrc.y = textLoc.y;

        var textSize = textSizeSrc;
        var lineHeight = textSize * 1.15;
        var ratioHeight = textSize / lineHeight;

        txtSrc.font = fontWeight + " " + textSize + "px Tahoma";
        txtSrc.lineWidth = textParams.width;
        txtSrc.lineHeight = lineHeight;

        var textHeight = txtSrc.getMeasuredHeight();
        var textWidth = txtSrc.getMeasuredWidth();

        if (oneWord) {
          while (textWidth > textParams.width) {
            txtSrc.font = fontWeight + " " + textSize + "px Tahoma";
            //txtSrc.lineWidth = textSize / ratioHeight;
            textWidth = txtSrc.getMeasuredWidth();
            textSize--;
            txtSrc.y = textParams.height * 0.5;
          }
        } else {
          while (textHeight > textParams.height) {
            txtSrc.font = fontWeight + " " + textSize + "px Tahoma";
            txtSrc.lineHeight = textSize / ratioHeight;
            textHeight = txtSrc.getMeasuredHeight();
            textSize--;
          }
        }


        txtSrc.y = -(textParams.height - textHeight) * 0.5;


        //txtSrc.x = textLoc.x + textParams.width// * 0.5;
      }


      // GAME OVER



      function finalWindowDraw() {
        if (popupContainer.getChildByName("finalWin")) {
          if (gameOrient == "Horizontal") {
            finalWindow.scaleX = finalWindow.scaleY = 0.75 //1/multypl;
          } else {
            finalWindow.scaleX = finalWindow.scaleY = 1;
          }
        }
      }

      function finalWindow_init() {

        finalWindow = new lib.FinalPopUp();
        finalWindow.gotoAndStop(currentVar.cowUnlock);
        finalWindow.name = "finalWin";
        finalWindow.ready = true;

        finalWindow.x = 0;
        finalWindow.y = 0;

        finalWindow.congratTxt.text = LocalizedStrings.uiTxt.FinalTxt.congratTxt[userLang];
        var txtSrc = finalWindow.congratTxt;
        var textLoc = finalWindow.congratLoc;
        var oneWord = true;
        TextSizerPlacer(txtSrc, textLoc, 25, "bold", oneWord);

        finalWindow.discoverTxt.text = LocalizedStrings.uiTxt.FinalTxt.discoverTxt[userLang];
        var txtSrc = finalWindow.discoverTxt;
        var textLoc = finalWindow.discoverLoc;
        TextSizerPlacer(txtSrc, textLoc, 20, "bold", false);

        //finalWindow.btn.on("click", function () {
        finalWindow.on("click", function() {
          if (platformType == "appreciate") {
            try {
              Appreciate.inAdEvent("Continue playing");
            } catch (e) {}
            cl("Continue playing");
          }
          downloadGame();
        });


        finalWindow.alpha = 0;


        finalWindow.btn.btnText.text = LocalizedStrings.uiTxt.FinalTxt.btnTxt[userLang];
        txtSrc = finalWindow.btn.btnText;
        textLoc = finalWindow.btn.textLoc;
        TextSizerPlacer(txtSrc, textLoc, 17, "bold");

        logo.alpha = 0;
        installButton.alpha = 0;


        popupContainer.addChild(finalWindow);
        objectMoveAlpha(blackSq, blackSq.x, blackSq.y, 1);
        objectAlpha(finalWindow, 1);

        if (platformType == "appreciate") {
          try {
            Appreciate.inAdEvent("End card");
          } catch (e) {}
        }
        if (platformType == "tapjoy") {
          try {
            window.TJ_API && window.TJ_API.playableFinished();
          } catch (e) {}
        }
      }



      function cleanUp() {
        for (i = 0; i < cowArr.length; i++) {
          var cow = cowArr[i];
          cow.off("click", cow._funcClick);
          topLeft.removeChild(cow);
        }

        clearInterval(bankTimer);
        for (i = 0; i < carArr.length; i++) {
          var car = carArr[i];
          car.off("click", car._funcClick);
          topLeft2.removeChild(car);
        }
        //installButton.off("click", installButton._funcClick);
        //installButton.removeEventListener("click", installButton._funcClick);
        //RemoveFloorClicks();
        cl("cleanUp: was finished");
        endGame();
      }

      function endGame() {
        //th.off("tick", ticker);
        MainTickerOFF();
        finalWindow_init();
      }


      //////////////////////////////////////////////////////////
      //TEST SYSTEM
      //////////////////////////////////////////////////////////
      function cl(someText) {
        if (test && someText) {
          console.log(someText);
        }
      }

      function serviceInfo() {
        if (!test) {
          for (var i = 0; i < layout.length; i++) {
            if (layout[i].serviceInfo) {
              layout[i].serviceInfo.alpha = 0;
            }
          }
        }

      }

      //////////////////////////////////////////////////////////
      //END TEST SYSTEM
      //////////////////////////////////////////////////////////


      Init();
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

    // main
    this.main = new lib.main_mc();
    this.main.parent = this;
    this.main.setTransform(240, 240);

    this.timeline.addTween(cjs.Tween.get(this.main).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-1520.5, 130, 2370.5, 601.9);


}

window.ss = {};
window.images = {};
window.lib = {};
window.cjs = {};
window.stage = stage = {};

var adWidth = 320,
  adHeight = 480;
var stageRatioW = stageRatioH = 1;
var stageRatioWBefore = stageRatioHBefore = 1;

var screenSize, screenWidth, screenHeight;

var canvas, exportRoot;
var myAtlas = new Image();
var pRatio, sRatio;
var resizeCanvasFlag = false;

var isVertical;

function initCanvas() {
  canvas = document.getElementById("canvas");
  createjs.MotionGuidePlugin.install();
  images = images || {};
  ss = ss || {};

  myAtlas.onload = handleComplete;

  myAtlas.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAYAAAC7gW9qAAAJY0lEQVR4nO2dvY8kRxnGf9Vd/THdPTO3Wt36TjhB55AAuBzJEgEBsmwCQEKkRhAQOSGFPwAhMgIkIANkGwdIOLSQLCFsYz4izhhZ9unO3p2d3envrq4imKm6XcvnD+y7mqAfabW7s73zvvX0W8/71NsrrQC4cfOpnwkhvogvGHPn1ivPfctHaAkghPiiQHzFRwIABt7yFTvwFXhfMBHgOwHfmAjwnYBvTAT4TsA3JgJ8J+AbEwG+E/CNiQDfCfjGRIDvBHxjIsB3Ar4xEeA7Ad+YCPCdgG9MBPhOwDcmAnwn4BsTAb4T8I2JAN8J+MZEgO8EfGMiwHcCvjER4DsB35gI8J2Ab0wE+E7ANyYCfCfgGxMBvhPwjYkA3wn4xkSA7wR8YyLAdwK+MREAgCHcizw8Bv6CrwR2uO4r8LQFfCfgGxMBvhPwjYkA3wn4xkSA7wR8YyLAdwK+MRHgOwHfmAjYfjKD3zQYfQXeESA6XwnsoHwFtlvgrq8EtjBrX5F3EyHzN18JbOPzb1+hA4DRjL/ylcAOf/AVOAB487UXXjLGeNEBYwwbVf3CR2y42AYNL3rK4fW7f3+x8hT7HgGqa582xjz8DLT5/sMPeg+OgP/+6493wPzuYQY3mL/eeu25lx9mzPfjkhO8dfaP7xpjNg8lsjFqbNXXH0qsD8FlK3zrVjcq/VXzgPeCMQZj9Hfe/OcLnv3HB5wF3nz9+b9g9LcfLAfmR7deff63DzDAx4a43w9u3HzySUHweyHEZ/bYzBiD0fzwjdee/fln9Z6fFvclAODGl594LBDyJYT41I+ujNHnaL7mW/Tejw8lwOLGzW/8RMAzQoj0E0cwRmnDL9949dkf4PHUdz98LAJ2CB/70lPPEIingc8LIe77uzv9eAfMb9q7d3789tsvN5820QeFT0LAJdy4+cTjEDwujPgcgkODOBWYu9rw5/+8+taf4BXfM4YJEyZ8NMThN79nALTWFEXB+fk5UkrGcSSKIpTSAIRhiFKKMAxJ05RhGNw1Ukr6vscYQxRFVFVF13VkWUbXdUgpWS6X3LlzB2MMR0dHvPPrn/7f+vNZQmZZxjAMGGMYxxFjDEptR3Rd13F0dI1hGNBaU5YldV27Rc3nc/q+Z71e0zQNWZYRxzFBECCEQEpJnufu+qIoUEoRBPszjJbDMNB1HUmSuDsMEEURZVly+/ZtjDHMZjNgWwnjOKK1puvuzVCklERR5BY/jiNVVSGEYLPZEASBq6KyLL0s9oMg67qmqqpL5SqEIEkStNYIIWxfJ45j0jRlHEfquqaua6SUJElCmqYYY6iqir7v0VpT1zVFUWAtQ5IkrtL2BTLPc7TWBEGA1hpjjLtbSZKwXB7Q9z3jONK2rVvwbDZDa02apoRhSBAE9H3PMAzkec6VK1cwxtD3vdOIYRgYhv2yB1IIQZqmCCHcwm0JCyFomgZjjHtNKeWqQgjBMAyuxKMoukSirYgoipzO2C2yL5Bt27qFxHEMbK1sWZa7hfZO+QGGYXB3MwgCFosFAEIIpx+2muq6JgxDiqKg73sAsixDa82Zh8V+EORyuQRgvV4jhEAp5XSgKAqapnN7WmuNUsp9HcfxJXK6rmMYBoqicIInhEBrTVVt555SSrzMHu8DeXp6xjiOpGlK1/U7AmKkjFmvzxmGASEEdV2TJAl5nrsSllKyWh2jlHLtL01jjBkpy4r5fKsvp6cnXLt2jdu3b7vr9wVys9mQJIkzNOM4EgQBSimGYSBNU7c4e03X3auKJElIksQZIyt8xhiyLKNtW9f37XsNw7A/WyDPc6SUKKVcX4+iiDiO3X4FLv3cXpPnOeO41YKTkxN3rdWIzWbjSG3bdhtw9/2+QGZZRhiGrtStgGmtCcOQuq6Josj1elsddpGnpyfM53NXIVEUYYxx7dGS0nWd8wB7RUBZlkgp3YKtAbJtSwjhShq2TtAYQ13X2zu72ZCmqRO+YRgIw5DZbEbfbzXFlv5Fp7gvkMMwoJRiHEdms5lTeSklQRBweHjoFts0jTNCeZ6zWCwIAtxd7/veucmqqlitViwWC/detrr2CTLPcwBXtn3fO/NifTxAURRuIQCbzYa6rsmyjKZpXGlLKQnDkK7riKLInRj7vr/kNvcFMo5jd1cuHnRsZ6jrGiEEcRw7S2y1Yvta676+eNILw5BHH32U9XqNlJK6rt3C9+o0qLVms9lQFIXbv0VREMcxZ2dnJEnilLtpGoQQlyxyGIY0TUMcxywWC05PT0nTFCljVqs1BqjqljDcdpY8z1mtVr7X7RBc9OdWnaWUSCkBXM+3GmGPz4vFwlloWxFW5ZumQSmFMcZdv30cdu9jX2D/z5AbhFiDA9vjrxU1uy3SNEUpxXw+d6LYNA193yOE4MqVK+5QdX5+zvXr1zk+PsYYw/n5uSNmXyDtIgHXquwByR554zimbVuapnGvKaWcUOZ5TpIkTgesOFoRtAIbBIGroofzCPqjIdu2dQsSQmCNURiG7ixvy9y6uTiOqarKeYYgCNwEqGka1zatVvR9v5svqv0zQlVVkec5URSxXq9p29ad8KyJaZqGPM8xxjghtI4QoG1bjDFuQGLbpXWC1iDZc8E+bYHAGhvb9qzzs6IH94yOtbr2tYs9PcsyZ3asiB4cHHB6eooxxnWJxWLh5g77ADmOI6vVijiOSZKE+XzOer120x+lFLPZjLOzM8IwxE6R7WDk6tWrnJyc0LYtZVkSxzFSSsqydDphtcFuoX06Dge2ndmWtl5v/2hzPp+jtWZ1/C7Hx+9SludEUcgwdEgZEIaCg4MlTdM47390dMQ4jm7KHMcxi/mcSEoEMC8Kmrom2rXYfYC0ZW3L3wqXFcerjzxCkiRuIGpV3h5xwzByd/qi07Nub71eO2GNoogsy0iSxOeaL0HWde2MSxRFpGmK1tp5d6veXdexWq2cQVoulzur3DqzBLitZOcBdlZoR+mwZ1bYPhCxDs2q9ziOu33eMpvNyPOcOI5ZLpfueYAt/yzL3Pnf3unNZuMejCilqKrKWWc7PN0HyGEY3BC0bVtnW22SUm7vVt/37sMeocuyZD5fOuHbbDaUZemeGxweHtK27aUhycXtsQ+QVVUhpbw02dVak2UZUkoWi4K2bXnvvfcYd9vF3vXZbMbx8fHuAcrSLazrOmerDw4OaNuWuq6drthYEyZMmDBhwoQJEyZM8Ib/AX+hpC4vok4cAAAAAElFTkSuQmCC";

  myAtlas.name = "GameEngine_atlas_";


}

function handleFileLoad(evt) {
  if (evt.item.type == "image") {
    images[evt.item.id] = evt.result;
  }
}

function handleComplete() {
  //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
  var lib = window.lib;
  var ssMetadata = lib.ssMetadata;
  // comment if don't have base64 code for image
  ss[myAtlas.name] = new createjs.SpriteSheet({
    "images": [myAtlas],
    "frames": ssMetadata[0].frames
  });

  // uncomment if don't have base64 code for image
  //ss[ssMetadata.name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata.name)], "frames": ssMetadata.frames} )

  canvas.style.display = 'block';

  exportRoot = new lib.GameEngine();
  stage = new createjs.Stage(canvas);
  stage.addChild(exportRoot);

  //Registers the "tick" event listener.
  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener("tick", stage);
  //createjs.Ticker.addEventListener("tick", stageResize);

}
var stageInterval = setInterval(stageResize, 100);

var resizeInt;
var isResp = true;
var respDim = 'both';
var isScale = true;
var scaleType = 1;
var prevWidth = 0;

function stageResize() {

  var currentWidth = mraid.getMaxSize().width;

  if (currentWidth != prevWidth) {
    prevWidth = currentWidth;
    resizeCanvas();
  }
}



function resizeCanvas() {

  resizeCanvasFlag = true;

  if (lib.properties) {
    lib.properties.width = mraid.getMaxSize().width;
    lib.properties.height = mraid.getMaxSize().height;
  }

  isVertical = true;

  var w = mraid.getMaxSize().width,
    h = mraid.getMaxSize().height;
  var iw = window.innerWidth,
    ih = window.innerHeight;
  pRatio = window.devicePixelRatio, xRatio = iw / w, yRatio = ih / h, sRatio = 1;

  if (isResp) {
    if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
      sRatio = lastS;
    } else if (!isScale) {
      if (iw < w || ih < h)
        sRatio = Math.min(xRatio, yRatio);
    } else if (scaleType == 1) {
      sRatio = Math.min(xRatio, yRatio);
    } else if (scaleType == 2) {
      sRatio = Math.max(xRatio, yRatio);
    }
  }

  if (canvas) {
    canvas.width = w * pRatio * sRatio;
    canvas.height = h * pRatio * sRatio;

    canvas.style.width = w * sRatio + 'px';
    canvas.style.height = h * sRatio + 'px';
  }


  stage.scaleX = pRatio * sRatio;
  stage.scaleY = pRatio * sRatio;

  lastW = iw;
  lastH = ih;
  lastS = sRatio;

}



function displayAd() {
  InitGameCanvas(window.lib, window.images, window.createjs, window.ss);
  initCanvas();
  resizeCanvas();
  var resizeCanvasInterval = setInterval(
    function() {
      clearInterval(resizeCanvasInterval);
      resizeCanvas();
    }, 350);

}

function checkViewable() {
  if (!mraid.isViewable()) {
    mraid.addEventListener("viewableChange", isInterstitialDisplayed);
  } else {
    displayAd();
  }
}

function isInterstitialDisplayed(displayed) {
  if (displayed) {
    mraid.removeEventListener("viewableChange", isInterstitialDisplayed);
    displayAd();
  }
}


function init() {
  if (typeof createjs !== 'undefined') {
    clearInterval(bootstrapInterval);

    if (typeof mraid !== 'undefined') {
      //console.log("here");
      if (mraid.getState() === 'loading') {
        mraid.addEventListener('ready', checkViewable);
      } else if (mraid.getState() === 'default') {
        checkViewable();
      }
    }
  } else {
    console.log('not yet');
  }
}

var bootstrapInterval = setInterval(init, 100);
