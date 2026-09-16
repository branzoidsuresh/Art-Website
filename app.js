(function(){
  const stage   = document.getElementById('carouselStage');
  const cards   = Array.from(stage.children);
  const count   = cards.length;

  // ----- tuning knobs -----
  let cardSpacing = 260;   // px between each card's center (matches desktop card width + gap)
  const speed      = 45;    // px per second, right -> left
  const maxAngleDeg= 42;    // rotation applied to the outermost visible cards
  const minScale   = 0.70;  // scale of the outermost visible cards
  const visibleHalfWidthFactor = 0.62; // fraction of stage half-width used to normalize angle/scale

  function setSpacingForViewport(){
    const w = window.innerWidth;
    if (w <= 575.98) cardSpacing = 150;
    else if (w <= 991.98) cardSpacing = 210;
    else cardSpacing = 280;
  }
  setSpacingForViewport();
  window.addEventListener('resize', setSpacingForViewport);

  let offset = 0;          // total px scrolled so far
  let lastTime = null;
  let paused = false;

  stage.parentElement.addEventListener('mouseenter', () => paused = true);
  stage.parentElement.addEventListener('mouseleave', () => paused = false);

  function frame(t){
    if (lastTime === null) lastTime = t;
    const dt = (t - lastTime) / 1000;
    lastTime = t;

    if (!paused){
      offset += speed * dt;
    }

    const totalWidth   = cardSpacing * count;
    const stageHalfW   = stage.clientWidth / 2 * visibleHalfWidthFactor;

    cards.forEach((card, i) => {
      // base position for this card, then wrap into a centered range
      let raw = (i * cardSpacing) - offset;
      // wrap into [-totalWidth/2, totalWidth/2)
      let x = ((raw + totalWidth/2) % totalWidth + totalWidth) % totalWidth - totalWidth/2;

      const norm   = Math.max(-1, Math.min(1, x / stageHalfW));
      const angle  = -norm * maxAngleDeg;
      const scale  = 1 - (1 - minScale) * Math.abs(norm);
      const zIndex = Math.round((1 - Math.abs(norm)) * 100);

      card.style.transform =
        `translateX(${x}px) rotateY(${angle}deg) scale(${scale})`;
      card.style.zIndex = zIndex;
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();


(function(){
    const track   = document.getElementById('marqueeTrack');
    const content = document.getElementById('marqueeContent');
    const clone   = content.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  })();