// Explicit references keep the exercise registry safe and work without eval().
const exerciseGroups = [];
for (const test of extra_exercises) {
    let group = exerciseGroups.find(item => item.name === test.group);
    if (!group) {
        group = { id: `extra-${exerciseGroups.length}`, name: test.group, tests: [] };
        exerciseGroups.push(group);
    }
    group.tests.push(test);
}
exerciseGroups.push(
    { id: 'verbs', name: 'Verben · Дієслова', tests: [
        { ...present_sentenses, id: 'praesens' },
        { ...partizip_sentenses, id: 'perfekt' },
        { ...preteritum_sentenses, id: 'praeteritum' },
        { ...plusquamperfekt_sentenses, id: 'plusquamperfekt' },
        { ...futur1_sentenses, id: 'futur1' },
        { ...futur2_sentenses, id: 'futur2' }
    ] },
    { id: 'pronouns', name: 'Pronomen · Займенники', tests: [
        { ...personalpronomen_sentenses, id: 'personalpronomen' },
        { ...possessivpronomen_sentenses, id: 'possessivpronomen' },
        { ...reflexivpronomen_sentenses, id: 'reflexivpronomen' },
        { ...demonstrativpronomen_sentenses, id: 'demonstrativpronomen' }
    ] },
    { id: 'nouns', name: 'Nomen · Іменники', tests: [{ ...nomen, id: 'nomen' }] },
    { id: 'numbers', name: 'Zahlen · Числівники', tests: [{ ...zahlen_test, id: 'zahlen' }] }
);
// Extend every existing test. Keep its object and id so saved preferences remain valid.
const additionalExerciseSources = [more_verbs, more_nouns, more_grammar, more_numbers, grammar_refresh, pronoun_refresh];
const exerciseIdentity = item => JSON.stringify([item.sentence, item.answers || item.answer, item.infinitive, item.ua_infinitiv]);
for (const source of additionalExerciseSources) {
    for (const [id, additions] of Object.entries(source)) {
        const test = exerciseGroups.flatMap(group => group.tests).find(test => test.id === id);
        if (!test) throw new Error(`Unknown exercise test: ${id}`);
        const seen = new Set(test.data.map(exerciseIdentity));
        for (const item of additions) {
            const identity = exerciseIdentity(item);
            if (seen.has(identity)) continue;
            seen.add(identity);
            test.data.push(item);
        }
    }
}
const refreshedTests = exerciseGroups.flatMap(group => group.tests);
refreshedTests.find(test => test.id === 'prepositions_cases').desc = 'Доповни прийменник, артикль або весь залежний фрагмент за підказкою. Для місця й напрямку розрізняй wo? та wohin?; у формальних зворотах ураховуй керування.';
refreshedTests.find(test => test.id === 'adjective_endings').name = 'Прикметники · форми й порівняння';
refreshedTests.find(test => test.id === 'adjective_endings').desc = 'Добери прикметник за значенням або утвори зазначену форму: закінчення, ступінь порівняння чи розгорнуте означення. Рід, число й відмінок визначає речення.';
refreshedTests.find(test => test.id === 'personal_pronouns_cases').name = 'Займенники · форми й відмінки';
refreshedTests.find(test => test.id === 'personal_pronouns_cases').desc = 'Доповни особовий, зворотний або відносний займенник за підказкою. Ураховуй керування; відмінок відносного займенника визначає його роль у підрядному реченні.';
refreshedTests.find(test => test.id === 'possessive_pronouns_cases').desc = 'Утвори присвійну форму або весь іменниковий фрагмент. Власника задає підказка; закінчення залежать від роду, числа й відмінка названого іменника. Без іменника форма може бути самостійною.';
exerciseGroups.unshift({ id: 'goethe-b2', name: 'Сталі вирази', tests: b2_focus_tests });
exerciseGroups.push({ id: 'practice', name: 'Практика й спілкування', tests: practice_tests });
exerciseGroups.push({ id: 'connections', name: 'Запитання й зв’язки', tests: connection_tests });
exerciseGroups.unshift({ id: 'advanced', name: 'Мова й аргументація', tests: advanced_tests });
const Levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
