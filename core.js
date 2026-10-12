(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.DeutschCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    function normalizeAnswer(value) {
        return String(value ?? '').normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('de');
    }

    function getAnswerVariants(item) {
        const blanks = (item.sentence.match(/___/g) || []).length;
        let answers = item.answers;
        if (!Array.isArray(answers)) {
            const answer = String(item.answer ?? '').trim();
            const words = answer.split(/\s+/u);
            answers = blanks <= 1 ? [answer] : [...words.slice(0, blanks - 1), words.slice(blanks - 1).join(' ')];
        }
        return [answers, ...(item.alternatives || [])]
            .filter(variant => Array.isArray(variant) && variant.length === blanks && variant.every(value => typeof value === 'string' && value.trim()))
            .map(variant => variant.slice());
    }

    function checkAnswer(item, values) {
        return getAnswerVariants(item).some(variant => variant.length === values.length &&
            variant.every((answer, index) => normalizeAnswer(answer) === normalizeAnswer(values[index])));
    }

    function sampleItems(items, count, random = Math.random) {
        const result = [...items];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result.slice(0, Math.max(0, Math.floor(count)));
    }

    function filterItems(items, level = 'All', query = '') {
        const needle = normalizeAnswer(query);
        return items.filter(item => (level === 'All' || item.level === level) &&
            (!needle || normalizeAnswer([item.sentence, item.infinitive, item.lemma, item.ua_infinitiv, item.ua_sentence].join(' ')).includes(needle)));
    }

    function summarizeScore(score, correct, attempted) {
        if (![score.correct, score.attempted, correct, attempted].every(value => Number.isSafeInteger(value) && value >= 0) ||
            score.correct > score.attempted || correct > attempted ||
            !Number.isSafeInteger(score.correct + correct) || !Number.isSafeInteger(score.attempted + attempted)) {
            throw new RangeError('Invalid score');
        }
        return { correct: score.correct + correct, attempted: score.attempted + attempted };
    }

    function localDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function elapsedActiveMs(from, to, lastInteraction, limit) {
        return Math.max(0, Math.min(to, lastInteraction + limit) - from);
    }

    return { normalizeAnswer, getAnswerVariants, checkAnswer, sampleItems, filterItems, summarizeScore, localDateKey, elapsedActiveMs };
});
