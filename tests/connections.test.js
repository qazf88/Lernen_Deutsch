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
const additions = JSON.parse(vm.runInContext('JSON.stringify(connection_tests)', context));
const groups = JSON.parse(vm.runInContext('JSON.stringify(exerciseGroups)', context));
const items = additions.flatMap(dataset => dataset.data);
function find(id, sentence) {
    const item = additions.find(dataset => dataset.id === id).data.find(item => item.sentence === sentence);
    assert.ok(item, `${id}: ${sentence}`);
    return item;
}
function check(id, sentence, accepted, rejected) {
    const item = find(id, sentence);
    assert.equal(core.checkAnswer(item, accepted), true, sentence);
    assert.equal(core.checkAnswer(item, rejected), false, `${sentence}: ${rejected}`);
}
function completed(item) {
    let index = 0;
    return item.sentence.replace(/___/g, () => core.getAnswerVariants(item)[0][index++]);
}

test('three new connection tests are visible with 60 exercises at each level', () => {
    const group = groups.find(group => group.id === 'connections');
    assert.ok(group);
    assert.deepEqual(group.tests, additions);
    assert.equal(group.tests.length, 3);
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
        assert.equal(core.filterItems(items, level, '').length, 60, level);
        for (const dataset of group.tests) {
            assert.equal(core.filterItems(dataset.data, level, '').length, 20, `${dataset.id}/${level}`);
        }
    }
});

test('all 300 connection exercises add unique completed sentences to the bank', () => {
    const existing = new Set(groups.filter(group => group.id !== 'connections').flatMap(group => group.tests).flatMap(dataset => dataset.data).map(completed));
    const seen = new Set();
    for (const item of items) {
        const sentence = completed(item);
        assert.equal(existing.has(sentence), false, `already present: ${sentence}`);
        assert.equal(seen.has(sentence), false, `repeated addition: ${sentence}`);
        seen.add(sentence);
    }
    assert.equal(seen.size, 300);
});

test('question words distinguish origin, destination and singular/plural quantities', () => {
    for (const [sentence, accepted, rejected] of [
        ['___ kommt der neue Schüler?', 'Woher', 'Wohin'],
        ['___ fährt die Familie am Samstag?', 'Wohin', 'Woher'],
        ['___ kostet ein Ticket nach Essen?', 'Wie viel', 'Wie viele'],
        ['___ Stühle brauchen wir für den Besuch?', 'Wie viele', 'Wie viel'],
        ['___ ist dein kleiner Bruder?', 'Wie alt', 'Wie']
    ]) check('question_words', sentence, [accepted], [rejected]);
});

test('personal and attributive question forms follow their required cases', () => {
    for (const [sentence, accepted, rejected] of [
        ['___ hast du gestern am Bahnhof getroffen?', 'Wen', 'Wem'],
        ['___ gehört der grüne Rucksack?', 'Wem', 'Wen'],
        ['___ Pullover möchtest du anprobieren?', 'Welchen', 'Welcher'],
        ['___ Jacke passt dir besser?', 'Welche', 'Welchen'],
        ['___ Buch hast du in der Bibliothek ausgeliehen?', 'Welches', 'Welchen'],
        ['___ sollte die Arbeitsgruppe zunächst nachgehen?', 'Welcher Frage', 'Welche Frage'],
        ['___ halten Sie für angemessen?', 'Welchen Zeitraum', 'Welcher Zeitraum'],
        ['___ ist der Erfolg abhängig?', 'Von welchen Faktoren', 'Von welche Faktoren'],
        ['___ beruht die abschließende Bewertung?', 'Auf welcher Grundlage', 'Auf welche Grundlage'],
        ['___ ist diese Empfehlung ausgerichtet?', 'Auf welche Zielgruppe', 'Auf welcher Zielgruppe']
    ]) check('question_words', sentence, [accepted], [rejected]);
});

test('indirect questions preserve the full embedded phrase and explicit synonyms', () => {
    check('question_words', 'Kannst du mir sagen, ___ der Zug pünktlich ist?', ['ob'], ['wann']);
    check('question_words', 'Die Kommission will klären, ___ die Angaben widersprüchlich wurden.', ['wie es dazu kam, dass'], ['wie es dazu kam']);
    for (const sentence of ['___ kommst du heute so spät?', 'Ich frage mich, ___ er den Termin vergessen hat.']) {
        const item = find('question_words', sentence);
        for (const answer of ['warum', 'wieso', 'weshalb']) assert.equal(core.checkAnswer(item, [answer]), true);
        assert.equal(core.checkAnswer(item, ['wann']), false);
    }
});

test('paired conjunctions require separate complete fields and accept je alternatives', () => {
    for (const [sentence, accepted, rejected] of [
        ['___ die Planung ___ die Finanzierung müssen überprüft werden.', ['Sowohl', 'als auch'], ['Sowohl', 'als']],
        ['Wir können ___ die Frist verlängern ___ den Umfang verringern.', ['entweder', 'oder'], ['entweder oder', '']],
        ['Die Begründung ist ___ klar ___ vollständig.', ['weder', 'noch'], ['weder', 'oder']],
        ['Das Angebot ist ___ günstig, ___ nur kurzfristig verfügbar.', ['zwar', 'aber'], ['zwar aber']],
        ['Die Regelung wird angewandt, es ___, eine Ausnahme ist ausdrücklich vorgesehen.', ['sei denn'], ['denn']]
    ]) check('conjunctions', sentence, accepted, rejected);
    for (const sentence of [
        '___ genauer wir planen, ___ geringer ist das Risiko.',
        '___ präziser die Kriterien definiert werden, ___ nachvollziehbarer ist die Bewertung.'
    ]) {
        const item = find('conjunctions', sentence);
        assert.equal(core.checkAnswer(item, ['je', 'desto']), true);
        assert.equal(core.checkAnswer(item, ['je', 'umso']), true);
        assert.equal(core.checkAnswer(item, ['je desto']), false);
    }
});

test('temporal conjunctions distinguish single, repeated, preceding and following events', () => {
    for (const [sentence, accepted, rejected] of [
        ['___ ich letztes Jahr nach Aachen zog, kannte ich dort niemanden.', 'Als', 'Wenn'],
        ['Immer ___ ich früh aufstehe, frühstücke ich in Ruhe.', 'wenn', 'als'],
        ['___ wir die Tickets gekauft hatten, planten wir die Reise.', 'Nachdem', 'Bevor'],
        ['___ du das Haus verlässt, prüfe die Fenster.', 'Bevor', 'Nachdem'],
        ['___ die Zustimmung vorliegt, darf die Veröffentlichung erfolgen.', 'Erst nachdem', 'Erst bevor']
    ]) check('time_sequence', sentence, [accepted], [rejected]);
});

test('time expressions distinguish duration, past distance, future distance and calendar order', () => {
    for (const [sentence, accepted, rejected] of [
        ['Wir wohnen ___ zwei Monaten in dieser Wohnung.', 'seit', 'vor'],
        ['Ich habe den Brief ___ drei Tagen abgeschickt.', 'vor', 'seit'],
        ['Der Kurs beginnt ___ zwei Wochen.', 'in', 'vor'],
        ['Heute ist Montag. Morgen ist ___.', 'Dienstag', 'Sonntag'],
        ['Heute ist Donnerstag. Gestern war ___.', 'Mittwoch', 'Freitag'],
        ['Nach dem Februar kommt der ___.', 'März', 'Januar'],
        ['Vor dem Dezember kommt der ___.', 'November', 'Januar'],
        ['Die Tragweite der Entscheidung wurde ___ erkannt.', 'erst im Nachhinein', 'im Vorfeld']
    ]) check('time_sequence', sentence, [accepted], [rejected]);
});

test('search finds complete formal vocabulary behind clipped hints without losing the level filter', () => {
    const dataset = additions.find(dataset => dataset.id === 'time_sequence');
    const result = core.filterItems(dataset.data, 'C1', 'unverzüglich');
    assert.equal(result.length, 1);
    assert.equal(result[0].infinitive.includes('unverzüglich'), false);
    assert.equal(core.checkAnswer(result[0], ['unverzüglich']), true);
    assert.equal(core.filterItems(dataset.data, 'A1', 'unverzüglich').length, 0);
    assert.equal(core.filterItems(dataset.data, 'C1', 'без зволікання').length, 1);
});
