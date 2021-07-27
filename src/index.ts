import path from 'path';
import puppeteer, { Page } from 'puppeteer';

async function importLibsToPage(page: Page): Promise<void> {
    await page.addScriptTag({
        path: path.resolve('dist/browser-imports.js'),
    });
}

export async function run() {
    await puppeteer.launch({ headless: false, defaultViewport: null }).then(async (browser) => {
        const page = await browser.newPage();
        // await page.goto('https://www.washington.edu/accesscomputing/AU/after.html');
        await page.goto('https://accessibility.18f.gov/keyboard/#');

        await importLibsToPage(page);

        let data = {
            isFinished: false,
            tabCount: 0,
            focusableCount: 0,
            nextNonTrapElementSelector: '',
            nextNonTrapElementIndex: null,
            attemptedNonTrapFocusIndex: null,
            greatestFocusedIndex: 0,
            tags: ['data-a11y-focus-index', 'data-a11y-focused', 'data-a11y-trap'],
        };

        await page.keyboard.press('Tab');

        data.focusableCount = await page.evaluate(() => {
            // inject tabbable to get the focusable elements
            // @ts-ignore
            const focusableElements = injectedLibraries.tabbable(document);
            console.log(focusableElements);
            let focusableCount = 0;
            // set data attribute to denote focuasable elements
            for (let element of focusableElements) {
                element.setAttribute('data-a11y-focus-index', focusableCount);
                focusableCount++;
            }
            return Promise.resolve(focusableCount);
        });

        console.log(`focusableCount: ${data.focusableCount}`);

        do {
            await page.keyboard.press('Tab');
            data = await page.evaluate((data) => {
                console.log(`tab count: ${data.tabCount}`);
                console.log(document.activeElement);

                //////////// START Handle Keyboard Trap ///////////
                ////////////////////////////////////////////////////////
                if (document.activeElement?.getAttribute('data-a11y-focused') == 'true') {
                    // if data-a11y-trap is true, find the next focusable element that doesn't have the data-a11y-trap attribute, focus it, and continue on document.
                    // after you'll want to remove the tab count limit of 50 that is currently set below.
                    if (document.activeElement?.getAttribute('data-a11y-trap') == 'true') {
                        console.log('find next non-trap element');
                        let currentFocusIndexString = document.activeElement?.getAttribute('data-a11y-focus-index');
                        if (currentFocusIndexString != null) {
                            let currentFocusIndex = parseInt(currentFocusIndexString);
                            while (currentFocusIndex != data.focusableCount) {
                                if (currentFocusIndex == data.focusableCount - 1) {
                                    // Focus trap on last focusable element, so we're done scanning.
                                    return Promise.resolve(data);
                                }
                                let nextFocusableIndex = currentFocusIndex + 1;
                                if (nextFocusableIndex == data.attemptedNonTrapFocusIndex) {
                                    nextFocusableIndex++;
                                }
                                console.log(nextFocusableIndex);
                                let nextNonTrapElement = document.querySelector(
                                    `[data-a11y-focus-index="${nextFocusableIndex}"]:not([data-a11y-trap])`,
                                );

                                if (nextNonTrapElement != null) {
                                    console.log('next non-trap element');
                                    console.log(nextNonTrapElement);
                                    data.nextNonTrapElementIndex = nextFocusableIndex;
                                    data.nextNonTrapElementSelector = `[data-a11y-focus-index="${nextFocusableIndex}"]`;
                                    break;
                                }
                                currentFocusIndex++;
                            }
                        }
                    }

                    document.activeElement?.setAttribute('style', 'border: 5px solid red');

                    document.activeElement?.setAttribute('data-a11y-trap', 'true');
                }
                //////////// END Handle Keyboard Trap ////////////
                ////////////////////////////////////////////////////////

                // mark element as focused
                document.activeElement?.setAttribute('data-a11y-focused', 'true');

                const focusableIndex = document.activeElement?.getAttribute('data-a11y-focus-index');

                // Check to see if we've reached the last focusable element, if not return (and continue loop), if so then return (and end loop).
                if (document.activeElement?.getAttribute('data-a11y-focus-index') !== '0') {
                    if (focusableIndex !== null && focusableIndex !== undefined) {
                        if (focusableIndex > data.greatestFocusedIndex) {
                            data.greatestFocusedIndex = focusableIndex;
                        }
                    }
                    return Promise.resolve(data);
                }
                data.isFinished = true;
                return Promise.resolve(data);
            }, data);
            data.tabCount++;

            // try to focus next element after keyboard trap
            if (data.nextNonTrapElementSelector.length > 0) {
                console.log('trying to focus next element after keyboard trap');
                console.log(data.nextNonTrapElementSelector);
                const focusedElement = await page.focus(data.nextNonTrapElementSelector);
                data.attemptedNonTrapFocusIndex = data.nextNonTrapElementIndex;
                data.nextNonTrapElementSelector = '';
            }
            // I've set a limit of 1000 tabs here, this can be removed, but it's a fallback for now.
        } while (data.isFinished === false && data.tabCount < 1000);

        //identify elements with focus index but no data-a11y-focused attribute
        await page.evaluate(() => {
            const nonFocusedElements = document.querySelectorAll('[data-a11y-focus-index]:not([data-a11y-focused])');
            for (let i = 0; i < nonFocusedElements.length; i++) {
                nonFocusedElements[i].setAttribute('style', 'border: 5px solid purple');
            }
        });

        //clean up injected data attributes
        await page.evaluate((data) => {
            data.tags.forEach((tag: string) => {
                const elements = document.querySelectorAll(`[${tag}]`);
                console.log(elements);
                for (let i = 0; i < elements.length; i++) {
                    elements[i].removeAttribute(tag);
                }
            });
        }, data);

        console.log(`tabCount: ${data.tabCount}`);

        const tabsMatchFocusable = data.tabCount === data.focusableCount + 1;

        // if number of tabs matches the number of focusable elements, turn green, else turn red.
        await page.evaluate((tabsMatchFocusable) => {
            if (tabsMatchFocusable) {
                document.body.setAttribute('style', 'border: 10px solid green');
            } else {
                document.body.setAttribute('style', 'border: 10px solid red');
            }
        }, tabsMatchFocusable);
    });
}

run();
