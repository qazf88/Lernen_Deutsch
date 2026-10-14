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
const additions = JSON.parse(vm.runInContext('JSON.stringify(travel_culture_tests)', context));
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

test('the travel and culture group adds 300 reachable exercises balanced across A1-C1', () => {
    const group = groups.find(group => group.id === 'travel-culture');
    assert.ok(group);
    assert.deepEqual(group.tests, additions);
    assert.deepEqual(group.tests.map(dataset => dataset.id), ['travel_transport', 'food_hospitality', 'culture_relationships']);
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

test('travel and culture additions including alternatives have no repeated completed sentences', () => {
    const existing = new Set(groups.filter(group => group.id !== 'travel-culture')
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

test('relative pronouns and verb government retain the required preposition and case', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['travel_transport', 'erkundige mich', 'nach', 'über'],
        ['travel_transport', 'Die Reiseleiterin,', 'der', 'die'],
        ['travel_transport', 'Das Hotel,', 'in dem', 'in das'],
        ['travel_transport', 'entsprach nicht', 'der', 'die'],
        ['food_hospitality', 'Die Nachbarin,', 'von der', 'von die'],
        ['culture_relationships', 'verlassen kann', 'auf den', 'auf dem'],
        ['culture_relationships', 'begegnet bin', 'der', 'die'],
        ['culture_relationships', 'setzt sich', 'mit', 'über'],
        ['culture_relationships', 'unabhängig ___', 'von', 'auf']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('unreal past and reported speech distinguish auxiliaries and moods', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['travel_transport', 'rechtzeitig ___', 'angekommen sind', 'angekommen haben'],
        ['travel_transport', 'früher ___ wären', 'losgefahren', 'losgefahrt'],
        ['travel_transport', 'weniger Gepäck', 'mitgenommen', 'mitgenimmt'],
        ['travel_transport', 'sämtliche Verbindungen', 'seien', 'sind'],
        ['travel_transport', 'informiert ___ zu sein', 'worden', 'geworden'],
        ['travel_transport', 'bei der Planung ___', 'berücksichtigt werden', 'berücksichtigt worden'],
        ['food_hospitality', 'bereits umgestellt', 'habe', 'hat'],
        ['food_hospitality', 'realistischere Planung', 'vermieden werden', 'vermeiden werden'],
        ['culture_relationships', 'Inszenierung ___', 'solle', 'soll'],
        ['culture_relationships', 'einfachen Deutungen', 'entziehe', 'entzieht']
    ]) check(id, fragment, [accepted], [rejected]);
    check('travel_transport', 'Wenn wir früher ___', ['losführen', 'würden'], ['losfahren', 'werden']);
});

test('paired connectors keep the two blanks separate and require whole expressions', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['travel_transport', 'Die Reisenden müssen', ['entweder', 'oder'], ['entweder oder']],
        ['travel_transport', 'Die Unterkunft ist ___', ['zwar', 'aber'], ['zwar', 'sondern']],
        ['food_hospitality', 'Das Lokal bietet', ['weder', 'noch'], ['weder', 'oder']],
        ['culture_relationships', 'Das Programm umfasst', ['sowohl', 'als auch'], ['sowohl', 'als']],
        ['culture_relationships', 'Der Veranstaltungsort ist', ['zwar', 'aber'], ['zwar aber']]
    ]) check(id, fragment, accepted, rejected);
});

test('infinitival answers preserve separable prefixes and complete passive constructions', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['travel_transport', 'meinen Reisepass', 'einzupacken', 'zu einpacken'],
        ['travel_transport', 'die Änderung rechtzeitig', 'mitzuteilen', 'zu mitteilen'],
        ['travel_transport', 'vor der Buchung umfassend', 'informiert zu werden', 'informiert werden'],
        ['travel_transport', 'Bewertung ebenfalls', 'einzubeziehen', 'zu einbeziehen'],
        ['food_hospitality', 'keine Lebensmittel', 'wegzuwerfen', 'zu wegwerfen'],
        ['food_hospitality', 'vom Bahnhof', 'abzuholen', 'zu abholen'],
        ['culture_relationships', 'seine Schwächen', 'auszublenden', 'zu ausblenden'],
        ['culture_relationships', 'Erwartungen offen', 'darzulegen', 'zu darlegen'],
        ['culture_relationships', 'Sichtweisen ___', 'ernst zu nehmen', 'ernst nehmen']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('nominal and participial phrases preserve article and adjective endings', () => {
    for (const [id, fragment, accepted, rejected] of [
        ['travel_transport', 'Mit ___ eines neuen Fahrplans', 'der Einführung', 'die Einführung'],
        ['travel_transport', '___ Umsteigezeiten', 'ursprünglich vorgesehenen', 'ursprünglich vorgesehene'],
        ['food_hospitality', 'Durch ___ der Portionsgrößen', 'die Anpassung', 'der Anpassung'],
        ['food_hospitality', '___ Lebensmittel werden', 'übrig gebliebenen', 'übrig gebliebene'],
        ['food_hospitality', 'nach ___ der verfügbaren', 'sorgfältiger Prüfung', 'sorgfältigen Prüfung'],
        ['culture_relationships', 'Mit ___ des Programms', 'der Erweiterung', 'die Erweiterung'],
        ['culture_relationships', '___ Missverständnisse', 'aufgetretenen', 'aufgetreteten']
    ]) check(id, fragment, [accepted], [rejected]);
});

test('equivalent word forms and genitive spellings are explicitly accepted', () => {
    for (const [id, fragment, answers] of [
        ['food_hospitality', 'die Karotten', ['schneid', 'schneide']],
        ['food_hospitality', 'noch Brot', ['gern', 'gerne']],
        ['food_hospitality', 'Kostenersparnis', ['zulasten', 'zu Lasten']],
        ['food_hospitality', 'Je genauer', ['desto', 'umso']],
        ['travel_transport', 'Der Bericht lässt offen', ['inwieweit', 'inwiefern']],
        ['culture_relationships', 'Angesichts ___', ['des stark gestiegenen Besucherandrangs', 'des stark gestiegenen Besucherandranges']]
    ]) {
        const item = find(id, fragment);
        for (const answer of answers) assert.equal(core.checkAnswer(item, [answer]), true, `${fragment}: ${answer}`);
    }
});

test('full lexical answers and Ukrainian translations remain searchable within the chosen level', () => {
    const dataset = additions.find(dataset => dataset.id === 'travel_transport');
    const byWord = core.filterItems(dataset.data, 'C1', 'einzubeziehen');
    assert.ok(byWord.some(item => core.checkAnswer(item, ['einzubeziehen'])));
    assert.equal(core.filterItems(dataset.data, 'A1', 'einzubeziehen').length, 0);
    assert.equal(core.filterItems(dataset.data, 'C1', 'порівняльному аналізі транспортних потоків').length, 1);
});
