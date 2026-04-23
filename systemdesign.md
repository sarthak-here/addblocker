# Simple Ad Blocker — System Design

## What It Does
A lightweight Chrome extension (Manifest V3) that blocks intrusive ads, popup overlays, forced redirects, and click hijacking on JavaScript-heavy websites. Combines network-level blocking (declarative rules) with DOM-level cleanup (content script) and script interception.

---

## Architecture

```
Chrome Browser
      |
      +---------------------------+
      |    manifest.json (MV3)    |
      +---------------------------+
             |           |
             v           v
   background.js     content.js
   (Service Worker)  (injected into every page)
         |                |
         v                v
   rules.json          block.css
   (declarative net    (hides ad elements
    request rules)      via CSS selectors)
         |                |
         v                v
   Network-level      DOM-level
   request blocking   overlay removal
   (before page load) (after page load)
```

---

## Input

| Trigger | Detail |
|---|---|
| Network request | Every outgoing HTTP request the page makes |
| DOM mutations | New elements added to the page (MutationObserver) |
| Page scripts | JavaScript that creates overlays or hijacks clicks |
| User toggle | popup.html on/off switch per site |

---

## Data Flow

```
USER OPENS A WEBPAGE
        |
        v
1. background.js (Service Worker)
   Chrome declarativeNetRequest API
   Loads rules.json before any request fires:
     - Block requests matching ad network domains
       (doubleclick.net, googlesyndication.com, etc.)
     - Block tracking pixels and analytics endpoints
   -> Blocked requests never reach the page

        |
        v
2. content.js (injected into page DOM)
   Runs after DOM is ready:
   a) CSS selector sweep:
      Matches known ad container classes/IDs
      Applies block.css: display:none !important
   b) MutationObserver:
      Watches for dynamically injected overlays
      (newsletter popups, cookie banners, paywalls)
      Removes matching elements as they are added
   c) Script interception:
      Overrides window.open() to block popup windows
      Intercepts click hijacking patterns

        |
        v
3. popup.html (user interaction)
   Toggle switch: enable/disable per domain
   Sends message to content.js via chrome.runtime.sendMessage
   State stored in chrome.storage.local
```

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| MV3 declarativeNetRequest | MV2 webRequest (blocking) is deprecated in Chrome; MV3 is the only supported approach |
| Network rules + DOM cleanup | Network blocking stops most ads; DOM cleanup handles dynamically injected content |
| MutationObserver for overlays | SPAs inject popups after page load; a one-time DOM scan misses them |
| block.css with !important | Prevents ad scripts from overriding display:none with inline styles |
| Per-domain toggle | Users can whitelist sites they want to support |

---

## Interview Conclusion

This extension solves the ad blocking problem at two layers, which is necessary because modern ad networks have moved from simple script tags to dynamically injected DOM elements and first-party proxied requests. The declarative network rules handle the simple case: requests to known ad domains are blocked before they even reach the page, which is both faster and more privacy-preserving than inspecting responses. The content script handles the hard case: JavaScript-heavy SPAs that inject overlays and popups after the initial page load, which network rules cannot catch. The MutationObserver pattern is the key technique — it watches the DOM tree in real time and removes matching elements the moment they appear. Building under MV3 constraints (no persistent background page, no blocking webRequest) required restructuring the blocking logic from event-driven to rule-based, which is actually a good architectural improvement since it moves the heavy lifting into the browser engine.
