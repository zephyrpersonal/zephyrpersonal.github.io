(function() {
	var meta = document.createElement('meta')
	meta.name = "viewport"
	if (/Android (\d+\.\d+)/.test(navigator.userAgent)) {
		var version = parseFloat(RegExp.$1);
		if (version > 2.3) {
			var phoneScale = parseInt(window.screen.width) / 640;
			meta.content = "width=640, minimum-scale = " + phoneScale + ", maximum-scale = " + phoneScale + ", target-densitydpi=device-dpi"
		} else {
			meta.content = "width=640, target-densitydpi=device-dpi"
		}
	} else {
		meta.content = "width=640, user-scalable=no, target-densitydpi=device-dpi"
	}
	document.getElementsByTagName('head')[0].appendChild(meta)
})();

var getPrefix = (function() {

	var style = document.createElement('dummy').style,
		prefixes = 'Webkit Moz O ms Khtml'.split(' '),
		memory = {};

	return function(prop) {
		if (typeof memory[prop] === "undefined") {
			var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
				props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
			memory[prop] = null;
			for (var i in props) {
				if (style[props[i]] !== undefined) {
					memory[prop] = props[i];
					break;
				}
			}
		}
		return memory[prop];
	};
})();

var setCss = function(el, props) {
	var key, pkey;
	for (key in props) {
		if (props.hasOwnProperty(key)) {
			pkey = getPrefix(key);
			if (pkey !== null) {
				el.style[pkey] = props[key];
			}
		}
	}
	return el;
};

function addEventListeners(target, types, handler) {
	each(splitStr(types), function(type) {
		target.addEventListener(type, handler, false);
	});
}

function splitStr(str) {
	return str.trim().split(/\s+/g);
}

function each(obj, iterator, context) {
	var i;
	if (!obj) {
		return;
	}
	if (obj.forEach) {
		obj.forEach(iterator, context);
	} else if (obj.length !== undefined) {
		i = 0;
		while (i < obj.length) {
			iterator.call(context, obj[i], i, obj);
			i++;
		}
	} else {
		for (i in obj) {
			obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
		}
	}
}



! function(a) {
	"use strict";

	function b(a, b) {
		for (var c = a; c;) {
			if (c.contains(b) || c == b) return c;
			c = c.parentNode
		}
		return null
	}

	function c(a, b, c) {
		var d = i.createEvent("HTMLEvents");
		if (d.initEvent(b, !0, !0), "object" == typeof c)
			for (var e in c) d[e] = c[e];
		a.dispatchEvent(d)
	}

	function d(a, b, c, d, e, f, g, h) {
		var i = Math.atan2(h - f, g - e) - Math.atan2(d - b, c - a),
			j = Math.sqrt((Math.pow(h - f, 2) + Math.pow(g - e, 2)) / (Math.pow(d - b, 2) + Math.pow(c - a, 2))),
			k = [e - j * a * Math.cos(i) + j * b * Math.sin(i), f - j * b * Math.cos(i) - j * a * Math.sin(i)];
		return {
			rotate: i,
			scale: j,
			translate: k,
			matrix: [
				[j * Math.cos(i), -j * Math.sin(i), k[0]],
				[j * Math.sin(i), j * Math.cos(i), k[1]],
				[0, 0, 1]
			]
		}
	}

	function e(a) {
		0 === Object.keys(l).length && (j.addEventListener("touchmove", f, !1), j.addEventListener("touchend", g, !1), j.addEventListener("touchcancel", h, !1));
		for (var d = 0; d < a.changedTouches.length; d++) {
			var e = a.changedTouches[d],
				i = {};
			for (var m in e) i[m] = e[m];
			var n = {
				startTouch: i,
				startTime: Date.now(),
				status: "tapping",
				element: a.srcElement,
				pressingHandler: setTimeout(function(b) {
					return function() {
						"tapping" === n.status && (n.status = "pressing", c(b, "press", {
							touchEvent: a
						})), clearTimeout(n.pressingHandler), n.pressingHandler = null
					}
				}(a.srcElement), 500)
			};
			l[e.identifier] = n
		}
		if (2 == Object.keys(l).length) {
			var o = [];
			for (var m in l) o.push(l[m].element);
			c(b(o[0], o[1]), "dualtouchstart", {
				touches: k.call(a.touches),
				touchEvent: a
			})
		}
	}

	function f(a) {
		for (var e = 0; e < a.changedTouches.length; e++) {
			var f = a.changedTouches[e],
				g = l[f.identifier];
			if (!g) return;
			g.lastTouch || (g.lastTouch = g.startTouch), g.lastTime || (g.lastTime = g.startTime), g.velocityX || (g.velocityX = 0), g.velocityY || (g.velocityY = 0), g.duration || (g.duration = 0);
			var h = Date.now() - g.lastTime,
				i = (f.clientX - g.lastTouch.clientX) / h,
				j = (f.clientY - g.lastTouch.clientY) / h,
				k = 70;
			h > k && (h = k), g.duration + h > k && (g.duration = k - h), g.velocityX = (g.velocityX * g.duration + i * h) / (g.duration + h), g.velocityY = (g.velocityY * g.duration + j * h) / (g.duration + h), g.duration += h, g.lastTouch = {};
			for (var m in f) g.lastTouch[m] = f[m];
			g.lastTime = Date.now();
			var n = f.clientX - g.startTouch.clientX,
				o = f.clientY - g.startTouch.clientY,
				p = Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2));
			("tapping" === g.status || "pressing" === g.status) && p > 10 && (g.status = "panning", g.isVertical = !(Math.abs(n) > Math.abs(o)), c(g.element, "panstart", {
				touch: f,
				touchEvent: a,
				isVertical: g.isVertical
			}), c(g.element, (g.isVertical ? "vertical" : "horizontal") + "panstart", {
				touch: f,
				touchEvent: a
			})), "panning" === g.status && (g.panTime = Date.now(), c(g.element, "pan", {
				displacementX: n,
				displacementY: o,
				touch: f,
				touchEvent: a,
				isVertical: g.isVertical
			}), g.isVertical ? c(g.element, "verticalpan", {
				displacementY: o,
				touch: f,
				touchEvent: a
			}) : c(g.element, "horizontalpan", {
				displacementX: n,
				touch: f,
				touchEvent: a
			}))
		}
		if (2 == Object.keys(l).length) {
			for (var q, r = [], s = [], t = [], e = 0; e < a.touches.length; e++) {
				var f = a.touches[e],
					g = l[f.identifier];
				r.push([g.startTouch.clientX, g.startTouch.clientY]), s.push([f.clientX, f.clientY])
			}
			for (var m in l) t.push(l[m].element);
			q = d(r[0][0], r[0][1], r[1][0], r[1][1], s[0][0], s[0][1], s[1][0], s[1][1]), c(b(t[0], t[1]), "dualtouch", {
				transform: q,
				touches: a.touches,
				touchEvent: a
			})
		}
	}

	function g(a) {
		if (2 == Object.keys(l).length) {
			var d = [];
			for (var e in l) d.push(l[e].element);
			c(b(d[0], d[1]), "dualtouchend", {
				touches: k.call(a.touches),
				touchEvent: a
			})
		}
		for (var i = 0; i < a.changedTouches.length; i++) {
			var n = a.changedTouches[i],
				o = n.identifier,
				p = l[o];
			if (p) {
				if (p.pressingHandler && (clearTimeout(p.pressingHandler), p.pressingHandler = null), "tapping" === p.status && (p.timestamp = Date.now(), c(p.element, "tap", {
						touch: n,
						touchEvent: a
					}), m && p.timestamp - m.timestamp < 300 && c(p.element, "doubletap", {
						touch: n,
						touchEvent: a
					}), m = p), "panning" === p.status) {
					var q = Date.now(),
						r = q - p.startTime,
						s = ((n.clientX - p.startTouch.clientX) / r, (n.clientY - p.startTouch.clientY) / r, n.clientX - p.startTouch.clientX),
						t = n.clientY - p.startTouch.clientY,
						u = Math.sqrt(p.velocityY * p.velocityY + p.velocityX * p.velocityX),
						v = u > .5 && q - p.lastTime < 100,
						w = {
							duration: r,
							isflick: v,
							velocityX: p.velocityX,
							velocityY: p.velocityY,
							displacementX: s,
							displacementY: t,
							touch: n,
							touchEvent: a,
							isVertical: p.isVertical
						};
					c(p.element, "panend", w), v && (c(p.element, "flick", w), p.isVertical ? c(p.element, "verticalflick", w) : c(p.element, "horizontalflick", w))
				}
				"pressing" === p.status && c(p.element, "pressend", {
					touch: n,
					touchEvent: a
				}), delete l[o]
			}
		}
		0 === Object.keys(l).length && (j.removeEventListener("touchmove", f, !1), j.removeEventListener("touchend", g, !1), j.removeEventListener("touchcancel", h, !1))
	}

	function h(a) {
		if (2 == Object.keys(l).length) {
			var d = [];
			for (var e in l) d.push(l[e].element);
			c(b(d[0], d[1]), "dualtouchend", {
				touches: k.call(a.touches),
				touchEvent: a
			})
		}
		for (var i = 0; i < a.changedTouches.length; i++) {
			var m = a.changedTouches[i],
				n = m.identifier,
				o = l[n];
			o && (o.pressingHandler && (clearTimeout(o.pressingHandler), o.pressingHandler = null), "panning" === o.status && c(o.element, "panend", {
				touch: m,
				touchEvent: a
			}), "pressing" === o.status && c(o.element, "pressend", {
				touch: m,
				touchEvent: a
			}), delete l[n])
		}
		0 === Object.keys(l).length && (j.removeEventListener("touchmove", f, !1), j.removeEventListener("touchend", g, !1), j.removeEventListener("touchcancel", h, !1))
	}
	var i = a.document,
		j = i.documentElement,
		k = Array.prototype.slice,
		l = {},
		m = null;
	j.addEventListener("touchstart", e, !1)
}(window, window.lib || (window.lib = {}));

document.addEventListener("touchmove", function(evt){
  evt.preventDefault();
}, true);
