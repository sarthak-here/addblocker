# Simple Ad Blocker - System Design

## What It Does
A lightweight Chrome extension (Manifest V3) that blocks intrusive ads, popup overlays,
forced redirects, and click hijacking on JavaScript-heavy websites. Combines network-level
blocking with DOM-level cleanup and script interception.

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
   (Service Worker)  (injected per page)
         |                |
         v                v
   rules.json          block.css
   declarative net     CSS selector
   request rules       ad element hider
         |                |
         v                v
   Network-level      DOM-level
   request blocking   overlay removal
   (before page load) (after DOM ready)
```

---

## Data Flow

```
USER OPENS A WEBPAGE
        |
Step 1 - background.js (Service Worker)
  Chrome declarativeNetRequest API loads rules.json
  BEFORE any network request fires:
    Block known ad network domains
    (doubleclick.net, googlesyndication.com, etc.)
    Block tracking pixels and analytics calls
  -> Blocked requests never reach the page

Step 2 - content.js (injected after DOM ready)
  a) CSS selector sweep:
     Match known ad container classes/IDs
     Apply block.css: display:none !important
  b) MutationObserver:
     Watch for dynamically injected overlays
     (newsletter popups, cookie banners, paywalls)
     Remove matching elements as they appear
  c) Script interception:
     Override window.open() to block popup windows
     Intercept click-hijacking patterns

Step 3 - popup.html (user toggle)
  Per-domain enable/disable switch
  Sends message to content.js via chrome.runtime.sendMessage
  State stored in chrome.storage.local
```

---

## Key Design Decisions

| Decision                          | Reason                                            |
|-----------------------------------|---------------------------------------------------|
| MV3 declarativeNetRequest         | MV2 blocking webRequest is deprecated in Chrome   |
| Network rules + DOM cleanup       | Network blocks most ads; DOM handles dynamic inject|
| MutationObserver for overlays     | SPAs inject popups after load; one-time scan misses|
| block.css with !important         | Prevents ad scripts overriding display:none        |
| Per-domain toggle                 | Users can whitelist sites they want to support    |

---

## Interview Conclusion

This extension solves ad blocking at two layers because modern ad networks have moved
from simple script tags to dynamically injected DOM elements and first-party proxied
requests. Declarative network rules handle the simple case: requests to known ad domains
are blocked before they reach the page, which is faster and more privacy-preserving.
The content script handles the hard case: JS-heavy SPAs that inject overlays after
initial load, which network rules cannot catch. The MutationObserver pattern is the key
technique -- it watches the DOM tree in real time and removes matching elements the
moment they appear. Building under MV3 constraints required restructuring from
event-driven to rule-based blocking, which is actually a better architecture since it
moves heavy lifting into the browser engine.
