const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:3002';
const OUT = path.join(__dirname, 'output');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const screenshot = async (page, name) => {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log(`📸 ${name}.png`);
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  // Increase default timeout
  page.setDefaultTimeout(15000);

  let passed = 0;
  let failed = 0;
  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ ${name}: ${err.message}`);
      failed++;
      await screenshot(page, `fail-${name.replace(/\s+/g, '-')}`);
    }
  };

  // ── 1. App loads ──
  await test('App loads and shows login modal', async () => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await wait(800);
    await screenshot(page, '01-app-load');
    const modal = await page.locator('text=Welcome Back').first();
    if (!await modal.isVisible().catch(() => false)) throw new Error('Login modal not visible');
  });

  // ── 2. Register & Login ──
  await test('Register new account', async () => {
    await page.click('text=Register');
    await wait(400);
    await screenshot(page, '02-register-form');
    await page.fill('input[placeholder="Enter username"]', `smoke${Date.now()}`);
    await page.fill('input[placeholder="Enter password"]', 'smokepass123');
    await page.click('button:has-text("Create Account")');
    await wait(1200);
    await screenshot(page, '03-logged-in');
    // After register/login, should see main layout with sidebar
    const sidebar = await page.locator('text=AGENTS').first();
    if (!await sidebar.isVisible().catch(() => false)) throw new Error('Main layout not visible after login');
  });

  // ── 3. Home / Chat ──
  await test('Home page chat interaction', async () => {
    await page.click('text=Home');
    await wait(600);
    await screenshot(page, '04-home-chat');
    const input = page.locator('input[placeholder="Ask anything, create anything"]');
    await input.fill('Hello from smoke test');
    await page.click('button:has-text("Speak")');
    await wait(2000);
    await screenshot(page, '05-chat-response');
    const bubbles = await page.locator('.markdown-body').count();
    if (bubbles < 1) throw new Error('No assistant bubbles rendered');
  });

  // ── 4. Agents page ──
  await test('Agents page loads with cards', async () => {
    await page.click('text=Agents');
    await wait(800);
    await screenshot(page, '06-agents-page');
    const cards = await page.locator('.panel').count();
    if (cards < 1) throw new Error('No agent cards found');
    const nucleus = await page.locator('text=Nucleus').first();
    if (!await nucleus.isVisible().catch(() => false)) throw new Error('Nucleus card not found');
  });

  // ── 5. Agent CRUD (open new agent modal) ──
  await test('Agent editor modal opens', async () => {
    await page.click('button:has-text("New Agent")');
    await wait(400);
    await screenshot(page, '07-agent-modal');
    const modal = await page.locator('text=New Agent').first();
    if (!await modal.isVisible().catch(() => false)) throw new Error('New Agent modal not visible');
    await page.locator('button[aria-label="Close"]').click().catch(() => {});
    await wait(200);
  });

  // ── 6. Workflows page ──
  await test('Workflows page loads', async () => {
    await page.click('text=Workflows');
    await wait(800);
    await screenshot(page, '08-workflows-page');
    const title = await page.locator('text=Workflows').first();
    if (!await title.isVisible().catch(() => false)) throw new Error('Workflows page not loaded');
  });

  // ── 7. Workflow designer opens ──
  await test('Workflow designer opens', async () => {
    await page.click('button:has-text("New Workflow")');
    await wait(800);
    await screenshot(page, '09-workflow-designer');
    const backBtn = await page.locator('text=Back').first();
    if (!await backBtn.isVisible().catch(() => false)) throw new Error('Designer toolbar not visible');
    // Add a node
    await page.click('button:has-text("Start")');
    await wait(300);
    await screenshot(page, '10-designer-node-added');
    const nodes = await page.locator('[style*="position: absolute"]').count();
    if (nodes < 1) throw new Error('Node not added to canvas');
    // Go back
    await page.click('text=Back');
    await wait(500);
  });

  // ── 10. File upload UI exists ──
  await test('File upload button present on Home', async () => {
    await page.click('text=Home');
    await wait(500);
    const attach = await page.locator('button[aria-label="Add attachment"]').first();
    if (!await attach.isVisible().catch(() => false)) throw new Error('Attachment button not found');
  });

  // ── 11. Logout ──
  await test('Logout returns to login', async () => {
    await page.click('text=More');
    await wait(400);
    await page.click('button:has-text("Sign Out")');
    await wait(800);
    await screenshot(page, '13-logout');
    const modal = await page.locator('text=Welcome Back').first();
    if (!await modal.isVisible().catch(() => false)) throw new Error('Login modal not shown after logout');
  });

  await browser.close();

  console.log('\n' + '='.repeat(40));
  console.log(`SMOKE TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`Screenshots saved to: ${OUT}`);
  console.log('='.repeat(40));
  process.exit(failed > 0 ? 1 : 0);
})();
