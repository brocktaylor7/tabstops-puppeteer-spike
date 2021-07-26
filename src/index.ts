import path from "path";
import puppeteer, { Page } from "puppeteer";

async function importLibsToPage(page: Page): Promise<void> {
  await page.addScriptTag({
    path: path.resolve("dist/browser-imports.js"),
  });
}

export async function run() {
  await puppeteer.launch({ headless: false }).then(async (browser) => {
    const page = await browser.newPage();
    // await page.goto("https://www.washington.edu/accesscomputing/AU/after.html");
    await page.goto("https://accessibility.18f.gov/keyboard/#");

    await importLibsToPage(page);

    let data = {
      isFinished: false,
      tabCount: 0,
      greatestFocusableIndex: 0,
    };

    await page.keyboard.press("Tab");

    const focusableCount = await page.evaluate(() => {
      // @ts-ignore
      const focusableElements = injectedLibraries.tabbable(document);
      console.log(focusableElements);
      let focusableCount = 0;
      for (let element of focusableElements) {
        element.setAttribute("data-a11y-focusable", focusableCount);
        focusableCount++;
      }
      return Promise.resolve(focusableCount);
    });

    console.log(`focusableCount: ${focusableCount}`);

    do {
      await page.keyboard.press("Tab");
      data = await page.evaluate((data) => {
        console.log(`tab count: ${data.tabCount}`);
        console.log(document.activeElement);

        const focusableIndex = document.activeElement?.getAttribute(
          "data-a11y-focusable"
        );
        console.log("focusableIndex");
        console.log(focusableIndex);

        if (
          document.activeElement?.getAttribute("data-a11y-focusable") !== "0"
        ) {
          if (focusableIndex !== null && focusableIndex !== undefined) {
            if (focusableIndex < data.greatestFocusableIndex) {
              console.log("discrepancy!");
              console.log(focusableIndex);
              console.log(data.greatestFocusableIndex);
              console.log("discrepancy end!+++++++++++++++++++");
              document.activeElement?.setAttribute(
                "style",
                "border: 5px solid red"
              );
            } else {
              data.greatestFocusableIndex = focusableIndex;
            }
          }

          return Promise.resolve(data);
        }
        data.isFinished = true;
        return Promise.resolve(data);
      }, data);
      data.tabCount++;
    } while (data.isFinished === false && data.tabCount < 50);

    console.log(`tabCount: ${data.tabCount}`);

    const tabsMatchFocusable = data.tabCount === focusableCount + 1;

    await page.evaluate((tabsMatchFocusable) => {
      if (tabsMatchFocusable) {
        document.body.setAttribute("style", "border: 10px solid green");
      } else {
        document.body.setAttribute("style", "border: 10px solid red");
      }
    }, tabsMatchFocusable);
  });
}

run();
