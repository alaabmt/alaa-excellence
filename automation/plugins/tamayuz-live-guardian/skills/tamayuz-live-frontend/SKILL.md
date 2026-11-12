---
name: tamayuz-live-frontend
description: Diagnose and repair Tamayuz Live frontend errors, Android Desktop Site switches, refresh/navigation resets, presenter Widescreen View, audience screens, RTL/LTR and responsive accessibility.
---

# Tamayuz Live frontend and mobile

Primary source: `live/index.html` (static SPA on GitHub Pages), plus shared authentication modules only when needed. Guard the distinction between query-string routes (`?admin=1`, `?presentation=`, `?session=`, `?code=`), browser `sessionStorage`, and authenticated Supabase owner sessions.

## Debug sequence

1. Identify exact role: owner workspace, private presenter, public attendee, widescreen/projector view. Avoid requesting screenshots with secret URL fragments.
2. Trace `render`, `dashboard`, `manage`, `presenterPage`, `audiencePage`, `home`, `stop`, navigation epoch and async callbacks in the **current** source. Do not rely on line numbers or previously observed behavior.
3. Check direct link, refresh, browser Back, Android Desktop Site toggle, orientation, visibility/focus, stale in-flight `join`/`view`/`present` requests and old `?code` links. Treat ended/nonexistent sessions as terminal states, not network failures.
4. Preserve active owner presentation and tab across same-tab reload when feasible, but never elevate privileges from storage or URL. Explicit new links and deliberate Home take precedence; owner view still requires verified login.
5. Keep readable clinical cases, four-or-more choice layouts where applicable, 320px mobile, desktop, Arabic RTL, English LTR, keyboard focus and accessible error status.
6. Presenter controls must not appear to or become callable by the audience; **UI hiding alone is not a security boundary**.

## Verification

- JavaScript syntax; screenshots or browser tests where tools exist; Android/mobile emulation is not proof of a physical device.
- Test fresh owner login, logout/expired login, deep link, refresh, Desktop Site on/off, Home, Widescreen View, presenter question advance, audience QR, waiting/ended/missing session and recovered connection.
- Verify no new repeated joins, unexpected resets, stale timers, double voting or token exposure.
- If no real-device test performed, mark explicitly `NOT VERIFIED ON DEVICE`.
