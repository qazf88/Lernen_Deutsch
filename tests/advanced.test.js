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
const advanced = groups.find(group => group.id === 'advanced');
const findItem = (id, fragment) => {
    const item = advanced.tests.find(dataset => dataset.id === id).data.find(item => item.sentence.includes(fragment));
    assert.ok(item, `${id}: ${fragment}`);
    return item;
};

test('new C1 tests contain distinct authored sentences and preserve the existing bank', () => {
    assert.equal(advanced.tests.length, 8);
    const oldSentences = new Set(groups.filter(group => group !== advanced).flatMap(group => group.tests).flatMap(dataset => dataset.data).map(item => item.sentence));
    const newSentences = new Set();
    for (const dataset of advanced.tests) {
        assert.ok(dataset.data.length >= 25, dataset.id);
        for (const item of dataset.data) {
            assert.equal(item.level, 'C1');
            assert.ok(item.explanation.trim());
            assert.equal(oldSentences.has(item.sentence), false, `${dataset.id}: old sentence reused`);
            assert.equal(newSentences.has(item.sentence), false, `${dataset.id}: duplicate sentence`);
            newSentences.add(item.sentence);
        }
    }
    assert.ok(newSentences.size >= 200);
    assert.ok(groups.some(group => group.tests.some(dataset => dataset.id === 'b2_collocations')));
});

test('nominalisation requires full phrases and accepts standard genitive variants', () => {
    const item = findItem('c1_nominalisation', 'Mit ___ stieg');
    assert.equal(core.checkAnswer(item, ['der Erweiterung des Angebots']), true);
    assert.equal(core.checkAnswer(item, ['der Erweiterung des Angebotes']), true);
    assert.equal(core.checkAnswer(item, ['Erweiterung']), false);
    assert.equal(core.checkAnswer(item, ['die Erweiterung des Angebots']), false);
});

test('reported speech distinguishes Konjunktiv I from indicative forms', () => {
    for (const [fragment, correct, incorrect] of [
        ['die Daten ___', 'seien', 'sind'],
        ['jeder Antrag ___', 'müsse', 'muss'],
        ['der Fahrer ___', 'sei', 'ist'],
        ['sie ___ die Quellen', 'habe', 'hat']
    ]) {
        const item = findItem('c1_reported_speech', fragment);
        assert.equal(core.checkAnswer(item, [correct]), true);
        assert.equal(core.checkAnswer(item, [incorrect]), false);
    }
});

test('complex passive forms require the complete verbal cluster', () => {
    const item = findItem('c1_passive', 'Nachdem die Mängel');
    assert.equal(core.checkAnswer(item, ['behoben worden waren']), true);
    assert.equal(core.checkAnswer(item, ['behoben']), false);
    assert.equal(core.checkAnswer(item, ['behoben geworden waren']), false);
    const modal = findItem('c1_passive', 'Die Daten hätten');
    assert.equal(core.checkAnswer(modal, ['gesichert werden']), true);
    assert.equal(core.checkAnswer(modal, ['gesichert']), false);
});

test('extended participles preserve irregular stems and adjective endings', () => {
    for (const [fragment, answer, incorrect] of [
        ['zunehmend ___ Bewusstsein', 'wachsendes', 'wachsende'],
        ['im Bericht ___ Risiken', 'genannten', 'genennte'],
        ['Ein alle relevanten Aspekte', 'berücksichtigender', 'berücksichtigenden'],
        ['Mit einem klar', 'abgegrenzten', 'abgegrenzter']
    ]) {
        const item = findItem('c1_participles', fragment);
        assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, [incorrect]), false);
    }
});

test('formal government checks the whole prepositional and case-dependent phrase', () => {
    const item = findItem('c1_government', 'Die Kommission');
    assert.equal(core.checkAnswer(item, ['mit den langfristigen Folgen']), true);
    assert.equal(core.checkAnswer(item, ['mit die langfristigen Folgen']), false);
    assert.equal(core.checkAnswer(item, ['mit']), false);
    const genitive = findItem('c1_government', 'Die Entscheidung bedarf');
    assert.equal(core.checkAnswer(genitive, ['einer sorgfältigen Begründung']), true);
    assert.equal(core.checkAnswer(genitive, ['eine sorgfältige Begründung']), false);
});

test('cohesion supports paired connectors and complete alternatives', () => {
    const item = findItem('c1_cohesion', 'präziser die Fragestellung');
    assert.equal(core.checkAnswer(item, ['Je', 'desto']), true);
    assert.equal(core.checkAnswer(item, ['Je', 'umso']), true);
    assert.equal(core.checkAnswer(item, ['Je desto']), false);
    const compound = findItem('c1_cohesion', 'es ___, eine Partei');
    assert.equal(core.checkAnswer(compound, ['sei denn']), true);
    assert.equal(core.checkAnswer(compound, ['sei']), false);
});

test('argumentation spelling variants and Ukrainian searches reach the new tests', () => {
    const item = findItem('c1_argumentation', 'unterschiedliche Voraussetzungen');
    assert.equal(core.checkAnswer(item, ['zugrunde']), true);
    assert.equal(core.checkAnswer(item, ['zu Grunde']), true);
    const vocabulary = advanced.tests.find(dataset => dataset.id === 'c1_word_formation').data;
    assert.equal(core.filterItems(vocabulary, 'C1', 'Відтворюваність').length, 1);
    assert.equal(core.filterItems(vocabulary, 'B2', 'Відтворюваність').length, 0);
});
