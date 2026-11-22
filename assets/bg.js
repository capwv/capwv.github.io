/* Interactive particle field: drifting dots that link up, glow near the
   cursor and gently scatter away from it. Skipped under reduced motion. */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('bgCanvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, particles = [];
  var mouse = { x: -9999, y: -9999 };
  var TEAL = '45,212,191', VIOLET = '139,92,246';

  function spawn() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.6,
      c: Math.random() < 0.7 ? TEAL : VIOLET,
      a: 0.22 + Math.random() * 0.38
    };
  }

  function sizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.round((W * H) / 15000);
    target = Math.max(34, Math.min(105, target));
    while (particles.length < target) particles.push(spawn());
    particles.length = target;
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget) { mouse.x = -9999; mouse.y = -9999; }
  });
  window.addEventListener('resize', sizeCanvas);

  var LINK = 120, MOUSE_R = 170, MAX_V = 3;

  function tick() {
    ctx.clearRect(0, 0, W, H);
    var i, j, p, dx, dy, d;
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      dx = p.x - mouse.x;
      dy = p.y - mouse.y;
      d = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_R && d > 0.01) {
        var f = (1 - d / MOUSE_R) * 0.55;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      p.vx *= 0.96;
      p.vy *= 0.96;
      if (Math.abs(p.vx) < 0.08) p.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(p.vy) < 0.08) p.vy += (Math.random() - 0.5) * 0.02;
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > MAX_V) { p.vx = p.vx / sp * MAX_V; p.vy = p.vy / sp * MAX_V; }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
    }
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      for (j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        dx = p.x - q.x;
        dy = p.y - q.y;
        d = dx * dx + dy * dy;
        if (d < LINK * LINK) {
          var o = (1 - Math.sqrt(d) / LINK) * 0.14;
          ctx.strokeStyle = 'rgba(' + p.c + ',' + o.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  sizeCanvas();
  requestAnimationFrame(tick);
})();
