'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../core.js');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
for (const [, source] of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/src="(data\/[^"?]+)(?:\?[^"\s]*)?"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, source), 'utf8'), context, { filename: source });
}
const groups = JSON.parse(vm.runInContext('JSON.stringify(exerciseGroups)', context));
const practice = groups.find(group => group.id === 'practice');
const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
const findItem = (id, fragment) => {
    const item = practice.tests.find(dataset => dataset.id === id).data.find(item => item.sentence.includes(fragment));
    assert.ok(item, `${id}: ${fragment}`);
    return item;
};
const completed = item => {
    let index = 0;
    return item.sentence.replace(/___/g, () => core.getAnswerVariants(item)[0][index++]);
};

test('all new practice tests offer substantial content at every supported level', () => {
    assert.equal(practice.tests.length, 5);
    for (const dataset of practice.tests) {
        for (const level of levels) {
            const items = core.filterItems(dataset.data, level);
            assert.ok(items.length >= 20, `${dataset.id}/${level}`);
            assert.equal(core.sampleItems(items, 20).length, 20);
            assert.ok(items.every(item => item.explanation.trim()));
        }
    }
    for (const level of levels) {
        assert.ok(practice.tests.flatMap(dataset => dataset.data).filter(item => item.level === level).length >= 100, level);
    }
});

test('new practice sentences are distinct and do not recycle existing exercises', () => {
    const old = new Set(groups.filter(group => group !== practice).flatMap(group => group.tests).flatMap(dataset => dataset.data).map(completed));
    const seen = new Set();
    for (const dataset of practice.tests) {
        for (const item of dataset.data) {
            const identity = completed(item);
            assert.equal(old.has(identity), false, `${dataset.id}: reused exercise ${identity}`);
            assert.equal(seen.has(identity), false, `${dataset.id}: repeated exercise ${identity}`);
            seen.add(identity);
        }
    }
});

function words(value) {
    return core.normalizeAnswer(value.replace(/[.,!?;:]/g, '')).split(' ').sort();
}
test('word-order tasks use every supplied word exactly once and keep the requested beginning', () => {
    const data = practice.tests.find(dataset => dataset.id === 'sentence_order').data;
    for (const item of data) {
        const source = item.sentence.slice('Wörter: '.length).split(' → ')[0].replace(/·/g, ' ');
        const start = item.infinitive.slice('Beginn: '.length);
        for (const variant of core.getAnswerVariants(item)) {
            assert.deepEqual(words(variant[0]), words(source), item.sentence);
            assert.ok(core.normalizeAnswer(variant[0].replace(/[.,!?;:]/g, '')).startsWith(core.normalizeAnswer(start) + ' '), item.sentence);
            assert.equal(/[.!?]$/.test(variant[0]), false, item.sentence);
        }
    }
});

test('Perfekt auxiliaries and separable prefixes remain separate complete answers', () => {
    const motion = findItem('verbs_context', 'Ich ___ gestern nach Dresden');
    assert.equal(core.checkAnswer(motion, ['bin', 'gefahren']), true);
    assert.equal(core.checkAnswer(motion, ['habe', 'gefahren']), false);
    const separate = findItem('verbs_context', 'Der Bus ___ in fünf Minuten');
    assert.equal(core.checkAnswer(separate, ['fährt', 'ab']), true);
    assert.equal(core.checkAnswer(separate, ['fährt ab']), false);
});

test('complex C1 passive and reported forms reject incomplete or indicative answers', () => {
    const passive = findItem('verbs_context', 'Der Vertrag scheint');
    assert.equal(core.checkAnswer(passive, ['geändert worden zu sein']), true);
    assert.equal(core.checkAnswer(passive, ['geändert']), false);
    assert.equal(core.checkAnswer(passive, ['geändert geworden zu sein']), false);
    const indirect = findItem('verbs_context', 'die Vorwürfe ___');
    assert.equal(core.checkAnswer(indirect, ['seien']), true);
    assert.equal(core.checkAnswer(indirect, ['sind']), false);
});

test('negative forms preserve case and multiword limiting expressions', () => {
    const accusative = findItem('negation_contrast', 'Wir kaufen ___ Fernseher');
    assert.equal(core.checkAnswer(accusative, ['keinen']), true);
    assert.equal(core.checkAnswer(accusative, ['kein']), false);
    const partial = findItem('negation_contrast', 'Ein Zusammenhang bedeutet');
    assert.equal(core.checkAnswer(partial, ['nicht zwangsläufig']), true);
    assert.equal(core.checkAnswer(partial, ['nicht']), false);
    const addition = findItem('negation_contrast', 'Er hat den Bericht nicht gelesen');
    assert.equal(core.checkAnswer(addition, ['geschweige denn']), true);
    const evidence = findItem('negation_contrast', 'Nachweis für diese Vermutung');
    assert.equal(completed(evidence), 'Es gibt keinen Nachweis für diese Vermutung.');
});

test('dialogue variants and vocabulary case forms match their contexts', () => {
    const dialogue = findItem('daily_dialogues', 'Kommst du mit?');
    assert.equal(core.checkAnswer(dialogue, ['gern']), true);
    assert.equal(core.checkAnswer(dialogue, ['gerne']), true);
    const neighbour = findItem('lexicon_context', 'Das Paket liegt');
    assert.equal(core.checkAnswer(neighbour, ['Nachbarn']), true);
    assert.equal(core.checkAnswer(neighbour, ['Nachbar']), false);
    const rooms = findItem('lexicon_context', 'mit zwei ___');
    assert.equal(core.checkAnswer(rooms, ['Zimmern']), true);
    assert.equal(core.checkAnswer(rooms, ['Zimmer']), false);
});

test('Ukrainian and German search stay within the selected level', () => {
    const data = practice.tests.find(dataset => dataset.id === 'lexicon_context').data;
    assert.equal(core.filterItems(data, 'A2', 'направлення').length, 1);
    assert.equal(core.filterItems(data, 'C1', 'Schlüssigkeit').length, 1);
    assert.equal(core.filterItems(data, 'A1', 'Schlüssigkeit').length, 0);
});
