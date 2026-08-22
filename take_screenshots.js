const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to app...");

  const takeScreenshot = async (path, filename) => {
    try {
      await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle2', timeout: 10000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: `docs/screenshots/${filename}` });
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.log(`Failed to screenshot ${path}: ${e.message}`);
    }
  };

  // 1. Login / Dashboard
  await takeScreenshot('/login', '1-login.png');
  await takeScreenshot('/dashboard', '1-dashboard.png');

  // 2. Requirements CRUD
  await takeScreenshot('/projects/test/requirements', '2-requirements.png');

  // 3. Requirement Version History
  await takeScreenshot('/projects/test/requirements/1', '3-req-history.png');

  // 4. 5-Phase Planning
  await takeScreenshot('/projects/test/planning', '4-planning.png');

  // 5. AI Task Generation / Task Review
  await takeScreenshot('/projects/test/tasks/generate', '5-task-generation.png');

  // 6. Developer Recommendation (might be on task page)
  await takeScreenshot('/projects/test/tasks', '6-dev-recommendation.png');

  // 7. Kanban Board
  await takeScreenshot('/projects/test/board', '7-kanban.png');

  await browser.close();
  console.log("Done.");
})();
