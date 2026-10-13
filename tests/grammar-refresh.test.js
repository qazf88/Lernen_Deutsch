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
const sources = JSON.parse(vm.runInContext('JSON.stringify(grammar_refresh)', context));
const groups = JSON.parse(vm.runInContext('JSON.stringify(exerciseGroups)', context));
const datasets = groups.flatMap(group => group.tests);
const allItems = datasets.flatMap(dataset => dataset.data);
const identity = item => JSON.stringify([item.sentence, item.answers || item.answer, item.infinitive, item.ua_infinitiv]);
const completed = item => {
    let index = 0;
    return item.sentence.replace(/___/g, () => core.getAnswerVariants(item)[0][index++]);
};
function find(id, fragment) {
    const item = sources[id].find(item => item.sentence.includes(fragment));
    assert.ok(item, `${id}: ${fragment}`);
    return item;
}

test('grammar additions provide 50 registered exercises per supported level', () => {
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
        for (const [id, items] of Object.entries(sources)) {
            const additions = items.filter(item => item.level === level);
            assert.equal(additions.length, 25, `${id}/${level}`);
            const dataset = datasets.find(dataset => dataset.id === id);
            const registered = dataset.data.map(identity);
            for (const item of additions) assert.equal(registered.filter(key => key === identity(item)).length, 1);
            assert.equal(core.filterItems(dataset.data, level, additions[0].ua_infinitiv).length, 25);
        }
    }
});

test('grammar additions contain unique new completed sentences', () => {
    const additions = Object.values(sources).flat();
    const identities = new Set(additions.map(identity));
    const existing = new Set(allItems.filter(item => !identities.has(identity(item))).map(completed));
    const seen = new Set();
    for (const item of additions) {
        const sentence = completed(item);
        assert.equal(existing.has(sentence), false, sentence);
        assert.equal(seen.has(sentence), false, sentence);
        seen.add(sentence);
    }
    assert.equal(seen.size, 250);
});

test('spatial prepositions distinguish location and destination in paired examples', () => {
    for (const [fragment, answer, rejected] of [
        ['Vase steht neben', 'dem', 'das'],
        ['Vase neben', 'das', 'dem'],
        ['Katze schläft unter', 'dem', 'den'],
        ['Katze läuft unter', 'den', 'dem'],
        ['Schlüssel liegen in', 'der', 'die'],
        ['Schlüssel in', 'die', 'der']
    ]) {
        const item = find('prepositions_cases', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [rejected]), false);
    }
});

test('entlang cases depend on position and the requested standard variant', () => {
    const before = find('prepositions_cases', 'führt entlang');
    assert.equal(core.checkAnswer(before, ['des breiten Flusses']), true);
    assert.equal(core.checkAnswer(before, ['den breiten Fluss']), false);
    const after = find('prepositions_cases', '___ entlang');
    assert.equal(core.checkAnswer(after, ['den schmalen Weg']), true);
    assert.equal(core.checkAnswer(after, ['des schmalen Wegs']), false);
});

test('formal phrases check all words and accept explicit contracted alternatives', () => {
    const item = find('prepositions_cases', 'Im Gegensatz');
    assert.equal(core.checkAnswer(item, ['zu dem bisherigen Ansatz']), true);
    assert.equal(core.checkAnswer(item, ['zum bisherigen Ansatz']), true);
    assert.equal(core.checkAnswer(item, ['zu']), false);
    const nested = find('prepositions_cases', 'Unter Berücksichtigung');
    assert.equal(core.checkAnswer(nested, ['der methodischen Einschränkungen']), true);
    assert.equal(core.checkAnswer(nested, ['die methodischen Einschränkungen']), false);
});

test('adjective comparison preserves irregular stems and attributive endings', () => {
    for (const [fragment, answer, rejected] of [
        ['Der Turm', 'höher', 'hoher'],
        ['Hotel', 'ruhigeres', 'ruhiger'],
        ['Ergebnis als erwartet', 'besseres', 'besser'],
        ['als der vorige', 'überzeugenderer', 'überzeugender'],
        ['Im Sommer', 'längsten', 'langsten']
    ]) {
        const item = find('adjective_endings', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [rejected]), false);
    }
});

test('nominalised and participial adjectives retain case-dependent forms', () => {
    for (const [fragment, answer, rejected] of [
        ['Nebensächlichem unterscheiden', 'Wesentlichem', 'Wesentliches'],
        ['wirklich ___', 'Neuem', 'Neues'],
        ['Fachliteratur', 'angenommener', 'angenommene'],
        ['aller ___', 'Betroffenen', 'Betroffene'],
        ['Auswertung ___ Materials', 'vertraulichen', 'vertrauliches']
    ]) {
        const item = find('adjective_endings', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [rejected]), false);
    }
});

test('README statistics agree with the current visible bank', () => {
    const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
    const total = readme.match(/\*\*([\d ]+) вправ/);
    assert.ok(total);
    assert.equal(Number(total[1].replace(/ /g, '')), allItems.length);
    const rows = [...readme.matchAll(/^\|\s*(A1|A2|B1|B2|C1)\s*\|\s*([\d ]+)\s*\|$/gm)];
    assert.equal(rows.length, 5);
    for (const [, level, count] of rows) assert.equal(Number(count.replace(/ /g, '')), allItems.filter(item => item.level === level).length);
});
