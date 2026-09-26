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
