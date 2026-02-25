# Human Browser — Web Stealth Browser for AI Agents

> **Stealth engine for your bot. Bypasses Cloudflare, DataDome, PerimeterX.**

---

## Why your agent needs this

Regular Playwright gets blocked **immediately** by:
- Cloudflare (bot score detection)
- DataDome (fingerprint analysis)
- PerimeterX (behavioral analysis)

Human Browser solves this by combining:
1. **Real device fingerprint** — iPhone 15 Pro or Windows Chrome, complete with canvas, WebGL, fonts
2. **Human-like behavior** — Bezier mouse curves, 60–220ms typing, natural scroll with jitter
3. **Full anti-detection** — `webdriver=false`, no automation flags

---

## Quick Start

```js
const { launchHuman } = require('./scripts/browser-human');

const { browser, page, humanType, humanClick, humanScroll, sleep } = await launchHuman();

// Desktop Chrome (Windows fingerprint)
const { page: desktopPage } = await launchHuman({ mobile: false });

await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
await humanScroll(page, 'down');
await humanType(page, 'input[type="email"]', 'user@example.com');
await humanClick(page, 760, 400);
await browser.close();
```

---

## Setup

```bash
npm install playwright
npx playwright install chromium --with-deps
```

---

## How it compares

| Feature | Regular Playwright | Human Browser |
|---------|-------------------|---------------|
| Bot detection | Fails | Passes all |
| Mouse movement | Instant teleport | Bezier curves |
| Typing speed | Instant | 60–220ms/char |
| Fingerprint | Detectable bot | iPhone 15 Pro |
| Cloudflare | Blocked | Bypassed |
| DataDome | Blocked | Bypassed |

