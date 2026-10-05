// Social links — paste your URLs here. Empty links are hidden automatically.
const SOCIALS = {
  x: "",
  telegram: "",
};

const CA = "3UbirH5Ux3AqaK1oryGTdcKnC8GFqXMtBeyQbt3Xpump";

// ---------- Socials ----------
document.querySelectorAll("[data-social]").forEach((a) => {
  const url = SOCIALS[a.dataset.social];
  if (url) a.href = url;
  else a.remove();
});
const socialsBox = document.getElementById("socials");
if (socialsBox && !socialsBox.children.length) socialsBox.remove();

// ---------- Year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Nav ----------
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const setMenu = (open) => {
  burger.classList.toggle("open", open);
  navLinks.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
};
burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ---------- Copy CA ----------
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyCA(btn) {
  try {
    await navigator.clipboard.writeText(CA);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = CA;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  const label = btn.querySelector("span");
  btn.classList.add("copied");
  if (label) label.textContent = "Copied!";
  setTimeout(() => {
    btn.classList.remove("copied");
    if (label) label.textContent = "Copy";
  }, 1800);
  showToast("Contract address copied ⚔");
  burst(btn);
}
document.querySelectorAll("#caCopy, [data-copy]").forEach((btn) =>
  btn.addEventListener("click", () => copyCA(btn))
);

// ---------- Oath ----------
const swearBtn = document.getElementById("swearBtn");
swearBtn.addEventListener("click", () => {
  document.getElementById("sworn").hidden = false;
  swearBtn.textContent = "⚔ Sworn";
  swearBtn.disabled = true;
  burst(swearBtn, 120);
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

// ---------- Golden sparks ----------
const canvas = document.getElementById("sparks");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let W, H, DPR;
const sparks = [];
const bursts = [];

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = window.innerWidth * DPR;
  H = canvas.height = window.innerHeight * DPR;
}
window.addEventListener("resize", resize);
resize();

function makeSpark(initial) {
  return {
    x: Math.random() * W,
    y: initial ? Math.random() * H : H + 10,
    r: (Math.random() * 1.6 + 0.4) * DPR,
    vy: -(Math.random() * 0.35 + 0.1) * DPR,
    vx: (Math.random() - 0.5) * 0.15 * DPR,
    phase: Math.random() * Math.PI * 2,
    tw: Math.random() * 0.03 + 0.01,
  };
}
const COUNT = window.innerWidth < 700 ? 40 : 80;
for (let i = 0; i < COUNT; i++) sparks.push(makeSpark(true));

function burst(el, n = 50) {
  if (reduceMotion) return;
  const rect = el.getBoundingClientRect();
  const cx = (rect.left + rect.width / 2) * DPR;
  const cy = (rect.top + rect.height / 2) * DPR;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = (Math.random() * 4 + 1.5) * DPR;
    bursts.push({
      x: cx, y: cy,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5 * DPR,
      r: (Math.random() * 2 + 1) * DPR,
      life: 1,
      pink: Math.random() < 0.25,
    });
  }
}

function drawGlow(x, y, r, alpha, pink) {
  const color = pink ? "231,127,180" : "246,226,164";
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
  g.addColorStop(0, `rgba(255,255,240,${alpha})`);
  g.addColorStop(0.3, `rgba(${color},${alpha * 0.6})`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 4, 0, Math.PI * 2);
  ctx.fill();
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < sparks.length; i++) {
    const s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.phase += s.tw;
    if (s.y < -20) sparks[i] = makeSpark(false);
    const a = 0.25 + Math.sin(s.phase) * 0.25 + 0.25;
    drawGlow(s.x, s.y, s.r, a, false);
  }

  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.08 * DPR;
    b.vx *= 0.98;
    b.life -= 0.016;
    if (b.life <= 0) { bursts.splice(i, 1); continue; }
    drawGlow(b.x, b.y, b.r, b.life, b.pink);
  }

  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(tick);
}
if (!reduceMotion) requestAnimationFrame(tick);
