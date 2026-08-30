import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:4173";
const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "shell-1180", width: 1180, height: 900 },
  { name: "laptop-1024", width: 1024, height: 900 },
  { name: "breakpoint-961", width: 961, height: 900 },
  { name: "tablet-768", width: 768, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
];

const server = spawn("python", ["-m", "http.server", "4173", "-d", "dist"], {
  stdio: "ignore",
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await sleep(250);
  }
  throw new Error("Local portfolio server did not start.");
}

let browser;

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const runtimeErrors = [];

    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".selected-card");

    assert.equal(
      await page.locator(".selected-card").count(),
      3,
      `${viewport.name}: expected three selected projects`,
    );
    assert.equal(
      await page.locator(".project-chapter").count(),
      3,
      `${viewport.name}: expected three flagship case studies`,
    );
    assert.equal(
      await page.locator(".rag-journey-card").count(),
      2,
      `${viewport.name}: expected two RAG growth cards`,
    );

    const horizontalOverflow = await page.evaluate(() => ({
      root: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.body.clientWidth,
    }));
    assert.ok(
      horizontalOverflow.root <= 1 && horizontalOverflow.body <= 1,
      `${viewport.name}: horizontal overflow detected (${JSON.stringify(horizontalOverflow)})`,
    );

    await page.waitForFunction(
      () => [...document.querySelectorAll(".selected-image img")]
        .every((img) => img.complete && img.naturalWidth > 0),
      { timeout: 15_000 },
    );

    await page.waitForFunction(
      () => [...document.querySelectorAll(".project-media-frame img, .rag-journey-media img")]
        .every((img) => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0),
      { timeout: 20_000 },
    );

    const brokenProjectMedia = await page.locator(".project-media-frame img, .rag-journey-media img").evaluateAll(
      (images) => images
        .filter((img) => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
        .map((img) => ({ src: img.currentSrc || img.src, alt: img.alt })),
    );
    assert.deepEqual(brokenProjectMedia, [], `${viewport.name}: broken project media`);

    if (viewport.width <= 1100) {
      const hotPod = page.locator(".rag-journey-card").filter({ hasText: "Hot's POD" });
      const columns = await hotPod.locator(".diagram-flow").evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length,
      );
      assert.equal(columns, 1, `${viewport.name}: Hot's POD pipeline should fold to one column`);
    }

    assert.deepEqual(runtimeErrors, [], `${viewport.name}: browser runtime errors`);
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}
