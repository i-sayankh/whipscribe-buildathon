**Device and browser**
Emulated Pixel 7, 412×915 (Playwright Chromium) and laptop 1280×800 (Playwright Chromium), signed in, my own 1 min 36 s recording.

**Page**
https://whipscribe.com/view?id=… → Overview → "In one minute"

**Steps**
1. Upload a recording and open it when it is Ready.
2. On the Overview tab, read the "In one minute" summary (the large bold paragraph).
3. Press its "Copy" link and paste.

**Expected**
A complete sentence, or one cut at a word boundary with "…".

**What happened**
The summary stops in the middle of a word: "…AI-assisted development practice, and passion for practical business **autom**". No ellipsis, no "more". It is already cut when it reaches the page: `GET /api/v1/jobs/{id}/overview` returns `thesis` exactly 240 characters long, ending in "autom". "Copy" copies the broken sentence.

Repro: [`track-1/i-sayankh/repro/bugs.spec.ts` › "reader: "In one minute" summary is not cut mid-word"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts)

**Screenshot or recording**
![Overview on a phone: the one-minute summary ends with "business autom"](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/09-mobile-412-overview-heading-suffix-and-summary-cut.png)

![Overview on a laptop: the same summary cut at "autom"](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/09-desktop-1280-overview-summary-cut-and-upsell-over-chapters.png)

**How much it matters**
Stops me from finishing. The one-minute summary is the first thing on the page and the thing people copy to share, and it looks broken whenever the summary is longer than 240 characters.
