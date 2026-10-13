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
const additionalExerciseSources = [more_verbs, more_nouns, more_grammar, more_numbers];
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
exerciseGroups.unshift({ id: 'goethe-b2', name: 'Сталі вирази', tests: b2_focus_tests });
exerciseGroups.unshift({ id: 'advanced', name: 'Мова й аргументація', tests: advanced_tests });
const Levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
