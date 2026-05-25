# Demo ↔ Script Cue Sheet

Maps the VSL narration (spoken to the coach/expert) to what the Sandra demo shows on
screen. The demo plays as the on-screen "proof" under the voiceover.

## How to record (hands-free autoplay)

Just open `index.html` and screen-record — the demo **drives itself** end to end
(auto-answers, auto-checks out, auto-books). Add `?manual` to the URL to click through it
by hand instead. The "Jump to" navigator (top-right) is recording-only — crop it out.

The demo is built as **two continuous segments** with the 3 industry screenshots spliced
between them by your editor:

| | Covers script | Demo time | Ends at |
|---|---|---|---|
| **Segment 1** | Part A — "AI version of you → $10–100 purchase → see a problem → step one" | ~0–32s | the £17 paywall payment |
| **↳ cut to PNGs** | "For example… financial advisor / mortgage broker / doctor" | ~28s | `financial-advisor.png` → `mortgage-broker.png` → `doctor.png` |
| **Segment 2** | Part B — "deliver 24/7 + revenue → trust → next offer → calendar/application → $199/mo → whole process" | ~32–82s | the closing line |

**Measured beat timing** (seconds from load, hands-free): chat 7.7 · Q1 11.9 · report
20.8 · paywall 26.3 · **paid/Seg-1 end 32.1** · plan 34.5 · next-offer 52.4 · booking 62.9
· monthly 71.5 · **closing/Seg-2 end 82.3**. Re-measure anytime with
`node industry-reports/autoplay-timing.mjs`.

> Note: Segment 2's demo runs ~50s while Part B narration is ~82s — the demo is a touch
> faster there, so pace Part B deliberately or hold the final frame. (Segment 1 is matched.)

The cue table below maps each line to its on-screen beat (and the navigator jump if you'd
rather record a single beat in isolation).

---

| # | Script line (narration) | On screen | Source |
|---|---|---|---|
| 1 | "That's exactly what the AI version of you can do with your expertise, 24/7." | FB ad → Sandra AI opens, says hi, starts the check-in | Navigator: **Start** |
| 2 | "It can start people off with a small purchase, usually between $10 to $100. That offer helps someone see a problem they didn't know they had and gives them step one of the solution…" | The 3 questions → report builds → **the £17 entry paywall** (the "$10–100 small purchase"); the report reveal = "a problem they didn't know they had" | Navigator: **Questions → Report → Paywall** |
| 3 | "…exactly like how you would handle a brand new client on day one of working with them personally." | Hold on the paywall / report card | (continues from #2) |
| 4 | "For example, if you're a **financial advisor**, your entry-level AI might walk someone through a quick analysis of where their portfolio is leaking money." | Cut to **financial-advisor.png** | Screenshot |
| 5 | "If you're a **mortgage broker**, the entry-level AI might generate a personalized report on the best investment properties in someone's zip code." | Cut to **mortgage-broker.png** | Screenshot |
| 6 | "If you're a **doctor**, it might do an intake on someone's symptoms and flag the health risks worth looking at." | Cut to **doctor.png** | Screenshot |
| 7 | "Whatever the first step is when you start with a new high-level client, your AI can learn it, replicate it, and deliver it 24/7. All while collecting revenue in the process." | Back to Sandra: **payment received → unlocked starter plan** ("collecting revenue" = the Stripe success beat) | Navigator: **Plan** |
| 8 | "From that first experience of your expertise, your AI builds the trust and the relationship that will get people excited & interested in your higher level offerings." | The guided follow-up chat — AI keeps helping after the purchase | Navigator: **Guided** |
| 9 | "And, usually, what we see is, within 24 to 48 hours, your AI knows enough about a person and has built enough trust to point them to the next offer that fits them best." | The AI's recommendation card → "Sandra AI recommends" opens the report/offer screen | Navigator: **Guided** (recommendation → opens app modal) |
| 10 | "If the lead is ready for your highest level of service, it can send them straight to a calendar or an intake application." | The **booking calendar** (date → time → confirm → booked). The "intake application" = the Save-Your-Discovery form. | Navigator: **Scheduler** |
| 11 | "For leads who aren't ready for you personally, the AI can sell a monthly version of itself for between $199 and $499 a month. Like a chef's prepackaged meals… the full experience of your expertise, just delivered by your AI instead of you personally." | The **$199/mo membership card** — "Like working with me, delivered by my AI, every day." | Navigator: **Monthly** ✅ built |
| 12 | "The AI version of you teaches them your entire process end to end, and keeps building trust until they're ready to work with you at your highest level." | The ongoing plan / guided steps = the monthly product delivering the full process | Navigator: **Plan / Guided** |

---

## Beat 11 — built ✅

Added a **$199/mo membership card** to the scripted flow (after the booking confirmation)
and a **"Monthly"** button to the demo navigator. It reuses the `paywall` renderer with
`priceTerms: 'per month'` and a new `instantUnlock` flag so it skips the VSL unlock
countdown. Record it via the navigator's **Monthly** jump.

## Copy-alignment notes (the "rewrite copy" pass)

Where the on-screen text should echo the narration's framing:
- Entry paywall → frame as the **"$10–100 first step / day-one experience"** (already close).
- Recommendation card (beat 9) → "Based on everything so far, here's the next step that
  fits you best" (echoes "point them to the next offer that fits them best").
- Monthly card (beat 11) → "Like working with me — delivered by my AI, every day"
  (echoes the chef's-prepackaged-meals line).
- Booking/application (beat 10) → label the form as an **"intake application"** and the
  calendar as **"book your highest-level consult"** to match the two paths in the script.
