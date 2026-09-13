/* ARKLinks — site behaviour. Shared by / and /brewing/.
   ⚠️ 2026-09-13: moved out of inline <script> so that a Content-Security-Policy of
   script-src 'self' can be enforced (no 'unsafe-inline', no inline onclick=).
   Every feature below checks that its elements exist, so the same file serves both pages. */
(function () {
  'use strict';

  /* ══════════ CHECKOUT DESTINATION ══════════
     ⭐ THIS IS THE ONLY LINE TO EDIT IF THE SHOPIFY PRODUCT URL CHANGES.
     While it is null the button goes to the founding-list form instead and the note
     under it explains how to buy. Payment is handled entirely by Shopify — this site
     never touches card details. */
  var SHOP_URL = 'https://shop.ark-links.com/products/three-japanese-teas';

  var doc = document.documentElement;

  // ── Language toggle ──
  function setLang(lang) {
    lang = lang === 'ja' ? 'ja' : 'en';
    doc.setAttribute('data-lang', lang);
    doc.setAttribute('lang', lang);                       // screen readers / translators
    var en = document.getElementById('btn-en'), ja = document.getElementById('btn-ja');
    if (en) en.classList.toggle('active', lang === 'en');
    if (ja) ja.classList.toggle('active', lang === 'ja');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = el.getAttribute(lang === 'en' ? 'data-en' : 'data-ja');
      if (text !== null) el.innerHTML = text;              // fixed, author-written strings only
    });
    try { localStorage.setItem('arklinks-lang', lang); } catch (e) {}
  }
  document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-set')); });
  });
  (function () {
    var saved = null;
    try { saved = localStorage.getItem('arklinks-lang'); } catch (e) {}
    if (saved === 'ja') setLang('ja');
  })();

  // ── Shop link + note under the price ──
  (function applyShopUrl() {
    var cta = document.getElementById('shopCta');
    if (!cta || !SHOP_URL) return;
    cta.setAttribute('href', SHOP_URL);
    cta.setAttribute('rel', 'noopener');
    var note = document.getElementById('shopNote');
    if (!note) return;
    note.setAttribute('data-en', 'Duties, taxes and shipping are paid before it leaves Japan, so nothing is owed on arrival. Payment is handled by Shopify. Allow 14–21 days — nothing is sitting in a warehouse. The first thirty orders pay $95: join the founding list below and we will send you the link.');
    note.setAttribute('data-ja', '関税・税金・送料は日本を出る前に当社がお支払いしますので、お受け取り時のご負担はありません。お支払いはShopifyが承ります。お届けまでは14〜21日ほど。在庫を置いていないためです。先着三十件は$95。下のファウンディングにご登録いただければ、リンクをお送りします。');
    note.innerHTML = note.getAttribute(doc.getAttribute('data-lang') === 'ja' ? 'data-ja' : 'data-en');
  })();

  // ── Mobile menu ──
  var menu = document.getElementById('mobileMenu');
  var burger = document.getElementById('hamburger');
  if (menu && burger) {
    function setMenu(open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
  }

  // ── Nav appearance on scroll ──
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── FAQ accordion (buttons → keyboard + screen-reader friendly) ──
  var faqButtons = document.querySelectorAll('.faq-btn');
  if (faqButtons.length) {
    function closeAll() {
      document.querySelectorAll('.faq-item').forEach(function (item) {
        item.classList.remove('active');
        var a = item.querySelector('.faq-answer'); if (a) a.style.maxHeight = null;
        var b = item.querySelector('.faq-btn'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
    faqButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var answer = item.querySelector('.faq-answer');
        var wasActive = item.classList.contains('active');
        closeAll();
        if (!wasActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // ── Reveal on scroll (staggered) ──
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('in'); }, idx * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Founding list form → Formspree (interim; swap to ESP before scaling) ──
  var form = document.getElementById('foundingForm');
  if (form) {
    var submitBtn = form.querySelector('.form-submit');
    var errorBox = document.getElementById('formError');
    var busy = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;                                    // double-submit guard
      busy = true;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }
      if (errorBox) errorBox.hidden = true;
      var fail = function () {
        busy = false;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
        if (errorBox) { errorBox.hidden = false; errorBox.focus(); }
      };
      fetch('https://formspree.io/f/xlgzdowd', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) return fail();
        form.hidden = true;
        var ok = document.getElementById('formSuccess');
        if (ok) { ok.style.display = 'block'; ok.setAttribute('tabindex', '-1'); ok.focus(); }
      }).catch(fail);
    });
  }
})();
