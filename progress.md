Original prompt: 設計幾個棋子,然後在投骰子的時候,就會進行移動。你可以分為四個棋子,分別為Alpha、Beta等等,然後每骰出一個點數它就會進行移動。 然後到時候只能回答這個題目,中間就會出現一個大大的回答題目的按鈕。

- Added round-status card on the right and score-ledger cards on the left.
- Current task: add visible team tokens, animate dice-based movement, and replace free-form answer access with a single large center CTA for the landed tile.
- TODO: verify token stacking when multiple teams share a tile.
- TODO: verify special tiles do not expose the answer CTA.
- Implemented visible four-team tokens that render on tiles and move step-by-step after each dice roll.
- Added a large center "ANSWER TILE" CTA that appears only after movement completes and only for question tiles.
- Syntax-checked `js/game.js` and `js/data.js` with Node parser.
- TODO: browser-test token motion and answer CTA flow in Vite once a visual run is available.
- End-game flow now routes to the top of the stats screen instead of landing mid-page.
- Added winner-color confetti on stats reveal.
- Replaced code-style and Chinese UI labels on the visible screens with plain English copy.
- TODO: visually verify the confetti timing and density on the stats screen in a browser session.

- Browser-checked the stats page top alignment via local Vite and Playwright screenshot capture.

- Replaced code-style labels and remaining Chinese UI copy with plain English, then browser-checked the stats and board screens.
- Updated movement so max-level subject tiles are removed from the step path itself; they no longer count toward movement distance or get passed through.

- Changed movement so max-level subject tiles are removed from the route traversal itself and verified the helper with a local logic check.
- Added active-game navigation locks so Home, Teams, and Stats cannot be opened by mistake from the board HUD or top bar.
- Tightened top navigation into a linear flow so tabs can only be opened one step at a time from left to right.

- Changed the top bar into a display-only progress indicator so screen changes must come from the designed page buttons.

- Added a Home screen How to Play button and guide modal based on the Game design notes.

- Reworked the How to Play guide into a four-page slide-style modal with tabs and previous/next controls.

- Compressed the How to Play slide typography and spacing to reduce the need for vertical scrolling.

- Fixed the final How to Play button so Done stays clickable and closes the guide.
- Matched the Home CTA button sizes and locked Proceed to Board until team randomization has been completed.
- Added a `noindex, nofollow` robots meta tag to reduce search engine indexing of the site.
