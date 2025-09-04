(function(){
  const hero    = document.getElementById('hb-hero');
  const brand   = document.getElementById('hb-brand');
  const ai      = document.getElementById('hb-ai');
  const tagline = document.getElementById('hb-tagline');
  const subline = document.getElementById('hb-subline');

  function sizeBrandTo(ratio=0.96){
    const small = matchMedia('(max-width:600px)').matches;
    if(!small){ brand.style.fontSize=''; return; }
    const h = hero.getBoundingClientRect(); if(!h.width) return;
    brand.style.fontSize='';
    const cs = getComputedStyle(brand), fs = parseFloat(cs.fontSize)||1;
    const w  = brand.getBoundingClientRect().width||1;
    brand.style.fontSize = (fs * (h.width*ratio / w)) + 'px';
  }

  function alignPositions(){
    const cs = getComputedStyle(brand); const fs = parseFloat(cs.fontSize)||1;
    const text = brand.firstChild; if(!(text && text.nodeType===3)) return;
    const idxA = brand.textContent.indexOf('A'); if(idxA===-1) return;
    const rA = document.createRange(); rA.setStart(text, idxA); rA.setEnd(text, idxA+1);

    const aRect = rA.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();

    const root = getComputedStyle(document.getElementById('hero-section'));
    const aiX = (parseFloat(root.getPropertyValue('--aiOffsetX'))||0) * fs;
    const aiY = (parseFloat(root.getPropertyValue('--aiOffsetY'))||0) * fs;
    ai.style.left = (aRect.left - heroRect.left + aiX) + 'px';
    ai.style.top  = (aRect.top  - heroRect.top  + aiY) + 'px';

    const tagX = (parseFloat(root.getPropertyValue('--tagOffsetX'))||0) * fs;
    const tagY = (parseFloat(root.getPropertyValue('--tagOffsetY'))||0) * fs;
    const tagRect = tagline.getBoundingClientRect();
    tagline.style.left = (brandRect.left - heroRect.left + tagX) + 'px';
    tagline.style.top  = (brandRect.top  - heroRect.top  - tagRect.height + tagY) + 'px';

    const subX = (parseFloat(root.getPropertyValue('--subOffsetX'))||0) * fs;
    const subY = (parseFloat(root.getPropertyValue('--subOffsetY'))||0) * fs;
    subline.style.left = (brandRect.left - heroRect.left + subX) + 'px';
    subline.style.top  = (brandRect.bottom - heroRect.top + subY) + 'px';
  }

  function run(){ sizeBrandTo(0.96); alignPositions(); }

  function init(){
    run();
    hero.classList.add('show');
    setTimeout(()=>ai.classList.add('show'), 1400);
  }

  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(init); }
  else{ window.addEventListener('load', init); }

  window.addEventListener('resize', run);
  new ResizeObserver(run).observe(hero);
})();
