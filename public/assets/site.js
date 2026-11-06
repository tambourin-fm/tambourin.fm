// Site behaviour: the theme toggle, and the cable lockup on the grid.

// --- theme, as in the editor -----------------------------------------------
// Follow the OS until the visitor picks; then t (or the dot) toggles light and
// dark, remembered per browser. The <head> sets data-theme before first paint.

const KEY = "tambourin.theme";
const dark = matchMedia("(prefers-color-scheme: dark)");

function current() {
  return document.documentElement.dataset.theme || (dark.matches ? "dark" : "light");
}

function toggle() {
  const next = current() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(KEY, next); } catch { /* private mode: not remembered */ }
}

document.querySelector(".theme-dot")?.addEventListener("click", toggle);
addEventListener("keydown", (e) => {
  if (e.key !== "t" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest?.("input, textarea, [contenteditable]")) return;
  toggle();
});

// --- the cable lockup ---------------------------------------------------------
// The cable runs a whole number of grid units (up to 18), so both ports sit on
// grid points. On build pages the dot grid is centred on the page and starts
// at the top, so the lockup is nudged onto it.

const UNIT = 20, MAX_UNITS = 18;
const lockup = document.querySelector(".lockup");

function layoutLockup() {
  if (!lockup) return;
  const room = lockup.parentElement.clientWidth;
  const units = Math.max(6, Math.min(MAX_UNITS, Math.floor((room - 2 * UNIT) / UNIT)));
  const inlet = UNIT * (units + 1); // outlet centre at x = UNIT
  const width = inlet + UNIT;
  lockup.setAttribute("viewBox", `0 0 ${width} ${2 * UNIT}`);
  lockup.setAttribute("width", width);
  lockup.setAttribute("height", 2 * UNIT);
  lockup.querySelector(".lockup-cable").setAttribute("x2", inlet - 4);
  lockup.querySelector(".lockup-inlet").setAttribute("x", inlet - 4);

  lockup.style.transform = "";
  if (!document.body.classList.contains("build")) return;
  const r = lockup.getBoundingClientRect();
  const x = r.left + scrollX, y = r.top + scrollY;
  const centre = document.body.clientWidth / 2;
  const mod = (n) => ((n % UNIT) + UNIT) % UNIT;
  // dots sit at centre + n*UNIT across, and at multiples of UNIT down
  lockup.style.transform = `translate(${mod(centre - x)}px, ${mod(-y)}px)`;
}

if (lockup) {
  layoutLockup();
  addEventListener("resize", layoutLockup);
  document.fonts?.ready.then(layoutLockup);
}
