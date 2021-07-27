# Tabstops Puppeteer Spike POC

## Overview

This is a proof of concept to show that we can use [Puppeteer](https://github.com/puppeteer/puppeteer) in the service to automatically detect certain keyboard navigation accessibility issues. Puppeteer allows us to send native keyboard events to the browser, allowing us to simulate user input in a way that we can't achieve with the chrome extension due to the following limitation:

From https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent:

> Note: Manually firing an event does not generate the default action associated with that event. For example, manually firing a key event does not cause that letter to appear in a focused text input. In the case of UI events, this is important for security reasons, as it prevents scripts from simulating user actions that interact with the browser itself.

This POC currently detects the following (data attributes added for easy/accessible querying):

-   Keyboard focus traps (elements outlined in red, and also receive the `data-a11y-trap` attribute)
    -   Note: A mechanism is built-in to break out of the keyboard traps to continue testing the rest of the page
-   Elements that should be able to receive focus, but are not reachable via standard keyboard navigation (elements outlined in purple and also receive the `data-a11y-expected-focus-not-received` attribute).
-   Whether the page has the same number of focusable elements as is expected from the DOM. (Outlines the body in green if so, and red if not. The document body also recieves the `data-tabstops-match-focusable-count` attribute with a value of `true` or `false`).

## Build/Run

### Prerequisites

You will need to have node.js and npm installed. During development I was using node v12.13.0 and npm 6.12.0.

### Build Steps

-   Install packages using `npm install`
-   Install rollup globally: `npm install -g rollup`
-   bundle the tabbable library using rollup: `rollup -c`
    -   The `-c` flag is used to tell rollup to use the `rollup.config.js` configuration file.
    -   This only needs to be done once, unless additional libraries need to be injected into the browser page. Currently only the [tabbable](https://github.com/focus-trap/tabbable) library is injected.
-   bundle the typescript: `npx tsc`
    -   Alternatively, for development you can do `npx tsc -w` to watch for changes and rebuild.

### Run

Once you have completed the build steps above, you can run the application using `node dist/index.js`.
