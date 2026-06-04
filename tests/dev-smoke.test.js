import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://127.0.0.1:5173';
const OUT = 'C:\\Users\\mrlyd\\Desktop\\ai-assistant-ui-replica\\react-blueprint\\tests\\screenshots';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const screenshot = async (page, name) => {
  await page.screenshot({ path: `${OUT}\\${name}.png`, fullPage: false });
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.setDefaultTimeout(15000);

  let passed = 0, failed = 0;
  const test = async (name, fn) => {
    try { await fn(); console.log(`✅ ${name}`); passed++; }
    catch (err) { console.error(`❌ ${name}: ${err.message}`); failed++; await screenshot(page, `fail-${name}`); }
  };

  await test('Dev server loads login modal', async () => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await wait(1000);
    await screenshot(page, '01-dev-login');
    const modal = await page.locator('text=Welcome Back').first();
    if (!await modal.isVisible().catch(() => false)) throw new Error('No login modal');
  });

  await test('Register and login through dev stack', async () => {
    await page.click('text=Register');
    await wait(300);
    await page.fill('input[placeholder="Enter username"]', `devuser${Date.now()}`);
    await page.fill('input[placeholder="Enter password"]', 'devpass123');
    await page.click('button:has-text("Create Account")');
    await wait(1200);
    await screenshot(page, '02-dev-logged-in');
    const sidebar = await page.locator('text=AGENTS').first();
    if (!await sidebar.isVisible().catch(() => false)) throw new Error('Sidebar not visible');
  });

  await test('Chat works through dev proxy', async () => {
    await page.click('text=Home');
    await wait(500);
    await page.fill('input[placeholder="Ask anything, create anything"]', 'Dev server test');
    await page.click('button:has-text("Speak")');
    await wait(2500);
    await screenshot(page, '03-dev-chat');
    const bubbles = await page.locator('.markdown-body').count();
    if (bubbles < 1) throw new Error('No chat response');
  });

  await test('Agent CRUD on dev', async () => {
    await page.click('text=Agents');
    await wait(800);
    await page.click('button:has-text("New Agent")');
    await wait(400);
    await screenshot(page, '04-dev-agent-modal');
    const modal = await page.locator('text=New Agent').first();
    if (!await modal.isVisible().catch(() => false)) throw new Error('Modal not open');
    await page.click('button[aria-label="Close"]').catch(() => {});
    await wait(200);
  });

  await test('Workflow designer on dev', async () => {
    await page.click('text=Workflows');
    await wait(600);
    await page.click('button:has-text("New Workflow")');
    await wait(800);
    await screenshot(page, '05-dev-designer');
    await page.click('button:has-text("Start")');
    await wait(300);
    const back = await page.locator('text=Back').first();
    if (!await back.isVisible().catch(() => false)) throw new Error('Designer not loaded');
    await page.click('text=Back');
    await wait(400);
  });

  await browser.close();
  console.log(`\n📊 DEV SMOKE: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
