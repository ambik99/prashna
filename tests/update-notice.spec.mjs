import { test, expect } from "@playwright/test";
import { waitForOfflineCopy } from "./helpers.mjs";

// The app page as a new deployment would serve it: the same page with a
// different title, so a teacher can tell which version is open.
const NEW_TITLE = "Prashna (new version)";

// Simulates deploying a changed app: from now on the server answers the app
// page with the new version. The offline copy's background download goes
// through these routes too.
async function deployNewVersion(context) {
  await context.route(/\/app\/(index\.html)?(\?.*)?$/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace("<title>Prashna</title>", `<title>${NEW_TITLE}</title>`);
    await route.fulfill({ response, body });
  });
}

// The teacher switches to another app and comes back to Prashna.
async function returnToApp(page) {
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
}

const updateNotice = (page) => page.getByRole("status").filter({ hasText: "New version available" });

test.describe("update notice", () => {
  // The offline copy is what notices a new deployment, so let it run.
  test.use({ serviceWorkers: "allow" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/app/");
    await waitForOfflineCopy(page);
  });

  test("a new deployment shows the notice without reloading the app", async ({ page, context }) => {
    // Half-typed work that a reload would lose.
    await page.getByLabel("Question Text").fill("Half-typed question");
    let reloads = 0;
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) reloads++;
    });

    await deployNewVersion(context);
    await returnToApp(page);

    await expect(updateNotice(page)).toBeVisible();
    await expect(updateNotice(page).getByRole("button", { name: "Refresh" })).toBeVisible();

    // Ignoring the notice leaves the session as it was.
    await page.waitForTimeout(500);
    expect(reloads).toBe(0);
    await expect(page).toHaveTitle("Prashna");
    await expect(page.getByLabel("Question Text")).toHaveValue("Half-typed question");
  });

  test("choosing Refresh opens the new version", async ({ page, context }) => {
    await deployNewVersion(context);
    await returnToApp(page);

    await updateNotice(page).getByRole("button", { name: "Refresh" }).click();
    await expect(page).toHaveTitle(NEW_TITLE);
    await expect(updateNotice(page)).toBeHidden();
  });

  test("the notice can be put away until later", async ({ page, context }) => {
    await deployNewVersion(context);
    await returnToApp(page);

    await updateNotice(page).getByRole("button", { name: "Later" }).click();
    await expect(updateNotice(page)).toBeHidden();
    await expect(page).toHaveTitle("Prashna");
  });

  test("no notice when nothing new has been deployed", async ({ page }) => {
    await returnToApp(page);
    await page.reload();
    await returnToApp(page);
    // Give the background check time to finish.
    await page.waitForTimeout(1500);
    await expect(updateNotice(page)).toBeHidden();
  });
});
