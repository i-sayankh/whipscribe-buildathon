**The problem** (link the issue if there is one)

#155. When someone runs out of credits and presses "Start transcribing", the "Top up or recover credits" dialog opens with its plan cards broken: prices, pack names and per-minute rates printed on top of each other and hanging outside the cards. I saw it on my own iPhone 16, and it reproduces at 393, 412 and 1280 px in two browser engines. This is the moment someone decides whether to pay.

**What I would change**

One CSS rule, scoped to the dialog:

```css
.whip-topup-dialog button { display: block; white-space: normal; min-height: 0; }
```

Why it works: the app's `workspace.css` styles every `button` as `display: inline-flex; justify-content: center; white-space: nowrap`. The dialog's own styles assume buttons are plain blocks, and each plan card is a `<button class="sku-btn">` holding four stacked `<div>`s. Under the global rule those four lines become one centred row that cannot wrap. Scoping `display: block` to buttons inside the dialog gives the cards back their intended top-to-bottom layout, and touches nothing outside it.

Two small copy fixes while the file is open (optional, separate commit):
- the $12 card is titled "Best value" while the others are "Basic pack" and "Team pack"; call it "Pro pack" and keep "Best value" as the badge;
- show the packs in price order ($8, $12, $24), as on /pricing, instead of $12, $8, $24.

**Why this and not something bigger**

The dialog's content and flow are fine once it renders: plans, per-minute price, "never expires", "Paid on another device?". Only the layout breaks, and only because a global rule leaks in. Redesigning the paywall would take longer, need product decisions, and still leave the leak for the next dialog. The real lesson for later is to stop styling bare `button` globally in `workspace.css`, but that change touches every screen in the app and needs its own review; this rule fixes the paying user today without risk to anything else.

**Mockup, sketch, or before/after**

Before, phone (393 px, my email blurred):

![Top-up dialog as it is: overlapping card text](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-mobile-393-topup-modal-before-email-blurred.png)

After, the same live dialog with only the rule above added in the browser (this is not shipped code):

![Top-up dialog with the rule applied: name, price, per-minute price and minutes in each card](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-mobile-393-topup-modal-after-css-fix-email-blurred.png)

Laptop (1280 px), before and after:

![Before at 1280 px](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-desktop-1280-topup-modal-before-email-blurred.png)
![After at 1280 px](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/17-desktop-1280-topup-modal-after-css-fix-email-blurred.png)

Measured: elements outside the dialog go from 10 to 0 on the phone and from 3 to 0 on the laptop.

**What it would take to build** (rough, honest)

About 30 minutes: add the rule to the dialog's inline style block, then check the dialog everywhere it opens (library upload, reader, credits pill). I only tested it from the library upload. The Playwright check that fails today and passes with the rule is already written: [`bugs.spec.ts` › "top-up modal: nothing spills out of the dialog"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts). Plus 15 minutes for the two copy fixes if wanted.
