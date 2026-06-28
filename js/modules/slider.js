/* ============================================================
   Generic slider — scroll-snap with dots + arrows
   ============================================================ */
import { reduceMotion, debounce } from "./utils.js";

function setupSlider(slider) {
  var track = slider.querySelector("[data-slider-track]");
  if (!track) return;
  var dotsWrap = slider.querySelector("[data-slider-dots]");
  var arrowsWrap = slider.querySelector(".slider__arrows");
  var prev = slider.querySelector("[data-slider-prev]");
  var next = slider.querySelector("[data-slider-next]");
  var slides = Array.prototype.slice.call(track.children);
  var behavior = function () { return reduceMotion.matches ? "auto" : "smooth"; };

  track.setAttribute("tabindex", "0");
  track.setAttribute("aria-roledescription", "carousel");
  if (!track.getAttribute("aria-label")) track.setAttribute("aria-label", "Slides, use arrow keys to scroll");

  var dots = [];
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    dots = slides.map(function (slide, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "slider__dot";
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", function () { scrollToSlide(i); });
      dotsWrap.appendChild(d);
      return d;
    });
  }
  function scrollToSlide(i) {
    var s = slides[i];
    if (!s) return;
    var delta = s.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + delta, behavior: behavior() });
  }
  function currentIndex() {
    var trackLeft = track.getBoundingClientRect().left;
    var best = 0, bestDist = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.getBoundingClientRect().left - trackLeft);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }
  function overflowing() { return track.scrollWidth - track.clientWidth > 4; }
  function update() {
    var over = overflowing();
    if (dotsWrap) dotsWrap.hidden = !over;
    if (arrowsWrap) arrowsWrap.hidden = !over;
    if (!over) return;
    var idx = currentIndex();
    dots.forEach(function (d, i) {
      if (i === idx) { d.setAttribute("aria-current", "true"); }
      else { d.removeAttribute("aria-current"); }
    });
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  function step(dir) {
    var first = slides[0];
    var amount = first ? first.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: behavior() });
  }
  if (prev) prev.addEventListener("click", function () { step(-1); });
  if (next) next.addEventListener("click", function () { step(1); });

  var raf;
  track.addEventListener("scroll", function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  });
  window.addEventListener("resize", debounce(function () { buildDots(); update(); }, 150));

  buildDots();
  update();
}

export function initSliders() {
  document.querySelectorAll("[data-slider]").forEach(setupSlider);
}
