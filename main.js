(function () {
    'use strict';
    const core = DeutschCore;
    const $ = id => document.getElementById(id);
    const memoryStorage = new Map();
    const storage = {
        get(key) {
            if (memoryStorage.has(key)) return memoryStorage.get(key);
            try { return localStorage.getItem(key) ?? memoryStorage.get(key) ?? null; }
            catch { return memoryStorage.get(key) ?? null; }
        },
        set(key, value) {
            memoryStorage.set(key, String(value));
            try { localStorage.setItem(key, String(value)); }
            catch {
                $('storageNotice').hidden = false;
                $('storageNotice').textContent = 'Браузер не дозволяє зберігати прогрес. Вправи працюють, але після закриття сторінки нові результати можуть зникнути.';
            }
        }
    };
    function readJSON(key, fallback) {
        try { return JSON.parse(storage.get(key)) ?? fallback; } catch { return fallback; }
    }
    const settings = readJSON('deutsch.settings.v2', {});
    let score = readJSON('deutsch.score.v2', { correct: 0, attempted: 0 });
    try { core.summarizeScore(score, 0, 0); } catch { score = { correct: 0, attempted: 0 }; }
    let currentGroup = exerciseGroups.find(group => group.id === settings?.group) || exerciseGroups[0];
    let currentTest = currentGroup.tests.find(test => test.id === settings?.test) || currentGroup.tests[0];
    let round = [];
    let roundScored = false;
    let mistakes = [];
    let searchTimer;

    function element(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }
    function saveSettings() {
        storage.set('deutsch.settings.v2', JSON.stringify({
            group: currentGroup.id, test: currentTest.id,
            level: $('levelSelect').value, count: Number($('countSelect').value)
        }));
    }
    function renderScore() {
        $('score').textContent = `${score.correct} / ${score.attempted}`;
        $('scorePercent').textContent = score.attempted ? `${Math.round(score.correct / score.attempted * 100)}% правильних` : 'Ще все попереду';
        const legacy = Number(storage.get('total_score'));
        $('legacyScore').hidden = !Number.isSafeInteger(legacy) || legacy <= 0;
        $('legacyScore').textContent = `Раніше: ${legacy} правильних відповідей. Точна статистика спроб ведеться від цього оновлення.`;
    }
    function renderTests() {
        $('testSelect').replaceChildren(...currentGroup.tests.map(test => {
            const option = element('option', '', `${test.name} (${test.data.length.toLocaleString('uk')})`);
            option.value = test.id;
            return option;
        }));
        $('testSelect').value = currentTest.id;
        for (const button of $('buttonWortartenContainer').children) {
            button.setAttribute('aria-pressed', String(button.dataset.group === currentGroup.id));
        }
    }
    function renderLevels(preferred = $('levelSelect').value) {
        const available = new Set(currentTest.data.map(item => item.level));
        const levels = Levels.filter(level => level === 'All' || available.has(level));
        $('levelSelect').replaceChildren(...levels.map(level => {
            const option = element('option', '', level === 'All' ? 'Усі рівні' : level);
            option.value = level;
            return option;
        }));
        $('levelSelect').value = levels.includes(preferred) ? preferred : 'All';
    }
    function renderTask(item, index) {
        const card = element('article', 'task-card');
        card.id = `task-${index}`;
        const heading = element('div', 'task-heading');
        heading.append(element('span', 'task-number', String(index + 1).padStart(2, '0')), element('span', 'badge', item.level));
        card.append(heading);
        const sentence = element('p', 'sentence');
        sentence.lang = 'de';
        const parts = item.sentence.split('___');
        const primary = core.getAnswerVariants(item)[0];
        parts.forEach((part, blank) => {
            sentence.append(document.createTextNode(part));
            if (blank === parts.length - 1) return;
            const fullSentence = currentTest.id === 'sentence_order';
            const input = element(fullSentence ? 'textarea' : 'input', fullSentence ? 'answer-input sentence-answer' : 'answer-input');
            if (fullSentence) {
                input.rows = 3;
                input.addEventListener('input', () => {
                    input.style.height = 'auto';
                    input.style.height = `${input.scrollHeight + 3}px`;
                });
            } else input.type = 'text';
            input.id = `q${index}_${blank}`;
            input.name = input.id;
            input.autocomplete = 'off';
            input.autocapitalize = 'none';
            input.spellcheck = false;
            input.setAttribute('autocorrect', 'off');
            input.inputMode = 'text';
            input.setAttribute('aria-label', `Вправа ${index + 1}, пропуск ${blank + 1}: ${item.sentence.replaceAll('___', '…')}`);
            input.setAttribute('aria-describedby', `feedback-${index}`);
            input.enterKeyHint = index === round.length - 1 && blank === parts.length - 2 ? 'done' : 'next';
            input.style.setProperty('--answer-width', `${Math.min(26, Math.max(8, (primary?.[blank]?.length || 8) + 2))}ch`);
            sentence.append(input);
        });
        card.append(sentence);
        const lemma = currentTest.id === 'nomen' ? '' : item.infinitive;
        const hint = [lemma, item.ua_infinitiv, item.type].filter(Boolean).join(' · ');
        if (hint) card.append(element('p', 'word-hint', hint));
        const translation = element('details', 'translation');
        translation.append(element('summary', '', 'Переклад речення'), element('p', '', item.ua_sentence || item.ua_infinitiv));
        if (currentGroup.id === 'verbs' || currentGroup.id === 'nouns') {
            const word = (item.lemma || item.infinitive || '').split(/[·,]/)[0].trim();
            if (word) {
                const dictionary = element('a', 'dictionary-link', 'Німецько-український словник ↗');
                dictionary.href = `https://dict.com/deutsch-ukrainisch/${encodeURIComponent(word)}`;
                dictionary.target = '_blank';
                dictionary.rel = 'noopener noreferrer';
                translation.append(dictionary);
            }
        }
        card.append(translation);
        const feedback = element('p', 'feedback');
        feedback.id = `feedback-${index}`;
        feedback.hidden = true;
        card.append(feedback);
        return card;
    }
    function generateTasks(items) {
        clearTimeout(searchTimer);
        const pool = core.filterItems(currentTest.data, $('levelSelect').value, $('searchInput').value);
        round = Array.isArray(items) ? [...items] : core.sampleItems(pool, Number($('countSelect').value));
        roundScored = false;
        mistakes = [];
        $('dudenSelection').hidden = true;
        $('retryErrors').hidden = true;
        $('checkButton').disabled = round.length === 0;
        $('checkButton').textContent = 'Перевірити';
        $('newRound').disabled = pool.length === 0;
        $('deskription').textContent = currentTest.desc;
        $('availableCount').textContent = `За цими умовами: ${pool.length} вправ. Пошук працює в обраному тесті.`;
        $('roundInfo').textContent = `${round.length} вправ${Array.isArray(items) ? ' · повторення помилок' : ''}`;
        $('result').textContent = round.length ? 'Заповни пропуски у реченнях.' : 'За цими умовами вправ немає.';
        $('result').className = '';
        const container = $('taskContainer');
        container.replaceChildren(...round.map(renderTask));
        if (!round.length) {
            const empty = element('div', 'empty-state panel');
            empty.append(element('h3', '', 'Спробуй інші умови'), element('p', '', 'Обери інший рівень, тест або очисть пошук.'));
            const reset = element('button', 'secondary', 'Усі рівні, без пошуку');
            reset.type = 'button';
            reset.addEventListener('click', () => {
                $('levelSelect').value = 'All';
                $('searchInput').value = '';
                generateTasks();
            });
            empty.append(reset);
            container.append(empty);
        }
        saveSettings();
    }
    function checkAnswers(event) {
        event.preventDefault();
        if (!round.length) return;
        let correct = 0;
        mistakes = [];
        round.forEach((item, index) => {
            const card = $(`task-${index}`);
            const inputs = [...card.querySelectorAll('.answer-input')];
            const valid = core.checkAnswer(item, inputs.map(input => input.value));
            const feedback = $(`feedback-${index}`);
            card.classList.toggle('is-correct', valid);
            card.classList.toggle('is-incorrect', !valid);
            inputs.forEach(input => input.setAttribute('aria-invalid', String(!valid)));
            feedback.hidden = false;
            const answer = core.getAnswerVariants(item)[0].join(' · ');
            feedback.textContent = valid ? '✓ Правильно!' : `Правильна відповідь: ${answer}`;
            if (item.explanation) feedback.append(document.createTextNode(` ${item.explanation}`));
            if (valid) correct++;
            else mistakes.push(item);
        });
        if (!roundScored) {
            score = core.summarizeScore(score, correct, round.length);
            storage.set('deutsch.score.v2', JSON.stringify(score));
            roundScored = true;
            renderScore();
        }
        $('result').textContent = `${correct} із ${round.length} правильно. ${correct === round.length ? 'Чудово! Спробуй нові речення.' : 'Виправ відповіді або повтори помилки.'}`;
        $('result').className = correct === round.length ? 'correct-result' : '';
        $('retryErrors').hidden = mistakes.length === 0;
        $('retryErrors').textContent = `Повторити помилки (${mistakes.length})`;
        $('checkButton').textContent = 'Перевірити ще раз';
    }

    for (const group of exerciseGroups) {
        const button = element('button', 'topic-button', group.name);
        button.type = 'button';
        button.dataset.group = group.id;
        button.addEventListener('click', () => {
            if (group === currentGroup) return;
            currentGroup = group;
            currentTest = group.tests[0];
            $('searchInput').value = '';
            renderTests();
            renderLevels();
            generateTasks();
        });
        $('buttonWortartenContainer').append(button);
    }
    renderLevels(Levels.includes(settings?.level) ? settings.level : 'C1');
    $('countSelect').value = [5, 10, 20].includes(settings?.count) ? String(settings.count) : '10';
    $('bankCount').textContent = `${exerciseGroups.reduce((sum, group) => sum + group.tests.reduce((n, test) => n + test.data.length, 0), 0).toLocaleString('uk')} вправ`;
    $('testSelect').addEventListener('change', () => {
        currentTest = currentGroup.tests.find(test => test.id === $('testSelect').value);
        $('searchInput').value = '';
        renderLevels();
        generateTasks();
    });
    for (const id of ['levelSelect', 'countSelect']) $(id).addEventListener('change', () => generateTasks());
    $('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => generateTasks(), 250);
    });
    $('exerciseForm').addEventListener('submit', checkAnswers);
    $('exerciseForm').addEventListener('keydown', event => {
        if (event.key !== 'Enter' || !event.target.matches('.answer-input') || event.isComposing) return;
        const inputs = [...$('taskContainer').querySelectorAll('.answer-input')];
        const next = inputs[inputs.indexOf(event.target) + 1];
        event.preventDefault();
        if (next) next.focus();
        else $('exerciseForm').requestSubmit();
    });
    $('newRound').addEventListener('click', () => {
        generateTasks();
        $('practice').scrollIntoView({ block: 'start' });
    });
    $('retryErrors').addEventListener('click', () => {
        generateTasks(mistakes);
        $('practice').scrollIntoView({ block: 'start' });
    });
    const dudenSelection = $('dudenSelection');
    function updateDictionarySelection() {
        const field = document.activeElement;
        // Keep the link available when reached with Tab from a selected word.
        if (field === dudenSelection) return;
        let selected = '';
        if (field?.matches('input, textarea')) {
            if (typeof field.selectionStart === 'number') {
                selected = field.value.slice(field.selectionStart, field.selectionEnd);
            }
        } else {
            selected = window.getSelection()?.toString() || '';
        }
        const word = selected.normalize('NFC').trim();
        // One Latin word, including umlauts and hyphenated German compounds.
        const singleWord = /^[\p{Script=Latin}\p{M}]+(?:[-'’][\p{Script=Latin}\p{M}]+)*$/u.test(word);
        dudenSelection.hidden = !singleWord;
        if (!singleWord) {
            dudenSelection.removeAttribute('href');
            return;
        }
        dudenSelection.textContent = `Відкрити «${word}» у Duden ↗`;
        dudenSelection.href = `https://www.duden.de/suchen/dudenonline/${encodeURIComponent(word)}`;
    }
    document.addEventListener('selectionchange', updateDictionarySelection);
    // Text fields dispatch select even in browsers without input selectionchange.
    document.addEventListener('select', updateDictionarySelection, true);
    document.addEventListener('focusin', updateDictionarySelection);
    document.addEventListener('input', updateDictionarySelection);
    dudenSelection.addEventListener('pointerdown', event => event.preventDefault());
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') dudenSelection.hidden = true;
    });
    $('resetScore').addEventListener('click', () => $('confirmModal').showModal());
    $('btnNo').addEventListener('click', () => $('confirmModal').close());
    $('btnYes').addEventListener('click', () => {
        score = { correct: 0, attempted: 0 };
        storage.set('deutsch.score.v2', JSON.stringify(score));
        storage.set('total_score', '0');
        storage.set('percent_score', '0');
        renderScore();
        $('confirmModal').close();
    });

    // Count only visible, focused, recently active time. Split at local midnight.
    const inactivityLimit = 3 * 60 * 1000;
    let lastTime = Date.now();
    let lastInteraction = lastTime;
    let timerActive = !document.hidden && document.hasFocus();
    let day = core.localDateKey(new Date(lastTime));
    const readTime = key => {
        const value = Number(storage.get(`activeTime_${key}`));
        return Number.isFinite(value) && value >= 0 ? value * 1000 : 0;
    };
    let activeMs = readTime(day);
    function updateTime(now = Date.now()) {
        const elapsed = timerActive ? core.elapsedActiveMs(lastTime, now, lastInteraction, inactivityLimit) : 0;
        let cursor = lastTime;
        const until = lastTime + elapsed;
        while (cursor < until) {
            const date = new Date(cursor);
            const key = core.localDateKey(date);
            if (key !== day) { day = key; activeMs = readTime(day); }
            const midnight = new Date(date);
            midnight.setHours(24, 0, 0, 0);
            const end = Math.min(until, midnight.getTime());
            activeMs += end - cursor;
            storage.set(`activeTime_${day}`, activeMs / 1000);
            cursor = end;
        }
        const today = core.localDateKey(new Date(now));
        if (today !== day) { day = today; activeMs = readTime(day); }
        lastTime = now;
        const seconds = Math.floor(activeMs / 1000);
        $('work_time').textContent = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
    }
    function resume() {
        updateTime();
        lastInteraction = Date.now();
        timerActive = !document.hidden && document.hasFocus();
    }
    document.addEventListener('visibilitychange', () => {
        updateTime();
        timerActive = !document.hidden && document.hasFocus();
        if (timerActive) lastInteraction = Date.now();
    });
    window.addEventListener('blur', () => { updateTime(); timerActive = false; });
    window.addEventListener('focus', resume);
    window.addEventListener('pagehide', () => { updateTime(); timerActive = false; });
    window.addEventListener('pageshow', resume);
    for (const type of ['pointerdown', 'keydown', 'touchstart', 'scroll']) document.addEventListener(type, resume, { passive: true });
    setInterval(updateTime, 1000);
    renderTests();
    renderScore();
    generateTasks();
    updateTime();
})();
