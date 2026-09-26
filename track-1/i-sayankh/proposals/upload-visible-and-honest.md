**The problem** (link the issue if there is one)

#159 and #158, which are one story on a phone:

1. After "Start transcribing", the only sign of the upload is a row that sits under the bottom tab bar on a shorter phone (#159). For two minutes the screen says "0 recordings".
2. So people leave the page, or lock the phone, or lose signal. The upload never finishes, and the library shows `original.mp4 · Queued` for about 24 minutes, then `Failed` with no reason (#158).
3. And each of those counts as one of the free transcripts. On my account, one finished transcript plus two abandoned uploads = "Your first 3 transcripts were on us".

**What I would change**

Three small changes, in the order I would ship them:

1. **Show the upload where the user is looking.** While a file is uploading, pin a strip right above the bottom tabs: file name, percent, time left, "keep this page open", and a Cancel button (44 px). It disappears when the upload finishes and the row takes over ("Processing…"). The strip is the same component on every tab of the library, so leaving the list does not hide it.
2. **Say when an upload didn't finish.** A job whose file never arrived shows "Upload stopped at 37%" with an "Upload again" button, straight away when the page knows (the tab is still open and the request failed) and on the next visit otherwise. No "Queued", no raw error.
3. **Don't count it.** Only jobs that reached the server with a file count towards the free transcripts. Server side, that is a filter on the count (or creating the job at `/commit` instead of `/init`).

**Why this and not something bigger**

The bigger fix is resumable uploads (tus or S3 multipart) so a closed tab can carry on later. That is the right long-term answer, but it is days of work and does not help today's user understand what is happening. These three changes make the current upload honest: you can see it, you are told when it stopped, and it does not cost you anything. They also stay useful once uploads become resumable (the strip and the "stopped" row are exactly what a resume needs).

**Mockup, sketch, or before/after**

Before: 37 % into an upload on an iPhone-size screen, nothing visible:

![Before: no progress visible, the upload row is under the tabs](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/06-mobile-390-uploading-37pct-nothing-on-screen.png)

After (1): the strip above the tabs. Made by adding one element to the live page in the browser, for the picture only:

![After: "Uploading … 37% · about 1 min left · keep this page open" with Cancel, above the tabs](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/18-mobile-390-after-mock-upload-strip.png)

Before: the abandoned upload as it is now:

![Before: "original.mp4 — Queued"](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/07-mobile-390-abandoned-uploads-stay-queued.png)

After (2): the same row saying what happened, with the real file name and one action (browser mock):

![After: "Upload stopped at 37%" with an "Upload again" button](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/18-mobile-390-after-mock-unfinished-upload-row.png)

**What it would take to build** (rough, honest)

- (1) Strip: half a day. The page already knows the percent (it shows it on the row); this moves it into a fixed element above `.ws-tabs-mobile` and adds Cancel.
- (2) "Upload stopped": half a day front end (the page sees the failed request), plus a small server change so a job with no file after, say, 10 minutes is marked "upload incomplete" instead of queued, with a readable reason.
- (3) Free-transcript count: an hour, if the count can filter on "file received"; more if the job has to move from `/init` to `/commit`.
- Checks already written: [`bugs.spec.ts`](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts) › "upload: progress is visible on screen while the file uploads" and "an upload that never finishes does not stay Queued".

I have not seen the server code, so the server estimates are guesses from the API behaviour.
