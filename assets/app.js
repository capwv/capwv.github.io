(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- nav scroll state + back to top ---------- */
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    toTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- active nav link ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = links.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  if (reduceMotion) {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  } else if ('IntersectionObserver' in window) {
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cIO.unobserve(en.target);
        var target = parseInt(en.target.getAttribute('data-count'), 10);
        var dur = 1400;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          en.target.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cIO.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }

  /* ---------- projects rendered from data/projects.json ----------
     To add a project: add one object to data/projects.json. Nothing else to touch. */
  var list = document.getElementById('projectsList');
  fetch('data/projects.json')
    .then(function (r) { return r.json(); })
    .then(function (projects) {
      projects.forEach(function (p, i) {
        var num = ('0' + (i + 1)).slice(-2);
        var card = document.createElement('article');
        card.className = 'project-card reveal';

        if (p.image) {
          var imgLink = document.createElement('a');
          imgLink.className = 'project-img';
          imgLink.href = p.url;
          imgLink.target = '_blank';
          imgLink.rel = 'noopener';
          imgLink.setAttribute('aria-label', 'View ' + p.title);
          imgLink.title = 'View ' + p.title;
          var img = document.createElement('img');
          img.src = p.image;
          img.alt = p.title;
          img.loading = 'lazy';
          imgLink.appendChild(img);
          card.appendChild(imgLink);
        }

        var body = document.createElement('div');
        var idx = document.createElement('p');
        idx.className = 'project-idx';
        idx.textContent = 'PROJECT ' + num;
        body.appendChild(idx);

        var title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = p.title;
        if (p.badge) {
          var badge = document.createElement('span');
          badge.className = 'project-badge';
          badge.textContent = p.badge;
          title.appendChild(badge);
        }
        body.appendChild(title);

        var desc = document.createElement('p');
        desc.className = 'project-desc';
        desc.textContent = p.description;
        body.appendChild(desc);

        var meta = document.createElement('div');
        meta.className = 'project-meta';
        if (p.stat) {
          var stat = document.createElement('span');
          stat.className = 'project-stat';
          stat.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
          stat.appendChild(document.createTextNode(p.stat));
          meta.appendChild(stat);
        }
        var tags = document.createElement('div');
        tags.className = 'project-tags chips';
        (p.tags || []).forEach(function (t) {
          var tag = document.createElement('span');
          tag.textContent = t;
          tags.appendChild(tag);
        });
        meta.appendChild(tags);
        body.appendChild(meta);
        card.appendChild(body);

        var link = document.createElement('a');
        link.className = 'project-link';
        link.href = p.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', 'Open ' + p.title);
        link.title = 'Open ' + p.title;
        link.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>';
        card.appendChild(link);

        list.appendChild(card);
      });

      // reveal + observe the freshly added cards
      var newCards = list.querySelectorAll('.reveal');
      if (reduceMotion) {
        newCards.forEach(function (el) { el.classList.add('in'); });
      } else if ('IntersectionObserver' in window) {
        var pio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              pio.unobserve(en.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        newCards.forEach(function (el) { pio.observe(el); });
      } else {
        newCards.forEach(function (el) { el.classList.add('in'); });
      }
    })
    .catch(function () {
      list.innerHTML = '<p class="noscript-note">Projects: SAMS Compass (capwv.github.io/SAMS-Compass) and SAMS-MIS (capwv.github.io/SAMS-MIS).</p>';
    });

  /* ---------- certificates rendered from data/certificates.json ---------- */
  var certsList = document.getElementById('certsList');
  if (certsList) {
    fetch('data/certificates.json')
      .then(function (r) { return r.json(); })
      .then(function (certs) {
        certs.forEach(function (c) {
          var card = document.createElement('article');
          card.className = 'cert-card reveal';

          var a = document.createElement('a');
          a.href = c.image;
          a.target = '_blank';
          a.rel = 'noopener';
          a.setAttribute('aria-label', 'View certificate: ' + c.title);
          a.title = c.title;

          var img = document.createElement('img');
          img.src = c.image;
          img.alt = c.title + ' - ' + c.issuer;
          img.loading = 'lazy';
          a.appendChild(img);
          card.appendChild(a);

          var info = document.createElement('div');
          info.className = 'cert-info';
          var t = document.createElement('h3');
          t.className = 'cert-title';
          t.textContent = c.title;
          var m = document.createElement('p');
          m.className = 'cert-meta';
          m.textContent = c.issuer + ' · ' + c.date;
          info.appendChild(t);
          info.appendChild(m);
          card.appendChild(info);

          certsList.appendChild(card);
        });

        var newCerts = certsList.querySelectorAll('.reveal');
        if (reduceMotion) {
          newCerts.forEach(function (el) { el.classList.add('in'); });
        } else if ('IntersectionObserver' in window) {
          var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                en.target.classList.add('in');
                cio.unobserve(en.target);
              }
            });
          }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
          newCerts.forEach(function (el) { cio.observe(el); });
        } else {
          newCerts.forEach(function (el) { el.classList.add('in'); });
        }
      })
      .catch(function () {
        certsList.innerHTML = '<p class="noscript-note">Certified in Business Intelligence & Data Analysis (eyouth), Generative AI (CIB), Excel (Edraak), plus ITIDA, TIEC, Creativa and Nile University programs.</p>';
      });
  }
})();
