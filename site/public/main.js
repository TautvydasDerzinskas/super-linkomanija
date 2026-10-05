// Remembers the language picked with the language switch. Until one is picked, the English home page
// sends visitors whose browser is set to Lithuanian to the Lithuanian page (see the inline script in its head).
document.querySelectorAll('[data-lang]').forEach(link => {
  link.addEventListener('click', () => {
    try {
      localStorage.setItem('sl-lang', link.dataset.lang);
    } catch {
      // Storage can be blocked, the switch still works as a plain link
    }
  });
});

// Hero particles: dots joined by lines that drift behind the hero, the same effect (and settings) as the
// popup header's tsParticles, drawn on a plain canvas so the site needs no library.
(function heroParticles() {
  const canvas = document.querySelector('.hero__particles');
  const hero = canvas?.closest('.hero');
  const ctx = canvas?.getContext('2d');
  if (!ctx) {
    return;
  }

  // Popup settings: 25 dots per 400×250 px, links up to 150 px, repulse within 100 px, a click adds 4
  const DENSITY = 25 / (400 * 250);
  const MAX_DOTS = 110;
  const LINK_DISTANCE = 150;
  const REPULSE_DISTANCE = 100;
  const PUSH_QUANTITY = 4;

  // Light: the brand red and blue over the rain photo. Dark: sky blue constellations over the night sky.
  const THEMES = {
    light: { fill: '#eb1c24', stroke: '#000000', link: '0, 121, 194', linkOpacity: 0.4 },
    dark: { fill: '#bae6fd', stroke: '#020617', link: '125, 211, 252', linkOpacity: 0.25 },
  };
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let dots = [];
  let pointer = null;
  let frame = 0;
  let lastTime = 0;
  let visible = true;

  const createDot = (x = Math.random() * width, y = Math.random() * height) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 1.6;
    return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 0.1 + Math.random() * 2.9 };
  };

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(MAX_DOTS, Math.round(width * height * DENSITY));
    dots = dots.filter(dot => dot.x <= width && dot.y <= height).slice(0, count);
    while (dots.length < count) {
      dots.push(createDot());
    }
    draw();
  };

  const move = step => {
    for (const dot of dots) {
      dot.x += dot.vx * step;
      dot.y += dot.vy * step;
      // Bounce off the hero's edges
      if (dot.x < 0 || dot.x > width) { dot.vx *= -1; dot.x = Math.max(0, Math.min(width, dot.x)); }
      if (dot.y < 0 || dot.y > height) { dot.vy *= -1; dot.y = Math.max(0, Math.min(height, dot.y)); }

      // Move away from the pointer
      if (pointer) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < REPULSE_DISTANCE) {
          const push = (1 - distance / REPULSE_DISTANCE) * 6 * step;
          dot.x += (dx / distance) * push;
          dot.y += (dy / distance) * push;
        }
      }
    }
  };

  const draw = () => {
    const theme = THEMES[darkQuery.matches ? 'dark' : 'light'];
    ctx.clearRect(0, 0, width, height);

    // Links fade out as the dots move apart
    ctx.lineWidth = 1;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const distance = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
        if (distance < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(${theme.link}, ${theme.linkOpacity * (1 - distance / LINK_DISTANCE)})`;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = theme.fill;
    ctx.strokeStyle = theme.stroke;
    for (const dot of dots) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const tick = time => {
    // Speeds are per 60 fps frame, so the motion is the same on any refresh rate
    const step = lastTime ? Math.min((time - lastTime) / (1000 / 60), 3) : 1;
    lastTime = time;
    move(step);
    draw();
    frame = requestAnimationFrame(tick);
  };

  // Animate only while the hero is on screen, the tab is visible and motion is allowed
  const update = () => {
    const animate = visible && !document.hidden && !reducedMotion.matches;
    if (animate && !frame) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    } else if (!animate && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const pointerPosition = event => {
    const rect = hero.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  hero.addEventListener('pointermove', event => { pointer = pointerPosition(event); });
  hero.addEventListener('pointerleave', () => { pointer = null; });
  hero.addEventListener('click', event => {
    if (event.target.closest('a, button')) {
      return;
    }
    const { x, y } = pointerPosition(event);
    dots.push(...Array.from({ length: PUSH_QUANTITY }, () => createDot(x, y)));
    if (dots.length > MAX_DOTS * 1.5) {
      dots.splice(0, dots.length - MAX_DOTS * 1.5);
    }
    if (!frame) {
      draw();
    }
  });

  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(hero);
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  darkQuery.addEventListener('change', () => {
    if (!frame) {
      draw();
    }
  });
})();
