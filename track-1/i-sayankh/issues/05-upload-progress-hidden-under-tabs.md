**Device and browser**
Emulated iPhone 14, 390×664 visible area (Playwright WebKit), signed in, uploading my own 26 MB video. For contrast: emulated Pixel 7, 412×915 (Playwright Chromium).

**Page**
https://whipscribe.com/home → Upload files

**Steps**
1. On a phone, Upload files → choose a video → **Start transcribing 1 file**.
2. The sheet closes. Watch the screen while the file uploads (about 2 minutes for 26 MB on my connection).

**Expected**
Something on the first screen says the upload is running and how far it has got.

**What happened**
For the whole upload, the first screen shows the five "add" cards and "0 recordings". The only progress ("uploading · 37%") is on the new row at y = 570–670 px, and the fixed bottom tab bar starts at y = 611 px, so most of the row is under the tabs. On the taller Pixel 7 screen the row shows above the tabs, so this depends on screen height.

Repro: [`track-1/i-sayankh/repro/bugs.spec.ts` › "upload: progress is visible on screen while the file uploads"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts) (opt-in)

**Screenshot or recording**
![iPhone-size screen 37 % into an upload: no progress visible, the bottom tabs cover the upload row](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/06-mobile-390-uploading-37pct-nothing-on-screen.png)

![Pixel 7: the uploading row sits just above the tabs](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/06-mobile-412-uploading-row-visible.png)

**How much it matters**
Stops me from finishing. On a shorter phone it looks as if "Start transcribing" did nothing, so people press Upload again or leave the page. Leaving the page is exactly what turns the upload into the stuck "Queued" row described in the abandoned-upload issue.
