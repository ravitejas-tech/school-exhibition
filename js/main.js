/* ============================================================
   Premier Schools Exhibition (PSE) — interactions
   Vanilla JS, no dependencies. Progressive enhancement.

   Entry module: wires up each feature on DOM ready.
   ============================================================ */
import { initCollage } from "./modules/collage.js";
import { initEnquireForm } from "./modules/form.js";
import { initSliders } from "./modules/slider.js";
import { initHeaderScroll } from "./modules/header.js";

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
