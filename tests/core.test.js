'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../core.js');

const {
    normalizeAnswer, getAnswerVariants, checkAnswer, sampleItems,
    filterItems, summarizeScore, localDateKey, elapsedActiveMs,
} = core;

test('the same core API loads as a browser script without CommonJS', () => {
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(require.resolve('../core.js'), 'utf8'), context);
    assert.equal(typeof context.DeutschCore.checkAnswer, 'function');
    assert.equal(context.DeutschCore.checkAnswer({ sentence: '___!', answer: 'Hallo' }, ['hallo']), true);
});

test('normalization trims, collapses whitespace and ignores letter case', () => {
    assert.equal(normalizeAnswer(' \t EIN   großer\n Baum  '), 'ein großer baum');
    assert.equal(normalizeAnswer('ZU\u00a0\u00a0FÜNFT'), 'zu fünft');
});

test('normalization supports composed and decomposed German umlauts', () => {
    assert.equal(normalizeAnswer('Fu\u0308ße'), normalizeAnswer('Füße'));
    assert.equal(normalizeAnswer('ÄÖÜ'), 'äöü');
    assert.equal(normalizeAnswer('GROẞ'), 'groß');
});

test('empty and absent answer values normalize to an empty string', () => {
    for (const value of ['', ' \t\n', undefined, null]) assert.equal(normalizeAnswer(value), '');
});

test('normalization preserves meaningful spelling differences', () => {
    assert.notEqual(normalizeAnswer('schon'), normalizeAnswer('schön'));
    assert.notEqual(normalizeAnswer('Masse'), normalizeAnswer('Maße'));
    assert.notEqual(normalizeAnswer('fuenf'), normalizeAnswer('fünf'));
    assert.notEqual(normalizeAnswer('der'), normalizeAnswer('den'));
});

test('one blank accepts the whole multiword legacy answer', () => {
    const item = { sentence: 'Ich esse ___ des Kuchens.', answer: 'ein Drittel' };
    assert.deepEqual(getAnswerVariants(item), [['ein Drittel']]);
    assert.equal(checkAnswer(item, [' EIN   DRITTEL ']), true);
    assert.equal(checkAnswer(item, ['ein']), false);
    assert.equal(checkAnswer(item, ['Drittel']), false);
});

test('two blanks retain all words in the final legacy answer field', () => {
    const item = { sentence: 'Er ___ das Auto ___.', answer: 'hat reparieren lassen' };
    assert.deepEqual(getAnswerVariants(item), [['hat', 'reparieren lassen']]);
    assert.equal(checkAnswer(item, ['hat', 'reparieren lassen']), true);
    assert.equal(checkAnswer(item, ['hat', 'reparieren']), false);
});

test('three and four blanks each receive their corresponding answers', () => {
    const three = { sentence: '___ ___ ___!', answer: 'Wir haben gewonnen' };
    const four = { sentence: '___ ___ ___ ___!', answer: 'Wir werden es geschafft haben' };
    assert.deepEqual(getAnswerVariants(three), [['Wir', 'haben', 'gewonnen']]);
    assert.deepEqual(getAnswerVariants(four), [['Wir', 'werden', 'es', 'geschafft haben']]);
    assert.equal(checkAnswer(three, ['wir', 'haben', 'gewonnen']), true);
    assert.equal(checkAnswer(four, ['Wir', 'werden', 'es', 'geschafft haben']), true);
});

test('explicit field answers take precedence over legacy splitting', () => {
    const item = {
        sentence: '___ arbeitet ___.',
        answer: 'Der junge Mann zu Hause',
        answers: ['Der junge Mann', 'zu Hause'],
    };
    assert.deepEqual(getAnswerVariants(item), [['Der junge Mann', 'zu Hause']]);
    assert.equal(checkAnswer(item, ['der junge Mann', 'zu Hause']), true);
    assert.equal(checkAnswer(item, ['Der', 'junge Mann zu Hause']), false);
});

test('complete alternative answers are accepted without mixing variants', () => {
    const item = {
        sentence: '___ ___ hier.',
        answers: ['Du', 'arbeitest'],
        alternatives: [['Ihr', 'arbeitet'], ['Sie', 'arbeiten']],
    };
    assert.deepEqual(getAnswerVariants(item), [
        ['Du', 'arbeitest'], ['Ihr', 'arbeitet'], ['Sie', 'arbeiten'],
    ]);
    assert.equal(checkAnswer(item, ['Ihr', 'arbeitet']), true);
    assert.equal(checkAnswer(item, ['sie', 'arbeiten']), true);
    assert.equal(checkAnswer(item, ['Du', 'arbeiten']), false);
    assert.equal(checkAnswer(item, ['Ihr', 'arbeitest']), false);
});

test('answer checking rejects empty, missing and additional fields', () => {
    const item = { sentence: 'Er ___ nach ___.', answers: ['fährt', 'Berlin'] };
    for (const values of [[], ['fährt'], ['fährt', ''], ['', 'Berlin'], [' ', ' '], ['fährt', 'Berlin', 'extra']]) {
        assert.equal(checkAnswer(item, values), false, JSON.stringify(values));
    }
});

test('answer checking does not silently merge fields or accept partial words', () => {
    const item = { sentence: '___ hilft ___.', answers: ['Der Mann', 'dem Kind'] };
    assert.equal(checkAnswer(item, ['Der Mann dem Kind']), false);
    assert.equal(checkAnswer(item, ['Der Mann', 'dem']), false);
    assert.equal(checkAnswer(item, ['Der Mann', 'dem Kind extra']), false);
});

test('answer checking normalizes input without changing original exercises', () => {
    const item = Object.freeze({ sentence: 'Ich sehe ___.', answers: Object.freeze(['die Bäume']) });
    const values = Object.freeze(['  DIE BA\u0308UME ']);
    assert.equal(checkAnswer(item, values), true);
    assert.deepEqual(item.answers, ['die Bäume']);
    assert.deepEqual(values, ['  DIE BA\u0308UME ']);
});

test('answer variants are independent copies, safe for rendering and feedback', () => {
    const item = { sentence: '___!', answers: ['Hallo'], alternatives: [['Guten Tag']] };
    const variants = getAnswerVariants(item);
    variants[0][0] = 'changed';
    variants[1][0] = 'changed';
    assert.deepEqual(item.answers, ['Hallo']);
    assert.deepEqual(item.alternatives, [['Guten Tag']]);
});

test('sampling handles empty sets, zero count and counts larger than the bank', () => {
    assert.deepEqual(sampleItems([], 10), []);
    assert.deepEqual(sampleItems([1, 2, 3], 0), []);
    assert.deepEqual(sampleItems([42], 10), [42]);
    assert.equal(sampleItems([1, 2, 3], 20).length, 3);
});

test('sampling returns distinct entries without modifying the original bank', () => {
    const items = Object.freeze(Array.from({ length: 60 }, (_, id) => Object.freeze({ id })));
    const selected = sampleItems(items, 25, () => 0);
    assert.equal(selected.length, 25);
    assert.equal(new Set(selected).size, 25);
    assert.ok(selected.every(item => items.includes(item)));
    assert.deepEqual(items.map(item => item.id), Array.from({ length: 60 }, (_, id) => id));
    assert.notStrictEqual(selected, items);
});

test('sampling can use deterministic randomness and returns a full permutation', () => {
    const items = Array.from({ length: 20 }, (_, id) => id);
    const random = () => {
        let seed = 2026;
        return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    };
    const first = sampleItems(items, items.length, random());
    assert.deepEqual(first, sampleItems(items, items.length, random()));
    assert.deepEqual([...first].sort((a, b) => a - b), items);
    assert.notDeepEqual(first, items);
});

const searchableItems = Object.freeze([
    Object.freeze({ sentence: 'Das ___ ist groß.', infinitive: 'Haus', ua_infinitiv: 'будинок', ua_sentence: 'Цей будинок великий.', level: 'A1' }),
    Object.freeze({ sentence: 'Er ___ täglich.', infinitive: 'arbeiten', ua_infinitiv: 'працювати', ua_sentence: 'Він щодня працює.', level: 'A2' }),
    Object.freeze({ sentence: 'Die Bäume ___ grün.', infinitive: 'sein', ua_infinitiv: 'бути', ua_sentence: 'Дерева зелені.', level: 'B1' }),
]);

test('filtering supports every level and All without altering the source', () => {
    assert.deepEqual(filterItems(searchableItems), searchableItems);
    assert.deepEqual(filterItems(searchableItems, 'A2'), [searchableItems[1]]);
    assert.deepEqual(filterItems(searchableItems, 'C1'), []);
    assert.equal(searchableItems.length, 3);
});

test('search covers German sentence, lemma and both Ukrainian fields', () => {
    for (const [query, index] of [['GROß', 0], [' ARBEITEN ', 1], ['будинок', 0], ['щодня', 1], ['Ba\u0308ume', 2]]) {
        assert.deepEqual(filterItems(searchableItems, 'All', query), [searchableItems[index]], query);
    }
});

test('search and level filters combine and gracefully handle empty results', () => {
    assert.deepEqual(filterItems(searchableItems, 'A1', 'arbeiten'), []);
    assert.deepEqual(filterItems(searchableItems, 'A2', 'arbeiten'), [searchableItems[1]]);
    assert.deepEqual(filterItems(searchableItems, 'All', 'unbekanntes Wort'), []);
    assert.deepEqual(filterItems([], 'All', 'Haus'), []);
    assert.deepEqual(filterItems(searchableItems, 'All', '  '), searchableItems);
});

test('score accumulates actual attempted tasks across rounds of different sizes', () => {
    const original = Object.freeze({ correct: 7, attempted: 10 });
    const afterSmallRound = summarizeScore(original, 2, 3);
    assert.deepEqual(afterSmallRound, { correct: 9, attempted: 13 });
    assert.deepEqual(summarizeScore(afterSmallRound, 15, 20), { correct: 24, attempted: 33 });
    assert.deepEqual(original, { correct: 7, attempted: 10 });
});

test('score preserves zero attempts and counts incorrect submissions', () => {
    assert.deepEqual(summarizeScore({ correct: 0, attempted: 0 }, 0, 0), { correct: 0, attempted: 0 });
    assert.deepEqual(summarizeScore({ correct: 2, attempted: 5 }, 0, 7), { correct: 2, attempted: 12 });
});

test('score rejects impossible, negative, fractional and nonfinite new counts', () => {
    const score = { correct: 0, attempted: 0 };
    for (const [correct, attempted] of [[2, 1], [-1, 1], [0, -1], [0.5, 1], [1, 1.5], [NaN, 1], [0, NaN], [Infinity, Infinity], [0, Infinity], ['1', 2]]) {
        assert.throws(() => summarizeScore(score, correct, attempted), RangeError, `${correct}/${attempted}`);
    }
});

test('score rejects invalid saved totals rather than propagating corruption', () => {
    for (const score of [{ correct: 5, attempted: 3 }, { correct: -1, attempted: 2 }, { correct: NaN, attempted: 2 }, { correct: 1, attempted: Infinity }]) {
        assert.throws(() => summarizeScore(score, 1, 1), RangeError);
    }
});

test('score rejects integer overflow before totals lose precision', () => {
    const max = Number.MAX_SAFE_INTEGER;
    assert.deepEqual(summarizeScore({ correct: max - 1, attempted: max - 1 }, 1, 1), { correct: max, attempted: max });
    assert.throws(() => summarizeScore({ correct: max, attempted: max }, 1, 1), RangeError);
    assert.throws(() => summarizeScore({ correct: 0, attempted: max }, 0, 1), RangeError);
});

test('local date keys pad month and day and follow the calendar year', () => {
    assert.equal(localDateKey(new Date(2026, 0, 2, 12)), '2026-01-02');
    assert.equal(localDateKey(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
    assert.equal(localDateKey(new Date(2027, 0, 1, 0, 1)), '2027-01-01');
});

test('daily statistics use the local day at midnight instead of UTC', () => {
    const originalTimezone = process.env.TZ;
    try {
        for (const [timezone, expected] of [['Europe/Berlin', '2026-07-02'], ['Pacific/Honolulu', '2026-07-01']]) {
            process.env.TZ = timezone;
            assert.equal(localDateKey(new Date('2026-07-01T22:30:00.000Z')), expected, timezone);
        }
    } finally {
        if (originalTimezone === undefined) delete process.env.TZ;
        else process.env.TZ = originalTimezone;
    }
});

test('active time counts intervals wholly inside the interaction timeout', () => {
    assert.equal(elapsedActiveMs(1000, 2500, 1000, 5000), 1500);
    assert.equal(elapsedActiveMs(1000, 1000, 1000, 5000), 0);
});

test('active time clips a delayed timer tick at the inactivity boundary', () => {
    assert.equal(elapsedActiveMs(1000, 100000, 1000, 5000), 5000);
    assert.equal(elapsedActiveMs(5000, 9000, 1000, 5000), 1000);
    assert.equal(elapsedActiveMs(6000, 9000, 1000, 5000), 0);
});

test('active time never becomes negative after a backward clock change', () => {
    assert.equal(elapsedActiveMs(9000, 5000, 1000, 5000), 0);
    assert.equal(elapsedActiveMs(5000, 9000, 1000, 0), 0);
});
