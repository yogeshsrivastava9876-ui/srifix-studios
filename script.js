// ============================================================
// SRIFIX STUDIOS — Global Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const pre = document.querySelector('.preloader');
  if (pre){
    window.addEventListener('load', () => {
      setTimeout(() => pre.classList.add('hide'), 1500);
    });
    // fallback in case load already fired
    setTimeout(() => pre.classList.add('hide'), 2400);
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  if (nav){
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu){
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Cursor glow ---------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, { passive:true });
  }

  /* ---------- Aurora parallax on mouse ---------- */
  const aurora = document.querySelector('.aurora');
  if (aurora && window.matchMedia('(pointer:fine)').matches){
    const spans = aurora.querySelectorAll('span');
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      spans.forEach((s, i) => {
        const depth = (i + 1) * 10;
        s.style.marginLeft = `${x * depth}px`;
        s.style.marginTop = `${y * depth}px`;
      });
    }, { passive:true });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter[data-count]');
  if (counters.length && 'IntersectionObserver' in window){
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1600;
        const start = performance.now();
        const isFloat = target % 1 !== 0;
        function tick(now){
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- Testimonial marquee (duplicate for seamless loop) ---------- */
  const track = document.querySelector('.testi-track');
  if (track){
    track.innerHTML += track.innerHTML;
    let pos = 0;
    let paused = false;
    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);
    function loop(){
      if (!paused){
        pos -= 0.4;
        if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
        track.style.transform = `translateX(${pos}px)`;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Portfolio filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  if (filterBtns.length && workCards.length){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        workCards.forEach(card => {
          const match = f === 'all' || card.getAttribute('data-cat') === f;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Newsletter / contact / booking form feedback ---------- */
  document.querySelectorAll('form[data-fake-submit]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = 'Sent — thank you';
      btn.style.opacity = '.75';
      form.reset();
      setTimeout(() => { btn.innerHTML = original; btn.style.opacity = '1'; }, 2600);
    });
  });

  /* ---------- Simple booking calendar ---------- */
  const calGrid = document.querySelector('.cal-grid');
  if (calGrid){
    const monthLabel = document.querySelector('.cal-head h4');
    let current = new Date();
    current.setDate(1);

    function render(){
      calGrid.querySelectorAll('.cal-day').forEach(n => n.remove());
      const year = current.getFullYear();
      const month = current.getMonth();
      monthLabel.textContent = current.toLocaleDateString('en-US', { month:'long', year:'numeric' });
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date(); today.setHours(0,0,0,0);

      for (let i = 0; i < firstDay; i++){
        const blank = document.createElement('div');
        calGrid.appendChild(blank);
      }
      for (let d = 1; d <= daysInMonth; d++){
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        cell.textContent = d;
        const cellDate = new Date(year, month, d);
        if (cellDate < today || cellDate.getDay() === 0){
          cell.classList.add('disabled');
        } else {
          cell.addEventListener('click', () => {
            calGrid.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
          });
        }
        calGrid.appendChild(cell);
      }
    }
    render();
    document.querySelector('.cal-prev')?.addEventListener('click', () => {
      current.setMonth(current.getMonth() - 1);
      render();
    });
    document.querySelector('.cal-next')?.addEventListener('click', () => {
      current.setMonth(current.getMonth() + 1);
      render();
    });

    document.querySelectorAll('.slot').forEach(s => {
      s.addEventListener('click', () => {
        document.querySelectorAll('.slot').forEach(o => o.classList.remove('selected'));
        s.classList.add('selected');
      });
    });
  }

});
