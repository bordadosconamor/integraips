/* =========================================================
   INTEGRA SALUD PREVENTIVA IPS SAS — script.js
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURACIÓN — editar antes de publicar
   --------------------------------------------------------- */
var INTEGRA_CONFIG = {
  /* URL HTTPS que recibirá las solicitudes en JSON (POST).
     Vacío = el formulario NO envía datos: valida y avisa que aún no está conectado.
     Ejemplo con el receptor incluido: "api/solicitud.php" */
  formEndpoint: "",
  timeoutMs: 15000,

  /* Número de WhatsApp institucional AUTORIZADO, solo dígitos con indicativo (ej. "573001234567").
     Vacío = el botón de WhatsApp no se muestra. */
  whatsapp: "",
  whatsappMensaje: "Hola, INTEGRA IPS. Quisiera recibir información."
};

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- Menú móvil ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle[aria-controls]");
  var closeBtn = document.querySelector(".nav-close");
  var backdrop = document.querySelector(".backdrop");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var f = nav.querySelector("a"); if (f) f.focus(); }
  }
  toggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  closeBtn.addEventListener("click", function () { setNav(false); toggle.focus(); });
  backdrop.addEventListener("click", function () { setNav(false); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { if (nav.classList.contains("is-open")) setNav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 1260 && nav.classList.contains("is-open")) setNav(false); });

  /* ---------- Encabezado, volver arriba ---------- */
  var header = document.querySelector(".header");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Resaltar la sección activa en el menú ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animaciones de aparición ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rev = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add("is-visible"); }); }

  /* ---------- Pestañas de transparencia ---------- */
  var tabs = document.querySelectorAll(".tab");
  function activate(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).classList.toggle("is-active", on);
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { activate(t); });
    t.addEventListener("keydown", function (e) {
      var k = e.key, n = tabs.length;
      if (k === "ArrowDown" || k === "ArrowRight") { e.preventDefault(); activate(tabs[(i + 1) % n], true); }
      if (k === "ArrowUp" || k === "ArrowLeft") { e.preventDefault(); activate(tabs[(i - 1 + n) % n], true); }
    });
  });

  /* ---------- WhatsApp (solo si hay número autorizado) ---------- */
  var wa = (INTEGRA_CONFIG.whatsapp || "").replace(/\D/g, "");
  if (wa.length >= 10) {
    var href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(INTEGRA_CONFIG.whatsappMensaje);
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) { el.href = href; el.hidden = false; });
  }

  /* ---------- Año ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Enlaces que preseleccionan opciones del formulario ---------- */
  document.querySelectorAll("[data-linea]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = document.getElementById("linea");
      if (sel) { sel.value = a.dataset.linea; sel.dispatchEvent(new Event("change")); }
    });
  });
  document.querySelectorAll("[data-asunto]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = document.getElementById("tipo_solicitud");
      if (sel) { sel.value = a.dataset.asunto; sel.dispatchEvent(new Event("change")); }
    });
  });
})();

/* =========================================================
   Formulario de solicitud de citas
   ========================================================= */
(function () {
  "use strict";
  var form = document.getElementById("form-citas");
  if (!form) return;

  var SERVICIOS = {
    "consulta-externa": ["Medicina general", "Medicina interna", "Nefrología", "Psicología", "Psiquiatría", "Urología",
      "Toma de muestras de laboratorio", "Fisioterapia", "Fonoaudiología", "Terapia ocupacional", "Terapia respiratoria"],
    "home-care": ["Información sobre atención domiciliaria (Home Care)"],
    "extramural": ["Medicina general", "Mamografía", "Citología", "Antígeno específico de próstata (PSA)",
      "Planificación familiar", "Toma de muestras", "Educación en salud", "Enfermería"]
  };
  var RULES = {
    required: function (v) { return v.trim() !== ""; },
    email: function (v) { return v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    phone: function (v) { return v === "" || (/^[0-9 +()-]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7); },
    doc: function (v) { return v === "" || /^[0-9A-Za-z-]{4,20}$/.test(v); },
    name: function (v) { return v === "" || /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{2,60}$/.test(v); },
    future: function (v) { if (!v) return true; var d = new Date(v + "T00:00:00"), t = new Date(); t.setHours(0, 0, 0, 0); return d >= t; }
  };
  var MSG = {
    required: "Este campo es obligatorio.", email: "Escriba un correo válido.",
    phone: "Escriba un teléfono válido (mínimo 7 dígitos).", doc: "Número de documento sin puntos ni espacios.",
    name: "Use solo letras y espacios.", future: "Seleccione una fecha a partir de hoy.",
    consent: "Debe autorizar el tratamiento de datos personales para continuar."
  };

  var fields = form.querySelectorAll("input:not([name=website]), select, textarea");
  var status = form.querySelector(".form-status");
  var linea = document.getElementById("linea");
  var servicio = document.getElementById("servicio");
  var fecha = document.getElementById("fecha_preferida");

  if (fecha) { var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); fecha.min = t.toISOString().slice(0, 10); }

  linea.addEventListener("change", function () {
    var opts = SERVICIOS[linea.value] || [];
    servicio.innerHTML = '<option value="">' + (opts.length ? "Seleccione el servicio" : "Primero elija la línea de servicio") + "</option>";
    opts.forEach(function (o) { var op = document.createElement("option"); op.value = o; op.textContent = o; servicio.appendChild(op); });
    servicio.disabled = !opts.length;
    if (opts.length === 1) servicio.value = opts[0];
  });

  function wrap(el) { return el.closest(".field") || el.closest(".consent"); }
  function setErr(el, msg) {
    var w = wrap(el); if (!w) return;
    var box = (w.classList.contains("consent") ? w.parentNode : w).querySelector(".error");
    w.classList.toggle("has-error", !!msg);
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    if (box) box.textContent = msg || "";
  }
  function check(el) {
    if (el.type === "checkbox") { var ok = !el.required || el.checked; setErr(el, ok ? "" : MSG.consent); return ok; }
    if (el.disabled && !el.required) return true;
    var v = el.value || "", rules = [];
    if (el.required) rules.push("required");
    (el.dataset.validate || "").split(" ").forEach(function (r) { if (r) rules.push(r); });
    for (var i = 0; i < rules.length; i++) { if (!RULES[rules[i]](v)) { setErr(el, MSG[rules[i]]); return false; } }
    setErr(el, ""); return true;
  }
  fields.forEach(function (el) {
    el.addEventListener("blur", function () { if (el.value) check(el); });
    el.addEventListener("input", function () { var w = wrap(el); if (w && w.classList.contains("has-error")) check(el); });
    el.addEventListener("change", function () { if (el.type === "checkbox" || el.tagName === "SELECT") check(el); });
  });

  function show(type, html) {
    status.className = "form-status is-visible form-status--" + type;
    status.innerHTML = html; status.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, first = null;
    fields.forEach(function (el) { if (!check(el)) { ok = false; if (!first) first = el; } });
    if (!ok) { show("error", "Revise los campos marcados para continuar."); if (first) first.focus(); return; }

    var hp = form.querySelector("[name=website]");
    if (hp && hp.value) return; // envío automatizado: se ignora

    var endpoint = INTEGRA_CONFIG.formEndpoint;
    if (!endpoint) {
      /* No se simula el envío: no existe servidor conectado. */
      show("info",
        "<strong>Formulario aún no conectado.</strong> Sus datos son válidos, pero este formulario todavía no está vinculado al sistema de recepción de solicitudes de la IPS, por lo que <strong>no se ha enviado ninguna información</strong>. " +
        "Para solicitar su cita comuníquese al <a href=\"tel:+573187115939\">318 711 5939</a> o al <a href=\"tel:+573023288937\">302 328 8937</a>, " +
        "o escriba a <a href=\"mailto:grupointegraipsas@gmail.com\">grupointegraipsas@gmail.com</a>.");
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
    delete data.website;
    data.formulario = "citas";
    data.enviado = new Date().toISOString();

    var btn = form.querySelector("[type=submit]"), label = btn.innerHTML;
    btn.disabled = true; btn.textContent = "Enviando…";
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, INTEGRA_CONFIG.timeoutMs) : null;

    fetch(endpoint, {
      method: "POST", credentials: "same-origin",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data), signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      form.reset(); linea.dispatchEvent(new Event("change"));
      show("ok", "<strong>Solicitud recibida.</strong> Nuestro equipo se comunicará con usted para confirmar disponibilidad. Esta solicitud no constituye una cita asignada.");
    }).catch(function () {
      show("error", "No fue posible enviar la solicitud. Intente nuevamente o comuníquese al <a href=\"tel:+573187115939\">318 711 5939</a>.");
    }).then(function () {
      if (timer) clearTimeout(timer);
      btn.disabled = false; btn.innerHTML = label;
    });
  });
})();
