/* ============================================================
   Hero collage — dual-axis auto-scroll
   ============================================================ */
import { reduceMotion } from "./utils.js";

export function initCollage() {
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
