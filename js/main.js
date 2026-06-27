/* ============================================================
   Premier Schools Exhibition (PSE) — interactions
   Vanilla JS, no dependencies. Progressive enhancement.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ----------------------------------------------------------
     Hero collage — dual-axis auto-scroll
  ---------------------------------------------------------- */
  function initCollage() {
    var collage = document.querySelector(".collage");
    if (!collage) return;

    var BASE = 38; // seconds for one loop at speed 1
    collage.querySelectorAll(".collage__col").forEach(function (col) {
      var speed = parseFloat(col.getAttribute("data-speed")) || 1;
      var track = col.querySelector(".collage__track");
      if (track) track.style.setProperty("--dur", (BASE / speed).toFixed(2) + "s");
    });

    var toggle = collage.querySelector(".collage__toggle");
    if (!toggle) return;

    function setPaused(paused) {
      collage.classList.toggle("is-paused", paused);
      toggle.setAttribute("aria-pressed", String(paused));
      var label = toggle.querySelector(".collage__toggle-text");
      if (label) label.textContent = paused ? "Play photo animation" : "Pause photo animation";
    }

    toggle.addEventListener("click", function () {
      setPaused(!collage.classList.contains("is-paused"));
    });

    // If the user prefers reduced motion, present it paused and hide the toggle.
    if (reduceMotion.matches) {
      setPaused(true);
      toggle.hidden = true;
    }
  }

  /* ----------------------------------------------------------
     Enquire form — accessible validation
  ---------------------------------------------------------- */
  function initEnquireForm() {
    var form = document.querySelector(".enquire__form");
    if (!form) return;

    var success = form.querySelector(".enquire__success");
    var messages = {
      "parent-name": "Please enter the parent's name.",
      "phone": "Please enter a valid phone number.",
      "grade": "Please select a grade."
    };

    function fieldWrap(el) { return el.closest(".field"); }

    function validateField(el) {
      var wrap = fieldWrap(el);
      var errEl = wrap ? wrap.querySelector(".field__error") : null;
      var valid = el.checkValidity();
      if (wrap) wrap.classList.toggle("is-invalid", !valid);
      if (errEl) errEl.textContent = valid ? "" : (messages[el.id] || "This field is required.");
      el.setAttribute("aria-invalid", String(!valid));
      return valid;
    }

    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("blur", function () { validateField(el); });
      el.addEventListener("input", function () {
        if (fieldWrap(el) && fieldWrap(el).classList.contains("is-invalid")) validateField(el);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll("input, select"));
      var allValid = true;
      var firstInvalid = null;
      fields.forEach(function (el) {
        if (!validateField(el)) { allValid = false; if (!firstInvalid) firstInvalid = el; }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        if (success) success.hidden = true;
        return;
      }

      if (success) {
        success.hidden = false;
        success.focus && success.focus();
      }
      form.reset();
      form.querySelectorAll(".field").forEach(function (w) { w.classList.remove("is-invalid"); });
    });
  }

  /* ----------------------------------------------------------
     Generic slider — scroll-snap with dots + arrows
  ---------------------------------------------------------- */
  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

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

  function initSliders() {
    document.querySelectorAll("[data-slider]").forEach(setupSlider);
  }

  /* ----------------------------------------------------------
     Header — hero ↔ scrolled state toggle
  ---------------------------------------------------------- */
  function initHeaderScroll() {
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

  /* ----------------------------------------------------------
     Boot
  ---------------------------------------------------------- */
  function init() {
    initCollage();
    initEnquireForm();
    initSliders();
    initHeaderScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
