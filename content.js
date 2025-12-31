// ===============================
// SAFE AD & POPUP REMOVAL
// ===============================
const BAD_KEYWORDS = [
  'popup', 'modal', 'overlay',
  'promo', 'banner', 'subscribe'
];

// ===============================
// REMOVE ONLY REAL AD ELEMENTS
// ===============================
function cleanDOM() {
  document.querySelectorAll('div, section, aside').forEach(el => {
    const cls = (el.className || '').toLowerCase();
    const id  = (el.id || '').toLowerCase();

    if (
      BAD_KEYWORDS.some(k => cls.includes(k) || id.includes(k)) &&
      !cls.includes('reader') &&
      !cls.includes('content')
    ) {
      el.remove();
    }
  });
}

// ===============================
// UNLOCK PAGE SAFELY
// ===============================
function unlockPage() {
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  document.body.style.pointerEvents = 'auto';
}

// ===============================
// BLOCK REDIRECT NETWORKS
// ===============================
document.addEventListener('click', e => {
  let el = e.target;

  while (el) {
    if (
      el.tagName === 'A' &&
      el.href &&
      /tsyndicate|click|redirect|affiliate/i.test(el.href)
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[AdBlock] Redirect blocked:', el.href);
      return false;
    }
    el = el.parentElement;
  }
}, true);

// ===============================
// BLOCK POPUP WINDOWS
// ===============================
(function () {
  const originalOpen = window.open;
  window.open = function () {
    console.log('[AdBlock] window.open blocked');
    return null;
  };
})();

// ===============================
// MUTATION OBSERVER (PRO LEVEL)
// ===============================
const observer = new MutationObserver(() => {
  cleanDOM();
  unlockPage();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// Initial run
cleanDOM();
unlockPage();
