'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { getAnswerVariants, checkAnswer, normalizeAnswer } = require('../core.js');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptPaths = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
    .map(match => match[1].split('?')[0])
    .filter(source => source.startsWith('data/'));
const context = vm.createContext({});
for (const source of scriptPaths) {
    new vm.Script(fs.readFileSync(path.join(root, source), 'utf8'), { filename: source })
        .runInContext(context, { timeout: 3000 });
}
// Plain JSON avoids cross-realm prototypes influencing structural comparisons.
const groups = JSON.parse(vm.runInContext('JSON.stringify(exerciseGroups)', context));
const expandedTests = JSON.parse(vm.runInContext('JSON.stringify(extra_exercises)', context));
const datasets = groups.flatMap(group => group.tests);
const allItems = datasets.flatMap(dataset => dataset.data);
const validLevels = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

function assertText(value, label) {
    assert.equal(typeof value, 'string', label);
    assert.ok(value.trim().length, `${label} must not be empty`);
}

test('the browser loads each data script once and builds the registry last', () => {
    assert.ok(scriptPaths.length > 1);
    assert.equal(new Set(scriptPaths).size, scriptPaths.length);
    assert.equal(scriptPaths.at(-1), 'data/data.js');
    assert.ok(scriptPaths.includes('data/expansion.js'));
});

test('the exercise registry has useful labels and unique stable identifiers', () => {
    assert.ok(groups.length >= 4);
    const groupIds = new Set();
    const testIds = new Set();
    for (const group of groups) {
        assertText(group.id, 'group id');
        assertText(group.name, `${group.id} name`);
        assert.equal(groupIds.has(group.id), false, `duplicate group id ${group.id}`);
        groupIds.add(group.id);
        assert.ok(Array.isArray(group.tests) && group.tests.length, `${group.id} tests`);
        for (const dataset of group.tests) {
            assertText(dataset.id, `${group.id} test id`);
            assertText(dataset.name, `${dataset.id} name`);
            assertText(dataset.desc, `${dataset.id} description`);
            assert.notEqual(dataset.desc.trim().toLowerCase(), 'description', `${dataset.id}: placeholder description`);
            assert.equal(testIds.has(dataset.id), false, `duplicate test id ${dataset.id}`);
            testIds.add(dataset.id);
            assert.ok(Array.isArray(dataset.data) && dataset.data.length, `${dataset.id} exercises`);
        }
    }
});

for (const dataset of datasets) {
    test(`all ${dataset.data.length} exercises in ${dataset.id} have complete usable answers and translations`, () => {
        dataset.data.forEach((item, index) => {
            const label = `${dataset.id}[${index}] ${item.sentence}`;
            assertText(item.sentence, `${label}: sentence`);
            assertText(item.ua_sentence, `${label}: Ukrainian translation`);
            assertText(item.ua_infinitiv, `${label}: Ukrainian clue`);
            assert.ok(validLevels.has(item.level), `${label}: invalid level ${item.level}`);
            const blanks = (item.sentence.match(/___/g) || []).length;
            assert.ok(blanks > 0, `${label}: no answer field`);
            for (const variant of [item.answers, ...(item.alternatives || [])].filter(value => value !== undefined)) {
                assert.ok(Array.isArray(variant), `${label}: explicit answer must be an array`);
                assert.equal(variant.length, blanks, `${label}: malformed explicit answer`);
                variant.forEach(answer => assertText(answer, `${label}: malformed explicit answer field`));
            }
            const variants = getAnswerVariants(item);
            assert.ok(Array.isArray(variants) && variants.length, `${label}: no valid answer`);
            for (const answers of variants) {
                assert.equal(answers.length, blanks, `${label}: fields do not match answer parts`);
                for (const answer of answers) {
                    assertText(answer, `${label}: blank answer`);
                    assert.equal(answer.includes('___'), false, `${label}: answer contains a placeholder`);
                }
                assert.equal(checkAnswer(item, answers), true, `${label}: model answer rejected`);
                // Preserve the spelling distinction between ß and ss when uppercasing.
                assert.equal(checkAnswer(item, answers.map(answer => `  ${answer.replace(/ß/g, 'ẞ').toUpperCase()}  `)), true, `${label}: capitalization/whitespace rejected`);
                assert.equal(checkAnswer(item, [...answers, 'EXTRA']), false, `${label}: extra answer accepted`);
            }
            assert.equal(checkAnswer(item, Array(blanks).fill('')), false, `${label}: empty submission accepted`);
        });
    });
}

test('the complete bank exercises single, double and three-or-more answer fields', () => {
    const counts = new Set(allItems.map(item => (item.sentence.match(/___/g) || []).length));
    assert.ok(counts.has(1));
    assert.ok(counts.has(2));
    assert.ok([...counts].some(count => count >= 3));
    assert.ok(allItems.some(item => getAnswerVariants(item).some(answers => answers.some(answer => /\s/.test(answer.trim())))), 'multiword answers must be exercised');
});

test('legacy sentences have no malformed or orphaned underscore placeholders', () => {
    for (const dataset of datasets) {
        for (const item of dataset.data) {
            assert.equal(item.sentence.replace(/___/g, '').includes('_'), false, `${dataset.id}: ${item.sentence}`);
        }
    }
});

test('Präteritum separates the conjugated verb and prefix into two fields', () => {
    const dataset = datasets.find(item => item.id === 'praeteritum');
    const item = dataset.data.find(item => item.sentence === 'Ich ___ meine Schwester vom Bahnhof ___.');
    assert.ok(item);
    assert.deepEqual(getAnswerVariants(item)[0], ['holte', 'ab']);
    assert.equal(checkAnswer(item, ['holte', 'ab']), true);
});

test('reflexive body-part expressions require the dative pronoun', () => {
    const dataset = datasets.find(item => item.id === 'reflexivpronomen');
    const item = dataset.data.find(item => item.sentence === 'Ich wasche ___ jeden Morgen das Gesicht.');
    assert.ok(item);
    assert.equal(checkAnswer(item, ['mir']), true);
    assert.equal(checkAnswer(item, ['mich']), false);
});

test('Perfekt does not repeat an auxiliary already present in the sentence', () => {
    const dataset = datasets.find(item => item.id === 'perfekt');
    const full = dataset.data.find(item => item.sentence === 'Ich ___ meinen Koffer im Hotelzimmer ___.');
    const participle = dataset.data.find(item => item.sentence === 'Mein Vater hat den Rasenmäher in der Garage ___.');
    assert.ok(full);
    assert.ok(participle);
    assert.deepEqual(getAnswerVariants(full)[0], ['habe', 'abgestellt']);
    assert.deepEqual(getAnswerVariants(participle)[0], ['abgestellt']);
    assert.equal(checkAnswer(participle, ['hat abgestellt']), false);
});

test('Futur II with lassen preserves the replacement infinitive and haben', () => {
    const dataset = datasets.find(item => item.id === 'futur2');
    const item = dataset.data[0];
    assert.deepEqual(getAnswerVariants(item)[0], ['werde', 'haben reparieren lassen']);
    assert.equal(checkAnswer(item, ['werde', 'reparieren lassen']), false);
});

test('numeric phrases remain complete answers and match Ukrainian quantity clues', () => {
    const dataset = datasets.find(item => item.id === 'zahlen');
    const fraction = dataset.data.find(item => item.answer === 'ein Drittel');
    const group = dataset.data.find(item => item.answer === 'zu fünft');
    assert.ok(fraction);
    assert.ok(group);
    assert.equal(checkAnswer(fraction, ['ein Drittel']), true);
    assert.equal(checkAnswer(fraction, ['ein']), false);
    assert.match(group.ua_sentence, /уп[’']ятьох|вп[’']ятьох|п’ятеро|п'ятеро/iu);
});

test('new exercises are all connected to the visible registry', () => {
    const registeredIds = new Set(datasets.map(dataset => dataset.id));
    assert.ok(expandedTests.length >= 8, 'new practice should cover different kinds of tasks');
    for (const dataset of expandedTests) {
        assert.ok(registeredIds.has(dataset.id), `${dataset.id} is not reachable from the application`);
        const registered = datasets.find(candidate => candidate.id === dataset.id);
        assert.deepEqual(registered.data, dataset.data, `${dataset.id}: registry lost exercises`);
    }
});

test('the extension adds at least 500 exercises and 100 distinct vocabulary entries', () => {
    const items = expandedTests.flatMap(dataset => dataset.data);
    assert.ok(items.length >= 500, `only ${items.length} new exercises`);
    const words = new Set(items.map(item => normalizeAnswer(item.infinitive || '')).filter(Boolean));
    assert.ok(words.size >= 100, `only ${words.size} distinct vocabulary entries`);
});

test('all four German cases have dedicated exercises and explanations', () => {
    for (const grammaticalCase of ['nominativ', 'akkusativ', 'dativ', 'genitiv']) {
        const dataset = expandedTests.find(item => item.id === `case_${grammaticalCase}`);
        assert.ok(dataset, `missing ${grammaticalCase}`);
        assert.ok(dataset.data.length >= 20, `${grammaticalCase}: too few varied exercises`);
        for (const item of dataset.data) {
            assertText(item.explanation, `${grammaticalCase} explanation`);
        }
    }
});

test('new vocabulary includes noun gender, plurals and several kinds of declension', () => {
    const ids = new Set(expandedTests.map(dataset => dataset.id));
    for (const id of ['noun_plurals', 'prepositions_cases', 'adjective_endings', 'personal_pronouns_cases', 'possessive_pronouns_cases', 'noun_declension']) {
        assert.ok(ids.has(id), `missing exercise type ${id}`);
    }
});

test('new material covers beginner and intermediate levels', () => {
    const levels = new Set(expandedTests.flatMap(dataset => dataset.data).map(item => item.level));
    assert.ok(levels.has('A1'));
    assert.ok(levels.has('A2'));
    assert.ok(levels.has('B1'));
});

test('new case drills use the correct article in each gender', () => {
    const expected = {
        nominativ: { Mann: 'Der', Frau: 'Die', Kind: 'Das' },
        akkusativ: { Mann: 'den', Frau: 'die', Kind: 'das' },
        dativ: { Mann: 'dem', Frau: 'der', Kind: 'dem' },
        genitiv: { Mann: 'des', Frau: 'der', Kind: 'des' }
    };
    for (const [name, genders] of Object.entries(expected)) {
        const dataset = expandedTests.find(item => item.id === `case_${name}`);
        for (const [noun, article] of Object.entries(genders)) {
            const item = dataset.data.find(item => item.infinitive === noun);
            assert.ok(item);
            assert.deepEqual(getAnswerVariants(item)[0], [article]);
        }
    }
});

test('weak nouns and dative plural endings are preserved in the new vocabulary', () => {
    const dataset = expandedTests.find(item => item.id === 'noun_declension');
    for (const [noun, answer] of [['Student', 'Studenten'], ['Kollege', 'Kollegen'], ['Junge', 'Jungen'], ['Löwe', 'Löwen']]) {
        const item = dataset.data.find(item => item.infinitive === noun && item.sentence === 'Ich sehe den ___.');
        assert.deepEqual(getAnswerVariants(item)[0], [answer]);
    }
    for (const [noun, answer] of [['Kind', 'Kindern'], ['Mann', 'Männern'], ['Sofa', 'Sofas'], ['Frau', 'Frauen']]) {
        const item = dataset.data.find(item => item.infinitive === noun && item.sentence.includes('→ Dativ:'));
        assert.deepEqual(getAnswerVariants(item)[0], [answer]);
    }
});

test('indefinite and negative articles cover singular and plural', () => {
    const dataset = expandedTests.find(item => item.id === 'indefinite_articles');
    assert.ok(dataset.data.length >= 30);
    for (const [sentence, answer] of [['Ich kaufe ___ Stuhl.', 'einen'], ['Sie spielt mit ___ Kind.', 'einem'], ['Das ist die Tasche ___ Frau.', 'einer'], ['Wir haben ___ Haustiere.', 'keine']]) {
        assert.equal(checkAnswer(dataset.data.find(item => item.sentence === sentence), [answer]), true);
    }
});
