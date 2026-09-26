**Device and browser**
Emulated Pixel 7, 412×915 (Playwright Chromium) and laptop 1280×800 (Playwright Chromium), signed in to my own account.

**Page**
https://whipscribe.com/view?id=00000000-0000-0000-0000-000000000000 (any id that is not a recording: a deleted one, or a mistyped share link)

**Steps**
1. Sign in.
2. Open `/view?id=` with an id that is not a recording (I used an all-zero UUID and also `not-a-real-id`).
3. Wait a few seconds, then open the Transcript tab.

**Expected**
One clear message, "This recording doesn't exist or was deleted", with a way back to the library. No Copy or Download.

**What happened**
The page contradicts itself:
- the title stays **"Loading…"** forever;
- the Overview says **"Insight generation unavailable — transcript still ready."** with a Retry button;
- the Transcript tab shows the raw server text **"invalid job_id"** in red;
- the player says **"Invalid file id"**;
- Copy and Download stay enabled.

Behind it, seven API calls to `/api/v1/jobs/{id}`, `/overview`, `/notes` and `/audio/url` return 400.

Repro: [`track-1/i-sayankh/repro/bugs.spec.ts` › "reader: a recording that does not exist gets one clear state"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts)

**Screenshot or recording**
![Overview for a missing recording on a phone: title "Loading…", message "transcript still ready" with Retry](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/14-mobile-412-missing-recording-overview-says-transcript-ready.png)

![Transcript tab for the same missing recording on a laptop: raw "invalid job_id"](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/14-desktop-1280-missing-recording-invalid-job-id.png)

**How much it matters**
Stops me from finishing. Anyone following an old or mistyped link is told the transcript is ready, presses Retry, and waits for something that does not exist.
