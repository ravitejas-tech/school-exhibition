/* ============================================================
   Enquire form — accessible validation
   ============================================================ */

export function initEnquireForm() {
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
