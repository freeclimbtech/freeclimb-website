/* ============================================================
   Freeclimb — minimal single-page site
   - hero particle field (canvas, mouse-reactive)
   (the logo's wipe-up animation is pure CSS - see styles.css)
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Hero particle field ---------------- */

  function initHeroCanvas() {
    var hero = document.querySelector(".hero");
    var canvas = document.querySelector(".hero__canvas");
    if (!hero || !canvas) return;
    if (reduceMotion) return; /* body's static gradient is enough */

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var hasHover = window.matchMedia("(hover: hover)").matches;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    var PARTICLE_DENSITY = 0.00011;
    var MAX_PARTICLES = 170;
    var BG_DENSITY = 0.00004;
    var MAX_BG_PARTICLES = 80;
    var MOUSE_RADIUS = 150;
    var RETURN_SPEED = 0.06;
    var DAMPING = 0.92;
    var REPULSION = 4.4;

    var width = 0;
    var height = 0;
    var particles = [];
    var bgParticles = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var resizeTimer = null;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function seed() {
      var count = Math.min(MAX_PARTICLES, Math.floor(width * height * PARTICLE_DENSITY));
      particles = [];
      for (var i = 0; i < count; i++) {
        var x = Math.random() * width;
        var y = Math.random() * height;
        particles.push({
          x: x, y: y, originX: x, originY: y, vx: 0, vy: 0,
          size: rand(1, 2.4),
          accent: Math.random() > 0.86
        });
      }

      var bgCount = Math.min(MAX_BG_PARTICLES, Math.floor(width * height * BG_DENSITY));
      bgParticles = [];
      for (var j = 0; j < bgCount; j++) {
        bgParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: rand(0.5, 1.4),
          alpha: rand(0.08, 0.3),
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }

    function tick(time) {
      ctx.clearRect(0, 0, width, height);

      /* soft pulsing glow, upper half of the hero */
      var cx = width / 2;
      var cy = height * 0.38;
      var pulse = Math.sin(time * 0.0006) * 0.025 + 0.06;
      var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.7);
      glow.addColorStop(0, "rgba(126, 168, 255, " + pulse + ")");
      glow.addColorStop(1, "rgba(126, 168, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      /* drifting background dust */
      for (var bi = 0; bi < bgParticles.length; bi++) {
        var b = bgParticles[bi];
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0) b.x = width; else if (b.x > width) b.x = 0;
        if (b.y < 0) b.y = height; else if (b.y > height) b.y = 0;
        var twinkle = Math.sin(time * 0.0018 + b.phase) * 0.5 + 0.5;
        ctx.globalAlpha = b.alpha * (0.4 + 0.6 * twinkle);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* mouse repulsion + spring pull back to origin */
      for (var pi = 0; pi < particles.length; pi++) {
        var p = particles[pi];
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (mouse.active && dist < MOUSE_RADIUS && dist > 0.01) {
          var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx -= (dx / dist) * force * REPULSION;
          p.vy -= (dy / dist) * force * REPULSION;
        }
        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;
      }

      /* keep particles from stacking on top of each other */
      for (var a = 0; a < particles.length; a++) {
        for (var bIdx = a + 1; bIdx < particles.length; bIdx++) {
          var pa = particles[a];
          var pb = particles[bIdx];
          var ddx = pb.x - pa.x;
          var ddy = pb.y - pa.y;
          var minDist = pa.size + pb.size;
          var distSq = ddx * ddx + ddy * ddy;
          if (distSq < minDist * minDist && distSq > 0.0001) {
            var d = Math.sqrt(distSq);
            var nx = ddx / d;
            var ny = ddy / d;
            var overlap = (minDist - d) * 0.5;
            pa.x -= nx * overlap; pa.y -= ny * overlap;
            pb.x += nx * overlap; pb.y += ny * overlap;
          }
        }
      }

      /* integrate + draw */
      for (var di = 0; di < particles.length; di++) {
        var pt = particles[di];
        pt.vx *= DAMPING;
        pt.vy *= DAMPING;
        pt.x += pt.vx;
        pt.y += pt.vy;
        var speed = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy);
        var alpha = Math.min(0.45 + speed * 0.15, 1);
        ctx.fillStyle = pt.accent
          ? "rgba(126, 168, 255, " + alpha + ")"
          : "rgba(255, 255, 255, " + alpha + ")";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }

    if (hasHover) {
      hero.addEventListener("pointermove", function (e) {
        var rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      hero.addEventListener("pointerleave", function () { mouse.active = false; });
    }

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    requestAnimationFrame(tick);
  }

  /* ---------------- Boot ---------------- */

  function init() {
    initHeroCanvas();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
