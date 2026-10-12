import { readFileSync } from "node:fs";
import type { Lesson } from "../../src/types/course";
const lessons = JSON.parse(
  readFileSync(
    new URL("../../src/course/lessons.json", import.meta.url),
    "utf8",
  ),
) as Lesson[];
import { test, expect } from "@playwright/test";
test("navigation, lesson progress, notes, hints, skips, and review persist", async ({
  page,
}) => {
  await page.goto("/#/lesson/python-values");
  await expect(
    page.getByRole("heading", {
      name: "Values, collections, and API contracts",
    }),
  ).toBeVisible();
  await page
    .getByLabel("Your field notes")
    .fill("Shared nested dictionaries matter.");
  await page.getByRole("button", { name: "Mark lesson as read" }).click();
  await page.getByRole("button", { name: "Hint 1/4" }).click();
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("Your field notes")).toHaveValue(
    "Shared nested dictionaries matter.",
  );
  await expect(
    page.getByRole("button", { name: "Lesson read ✓ · undo" }),
  ).toBeVisible();
  await page.goto("/#/review");
  await page
    .getByRole("button", { name: "Skipped exercises", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Values, collections, and API contracts",
    }),
  ).toBeVisible();
});
test("answer validation and assessment change mastery", async ({ page }) => {
  await page.goto("/#/lesson/python-values");
  await page.getByLabel("passed", { exact: true }).check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Correct.");
  await page.getByLabel("Set", { exact: true }).check();
  await page.getByRole("button", { name: "Check quiz" }).click();
  await page.getByLabel("Reject or explicitly quarantine the record").check();
  await page.getByRole("button", { name: "Check checkpoint" }).click();
  await page.getByRole("button", { name: "Mark lesson as read" }).click();
  await expect(page.locator(".large-score")).toHaveText("100%");
});
test("search, interview filters, and mobile navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search anything" }).click();
  await page.getByLabel("Search all content").fill("cosine");
  await page
    .getByRole("link", {
      name: "Lesson Cosine similarity from first principles",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Cosine similarity from first principles",
    }),
  ).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("link", { name: "Interview center", exact: true })
      .click();
  } else
    await page
      .getByRole("link", { name: "Interview center", exact: true })
      .click();
  await page.getByLabel("Topic", { exact: true }).selectOption("RAG");
  await expect(page.locator(".question-card")).toHaveCount(20);
  await expect(page.locator(".strong-answer")).toHaveCount(0);
  await page.getByRole("button", { name: "Show answer" }).first().click();
  await expect(
    page.getByRole("heading", { name: "Strong answer", exact: true }),
  ).toBeVisible();
});
test("exports and imports validated progress and rejects corrupt backups", async ({
  page,
}) => {
  await page.goto("/#/settings");
  await page.getByLabel("Your name", { exact: true }).fill("Test Engineer");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress" }).click();
  expect((await download).suggestedFilename()).toBe("ai-sdet-progress.json");
  const p = await page.evaluate(() =>
    localStorage.getItem("sdet-path-progress-v1"),
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(p!),
  });
  await page
    .getByRole("button", { name: "Replace with validated backup" })
    .click();
  await expect(page.getByRole("status")).toContainText("imported successfully");
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":999}'),
  });
  await expect(page.getByRole("status")).toContainText("Import rejected");
});
test("DuckDB executes real queries and checks SQL exercise results", async ({
  page,
}) => {
  await page.goto("/#/lesson/sql-basics");
  await page
    .getByLabel("sql code")
    .fill(
      "SELECT test_id, COUNT(*) AS failures FROM test_runs WHERE status='failed' GROUP BY test_id ORDER BY test_id",
    );
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Correct result.", {
    timeout: 45000,
  });
});
test("layout fits viewport and captures the dashboard", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "A new chapter in your engineering journey.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `docs/dashboard-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
test("Python executes real code and behavior checks", async ({ page }) => {
  test.skip(
    process.env.SKIP_PYTHON_E2E === "1",
    "Requires the public Pyodide CDN.",
  );
  await page.goto("/#/lesson/python-control");
  await page
    .getByLabel("python code")
    .fill(
      'def failed_names(runs):\n    return [r["name"] for r in runs if r["status"] == "failed"]\nprint(failed_names([]))',
    );
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "All behavior checks passed.",
    { timeout: 110000 },
  );
});

test("reference solutions pass every published coding lab", async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const lesson of lessons.filter(
    (l) =>
      l.exercise.kind === "sql" ||
      (l.exercise.kind === "python" && process.env.SKIP_PYTHON_E2E !== "1"),
  )) {
    await page.goto("/#/lesson/" + lesson.id);
    await page
      .getByLabel(lesson.exercise.kind + " code")
      .fill(lesson.exercise.solution!);
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      lesson.exercise.kind === "python"
        ? "All behavior checks passed."
        : "Correct result.",
      { timeout: 110000 },
    );
  }
});
test("lesson table of contents and skip link preserve the route", async ({
  page,
}) => {
  await page.goto("/#/lesson/numpy-cosine");
  await page
    .locator(".toc")
    .getByRole("button", { name: "Normalization and distance" })
    .click();
  await expect(page).toHaveURL(/#\/lesson\/numpy-cosine$/);
  await page.keyboard.press("Tab");
  await page
    .locator(".skip-link")
    .evaluate((node: HTMLElement) => node.click());
  await expect(page.locator("#main")).toBeFocused();
  await expect(page).toHaveURL(/#\/lesson\/numpy-cosine$/);
});

test("mock interview creates six rounds and calculates an explicit self-rating", async ({
  page,
}) => {
  await page.goto("/#/interviews");
  await page
    .getByRole("button", { name: "Mock interview", exact: true })
    .click();
  await page.getByLabel("Role", { exact: true }).selectOption("RAG Engineer");
  await page.getByLabel("Level", { exact: true }).selectOption("Staff");
  await page
    .getByRole("button", { name: "Start session", exact: true })
    .click();
  await expect(page.locator(".mock-interview .question-card")).toHaveCount(6);
  await expect(page.getByLabel("python code")).toBeVisible();
  for (const select of await page.locator(".self-rating select").all())
    await select.selectOption("4");
  await page.getByRole("button", { name: "Finish & score" }).click();
  await expect(
    page.getByRole("heading", { name: "Your practice score: 100%" }),
  ).toBeVisible();
});
