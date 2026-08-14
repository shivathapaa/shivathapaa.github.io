document.documentElement.classList.add('js');

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- nav shadow + back-to-top: one passive scroll listener ----- */
  var nav = document.getElementById('mainNav');
  var backTop = document.getElementById('backTop');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    backTop.classList.toggle('vis', window.scrollY > 600);
  }, { passive: true });

  /* ----- hamburger menu ----- */
  var ham = document.getElementById('ham');
  var mob = document.getElementById('mobMenu');

  function setMenu(open) {
    ham.classList.toggle('open', open);
    mob.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', String(open));
  }

  ham.addEventListener('click', function () {
    setMenu(!mob.classList.contains('open'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mob.classList.contains('open')) {
      setMenu(false);
      ham.focus();
    }
  });

  mob.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ----- continuous ribbons: news ticker + tech marquee (skipped under reduced motion) ----- */
  function startRibbon(track, wrap, speed) {
    if (!track || !wrap || reducedMotion) return;
    var pos = 0;
    var half = track.scrollWidth / 2;
    var frame;
    function step() {
      pos += speed;
      if (pos >= half) pos = 0;
      track.style.transform = 'translateX(-' + pos + 'px)';
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    wrap.addEventListener('mouseenter', function () { cancelAnimationFrame(frame); });
    wrap.addEventListener('mouseleave', function () { frame = requestAnimationFrame(step); });
    window.addEventListener('resize', function () { half = track.scrollWidth / 2; });
  }

  startRibbon(document.getElementById('tickerTrack'), document.getElementById('tickerWrap'), .3);
  startRibbon(document.getElementById('mqInner'), document.querySelector('.mq-bar'), .6);

  /* ----- reveal on scroll (skipped entirely under reduced motion) ----- */
  if (!reducedMotion && 'IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('on'); });
  }

  /* ----- scroll-spy ----- */
  var navLinks = document.querySelectorAll('.nav-links a');
  var spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) {
    if (s.id !== 'interlude') spyObs.observe(s);
  });

  /* ----- footer year (static fallback already in HTML) ----- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Medium RSS enhancement -----
     The five hardcoded cards in the HTML are the source of truth.
     On success, prepend at most 3 newer, non-duplicate posts.
     Any failure (network, timeout, parse, empty) is a silent no-op. */
  (function () {
    var grid = document.getElementById('blogGrid');
    if (!grid || typeof AbortSignal === 'undefined' || !AbortSignal.timeout) return;

    var FEED_URL = 'https://medium.com/feed/@shivathapaa';
    var API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(FEED_URL);

    function normalize(url) {
      try {
        var u = new URL(url);
        return u.origin + u.pathname.replace(/\/$/, '');
      } catch (e) {
        return url;
      }
    }

    var known = {};
    grid.querySelectorAll('.blog-title a').forEach(function (a) {
      known[normalize(a.href)] = true;
    });

    function buildCard(item) {
      var card = document.createElement('article');
      card.className = 'blog-card';

      if (item.thumb) {
        var img = document.createElement('img');
        img.className = 'blog-thumb';
        img.src = item.thumb;
        img.alt = '';
        img.width = 800;
        img.height = 420;
        img.loading = 'lazy';
        img.addEventListener('error', function () { img.remove(); });
        card.appendChild(img);
      }

      var h3 = document.createElement('h3');
      h3.className = 'blog-title';
      var a = document.createElement('a');
      a.href = item.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = item.title;
      h3.appendChild(a);
      card.appendChild(h3);

      if (item.date) {
        var p = document.createElement('p');
        p.className = 'blog-desc';
        p.textContent = item.date;
        card.appendChild(p);
      }

      var chip = document.createElement('span');
      chip.className = 'blog-chip';
      chip.textContent = 'New on Medium';
      card.appendChild(chip);

      return card;
    }

    fetch(API_URL, { signal: AbortSignal.timeout(6000) })
      .then(function (r) {
        if (!r.ok) throw new Error('bad status');
        return r.json();
      })
      .then(function (data) {
        if (!data || data.status !== 'ok' || !Array.isArray(data.items)) return;

        var fresh = [];
        data.items.forEach(function (item) {
          if (fresh.length >= 3) return;
          if (!item.link || !item.title) return;
          var link = normalize(item.link);
          if (!link || known[link]) return;

          var date = '';
          if (item.pubDate) {
            var d = new Date(item.pubDate.replace(' ', 'T') + 'Z');
            if (!isNaN(d)) {
              date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            }
          }

          var thumb = item.thumbnail || null;
          if (!thumb) {
            var m = (item.content || item.description || '').match(/<img[^>]+src="(https:\/\/[^"]+)"/);
            if (m) thumb = m[1];
          }

          known[link] = true;
          fresh.push({ title: item.title.trim(), link: link, date: date, thumb: thumb });
        });

        for (var i = fresh.length - 1; i >= 0; i--) {
          grid.insertBefore(buildCard(fresh[i]), grid.firstChild);
        }
      })
      .catch(function () { /* silent no-op: static cards already render */ });
  })();
})();
