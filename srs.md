# Execution Spec: Sticker Sheet Imposition Calculator → Print Layout Toolkit
## For: Coding Agent(s) implementing this project across multiple phases

**Read this entire document before writing any code, even if you're only assigned one phase.** Later phases depend on decisions made in earlier ones, and the UX Contract in Section 1 governs every phase without exception.

---

## 0. Context

An existing tool is already live: a 100% client-side (no backend), vanilla HTML/CSS/JS sticker/label sheet imposition calculator. It takes a sheet size and a cover/max-size, calculates how many stickers fit with proper bleed/gap/margin/gripper handling, shows a live sheet preview and a cover-fit preview, and exports a 300 DPI PDF. It uses a global `STATE` object and a single `updateAll()` orchestrator (see the existing architecture doc for full technical detail — file structure, `computeLayout()` math, canvas rendering approach). This spec does not replace that architecture doc; it governs what gets built on top of it, in what order, and under what UX constraints.

The long-term goal is to grow this into a **small toolkit of focused print-layout calculators**, sharing one engine and one visual identity, without ever becoming confusing or bloated. The end product should feel like a family of simple, fast, single-purpose tools — never one large complex application.

---

## 1. The UX Contract (governs every phase — read this first, re-read it before every phase)

This is not a suggestion. It is the hard constraint every phase must satisfy before it can be considered done.

**The core rule:** for any new feature, ask — *does this change what a first-time user sees, or has to understand, on their very first visit to a tool's main page?*
- If **yes** → the feature must be opt-in, collapsed by default, behind an explicit toggle, or placed on a separate page. It must never be merged into the default flow.
- If **no** (it's invisible, automatic, or purely additive like a shortcut/preset) → it can be added directly.

**Concrete standing rules, applicable at every phase:**
1. The main calculator's default experience must always be completable in three inputs and under 15 seconds, with zero manual/explanation required, from a cold landing.
2. Never add a new concept, field, or jargon term to the default/visible UI without a one-line plain-language explanation next to it.
3. Never let an advanced feature (multi-sheet planning, multi-sticker-size, gripper edge, cost math) appear expanded or "on" by default. Advanced = opt-in, always.
4. Never add a mode switch, tab, or toggle unless the default option remains byte-for-byte the same experience as before that toggle existed.
5. Ads (Phase 5) must never sit inside, above, or adjacent to the input form or preview canvas, and must never cause layout shift after the page has loaded.
6. When in doubt, prefer a separate page/tool over adding a field to an existing one.

Every phase section below ends with **Exit Criteria** — do not mark a phase complete, and do not begin the next phase, until every exit criterion is met.

---

## 2. Phase 0 — Harden the Existing Tool

**Goal:** Fix defects in what already exists before adding anything new. Do not add features in this phase.

**Tasks:**
1. **Cover-fit preview correctness.** Confirm the sticker-on-cover preview exists, renders to true scale, and updates live on any sticker size change. Confirm the engine enforces sticker size ≤ cover size in at least one valid orientation, and that manually entering an oversized sticker produces a clear, visible warning (not a silent miscalculation or broken preview).
2. **Gripper edge clarity.** Confirm the gripper edge field defaults to 0 and has an inline, plain-language explanation of what it is and when it applies (commercial press sheets only — irrelevant for home cutting machines). It must not be a confusing, unexplained field to a first-time user.
3. **Clear saved data control.** Add a visible, one-click "Clear my saved data" action near the settings/footer, since inputs persist via localStorage and the tool is positioned as privacy-first.
4. **SEO noscript honesty.** Review the `<noscript>` fallback content. It must be a genuine, usable degraded page (a real explanation plus one static worked example, e.g. a plain HTML table) — not a keyword-dense block disconnected from what a JS-disabled visitor can actually do. Rewrite if it currently reads as a keyword dump.
5. **Terminology and math consistency.** Confirm UI labels, tooltips, and the underlying variable names/math for bleed, gap, and margin all agree with each other and with the definitions in the architecture doc. Confirm efficiency % is calculated from trim area (`count x trimW x trimH / sheetArea`), not footprint area.
6. **Rounding practicality.** Confirm auto-suggested candidate sticker sizes are rounded to practical values (nearest 0.1in or 1/8in), not odd repeating decimals, and that at least 2–4 distinct candidates are returned.
7. **Edge-case and error handling.** Test and fix behavior for: sheet smaller than sticker, zero/negative/blank numeric inputs, non-numeric input. All must fail gracefully with a clear on-screen message — never a broken canvas, blank preview, or console-only error.
8. **Mobile responsiveness.** Confirm both preview canvases resize correctly on a narrow mobile viewport without overflow or becoming unreadable.
9. **PDF export accuracy.** Test-export a 13x19in sheet and verify: exact 300 DPI pixel dimensions with zero rounding drift, exact positions for trim/bleed/gap lines with no fractional-pixel accumulation across rows/columns, and that the exported PDF page size exactly matches the physical sheet size (no auto-scaling to a "nearest paper size" by the PDF library).

**Report-back format:** for each of the 9 tasks, state current status (already correct / bug found / missing), what was changed, and the before/after behavior on this standard test case: Sheet=13x19in, Cover=10.5x9in, Bleed=0.0625in, Gap=0.125in, Margin=0.2in. Flag anything you believe is a deliberate existing design choice rather than a bug, instead of silently changing it.

**Exit Criteria:**
- All 9 tasks resolved or explicitly flagged with reasoning.
- A first-time user can go from landing on the page to seeing a correct sticker count in under 15 seconds with no errors, on both desktop and mobile.
- No known silent-bug risk remains in the packing or PDF export math.

---

## 3. Phase 1 — Polish the Single Tool

**Goal:** Improve the existing calculator's depth and shareability without adding a single new concept to its default UI. Everything in this phase fits inside the current single-page layout.

**Tasks:**
1. **Preset sheet sizes.** Add a dropdown (Letter, A4, A3, SRA3, 13x19, 12x18, etc.) that fills the existing sheet width/height fields. This replaces manual entry as the default interaction, not adds a new one — per UX Contract rule 6 exception (this is a shortcut, not a new concept).
2. **Preset sticker sizes.** Same pattern — a dropdown of common die-cut sizes (2x2, 3x3, 4x6, etc.) that fills the existing sticker size field.
3. **Permalink / URL state.** Encode current inputs into the URL query string automatically, with no new UI element required. Loading a URL with query params must restore that exact state.
4. **PNG export.** Add a "Download PNG" button next to the existing PDF export button, same visual area, exporting the current sheet preview as an image.
5. **FAQ / "How this works" section.** Add a scrollable section below the main tool (below the fold) explaining bleed, gap, margin, and gripper edge in plain language, plus 3–5 common questions. This must not alter or intrude on the main tool's visible area on load.

**Exit Criteria:**
- The tool remains a single page with no new tabs, modes, or required explanations on first load.
- Presets measurably reduce the number of manual fields a typical user needs to fill (verify by testing the "pick preset sheet + pick preset sticker" path takes under 10 seconds).
- A shared permalink correctly restores exact tool state when opened in a fresh browser/session.
- Main tool visual layout is byte-for-byte unchanged from Phase 0's end state, aside from the two new export buttons and the below-fold FAQ section.

---

## 4. Phase 2 — Multi-Sheet Order Planning

**Goal:** Let users answer "I need N stickers — how many sheets, what's the cost, what's left over," without this ever being visible to someone who didn't ask for it.

**Tasks:**
1. Add an **"Order Planning" section**, collapsed by default, positioned below the main sheet/cost stats.
2. Inputs (only visible once expanded): target quantity, optional cost-per-sheet.
3. Outputs: sheets required (rounded up/ceiling — never round down, since a partial sheet still costs a full sheet), total cost if cost-per-sheet provided, leftover/unused stickers on the final sheet, waste percentage.
4. This section must load collapsed on every visit (not remember an "expanded" state via localStorage) so it never surprises a returning casual user.

**Exit Criteria:**
- With the section collapsed (default state), the page is visually and functionally identical to Phase 1's end state.
- Expanding the section and entering a quantity produces correct sheets-required (ceiling math, verify with a non-round example like 500 stickers at 7-per-sheet → 72 sheets, 4 unused), correct total cost, and correct leftover count.
- No existing field, button, or preview from Phase 1 is altered in position or behavior.

---

## 5. Phase 3 — Multiple Sticker Designs on One Sheet

**Goal:** Support 2–3 different sticker sizes/designs on the same sheet, without changing the default single-design experience at all. This is the highest UX-risk phase — read the UX Contract again before starting.

**Tasks:**
1. Add a toggle at the top of the tool: **"Single Design" (default, pre-selected on every fresh load) ↔ "Multiple Designs."**
2. **Single Design mode must be pixel-for-pixel and behaviorally identical to the Phase 2 end state.** Do not modify any part of this mode while building Multiple Designs mode. If a change is required to support both modes internally, it must not be visible or behaviorally different in Single Design mode.
3. **Multiple Designs mode** (only loads when explicitly selected): allow the user to add sticker #1, #2, #3 with independent sizes and desired quantities. The packing engine should place all requested designs into the sheet, maximizing total placed count within the requested quantity ratios (do not require the user to understand bin-packing — they only pick sizes and quantities; the engine handles placement).
4. Extend the sheet preview to visually distinguish each design (e.g., distinct fill color/label per sticker type) so the layout is legible at a glance.
5. Multiple Designs mode can reuse Order Planning (Phase 2) logic but must clearly attribute cost/count breakdowns per design, not just a single blended total.

**Exit Criteria:**
- A user who never touches the toggle has an identical experience to Phase 2's end state — verify explicitly, side by side.
- Switching to Multiple Designs mode and back to Single Design mode leaves all Single Design inputs/state untouched.
- Multiple Designs mode correctly packs at least 2 distinct sticker sizes onto one sheet and visually differentiates them in the preview.
- No jargon or new field appears in Single Design mode as a result of this phase's work.

---

## 6. Phase 4 — Expand Into a Toolkit (Multiple Tools, One Hub)

**Goal:** Build additional, separate, single-purpose calculators that reuse the existing engine, tied together by a simple hub page — without merging them into one complex application.

**Tasks, in priority order:**
1. **Business Card / Postcard Imposition Calculator** — new page, reuses the packing engine, different default sheet/size presets and copy targeted at print-shop/business-card use cases.
2. **Circle/Round Label Sheet Calculator** — extends the engine to support circular dies (previously out of scope for the rectangle-only original tool). New page.
3. **Cost-per-Unit / Print Order Comparison Tool** — standalone page exposing just the Phase 2 order-planning math, for users who want cost answers without a visual layout.
4. **Paper/Sheet Size Reference Tool** — a simple static lookup page (Letter vs A4 vs SRA3 vs 13x19 dimensions, standard bleed/DPI conventions by region). No interactivity required beyond basic filtering/search.

**Hub page requirements:**
1. Build a simple homepage/hub: one headline, one sentence describing the toolkit, and a grid of tool cards (icon + tool name + one-line description each). This is a router, not a dashboard — it must not try to explain how every tool works.
2. **Every individual tool page must work fully standalone.** A user landing directly on the circle-label calculator from a search engine must get a complete, usable tool with no requirement to visit the hub first.
3. Add a small, consistent header/nav shared across all tool pages so users can discover related tools, but it must stay lightweight and never resemble an ad or intrusive element.
4. **No feature or field from one tool may leak into another's default UI.** Each tool's default view should only show what its specific audience needs (e.g., gripper edge terminology belongs in the business-card/commercial-press-oriented tool's advanced section, not necessarily surfaced identically in a casual circle-label tool aimed at hobbyists).

**Exit Criteria:**
- At least the first two new tools (business card, circle label) are live, each independently reachable, independently usable, and each satisfying the same Phase 0–1 quality bar (fast, correct, mobile-friendly, no silent bugs).
- The hub page loads fast, contains no more than what's needed to route a user to the right tool, and does not attempt to surface every feature from every tool on one screen.
- Every tool page, viewed in isolation, still passes the 15-second/three-input first-time-user test from the UX Contract, adapted to that tool's own purpose.

---

## 7. Phase 5 — Monetization & Growth Layer

**Goal:** Generate ad revenue from traffic without degrading UX or search performance. Can run in parallel with Phase 2 onward once Phase 1's content exists.

**Tasks:**
1. Add a privacy policy page and a terms page. The privacy policy must explicitly state that image uploads and all calculations happen entirely client-side and nothing is sent to a server — this is both an AdSense requirement and a genuine trust/differentiation signal.
2. Apply to Google AdSense once Phase 1's supporting content (FAQ, and any blog/content pages) is live.
3. **Ad placement rules (hard constraints, not preferences):**
   - Ads may appear in a sidebar, footer, or below-the-fold content areas only.
   - Ads must never appear inside, above, or immediately adjacent to the input form or preview canvas.
   - Ad slots must be reserved with fixed dimensions from initial page load so no layout shift occurs once an ad loads (this protects both UX and Core Web Vitals / search ranking).
4. Once traffic volume justifies it, evaluate upgrading from AdSense to Ezoic, and at higher scale, Mediavine or direct sponsorships from label paper, printer, and cutting-machine brands. This is a later, ongoing task, not a one-time build step.
5. Add lightweight, privacy-respecting analytics (e.g., Plausible, Fathom, or Cloudflare Web Analytics) to track which tools and content pages drive traffic — avoid heavy trackers that slow the page or conflict with the tool's privacy-first positioning.

**Exit Criteria:**
- Privacy policy and terms pages exist and accurately describe the client-side-only data handling.
- No ad placement violates the hard constraints in task 3 — verify with a real page-load test that Cumulative Layout Shift (CLS) does not measurably worsen after ads are added.
- Analytics are live and correctly attributing traffic per tool/page.

---

## 8. Final Reminder for Every Phase

Before marking any phase complete, re-check it against Section 1 (the UX Contract) one more time. A phase is not "done" because the feature works — it is done when the feature works **and** the tool still feels exactly as simple as it did before that phase started, to a brand-new first-time visitor.