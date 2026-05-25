# Industry Reports — "Problem-Reveal" Redesign Spec

## Goal

Rework the three industry-report screens (`financial-advisor`, `mortgage-broker`,
`doctor`) so each one plays as a short **b-roll sequence** that makes one thing obvious
in 1–2 seconds: *the expert's AI connected to the lead's real data source, analyzed it,
revealed a specific quantified problem, and is offering step one of the fix behind a
small unlock.*

This replaces the previous static sales-page layout (pain bullets → product card → FAQ →
reviews → form). These screens are **recorded**, not screenshotted — each page drives
itself on load.

**Format: a 1920×1080 landscape dashboard.** Each page is a single 16:9 dashboard card
(top bar with the synced data-source + a two-column body: big-number summary on the left,
itemized detail on the right, full-width locked CTA at the bottom), sized to fill a
widescreen frame. A faint source-logo watermark adds depth.

## Where this fits the VSL

Spliced under the narration "…for example, if you're a financial advisor / mortgage
broker / doctor…" (beats 4–6 of `SCRIPT-CUE-SHEET.md`). The viewer should read, at a
glance: **[expert] AI · connected to [real source] · here's your problem · unlock step one.**

## The shared sequence (all three)

Each page is one card that animates itself on load, then loops:

1. **Loading screen (~1.9s).** Expert avatar + "You ▸▸▸ [Source]" lockup, a progress bar,
   and cycling status text. The bar starts pre-filled at **30%**, fills **linearly** to
   **~88%** over ~1.9s, holds briefly (the "analyzing" beat), then snaps to **100%**.
2. **Reveal.** The loading layer cross-fades out; the report layer fades/rises in. The
   report shows a "✓ Synced" confirmation bar (with the source logo) and the quantified
   problem.
3. **Hold ~3.2s, then loop.** A small `↺ Replay` control is present for re-recording.

Linear easing is required (ease-out front-loads the motion and reads as "too fast").

### Status text per vertical (loading screen)

| Vertical | Lockup | Status steps |
|---|---|---|
| Financial advisor | You ▸▸▸ Fidelity | Connecting to Fidelity… → Importing 14 holdings… → Analyzing for leaks… |
| Mortgage broker | You ▸▸▸ Zillow | Connecting to Zillow… → Scanning 238 listings in 85281… → Ranking by cash flow… |
| Doctor | You ▸▸▸ MyQuest | Connecting to MyQuest… → Importing your last lab panel… → Flagging what needs attention… |

## Per-vertical reveal (the differentiator)

Each vertical reveals the problem in the format native to its field. Numbers are
illustrative/fixed (this is b-roll, not a live calculator).

### 1. Financial advisor — "Financial Advisor AI" · Fidelity (green)
- Headline: "Your portfolio is leaking" → big red **$4,240 / yr**
- Itemized red-flag rows: Hidden fund fees `1.4%` · Idle cash drag `$12k` · Fund overlap `3 funds`
- Locked CTA: **The first leak to plug** · Unlock $27

### 2. Mortgage broker — "Mortgage Broker AI" · Zillow (blue)
- Headline: **6 investment properties in your zip that cash-flow**
- Summary chips: Avg +$330/mo · 7.4–8.9% cap · $88k–$240k
- Big number: green **6**; label "investment properties in your zip that actually cash-flow"
- Stats table, one row per property (addresses blurred): Property | Price | Cash/mo
  - $124k +$410 · $168k +$340 · $205k +$295 · $92k +$280 · $148k +$265 · $210k +$240
- Contrast line: "The 6 you saved yourself averaged −$310/mo."
- Locked CTA: **Unlock all 6 + addresses** · Unlock $19

### 3. Doctor — "Doctor AI" · MyQuest/Quest (green)
- Headline: **What needs attention now vs. what can wait**
- Triage rows: Likely fine — just watch `2` (grey) · Worth checking this week `1` (grey) ·
  **Urgent / worth seeing someone `4` (red)**
- Header count: "Intake complete · 7 flags"
- Locked CTA: **Your one clear next step** · Unlock $19

## Brand / integration assets

`logos/` (transparent PNGs, verified): `zillow.png` (full-color blue),
`fidelity.png` (brand green + white knockout), `quest.png` (brand green).
Internal-use only.

Brand accent per vertical: orange `#ED7F59` is the product/CTA color (shared);
the sync-bar tints to the source brand (Fidelity/Quest green, Zillow blue).

## File structure

- `reveal.css` — shared loading + report styling, with per-reveal-type sections.
- `reveal.js` — the loading→reveal animation engine; reads a per-page `window.REVEAL`
  config (`steps`, `loadMs`, `holdMs`) and toggles the `.revealed` state. One engine,
  three pages.
- `financial-advisor.html`, `mortgage-broker.html`, `doctor.html` — content only; link
  `reveal.css` + `reveal.js`, embed the loading lockup and the hidden report layer.

## Out of scope

- No live data / no real API calls (illustrative figures).
- FAQ / reviews / lead form from the old layout are removed.
- The old `report.css` and the old `*.png` screenshots are left in place for now;
  the cue sheet note can be updated separately if the editor switches from PNG splice
  to screen-recording.
