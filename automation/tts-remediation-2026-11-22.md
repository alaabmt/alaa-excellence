# Tamayuz 10X — TTS remediation evidence (2026-11-22)

## Reported acceptance results (user observation, browser/device not identified)
- PASS: starts at article H1; visible segment highlighting; speed changes during normal playback; floating bar visible on scroll.
- FAIL: pause and resume; combined stop/references test.
- IMPORTANT: combined test cannot prove whether Stop, reference exclusion, or both failed individually. Treat both as needing separate re-test.
- No verified Arabic+English/device matrix has yet been supplied. Production acoustic verification remains NOT VERIFIED.

## Code correction on the 2026-11-22 TTS fix branch
1. Shared player records word boundaries for recovery; retains native pause/resume, detects a pause ignored by the engine and can resume from the last reported boundary.
2. Changing speed during a pause no longer leaves a canceled utterance to resume; it rebuilds speech from the saved word boundary.
3. Stop cancels the utterance, clears timers, UI controls and visual highlight.
4. The speech segment collector stops at explicit Arabic/English reference headings even without a special wrapper class; editorial, author and navigation elements are excluded.
5. Obsolete inline speech buttons are retired if the shared player is available. The Brazil case Arabic/English editions no longer register a separate inline player.
6. A deterministic mock-engine suite is available: `node --test tests/tts-reader-regression.test.cjs`.

## Boundaries and pending acceptance gates
The automated checks exercise source behavior with a mocked Web Speech API, NOT actual audible speech. The user/device must test Arabic and English individually, including native pause/resume, changing speed while paused, floating controls, immediate Stop, and reaching the end without reading references or share widgets. Record browser version, device, language, URL, tester and outcome. Mobile visual and pronunciation quality remain distinct gates.

Do not mark any scheduled editorial workflow completed, bypass its gate, or republish an existing article solely because this code was updated. Reconcile the relevant state files and any live deployment after merge and a verified playback test.

## Follow-up repair: Resume still inactive on user device (2026-11-22)

The user reported that **متابعة الاستماع** remained ineffective after the first deployment. Inspection showed the prior fallback only retried when `speechSynthesis.speaking` or `.paused` changed. A browser that reports normal flags but produces no audio after `resume()` escapes that recovery. In addition, SWELancer pages still used a pre-repair script URL version and could load a cached copy.

### Change
- Pause now cancels the active speech utterance, invalidating stale `onend` callbacks.
- Resume explicitly creates and speaks a **new** utterance on the user's next click instead of depending on native `resume()`.
- Word-boundary events preserve the current word when supplied; sentence segmentation limits rewind to the current sentence when a device does not provide boundaries.
- The top player and floating player share the same state and resume action.
- The speed selector and Stop behavior are covered by regression tests.
- SWELancer and Brazil case pages in both languages use a new versioned reader URL to avoid a stale cached JS file.
- Run: `node --test tests/tts-reader-regression.test.cjs`. Six synthetic checks passed in an isolated JS test environment.

### Acceptance status
**NOT VERIFIED** on the user's live browser. The owner must confirm audible output after Pause → Resume, preserved progress as available, mobile floating controls, Stop, no references, both Arabic and English. Do not mark blocked editorial workflows completed until actual device verification and other pending gates are documented.
