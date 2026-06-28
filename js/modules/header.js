/* ============================================================
   Header — hero ↔ scrolled state toggle
   ============================================================ */

export function initHeaderScroll() {
  var header = document.querySelector(".header");
  var hero = document.querySelector(".hero");
  if (!header || !hero) return;

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      // Switch when the hero's bottom edge scrolls behind the header
      header.classList.toggle("is-scrolled", heroBottom <= header.offsetHeight);
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
