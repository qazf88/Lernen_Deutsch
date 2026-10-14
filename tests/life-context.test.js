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
const additions = JSON.parse(vm.runInContext('JSON.stringify(life_context_tests)', context));
const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
const items = additions.flatMap(dataset => dataset.data);
const find = (id, fragment) => {
    const item = additions.find(dataset => dataset.id === id).data.find(item => item.sentence.includes(fragment));
    assert.ok(item, `${id}: ${fragment}`);
    return item;
};
function check(id, fragment, accepted, rejected) {
    const item = find(id, fragment);
    assert.equal(core.checkAnswer(item, accepted), true, fragment);
    assert.equal(core.checkAnswer(item, rejected), false, `${fragment}: ${rejected}`);
}
function completed(item, answers = core.getAnswerVariants(item)[0]) {
    let index = 0;
    return core.normalizeAnswer(item.sentence.replace(/___/g, () => answers[index++]));
}

test('the life context group adds three reachable tests and 60 exercises at each level', () => {
    const group = groups.find(group => group.id === 'life-context');
    assert.ok(group);
    assert.deepEqual(group.tests, additions);
    assert.deepEqual(group.tests.map(dataset => dataset.id), ['housing_services', 'work_study', 'technology_environment']);
    assert.equal(items.length, 300);
    for (const level of levels) {
        assert.equal(core.filterItems(items, level).length, 60, level);
        for (const dataset of group.tests) {
            const filtered = core.filterItems(dataset.data, level);
            assert.equal(filtered.length, 20, `${dataset.id}/${level}`);
            assert.equal(core.sampleItems(filtered, 20).length, 20);
            assert.ok(filtered.every(item => item.explanation.trim()));
        }
    }
});

test('new life context sentences and their alternatives do not recycle the existing bank', () => {
    const existing = new Set(groups.filter(group => group.id !== 'life-context')
        .flatMap(group => group.tests).flatMap(dataset => dataset.data)
        .flatMap(item => core.getAnswerVariants(item).map(answers => completed(item, answers))));
    const seen = new Set();
    for (const item of items) {
        for (const answers of core.getAnswerVariants(item)) {
            const sentence = completed(item, answers);
            assert.equal(existing.has(sentence), false, `already present: ${sentence}`);
            assert.equal(seen.has(sentence), false, `repeated addition: ${sentence}`);
            seen.add(sentence);
        }
    }
    assert.ok(seen.size >= 300);
});

test('housing location and direction preserve different articles', () => {
    check('housing_services', 'Ich lege die Decke', ['das'], ['dem']);
    check('housing_services', 'Die Decke liegt', ['dem'], ['das']);
    check('housing_services', 'Wir hängen das Bild', ['die'], ['der']);
    check('housing_services', 'Das Familienfoto hängt', ['der'], ['die']);
    check('housing_services', 'Die Wohnung,', ['die'], ['der']);
    check('housing_services', 'Der Nachbar,', ['dem'], ['den']);
});

test('verb government distinguishes housing, applications and consent', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['housing_services', 'kümmert sich', 'um', 'für'],
        ['housing_services', 'Hausordnung halten', 'an', 'auf'],
        ['housing_services', 'Der Kunde besteht', 'auf', 'an'],
        ['work_study', 'Ich bewerbe mich', 'um', 'für'],
        ['work_study', 'mittelständischen Unternehmen', 'bei', 'um'],
        ['work_study', 'legen großen', 'auf', 'an'],
        ['technology_environment', 'Nutzenden müssen', 'zustimmen', 'zustimmen zu'],
        ['technology_environment', 'Menschen verzichten', 'auf', 'von'],
        ['technology_environment', 'wirkt sich positiv', 'auf', 'an']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('multi-field modal and connector tasks require complete correctly ordered answers', () => {
    check('work_study', 'Gestern ___ ich wegen', ['musste', 'gehen'], ['müsste', 'gehen']);
    check('housing_services', 'Wenn ich mehr Geld', ['hätte', 'würde'], ['habe', 'werde']);
    check('technology_environment', 'Wir sollten ___ die Vorteile', ['sowohl', 'als auch'], ['sowohl', 'als']);
    check('technology_environment', 'Wir sollten ___ die Vorteile', ['sowohl', 'als auch'], ['sowohl als auch']);
});

test('separable infinitives and formal phrases remain complete answers', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['work_study', 'den Anhang', 'mitzuschicken', 'zu mitschicken'],
        ['work_study', 'fehlenden Nachweise', 'nachzureichen', 'zu nachreichen'],
        ['housing_services', 'den Betrag', 'zurückzuerstatten', 'zu zurückerstatten'],
        ['housing_services', 'weitere Ansprüche', 'geltend zu machen', 'geltend machen'],
        ['technology_environment', 'gegen den erwarteten Nutzen', 'abzuwägen', 'zu abwägen'],
        ['housing_services', 'lehnte eine Erstattung', 'unter Hinweis auf', 'unter Hinweis'],
        ['housing_services', 'bedarf ___ Genehmigung', 'einer behördlichen', 'eine behördliche']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('reported speech and past modal passive preserve the correct auxiliaries', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['housing_services', 'Anspruch ___ bereits', 'sei', 'ist'],
        ['housing_services', 'Schäden ___ nicht', 'seien', 'sind'],
        ['work_study', 'jede Bewerbung', 'werde', 'wird'],
        ['work_study', 'Teilnehmer ___ die Voraussetzungen', 'habe', 'hat'],
        ['technology_environment', 'Informationen ___ ausschließlich', 'würden', 'werden'],
        ['work_study', 'informiert ___ wäre', 'worden', 'geworden'],
        ['work_study', 'Ressourcen hätten', 'eingesetzt werden', 'eingesetzt worden'],
        ['technology_environment', 'Infrastruktur hätte', 'ausgebaut werden', 'ausgebaut worden']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('participial and adjective endings match their grammatical context', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['housing_services', '___ Leistungen wurden', 'vereinbarten', 'vereinbarte'],
        ['housing_services', 'Trotz ___ Nachfrage', 'hoher', 'hohen'],
        ['work_study', '___ Kompetenzen sind', 'erworbenen', 'erwerbten'],
        ['work_study', 'einer ___ Bewertung', 'vergleichenden', 'vergleichender'],
        ['work_study', 'noch zu ___ Angaben', 'überprüfende', 'überprüfenden'],
        ['technology_environment', 'zuvor ___ Zweck', 'festgelegten', 'festgelegte'],
        ['technology_environment', '___ Erkenntnisse erfordern', 'neu gewonnenen', 'neu gewonnene']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('imperative variants and equivalent question words are accepted explicitly', () => {
    for (const [fragment, variants] of [
        ['das Licht in der Küche', ['mach', 'mache']],
        ['auf zwei Seiten', ['druck', 'drucke']],
        ['mir den Link', ['schick', 'schicke']]
    ]) {
        const item = find('technology_environment', fragment);
        for (const answer of variants) assert.equal(core.checkAnswer(item, [answer]), true);
    }
    const question = find('housing_services', 'die Nebenkosten so hoch');
    for (const answer of ['warum', 'weshalb', 'wieso']) assert.equal(core.checkAnswer(question, [answer]), true);
});

test('search reaches complete vocabulary and Ukrainian translations without leaking across levels', () => {
    const dataset = additions.find(dataset => dataset.id === 'housing_services');
    const byWord = core.filterItems(dataset.data, 'C1', 'zurückzuführen');
    assert.ok(byWord.length >= 1);
    const target = byWord.find(item => item.sentence.includes('Messfehler'));
    assert.ok(target);
    assert.equal(core.checkAnswer(target, ['zurückzuführen']), true);
    assert.equal(core.filterItems(dataset.data, 'A1', 'zurückzuführen').length, 0);
    assert.equal(core.filterItems(dataset.data, 'C1', 'помилкою вимірювання').length, 1);
});
