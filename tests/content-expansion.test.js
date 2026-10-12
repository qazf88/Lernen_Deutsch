'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../core.js');
const before = require('./fixtures/content-counts-before.json');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
for (const [, source] of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/src="(data\/[^"?]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, source), 'utf8'), context, { filename: source });
}
const datasets = JSON.parse(vm.runInContext('JSON.stringify(exerciseGroups.flatMap(group => group.tests))', context));
const sources = JSON.parse(vm.runInContext('JSON.stringify([more_verbs, more_nouns, more_grammar, more_numbers])', context));
const additions = Object.assign({}, ...sources);
const key = item => JSON.stringify([item.sentence, item.answers || item.answer, item.infinitive, item.ua_infinitiv]);

test('every existing test receives a substantial expansion', () => {
    assert.ok(datasets.length >= Object.keys(before).length);
    for (const dataset of datasets.filter(item => item.id in before)) {
        const minimum = dataset.id in sources[0] ? 500 : dataset.id in sources[1] ? 150 : dataset.id === 'zahlen' ? 500 : 120;
        assert.ok(dataset.id in before, `unrecognized test ${dataset.id}`);
        assert.ok(Array.isArray(additions[dataset.id]), `no additions to ${dataset.id}`);
        assert.ok(dataset.data.length >= before[dataset.id] + minimum, `${dataset.id}: only ${dataset.data.length - before[dataset.id]} new exercises, expected ${minimum}`);
    }
});

test('all authored additions reach their intended test with no duplicate identities', () => {
    for (const [id, items] of Object.entries(additions)) {
        const dataset = datasets.find(item => item.id === id);
        assert.ok(dataset, `${id} not registered`);
        const registered = new Set(dataset.data.map(key));
        const seen = new Set();
        for (const item of items) {
            const identity = key(item);
            assert.ok(!seen.has(identity), `${id}: duplicate ${identity}`);
            seen.add(identity);
            assert.ok(registered.has(identity), `${id}: omitted exercise ${identity}`);
        }
    }
});

test('new verb drills contain many different expressions in all six tenses', () => {
    for (const [id, items] of Object.entries(sources[0])) {
        const expressions = new Set(items.map(item => item.infinitive));
        assert.ok(expressions.size >= 60, `${id}: only ${expressions.size} expressions`);
        assert.ok(items.some(item => item.answers.length > 1), `${id}: missing compound or separable forms`);
    }
});

test('the noun bank has at least 150 additional lexical entries', () => {
    const words = new Set(sources[1].noun_plurals.map(item => item.infinitive));
    assert.ok(words.size >= 150);
    const original = datasets.find(item => item.id === 'noun_plurals').data.slice(0, before.noun_plurals);
    for (const item of original) assert.equal(words.has(item.infinitive), false, `existing noun repeated: ${item.infinitive}`);
});

test('B2 practice contains thousands of distinct completed sentences and varied lexical units', () => {
    const b2 = datasets.flatMap(dataset => dataset.data).filter(item => item.level === 'B2');
    const completed = item => {
        let index = 0;
        const answers = core.getAnswerVariants(item)[0];
        return item.sentence.replace(/___/g, () => answers[index++]);
    };
    assert.ok(b2.length >= 4000);
    assert.ok(new Set(b2.map(completed)).size >= 3900, 'duplicate sentences must not inflate the B2 bank');
    for (const id of ['b2_collocations', 'b2_sentence_patterns']) {
        const items = datasets.find(dataset => dataset.id === id).data;
        assert.ok(items.length >= 1000, id);
        assert.ok(new Set(items.map(item => item.ua_infinitiv)).size >= 140, `${id}: lexical variety`);
        assert.ok(new Set(items.map(item => item.infinitive.split(' · ')[0])).size >= 9, `${id}: topic variety`);
        assert.equal(new Set(items.map(completed)).size, items.length, `${id}: repeated completed sentence`);
    }
});

test('B2 separable infinitives, multiword predicates and participle alternatives are checked completely', () => {
    const lexical = datasets.find(dataset => dataset.id === 'b2_collocations').data;
    function item(lemma, start) {
        const found = lexical.find(row => row.lemma === lemma && row.sentence.startsWith(start));
        assert.ok(found, `${lemma} / ${start}`);
        return found;
    }
    for (const [lemma, answer] of [['einhalten', 'einzuhalten'], ['abwägen', 'abzuwägen'], ['übernehmen', 'zu übernehmen'], ['ernst nehmen', 'ernst zu nehmen'], ['geltend machen', 'geltend zu machen']]) {
        assert.equal(core.checkAnswer(item(lemma, 'Wir haben uns'), [answer]), true);
    }
    assert.equal(core.checkAnswer(item('anwenden', 'Wir haben das'), ['angewandt']), true);
    assert.equal(core.checkAnswer(item('anwenden', 'Wir haben das'), ['angewendet']), true);
    const multiword = item('ernst nehmen', 'Wir müssen');
    assert.equal(core.checkAnswer(multiword, ['ernst']), false);
    assert.equal(core.checkAnswer(multiword, ['ernst nehmen']), true);
    const search = core.filterItems(lexical, 'B2', 'abwägen');
    assert.equal(search.length, 8, 'complete infinitive remains searchable when the clue only shows its prefix');
});

test('new verb paradigms preserve irregular forms, auxiliary selection and accepted variants', () => {
    function item(id, lemma, subject) {
        const found = sources[0][id].find(row => row.infinitive.startsWith(lemma + ' · ') && row.sentence.startsWith(subject + ' '));
        assert.ok(found, `${id} / ${lemma} / ${subject}`);
        return found;
    }
    for (const [id, lemma, subject, answers] of [
        ['praesens', 'öffnen', 'Du', ['öffnest']],
        ['praesens', 'wechseln', 'Ich', ['wechsle']],
        ['praesens', 'backen', 'Du', ['bäckst']],
        ['praesens', 'backen', 'Ihr', ['backt']],
        ['praeteritum', 'backen', 'Ich', ['buk']],
        ['praeteritum', 'einladen', 'Ihr', ['ludet', 'ein']],
        ['praeteritum', 'einladen', 'Du', ['ludest', 'ein']],
        ['praeteritum', 'lesen', 'Du', ['last']],
        ['praeteritum', 'vergessen', 'Du', ['vergaßt']],
        ['perfekt', 'reisen', 'Wir', ['sind', 'gereist']],
        ['perfekt', 'überweisen', 'Ich', ['habe', 'überwiesen']],
        ['futur2', 'umziehen', 'Du', ['wirst', 'umgezogen', 'sein']]
    ]) assert.equal(core.checkAnswer(item(id, lemma, subject), answers), true, `${id} / ${lemma}`);
    assert.equal(core.checkAnswer(item('praesens', 'backen', 'Ihr'), ['bäckt']), false);
    assert.equal(core.checkAnswer(item('perfekt', 'reisen', 'Wir'), ['haben', 'gereist']), false);
});

test('new noun variants preserve alternative genders and exceptional dative plurals', () => {
    const nouns = sources[1];
    const laptop = nouns.case_nominativ.find(item => item.infinitive === 'Laptop');
    assert.equal(core.checkAnswer(laptop, ['der']), true);
    assert.equal(core.checkAnswer(laptop, ['das']), true);
    assert.equal(core.checkAnswer(laptop, ['die']), false);
    const visa = nouns.noun_declension.find(item => item.infinitive === 'Visum' && item.sentence.startsWith('Nominativ:'));
    assert.equal(core.checkAnswer(visa, ['Visa']), true);
    assert.equal(core.checkAnswer(visa, ['Visen']), true);
    assert.equal(core.checkAnswer(visa, ['Visan']), false);
});

test('new numeric forms cover dates, prices, time, fractions and quantities', () => {
    const numbers = additions.zahlen;
    function find(clue, type) {
        const item = numbers.find(item => item.ua_infinitiv === clue && item.type === type);
        assert.ok(item, `missing ${clue} / ${type}`);
        return item;
    }
    for (const [clue, type, answer] of [
        ['16', 'Кількість · замовлення', 'sechzehn'],
        ['17', 'Кількість · замовлення', 'siebzehn'],
        ['30', 'Кількість · замовлення', 'dreißig'],
        ['60', 'Кількість · замовлення', 'sechzig'],
        ['70', 'Кількість · замовлення', 'siebzig'],
        ['2026', 'Кількість · замовлення', 'zweitausendsechsundzwanzig'],
        ['3', 'Дата · Nominativ', 'dritte'],
        ['7', 'Дата · Dativ', 'siebten'],
        ['8', 'Дата · Dativ', 'achten'],
        ['21', 'Дата · Dativ', 'einundzwanzigsten'],
        ['01:00', 'Час · офіційно, 24 години', 'ein Uhr'],
        ['23:45', 'Час · офіційно, 24 години', 'dreiundzwanzig Uhr fünfundvierzig'],
        ['12:30', 'Час · розмовно, з halb', 'halb eins'],
        ['12:45', 'Час · розмовно, з Viertel vor', 'Viertel vor eins'],
        ['1,50 €', 'Ціна · євро та центи', 'ein Euro fünfzig']
    ]) assert.equal(core.checkAnswer(find(clue, type), [answer]), true, `${clue} => ${answer}`);
    assert.equal(core.checkAnswer(find('01:00', 'Час · офіційно, 24 години'), ['eins Uhr']), false);
    assert.equal(core.checkAnswer(find('1,50 €', 'Ціна · євро та центи'), ['ein Euro und fünfzig Cent']), true);
    assert.equal(core.checkAnswer(find('7', 'Дата · Dativ'), ['siebenten']), true);
    assert.equal(core.checkAnswer(find('100', 'Кількість · замовлення'), ['hundert']), true);
    assert.equal(core.checkAnswer(find('1100', 'Кількість · замовлення'), ['tausendhundert']), true);
});
