import { MONTHS } from "./data.js";
import { daysIn } from "./calendar.js";
import { profile, match } from "./numerology.js";
import { soloHTML, duoHTML } from "./views.js";

/* ══ wiring ═══════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
let duo = false;

for (const which of ["a","b"]){
  $("m-"+which).innerHTML = MONTHS.map((n,i)=>`<option value="${i+1}">${n}</option>`).join("");
}
$("m-a").value = 1; $("m-b").value = 6;

function readEntry(which){
  const d = parseInt($("d-"+which).value,10), m = parseInt($("m-"+which).value,10), y = parseInt($("y-"+which).value,10);
  const warn = $("warn-"+which);
  if (!Number.isFinite(d) || !Number.isFinite(y) || y < 1 || d < 1){ warn.textContent = "Enter a day and a year."; return null; }
  if (y < 1900 || y > 2050){ warn.textContent = "Outside 1900–2050 the Chinese New Year boundary is estimated at 4 February."; }
  else warn.textContent = "";
  const max = daysIn(m,y);
  if (d > max){ warn.textContent = MONTHS[m-1]+" "+y+" has "+max+" days."; return null; }
  return profile(d,m,y,$("name-"+which).value.trim());
}

function writeHash(a,b){
  const enc = p => p.YYYY+"-"+p.MM+"-"+p.DD + (p.name ? "~"+encodeURIComponent(p.name) : "");
  const hash = "#" + (duo && b ? enc(a)+"_"+enc(b) : enc(a));
  try { history.replaceState(null, "", hash); } catch (_) { /* sandboxed frame: sharing links is simply off */ }
}
function readHash(){
  const raw = location.hash.slice(1); if (!raw) return;
  const parts = raw.split("_");
  parts.slice(0,2).forEach((chunk,i) => {
    const which = i ? "b" : "a";
    const [datePart, namePart] = chunk.split("~");
    const mm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart || "");
    if (!mm) return;
    $("y-"+which).value = +mm[1]; $("m-"+which).value = +mm[2]; $("d-"+which).value = +mm[3];
    if (namePart) $("name-"+which).value = decodeURIComponent(namePart);
  });
  if (parts.length > 1) setMode(true, false);
}

function animateBars(){
  const fill = $("fill"), score = $("score");
  if (!fill) return;
  requestAnimationFrame(() => {
    document.querySelectorAll(".bd .track i").forEach(i => i.style.width = i.dataset.w + "%");
  });
  const total = +score.dataset.total;
  fill.style.width = total + "%";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce){ score.textContent = total; return; }
  let n = 0;
  const step = () => { n += Math.max(1, Math.round(total/28)); if (n >= total){ score.textContent = total; return; }
    score.textContent = n; requestAnimationFrame(step); };
  step();
}

function render(){
  const a = readEntry("a");
  const b = duo ? readEntry("b") : null;
  const out = $("out");
  if (!a || (duo && !b)){ return; }
  if (duo){
    const m = match(a,b);
    out.innerHTML = duoHTML(a,b);
    const s = $("score"); s.dataset.total = m.total;
    animateBars();
  } else {
    out.innerHTML = soloHTML(a);
  }
  writeHash(a,b);
}

function setMode(next, doRender){
  duo = next;
  $("mode-solo").setAttribute("aria-pressed", String(!duo));
  $("mode-duo").setAttribute("aria-pressed", String(duo));
  $("console").classList.toggle("duo", duo);
  $("entry-b").classList.toggle("hidden", !duo);
  if (doRender !== false) render();
}

$("mode-solo").addEventListener("click", () => setMode(false));
$("mode-duo").addEventListener("click", () => setMode(true));
["d-a","m-a","y-a","name-a","d-b","m-b","y-b","name-b"].forEach(id => {
  const el = $(id);
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

readHash();
render();
