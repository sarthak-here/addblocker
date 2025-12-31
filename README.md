# addblocker
Simple Ad Blocker is a lightweight Chrome (MV3) extension that blocks intrusive ads, popup overlays, forced redirects, and click hijacking on JavaScript-heavy websites. It combines network rules with DOM cleanup and script interception for stronger, layout-safe ad blocking.
🛡️ Simple Ad Blocker (Chrome Extension – MV3)

A lightweight Chrome extension built with Manifest V3 to block intrusive ads, popup overlays, forced redirects, and click hijacking—especially on JavaScript-heavy websites such as manga/manhwa readers.

Unlike basic ad blockers that only filter network requests, this extension combines network-level blocking with DOM and JavaScript control for stronger protection.

✨ Features

Blocks affiliate and redirect-based ads

Prevents forced popups and new tabs

Removes modal overlays and banners

Restores scrolling and page interaction

Handles dynamically injected ads

Uses MutationObserver for real-time cleanup

Fully compatible with Chrome Manifest V3

🧠 How It Works

The extension uses a multi-layer blocking strategy:

Declarative Net Request (rules.json)
Blocks known ad and redirect domains at the network level.

Content Script (content.js)

Removes popup and overlay elements

Blocks click-through redirect links

Prevents abusive window.open() calls

Unlocks page scroll and interaction

CSS Rules (block.css)
Safely hides common ad iframes without breaking layout.

This approach mirrors how modern blockers like uBlock Origin handle JavaScript-based ads under MV3 constraints.

📂 Project Structure
├── manifest.json
├── background.js
├── content.js
├── rules.json
├── block.css
├── popup.html
├── popup.js

🚀 Installation

Clone or download this repository

Open Chrome and go to chrome://extensions/

Enable Developer mode

Click Load unpacked

Select the project folder

⚠️ Limitations

Not intended to replace full filter-list blockers

Some sites may intentionally hide content when ads are blocked

Rules are conservative to avoid breaking site functionality

🎯 Purpose

This project was built to learn and demonstrate real-world ad blocking techniques under Chrome’s Manifest V3 limitations, focusing on usability, safety, and performance.

📜 License

MIT License

If you want, I can:

Add screenshots / demo GIF

Optimize it for Chrome Web Store

Add a site-wise ON/OFF toggle

Write contribution guidelines
