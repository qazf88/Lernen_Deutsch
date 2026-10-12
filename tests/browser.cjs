'use strict';
// Optional browser suite: npm install --no-save playwright, then npm run test:browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404); res.end(); return;
    }
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'text/plain';
    res.writeHead(200, { 'Content-Type': `${mime}; charset=utf-8` });
    fs.createReadStream(file).pipe(res);
});
let browser;
let checks = 0;
function pass(name) { checks++; console.log(`OK ${checks}: ${name}`); }
async function fillRound(page, incorrectLast = false) {
    const answers = await page.evaluate(() => {
        const test = exerciseGroups.flatMap(group => group.tests).find(test => test.id === document.getElementById('testSelect').value);
        return [...document.querySelectorAll('.task-card')].map(card => {
            const sentence = [...card.querySelector('.sentence').childNodes].map(node => node.nodeType === Node.TEXT_NODE ? node.textContent : '___').join('');
            const hint = card.querySelector('.word-hint')?.textContent || '';
            const item = test.data.find(item => item.sentence === sentence &&
                [test.id === 'nomen' ? '' : item.infinitive, item.ua_infinitiv, item.type].filter(Boolean).join(' · ') === hint);
            if (!item) throw new Error(`Missing exercise: ${sentence}`);
            return DeutschCore.getAnswerVariants(item)[0];
        });
    });
    for (let i = 0; i < answers.length; i++) {
        for (let j = 0; j < answers[i].length; j++) {
            await page.locator(`#q${i}_${j}`).fill(incorrectLast && i === answers.length - 1 ? 'wrong' : answers[i][j]);
        }
    }
}
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}), args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, timezoneId: 'Europe/Berlin' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.waitForSelector('.task-card');
    assert.equal(await page.locator('.task-card').count(), 10);
    pass('initial exercises load on mobile');
    assert.equal(await page.locator('#levelSelect').inputValue(), 'B2');
    assert.equal(await page.locator('#testSelect').inputValue(), 'b2_collocations');
    if (process.env.SCREENSHOT_DIR) {
        fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'b2-mobile.png'), fullPage: true });
    }
    pass('new learners start in the dedicated B2 section');
    await page.selectOption('#countSelect', '5');
    await page.click('#checkButton');
    assert.equal(await page.locator('#score').innerText(), '0 / 5');
    await page.click('#checkButton');
    assert.equal(await page.locator('#score').innerText(), '0 / 5');
    pass('empty answers fail and repeated grading does not inflate score');
    await fillRound(page);
    await page.click('#checkButton');
    assert.equal(await page.locator('.is-correct').count(), 5);
    assert.equal(await page.locator('#score').innerText(), '0 / 5');
    pass('corrections update feedback without rewriting the first attempt');
    await page.click('#newRound');
    await fillRound(page, true);
    await page.click('#checkButton');
    assert.equal(await page.locator('#score').innerText(), '4 / 10');
    await page.click('#retryErrors');
    assert.equal(await page.locator('.task-card').count(), 1);
    assert.equal(await page.locator('.answer-input').first().inputValue(), '');
    await page.click('#checkButton');
    assert.equal(await page.locator('#score').innerText(), '4 / 11');
    pass('only missed exercises enter a fresh retry round');
    await page.reload();
    assert.equal(await page.locator('#score').innerText(), '4 / 11');
    assert.equal(await page.locator('#countSelect').inputValue(), '5');
    pass('score and preferences survive reload');
    await page.click('#resetScore');
    await page.click('#btnNo');
    assert.equal(await page.locator('#score').innerText(), '4 / 11');
    await page.click('#resetScore');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#confirmModal').isVisible(), false);
    await page.click('#resetScore');
    await page.click('#btnYes');
    assert.equal(await page.locator('#score').innerText(), '0 / 0');
    pass('reset requires confirmation and supports cancel/Escape');
    await page.locator('.translation summary').first().click();
    assert.equal(await page.locator('.translation').first().getAttribute('open'), '');
    pass('translation opens by tapping');
    const first = page.locator('.answer-input').first();
    await first.fill('ab');
    await first.evaluate(input => { input.focus(); input.setSelectionRange(1, 2); });
    await page.click('[data-char="ü"]');
    assert.equal(await first.inputValue(), 'aü');
    await first.press('Enter');
    assert.equal(await page.locator('.answer-input').nth(1).evaluate(input => input === document.activeElement), true);
    pass('umlaut key inserts at the caret and Enter advances to the next field');
    await page.fill('#searchInput', 'NOT_A_REAL_WORD_937');
    await page.waitForSelector('.empty-state');
    assert.equal(await page.locator('#checkButton').isDisabled(), true);
    assert.equal(await page.locator('.task-card').count(), 0);
    await page.locator('.empty-state button').click();
    assert.equal(await page.locator('.task-card').count(), 5);
    pass('empty filters have a recovery action and cannot be graded');

    const groups = await page.evaluate(() => exerciseGroups.map(group => ({ id: group.id, tests: group.tests.map(test => ({ id: test.id, size: test.data.length })) })));
    let datasetsChecked = 0;
    for (const group of groups) {
        await page.click(`[data-group="${group.id}"]`);
        for (const test of group.tests) {
            await page.selectOption('#testSelect', test.id);
            await page.selectOption('#levelSelect', 'All');
            await fillRound(page);
            await page.click('#checkButton');
            assert.equal(await page.locator('.is-incorrect').count(), 0, test.id);
            assert.equal(await page.locator('.is-correct').count(), Math.min(5, test.size), test.id);
            datasetsChecked++;
        }
    }
    pass(`correct answers work through the UI for all ${datasetsChecked} datasets`);
    await page.click('[data-group="nouns"]');
    await page.selectOption('#levelSelect', 'A1');
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.task-card')].every(card => {
        const hint = card.querySelector('.word-hint').textContent;
        const word = decodeURIComponent(card.querySelector('.dictionary-link').href.split('/').at(-1));
        return !hint.includes(word);
    })), true);
    await fillRound(page);
    await page.click('#checkButton');
    assert.equal(await page.locator('.is-correct').count(), 5);
    pass('noun exercises keep the German answer hidden at A1 and remain gradable');
    await page.click('[data-group="numbers"]');
    await page.selectOption('#levelSelect', 'C1');
    assert.equal(await page.locator('.task-card').count(), 0);
    assert.equal(await page.locator('#checkButton').isDisabled(), true);
    pass('a genuinely missing level is shown as empty without crashing');
    await page.fill('#searchInput', 'NOT_A_REAL_WORD_938');
    await page.waitForTimeout(350);
    await page.click('#startB2');
    assert.equal(await page.locator('#levelSelect').inputValue(), 'B2');
    assert.equal(await page.locator('#testSelect').inputValue(), 'b2_collocations');
    assert.equal(await page.locator('#searchInput').inputValue(), '');
    assert.equal(await page.locator('.task-card').count(), 5);
    await page.fill('#searchInput', 'abwägen');
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.task-card').count(), 5);
    await fillRound(page);
    await page.click('#checkButton');
    assert.equal(await page.locator('.is-correct').count(), 5);
    pass('B2 shortcut clears incompatible filters and search finds full infinitives behind shortened clues');
    await page.click('[data-group="numbers"]');
    await page.selectOption('#levelSelect', 'All');
    await page.fill('#searchInput', 'Я з');
    await page.waitForTimeout(350);
    assert.ok(await page.locator('.task-card').count() > 0);
    pass('Ukrainian search returns exercises');
    await page.fill('#searchInput', '');
    await page.waitForTimeout(350);
    await page.click('#checkButton');
    for (const width of [320, 375, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const layout = await page.evaluate(() => {
            const last = [...document.querySelectorAll('.task-card')].at(-1).getBoundingClientRect();
            const dock = document.querySelector('.action-dock').getBoundingClientRect();
            return { overflow: document.documentElement.scrollWidth > innerWidth, lastBottom: last.bottom, dockTop: dock.top, dockLeft: dock.left, dockRight: dock.right, width: innerWidth };
        });
        assert.equal(layout.overflow, false, `horizontal overflow at ${width}px`);
        assert.ok(layout.lastBottom <= layout.dockTop, `last exercise hidden by actions at ${width}px`);
        assert.ok(layout.dockLeft >= 0 && layout.dockRight <= layout.width);
    }
    pass('320/375/390/768/1280px layouts fit and the footer does not hide the last exercise');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    if (process.env.SCREENSHOT_DIR) {
        fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'mobile.png'), fullPage: true });
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'desktop.png'), fullPage: true });
    }
    const broken = await browser.newContext();
    await broken.addInitScript(() => {
        Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
        Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    });
    const privatePage = await broken.newPage();
    privatePage.on('pageerror', error => errors.push(error.message));
    await privatePage.goto(url);
    await privatePage.waitForSelector('.task-card');
    await fillRound(privatePage);
    await privatePage.click('#checkButton');
    assert.equal(await privatePage.locator('.is-correct').count(), 10);
    assert.equal(await privatePage.locator('#storageNotice').isVisible(), true);
    pass('blocked localStorage leaves exercises and grading usable');
    const quota = await browser.newContext();
    await quota.addInitScript(() => {
        localStorage.setItem('total_score', '99');
        Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
    });
    const quotaPage = await quota.newPage();
    quotaPage.on('pageerror', error => errors.push(error.message));
    await quotaPage.goto(url);
    await quotaPage.waitForSelector('.task-card');
    assert.equal(await quotaPage.locator('#legacyScore').isVisible(), true);
    await quotaPage.click('#resetScore');
    await quotaPage.click('#btnYes');
    assert.equal(await quotaPage.locator('#legacyScore').isVisible(), false);
    assert.equal(await quotaPage.locator('#score').innerText(), '0 / 0');
    pass('full storage uses fresh in-memory values instead of stale saved values');
    const corrupted = await browser.newContext();
    await corrupted.addInitScript(() => {
        localStorage.setItem('deutsch.score.v2', '{"correct":5,"attempted":-1}');
        localStorage.setItem('deutsch.settings.v2', 'null');
    });
    const badPage = await corrupted.newPage();
    badPage.on('pageerror', error => errors.push(error.message));
    await badPage.goto(url);
    await badPage.waitForSelector('.task-card');
    assert.equal(await badPage.locator('#score').innerText(), '0 / 0');
    pass('corrupted saved state falls back to valid defaults');
    const timing = await browser.newContext({ timezoneId: 'Europe/Berlin' });
    await timing.addInitScript(() => {
        const NativeDate = Date;
        window.testNow = NativeDate.parse('2026-10-12T21:59:58Z');
        window.Date = class extends NativeDate {
            constructor(...args) { super(...(args.length ? args : [window.testNow])); }
            static now() { return window.testNow; }
        };
    });
    const timedPage = await timing.newPage();
    timedPage.on('pageerror', error => errors.push(error.message));
    await timedPage.goto(url);
    await timedPage.waitForSelector('.task-card');
    await timedPage.evaluate(() => {
        window.dispatchEvent(new Event('focus'));
        window.testNow += 5000;
        document.dispatchEvent(new Event('pointerdown'));
    });
    assert.equal(await timedPage.evaluate(() => localStorage.getItem('activeTime_2026-10-12')), '2');
    assert.equal(await timedPage.evaluate(() => localStorage.getItem('activeTime_2026-10-13')), '3');
    pass('study time splits at Berlin local midnight');
    await timedPage.evaluate(() => {
        window.testNow += 300000;
        document.dispatchEvent(new Event('pointerdown'));
    });
    assert.equal(await timedPage.evaluate(() => localStorage.getItem('activeTime_2026-10-13')), '183');
    await timedPage.evaluate(() => {
        window.dispatchEvent(new Event('blur'));
        window.testNow += 60000;
        window.dispatchEvent(new Event('focus'));
    });
    assert.equal(await timedPage.evaluate(() => localStorage.getItem('activeTime_2026-10-13')), '183');
    pass('idle time is capped at three minutes and blurred windows do not add time');
    assert.deepEqual(errors, []);
    pass('no browser runtime errors');
    console.log(`Browser suite: ${checks} checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
    if (browser) await browser.close();
    server.close();
});
