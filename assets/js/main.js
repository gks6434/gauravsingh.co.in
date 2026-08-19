/* Reveal-on-scroll — respects prefers-reduced-motion via the CSS. */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach(function (el, i) {
    // Stagger within each group of siblings, capped so nothing waits too long.
    var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', Math.min(sibs, 5) * 70 + 'ms');
    io.observe(el);
  });
})();

/* Email: assembled at runtime so the plain address is never in the HTML source. */
(function () {
  var nodes = document.querySelectorAll('[data-email]');
  if (!nodes.length) return;

  function address(el) {
    return el.getAttribute('data-user') + '@' + el.getAttribute('data-domain');
  }

  nodes.forEach(function (el) {
    if (el.tagName === 'A') {
      el.setAttribute('href', 'mailto:' + address(el));
    }
  });

  document.querySelectorAll('.email-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.closest('[data-email]') || document.querySelector('[data-email]');
      var value = src.getAttribute('data-user') + '@' + src.getAttribute('data-domain');
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.setAttribute('data-copied', 'true');
        setTimeout(function () {
          btn.textContent = original;
          btn.removeAttribute('data-copied');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, done);
      } else {
        var t = document.createElement('textarea');
        t.value = value; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  });
})();
