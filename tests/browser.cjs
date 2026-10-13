'use strict';
// Optional developer check: node tests/browser.cjs with an available Playwright module.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const basePath = '/Lernen_Deutsch/';
const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    if (pathname === basePath.slice(0, -1)) {
        res.writeHead(301, { Location: basePath }); res.end(); return;
    }
    if (!pathname.startsWith(basePath)) {
        res.writeHead(404); res.end(); return;
    }
    const relativePath = pathname.slice(basePath.length) || 'index.html';
    const file = path.resolve(root, relativePath);
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
    const url = `http://127.0.0.1:${server.address().port}${basePath.slice(0, -1)}`;
    browser = await chromium.launch({ headless: true, ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}), args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, timezoneId: 'Europe/Berlin' });
    const page = await context.newPage();
    const errors = [];
    const failedRequests = [];
    context.on('requestfailed', request => failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`));
    context.on('response', response => {
        if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    assert.equal(new URL(page.url()).pathname, basePath);
    await page.waitForSelector('.task-card');
    assert.equal(await page.locator('.task-card').count(), 10);
    pass('initial exercises load on mobile under the GitHub Pages repository path');
    assert.equal(await page.locator('#levelSelect').inputValue(), 'C1');
    assert.equal(await page.locator('#testSelect').inputValue(), 'c1_cohesion');
    assert.equal(await page.locator('.goal-banner').count(), 0);
    assert.match(await page.locator('.page-footer').innerText(), /Goethe-Zertifikat C1/);
    if (process.env.SCREENSHOT_DIR) {
        fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'advanced-mobile.png'), fullPage: true });
    }
    pass('new learners get C1 exercises without a prominent exam banner');
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
            const expectedLevels = await page.evaluate(id => {
                const dataset = exerciseGroups.flatMap(group => group.tests).find(test => test.id === id);
                return ['All', ...['A1', 'A2', 'B1', 'B2', 'C1'].filter(level => dataset.data.some(item => item.level === level))];
            }, test.id);
            assert.deepEqual(await page.locator('#levelSelect option').evaluateAll(options => options.map(option => option.value)), expectedLevels, test.id);
            await page.selectOption('#levelSelect', 'All');
            await fillRound(page);
            await page.click('#checkButton');
            assert.equal(await page.locator('.is-incorrect').count(), 0, test.id);
            assert.equal(await page.locator('.is-correct').count(), Math.min(5, test.size), test.id);
            datasetsChecked++;
        }
    }
    pass(`correct answers work through the UI for all ${datasetsChecked} datasets`);
    pass('every test displays exactly the levels that have exercises');
    await page.click('[data-group="verbs"]');
    await page.selectOption('#testSelect', 'praesens');
    await page.selectOption('#levelSelect', 'A1');
    await page.selectOption('#testSelect', 'futur1');
    assert.deepEqual(await page.locator('#levelSelect option').evaluateAll(options => options.map(option => option.value)), ['All', 'B1', 'B2']);
    assert.equal(await page.locator('#levelSelect').inputValue(), 'All');
    assert.equal(await page.locator('.task-card').count(), 5);
    await page.reload();
    assert.equal(await page.locator('#testSelect').inputValue(), 'futur1');
    assert.deepEqual(await page.locator('#levelSelect option').evaluateAll(options => options.map(option => option.value)), ['All', 'B1', 'B2']);
    await page.selectOption('#levelSelect', 'B2');
    await page.selectOption('#testSelect', 'futur2');
    assert.deepEqual(await page.locator('#levelSelect option').evaluateAll(options => options.map(option => option.value)), ['All', 'B2']);
    assert.equal(await page.locator('#levelSelect').inputValue(), 'B2');
    pass('Futur I/II hide missing levels after switching and reloading');
    const grammarAdditions = await page.evaluate(() => Object.entries({ ...grammar_refresh, ...pronoun_refresh }).map(([id, data]) => ({
        id, group: exerciseGroups.find(group => group.tests.some(test => test.id === id)).id,
        levels: ['A1', 'A2', 'B1', 'B2', 'C1'].map(level => ({ level, hint: data.find(item => item.level === level).ua_infinitiv }))
    })));
    await page.selectOption('#countSelect', '20');
    for (const addition of grammarAdditions) {
        await page.click(`[data-group="${addition.group}"]`);
        await page.selectOption('#testSelect', addition.id);
        for (const { level, hint } of addition.levels) {
            await page.selectOption('#levelSelect', level);
            await page.fill('#searchInput', hint);
            await page.waitForTimeout(350);
            assert.match(await page.locator('#availableCount').innerText(), /25 вправ/);
            assert.equal(await page.locator('.task-card').count(), 20);
            await fillRound(page);
            await page.click('#checkButton');
            assert.equal(await page.locator('.is-correct').count(), 20, `${addition.id}/${level}`);
        }
        pass(`new grammar exercises work at every level in ${addition.id}`);
    }
    await page.click('[data-group="connections"]');
    await page.setViewportSize({ width: 320, height: 900 });
    const connectionIds = await page.evaluate(() => exerciseGroups.find(group => group.id === 'connections').tests.map(test => test.id));
    for (const id of connectionIds) {
        await page.selectOption('#testSelect', id);
        for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
            await page.selectOption('#levelSelect', level);
            assert.equal(await page.locator('.task-card').count(), 20, `${id}/${level}`);
            assert.equal(await page.evaluate(level => [...document.querySelectorAll('.task-heading .badge')].every(badge => badge.textContent === level), level), true);
            await fillRound(page);
            await page.click('#checkButton');
            assert.equal(await page.locator('.is-incorrect').count(), 0, `${id}/${level}`);
            assert.equal(await page.locator('.is-correct').count(), 20, `${id}/${level}`);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${id}/${level}: overflow at 320px`);
        }
        pass(`all 100 question/link/time exercises grade correctly at every level in ${id}`);
    }
    await page.fill('#searchInput', 'unverzüglich');
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.task-card').count(), 1);
    await fillRound(page);
    await page.click('#checkButton');
    assert.equal(await page.locator('.is-correct').count(), 1);
    pass('search finds complete new German time expressions behind shortened clues');
    await page.click('[data-group="practice"]');
    await page.selectOption('#countSelect', '20');
    await page.setViewportSize({ width: 320, height: 900 });
    const practiceIds = await page.evaluate(() => exerciseGroups.find(group => group.id === 'practice').tests.map(test => test.id));
    for (const id of practiceIds) {
        await page.selectOption('#testSelect', id);
        for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
            await page.selectOption('#levelSelect', level);
            assert.equal(await page.locator('.task-card').count(), 20, `${id}/${level}`);
            assert.equal(await page.evaluate(level => [...document.querySelectorAll('.task-heading .badge')].every(badge => badge.textContent === level), level), true);
            await fillRound(page);
            await page.click('#checkButton');
            assert.equal(await page.locator('.is-incorrect').count(), 0, `${id}/${level}`);
            assert.equal(await page.locator('.is-correct').count(), 20, `${id}/${level}`);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${id}/${level}: overflow at 320px`);
        }
        pass(`all 100 new exercises grade correctly at A1/A2/B1/B2/C1 in ${id}`);
        if (id === 'sentence_order') {
            assert.equal(await page.locator('textarea.sentence-answer').count(), 20);
            assert.equal(await page.evaluate(() => [...document.querySelectorAll('.sentence-answer')].every(input => input.scrollHeight <= input.clientHeight + 1)), true);
            const sentence = page.locator('.sentence-answer').first();
            await sentence.fill('ab');
            await sentence.evaluate(input => { input.focus(); input.setSelectionRange(1, 2); });
            await page.click('[data-char="ä"]');
            assert.equal(await sentence.inputValue(), 'aä');
            await sentence.press('Enter');
            assert.equal(await page.locator('.sentence-answer').nth(1).evaluate(input => input === document.activeElement), true);
            await fillRound(page);
            await page.locator('.sentence-answer').last().press('Enter');
            assert.equal(await page.locator('.is-correct').count(), 20);
            pass('long sentence answers wrap fully and support umlaut keys, Enter navigation and grading');
        }
        if (process.env.SCREENSHOT_DIR && id === 'sentence_order') {
            await page.locator('.task-card').first().scrollIntoViewIfNeeded();
            await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'sentence-order-320.png') });
        }
    }
    await page.fill('#searchInput', 'Schlüssigkeit');
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.task-card').count(), 1);
    assert.equal(await page.locator('.word-hint').innerText().then(text => text.includes('Schlüssigkeit')), false);
    await fillRound(page);
    await page.click('#checkButton');
    assert.equal(await page.locator('.is-correct').count(), 1);
    pass('full German vocabulary remains searchable without revealing the answer in the hint');
    await page.fill('#searchInput', '');
    await page.selectOption('#countSelect', '5');
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
    assert.equal(await page.locator('#levelSelect option[value="C1"]').count(), 0);
    assert.equal(await page.locator('.task-card').count(), 5);
    pass('missing levels are removed rather than offering empty exercise sets');
    await page.fill('#searchInput', 'NOT_A_REAL_WORD_938');
    await page.waitForTimeout(350);
    await page.click('[data-group="advanced"]');
    assert.equal(await page.locator('#levelSelect').inputValue(), 'All');
    assert.deepEqual(await page.locator('#levelSelect option').evaluateAll(options => options.map(option => option.value)), ['All', 'C1']);
    await page.selectOption('#levelSelect', 'C1');
    assert.equal(await page.locator('#testSelect').inputValue(), 'c1_cohesion');
    assert.equal(await page.locator('#searchInput').inputValue(), '');
    assert.equal(await page.locator('.task-card').count(), 5);
    await page.click('[data-group="goethe-b2"]');
    assert.equal(await page.locator('#levelSelect').inputValue(), 'All');
    assert.equal(await page.locator('.task-card').count(), 5);
    pass('topic changes clear stale search and select an available level');
    await page.selectOption('#levelSelect', 'B2');
    await page.fill('#searchInput', 'abwägen');
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.task-card').count(), 5);
    await fillRound(page);
    await page.click('#checkButton');
    assert.equal(await page.locator('.is-correct').count(), 5);
    pass('existing B2 practice and full-infinitive search still work');
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
    const previousSettings = await browser.newContext();
    await previousSettings.addInitScript(() => {
        localStorage.setItem('deutsch.settings.v2', JSON.stringify({ group: 'goethe-b2', test: 'b2_sentence_patterns', level: 'B2', count: 5 }));
        localStorage.setItem('deutsch.score.v2', JSON.stringify({ correct: 7, attempted: 10 }));
    });
    const previousPage = await previousSettings.newPage();
    previousPage.on('pageerror', error => errors.push(error.message));
    await previousPage.goto(url);
    await previousPage.waitForSelector('.task-card');
    assert.equal(await previousPage.locator('#testSelect').inputValue(), 'b2_sentence_patterns');
    assert.equal(await previousPage.locator('#levelSelect').inputValue(), 'B2');
    assert.equal(await previousPage.locator('.task-card').count(), 5);
    assert.equal(await previousPage.locator('#score').innerText(), '7 / 10');
    pass('previously saved B2 preferences and scores remain usable');
    const unavailable = await browser.newContext();
    await unavailable.addInitScript(() => {
        localStorage.setItem('deutsch.settings.v2', JSON.stringify({ group: 'verbs', test: 'futur1', level: 'A1', count: 5 }));
        localStorage.setItem('deutsch.score.v2', JSON.stringify({ correct: 3, attempted: 5 }));
    });
    const unavailablePage = await unavailable.newPage();
    unavailablePage.on('pageerror', error => errors.push(error.message));
    await unavailablePage.goto(url);
    await unavailablePage.waitForSelector('.task-card');
    assert.equal(await unavailablePage.locator('#levelSelect').inputValue(), 'All');
    assert.deepEqual(await unavailablePage.locator('#levelSelect option').evaluateAll(options => options.map(option => option.value)), ['All', 'B1', 'B2']);
    assert.equal(await unavailablePage.locator('.task-card').count(), 5);
    assert.equal(await unavailablePage.locator('#score').innerText(), '3 / 5');
    assert.equal(await unavailablePage.evaluate(() => JSON.parse(localStorage.getItem('deutsch.settings.v2')).level), 'All');
    pass('saved unavailable levels recover to existing exercises without losing the score');
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
    assert.deepEqual(failedRequests, []);
    pass('all styles and scripts load under the GitHub Pages repository path');
    assert.deepEqual(errors, []);
    pass('no browser runtime errors');
    console.log(`Browser suite: ${checks} checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
    if (browser) await browser.close();
    server.close();
});
