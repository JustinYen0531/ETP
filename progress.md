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
- Added winner-color confetti on stats reveal and changed the top-left brand label to `ETP_CORE::GAME_SHOW` for a more code-like feel.
- TODO: visually verify the confetti timing and density on the stats screen in a browser session.

- Browser-checked the stats page top alignment via local Vite and Playwright screenshot capture.
