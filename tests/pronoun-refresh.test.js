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
const sources = JSON.parse(vm.runInContext('JSON.stringify(pronoun_refresh)', context));
const datasets = JSON.parse(vm.runInContext('JSON.stringify(exerciseGroups.flatMap(group => group.tests))', context));
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

test('each level gains 50 registered pronoun and possessive exercises', () => {
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

test('new pronoun examples do not recycle completed sentences', () => {
    const additions = Object.values(sources).flat();
    const identities = new Set(additions.map(identity));
    const existing = new Set(datasets.flatMap(dataset => dataset.data).filter(item => !identities.has(identity(item))).map(completed));
    const seen = new Set();
    for (const item of additions) {
        const sentence = completed(item);
        assert.equal(existing.has(sentence), false, sentence);
        assert.equal(seen.has(sentence), false, sentence);
        seen.add(sentence);
    }
    assert.equal(seen.size, 250);
});

test('personal pronouns distinguish direct objects from recipients', () => {
    for (const [fragment, answer, rejected] of [
        ['ein Glas Wasser reichen', 'mir', 'mich'],
        ['Die Chefin bittet', 'Sie', 'Ihnen'],
        ['Der Arzt untersucht', 'ihn', 'ihm'],
        ['Der Regenschirm gehört', 'ihm', 'ihn']
    ]) {
        const item = find('personal_pronouns_cases', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [rejected]), false);
    }
});

test('reflexive case depends on the separate accusative object', () => {
    for (const [fragment, answer, rejected] of [
        ['kurz vor:', 'mich', 'mir'],
        ['ruhigere Wohnung vor', 'mir', 'mich'],
        ['die Hände', 'mir', 'mich'],
        ['für Fotografie', 'dich', 'dir']
    ]) {
        const item = find('personal_pronouns_cases', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [rejected]), false);
    }
});

test('relative forms depend on antecedent gender and clause function', () => {
    for (const [fragment, answer, rejected] of [
        ['Die Stiftung', 'deren', 'dessen'],
        ['Das Institut', 'dessen', 'deren'],
        ['Der Dozent', 'dem', 'den'],
        ['Die Bewerber', 'denen', 'die'],
        ['Das Modell', 'auf dessen', 'auf deren']
    ]) {
        const item = find('personal_pronouns_cases', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [rejected]), false);
    }
});

test('paired free-relative clauses keep separate case forms', () => {
    const item = find('personal_pronouns_cases', 'vollständige Nachweise vorlegt');
    assert.equal(core.checkAnswer(item, ['Wer', 'dem']), true);
    assert.equal(core.checkAnswer(item, ['Wem', 'der']), false);
    assert.equal(core.checkAnswer(item, ['Wer dem']), false);
});

test('possessive articles and independent neuter pronouns require different endings', () => {
    const article = find('possessive_pronouns_cases', 'Lieblingslied');
    assert.equal(core.checkAnswer(article, ['mein']), true);
    assert.equal(core.checkAnswer(article, ['meines']), false);
    const pronoun = find('possessive_pronouns_cases', 'Dieses Wörterbuch');
    assert.equal(core.checkAnswer(pronoun, ['meines']), true);
    assert.equal(core.checkAnswer(pronoun, ['meins']), true);
    assert.equal(core.checkAnswer(pronoun, ['mein']), false);
});

test('possessive variants and full genitive phrases are accepted completely', () => {
    const variant = find('possessive_pronouns_cases', 'Ihr helft');
    assert.equal(core.checkAnswer(variant, ['eurem']), true);
    assert.equal(core.checkAnswer(variant, ['euerem']), true);
    const phrase = find('possessive_pronouns_cases', 'Die Tragweite');
    assert.equal(core.checkAnswer(phrase, ['meines ursprünglichen Arguments']), true);
    assert.equal(core.checkAnswer(phrase, ['meines ursprünglichen Argumentes']), true);
    assert.equal(core.checkAnswer(phrase, ['meines']), false);
    assert.equal(core.checkAnswer(phrase, ['mein ursprüngliches Argument']), false);
});
