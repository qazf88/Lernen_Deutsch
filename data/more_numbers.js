// Everyday quantities and expressions. Contexts use bounded, realistic values.
const more_numbers = (() => {
    const data = [];
    const small = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
    const tens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
    function number(value) {
        if (value < 20) return small[value];
        if (value < 100) return (value % 10 ? (value % 10 === 1 ? 'ein' : small[value % 10]) + 'und' : '') + tens[Math.floor(value / 10)];
        if (value < 1000) return (value < 200 ? 'ein' : small[Math.floor(value / 100)]) + 'hundert' + (value % 100 ? number(value % 100) : '');
        return (value < 2000 ? 'ein' : number(Math.floor(value / 1000))) + 'tausend' + (value % 1000 ? number(value % 1000) : '');
    }
    function ordinal(value) {
        const special = { 1: 'erst', 3: 'dritt', 7: 'siebt', 8: 'acht' };
        return special[value] || number(value) + (value < 20 ? 't' : 'st');
    }
    function variants(value) {
        const result = [value];
        if (value.includes('eintausend')) result.push(value.replace('eintausend', 'tausend'));
        if (value.includes('einhundert')) result.push(value.replace('einhundert', 'hundert'));
        if (value.includes('eintausend') && value.includes('einhundert')) result.push(value.replace('eintausend', 'tausend').replace('einhundert', 'hundert'));
        return [...new Set(result)];
    }
    function add(sentence, answer, clue, translation, type, level = 'A1', explanation = 'Запиши числівник словами.', alternatives = []) {
        const spellings = variants(answer);
        if (/^siebt(e|en)$/.test(answer)) spellings.push(answer.replace('siebt', 'siebent'));
        const accepted = [...new Set([...spellings, ...alternatives])];
        data.push({ sentence, answer, answers: [answer], infinitive: '', ua_infinitiv: clue, ua_sentence: translation,
            type, level, explanation, ...(accepted.length > 1 ? { alternatives: accepted.slice(1).map(text => [text]) } : {}) });
    }
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 40, 42, 50, 60, 70, 80, 90, 99, 100, 102, 110, 125, 200, 250, 365, 500, 999, 1000, 1100, 2026, 5000];
    for (const n of values) {
        add('Die Bestellung umfasst ___ Artikel.', number(n), String(n), `Кількість товарних позицій у замовленні: ${n}.`, 'Кількість · замовлення', n > 100 ? 'A2' : 'A1');
        add('Die Bibliothek bestellt ___ neue Bücher.', number(n), String(n), `Бібліотека замовляє нові книжки; кількість: ${n}.`, 'Кількість · бібліотека', n > 100 ? 'A2' : 'A1');
        if (n <= 40) {
            add('Der Sprachkurs dauert ___ Wochen.', number(n), String(n), `Курс мови триває стільки тижнів: ${n}.`, 'Кількість · тривалість');
            add('In der Gruppe lernen ___ Personen Deutsch.', number(n), String(n), `Кількість людей, які вивчають німецьку в групі: ${n}.`, 'Кількість · навчання');
        } else {
            add('Die Strecke ist ___ Kilometer lang.', number(n), String(n), `Довжина маршруту: ${n} км.`, 'Кількість · відстань', 'A2');
        }
    }
    for (let n = 1; n <= 31; n++) {
        add('Heute ist der ___ Mai.', ordinal(n) + 'e', String(n), `Сьогодні ${n} травня.`, 'Дата · Nominativ', 'A2', 'Після der у називному відмінку порядковий числівник закінчується на -e.');
        add('Der Termin ist am ___ Mai.', ordinal(n) + 'en', String(n), `Зустріч призначено на ${n} травня.`, 'Дата · Dativ', 'A2', 'am = an dem; порядковий числівник має закінчення -en.');
    }
    for (let n = 1; n <= 15; n++) {
        add('Unsere Wohnung liegt im ___ Stock.', ordinal(n) + 'en', String(n), `Наша квартира розташована на ${n}-му поверсі.`, 'Порядок · поверх', 'A2', 'im = in dem, тому im ersten / zweiten / dritten Stock.');
        add('Wir lesen das ___ Kapitel.', ordinal(n) + 'e', String(n), `Ми читаємо ${n}-й розділ.`, 'Порядок · розділ', 'A2', 'Після das в Akkusativ середнього роду закінчення -e.');
    }
    const fractionNames = { 2: 'Hälfte', 3: 'Drittel', 4: 'Viertel', 5: 'Fünftel', 6: 'Sechstel', 7: 'Siebtel', 8: 'Achtel', 9: 'Neuntel', 10: 'Zehntel', 12: 'Zwölftel', 16: 'Sechzehntel', 20: 'Zwanzigstel', 25: 'Fünfundzwanzigstel', 50: 'Fünfzigstel', 100: 'Hundertstel' };
    for (const [denominator, name] of Object.entries(fractionNames)) {
        const answer = Number(denominator) === 2 ? 'die Hälfte' : 'ein ' + name;
        for (const [sentence, ua] of [
            ['___ der Fläche ist bepflanzt.', 'Частка площі, засаджена рослинами'],
            ['Wir haben ___ der Aufgaben erledigt.', 'Частка завдань, яку ми виконали'],
            ['___ des Betrags wurde bereits bezahlt.', 'Частка суми, яку вже сплачено']
        ]) add(sentence, answer, `1/${denominator}`, `${ua}: 1/${denominator}.`, 'Дроби · частина цілого', 'B1', 'Дробові іменники пишемо з великої літери. Для 1/2 у цих реченнях: die Hälfte.', Number(denominator) === 2 ? ['eine Hälfte'] : []);
    }
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50, 100, 200, 1000]) {
        const answer = (n === 1 ? 'ein' : number(n)) + 'mal';
        const tail = n % 10 === 1 && n % 100 !== 11 ? 'раз' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'рази' : 'разів';
        add('Ich habe diese Übung schon ___ gemacht.', answer, String(n), `Я вже виконав цю вправу ${n} ${tail}.`, 'Кратність · вправи', 'A2', 'Кратні числівники з -mal пишемо разом: einmal, zweimal, dreimal.');
        add('Die Datei wurde insgesamt ___ heruntergeladen.', answer, String(n), `Файл загалом завантажили ${n} ${tail}.`, 'Кратність · завантаження', 'A2');
    }
    for (let hour = 1; hour <= 23; hour++) {
        for (const minute of [0, 15, 30, 45]) {
            const answer = (hour === 1 ? 'ein' : number(hour)) + ' Uhr' + (minute ? ' ' + number(minute) : '');
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            add('Der Zug fährt um ___ ab.', answer, time, `Потяг відправляється о ${time}.`, 'Час · офіційно, 24 години', 'A2', 'Назви годину й хвилини словами за 24-годинним форматом: acht Uhr fünfzehn. Для 01:00 — ein Uhr.');
        }
    }
    for (let hour = 1; hour <= 12; hour++) {
        const next = hour === 12 ? 1 : hour + 1;
        const time = `${String(hour).padStart(2, '0')}:30`;
        add('Wir treffen uns um ___.', 'halb ' + number(next), time, `Ми зустрічаємося о ${time}.`, 'Час · розмовно, з halb', 'A2', 'halb позначає половину до наступної години: halb neun = 08:30. Після halb вживаємо eins, а не ein.');
        add('Die Pause beginnt um ___.', 'Viertel nach ' + number(hour), `${String(hour).padStart(2, '0')}:15`, `Перерва починається о ${String(hour).padStart(2, '0')}:15.`, 'Час · розмовно, з Viertel nach', 'A2', 'Viertel nach = чверть години після названої години.');
        add('Der Film beginnt um ___.', 'Viertel vor ' + number(next), `${String(hour).padStart(2, '0')}:45`, `Фільм починається о ${String(hour).padStart(2, '0')}:45.`, 'Час · розмовно, з Viertel vor', 'A2', 'Viertel vor = за чверть до наступної години.');
    }
    for (const euros of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50, 75, 100, 125]) {
        for (const cents of [20, 50, 99]) {
            const money = (euros === 1 ? 'ein' : number(euros)) + ' Euro ' + number(cents);
            const price = `${euros},${cents} €`;
            add('Die Rechnung beträgt ___.', money, price, `Сума рахунку: ${price}.`, 'Ціна · євро та центи', 'A2', 'Суму запиши словами, наприклад: zwei Euro fünfzig. Дозволено також zwei Euro und fünfzig Cent.', [money + ' Cent', money.replace(' Euro ', ' Euro und ') + ' Cent']);
        }
    }
    const expressions = [
        ['Wir reisen ___.', 'zu zweit', 'удвох', 'Ми подорожуємо вдвох.'],
        ['Wir wohnen ___ in dieser Wohnung.', 'zu dritt', 'утрьох', 'Ми живемо в цій квартирі втрьох.'],
        ['Wir spielen ___ Karten.', 'zu viert', 'учотирьох', 'Ми граємо в карти вчотирьох.'],
        ['Wir sitzen ___ am Tisch.', 'zu fünft', 'уп’ятьох', 'Ми сидимо за столом уп’ятьох.'],
        ['Wir arbeiten ___ an dem Projekt.', 'zu sechst', 'ушістьох', 'Ми працюємо над проєктом ушістьох.'],
        ['Die Sitzung dauert ___ Stunden.', 'anderthalb', 'півтори', 'Засідання триває півтори години.', ['eineinhalb']],
        ['Die Fahrt dauert ___ Stunden.', 'zweieinhalb', 'дві з половиною', 'Поїздка триває дві з половиною години.'],
        ['Wir warten seit ___ Stunden.', 'dreieinhalb', 'три з половиною', 'Ми чекаємо вже три з половиною години.'],
        ['In der Schachtel liegen ___ Eier.', 'ein Dutzend', 'дюжина (вираз із Dutzend)', 'У коробці лежить дюжина яєць.'],
        ['Ich kaufe ___ Eier.', 'ein halbes Dutzend', 'пів дюжини (вираз із Dutzend)', 'Я купую пів дюжини яєць.'],
        ['Ich hätte gern ___ Liter Milch.', 'einen halben', 'половину (перед Liter)', 'Я хотів би пів літра молока.'],
        ['Wir brauchen ___ Stunde für die Aufgabe.', 'eine halbe', 'половину (перед Stunde)', 'Нам потрібно пів години на завдання.'],
        ['Das neue Ticket kostet ___ so viel wie das alte.', 'doppelt', 'удвічі', 'Новий квиток коштує вдвічі дорожче за старий.'],
        ['Dieses Zimmer ist ___ so groß wie das andere.', 'dreimal', 'утричі', 'Ця кімната втричі більша за іншу.'],
        ['Dieses Modell kostet nur ___ so viel.', 'halb', 'наполовину', 'Ця модель коштує лише половину ціни.'],
        ['Der Preis wurde um ___ gesenkt.', 'zehn Prozent', '10 %', 'Ціну знизили на десять відсотків.'],
        ['___ der Gäste kommen mit dem Zug.', 'Fünfzig Prozent', '50 %', 'П’ятдесят відсотків гостей приїжджають потягом.'],
        ['Du bekommst ___ Rabatt.', 'fünf Prozent', '5 %', 'Ти отримуєш знижку п’ять відсотків.'],
        ['Die Rechnung stimmt ___ mit meinem Ergebnis überein.', 'zu hundert Prozent', 'на 100 %', 'Розрахунок на сто відсотків збігається з моїм результатом.'],
        ['___ ist eine gerade Zahl.', 'Zwanzig', '20', 'Двадцять — парне число.'],
        ['___ ist eine ungerade Zahl.', 'Einundzwanzig', '21', 'Двадцять один — непарне число.'],
        ['Wir besuchen unsere Freunde ___ Monat.', 'jeden zweiten', 'кожного другого', 'Ми відвідуємо друзів кожного другого місяця.'],
        ['___ Teilnehmer bekommt ein Geschenk.', 'Jeder dritte', 'кожен третій', 'Кожен третій учасник отримує подарунок.'],
        ['Der Kurs findet ___ statt.', 'alle zwei Wochen', 'кожні два тижні', 'Курс відбувається кожні два тижні.'],
        ['Ich fahre ___ nach Hamburg.', 'zweimal im Monat', 'двічі на місяць', 'Я їжджу до Гамбурга двічі на місяць.'],
        ['Wir machen ___ Urlaub.', 'einmal im Jahr', 'раз на рік', 'Ми відпочиваємо у відпустці раз на рік.'],
        ['Sie trainiert ___ im Verein.', 'dreimal pro Woche', 'тричі на тиждень', 'Вона тренується у клубі тричі на тиждень.', ['dreimal in der Woche']],
        ['Wir treffen uns ___ zur Besprechung.', 'einmal pro Woche', 'раз на тиждень', 'Ми зустрічаємося на нараді раз на тиждень.', ['einmal in der Woche']],
        ['Der Unterricht beginnt in ___.', 'zehn Minuten', '10 хвилин', 'Заняття починається за десять хвилин.'],
        ['Der Zug kommt in ___.', 'einer Viertelstunde', 'чверть години (слово Viertelstunde)', 'Потяг прибуде за чверть години.'],
        ['Wir sind seit ___ unterwegs.', 'einer halben Stunde', 'пів години', 'Ми в дорозі вже пів години.'],
        ['Ich bleibe noch ___.', 'eine halbe Stunde', 'пів години', 'Я залишаюся ще на пів години.']
    ];
    expressions.forEach(([sentence, answer, clue, translation, alternatives]) => add(sentence, answer, clue, translation, 'Числові вирази · повсякденне мовлення', 'A2', 'Впиши весь вираз, ураховуючи відмінок і прийменник. Українська підказка задає точне значення.', alternatives || []));
    return { zahlen: data };
})();
