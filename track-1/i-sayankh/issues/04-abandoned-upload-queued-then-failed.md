**Device and browser**
Emulated iPhone 14, 390×664 (Playwright WebKit) and Pixel 7, 412×915 (Playwright Chromium), signed in to my own account, uploading my own 26 MB video.

**Page**
https://whipscribe.com/home → Upload files

**Steps**
1. Upload files → choose a video → **Start transcribing 1 file**.
2. While it says "uploading · N%", close the tab or lose the connection. (I blocked only the final `/api/v1/uploads/{id}/commit` request, which is what a closed tab does.)
3. Open the library again, straight away and after half an hour.

**Expected**
Either the upload resumes, or the row says straight away that it didn't finish ("Upload didn't finish — upload again"). An upload that never arrived should not use up a free transcript.

**What happened**
A row named **`original.mp4`**, "— · Today", shows **Queued** for about 24 minutes, then turns **Failed** with no reason given. The job is created by `POST /api/v1/uploads/init` before any bytes are sent. After 23.7 and 24.0 minutes (two runs) the API marked it failed, and its `error` field is a raw Python exception: "expected str, bytes or os.PathLike object, not dict".

It also costs the user: after one finished transcript and these two abandoned uploads, `/uploads/init` answered 402 "Your first 3 transcripts were on us" with `"lifetime_jobs": 3`. The two uploads that never arrived used up two free transcripts.

Repro: [`track-1/i-sayankh/repro/bugs.spec.ts` › "upload: an upload that never finishes does not stay "Queued" in the library"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts) (opt-in, because it leaves a stuck job)

**Screenshot or recording**
![Library on a phone: two "original.mp4 — Queued" rows above the real recording](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/07-mobile-390-abandoned-uploads-stay-queued.png)

![The same rows about 25 minutes later: both "Failed", no reason](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/07-mobile-412-abandoned-uploads-end-failed.png)

**How much it matters**
Stops me from finishing. For 24 minutes the library shows work that will never happen; then the user has failures to clean up and fewer free transcripts than they were promised. Phones drop connections and close tabs often, so this will not be rare.

Related but different: #94 (placeholder "original.*" name while a real upload is queued) and #84 (raw error text).
