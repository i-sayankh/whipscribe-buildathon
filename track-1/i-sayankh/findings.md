# Track 1 findings — running log

Everything I noticed while walking through whipscribe.com, confirmed or not.
Screenshots are in `screenshots/`; each confirmed bug has a test in
`repro/bugs.spec.ts`.

Viewports: mobile-320 (320×568, Chromium, Pixel 7 UA), mobile-390 (iPhone 14,
WebKit), mobile-412 (Pixel 7, Chromium), desktop-1280, desktop-1440 (Chromium).
All of these are **emulated** with Playwright unless a row says "real device".

Severity: small annoyance / stops me finishing / blocks the whole flow.

| # | Flow | Viewport | What happened | Expected | Severity | Confirmed twice | Duplicate of |
|---|---|---|---|---|---|---|---|
| F1 | Home | all | `GET /api/v1/public-clips?limit=12` returns 404 on every load | No failing request | small annoyance | y | #68, #127 |
| F2 | Home | 320 | Integration cards stick out past the right edge (right = 340 px) | Cards fit the screen | small annoyance | y | #67 |
| F3 | Home | 320 | Only "Sign up" in the header; "Sign in" hidden | — | unsure (may be deliberate) | y | related to #37 |
| F4 | Free tool, Paste | 390, 1280 | A link that cannot be fetched (`https://example.com/not-audio`) shows the error in plain grey text under a full-width green bar that reads "0 %"; the steps stay neutral and the pasted link is cleared, so it has to be pasted again | A clear error state, no progress bar, the link kept in the field to fix | small annoyance | y | same root cause as #14 (file version, bar at 100 %); comment there instead of a new issue |
| F5 | Free tool, Record | 390 | Record tab explains the microphone prompt before asking; clear | — | fine | — | — |
| F6 | Pricing | 320, 390, 412, 1280, 1440 | In the Workspace card, the two highlighted perks ("**Unlimited transcription** — files, links, recordings, any length" and "**Your own API keys,** no daily cap") render as two columns: the bold phrase on the left, the rest of the sentence in a separate column on the right. Cause: `li.ai-perk` is `display:flex; gap:10px`, so the `<strong>` and the text node after it become two flex items | One sentence that wraps normally, like every other perk | small annoyance (on the main paid plan, the first thing read) | y (Chromium + WebKit, 3 widths) | no |
| F7 | Pricing | 390 | The 2,000- and 5,000-minute packs are "pay as you go … credits never expire · no subscription", but each also offers "A year up front? $96 — save 33% →" (`data-sku="pro-yearly"`). It is not clear what a year of a never-expiring pack means | — | unsure: ask before filing (did not click through to checkout) | y | no |
| F8 | Pricing | all | Workspace price shown twice in a row: the button says "$19 / month →" and the line under it says "$19 / month" again, with "· cancel anytime" wrapping onto its own line starting with a stray "·" | Price once | small annoyance, cosmetic | y | no |
| F9 | Credits (signed out) | 320, 390, 1280 | The only button is "Sign in with Google" and the copy says "Use the same Google account on any device", but the button opens the normal modal, which also offers email + password. Someone who signed up with email is told, in effect, that this page is not for them | Label "Sign in" and copy "Sign in with the account you used to buy credits" | small annoyance | y | no |
| F10 | Docs | 320 (Chromium + WebKit) | Long endpoint paths (`/api/v1/jobs/{id}/clips/candidates?kind=hook&limit=30`, `/clips/preprocess`, `/clips/search?q=pricing`) do not wrap, so they run out of their box and make the page 359 px wide on a 320 px screen. In WebKit the page scrolls sideways by 39 px and the body text is cut off on the left; in Chromium the layout viewport grows to 359 px and the support button sits half off-screen (right = 341). Cause: `.endpoint` is `display:flex` and its path `<span>` has no `min-width:0` / `overflow-wrap:anywhere` | Every line fits the screen; long paths wrap inside their box | small annoyance (docs are read by developers on phones too, and a sideways-sliding page feels broken) | y (2 engines, twice each) | no (#135 is about docs content, not layout) |
| F11 | Docs | 320 | The header chat link is an emoji-only 32×29 px target (`a.whip-nav-cta "💬"`) | ≥ 44×44 px with a text label | small annoyance | y | no |
| F12 | Docs | 390, 412, 1280, 1440 | No horizontal overflow; code blocks scroll inside their own box | — | fine | — | — |
