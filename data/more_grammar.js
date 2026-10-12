/*
 * Розширені граматичні тренування. У кожному записі один елемент answers
 * відповідає одному ___. Особи, власники та леми завжди задані в підказці.
 * Контексти та парадигми перевірено окремо; генерація не випадкова.
 */
const more_grammar = {
  personalpronomen: [], possessivpronomen: [], reflexivpronomen: [],
  demonstrativpronomen: [], personal_pronouns_cases: [],
  possessive_pronouns_cases: [], prepositions_cases: [],
  adjective_endings: [], indefinite_articles: []
};

(() => {
  const upper = s => s[0].toUpperCase() + s.slice(1);
  const add = (id, sentence, answers, infinitive, ua_infinitiv, ua_sentence, level, explanation) => {
    more_grammar[id].push({ sentence, answers, answer: answers.join(' '), infinitive, ua_infinitiv, ua_sentence, level, explanation });
  };
  // Slots: ich, du, er, sie, es, wir, ihr, sie (Plural), Sie (Höflichkeit).
  const people = [
    ['Ich','я','mich','mir','мене','мені','мною'], ['Du','ти','dich','dir','тебе','тобі','тобою'],
    ['Er','він','ihn','ihm','його','йому','ним'], ['Sie','вона','sie','ihr','її','їй','нею'],
    ['Es','воно (дитина)','es','ihm','її (дитину)','їй (дитині)','нею (дитиною)'],
    ['Wir','ми','uns','uns','нас','нам','нами'], ['Ihr','ви (кілька осіб, неформально)','euch','euch','вас','вам','вами'],
    ['Sie','вони','sie','ihnen','їх','їм','ними'], ['Sie','Ви (ввічливе звертання)','Sie','Ihnen','Вас','Вам','Вами']
  ];
  const paradigms = [
    ['lernen','lerne|lernst|lernt|lernt|lernt|lernen|lernt|lernen|lernen','lernen Deutsch mit kurzen Geschichten.','вивчати','вивчаю|вивчаєш|вивчає|вивчає|вивчає|вивчаємо|вивчаєте|вивчають|вивчаєте','німецьку за короткими оповіданнями.'],
    ['lesen','lese|liest|liest|liest|liest|lesen|lest|lesen|lesen','lesen jeden Abend ein Bilderbuch.','читати','читаю|читаєш|читає|читає|читає|читаємо|читаєте|читають|читаєте','щовечора книжку з малюнками.'],
    ['trinken','trinke|trinkst|trinkt|trinkt|trinkt|trinken|trinkt|trinken|trinken','trinken zum Frühstück warmen Kakao.','пити','п’ю|п’єш|п’є|п’є|п’є|п’ємо|п’єте|п’ють|п’єте','на сніданок тепле какао.'],
    ['essen','esse|isst|isst|isst|isst|essen|esst|essen|essen','essen heute eine Gemüsesuppe.','їсти','їм|їси|їсть|їсть|їсть|їмо|їсте|їдять|їсте','сьогодні овочевий суп.'],
    ['fahren','fahre|fährst|fährt|fährt|fährt|fahren|fahrt|fahren|fahren','fahren am Samstag mit dem Zug.','їхати','їду|їдеш|їде|їде|їде|їдемо|їдете|їдуть|їдете','в суботу потягом.'],
    ['schlafen','schlafe|schläfst|schläft|schläft|schläft|schlafen|schlaft|schlafen|schlafen','schlafen bei offenem Fenster.','спати','сплю|спиш|спить|спить|спить|спимо|спите|сплять|спите','з відчиненим вікном.'],
    ['sprechen','spreche|sprichst|spricht|spricht|spricht|sprechen|sprecht|sprechen|sprechen','sprechen leise in der Bibliothek.','говорити','говорю|говориш|говорить|говорить|говорить|говоримо|говорите|говорять|говорите','тихо в бібліотеці.'],
    ['helfen','helfe|hilfst|hilft|hilft|hilft|helfen|helft|helfen|helfen','helfen beim Aufräumen der Küche.','допомагати','допомагаю|допомагаєш|допомагає|допомагає|допомагає|допомагаємо|допомагаєте|допомагають|допомагаєте','прибирати кухню.'],
    ['nehmen','nehme|nimmst|nimmt|nimmt|nimmt|nehmen|nehmt|nehmen|nehmen','nehmen einen Regenschirm mit.','брати із собою','беру|береш|бере|бере|бере|беремо|берете|беруть|берете','із собою парасолю.'],
    ['sehen','sehe|siehst|sieht|sieht|sieht|sehen|seht|sehen|sehen','sehen einen Regenbogen am Himmel.','бачити','бачу|бачиш|бачить|бачить|бачить|бачимо|бачите|бачать|бачите','веселку на небі.'],
    ['tragen','trage|trägst|trägt|trägt|trägt|tragen|tragt|tragen|tragen','tragen beim Radfahren einen Helm.','носити','ношу|носиш|носить|носить|носить|носимо|носите|носять|носите','шолом під час їзди велосипедом.'],
    ['laufen','laufe|läufst|läuft|läuft|läuft|laufen|lauft|laufen|laufen','laufen vorsichtig über die Brücke.','бігти','біжу|біжиш|біжить|біжить|біжить|біжимо|біжите|біжать|біжите','обережно через міст.'],
    ['warten','warte|wartest|wartet|wartet|wartet|warten|wartet|warten|warten','warten geduldig an der Haltestelle.','чекати','чекаю|чекаєш|чекає|чекає|чекає|чекаємо|чекаєте|чекають|чекаєте','терпляче на зупинці.'],
    ['hören','höre|hörst|hört|hört|hört|hören|hört|hören|hören','hören unterwegs ein Hörbuch.','слухати','слухаю|слухаєш|слухає|слухає|слухає|слухаємо|слухаєте|слухають|слухаєте','в дорозі аудіокнижку.'],
    ['spielen','spiele|spielst|spielt|spielt|spielt|spielen|spielt|spielen|spielen','spielen im Garten mit dem Hund.','гратися','граюся|граєшся|грається|грається|грається|граємося|граєтеся|граються|граєтеся','в саду із собакою.'],
    ['singen','singe|singst|singt|singt|singt|singen|singt|singen|singen','singen ein Lied auf Deutsch.','співати','співаю|співаєш|співає|співає|співає|співаємо|співаєте|співають|співаєте','пісню німецькою.'],
    ['malen','male|malst|malt|malt|malt|malen|malt|malen|malen','malen ein buntes Bild für Oma.','малювати','малюю|малюєш|малює|малює|малює|малюємо|малюєте|малюють|малюєте','барвистий малюнок для бабусі.'],
    ['suchen','suche|suchst|sucht|sucht|sucht|suchen|sucht|suchen|suchen','suchen die verlorene Fahrkarte.','шукати','шукаю|шукаєш|шукає|шукає|шукає|шукаємо|шукаєте|шукають|шукаєте','загублений квиток.'],
    ['besuchen','besuche|besuchst|besucht|besucht|besucht|besuchen|besucht|besuchen|besuchen','besuchen am Sonntag das Naturkundemuseum.','відвідувати','відвідую|відвідуєш|відвідує|відвідує|відвідує|відвідуємо|відвідуєте|відвідують|відвідуєте','в неділю природничий музей.'],
    ['bleiben','bleibe|bleibst|bleibt|bleibt|bleibt|bleiben|bleibt|bleiben|bleiben','bleiben wegen des Gewitters zu Hause.','залишатися','залишаюся|залишаєшся|залишається|залишається|залишається|залишаємося|залишаєтеся|залишаються|залишаєтеся','вдома через грозу.'],
    ['verstehen','verstehe|verstehst|versteht|versteht|versteht|verstehen|versteht|verstehen|verstehen','verstehen die Regeln des Spiels.','розуміти','розумію|розумієш|розуміє|розуміє|розуміє|розуміємо|розумієте|розуміють|розумієте','правила гри.']
  ];
  for (const [lemma, forms, phrase, uaVerb, uaForms, uaTail] of paradigms) {
    const conjugated = forms.split('|'), translations = uaForms.split('|');
    const tail = phrase.slice(phrase.indexOf(' ') + 1);
    people.forEach(([nom, ua], i) => {
      const subject = ua.replace(/ \(.+\)/u, '');
      add('personalpronomen', `___ ${conjugated[i]} ${tail}`, [nom], lemma, `${ua}; ${uaVerb}`,
        `${upper(subject)} ${translations[i]} ${uaTail}`, 'A1', 'Встав підмет у Nominativ. Українська підказка визначає особу; форму дієслова вже наведено.');
    });
  }
  // The independent subject prevents reflexive forms from being required.
  const caseContexts = [
    ['Die Reiseleiterin begrüßt ___ am Eingang.','akk','begrüßen','вітати','Екскурсоводка вітає § біля входу.',4],
    ['Der Fotograf fotografiert ___ vor dem Schloss.','akk','fotografieren','фотографувати','Фотограф фотографує § перед замком.',4],
    ['Die Ärztin untersucht ___ gründlich.','akk','untersuchen','оглядати','Лікарка ретельно оглядає §.',4],
    ['Die Trainerin lobt ___ für den Einsatz.','akk','loben','хвалити','Тренерка хвалить § за старання.',4],
    ['Der Taxifahrer bringt ___ zum Bahnhof.','akk','bringen','відвозити','Таксист відвозить § на вокзал.',4],
    ['Die Gastgeberin erwartet ___ zum Abendessen.','akk','erwarten','очікувати','Господиня чекає на § на вечерю.',4],
    ['Der Nachbar hört ___ auf der Treppe.','akk','hören','чути','Сусід чує § на сходах.',4],
    ['Die Lehrkraft versteht ___ auch ohne Worte.','akk','verstehen','розуміти','Викладач розуміє § навіть без слів.',4],
    ['Der Hausmeister sucht ___ im Gebäude.','akk','suchen','шукати','Завгосп шукає § у будівлі.',4],
    ['Die Verkäuferin berät ___ bei der Auswahl.','akk','beraten','консультувати','Продавчиня консультує § щодо вибору.',4],
    ['Die Mitarbeiterin hilft ___ beim Ausfüllen.','dat','helfen','допомагати','Працівниця допомагає § із заповненням.',5],
    ['Der Kellner empfiehlt ___ die Tagessuppe.','dat','empfehlen','рекомендувати','Офіціант рекомендує § суп дня.',5],
    ['Die Lehrerin erklärt ___ den Unterschied.','dat','erklären','пояснювати','Учителька пояснює § різницю.',5],
    ['Der Pförtner zeigt ___ den richtigen Eingang.','dat','zeigen','показувати','Вахтер показує § правильний вхід.',5],
    ['Die Nachbarin leiht ___ eine Taschenlampe.','dat','leihen','позичати','Сусідка позичає § ліхтарик.',5],
    ['Der Arzt antwortet ___ noch am selben Tag.','dat','antworten','відповідати','Лікар відповідає § ще того самого дня.',5],
    ['Die Chefin dankt ___ für die Unterstützung.','dat','danken','дякувати','Керівниця дякує § за підтримку.',5],
    ['Der Musiker schenkt ___ eine Eintrittskarte.','dat','schenken','дарувати','Музикант дарує § вхідний квиток.',5],
    ['Die Dolmetscherin spricht mit ___ über den Termin.','dat','mit','з','Перекладачка розмовляє з § про зустріч.',6],
    ['Der Organisator überreicht ___ eine Urkunde.','dat','überreichen','вручати','Організатор вручає § грамоту.',5]
  ];
  for (const [sentence, grammaticalCase, lemma, uaLemma, translation, translationIndex] of caseContexts) {
    people.forEach(p => add('personal_pronouns_cases', sentence, [p[grammaticalCase === 'akk' ? 2 : 3]],
      `${lemma} · ${p[0] === 'Sie' && p[1] !== 'Ви (ввічливе звертання)' ? 'sie' : p[0].toLowerCase() === 'sie' && p[1].startsWith('Ви') ? 'Sie' : p[0].toLowerCase()}`,
      `${p[1]}; ${uaLemma}`, translation.replace('§', p[translationIndex]), 'A2',
      grammaticalCase === 'akk' ? `${lemma} вимагає особового займенника в Akkusativ.` : `${lemma === 'mit' ? 'Прийменник mit' : 'Одержувач або додаток при ' + lemma} вимагає Dativ.`));
  }
})();

(() => {
  const upper = s => s[0].toUpperCase() + s.slice(1);
  const add = (id, sentence, answer, infinitive, ua_infinitiv, ua_sentence, level, explanation) => {
    const answers = [sentence.startsWith('___') ? upper(answer) : answer];
    more_grammar[id].push({ sentence, answers, answer: answers.join(' '), infinitive, ua_infinitiv, ua_sentence, level, explanation });
  };
  const endings = {
    nom: {m:'',f:'e',n:'',p:'e'}, akk: {m:'en',f:'e',n:'',p:'e'},
    dat: {m:'em',f:'er',n:'em',p:'en'}, gen: {m:'es',f:'er',n:'es',p:'er'}
  };
  const uaKeys = ['m','f','n','p','mg','fg','pg','mi','fi','pi','md','fd','pd','fa'];
  const owners = [
    ['ich','mein','я','мій|моя|моє|мої|мого|моєї|моїх|моїм|моєю|моїми|моєму|моїй|моїм|мою'],
    ['du','dein','ти','твій|твоя|твоє|твої|твого|твоєї|твоїх|твоїм|твоєю|твоїми|твоєму|твоїй|твоїм|твою'],
    ['er','sein','він','його|його|його|його|його|його|його|його|його|його|його|його|його|його'],
    ['sie (Singular)','ihr','вона','її|її|її|її|її|її|її|її|її|її|її|її|її|її'],
    ['wir','unser','ми','наш|наша|наше|наші|нашого|нашої|наших|нашим|нашою|нашими|нашому|нашій|нашим|нашу'],
    ['ihr','euer','ви (неформально, кілька осіб)','ваш|ваша|ваше|ваші|вашого|вашої|ваших|вашим|вашою|вашими|вашому|вашій|вашим|вашу'],
    ['sie (Plural)','ihr','вони','їхній|їхня|їхнє|їхні|їхнього|їхньої|їхніх|їхнім|їхньою|їхніми|їхньому|їхній|їхнім|їхню'],
    ['Sie','Ihr','Ви (ввічливо)','Ваш|Ваша|Ваше|Ваші|Вашого|Вашої|Ваших|Вашим|Вашою|Вашими|Вашому|Вашій|Вашим|Вашу']
  ];
  // sentence | German gender | German case | Ukrainian possessive form | translation | noun lemma
  const basics = [
    ['___ Rucksack liegt im Gepäckfach.','m','nom','m','§ рюкзак лежить на багажній полиці.','Rucksack'],
    ['___ Fahrkarte ist bis morgen gültig.','f','nom','m','§ квиток дійсний до завтра.','Fahrkarte'],
    ['___ Fahrrad braucht neue Bremsen.','n','nom','m','§ велосипед потребує нових гальм.','Fahrrad'],
    ['___ Nachbarn pflanzen Blumen.','p','nom','p','§ сусіди садять квіти.','Nachbarn'],
    ['___ Reisepass liegt im Safe.','m','nom','m','§ закордонний паспорт лежить у сейфі.','Reisepass'],
    ['___ Bewerbung ist schon unterwegs.','f','nom','f','§ заява на роботу вже в дорозі.','Bewerbung'],
    ['___ Zeugnis enthält gute Noten.','n','nom','m','§ атестат містить добрі оцінки.','Zeugnis'],
    ['___ Kopfhörer funktionieren wieder.','p','nom','p','§ навушники знову працюють.','Kopfhörer'],
    ['___ Kalender hängt neben der Tür.','m','nom','m','§ календар висить біля дверей.','Kalender'],
    ['___ Kollegin übernimmt die Frühschicht.','f','nom','f','§ колега бере на себе ранкову зміну.','Kollegin'],
    ['___ Smartphone hat keinen Empfang.','n','nom','m','§ смартфон не має зв’язку.','Smartphone'],
    ['___ Pflanzen brauchen mehr Licht.','p','nom','p','§ рослини потребують більше світла.','Pflanzen'],
    ['Der Mechaniker repariert ___ Roller.','m','akk','m','Механік ремонтує § скутер.','Roller'],
    ['Die Sekretärin bestätigt ___ Anmeldung.','f','akk','fa','Секретарка підтверджує § реєстрацію.','Anmeldung'],
    ['Der Zoll kontrolliert ___ Gepäck.','n','akk','m','Митниця перевіряє § багаж.','Gepäck'],
    ['Die Bibliothekarin verlängert ___ Ausleihfristen.','p','akk','p','Бібліотекарка продовжує § терміни користування книжками.','Ausleihfristen'],
    ['Der Bote liefert ___ Schreibtisch.','m','akk','m','Кур’єр доставляє § письмовий стіл.','Schreibtisch'],
    ['Die Werkstatt prüft ___ Waschmaschine.','f','akk','fa','Майстерня перевіряє § пральну машину.','Waschmaschine'],
    ['Die Lehrkraft liest ___ Diktat.','n','akk','m','Викладач читає § диктант.','Diktat'],
    ['Der Hausmeister findet ___ Schlüssel.','p','akk','p','Завгосп знаходить § ключі.','Schlüssel (Plural)'],
    ['Die Ärztin untersucht ___ Großvater.','m','akk','mg','Лікарка оглядає § дідуся.','Großvater'],
    ['Der Veranstalter begrüßt ___ Schwester.','f','akk','fa','Організатор вітає § сестру.','Schwester'],
    ['Die Trainerin betreut ___ Kind.','n','akk','fa','Тренерка опікується § дитиною.','Kind'],
    ['Der Lehrer korrigiert ___ Aufsätze.','p','akk','p','Учитель виправляє § твори.','Aufsätze']
  ];
  // betreuen requires Akkusativ in German; Ukrainian uses instrumental after опікуватися.
  basics[22][3] = 'fi';
  const advanced = [
    ['Die Chefin spricht mit ___ Vertreter.','m','dat','mi','Керівниця розмовляє з § представником.','Vertreter'],
    ['Die Kinder helfen ___ Großmutter beim Kochen.','f','dat','fd','Діти допомагають § бабусі готувати.','Großmutter'],
    ['Der Ausflug beginnt bei ___ Ferienhaus.','n','dat','mg','Екскурсія починається біля § будиночка для відпочинку.','Ferienhaus'],
    ['Das Team gratuliert ___ Eltern zum Jubiläum.','p','dat','pd','Команда вітає § батьків із ювілеєм.','Eltern'],
    ['Die Tasche liegt neben ___ Sessel.','m','dat','mi','Сумка лежить поруч із § кріслом.','Sessel'],
    ['Die Unterlagen liegen in ___ Schublade.','f','dat','fd','Документи лежать у § шухляді.','Schublade'],
    ['Der Hund schläft vor ___ Zelt.','n','dat','mi','Собака спить перед § наметом.','Zelt'],
    ['Die Kinder spielen mit ___ Haustieren.','p','dat','pi','Діти граються з § домашніми тваринами.','Haustiere'],
    ['Der Verband vertraut ___ Trainer.','m','dat','md','Об’єднання довіряє § тренерові.','Trainer'],
    ['Die Blumen stehen auf ___ Terrasse.','f','dat','fd','Квіти стоять на § терасі.','Terrasse'],
    ['Die Ärztin erklärt ___ Baby nichts, sondern untersucht es.','n','dat','fd','Лікарка нічого не пояснює § немовляті, а оглядає його.','Baby'],
    ['Die Werkstatt arbeitet mit ___ Werkzeugen.','p','dat','pi','Майстерня працює з § інструментами.','Werkzeuge'],
    ['Die Farbe ___ Mantels gefällt allen.','m','gen','mg','Колір § пальта подобається всім.','Mantel'],
    ['Die Fenster ___ Wohnung sind frisch geputzt.','f','gen','fg','Вікна § квартири щойно помиті.','Wohnung'],
    ['Der Akku ___ Tablets ist leer.','n','gen','mg','Акумулятор § планшета розряджений.','Tablet'],
    ['Die Namen ___ Gäste stehen auf der Liste.','p','gen','pg','Імена § гостей є у списку.','Gäste'],
    ['Die Abfahrt ___ Zuges verzögert sich.','m','gen','mg','Відправлення § потяга затримується.','Zug'],
    ['Die Laufzeit ___ Versicherung endet im Juni.','f','gen','mg','Термін дії § страхування завершується в червні.','Versicherung'],
    ['Die Adresse ___ Büros steht auf der Webseite.','n','gen','mg','Адреса § офісу вказана на сайті.','Büro'],
    ['Die Ergebnisse ___ Prüfungen kommen morgen.','p','gen','pg','Результати § іспитів будуть завтра.','Prüfungen'],
    ['Der Inhalt ___ Koffers ist zerbrechlich.','m','gen','fg','Вміст § валізи крихкий.','Koffer'],
    ['Die Reparatur ___ Heizung dauert zwei Tage.','f','gen','fg','Ремонт § системи опалення триває два дні.','Heizung'],
    ['Die Größe ___ Grundstücks ist im Vertrag angegeben.','n','gen','fg','Розмір § земельної ділянки зазначено в договорі.','Grundstück'],
    ['Die Farben ___ Zeichnungen leuchten kräftig.','p','gen','pg','Кольори § малюнків яскраво сяють.','Zeichnungen']
  ];
  // Ukrainian gratulieren is translated by вітати + accusative.
  advanced[3][3] = 'pg';
  // A natural neuter recipient, without teaching an implausible conversation with a baby.
  advanced[10] = ['Der Tierarzt hilft ___ Kaninchen.','n','dat','md','Ветеринар допомагає § кролику.','Kaninchen'];
  for (const [id, rows] of [['possessivpronomen', basics], ['possessive_pronouns_cases', advanced]]) {
    rows.forEach(([sentence, gender, grammaticalCase, uaKey, translation, noun]) => {
      owners.forEach(([person, lemma, ownerUa, forms]) => {
        const ending = endings[grammaticalCase][gender];
        const stem = lemma === 'euer' && ending ? 'eur' : lemma;
        const uaWord = forms.split('|')[uaKeys.indexOf(uaKey)];
        add(id, sentence, stem + ending, `${person} · ${noun}`, `Власник: ${ownerUa}`,
          upper(translation.replace('§', uaWord)), grammaticalCase === 'gen' ? 'B1' : 'A2',
          `Власник ${person} задає основу ${lemma}. ${grammaticalCase.toUpperCase()}, ${gender === 'p' ? 'множина' : {m:'чоловічий',f:'жіночий',n:'середній'}[gender] + ' рід'}: ${ending ? 'закінчення -' + ending : 'без закінчення'}.${lemma === 'euer' && ending ? ' Перед закінченням euer скорочується до eur-.' : ''}`);
      });
    });
  }
  const furtherDemo = [
    ['___ Wasserkocher schaltet automatisch ab.','m','nom','m','§ електрочайник вимикається автоматично.','Wasserkocher'],
    ['___ Unterkunft bietet ein Frühstück an.','f','nom','n','§ помешкання пропонує сніданок.','Unterkunft'],
    ['___ Schwimmbad öffnet um sieben Uhr.','n','nom','m','§ басейн відчиняється о сьомій.','Schwimmbad'],
    ['___ Straßen werden im Herbst erneuert.','p','nom','p','§ вулиці оновлять восени.','Straßen'],
    ['Der Student übersetzt ___ Abschnitt.','m','akk','m','Студент перекладає § уривок.','Abschnitt'],
    ['Die Redaktion veröffentlicht ___ Meldung.','f','akk','n','Редакція публікує § повідомлення.','Meldung'],
    ['Der Verkäufer verpackt ___ Geschenk.','n','akk','m','Продавець пакує § подарунок.','Geschenk'],
    ['Die Köchin wäscht ___ Kräuter.','p','akk','fa','Кухарка миє § зелень.','Kräuter'],
    ['Der Hund liegt unter ___ Esstisch.','m','dat','mi','Собака лежить під § обіднім столом.','Esstisch'],
    ['Die Nummer steht auf ___ Rechnung.','f','dat','md','Номер вказаний на § рахунку.','Rechnung'],
    ['Die Tür ___ Gebäudes ist verschlossen.','n','gen','fg','Двері § будівлі замкнені.','Gebäude'],
    ['Die Bewohner ___ Häuser treffen sich im Hof.','p','gen','pg','Мешканці § будинків зустрічаються у дворі.','Häuser']
  ];
  const strong = {nom:{m:'er',f:'e',n:'es',p:'e'},akk:{m:'en',f:'e',n:'es',p:'e'},dat:{m:'em',f:'er',n:'em',p:'en'},gen:{m:'es',f:'er',n:'es',p:'er'}};
  const same = {nom:{m:'derselbe',f:'dieselbe',n:'dasselbe',p:'dieselben'},akk:{m:'denselben',f:'dieselbe',n:'dasselbe',p:'dieselben'},dat:{m:'demselben',f:'derselben',n:'demselben',p:'denselben'},gen:{m:'desselben',f:'derselben',n:'desselben',p:'derselben'}};
  const demos = [
    ['dieser','dies','цей|ця|це|ці|цього|цієї|цих|цим|цією|цими|цьому|цій|цим|цю'],
    ['jener','jen','той|та|те|ті|того|тієї|тих|тим|тією|тими|тому|тій|тим|ту'],
    ['derselbe',null,'той самий|та сама|те саме|ті самі|того самого|тієї самої|тих самих|тим самим|тією самою|тими самими|тому самому|тій самій|тим самим|ту саму']
  ];
  [...basics, ...advanced, ...furtherDemo].forEach(([sentence, gender, grammaticalCase, uaKey, translation, noun]) => {
    demos.forEach(([lemma, stem, uaForms]) => {
      const answer = stem ? stem + strong[grammaticalCase][gender] : same[grammaticalCase][gender];
      add('demonstrativpronomen', sentence, answer, `${lemma} · ${noun}`, uaForms.split('|')[0],
        upper(translation.replace('§', uaForms.split('|')[uaKeys.indexOf(uaKey)])), lemma === 'derselbe' || grammaticalCase === 'gen' ? 'B1' : 'A2',
        `${lemma}: ${grammaticalCase.toUpperCase()}, ${gender === 'p' ? 'множина' : {m:'чоловічий',f:'жіночий',n:'середній'}[gender] + ' рід'}. ${stem ? 'Вказівне слово отримує закінчення означеного артикля.' : 'У derselbe відмінюється перша частина як означений артикль, а -selbe/-selben має слабке закінчення.'}`);
    });
  });
})();

(() => {
  // Each six-form paradigm is ich / du / er,sie / wir / ihr / sie,Sie.
  const people = [
    ['Ich','я',0,'mich','mir'], ['Du','ти',1,'dich','dir'], ['Er','він',2,'sich','sich'],
    ['Sie','вона',2,'sich','sich'], ['Wir','ми',3,'uns','uns'],
    ['Ihr','ви (неформально)',4,'euch','euch'], ['Sie','вони',5,'sich','sich'], ['Sie','Ви (ввічливо)',5,'sich','sich']
  ];
  const rows = [
    ['sich beeilen','beeile|beeilst|beeilt|beeilen|beeilt|beeilen','___, um den Bus zu erreichen.','akk','поспішати','поспішаю|поспішаєш|поспішає|поспішаємо|поспішаєте|поспішають','щоб встигнути на автобус.'],
    ['sich ausruhen','ruhe|ruhst|ruht|ruhen|ruht|ruhen','___ nach der Wanderung aus.','akk','відпочивати','відпочиваю|відпочиваєш|відпочиває|відпочиваємо|відпочиваєте|відпочивають','після пішої прогулянки.'],
    ['sich entspannen','entspanne|entspannst|entspannt|entspannen|entspannt|entspannen','___ bei ruhiger Musik.','akk','розслаблятися','розслабляюся|розслабляєшся|розслабляється|розслабляємося|розслабляєтеся|розслабляються','під спокійну музику.'],
    ['sich hinsetzen','setze|setzt|setzt|setzen|setzt|setzen','___ auf die Bank hin.','akk','сідати','сідаю|сідаєш|сідає|сідаємо|сідаєте|сідають','на лаву.'],
    ['sich umziehen','ziehe|ziehst|zieht|ziehen|zieht|ziehen','___ nach der Arbeit um.','akk','переодягатися','переодягаюся|переодягаєшся|переодягається|переодягаємося|переодягаєтеся|переодягаються','після роботи.'],
    ['sich anziehen','ziehe|ziehst|zieht|ziehen|zieht|ziehen','___ für den Ausflug warm an.','akk','одягатися','одягаюся|одягаєшся|одягається|одягаємося|одягаєтеся|одягаються','тепло для екскурсії.'],
    ['sich ärgern','ärgere|ärgerst|ärgert|ärgern|ärgert|ärgern','___ über die Verspätung.','akk','сердитися','серджуся|сердишся|сердиться|сердимося|сердитеся|сердяться','через запізнення.'],
    ['sich freuen','freue|freust|freut|freuen|freut|freuen','___ auf das Wiedersehen.','akk','радіти','радію|радієш|радіє|радіємо|радієте|радіють','майбутній зустрічі.'],
    ['sich erinnern','erinnere|erinnerst|erinnert|erinnern|erinnert|erinnern','___ an den ersten Schultag.','akk','згадувати','згадую|згадуєш|згадує|згадуємо|згадуєте|згадують','перший шкільний день.'],
    ['sich entschuldigen','entschuldige|entschuldigst|entschuldigt|entschuldigen|entschuldigt|entschuldigen','___ für den Fehler.','akk','вибачатися','вибачаюся|вибачаєшся|вибачається|вибачаємося|вибачаєтеся|вибачаються','за помилку.'],
    ['sich anmelden','melde|meldest|meldet|melden|meldet|melden','___ für einen Sprachkurs an.','akk','записуватися','записуюся|записуєшся|записується|записуємося|записуєтеся|записуються','на мовний курс.'],
    ['sich verabreden','verabrede|verabredest|verabredet|verabreden|verabredet|verabreden','___ mit Freunden zum Kaffee.','akk','домовлятися про зустріч','домовляюся|домовляєшся|домовляється|домовляємося|домовляєтеся|домовляються','з друзями зустрітися за кавою.'],
    ['sich die Hände waschen','wasche|wäschst|wäscht|waschen|wascht|waschen','___ vor dem Essen die Hände.','dat','мити собі руки','мию|миєш|миє|миємо|миєте|миють','собі руки перед їжею.'],
    ['sich die Zähne putzen','putze|putzt|putzt|putzen|putzt|putzen','___ nach dem Frühstück die Zähne.','dat','чистити собі зуби','чищу|чистиш|чистить|чистимо|чистите|чистять','собі зуби після сніданку.'],
    ['sich die Haare kämmen','kämme|kämmst|kämmt|kämmen|kämmt|kämmen','___ vor dem Spiegel die Haare.','dat','розчісувати собі волосся','розчісую|розчісуєш|розчісує|розчісуємо|розчісуєте|розчісують','собі волосся перед дзеркалом.'],
    ['sich Notizen machen','mache|machst|macht|machen|macht|machen','___ während des Vortrags Notizen.','dat','робити собі нотатки','роблю|робиш|робить|робимо|робите|роблять','собі нотатки під час доповіді.'],
    ['sich etwas merken','merke|merkst|merkt|merken|merkt|merken','___ die Adresse der Unterkunft.','dat','запам’ятовувати','запам’ятовую|запам’ятовуєш|запам’ятовує|запам’ятовуємо|запам’ятовуєте|запам’ятовують','адресу помешкання.'],
    ['sich etwas ausdenken','denke|denkst|denkt|denken|denkt|denken','___ eine lustige Geschichte aus.','dat','вигадувати','вигадую|вигадуєш|вигадує|вигадуємо|вигадуєте|вигадують','кумедну історію.'],
    ['sich etwas überlegen','überlege|überlegst|überlegt|überlegen|überlegt|überlegen','___ eine passende Antwort.','dat','обмірковувати','обмірковую|обмірковуєш|обмірковує|обмірковуємо|обмірковуєте|обмірковують','доречну відповідь.'],
    ['sich etwas ansehen','sehe|siehst|sieht|sehen|seht|sehen','___ die Altstadt genauer an.','dat','оглядати','оглядаю|оглядаєш|оглядає|оглядаємо|оглядаєте|оглядають','старе місто уважніше.'],
    ['sich etwas ausleihen','leihe|leihst|leiht|leihen|leiht|leihen','___ in der Bibliothek einen Krimi aus.','dat','позичати собі','позичаю|позичаєш|позичає|позичаємо|позичаєте|позичають','собі детектив у бібліотеці.'],
    ['sich etwas wünschen','wünsche|wünschst|wünscht|wünschen|wünscht|wünschen','___ zum Geburtstag eine Reise.','dat','бажати собі','бажаю|бажаєш|бажає|бажаємо|бажаєте|бажають','собі подорож на день народження.'],
    ['sich einen Schal umbinden','binde|bindest|bindet|binden|bindet|binden','___ einen warmen Schal um.','dat','пов’язувати собі шарф','пов’язую|пов’язуєш|пов’язує|пов’язуємо|пов’язуєте|пов’язують','собі теплий шарф.'],
    ['sich Zeit nehmen','nehme|nimmst|nimmt|nehmen|nehmt|nehmen','___ am Wochenende Zeit zum Lesen.','dat','виділяти собі час','виділяю|виділяєш|виділяє|виділяємо|виділяєте|виділяють','собі час на читання у вихідні.']
  ];
  rows.forEach(([lemma, forms, tail, grammaticalCase, uaLemma, uaForms, uaTail]) => {
    people.forEach(([nom, ua, formIndex, akk, dat]) => {
      const answer = grammaticalCase === 'akk' ? akk : dat;
      const subject = ua.replace(/ \(.+\)/u, '');
      const uaIndex = ua.startsWith('Ви') ? 4 : formIndex;
      const translation = `${subject[0].toUpperCase() + subject.slice(1)} ${uaForms.split('|')[uaIndex]} ${uaTail}`;
      const sentence = `${nom} ${forms.split('|')[formIndex]} ${tail}`;
      more_grammar.reflexivpronomen.push({sentence, answers:[answer], answer, infinitive:lemma, ua_infinitiv:`${ua}; ${uaLemma}`, ua_sentence:translation,
        level:'A2', explanation: grammaticalCase === 'akk' ? `${lemma}: зворотний займенник стоїть в Akkusativ і узгоджується з підметом.` : 'У реченні вже є прямий додаток (Akkusativ), тому зворотний займенник — Dativ: mir, dir, sich, uns, euch, sich.'});
    });
  });
})();

(() => {
  const add = (sentence, answers, infinitive, ua_infinitiv, ua_sentence, level, explanation) => {
    more_grammar.prepositions_cases.push({sentence, answers, answer:answers.join(' '), infinitive, ua_infinitiv, ua_sentence, level, explanation});
  };
  const articles = {m:['den','dem'],f:['die','der'],n:['das','dem'],p:['die','den']};
  // Controlled pairs: placing/moving to a destination versus position at that destination.
  const spatial = [
    ['in','f','Schublade','шухляда','Ich lege den Schlüssel in ___ Schublade.','Der Schlüssel liegt in ___ Schublade.','Я кладу ключ у шухляду.','Ключ лежить у шухляді.'],
    ['in','f','Schüssel','миска','Ich lege das Obst in ___ Schüssel.','Das Obst liegt in ___ Schüssel.','Я кладу фрукти в миску.','Фрукти лежать у мисці.'],
    ['in','m','Korb','кошик','Wir legen die Wäsche in ___ Korb.','Die Wäsche liegt in ___ Korb.','Ми кладемо білизну в кошик.','Білизна лежить у кошику.'],
    ['in','m','Topf','каструля','Sie gießt die Suppe in ___ Topf.','Die Suppe ist in ___ Topf.','Вона наливає суп у каструлю.','Суп у каструлі.'],
    ['in','f','Garage','гараж','Er fährt das Auto in ___ Garage.','Das Auto steht in ___ Garage.','Він заїжджає автомобілем у гараж.','Автомобіль стоїть у гаражі.'],
    ['in','n','Regal','стелаж','Wir stellen die Bücher in ___ Regal.','Die Bücher stehen in ___ Regal.','Ми ставимо книжки на стелаж.','Книжки стоять на стелажі.'],
    ['in','m','Ordner','тека','Ich hefte die Dokumente in ___ Ordner.','Die Dokumente sind in ___ Ordner.','Я підшиваю документи в теку.','Документи в теці.'],
    ['auf','n','Tablett','таця','Ich stelle den Teller auf ___ Tablett.','Der Teller steht auf ___ Tablett.','Я ставлю тарілку на тацю.','Тарілка стоїть на таці.'],
    ['auf','m','Schreibtisch','письмовий стіл','Du stellst den Laptop auf ___ Schreibtisch.','Der Laptop steht auf ___ Schreibtisch.','Ти ставиш ноутбук на письмовий стіл.','Ноутбук стоїть на письмовому столі.'],
    ['auf','f','Treppe','сходи','Er stellt die Schuhe auf ___ Treppe.','Die Schuhe stehen auf ___ Treppe.','Він ставить взуття на сходи.','Взуття стоїть на сходах.'],
    ['auf','f','Bank','лава','Sie legt die Jacke auf ___ Bank.','Die Jacke liegt auf ___ Bank.','Вона кладе куртку на лаву.','Куртка лежить на лаві.'],
    ['auf','m','Wagen','візок','Wir legen die Pakete auf ___ Wagen.','Die Pakete liegen auf ___ Wagen.','Ми кладемо пакунки на візок.','Пакунки лежать на візку.'],
    ['auf','n','Fensterbrett','підвіконня','Ich stelle die Vase auf ___ Fensterbrett.','Die Vase steht auf ___ Fensterbrett.','Я ставлю вазу на підвіконня.','Ваза стоїть на підвіконні.'],
    ['an','f','Wand','стіна','Du hängst den Kalender an ___ Wand.','Der Kalender hängt an ___ Wand.','Ти вішаєш календар на стіну.','Календар висить на стіні.'],
    ['an','m','Kühlschrank','холодильник','Sie heftet das Foto an ___ Kühlschrank.','Das Foto hängt an ___ Kühlschrank.','Вона прикріплює фото до холодильника.','Фото висить на холодильнику.'],
    ['an','f','Tür','двері','Wir kleben den Zettel an ___ Tür.','Der Zettel klebt an ___ Tür.','Ми приклеюємо записку до дверей.','Записка приклеєна до дверей.'],
    ['an','f','Hauswand','стіна будинку','Er lehnt die Leiter an ___ Hauswand.','Die Leiter lehnt an ___ Hauswand.','Він притуляє драбину до стіни будинку.','Драбина притулена до стіни будинку.'],
    ['an','m','Zaun','паркан','Wir stellen die Fahrräder an ___ Zaun.','Die Fahrräder stehen an ___ Zaun.','Ми ставимо велосипеди біля паркану.','Велосипеди стоять біля паркану.'],
    ['unter','m','Sitz','сидіння','Ich schiebe die Tasche unter ___ Sitz.','Die Tasche liegt unter ___ Sitz.','Я засовую сумку під сидіння.','Сумка лежить під сидінням.'],
    ['unter','n','Bett','ліжко','Du schiebst die Kiste unter ___ Bett.','Die Kiste steht unter ___ Bett.','Ти засовуєш ящик під ліжко.','Ящик стоїть під ліжком.'],
    ['unter','m','Esstisch','обідній стіл','Wir legen den Teppich unter ___ Esstisch.','Der Teppich liegt unter ___ Esstisch.','Ми кладемо килим під обідній стіл.','Килим лежить під обіднім столом.'],
    ['unter','m','Wasserhahn','водопровідний кран','Sie stellt die Schüssel unter ___ Wasserhahn.','Die Schüssel steht unter ___ Wasserhahn.','Вона ставить миску під кран.','Миска стоїть під краном.'],
    ['über','n','Sofa','диван','Ich hänge das Poster über ___ Sofa.','Das Poster hängt über ___ Sofa.','Я вішаю плакат над диваном.','Плакат висить над диваном.'],
    ['über','n','Waschbecken','умивальник','Er hängt den Spiegel über ___ Waschbecken.','Der Spiegel hängt über ___ Waschbecken.','Він вішає дзеркало над умивальником.','Дзеркало висить над умивальником.'],
    ['über','f','Werkbank','верстак','Wir hängen die Lampe über ___ Werkbank.','Die Lampe hängt über ___ Werkbank.','Ми вішаємо лампу над верстаком.','Лампа висить над верстаком.'],
    ['über','m','Kamin','камін','Du hängst das Bild über ___ Kamin.','Das Bild hängt über ___ Kamin.','Ти вішаєш картину над каміном.','Картина висить над каміном.'],
    ['vor','n','Tor','ворота','Sie fährt das Auto vor ___ Tor.','Das Auto steht vor ___ Tor.','Вона під’їжджає автомобілем до воріт.','Автомобіль стоїть перед воротами.'],
    ['vor','f','Bühne','сцена','Wir stellen den Stuhl vor ___ Bühne.','Der Stuhl steht vor ___ Bühne.','Ми ставимо стілець перед сценою.','Стілець стоїть перед сценою.'],
    ['vor','m','Eingang','вхід','Er stellt das Schild vor ___ Eingang.','Das Schild steht vor ___ Eingang.','Він ставить табличку перед входом.','Табличка стоїть перед входом.'],
    ['vor','n','Fenster','вікно','Ich stelle die Pflanze vor ___ Fenster.','Die Pflanze steht vor ___ Fenster.','Я ставлю рослину перед вікном.','Рослина стоїть перед вікном.'],
    ['hinter','m','Schuppen','сарай','Du schiebst das Fahrrad hinter ___ Schuppen.','Das Fahrrad steht hinter ___ Schuppen.','Ти закочуєш велосипед за сарай.','Велосипед стоїть за сараєм.'],
    ['hinter','f','Garderobe','вішалка','Ich stelle den Koffer hinter ___ Garderobe.','Der Koffer steht hinter ___ Garderobe.','Я ставлю валізу за вішалку.','Валіза стоїть за вішалкою.'],
    ['hinter','n','Sofa','диван','Wir schieben die Kiste hinter ___ Sofa.','Die Kiste steht hinter ___ Sofa.','Ми засуваємо ящик за диван.','Ящик стоїть за диваном.'],
    ['hinter','m','Vorhang','штора','Sie stellt die Schuhe hinter ___ Vorhang.','Die Schuhe stehen hinter ___ Vorhang.','Вона ставить взуття за штору.','Взуття стоїть за шторою.'],
    ['neben','m','Computer','комп’ютер','Er stellt den Drucker neben ___ Computer.','Der Drucker steht neben ___ Computer.','Він ставить принтер біля комп’ютера.','Принтер стоїть біля комп’ютера.'],
    ['neben','f','Kommode','комод','Du stellst den Papierkorb neben ___ Kommode.','Der Papierkorb steht neben ___ Kommode.','Ти ставиш кошик для паперу біля комода.','Кошик для паперу стоїть біля комода.'],
    ['neben','n','Bücherregal','книжковий стелаж','Wir stellen den Sessel neben ___ Bücherregal.','Der Sessel steht neben ___ Bücherregal.','Ми ставимо крісло біля книжкового стелажа.','Крісло стоїть біля книжкового стелажа.'],
    ['zwischen','p','Bäume','дерева','Wir spannen die Hängematte zwischen ___ Bäume.','Die Hängematte hängt zwischen ___ Bäumen.','Ми натягуємо гамак між деревами.','Гамак висить між деревами.'],
    ['zwischen','p','Stühle','стільці','Ich stelle die Tasche zwischen ___ Stühle.','Die Tasche steht zwischen ___ Stühlen.','Я ставлю сумку між стільцями.','Сумка стоїть між стільцями.'],
    ['zwischen','p','Fenster','вікна','Sie hängt die Uhr zwischen ___ Fenster.','Die Uhr hängt zwischen ___ Fenstern.','Вона вішає годинник між вікнами.','Годинник висить між вікнами.']
  ];
  spatial.forEach(([prep, gender, noun, uaNoun, direction, position, uaDirection, uaPosition]) => {
    const [akk, dat] = articles[gender];
    add(direction,[akk],`${prep} · ${noun}`,`${uaNoun}; куди? (нове положення)`,uaDirection,'A2',`${prep} позначає напрямок до нового місця: Akkusativ.`);
    add(position,[dat],`${prep} · ${noun}`,`${uaNoun}; де? (місце)`,uaPosition,'A2',`${prep} позначає місце: Dativ.${gender === 'p' ? ' У множині іменник також отримує -n, якщо потрібне.' : ''}`);
    add(`${direction} ${position}`,[akk,dat],`${prep} · ${noun}`,`${uaNoun}; спочатку розміщення, потім місце`,`${uaDirection} ${uaPosition}`,'B1','Порівняй два пропуски: розміщення предмета в новому місці потребує Akkusativ, його подальше місце — Dativ.');
  });
  const fixed = [
    ['Wir fahren mit ___ Straßenbahn ins Zentrum.','der','mit · Straßenbahn','трамвай','Ми їдемо трамваєм у центр.','dat'],
    ['Sie öffnet die Dose mit ___ Messer.','dem','mit · Messer','ніж','Вона відкриває банку ножем.','dat'],
    ['Er arbeitet mit ___ Kollegen an einem Bericht.','den','mit · Kollegen','колеги','Він працює з колегами над звітом.','dat'],
    ['Die Nachricht kommt von ___ Verwaltung.','der','von · Verwaltung','адміністрація','Повідомлення надходить від адміністрації.','dat'],
    ['Das Paket kommt von ___ Großvater.','dem','von · Großvater','дідусь','Посилка надходить від дідуся.','dat'],
    ['Wir bekommen Tipps von ___ Einheimischen.','den','von · Einheimische (Plural)','місцеві мешканці','Ми отримуємо поради від місцевих мешканців.','dat'],
    ['Sie kommt aus ___ Schwimmbad.','dem','aus · Schwimmbad','басейн','Вона виходить із басейну.','dat'],
    ['Er nimmt den Saft aus ___ Flasche.','der','aus · Flasche','пляшка','Він бере сік із пляшки.','dat'],
    ['Der Duft kommt aus ___ Bäckerei.','der','aus · Bäckerei','пекарня','Запах лине з пекарні.','dat'],
    ['Wir gehen zu ___ Informationsschalter.','dem','zu · Informationsschalter','довідкове віконце','Ми йдемо до довідкового віконця.','dat'],
    ['Die Schüler gehen zu ___ Turnhalle.','der','zu · Turnhalle','спортзал','Учні йдуть до спортзалу.','dat'],
    ['Die Betreuerin geht zu ___ Kindern.','den','zu · Kinder','діти','Вихователька йде до дітей.','dat'],
    ['Er wohnt vorübergehend bei ___ Cousine.','der','bei · Cousine','двоюрідна сестра','Він тимчасово живе у двоюрідної сестри.','dat'],
    ['Wir lassen den Schlüssel bei ___ Hausmeister.','dem','bei · Hausmeister','завгосп','Ми залишаємо ключ у завгоспа.','dat'],
    ['Sie übernachten bei ___ Freunden.','den','bei · Freunde','друзі','Вони ночують у друзів.','dat'],
    ['Nach ___ Frühstück räumen wir die Küche auf.','dem','nach · Frühstück','сніданок','Після сніданку ми прибираємо кухню.','dat'],
    ['Nach ___ Besprechung schreiben wir ein Protokoll.','der','nach · Besprechung','нарада','Після наради ми пишемо протокол.','dat'],
    ['Seit ___ Umzug ist der Arbeitsweg kürzer.','dem','seit · Umzug','переїзд','Після переїзду шлях на роботу став коротшим.','dat'],
    ['Seit ___ Renovierung ist die Wohnung heller.','der','seit · Renovierung','ремонт','Після ремонту квартира стала світлішою.','dat'],
    ['Außer ___ Bruder kennt niemand den Plan.','dem','außer · Bruder','брат','Окрім брата, ніхто не знає плану.','dat'],
    ['Außer ___ Mitgliedern darf niemand teilnehmen.','den','außer · Mitglieder','члени','Окрім членів, ніхто не може брати участь.','dat'],
    ['Gegenüber ___ Rathaus gibt es eine Eisdiele.','dem','gegenüber · Rathaus','ратуша','Навпроти ратуші є кафе-морозиво.','dat'],
    ['Das Hotel liegt gegenüber ___ Post.','der','gegenüber · Post','пошта','Готель розташований навпроти пошти.','dat'],
    ['Die Anleitung ist für ___ Drucker bestimmt.','den','für · Drucker','принтер','Інструкція призначена для принтера.','akk'],
    ['Das Formular ist für ___ Anmeldung nötig.','die','für · Anmeldung','реєстрація','Цей бланк потрібний для реєстрації.','akk'],
    ['Wir sammeln Spenden für ___ Tierheim.','das','für · Tierheim','притулок для тварин','Ми збираємо пожертви для притулку для тварин.','akk'],
    ['Die Plätze sind für ___ Gäste reserviert.','die','für · Gäste','гості','Місця зарезервовані для гостей.','akk'],
    ['Ohne ___ Ausweis kann ich das Paket nicht abholen.','den','ohne · Ausweis','посвідчення','Без посвідчення я не можу забрати посилку.','akk'],
    ['Ohne ___ Brille kann sie den Text kaum lesen.','die','ohne · Brille','окуляри','Без окулярів вона ледь може прочитати текст.','akk'],
    ['Ohne ___ Ladegerät bleibt das Telefon aus.','das','ohne · Ladegerät','зарядний пристрій','Без зарядного пристрою телефон залишається вимкненим.','akk'],
    ['Wir fahren durch ___ Tunnel.','den','durch · Tunnel','тунель','Ми їдемо через тунель.','akk'],
    ['Der Weg führt durch ___ Altstadt.','die','durch · Altstadt','старе місто','Шлях проходить через старе місто.','akk'],
    ['Die Besucher gehen durch ___ Drehkreuz.','das','durch · Drehkreuz','турнікет','Відвідувачі проходять через турнікет.','akk'],
    ['Der Hund läuft durch ___ Pfützen.','die','durch · Pfützen','калюжі','Собака біжить через калюжі.','akk'],
    ['Der Ball prallt gegen ___ Pfosten.','den','gegen · Pfosten','стійка','М’яч вдаряється об стійку.','akk'],
    ['Die Firma verstößt gegen ___ Vorschrift.','die','gegen · Vorschrift','припис','Фірма порушує припис.','akk'],
    ['Die Mannschaft spielt gegen ___ Nachbarteam.','das','gegen · Nachbarteam','сусідня команда','Команда грає проти сусідньої команди.','akk'],
    ['Die Kinder sitzen um ___ Lagerfeuer.','das','um · Lagerfeuer','багаття','Діти сидять навколо багаття.','akk'],
    ['Wir laufen einmal um ___ See.','den','um · See','озеро','Ми один раз оббігаємо озеро.','akk'],
    ['Die Katze schleicht um ___ Scheune.','die','um · Scheune','стодола','Кішка крадеться навколо стодоли.','akk'],
    ['Während ___ Konzerts bleiben die Türen geschlossen.','des','während · Konzert','концерт','Під час концерту двері залишаються зачиненими.','gen'],
    ['Während ___ Pause trinken wir Wasser.','der','während · Pause','перерва','Під час перерви ми п’ємо воду.','gen'],
    ['Während ___ Ferien fährt die Familie ans Meer.','der','während · Ferien','канікули','Під час канікул родина їде на море.','gen'],
    ['Wegen ___ Sturms fällt die Fähre aus.','des','wegen · Sturm','буря','Через бурю пором скасовано.','gen'],
    ['Wegen ___ Baustelle ist die Straße gesperrt.','der','wegen · Baustelle','будівельний майданчик','Через будівництво вулицю перекрито.','gen'],
    ['Wegen ___ Unfalls kommt die Polizei.','des','wegen · Unfall','аварія','Через аварію приїжджає поліція.','gen'],
    ['Trotz ___ Nebels startet das Flugzeug.','des','trotz · Nebel','туман','Попри туман літак злітає.','gen'],
    ['Trotz ___ Hitze arbeiten wir im Garten.','der','trotz · Hitze','спека','Попри спеку ми працюємо в саду.','gen'],
    ['Trotz ___ Schwierigkeiten setzt sie das Studium fort.','der','trotz · Schwierigkeiten','труднощі','Попри труднощі вона продовжує навчання.','gen'],
    ['Statt ___ Aufzugs benutzen wir die Treppe.','des','statt · Aufzug','ліфт','Замість ліфта ми користуємося сходами.','gen'],
    ['Statt ___ Zeitung liest er die Nachrichten online.','der','statt · Zeitung','газета','Замість газети він читає новини в інтернеті.','gen'],
    ['Innerhalb ___ Geländes gilt eine Geschwindigkeitsbegrenzung.','des','innerhalb · Gelände','територія','На території діє обмеження швидкості.','gen'],
    ['Innerhalb ___ Woche muss die Antwort eintreffen.','der','innerhalb · Woche','тиждень','Відповідь має надійти протягом тижня.','gen'],
    ['Außerhalb ___ Öffnungszeiten bleibt das Tor geschlossen.','der','außerhalb · Öffnungszeiten','години роботи','Поза годинами роботи ворота залишаються зачиненими.','gen'],
    ['Außerhalb ___ Dorfes beginnt der Wald.','des','außerhalb · Dorf','село','За межами села починається ліс.','gen'],
    ['Anstelle ___ Direktors begrüßt die Stellvertreterin die Gäste.','des','anstelle · Direktor','директор','Замість директора гостей вітає заступниця.','gen'],
    ['Infolge ___ Stromausfalls funktionieren die Ampeln nicht.','des','infolge · Stromausfall','відключення електрики','Унаслідок відключення електрики світлофори не працюють.','gen'],
    ['Angesichts ___ Wetterlage verschieben wir den Ausflug.','der','angesichts · Wetterlage','погодні умови','З огляду на погодні умови ми переносимо екскурсію.','gen'],
    ['Mithilfe ___ Wörterbuchs übersetzt sie den Brief.','des','mithilfe · Wörterbuch','словник','За допомогою словника вона перекладає лист.','gen'],
    ['Unweit ___ Haltestelle steht ein Kiosk.','der','unweit · Haltestelle','зупинка','Неподалік зупинки стоїть кіоск.','gen']
  ];
  fixed.forEach(([sentence, answer, lemma, ua, translation, grammaticalCase]) => add(sentence,[answer],lemma,ua,translation,
    grammaticalCase === 'gen' ? 'B1' : 'A2', `${lemma.split(' · ')[0]} + ${grammaticalCase.toUpperCase()}.${grammaticalCase === 'gen' ? ' Тут тренується Genitiv нормативного письмового мовлення.' : ' Впиши лише означений артикль: прийменник уже є в реченні.'}`));
})();

(() => {
  const add = (sentence, answer, lemma, ua, translation, level, explanation) => {
    more_grammar.adjective_endings.push({sentence, answers:[answer], answer, infinitive:lemma, ua_infinitiv:ua, ua_sentence:translation, level, explanation});
  };
  // Both article classes are practised in two meaningful contexts for each noun.
  const counted = [
    ['m','pünktlich','пунктуальний','Zug','erreicht den Bahnhof um acht.','Wir nehmen','Пунктуальний потяг прибуває на вокзал о восьмій.','Ми сідаємо на пунктуальний потяг.'],
    ['m','bequem','зручний','Sessel','passt gut ins Wohnzimmer.','Sie kauft','Зручне крісло добре підходить для вітальні.','Вона купує зручне крісло.'],
    ['m','leistungsfähig','потужний','Rechner','verarbeitet die Daten schnell.','Das Büro bestellt','Потужний комп’ютер швидко обробляє дані.','Офіс замовляє потужний комп’ютер.'],
    ['m','wasserfest','водостійкий','Rucksack','schützt die Unterlagen.','Er trägt','Водостійкий рюкзак захищає документи.','Він носить водостійкий рюкзак.'],
    ['m','schmal','вузький','Weg','führt zum Aussichtspunkt.','Die Wandergruppe wählt','Вузька стежка веде до оглядового майданчика.','Туристична група обирає вузьку стежку.'],
    ['m','hilfsbereit','готовий допомогти','Mitarbeiter','erklärt das Verfahren.','Die Kundin lobt','Працівник, готовий допомогти, пояснює процедуру.','Клієнтка хвалить працівника, готового допомогти.'],
    ['m','erfahren','досвідчений','Arzt','nimmt sich viel Zeit.','Die Patientin sucht','Досвідчений лікар приділяє багато часу.','Пацієнтка шукає досвідченого лікаря.'],
    ['m','übersichtlich','зрозумілий','Stadtplan','zeigt alle Haltestellen.','Der Tourist braucht','Зрозумілий план міста показує всі зупинки.','Турист потребує зрозумілого плану міста.'],
    ['m','elektrisch','електричний','Roller','steht an der Ladestation.','Der Kurier mietet','Електричний скутер стоїть біля зарядної станції.','Кур’єр орендує електричний скутер.'],
    ['m','zuverlässig','надійний','Wecker','klingelt jeden Morgen.','Die Studentin benötigt','Надійний будильник дзвонить щоранку.','Студентці потрібен надійний будильник.'],
    ['f','ausführlich','докладний','Anleitung','beschreibt jeden Arbeitsschritt.','Der Techniker liest','Докладна інструкція описує кожен робочий крок.','Технік читає докладну інструкцію.'],
    ['f','geräumig','просторий','Wohnung','hat einen großen Balkon.','Die Familie besichtigt','Простора квартира має великий балкон.','Родина оглядає простору квартиру.'],
    ['f','regional','місцевий','Spezialität','schmeckt besonders gut.','Die Reisegruppe probiert','Місцева фірмова страва особливо смачна.','Туристична група куштує місцеву фірмову страву.'],
    ['f','beruflich','професійний','Weiterbildung','beginnt im November.','Die Mitarbeiterin plant','Професійне підвищення кваліфікації починається в листопаді.','Працівниця планує професійне підвищення кваліфікації.'],
    ['f','freundlich','привітний','Verkäuferin','kennt alle Produkte.','Der Stammkunde begrüßt','Привітна продавчиня знає всі товари.','Постійний клієнт вітає привітну продавчиню.'],
    ['f','schriftlich','письмовий','Einladung','enthält den genauen Termin.','Die Teilnehmerin erhält','Письмове запрошення містить точну дату.','Учасниця отримує письмове запрошення.'],
    ['f','dringend','терміновий','Nachricht','betrifft die ganze Abteilung.','Der Kollege übermittelt','Термінове повідомлення стосується всього відділу.','Колега передає термінове повідомлення.'],
    ['f','günstig','недорогий','Unterkunft','liegt direkt am Bahnhof.','Das Paar findet','Недороге помешкання розташоване просто біля вокзалу.','Пара знаходить недороге помешкання.'],
    ['f','öffentlich','громадський','Bibliothek','bietet auch Sprachkurse an.','Die Klasse besucht','Громадська бібліотека пропонує також мовні курси.','Клас відвідує громадську бібліотеку.'],
    ['f','frisch','свіжий','Zitrone','liegt auf dem Schneidebrett.','Die Köchin halbiert','Свіжий лимон лежить на дошці для нарізання.','Кухарка розрізає свіжий лимон навпіл.'],
    ['n','gemütlich','затишний','Café','serviert selbst gebackenen Kuchen.','Die Freunde entdecken','Затишне кафе подає власну випічку.','Друзі знаходять затишне кафе.'],
    ['n','modern','сучасний','Gerät','spart viel Energie.','Die Firma entwickelt','Сучасний прилад заощаджує багато енергії.','Фірма розробляє сучасний прилад.'],
    ['n','wichtig','важливий','Dokument','liegt im verschlossenen Schrank.','Die Anwältin prüft','Важливий документ лежить у замкненій шафі.','Адвокатка перевіряє важливий документ.'],
    ['n','flexibel','гнучкий','Ticket','erlaubt eine spätere Abfahrt.','Der Reisende bucht','Гнучкий квиток дозволяє пізніше відправлення.','Мандрівник бронює гнучкий квиток.'],
    ['n','ruhig','тихий','Zimmer','geht zum Innenhof.','Der Gast reserviert','Тиха кімната виходить у внутрішній двір.','Гість бронює тиху кімнату.'],
    ['n','barrierefrei','безбар’єрний','Gebäude','hat breite Türen.','Die Stadt errichtet','Безбар’єрна будівля має широкі двері.','Місто зводить безбар’єрну будівлю.'],
    ['n','praktisch','практичний','Werkzeug','liegt in der oberen Schublade.','Die Handwerkerin benutzt','Практичний інструмент лежить у верхній шухляді.','Майстриня користується практичним інструментом.'],
    ['n','nachhaltig','сталий, екологічний','Produkt','wird aus Recyclingmaterial hergestellt.','Das Geschäft verkauft','Екологічний товар виготовляється з переробленого матеріалу.','Крамниця продає екологічний товар.'],
    ['n','beschädigt','пошкоджений','Paket','liegt beim Empfang.','Der Kunde reklamiert','Пошкоджена посилка лежить на рецепції.','Клієнт подає скаргу щодо пошкодженої посилки.'],
    ['n','wasserdicht','водонепроникний','Zelt','hält auch starken Regen aus.','Die Wanderin kauft','Водонепроникний намет витримує навіть сильний дощ.','Туристка купує водонепроникний намет.']
  ];
  const art = {m:['Der','Ein','den','einen'],f:['Die','Eine','die','eine'],n:['Das','Ein','das','ein']};
  counted.forEach(([gender, lemma, ua, noun, tail, lead, nomTranslation, akkTranslation]) => {
    const [defNom, indefNom, defAkk, indefAkk] = art[gender];
    const stem = lemma === 'flexibel' ? 'flexibl' : lemma;
    add(`${defNom} ___ ${noun} ${tail}`,stem + 'e',lemma,ua,nomTranslation,'A2','Після означеного артикля у Nominativ однини прикметник має слабке закінчення -e.');
    add(`${indefNom} ___ ${noun} ${tail}`,stem + {m:'er',f:'e',n:'es'}[gender],lemma,ua,nomTranslation,'A2','Змішане відмінювання у Nominativ: ein + -er (чол.), eine + -e (жін.), ein + -es (сер.).');
    add(`${lead} ${defAkk} ___ ${noun}.`,stem + (gender === 'm' ? 'en' : 'e'),lemma,ua,akkTranslation,'A2','Akkusativ після означеного артикля: чоловічий рід -en, жіночий і середній рід -e.');
    add(`${lead} ${indefAkk} ___ ${noun}.`,stem + {m:'en',f:'e',n:'es'}[gender],lemma,ua,akkTranslation,'A2','Akkusativ зі змішаним відмінюванням: einen + -en, eine + -e, ein + -es.');
  });
  const other = [
    ['Bei ___ Wind schließen wir alle Fenster.','starkem','stark','сильний','За сильного вітру ми зачиняємо всі вікна.','Dativ, чоловічий рід без артикля: -em.'],
    ['Mit ___ Geduld erklärt er den Weg.','großer','groß','великий','Він із великим терпінням пояснює дорогу.','Dativ, жіночий рід без артикля: -er.'],
    ['Die Suppe wird mit ___ Gemüse gekocht.','frischem','frisch','свіжий','Суп готують зі свіжими овочами.','Dativ, середній рід без артикля: -em.'],
    ['Mit ___ Schuhen betreten wir das Haus nicht.','schmutzigen','schmutzig','брудний','Ми не входимо в будинок у брудному взутті.','Dativ множини без артикля: -en.'],
    ['___ Schnee bedeckt die Dächer.','Frischer','frisch','свіжий','Свіжий сніг вкриває дахи.','Nominativ, чоловічий рід без артикля: -er.'],
    ['___ Luft strömt durch das Fenster.','Kühle','kühl','прохолодний','Прохолодне повітря надходить через вікно.','Nominativ, жіночий рід без артикля: -e.'],
    ['___ Licht fällt auf den Tisch.','Helles','hell','яскравий','Яскраве світло падає на стіл.','Nominativ, середній рід без артикля: -es.'],
    ['___ Beschwerden sollten ernst genommen werden.','Wiederholte','wiederholt','повторний','До повторних скарг слід ставитися серйозно.','Nominativ множини без артикля: -e.'],
    ['Zum Frühstück trinken wir ___ Orangensaft.','frischen','frisch','свіжий','На сніданок ми п’ємо свіжий апельсиновий сік.','Akkusativ, чоловічий рід без артикля: -en.'],
    ['Sie braucht für den Teig ___ Sahne.','süße','süß','солодкий','Їй потрібні солодкі вершки для тіста.','Akkusativ, жіночий рід без артикля: -e.'],
    ['Die Kinder trinken ___ Mineralwasser.','stilles','still','негазований','Діти п’ють негазовану мінеральну воду.','Akkusativ, середній рід без артикля: -es.'],
    ['Wir sammeln ___ Erfahrungen im Ausland.','wertvolle','wertvoll','цінний','Ми набуваємо цінного досвіду за кордоном.','Akkusativ множини без артикля: -e.'],
    ['Der Tisch besteht aus ___ Holz.','massivem','massiv','масивний','Стіл зроблений із масивної деревини.','aus + Dativ, середній рід без артикля: -em.'],
    ['Die Flasche besteht aus ___ Glas.','dickem','dick','товстий','Пляшка зроблена з товстого скла.','Dativ, середній рід без артикля: -em.'],
    ['Sie kocht gern mit ___ Kräutern.','getrockneten','getrocknet','сушений','Вона любить готувати із сушеними травами.','Dativ множини без артикля: -en.'],
    ['Mit ___ Zustimmung beginnt die Sitzung.','allgemeiner','allgemein','загальний','Засідання починається за загальної згоди.','Dativ, жіночий рід без артикля: -er.'],
    ['Trotz ___ Regens findet das Fest statt.','anhaltenden','anhaltend','тривалий','Попри тривалий дощ свято відбувається.','Genitiv, чоловічий рід без артикля: прикметник має -en.'],
    ['Wegen ___ Verkehrs dauert die Fahrt länger.','dichten','dicht','щільний','Через щільний рух поїздка триває довше.','Genitiv, чоловічий рід без артикля: -en.'],
    ['Aufgrund ___ Nachfrage verlängern wir die Aktion.','großer','groß','великий','Через великий попит ми продовжуємо акцію.','Genitiv, жіночий рід без артикля: -er.'],
    ['Trotz ___ Wetters gehen die Kinder hinaus.','schlechten','schlecht','поганий','Попри погану погоду діти виходять надвір.','Genitiv, середній рід без артикля: -en.'],
    ['Wegen ___ Bauarbeiten bleibt der Zugang gesperrt.','umfangreicher','umfangreich','масштабний','Через масштабні будівельні роботи доступ залишається перекритим.','Genitiv множини без артикля: -er.'],
    ['___ Wissen allein reicht nicht aus.','Theoretisches','theoretisch','теоретичний','Самих теоретичних знань недостатньо.','Nominativ, середній рід без артикля: -es.'],
    ['Für die Bewerbung brauchen Sie ___ Deutschkenntnisse.','gute','gut','добрий','Для подання заяви Вам потрібні добрі знання німецької.','Akkusativ множини без артикля: -e.'],
    ['___ Kaffee steht auf dem Buffettisch.','Heißer','heiß','гарячий','Гаряча кава стоїть на фуршетному столі.','Nominativ, чоловічий рід без артикля: -er.'],
    ['Die Suppe schmeckt nach ___ Pfeffer.','schwarzem','schwarz','чорний','У супі відчувається смак чорного перцю.','nach + Dativ, чоловічий рід без артикля: -em.'],
    ['Bei ___ Sicht fahren wir langsamer.','schlechter','schlecht','поганий','За поганої видимості ми їдемо повільніше.','bei + Dativ, жіночий рід без артикля: -er.'],
    ['___ Fragen besprechen wir am Schluss.','Offene','offen','невирішений','Невирішені питання ми обговоримо наприкінці.','Akkusativ множини без артикля: -e; тут додаток стоїть на початку.'],
    ['Die Jacke schützt vor ___ Wind.','kaltem','kalt','холодний','Куртка захищає від холодного вітру.','vor + Dativ у виразі schützen vor: -em.'],
    ['Das Restaurant serviert ___ Fisch.','gegrillten','gegrillt','смажений на грилі','Ресторан подає рибу, смажену на грилі.','Akkusativ, чоловічий рід без артикля: -en.'],
    ['Mit ___ Mut beginnt sie ein neues Leben.','neuem','neu','новий','З новою відвагою вона починає нове життя.','Dativ, чоловічий рід без артикля: -em.'],
    ['Wir helfen dem ___ Besucher.','verirrten','verirrt','той, що заблукав','Ми допомагаємо відвідувачеві, який заблукав.','Dativ після означеного артикля: -en.'],
    ['Sie dankt einer ___ Kollegin.','aufmerksamen','aufmerksam','уважний','Вона дякує уважній колезі.','Dativ після einer: -en.'],
    ['Wir wohnen in einem ___ Dachgeschoss.','ausgebauten','ausgebaut','облаштований','Ми живемо в облаштованій мансарді.','Місце: Dativ після einem, -en.'],
    ['Er spricht mit den ___ Teilnehmern.','neuen','neu','новий','Він розмовляє з новими учасниками.','Dativ множини після den: -en.'],
    ['Die Tasche gehört der ___ Reisenden.','älteren','älter','старший','Сумка належить старшій мандрівниці.','Dativ після der: -en, основа порівняльного ступеня älter-.'],
    ['Sie arbeitet mit einem ___ Programm.','kostenlosen','kostenlos','безкоштовний','Вона працює з безкоштовною програмою.','Dativ після einem: -en.'],
    ['Der Bus hält vor der ___ Schule.','renovierten','renoviert','відремонтований','Автобус зупиняється перед відремонтованою школою.','Місце: Dativ після der, -en.'],
    ['Mit einem ___ Messer geht es leichter.','scharfen','scharf','гострий','Гострим ножем це робити легше.','Dativ після einem: -en.'],
    ['Wir treffen uns in einer ___ Seitenstraße.','ruhigen','ruhig','тихий','Ми зустрінемося на тихій бічній вулиці.','Dativ після einer: -en.'],
    ['Das Kind spielt mit seinem ___ Bruder.','jüngeren','jünger','молодший','Дитина грається зі своїм молодшим братом.','Dativ після seinem: -en; основа jünger-.'],
    ['Die Post liegt unter dem ___ Umschlag.','gelben','gelb','жовтий','Пошта лежить під жовтим конвертом.','Місце: Dativ після dem, -en.'],
    ['Er fährt mit seinen ___ Freunden zum See.','besten','best','найкращий','Він їде з найкращими друзями до озера.','Dativ множини після seinen: -en; основа best-.'],
    ['In unserem ___ Viertel gibt es viele Parks.','grünen','grün','зелений','У нашому зеленому районі багато парків.','Dativ після unserem: -en.'],
    ['Mit ihrer ___ Erfahrung findet sie schnell eine Lösung.','langjährigen','langjährig','багаторічний','Завдяки своєму багаторічному досвіду вона швидко знаходить рішення.','Dativ після ihrer: -en.'],
    ['Bei dem ___ Lärm kann niemand schlafen.','ständigen','ständig','постійний','За такого постійного шуму ніхто не може спати.','Dativ після dem: -en.'],
    ['Die Renovierung des ___ Bahnhofs beginnt bald.','alten','alt','старий','Ремонт старого вокзалу скоро почнеться.','Genitiv після des: -en.'],
    ['Die Leitung einer ___ Firma erfordert Erfahrung.','großen','groß','великий','Керівництво великою фірмою потребує досвіду.','Genitiv після einer: -en.'],
    ['Der Kauf eines ___ Fahrrads lohnt sich.','gebrauchten','gebraucht','уживаний','Купівля вживаного велосипеда виправдовує себе.','Genitiv після eines: -en.'],
    ['Die Meinung der ___ Bewohner wird berücksichtigt.','betroffenen','betroffen','той, кого це стосується','Думку мешканців, яких це стосується, враховують.','Genitiv множини після der: -en.'],
    ['Die Lösung des ___ Problems braucht Zeit.','technischen','technisch','технічний','Розв’язання технічної проблеми потребує часу.','Genitiv після des: -en.'],
    ['Der Beginn einer ___ Zusammenarbeit ist vielversprechend.','engen','eng','тісний','Початок тісної співпраці багатообіцяльний.','Genitiv після einer: -en.'],
    ['Die Vorteile des ___ Angebots sind offensichtlich.','neuen','neu','новий','Переваги нової пропозиції очевидні.','Genitiv після des: -en.'],
    ['Die Fenster des ___ Hauses werden ersetzt.','hohen','hoch','високий','Вікна високого будинку замінюють.','Genitiv після des: -en; hoch має основу hoh-.'],
    ['Die Wartung eines ___ Autos kostet viel.','teuren','teuer','дорогий','Обслуговування дорогого автомобіля коштує чимало.','Genitiv після eines: -en; teuer → teur-.'],
    ['Die Farbe der ___ Jacke verblasst langsam.','dunklen','dunkel','темний','Колір темної куртки повільно вицвітає.','Genitiv після der: -en; dunkel → dunkl-.'],
    ['Die Durchführung der ___ Maßnahmen dauert Monate.','geplanten','geplant','запланований','Реалізація запланованих заходів триває місяці.','Genitiv множини після der: -en.'],
    ['Der Inhalt eines ___ Vertrags muss klar sein.','schriftlichen','schriftlich','письмовий','Зміст письмового договору має бути зрозумілим.','Genitiv після eines: -en.'],
    ['Die Folgen der ___ Entscheidung werden diskutiert.','politischen','politisch','політичний','Наслідки політичного рішення обговорюють.','Genitiv після der: -en.'],
    ['Die Ergebnisse einer ___ Untersuchung liegen vor.','wissenschaftlichen','wissenschaftlich','науковий','Результати наукового дослідження вже наявні.','Genitiv після einer: -en.'],
    ['Die Qualität der ___ Lebensmittel wird regelmäßig geprüft.','regionalen','regional','місцевий','Якість місцевих харчових продуктів регулярно перевіряють.','Genitiv множини після der: -en.']
  ];
  other.forEach(([sentence, answer, lemma, ua, translation, explanation]) => add(sentence,answer,lemma,ua,translation,'B1',explanation));
})();

(() => {
  const add = (sentence, answer, noun, ua, translation, grammaticalCase, negative) => {
    more_grammar.indefinite_articles.push({sentence, answers:[answer], answer, infinitive:`${negative ? 'kein' : 'ein'} · ${noun}`, ua_infinitiv:`${ua}; ${negative ? 'заперечення: жоден / немає' : 'неозначений артикль: один / якийсь'}`, ua_sentence:translation, level:grammaticalCase === 'gen' ? 'B1' : 'A2', explanation:`${negative ? 'kein' : 'ein'} відмінюється за родом і числом іменника. Тут ${grammaticalCase.toUpperCase()}; у пропуск треба вписати лише артикль.`});
  };
  // Six exercises per topic: positive/negative Nominativ and Akkusativ,
  // plus an independent Dativ and Genitiv context. Translations are explicit.
  const rows = [
    ['m','Zahnarzt','стоматолог','___ Zahnarzt arbeitet heute hier.','Тут сьогодні працює стоматолог.','Тут сьогодні не працює жоден стоматолог.','Wir suchen ___ Zahnarzt.','Ми шукаємо стоматолога.','Ми не шукаємо стоматолога.','Sie spricht mit ___ Zahnarzt.','Вона розмовляє зі стоматологом.','Das ist die Praxis ___ Zahnarztes.','Це кабінет одного стоматолога.'],
    ['m','Fahrradhelm','велосипедний шолом','___ Fahrradhelm liegt im Flur.','У коридорі лежить велосипедний шолом.','У коридорі немає жодного велосипедного шолома.','Er kauft ___ Fahrradhelm.','Він купує велосипедний шолом.','Він не купує велосипедного шолома.','Sie fährt mit ___ Fahrradhelm.','Вона їде у велосипедному шоломі.','Das ist der Verschluss ___ Fahrradhelms.','Це застібка одного велосипедного шолома.'],
    ['m','Schlafsack','спальний мішок','___ Schlafsack liegt im Zelt.','У наметі лежить спальний мішок.','У наметі немає жодного спального мішка.','Die Wanderin braucht ___ Schlafsack.','Туристці потрібен спальний мішок.','Туристці не потрібен спальний мішок.','Das Kind liegt in ___ Schlafsack.','Дитина лежить у спальному мішку.','Der Reißverschluss ___ Schlafsacks ist kaputt.','Блискавка одного спального мішка зламана.'],
    ['m','Wasserkocher','електрочайник','___ Wasserkocher steht in der Küche.','На кухні стоїть електрочайник.','На кухні немає жодного електрочайника.','Die Familie bestellt ___ Wasserkocher.','Родина замовляє електрочайник.','Родина не замовляє електрочайника.','Mit ___ Wasserkocher geht es schneller.','З електрочайником це робиться швидше.','Der Deckel ___ Wasserkochers ist locker.','Кришка одного електрочайника хитається.'],
    ['m','Werkzeugkasten','ящик для інструментів','___ Werkzeugkasten steht im Keller.','У підвалі стоїть ящик для інструментів.','У підвалі немає жодного ящика для інструментів.','Wir transportieren ___ Werkzeugkasten.','Ми перевозимо ящик для інструментів.','Ми не перевозимо ящика для інструментів.','Der Hammer liegt in ___ Werkzeugkasten.','Молоток лежить у ящику для інструментів.','Der Griff ___ Werkzeugkastens ist stabil.','Ручка одного ящика для інструментів міцна.'],
    ['m','Reiseführer','путівник','___ Reiseführer liegt auf dem Tisch.','На столі лежить путівник.','На столі немає жодного путівника.','Die Touristin liest ___ Reiseführer.','Туристка читає путівник.','Туристка не читає путівника.','Die Adresse steht in ___ Reiseführer.','Адреса вказана в путівнику.','Das Titelbild ___ Reiseführers zeigt die Altstadt.','Обкладинка одного путівника зображує старе місто.'],
    ['m','Briefkasten','поштова скринька','___ Briefkasten hängt neben der Tür.','Біля дверей висить поштова скринька.','Біля дверей немає жодної поштової скриньки.','Der Hausmeister montiert ___ Briefkasten.','Завгосп монтує поштову скриньку.','Завгосп не монтує поштової скриньки.','Die Sendung liegt in ___ Briefkasten.','Відправлення лежить у поштовій скриньці.','Das Schloss ___ Briefkastens klemmt.','Замок однієї поштової скриньки заїдає.'],
    ['m','Drucker','принтер','___ Drucker steht im Arbeitszimmer.','У кабінеті стоїть принтер.','У кабінеті немає жодного принтера.','Die Firma mietet ___ Drucker.','Фірма орендує принтер.','Фірма не орендує принтера.','Wir arbeiten mit ___ Drucker.','Ми працюємо з принтером.','Das Display ___ Druckers blinkt.','Дисплей одного принтера блимає.'],
    ['m','Regenschirm','парасоля','___ Regenschirm liegt im Auto.','В автомобілі лежить парасоля.','В автомобілі немає жодної парасолі.','Sie nimmt ___ Regenschirm mit.','Вона бере із собою парасолю.','Вона не бере із собою парасолі.','Wir stehen unter ___ Regenschirm.','Ми стоїмо під парасолею.','Der Griff ___ Regenschirms ist aus Holz.','Ручка однієї парасолі зроблена з дерева.'],
    ['m','Kinderwagen','дитячий візок','___ Kinderwagen steht im Hausflur.','У під’їзді стоїть дитячий візок.','У під’їзді немає жодного дитячого візка.','Die Familie kauft ___ Kinderwagen.','Родина купує дитячий візок.','Родина не купує дитячого візка.','Das Baby schläft in ___ Kinderwagen.','Немовля спить у дитячому візку.','Die Räder ___ Kinderwagens werden gereinigt.','Колеса одного дитячого візка чистять.'],
    ['f','Apotheke','аптека','___ Apotheke öffnet am Sonntag.','У неділю відчиняється якась аптека.','У неділю не відчиняється жодна аптека.','Der Tourist sucht ___ Apotheke.','Турист шукає аптеку.','Турист не шукає аптеки.','Sie arbeitet in ___ Apotheke.','Вона працює в аптеці.','Die Adresse ___ Apotheke steht auf dem Zettel.','Адреса однієї аптеки записана на папірці.'],
    ['f','Steckdose','розетка','___ Steckdose ist noch frei.','Одна розетка ще вільна.','Жодна розетка вже не вільна.','Der Elektriker installiert ___ Steckdose.','Електрик встановлює розетку.','Електрик не встановлює розетки.','Das Kabel hängt aus ___ Steckdose.','Кабель звисає з розетки.','Die Abdeckung ___ Steckdose fehlt.','Немає кришки однієї розетки.'],
    ['f','Fahrkarte','квиток','___ Fahrkarte liegt im Portemonnaie.','У гаманці лежить квиток.','У гаманці немає жодного квитка.','Die Reisende kauft ___ Fahrkarte.','Мандрівниця купує квиток.','Мандрівниця не купує квитка.','Die Uhrzeit steht auf ___ Fahrkarte.','Час вказаний на квитку.','Der Preis ___ Fahrkarte hängt von der Strecke ab.','Ціна одного квитка залежить від маршруту.'],
    ['f','Gießkanne','лійка','___ Gießkanne steht auf dem Balkon.','На балконі стоїть лійка.','На балконі немає жодної лійки.','Der Gärtner füllt ___ Gießkanne.','Садівник наповнює лійку.','Садівник не наповнює жодної лійки.','Sie gießt die Blumen mit ___ Gießkanne.','Вона поливає квіти лійкою.','Der Henkel ___ Gießkanne ist abgebrochen.','Ручка однієї лійки відламалася.'],
    ['f','Taschenlampe','ліхтарик','___ Taschenlampe liegt im Schrank.','У шафі лежить ліхтарик.','У шафі немає жодного ліхтарика.','Der Wanderer braucht ___ Taschenlampe.','Туристу потрібен ліхтарик.','Туристу не потрібен ліхтарик.','Wir leuchten mit ___ Taschenlampe.','Ми світимо ліхтариком.','Die Batterie ___ Taschenlampe ist leer.','Батарейка одного ліхтарика розряджена.'],
    ['f','Haltestelle','зупинка','___ Haltestelle liegt in der Nähe.','Поблизу є зупинка.','Поблизу немає жодної зупинки.','Die Stadt plant ___ Haltestelle.','Місто планує зупинку.','Місто не планує жодної зупинки.','Wir warten an ___ Haltestelle.','Ми чекаємо на зупинці.','Die Verlegung ___ Haltestelle wird diskutiert.','Перенесення однієї зупинки обговорюють.'],
    ['f','Werkstatt','майстерня','___ Werkstatt hat heute geöffnet.','Сьогодні відчинена якась майстерня.','Сьогодні не відчинена жодна майстерня.','Der Fahrer sucht ___ Werkstatt.','Водій шукає майстерню.','Водій не шукає майстерні.','Das Auto steht in ___ Werkstatt.','Автомобіль стоїть у майстерні.','Der Inhaber ___ Werkstatt ruft zurück.','Власник однієї майстерні передзвонює.'],
    ['f','Bescheinigung','довідка','___ Bescheinigung liegt den Unterlagen bei.','До документів додано довідку.','До документів не додано жодної довідки.','Die Behörde verlangt ___ Bescheinigung.','Установа вимагає довідку.','Установа не вимагає жодної довідки.','Die Bestätigung steht auf ___ Bescheinigung.','Підтвердження міститься в довідці.','Die Ausstellung ___ Bescheinigung dauert einen Tag.','Оформлення однієї довідки триває день.'],
    ['f','Thermoskanne','термос','___ Thermoskanne steht im Rucksack.','У рюкзаку стоїть термос.','У рюкзаку немає жодного термоса.','Die Wanderin füllt ___ Thermoskanne.','Туристка наповнює термос.','Туристка не наповнює жодного термоса.','Der Tee bleibt in ___ Thermoskanne heiß.','Чай залишається гарячим у термосі.','Der Deckel ___ Thermoskanne ist undicht.','Кришка одного термоса негерметична.'],
    ['f','Bäckerei','пекарня','___ Bäckerei liefert die Brötchen.','Булочки доставляє якась пекарня.','Жодна пекарня не доставляє булочок.','Die Familie eröffnet ___ Bäckerei.','Родина відкриває пекарню.','Родина не відкриває пекарні.','Sie macht eine Ausbildung in ___ Bäckerei.','Вона здобуває професійну освіту в пекарні.','Das Schaufenster ___ Bäckerei ist beleuchtet.','Вітрина однієї пекарні освітлена.'],
    ['n','Ladegerät','зарядний пристрій','___ Ladegerät liegt auf dem Nachttisch.','На приліжковому столику лежить зарядний пристрій.','На приліжковому столику немає жодного зарядного пристрою.','Er bestellt ___ Ladegerät.','Він замовляє зарядний пристрій.','Він не замовляє зарядного пристрою.','Das Kabel gehört zu ___ Ladegerät.','Кабель належить до зарядного пристрою.','Die Leistung ___ Ladegeräts steht auf der Verpackung.','Потужність одного зарядного пристрою вказана на упаковці.'],
    ['n','Ferienhaus','будиночок для відпочинку','___ Ferienhaus steht am See.','Біля озера стоїть будиночок для відпочинку.','Біля озера немає жодного будиночка для відпочинку.','Die Familie mietet ___ Ferienhaus.','Родина орендує будиночок для відпочинку.','Родина не орендує будиночка для відпочинку.','Wir übernachten in ___ Ferienhaus.','Ми ночуємо в будиночку для відпочинку.','Das Dach ___ Ferienhauses wird repariert.','Дах одного будиночка для відпочинку ремонтують.'],
    ['n','Wörterbuch','словник','___ Wörterbuch liegt auf dem Pult.','На кафедрі лежить словник.','На кафедрі немає жодного словника.','Die Schülerin benutzt ___ Wörterbuch.','Учениця користується словником.','Учениця не користується жодним словником.','Sie sucht das Wort in ___ Wörterbuch.','Вона шукає слово у словнику.','Die Neuauflage ___ Wörterbuchs erscheint bald.','Нове видання одного словника скоро вийде.'],
    ['n','Notizbuch','нотатник','___ Notizbuch liegt im Rucksack.','У рюкзаку лежить нотатник.','У рюкзаку немає жодного нотатника.','Die Journalistin kauft ___ Notizbuch.','Журналістка купує нотатник.','Журналістка не купує нотатника.','Er schreibt in ___ Notizbuch.','Він пише в нотатнику.','Die Seiten ___ Notizbuchs sind nummeriert.','Сторінки одного нотатника пронумеровані.'],
    ['n','Bügeleisen','праска','___ Bügeleisen steht auf dem Brett.','На дошці стоїть праска.','На дошці немає жодної праски.','Der Kunde reklamiert ___ Bügeleisen.','Клієнт подає скаргу щодо праски.','Клієнт не подає скарги щодо жодної праски.','Sie glättet das Hemd mit ___ Bügeleisen.','Вона розпрасовує сорочку праскою.','Das Kabel ___ Bügeleisens ist beschädigt.','Кабель однієї праски пошкоджений.'],
    ['n','Bewerbungsfoto','фото для резюме','___ Bewerbungsfoto liegt im Umschlag.','У конверті лежить фото для резюме.','У конверті немає жодного фото для резюме.','Der Fotograf macht ___ Bewerbungsfoto.','Фотограф робить фото для резюме.','Фотограф не робить фото для резюме.','Auf ___ Bewerbungsfoto sollte das Gesicht gut erkennbar sein.','На фото для резюме обличчя має бути добре впізнаваним.','Die Qualität ___ Bewerbungsfotos ist wichtig.','Якість фото для резюме важлива.'],
    ['n','Vogelhaus','шпаківня','___ Vogelhaus hängt am Baum.','На дереві висить шпаківня.','На дереві немає жодної шпаківні.','Die Kinder bauen ___ Vogelhaus.','Діти будують шпаківню.','Діти не будують жодної шпаківні.','Der Vogel sitzt in ___ Vogelhaus.','Птах сидить у шпаківні.','Das Dach ___ Vogelhauses schützt vor Regen.','Дах шпаківні захищає від дощу.'],
    ['n','Krankenhaus','лікарня','___ Krankenhaus liegt am Stadtrand.','На околиці розташована лікарня.','На околиці немає жодної лікарні.','Die Stadt baut ___ Krankenhaus.','Місто будує лікарню.','Місто не будує жодної лікарні.','Er arbeitet in ___ Krankenhaus.','Він працює в лікарні.','Die Erweiterung ___ Krankenhauses kostet viel.','Розширення однієї лікарні коштує багато.'],
    ['n','Musikinstrument','музичний інструмент','___ Musikinstrument liegt im Koffer.','У футлярі лежить музичний інструмент.','У футлярі немає жодного музичного інструмента.','Die Schülerin lernt ___ Musikinstrument.','Учениця вчиться грати на музичному інструменті.','Учениця не вчиться грати на жодному музичному інструменті.','Mit ___ Musikinstrument begleitet er den Chor.','Він супроводжує хор грою на музичному інструменті.','Die Stimmung ___ Musikinstruments braucht Übung.','Настроювання музичного інструмента потребує практики.'],
    ['n','Abonnement','абонемент','___ Abonnement läuft noch bis Dezember.','Один абонемент ще діє до грудня.','Жоден абонемент уже не діє до грудня.','Die Kundin verlängert ___ Abonnement.','Клієнтка подовжує абонемент.','Клієнтка не подовжує жодного абонемента.','Mit ___ Abonnement ist der Eintritt günstiger.','З абонементом вхід дешевший.','Die Kündigung ___ Abonnements erfolgt schriftlich.','Скасування абонемента здійснюється письмово.']
  ];
  const forms = {m:['Ein','Kein','einen','keinen','einem','eines'],f:['Eine','Keine','eine','keine','einer','einer'],n:['Ein','Kein','ein','kein','einem','eines']};
  rows.forEach(([gender,noun,ua,nom,uaNom,uaNoNom,akk,uaAkk,uaNoAkk,dat,uaDat,gen,uaGen]) => {
    const f = forms[gender];
    add(nom,f[0],noun,ua,uaNom,'nom',false); add(nom,f[1],noun,ua,uaNoNom,'nom',true);
    add(akk,f[2],noun,ua,uaAkk,'akk',false); add(akk,f[3],noun,ua,uaNoAkk,'akk',true);
    add(dat,f[4],noun,ua,uaDat,'dat',false); add(gen,f[5],noun,ua,uaGen,'gen',false);
  });
})();
