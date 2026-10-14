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
const additions = JSON.parse(vm.runInContext('JSON.stringify(people_plans_tests)', context));
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
function completed(item, answers) {
    let index = 0;
    return core.normalizeAnswer(item.sentence.replace(/___/g, () => answers[index++]));
}

test('people and plans add three reachable tests with 60 exercises at each level', () => {
    const group = groups.find(group => group.id === 'people-plans');
    assert.ok(group);
    assert.deepEqual(group.tests, additions);
    assert.deepEqual(group.tests.map(dataset => dataset.id), ['feelings_character', 'planning_decisions', 'description_comparison']);
    assert.equal(items.length, 300);
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
        assert.equal(core.filterItems(items, level).length, 60, level);
        for (const dataset of group.tests) {
            const filtered = core.filterItems(dataset.data, level);
            assert.equal(filtered.length, 20, `${dataset.id}/${level}`);
            assert.equal(core.sampleItems(filtered, 20).length, 20);
            assert.ok(filtered.every(item => item.explanation.trim()));
        }
    }
});

test('people and plans sentences including alternatives do not repeat any existing completed sentence', () => {
    const existing = new Set(groups.filter(group => group.id !== 'people-plans')
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

test('feeling and decision expressions preserve their governed prepositions and pronouns', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['feelings_character', 'Ich ärgere mich', 'über', 'auf'],
        ['feelings_character', 'Lea ist stolz', 'auf', 'über'],
        ['feelings_character', 'Ich vertraue', 'meiner', 'meine'],
        ['feelings_character', 'Ich fühle ___', 'mich', 'mir'],
        ['feelings_character', 'Du kannst dich', 'auf', 'an'],
        ['planning_decisions', 'beiden Möglichkeiten', 'für', 'zu'],
        ['planning_decisions', 'schrittweise Umsetzung', 'auf', 'über'],
        ['planning_decisions', 'Wir gehen ___', 'davon', 'darauf'],
        ['planning_decisions', 'wie viel Zeit uns bleibt', 'davon', 'dafür']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('comparatives and relative pronouns distinguish equality, degree and case', () => {
    for (const [fragment, accepted, rejected] of [
        ['Kirchturm ist', 'höher', 'hocher'],
        ['Raum ohne Fenster', 'dunkler', 'dunkel'],
        ['so scharf', 'wie', 'als'],
        ['ruhiger ___', 'als', 'wie'],
        ['___ Balkon nach Süden', 'deren', 'dessen'],
        ['___ Fahrrad vor der Tür', 'dessen', 'deren'],
        ['Die Stühle,', 'auf denen', 'auf die'],
        ['___ Schreibtisch als diesen', 'breiteren', 'breiter']
    ]) check('description_comparison', fragment, [accepted], [rejected]);
});

test('paired connectors and counterfactual conditions need all fields in the right order', () => {
    check('feelings_character', 'Wenn ich mehr Selbstvertrauen', ['hätte', 'würde'], ['habe', 'werde']);
    check('planning_decisions', 'Prioritäten müssen', ['sowohl', 'als auch'], ['sowohl', 'als']);
    check('planning_decisions', 'Wir können ___ den Umfang', ['entweder', 'oder'], ['entweder oder']);
    check('description_comparison', 'Lösung ist ___ effizient', ['sowohl', 'als auch'], ['sowohl als auch']);
    check('description_comparison', 'Aufbau ist ___ komplex', ['zwar', 'aber'], ['zwar', 'sondern']);
    check('planning_decisions', 'es ___, die Lage', ['sei denn'], ['denn']);
});

test('separable infinitives and whole nominal phrases remain complete answers', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['feelings_character', 'in deine Lage', 'hineinzuversetzen', 'zu hineinversetzen'],
        ['feelings_character', 'Unsicherheiten ___', 'einzugestehen', 'zu eingestehen'],
        ['planning_decisions', 'den freien Tag sinnvoll', 'zu nutzen', 'nutzen'],
        ['planning_decisions', 'Zuständigkeiten schriftlich', 'festzuhalten', 'zu festhalten'],
        ['planning_decisions', 'Absprachen ___', 'einzuhalten', 'zu einhalten'],
        ['planning_decisions', 'Eine verbindliche Zusage', 'nach Klärung', 'nach klären'],
        ['description_comparison', 'Gegensatz ___', 'zu', 'mit'],
        ['description_comparison', 'nicht als konstant', 'anzusehen', 'zu ansehen']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('reported speech and unreal passive retain the correct auxiliaries', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['feelings_character', 'für die Kritik durchaus', 'habe', 'hat'],
        ['feelings_character', 'von dem Tonfall irritiert', 'seien', 'sind'],
        ['feelings_character', 'frühere Rückmeldung', 'abgemildert werden', 'abgemildert worden'],
        ['planning_decisions', 'Verschiebung ___', 'sei', 'ist'],
        ['planning_decisions', 'vor Beginn ___', 'geklärt werden', 'geklärt worden'],
        ['description_comparison', 'Abweichung ___', 'sei', 'ist'],
        ['description_comparison', 'gleich gewichtet worden', 'seien', 'sind'],
        ['description_comparison', 'konkrete Beispiele', 'ergänzt werden', 'ergänzt worden']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('adjective and participial endings follow the article and nominal case', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['feelings_character', '___ Umgang miteinander', 'wertschätzenden', 'wertschätzender'],
        ['planning_decisions', 'Die Entscheidung bedarf', 'einer differenzierten', 'eine differenzierte'],
        ['description_comparison', 'Ein klar ___ Begriff', 'definierter', 'definierte'],
        ['description_comparison', 'gestern ___ Paket', 'gelieferte', 'gelieferten'],
        ['description_comparison', 'Ein alle relevanten Merkmale', 'berücksichtigender', 'berücksichtigenden'],
        ['description_comparison', 'anhand ___ Kriterien', 'nachvollziehbarer', 'nachvollziehbaren'],
        ['description_comparison', '___ Ergebnisse erlauben', 'unter unterschiedlichen Bedingungen gewonnenen', 'unter unterschiedlichen Bedingungen gewonnene']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('degree alternatives and full lexical answers stay usable with level filtering and Ukrainian search', () => {
    for (const fragment of ['Je höher der Turm', 'Je klarer die Gliederung']) {
        const item = find('description_comparison', fragment);
        for (const answer of ['desto', 'umso']) assert.equal(core.checkAnswer(item, [answer]), true);
    }
    const dataset = additions.find(dataset => dataset.id === 'description_comparison');
    const byWord = core.filterItems(dataset.data, 'C1', 'hinwegtäuschen');
    assert.ok(byWord.some(item => core.checkAnswer(item, ['hinwegtäuschen'])));
    assert.equal(core.filterItems(dataset.data, 'A1', 'hinwegtäuschen').length, 0);
    assert.equal(core.filterItems(dataset.data, 'C1', 'результати, отримані за різних умов').length, 1);
});
