/* Самостійні тренування граматики для підготовки B2; не офіційні екзаменаційні завдання. */
const b2_grammar_tests = [];

(() => {
  const test = {id:'b2_unreal_past',name:'B2 · Нереальні умови в минулому',group:'Goethe B2 · Підготовка',desc:'Konjunktiv II Vergangenheit: заповни допоміжні дієслова та Partizip II результату. Український переклад описує ситуацію, яка вже не здійснилася.',data:[]};
  b2_grammar_tests.push(test);
  // Four explicit persons. Ukrainian singular translations use a male narrator.
  const people = [
    ['ich','я (чоловік)','hätte','wäre',0,'mich'],['du','ти (чоловік)','hättest','wärst',0,'dich'],
    ['wir','ми','hätten','wären',1,'uns'],['Sie','Ви (ввічливо)','hätten','wären',1,'sich']
  ];
  // condition before auxiliary | auxiliary | result complement | result participle |
  // result auxiliary | result infinitive | Ukrainian condition singular/plural |
  // Ukrainian result singular/plural
  const rows = [
    ['die Bewerbungsunterlagen früher eingereicht','haben','eine rechtzeitige Rückmeldung','erhalten','haben','erhalten','подав документи на роботу раніше|подали документи на роботу раніше','отримав своєчасну відповідь|отримали своєчасну відповідь'],
    ['§ rechtzeitig für die Fortbildung angemeldet','haben','an dem geförderten Seminar','teilgenommen','haben','teilnehmen','вчасно записався на підвищення кваліфікації|вчасно записалися на підвищення кваліфікації','взяв участь у семінарі з фінансовою підтримкою|взяли участь у семінарі з фінансовою підтримкою'],
    ['die Vertragsbedingungen sorgfältiger gelesen','haben','die zusätzliche Gebühr','vermieden','haben','vermeiden','уважніше прочитав умови договору|уважніше прочитали умови договору','уникнув додаткового збору|уникнули додаткового збору'],
    ['die Kündigungsfrist nicht verpasst','haben','den Vertrag rechtzeitig','beendet','haben','beenden','не пропустив терміну розірвання|не пропустили терміну розірвання','вчасно розірвав договір|вчасно розірвали договір'],
    ['früher zum Vorstellungsgespräch aufgebrochen','sein','das Unternehmen pünktlich','erreicht','haben','erreichen','раніше вирушив на співбесіду|раніше вирушили на співбесіду','вчасно дістався компанії|вчасно дісталися компанії'],
    ['die Nachricht der Personalabteilung bemerkt','haben','den Termin','bestätigt','haben','bestätigen','помітив повідомлення відділу кадрів|помітили повідомлення відділу кадрів','підтвердив дату зустрічі|підтвердили дату зустрічі'],
    ['die Finanzierung vorher gesichert','haben','das Projekt planmäßig','umgesetzt','haben','umsetzen','заздалегідь забезпечив фінансування|заздалегідь забезпечили фінансування','реалізував проєкт за планом|реалізували проєкт за планом'],
    ['die Risiken realistischer eingeschätzt','haben','vorsichtiger','gehandelt','haben','handeln','реалістичніше оцінив ризики|реалістичніше оцінили ризики','діяв обережніше|діяли обережніше'],
    ['regelmäßig an den Besprechungen teilgenommen','haben','die Änderungen früher','verstanden','haben','verstehen','регулярно брав участь у нарадах|регулярно брали участь у нарадах','раніше зрозумів зміни|раніше зрозуміли зміни'],
    ['die Ergebnisse rechtzeitig dokumentiert','haben','einen aussagekräftigen Bericht','verfasst','haben','verfassen','вчасно задокументував результати|вчасно задокументували результати','склав змістовний звіт|склали змістовний звіт'],
    ['den Fehler sofort gemeldet','haben','größeren Schaden','verhindert','haben','verhindern','відразу повідомив про помилку|відразу повідомили про помилку','запобіг більшим збиткам|запобігли більшим збиткам'],
    ['früher professionellen Rat eingeholt','haben','eine fundiertere Entscheidung','getroffen','haben','treffen','раніше отримав професійну пораду|раніше отримали професійну пораду','ухвалив більш обґрунтоване рішення|ухвалили більш обґрунтоване рішення'],
    ['die Daten regelmäßig gesichert','haben','keine wichtigen Unterlagen','verloren','haben','verlieren','регулярно зберігав резервні копії даних|регулярно зберігали резервні копії даних','не втратив важливих документів|не втратили важливих документів'],
    ['die Software rechtzeitig aktualisiert','haben','die Sicherheitslücke','geschlossen','haben','schließen','вчасно оновив програму|вчасно оновили програму','усунув вразливість безпеки|усунули вразливість безпеки'],
    ['den Stromverbrauch genauer beobachtet','haben','die defekte Kühlanlage','entdeckt','haben','entdecken','уважніше стежив за споживанням електрики|уважніше стежили за споживанням електрики','виявив несправну холодильну установку|виявили несправну холодильну установку'],
    ['öffentliche Verkehrsmittel benutzt','haben','weniger Abgase','verursacht','haben','verursachen','користувався громадським транспортом|користувалися громадським транспортом','спричинив менше вихлопів|спричинили менше вихлопів'],
    ['die Wohnung besser gedämmt','haben','erheblich Heizkosten','gespart','haben','sparen','краще утеплив квартиру|краще утеплили квартиру','істотно заощадив на опаленні|істотно заощадили на опаленні'],
    ['die Angebote verschiedener Anbieter verglichen','haben','einen günstigeren Tarif','gewählt','haben','wählen','порівняв пропозиції різних постачальників|порівняли пропозиції різних постачальників','обрав дешевший тариф|обрали дешевший тариф'],
    ['die Maschine regelmäßig gewartet','haben','den Produktionsausfall','vermieden','haben','vermeiden','регулярно обслуговував машину|регулярно обслуговували машину','уникнув зупинки виробництва|уникнули зупинки виробництва'],
    ['die Wasserleitung rechtzeitig repariert','haben','einen erheblichen Wasserschaden','verhindert','haben','verhindern','вчасно відремонтував водопровід|вчасно відремонтували водопровід','запобіг значній шкоді від води|запобігли значній шкоді від води'],
    ['früher am Flughafen angekommen','sein','das Flugzeug noch','erreicht','haben','erreichen','раніше прибув до аеропорту|раніше прибули до аеропорту','ще встиг на літак|ще встигли на літак'],
    ['§ vor der Reise über die Einreisebedingungen informiert','haben','alle erforderlichen Dokumente','mitgebracht','haben','mitbringen','дізнався перед подорожжю про умови в’їзду|дізналися перед подорожжю про умови в’їзду','привіз усі необхідні документи|привезли всі необхідні документи'],
    ['am richtigen Bahnhof ausgestiegen','sein','rechtzeitig im Hotel','angekommen','sein','ankommen','вийшов на правильному вокзалі|вийшли на правильному вокзалі','вчасно прибув до готелю|вчасно прибули до готелю'],
    ['die Unterkunft früher gebucht','haben','weniger für die Übernachtung','bezahlt','haben','bezahlen','раніше забронював помешкання|раніше забронювали помешкання','заплатив менше за ночівлю|заплатили менше за ночівлю'],
    ['die Wetterwarnung ernst genommen','haben','auf die Bergtour','verzichtet','haben','verzichten','поставився серйозно до погодного попередження|поставилися серйозно до погодного попередження','відмовився від гірського походу|відмовилися від гірського походу'],
    ['auf dem markierten Weg geblieben','sein','nicht in die gefährliche Schlucht','geraten','sein','geraten','залишився на позначеній стежці|залишилися на позначеній стежці','не потрапив у небезпечну ущелину|не потрапили в небезпечну ущелину'],
    ['die Umleitung rechtzeitig bemerkt','haben','ohne Verspätung','weitergefahren','sein','weiterfahren','вчасно помітив об’їзд|вчасно помітили об’їзд','продовжив поїздку без запізнення|продовжили поїздку без запізнення'],
    ['schneller auf die Wohnungsanzeige reagiert','haben','einen Besichtigungstermin','bekommen','haben','bekommen','швидше відреагував на оголошення про житло|швидше відреагували на оголошення про житло','отримав час для огляду|отримали час для огляду'],
    ['die Mängel bei der Übergabe festgehalten','haben','die spätere Auseinandersetzung','vermieden','haben','vermeiden','зафіксував недоліки під час передачі|зафіксували недоліки під час передачі','уникнув подальшої суперечки|уникнули подальшої суперечки'],
    ['die Nachbarn vorher über die Feier informiert','haben','mehr Verständnis','erhalten','haben','erhalten','заздалегідь повідомив сусідів про свято|заздалегідь повідомили сусідів про свято','отримав більше розуміння|отримали більше розуміння'],
    ['konsequenter für die Prüfung gelernt','haben','die mündliche Prüfung','bestanden','haben','bestehen','послідовніше готувався до іспиту|послідовніше готувалися до іспиту','склав усний іспит|склали усний іспит'],
    ['die Aufgabenstellung genauer gelesen','haben','keine wesentlichen Punkte','übersehen','haben','übersehen','уважніше прочитав умову завдання|уважніше прочитали умову завдання','не пропустив суттєвих пунктів|не пропустили суттєвих пунктів'],
    ['die Argumente übersichtlicher geordnet','haben','die Zuhörer stärker','überzeugt','haben','überzeugen','чіткіше впорядкував аргументи|чіткіше впорядкували аргументи','сильніше переконав слухачів|сильніше переконали слухачів'],
    ['an dem Austauschprogramm teilgenommen','haben','interkulturelle Erfahrungen','gesammelt','haben','sammeln','взяв участь у програмі обміну|взяли участь у програмі обміну','набув міжкультурного досвіду|набули міжкультурного досвіду'],
    ['§ rechtzeitig um ein Stipendium beworben','haben','das Auslandssemester','finanziert','haben','finanzieren','вчасно подав заяву на стипендію|вчасно подали заяву на стипендію','профінансував семестр за кордоном|профінансували семестр за кордоном']
  ];
  rows.forEach(([condition, conditionAux, result, participle, resultAux, lemma, uaCondition, uaResult]) => {
    people.forEach(([person,uaPerson,haben,sein,plural,reflexive]) => {
      const conditionForm = conditionAux === 'haben' ? haben : sein;
      const resultForm = resultAux === 'haben' ? haben : sein;
      const sentence = `Wenn ${person} ${condition.replace('§',reflexive)} ___, ___ ${person} ${result} ___.`;
      const uaSubject = uaPerson.replace(/ \(.+\)/u,'');
      const answers = [conditionForm,resultForm,participle];
      test.data.push({sentence,answers,answer:answers.join(' '),infinitive:`Konjunktiv II Vergangenheit · ${lemma}`,ua_infinitiv:`${uaPerson}; нереальна умова в минулому`,ua_sentence:`Якби ${uaSubject} ${uaCondition.split('|')[plural]}, ${uaSubject} би ${uaResult.split('|')[plural]}.`,level:'B2',explanation:`Нереальне минуле: Partizip II + hätte/wäre у wenn-реченні; у головному реченні hätte/wäre стоїть перед підметом. ${lemma} утворює Perfekt із ${resultAux}: ${participle}.`});
    });
  });
})();

(() => {
  const test = {id:'b2_nominalisation',name:'B2 · Номіналізація та причини',group:'Goethe B2 · Підготовка',desc:'Перетвори підрядне речення з weil на конструкцію з wegen + Genitiv або навпаки. У дієслівному варіанті вписуй усю форму, якщо вона складається з кількох слів.',data:[]};
  b2_grammar_tests.push(test);
  // Infinitive | verbal clause with one gap | finite form | nominal Genitiv phrase with one gap | noun form | main clause | translation
  const rows = [
    ['steigen','die Nachfrage ___','steigt','des ___ der Nachfrage','Anstiegs','erweitert das Unternehmen die Produktion','Через зростання попиту підприємство розширює виробництво.'],
    ['sinken','die Geburtenrate ___','sinkt','des ___ der Geburtenrate','Rückgangs','werden weniger Schulplätze benötigt','Через зниження народжуваності потрібно менше шкільних місць.'],
    ['zunehmen','der Verkehr ___','zunimmt','der ___ des Verkehrs','Zunahme','prüft die Stadt neue Mobilitätskonzepte','Через збільшення руху місто розглядає нові транспортні концепції.'],
    ['abnehmen','die Kaufkraft ___','abnimmt','der ___ der Kaufkraft','Abnahme','verschieben viele Haushalte größere Anschaffungen','Через зменшення купівельної спроможності багато домогосподарств відкладають великі покупки.'],
    ['sich verbessern','sich die Qualität ___','verbessert','der ___ der Qualität','Verbesserung','wächst das Vertrauen der Kundschaft','Через поліпшення якості зростає довіра клієнтів.'],
    ['sich verschlechtern','sich die Luftqualität ___','verschlechtert','der ___ der Luftqualität','Verschlechterung','fordert die Initiative strengere Grenzwerte','Через погіршення якості повітря ініціативна група вимагає суворіших граничних норм.'],
    ['sich verzögern','sich die Lieferung ___','verzögert','der ___ der Lieferung','Verzögerung','muss die Montage verschoben werden','Через затримку постачання монтаж доводиться перенести.'],
    ['sich ändern','sich die Zuständigkeit ___','ändert','der ___ der Zuständigkeit','Änderung','werden die Anträge an eine andere Abteilung weitergeleitet','Через зміну відповідального органу заяви пересилають до іншого відділу.'],
    ['ausfallen','der Strom ___','ausfällt','des ___ des Stroms','Ausfalls','bleibt die Produktion vorübergehend stehen','Через відключення електрики виробництво тимчасово зупиняється.'],
    ['fehlen','geeignetes Personal ___','fehlt','des ___ geeigneten Personals','Fehlens','kann die zusätzliche Schicht nicht angeboten werden','Через відсутність відповідного персоналу додаткову зміну не можуть запропонувати.'],
    ['wachsen','die Bevölkerung ___','wächst','des ___ der Bevölkerung','Wachstums','braucht die Gemeinde mehr Wohnraum','Через зростання населення громаді потрібно більше житла.'],
    ['versagen','die Technik ___','versagt','des ___ der Technik','Versagens','wird die Veranstaltung unterbrochen','Через відмову техніки захід переривають.'],
    ['sich verspäten','sich die Delegation ___','verspätet','der ___ der Delegation','Verspätung','beginnt die Sitzung später','Через запізнення делегації засідання починається пізніше.'],
    ['erkranken','mehrere Beschäftigte ___','erkranken','der ___ mehrerer Beschäftigter','Erkrankung','müssen Aufgaben neu verteilt werden','Через хворобу кількох працівників завдання доводиться перерозподілити.'],
    ['streiken','die Fahrer ___','streiken','des ___ der Fahrer','Streiks','fahren heute weniger Busse','Через страйк водіїв сьогодні їздить менше автобусів.'],
    ['protestieren','die Anwohner ___','protestieren','der ___ der Anwohner','Proteste','überarbeitet die Stadt den Bauplan','Через протести мешканців місто переглядає план будівництва.'],
    ['sich beschweren','sich viele Kunden ___','beschweren','der ___ vieler Kunden','Beschwerden','verbessert der Anbieter seinen Service','Через скарги багатьох клієнтів постачальник поліпшує обслуговування.'],
    ['zustimmen','die Mehrheit ___','zustimmt','der ___ der Mehrheit','Zustimmung','kann der Vorschlag umgesetzt werden','Завдяки згоді більшості пропозицію можна реалізувати.'],
    ['ablehnen (Passiv, Präsens)','der Antrag ___','abgelehnt wird','der ___ des Antrags','Ablehnung','muss die Finanzierung neu geplant werden','Через відхилення заяви фінансування доводиться планувати заново.'],
    ['genehmigen (Passiv, Präsens)','das Vorhaben ___','genehmigt wird','der ___ des Vorhabens','Genehmigung','können die Bauarbeiten beginnen','Завдяки схваленню проєкту будівельні роботи можуть початися.'],
    ['erhöhen (Passiv, Präsens)','die Beiträge ___','erhöht werden','der ___ der Beiträge','Erhöhung','kündigen einige Mitglieder ihre Mitgliedschaft','Через підвищення внесків деякі члени припиняють членство.'],
    ['senken (Passiv, Präsens)','die Preise ___','gesenkt werden','der ___ der Preise','Senkung','nimmt die Zahl der Bestellungen zu','Через зниження цін кількість замовлень збільшується.'],
    ['kürzen (Passiv, Präsens)','das Budget ___','gekürzt wird','der ___ des Budgets','Kürzung','muss die Einrichtung Angebote streichen','Через скорочення бюджету заклад мусить скасувати частину послуг.'],
    ['verlängern (Passiv, Präsens)','die Frist ___','verlängert wird','der ___ der Frist','Verlängerung','bleibt mehr Zeit für die Vorbereitung','Завдяки продовженню терміну залишається більше часу на підготовку.'],
    ['verkürzen (Passiv, Präsens)','die Öffnungszeiten ___','verkürzt werden','der ___ der Öffnungszeiten','Verkürzung','müssen sich die Besucher früher anmelden','Через скорочення годин роботи відвідувачі мусять записуватися раніше.'],
    ['modernisieren (Passiv, Präsens)','die Anlage ___','modernisiert wird','der ___ der Anlage','Modernisierung','kann der Energieverbrauch gesenkt werden','Завдяки модернізації установки споживання енергії можна знизити.'],
    ['erneuern (Passiv, Präsens)','die Brücke ___','erneuert wird','der ___ der Brücke','Erneuerung','wird der Verkehr umgeleitet','Через оновлення мосту рух спрямовують в об’їзд.'],
    ['sanieren (Passiv, Präsens)','das Schulgebäude ___','saniert wird','der ___ des Schulgebäudes','Sanierung','findet der Unterricht vorübergehend woanders statt','Через капітальний ремонт шкільної будівлі заняття тимчасово проводять в іншому місці.'],
    ['schließen (Passiv, Präsens)','die Filiale ___','geschlossen wird','der ___ der Filiale','Schließung','müssen die Kunden längere Wege zurücklegen','Через закриття філії клієнти мусять долати довші відстані.'],
    ['eröffnen (Passiv, Präsens)','das Beratungszentrum ___','eröffnet wird','der ___ des Beratungszentrums','Eröffnung','erhalten mehr Menschen Unterstützung','Завдяки відкриттю консультаційного центру більше людей отримують підтримку.'],
    ['einführen (Passiv, Präsens)','ein digitales Verfahren ___','eingeführt wird','der ___ eines digitalen Verfahrens','Einführung','sinkt der Verwaltungsaufwand','Завдяки запровадженню цифрової процедури адміністративне навантаження зменшується.'],
    ['abschaffen (Passiv, Präsens)','die Gebühr ___','abgeschafft wird','der ___ der Gebühr','Abschaffung','wird das Angebot stärker genutzt','Завдяки скасуванню збору послугою користуються частіше.'],
    ['verlegen (Passiv, Präsens)','die Haltestelle ___','verlegt wird','der ___ der Haltestelle','Verlegung','ändert sich der Schulweg','Через перенесення зупинки змінюється дорога до школи.'],
    ['absagen (Passiv, Präsens)','das Konzert ___','abgesagt wird','der ___ des Konzerts','Absage','werden die Eintrittsgelder zurückerstattet','Через скасування концерту гроші за квитки повертають.'],
    ['unterbrechen (Passiv, Präsens)','die Verbindung ___','unterbrochen wird','der ___ der Verbindung','Unterbrechung','kann die Videokonferenz nicht fortgesetzt werden','Через розрив з’єднання відеоконференцію не можна продовжити.'],
    ['beschränken (Passiv, Präsens)','die Teilnehmerzahl ___','beschränkt wird','der ___ der Teilnehmerzahl','Beschränkung','ist eine frühzeitige Anmeldung erforderlich','Через обмеження кількості учасників потрібна завчасна реєстрація.'],
    ['einschränken (Passiv, Präsens)','der Zugang ___','eingeschränkt wird','der ___ des Zugangs','Einschränkung','brauchen Besucher eine besondere Genehmigung','Через обмеження доступу відвідувачам потрібен спеціальний дозвіл.'],
    ['überlasten (Passiv, Präsens)','das Netz ___','überlastet wird','der ___ des Netzes','Überlastung','werden Daten langsamer übertragen','Через перевантаження мережі дані передаються повільніше.'],
    ['verunreinigen (Passiv, Präsens)','das Trinkwasser ___','verunreinigt wird','der ___ des Trinkwassers','Verunreinigung','darf es vorübergehend nicht getrunken werden','Через забруднення питної води її тимчасово не можна пити.'],
    ['anerkennen (Passiv, Präsens)','der Abschluss ___','anerkannt wird','der ___ des Abschlusses','Anerkennung','kann die Bewerberin in ihrem Beruf arbeiten','Завдяки визнанню диплома кандидатка може працювати за фахом.']
  ];
  rows.forEach(([lemma,verbal,finite,nominal,noun,main,translation]) => {
    const source = `Weil ${verbal.replace('___',finite)}, ${main}.`;
    const converted = `Wegen ${nominal.replace('___',noun)} ${main}.`;
    const variants = [
      [`${source} → Wegen ${nominal} ${main}.`,noun,`Nominalisierung · ${lemma}`,'Утвори іменник у потрібній формі Genitiv.'],
      [`${converted} → Weil ${verbal}, ${main}.`,finite,lemma,'Віднови дієслівне підрядне речення у Präsens.']
    ];
    variants.forEach(([sentence,answer,infinitive,hint]) => {
      const item = {sentence,answers:[answer],answer,infinitive,ua_infinitiv:hint,ua_sentence:translation,level:'B2',explanation:'Після weil відмінюване дієслово стоїть наприкінці підрядного речення. Wegen замінює підрядне речення іменниковою конструкцією в Genitiv. Головне речення зберігає інверсію.'};
      const genitiveAlternatives = {Anstiegs:['Anstieges','Ansteigens'],Rückgangs:['Rückganges','Sinkens','Absinkens'],Ausfalls:['Ausfalles'],Streiks:['Streikes']};
      if (genitiveAlternatives[answer]) item.alternatives = genitiveAlternatives[answer].map(form=>[form]);
      test.data.push(item);
    });
  });
})();

(() => {
  const test = {id:'b2_sentence_connections',name:'B2 · Логічні зв’язки речень',group:'Goethe B2 · Підготовка',desc:'Обери сполучник або прислівниковий зв’язок за українською підказкою. Тренуємо причину, поступку, умову, час, мету та спосіб. Поширені рівнозначні варіанти також приймаються.',data:[]};
  b2_grammar_tests.push(test);
  // Paired versions demonstrate subordinate-clause order and main-clause inversion.
  const pairs = [
    ['|Weil| die Rohstoffpreise gestiegen sind, muss das Unternehmen seine Kalkulation überarbeiten.','Die Rohstoffpreise sind gestiegen. |Deshalb| muss das Unternehmen seine Kalkulation überarbeiten.','оскільки','тому','Ціни на сировину зросли, тому підприємство мусить переглянути розрахунки.'],
    ['|Da| bezahlbarer Wohnraum fehlt, plant die Gemeinde zusätzliche Sozialwohnungen.','Bezahlbarer Wohnraum fehlt. |Daher| plant die Gemeinde zusätzliche Sozialwohnungen.','оскільки','через це','Бракує доступного житла, тому громада планує додаткові соціальні квартири.'],
    ['|Weil| sich die Lieferbedingungen geändert haben, müssen wir den Vertrag anpassen.','Die Lieferbedingungen haben sich geändert. |Deswegen| müssen wir den Vertrag anpassen.','оскільки','тому','Умови постачання змінилися, тому ми мусимо скоригувати договір.'],
    ['|Da| die Untersuchung neue Erkenntnisse liefert, wird die bisherige Strategie überprüft.','Die Untersuchung liefert neue Erkenntnisse. |Deshalb| wird die bisherige Strategie überprüft.','оскільки','тому','Дослідження дає нові висновки, тому попередню стратегію переглядають.'],
    ['|Weil| mehrere Fachkräfte fehlen, kann die Abteilung nicht alle Aufträge bearbeiten.','Mehrere Fachkräfte fehlen. |Daher| kann die Abteilung nicht alle Aufträge bearbeiten.','оскільки','через це','Бракує кількох фахівців, тому відділ не може опрацювати всі замовлення.'],
    ['|Da| die Nachfrage deutlich zurückgegangen ist, reduziert die Firma ihre Produktion.','Die Nachfrage ist deutlich zurückgegangen. |Deswegen| reduziert die Firma ihre Produktion.','оскільки','тому','Попит істотно знизився, тому фірма скорочує виробництво.'],
    ['|Weil| der öffentliche Nahverkehr ausgebaut wird, verbessern sich die Verbindungen zum Umland.','Der öffentliche Nahverkehr wird ausgebaut. |Deshalb| verbessern sich die Verbindungen zum Umland.','оскільки','тому','Громадський транспорт розширюють, тому сполучення з передмістям поліпшується.'],
    ['|Da| die Bewerberin über einschlägige Erfahrung verfügt, wird sie zum Gespräch eingeladen.','Die Bewerberin verfügt über einschlägige Erfahrung. |Daher| wird sie zum Gespräch eingeladen.','оскільки','через це','Кандидатка має відповідний досвід, тому її запрошують на співбесіду.'],
    ['|Obwohl| die Finanzierung noch nicht vollständig gesichert ist, beginnen die Vorbereitungen.','Die Finanzierung ist noch nicht vollständig gesichert. |Trotzdem| beginnen die Vorbereitungen.','хоча','попри це','Фінансування ще не повністю забезпечене, проте підготовка починається.'],
    ['|Obgleich| der Zeitplan sehr knapp ist, hält das Team am ursprünglichen Ziel fest.','Der Zeitplan ist sehr knapp. |Dennoch| hält das Team am ursprünglichen Ziel fest.','хоча','попри це','Графік дуже стислий, проте команда дотримується початкової мети.'],
    ['|Obwohl| die Wohnung klein ist, bietet sie ausreichend Stauraum.','Die Wohnung ist klein. |Trotzdem| bietet sie ausreichend Stauraum.','хоча','попри це','Квартира маленька, але має достатньо місця для зберігання речей.'],
    ['|Obwohl| das Verfahren kompliziert erscheint, lässt es sich weitgehend digital abwickeln.','Das Verfahren erscheint kompliziert. |Dennoch| lässt es sich weitgehend digital abwickeln.','хоча','попри це','Процедура здається складною, проте її можна переважно виконати цифровим способом.'],
    ['|Obgleich| die Maßnahme umstritten ist, wird sie von der Mehrheit unterstützt.','Die Maßnahme ist umstritten. |Trotzdem| wird sie von der Mehrheit unterstützt.','хоча','попри це','Захід викликає суперечки, проте більшість його підтримує.'],
    ['|Obwohl| die Preise gestiegen sind, bleibt die Nachfrage auf einem hohen Niveau.','Die Preise sind gestiegen. |Dennoch| bleibt die Nachfrage auf einem hohen Niveau.','хоча','попри це','Ціни зросли, проте попит залишається високим.'],
    ['|Obwohl| der Antrag fristgerecht eingereicht wurde, verzögert sich die Bearbeitung.','Der Antrag wurde fristgerecht eingereicht. |Trotzdem| verzögert sich die Bearbeitung.','хоча','попри це','Заяву подали вчасно, проте її розгляд затримується.'],
    ['|Obgleich| die Studie nur wenige Personen umfasst, liefert sie interessante Hinweise.','Die Studie umfasst nur wenige Personen. |Dennoch| liefert sie interessante Hinweise.','хоча','попри це','Дослідження охоплює мало людей, проте дає цікаві відомості.'],
    ['|Falls| Sie die Unterlagen nicht vollständig einreichen, kann der Antrag nicht bearbeitet werden.','Bitte reichen Sie die Unterlagen vollständig ein. |Andernfalls| kann der Antrag nicht bearbeitet werden.','якщо','інакше','Документи потрібно подати повністю, інакше заяву не зможуть розглянути.'],
    ['|Wenn| die Finanzierung nicht rechtzeitig gesichert wird, muss das Projekt verschoben werden.','Die Finanzierung muss rechtzeitig gesichert werden. |Sonst| muss das Projekt verschoben werden.','якщо','інакше','Фінансування треба забезпечити вчасно, інакше проєкт доведеться перенести.'],
    ['|Falls| die Nachfrage nicht steigt, wird sich die Investition nicht lohnen.','Die Nachfrage muss steigen. |Andernfalls| wird sich die Investition nicht lohnen.','якщо','інакше','Попит має зрости, інакше інвестиція не окупиться.'],
    ['|Wenn| keine Einigung erzielt wird, müssen die Verhandlungen fortgesetzt werden.','Es muss eine Einigung erzielt werden. |Sonst| müssen die Verhandlungen fortgesetzt werden.','якщо','інакше','Потрібно досягти домовленості, інакше переговори доведеться продовжити.'],
    ['|Sofern| die Voraussetzungen erfüllt sind, wird die Förderung bewilligt.','Die Voraussetzungen müssen erfüllt sein. |Unter dieser Voraussetzung| wird die Förderung bewilligt.','за умови, що','за цієї умови','Фінансування схвалять за умови виконання вимог.'],
    ['|Sofern| die Mehrheit zustimmt, kann die Satzung geändert werden.','Die Mehrheit muss zustimmen. |Unter dieser Voraussetzung| kann die Satzung geändert werden.','за умови, що','за цієї умови','Статут можна змінити за умови згоди більшості.'],
    ['|Falls| sich die Situation nicht verbessert, werden weitere Maßnahmen erforderlich sein.','Die Situation muss sich verbessern. |Andernfalls| werden weitere Maßnahmen erforderlich sein.','якщо','інакше','Ситуація має поліпшитися, інакше знадобляться додаткові заходи.'],
    ['|Wenn| die Frist nicht eingehalten wird, entstehen zusätzliche Kosten.','Die Frist muss eingehalten werden. |Sonst| entstehen zusätzliche Kosten.','якщо','інакше','Терміну потрібно дотриматися, інакше виникнуть додаткові витрати.'],
    ['|Bevor| die neue Software eingeführt wird, müssen die Beschäftigten geschult werden.','Die neue Software wird eingeführt. |Vorher| müssen die Beschäftigten geschult werden.','перш ніж','перед цим','Перед запровадженням нової програми працівників потрібно навчити.'],
    ['|Bevor| der Vertrag unterschrieben wird, sollten alle Klauseln geprüft werden.','Der Vertrag wird unterschrieben. |Zuvor| sollten alle Klauseln geprüft werden.','перш ніж','перед цим','Перед підписанням договору слід перевірити всі його положення.'],
    ['|Ehe| die Verhandlungen beginnen, legen beide Seiten ihre Ziele fest.','Die Verhandlungen beginnen. |Vorher| legen beide Seiten ihre Ziele fest.','перш ніж','перед цим','Перед початком переговорів обидві сторони визначають свої цілі.'],
    ['|Bevor| die Ergebnisse veröffentlicht werden, müssen die Daten überprüft werden.','Die Ergebnisse werden veröffentlicht. |Zuvor| müssen die Daten überprüft werden.','перш ніж','перед цим','Перед оприлюдненням результатів дані потрібно перевірити.'],
    ['|Nachdem| die Bauarbeiten abgeschlossen worden waren, wurde das Gebäude freigegeben.','Die Bauarbeiten waren abgeschlossen worden. |Danach| wurde das Gebäude freigegeben.','після того як','після цього','Після завершення будівельних робіт будівлю дозволили використовувати.'],
    ['|Nachdem| die Kommission alle Unterlagen geprüft hatte, gab sie eine Empfehlung ab.','Die Kommission hatte alle Unterlagen geprüft. |Anschließend| gab sie eine Empfehlung ab.','після того як','після цього','Після перевірки всіх документів комісія надала рекомендацію.'],
    ['|Nachdem| die Vereinbarung unterzeichnet worden war, begann die Zusammenarbeit.','Die Vereinbarung war unterzeichnet worden. |Danach| begann die Zusammenarbeit.','після того як','після цього','Після підписання угоди почалася співпраця.'],
    ['|Nachdem| die Kundin den Mangel gemeldet hatte, erhielt sie ein Ersatzgerät.','Die Kundin hatte den Mangel gemeldet. |Anschließend| erhielt sie ein Ersatzgerät.','після того як','після цього','Після повідомлення про дефект клієнтка отримала прилад на заміну.'],
    ['|Damit| mehr Menschen am öffentlichen Leben teilnehmen können, werden die Zugänge barrierefrei gestaltet.','Mehr Menschen sollen am öffentlichen Leben teilnehmen können. |Dazu| werden die Zugänge barrierefrei gestaltet.','щоб','для цього','Входи облаштовують безбар’єрно, щоб більше людей могло брати участь у громадському житті.'],
    ['|Damit| die Beschäftigten ihre Kenntnisse erweitern können, bietet die Firma regelmäßige Schulungen an.','Die Beschäftigten sollen ihre Kenntnisse erweitern können. |Dafür| bietet die Firma regelmäßige Schulungen an.','щоб','для цього','Фірма пропонує регулярне навчання, щоб працівники могли розширювати знання.'],
    ['|Damit| die Anträge schneller bearbeitet werden können, wird ein digitales Portal eingerichtet.','Die Anträge sollen schneller bearbeitet werden können. |Dazu| wird ein digitales Portal eingerichtet.','щоб','для цього','Створюють цифровий портал, щоб заяви можна було опрацьовувати швидше.'],
    ['|Damit| Jugendliche ihre Interessen vertreten können, wird ein Jugendbeirat gegründet.','Jugendliche sollen ihre Interessen vertreten können. |Dafür| wird ein Jugendbeirat gegründet.','щоб','для цього','Створюють молодіжну раду, щоб молодь могла представляти свої інтереси.'],
    ['|Indem| das Unternehmen Verpackungen wiederverwendet, verringert es den Materialverbrauch.','Das Unternehmen verwendet Verpackungen wieder. |Dadurch| verringert es den Materialverbrauch.','завдяки тому, що; спосіб дії','завдяки цьому','Повторно використовуючи упаковку, підприємство зменшує споживання матеріалів.'],
    ['|Indem| die Stadt sichere Radwege anlegt, fördert sie den klimafreundlichen Verkehr.','Die Stadt legt sichere Radwege an. |Dadurch| fördert sie den klimafreundlichen Verkehr.','завдяки тому, що; спосіб дії','завдяки цьому','Створюючи безпечні велодоріжки, місто підтримує екологічний транспорт.'],
    ['|Indem| die Lehrkraft verschiedene Lernwege anbietet, berücksichtigt sie individuelle Bedürfnisse.','Die Lehrkraft bietet verschiedene Lernwege an. |Dadurch| berücksichtigt sie individuelle Bedürfnisse.','завдяки тому, що; спосіб дії','завдяки цьому','Пропонуючи різні шляхи навчання, викладач ураховує індивідуальні потреби.'],
    ['|Indem| die Behörde Informationen in einfacher Sprache veröffentlicht, erleichtert sie den Zugang zu ihren Angeboten.','Die Behörde veröffentlicht Informationen in einfacher Sprache. |Dadurch| erleichtert sie den Zugang zu ihren Angeboten.','завдяки тому, що; спосіб дії','завдяки цьому','Публікуючи інформацію простою мовою, установа полегшує доступ до своїх послуг.']
  ];
  const equivalentGroups = [
    ['Weil','Da'], ['Deshalb','Daher','Deswegen','Darum','Aus diesem Grund'],
    ['Obwohl','Obgleich','Obschon','Wenngleich'], ['Trotzdem','Dennoch','Gleichwohl','Nichtsdestotrotz'],
    ['Falls','Wenn','Sofern'], ['Andernfalls','Sonst'], ['Bevor','Ehe'], ['Vorher','Zuvor'],
    ['Danach','Anschließend'], ['Dazu','Dafür','Zu diesem Zweck']
  ];
  pairs.forEach(([first,second,firstHint,secondHint,translation]) => {
    [[first,firstHint,true],[second,secondHint,false]].forEach(([marked,hint,subordinate]) => {
      const answer = marked.match(/\|([^|]+)\|/u)[1];
      const sentence = marked.replace(/\|[^|]+\|/u,'___');
      const group = equivalentGroups.find(g => g.includes(answer));
      const item = {sentence,answers:[answer],answer,infinitive:subordinate ? 'Nebensatz · Konnektor' : 'Hauptsatz · Verknüpfung',ua_infinitiv:hint,ua_sentence:translation,level:'B2',explanation:subordinate ? 'Сполучник вводить підрядне речення: відмінюване дієслово стоїть наприкінці. Після початкового підрядного речення головне починається з відмінюваного дієслова.' : 'Прислівниковий зв’язок займає перше місце в головному реченні; відмінюване дієслово йде одразу після нього, а потім підмет.'};
      if (group) item.alternatives = group.filter(x=>x!==answer).map(x=>[x]);
      test.data.push(item);
    });
  });
})();
