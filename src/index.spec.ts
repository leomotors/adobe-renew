import { expect, test } from "@playwright/test";

import { sendImage, sendMessage } from "./discord";
import { env } from "./env";

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: "screenshot/failure.png", timeout: 5000 });

    await sendImage("Failure", "screenshot/failure.png");
  }
});

test("Automation", async ({ page }) => {
  await page.goto("https://licenseportal.it.chula.ac.th/");

  await page.locator("#UserName").fill(env.USERNAME);
  await page.locator("#Password").fill(env.PASSWORD);
  await page.getByRole("button", { name: " Sign in" }).click();

  await sendMessage(`RUN ${new Date().toLocaleString("th-TH")}`);

  // Check Login Success
  await expect(page.getByRole("heading", { name: env.USERNAME })).toBeVisible();

  // Login Success
  await page.screenshot({ path: "screenshot/2-after-login.png" });
  await sendImage("Login Success", "screenshot/2-after-login.png");

  // Borrow
  await page.getByRole("link", { name: "Borrow" }).click();

  await expect(page.getByRole("heading", { name: "Borrow" })).toBeInViewport();

  await page.locator("#ProgramLicenseID").selectOption("5");

  // Select End Date
  await page.locator("#ExpiryDateStr").click();

  const today = new Date();
  const next7days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const targetDay = next7days.getDate();
  const isSameMonth = next7days.getMonth() === today.getMonth();

  // TODO Handle different year

  if (!isSameMonth) {
    await page.getByRole("link", { name: "" }).first().click();
  }

  await page.getByRole("link", { name: `${targetDay}` }).click();
  await page.getByRole("button", { name: "OK" }).click();

  await page.screenshot({ path: "screenshot/3-before-borrow.png" });
  await sendImage("Before Borrow", "screenshot/3-before-borrow.png");

  await page.getByRole("button", { name: "Save" }).click();

  await page.screenshot({ path: "screenshot/4-after-borrow.png" });
  await sendImage("After Borrow", "screenshot/4-after-borrow.png");
});
