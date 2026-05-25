/* Loading -> reveal animation engine for the industry-report b-roll screens.
   Each page sets window.REVEAL = { loadMs, holdMs, steps:[[ms,'status text'],...] }
   and includes: #card (.card), #bar (the .l-prog fill), #status, optional #replay.
   The progress bar starts pre-filled at 30%, fills linearly to ~88% over loadMs,
   holds (the "analyzing" beat), snaps to 100%, then the report cross-fades in. Loops. */
(function () {
  var cfg = window.REVEAL || {};
  var steps = cfg.steps || [];
  var loadMs = cfg.loadMs || 1900;   // 30% -> 88% linear fill
  var holdMs = cfg.holdMs || 3200;   // hold the reveal before looping
  var PAUSE = 450;                    // hold at ~88% before the snap
  var SNAP = 220;                     // snap 88% -> 100%

  var card = document.getElementById('card');
  var bar = document.getElementById('bar');
  var status = document.getElementById('status');
  if (!card || !bar) return;

  // drive the CSS fill duration from loadMs (single source of truth)
  document.documentElement.style.setProperty('--load-dur', loadMs + 'ms');

  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function run() {
    clearTimers();
    card.classList.remove('revealed');

    // hard reset to 30% with no animation, then restore the CSS transition
    bar.style.transition = 'none';
    bar.style.width = '30%';
    void bar.offsetWidth;
    bar.style.transition = '';                 // back to: width var(--load-dur) linear
    if (steps[0] && status) status.textContent = steps[0][1];

    // flip width on a later frame so it actually animates
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.style.width = '88%'; });
    });

    if (status) {
      steps.forEach(function (s) {
        timers.push(setTimeout(function () { status.textContent = s[1]; }, s[0]));
      });
    }

    var snapAt = loadMs + PAUSE;
    timers.push(setTimeout(function () {
      bar.style.transition = 'width ' + SNAP + 'ms ease';
      bar.style.width = '100%';
    }, snapAt));

    var revealAt = snapAt + SNAP + 80;
    timers.push(setTimeout(function () { card.classList.add('revealed'); }, revealAt));
    timers.push(setTimeout(run, revealAt + holdMs));
  }

  var replay = document.getElementById('replay');
  if (replay) replay.addEventListener('click', run);
  run();
})();
