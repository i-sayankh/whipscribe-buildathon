**Device and browser**
Real iPhone 16, Safari (seen by me, signed in to my own account). Reproduced in emulation: iPhone-size 393×659 (Playwright WebKit), Pixel 7 412×915 and laptop 1280×900 (Playwright Chromium).

**Page**
https://whipscribe.com/home → Upload files, on an account with 0 credits left

**Steps**
1. Sign in with an account that has used its free transcripts (balance shows 0.0 h).
2. Upload files → choose any audio or video file → **Start transcribing 1 file**.
3. The "Top up or recover credits" dialog opens. Look at the plan cards.

**Expected**
Each plan card reads top to bottom: name, price, price per minute, minutes.

**What happened**
The cards are unreadable. On a phone, "$0.006 / m**Basic pack** 2,000 **$8**" is printed on top of itself, the "$12" and "$24" prices and the Workspace heading hang outside their cards, and the Workspace lines are cut off at the right edge. On a laptop the "Best value" label ends up outside the dialog.

Cause, as far as I can see from the page: the app's `workspace.css` has a global rule `button { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; }`. Each plan card in this dialog is a `<button class="sku-btn">` with four stacked `<div>`s inside, so the four lines become one centred row that cannot wrap and spills out of both sides. Adding `.whip-topup-dialog button { display: block; white-space: normal; min-height: 0; }` in the browser fixes it (elements outside the dialog: 10 → 0 on a phone, 3 → 0 on a laptop). After picture below.

Repro: [`track-1/i-sayankh/repro/bugs.spec.ts` › "top-up modal: nothing spills out of the dialog"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts) (opt-in test; with 0 credits `/api/v1/uploads/init` answers 402 and no job is created)

**Screenshot or recording**
Phone, as it is now (my email blurred):

![Top-up dialog on a 393 px phone: plan card text overlapping and spilling out of the cards](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-mobile-393-topup-modal-before-email-blurred.png)

Laptop, as it is now:

![Top-up dialog at 1280 px: "Best value" and prices outside the cards](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-desktop-1280-topup-modal-before-email-blurred.png)

The same dialog with the one CSS rule above applied in the browser (not shipped code, only to show the fix):

![Top-up dialog with the fix applied: each card reads name, price, per-minute price, minutes](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-mobile-393-topup-modal-after-css-fix-email-blurred.png)

**How much it matters**
Blocks the whole flow. This is the screen where someone decides to pay, and it appears right after their free transcripts run out. On my own phone I could not tell which price went with which pack.
