/*
 * Розширення шести тестів на часи: добірка природних словосполучень.
 * Кожна лексична картка має власний контекст і явно задані українські форми.
 * У перекладах минулого часу я/ти: чоловіча та жіноча форми через «/»;
 * er = він, sie у шостій позиції = вони. У Futur II дія завершена до завтра.
 */
const more_verbs = (() => {
  const result = { praesens: [], perfekt: [], praeteritum: [], plusquamperfekt: [], futur1: [], futur2: [] };
  const split = value => value.split('|');
  const subjects = ['Ich', 'Du', 'Er', 'Wir', 'Ihr', 'Sie'];
  const ukrainianSubjects = ['Я', 'Ти', 'Він', 'Ми', 'Ви', 'Вони'];
  const have = split('habe|hast|hat|haben|habt|haben');
  const be = split('bin|bist|ist|sind|seid|sind');
  const had = split('hatte|hattest|hatte|hatten|hattet|hatten');
  const was = split('war|warst|war|waren|wart|waren');
  const will = split('werde|wirst|wird|werden|werdet|werden');
  const verbs = {};
  function regular(inf, participle, prefix = '', base = inf) {
    const stem = base.replace(/en$|n$/, '');
    const e = /[dt]$/.test(stem) ? 'e' : '';
    const s = /[sßxz]$/.test(stem) ? '' : 's';
    verbs[inf] = {
      inf, prefix, participle, auxiliary: 'haben',
      present: [stem + 'e', stem + e + s + 't', stem + e + 't', base, stem + e + 't', base],
      past: ['te', 'test', 'te', 'ten', 'tet', 'ten'].map(ending => stem + e + ending)
    };
  }
  function irregular(inf, present, past, participle, auxiliary = 'haben', prefix = '') {
    verbs[inf] = { inf, present: split(present), past: split(past), participle, auxiliary, prefix };
  }
  function prefixed(inf, base, prefix, participle, auxiliary) {
    verbs[inf] = { ...verbs[base], inf, prefix, participle, auxiliary: auxiliary || verbs[base].auxiliary };
  }
  for (const [inf, participle] of [
    ['kaufen', 'gekauft'], ['bestellen', 'bestellt'], ['bezahlen', 'bezahlt'],
    ['kochen', 'gekocht'], ['putzen', 'geputzt'], ['reinigen', 'gereinigt'],
    ['öffnen', 'geöffnet'], ['reparieren', 'repariert'], ['wechseln', 'gewechselt'],
    ['holen', 'geholt'], ['legen', 'gelegt'], ['stellen', 'gestellt'],
    ['hängen', 'gehängt'], ['suchen', 'gesucht'], ['hören', 'gehört'],
    ['lernen', 'gelernt'], ['üben', 'geübt'], ['wiederholen', 'wiederholt'],
    ['erklären', 'erklärt'], ['übersetzen', 'übersetzt'], ['prüfen', 'geprüft'],
    ['korrigieren', 'korrigiert'], ['planen', 'geplant'], ['buchen', 'gebucht'],
    ['reservieren', 'reserviert'], ['packen', 'gepackt'], ['besuchen', 'besucht'],
    ['antworten', 'geantwortet'], ['fragen', 'gefragt'], ['erzählen', 'erzählt'],
    ['zeigen', 'gezeigt'], ['schicken', 'geschickt'], ['liefern', 'geliefert'],
    ['danken', 'gedankt'], ['beantragen', 'beantragt'], ['kopieren', 'kopiert'],
    ['speichern', 'gespeichert'], ['löschen', 'gelöscht'], ['installieren', 'installiert'],
    ['aktualisieren', 'aktualisiert'], ['beenden', 'beendet'], ['reisen', 'gereist'],
    ['untersuchen', 'untersucht'], ['vereinbaren', 'vereinbart'], ['versorgen', 'versorgt']
  ]) regular(inf, participle);
  // -nen після приголосного потребує e: öffnen, на відміну від lernen.
  verbs.öffnen.present = split('öffne|öffnest|öffnet|öffnen|öffnet|öffnen');
  verbs.öffnen.past = split('öffnete|öffnetest|öffnete|öffneten|öffnetet|öffneten');
  verbs.wechseln.presentAlternatives = [['wechsle'], [], [], [], [], []];
  verbs.reisen.auxiliary = 'sein';
  irregular('backen', 'backe|backst|backt|backen|backt|backen', 'backte|backtest|backte|backten|backtet|backten', 'gebacken');
  verbs.backen.presentAlternatives = [[], ['bäckst'], ['bäckt'], [], [], []];
  verbs.backen.pastAlternatives = split('buk|bukst|buk|buken|bukt|buken').map(form => [form]);
  irregular('schneiden', 'schneide|schneidest|schneidet|schneiden|schneidet|schneiden', 'schnitt|schnittest|schnitt|schnitten|schnittet|schnitten', 'geschnitten');
  irregular('waschen', 'wasche|wäschst|wäscht|waschen|wascht|waschen', 'wusch|wuschest|wusch|wuschen|wuscht|wuschen', 'gewaschen');
  verbs.waschen.pastAlternatives = [[], ['wuschst'], [], [], [], []];
  irregular('schließen', 'schließe|schließt|schließt|schließen|schließt|schließen', 'schloss|schlossest|schloss|schlossen|schlosst|schlossen', 'geschlossen');
  irregular('tragen', 'trage|trägst|trägt|tragen|tragt|tragen', 'trug|trugst|trug|trugen|trugt|trugen', 'getragen');
  irregular('bringen', 'bringe|bringst|bringt|bringen|bringt|bringen', 'brachte|brachtest|brachte|brachten|brachtet|brachten', 'gebracht');
  irregular('finden', 'finde|findest|findet|finden|findet|finden', 'fand|fandest|fand|fanden|fandet|fanden', 'gefunden');
  irregular('verlieren', 'verliere|verlierst|verliert|verlieren|verliert|verlieren', 'verlor|verlorst|verlor|verloren|verlort|verloren', 'verloren');
  irregular('vergessen', 'vergesse|vergisst|vergisst|vergessen|vergesst|vergessen', 'vergaß|vergaßest|vergaß|vergaßen|vergaßt|vergaßen', 'vergessen');
  verbs.vergessen.pastAlternatives = [[], ['vergaßt'], [], [], [], []];
  irregular('lesen', 'lese|liest|liest|lesen|lest|lesen', 'las|lasest|las|lasen|last|lasen', 'gelesen');
  verbs.lesen.pastAlternatives = [[], ['last'], [], [], [], []];
  irregular('schreiben', 'schreibe|schreibst|schreibt|schreiben|schreibt|schreiben', 'schrieb|schriebst|schrieb|schrieben|schriebt|schrieben', 'geschrieben');
  irregular('sehen', 'sehe|siehst|sieht|sehen|seht|sehen', 'sah|sahst|sah|sahen|saht|sahen', 'gesehen');
  irregular('verstehen', 'verstehe|verstehst|versteht|verstehen|versteht|verstehen', 'verstand|verstandest|verstand|verstanden|verstandet|verstanden', 'verstanden');
  irregular('treffen', 'treffe|triffst|trifft|treffen|trefft|treffen', 'traf|trafst|traf|trafen|traft|trafen', 'getroffen');
  irregular('laden', 'lade|lädst|lädt|laden|ladet|laden', 'lud|ludst|lud|luden|ludet|luden', 'geladen');
  verbs.laden.pastAlternatives = [[], ['ludest'], [], [], [], []];
  prefixed('einladen', 'laden', 'ein', 'eingeladen');
  irregular('rufen', 'rufe|rufst|ruft|rufen|ruft|rufen', 'rief|riefst|rief|riefen|rieft|riefen', 'gerufen');
  prefixed('anrufen', 'rufen', 'an', 'angerufen');
  irregular('bekommen', 'bekomme|bekommst|bekommt|bekommen|bekommt|bekommen', 'bekam|bekamst|bekam|bekamen|bekamt|bekamen', 'bekommen');
  irregular('nehmen', 'nehme|nimmst|nimmt|nehmen|nehmt|nehmen', 'nahm|nahmst|nahm|nahmen|nahmt|nahmen', 'genommen');
  irregular('geben', 'gebe|gibst|gibt|geben|gebt|geben', 'gab|gabst|gab|gaben|gabt|gaben', 'gegeben');
  irregular('helfen', 'helfe|hilfst|hilft|helfen|helft|helfen', 'half|halfst|half|halfen|halft|halfen', 'geholfen');
  irregular('empfehlen', 'empfehle|empfiehlst|empfiehlt|empfehlen|empfehlt|empfehlen', 'empfahl|empfahlst|empfahl|empfahlen|empfahlt|empfahlen', 'empfohlen');
  irregular('unterschreiben', 'unterschreibe|unterschreibst|unterschreibt|unterschreiben|unterschreibt|unterschreiben', 'unterschrieb|unterschriebst|unterschrieb|unterschrieben|unterschriebt|unterschrieben', 'unterschrieben');
  for (const [inf, base, prefix, participle] of [
    ['ausfüllen', 'füllen', 'aus', 'ausgefüllt'], ['einreichen', 'reichen', 'ein', 'eingereicht'],
    ['ausdrucken', 'drucken', 'aus', 'ausgedruckt'], ['einschalten', 'schalten', 'ein', 'eingeschaltet'],
    ['ausschalten', 'schalten', 'aus', 'ausgeschaltet'], ['aufmachen', 'machen', 'auf', 'aufgemacht'],
    ['zumachen', 'machen', 'zu', 'zugemacht'], ['aufräumen', 'räumen', 'auf', 'aufgeräumt'],
    ['einkaufen', 'kaufen', 'ein', 'eingekauft'], ['vorbereiten', 'bereiten', 'vor', 'vorbereitet'],
    ['umtauschen', 'tauschen', 'um', 'umgetauscht'], ['auswählen', 'wählen', 'aus', 'ausgewählt']
  ]) regular(inf, participle, prefix, base);
  prefixed('abgeben', 'geben', 'ab', 'abgegeben');
  prefixed('abholen', 'holen', 'ab', 'abgeholt');
  prefixed('mitbringen', 'bringen', 'mit', 'mitgebracht');
  prefixed('mitnehmen', 'nehmen', 'mit', 'mitgenommen');
  prefixed('zurückgeben', 'geben', 'zurück', 'zurückgegeben');
  irregular('fangen', 'fange|fängst|fängt|fangen|fangt|fangen', 'fing|fingst|fing|fingen|fingt|fingen', 'gefangen');
  prefixed('anfangen', 'fangen', 'an', 'angefangen');
  irregular('beginnen', 'beginne|beginnst|beginnt|beginnen|beginnt|beginnen', 'begann|begannst|begann|begannen|begannt|begannen', 'begonnen');
  irregular('stehen', 'stehe|stehst|steht|stehen|steht|stehen', 'stand|standest|stand|standen|standet|standen', 'gestanden');
  prefixed('aufstehen', 'stehen', 'auf', 'aufgestanden', 'sein');
  regular('aufwachen', 'aufgewacht', 'auf', 'wachen');
  verbs.aufwachen.auxiliary = 'sein';
  irregular('kommen', 'komme|kommst|kommt|kommen|kommt|kommen', 'kam|kamst|kam|kamen|kamt|kamen', 'gekommen', 'sein');
  prefixed('ankommen', 'kommen', 'an', 'angekommen');
  prefixed('zurückkommen', 'kommen', 'zurück', 'zurückgekommen');
  irregular('fahren', 'fahre|fährst|fährt|fahren|fahrt|fahren', 'fuhr|fuhrst|fuhr|fuhren|fuhrt|fuhren', 'gefahren', 'sein');
  prefixed('abfahren', 'fahren', 'ab', 'abgefahren');
  irregular('steigen', 'steige|steigst|steigt|steigen|steigt|steigen', 'stieg|stiegst|stieg|stiegen|stiegt|stiegen', 'gestiegen', 'sein');
  prefixed('einsteigen', 'steigen', 'ein', 'eingestiegen');
  prefixed('aussteigen', 'steigen', 'aus', 'ausgestiegen');
  prefixed('umsteigen', 'steigen', 'um', 'umgestiegen');
  irregular('gehen', 'gehe|gehst|geht|gehen|geht|gehen', 'ging|gingst|ging|gingen|gingt|gingen', 'gegangen', 'sein');
  irregular('fliegen', 'fliege|fliegst|fliegt|fliegen|fliegt|fliegen', 'flog|flogst|flog|flogen|flogt|flogen', 'geflogen', 'sein');
  irregular('laufen', 'laufe|läufst|läuft|laufen|lauft|laufen', 'lief|liefst|lief|liefen|lieft|liefen', 'gelaufen', 'sein');
  irregular('ziehen', 'ziehe|ziehst|zieht|ziehen|zieht|ziehen', 'zog|zogst|zog|zogen|zogt|zogen', 'gezogen', 'sein');
  prefixed('umziehen', 'ziehen', 'um', 'umgezogen');
  prefixed('einziehen', 'ziehen', 'ein', 'eingezogen');
  prefixed('ausziehen', 'ziehen', 'aus', 'ausgezogen');
  irregular('messen', 'messe|misst|misst|messen|messt|messen', 'maß|maßest|maß|maßen|maßt|maßen', 'gemessen');
  irregular('überweisen', 'überweise|überweist|überweist|überweisen|überweist|überweisen', 'überwies|überwiesest|überwies|überwiesen|überwiest|überwiesen', 'überwiesen');
  prefixed('ausgeben', 'geben', 'aus', 'ausgegeben');
  irregular('essen', 'esse|isst|isst|essen|esst|essen', 'aß|aßest|aß|aßen|aßt|aßen', 'gegessen');
  irregular('trinken', 'trinke|trinkst|trinkt|trinken|trinkt|trinken', 'trank|trankst|trank|tranken|trankt|tranken', 'getrunken');

  // inf | контекст DE | інфінітив UA | теперішні 6 форм | минулі ч./ж./мн. |
  // доконані майбутні 6 форм | контекст UA. Кожний рядок прочитується окремо.
  const rows = [
    ['kaufen', 'frisches Brot', 'купувати', 'купую|купуєш|купує|купуємо|купуєте|купують', 'купив|купила|купили', 'куплю|купиш|купить|купимо|купите|куплять', 'свіжий хліб'],
    ['bestellen', 'eine warme Suppe', 'замовляти', 'замовляю|замовляєш|замовляє|замовляємо|замовляєте|замовляють', 'замовив|замовила|замовили', 'замовлю|замовиш|замовить|замовимо|замовите|замовлять', 'гарячий суп'],
    ['bezahlen', 'die Rechnung im Restaurant', 'оплачувати', 'оплачую|оплачуєш|оплачує|оплачуємо|оплачуєте|оплачують', 'оплатив|оплатила|оплатили', 'оплачу|оплатиш|оплатить|оплатимо|оплатите|оплатять', 'рахунок у ресторані'],
    ['kochen', 'eine Gemüsesuppe', 'готувати', 'готую|готуєш|готує|готуємо|готуєте|готують', 'приготував|приготувала|приготували', 'приготую|приготуєш|приготує|приготуємо|приготуєте|приготують', 'овочевий суп'],
    ['backen', 'einen Apfelkuchen', 'пекти', 'печу|печеш|пече|печемо|печете|печуть', 'спік|спекла|спекли', 'спечу|спечеш|спече|спечемо|спечете|спечуть', 'яблучний пиріг'],
    ['schneiden', 'das Brot in Scheiben', 'нарізати', 'нарізаю|нарізаєш|нарізає|нарізаємо|нарізаєте|нарізають', 'нарізав|нарізала|нарізали', 'наріжу|наріжеш|наріже|наріжемо|наріжете|наріжуть', 'хліб скибками'],
    ['waschen', 'die schmutzige Jacke', 'прати', 'перу|переш|пере|перемо|перете|перуть', 'виправ|випрала|випрали', 'виперу|випереш|випере|виперемо|виперете|виперуть', 'брудну куртку'],
    ['putzen', 'die Fenster in der Küche', 'мити', 'мию|миєш|миє|миємо|миєте|миють', 'помив|помила|помили', 'помию|помиєш|помиє|помиємо|помиєте|помиють', 'вікна на кухні'],
    ['reinigen', 'den Filter der Kaffeemaschine', 'чистити', 'чищу|чистиш|чистить|чистимо|чистите|чистять', 'почистив|почистила|почистили', 'почищу|почистиш|почистить|почистимо|почистите|почистять', 'фільтр кавомашини'],
    ['öffnen', 'das Paket aus Berlin', 'відкривати', 'відкриваю|відкриваєш|відкриває|відкриваємо|відкриваєте|відкривають', 'відкрив|відкрила|відкрили', 'відкрию|відкриєш|відкриє|відкриємо|відкриєте|відкриють', 'посилку з Берліна'],
    ['schließen', 'die Tür zum Balkon', 'зачиняти', 'зачиняю|зачиняєш|зачиняє|зачиняємо|зачиняєте|зачиняють', 'зачинив|зачинила|зачинили', 'зачиню|зачиниш|зачинить|зачинимо|зачините|зачинять', 'двері на балкон'],
    ['reparieren', 'das kaputte Fahrrad', 'ремонтувати', 'ремонтую|ремонтуєш|ремонтує|ремонтуємо|ремонтуєте|ремонтують', 'відремонтував|відремонтувала|відремонтували', 'відремонтую|відремонтуєш|відремонтує|відремонтуємо|відремонтуєте|відремонтують', 'зламаний велосипед'],
    ['wechseln', 'die Batterie der Fernbedienung', 'міняти', 'міняю|міняєш|міняє|міняємо|міняєте|міняють', 'замінив|замінила|замінили', 'заміню|заміниш|замінить|замінимо|заміните|замінять', 'батарейку пульта'],
    ['tragen', 'die Einkaufstaschen nach Hause', 'нести', 'несу|несеш|несе|несемо|несете|несуть', 'приніс|принесла|принесли', 'принесу|принесеш|принесе|принесемо|принесете|принесуть', 'сумки з покупками додому'],
    ['bringen', 'das Kind zur Schule', 'відводити', 'відводжу|відводиш|відводить|відводимо|відводите|відводять', 'відвів|відвела|відвели', 'відведу|відведеш|відведе|відведемо|відведете|відведуть', 'дитину до школи'],
    ['holen', 'ein Glas Wasser', 'приносити', 'приношу|приносиш|приносить|приносимо|приносите|приносять', 'приніс|принесла|принесли', 'принесу|принесеш|принесе|принесемо|принесете|принесуть', 'склянку води'],
    ['legen', 'den Schlüssel auf den Tisch', 'класти', 'кладу|кладеш|кладе|кладемо|кладете|кладуть', 'поклав|поклала|поклали', 'покладу|покладеш|покладе|покладемо|покладете|покладуть', 'ключ на стіл'],
    ['stellen', 'die Milch in den Kühlschrank', 'ставити', 'ставлю|ставиш|ставить|ставимо|ставите|ставлять', 'поставив|поставила|поставили', 'поставлю|поставиш|поставить|поставимо|поставите|поставлять', 'молоко в холодильник'],
    ['hängen', 'den Mantel an den Haken', 'вішати', 'вішаю|вішаєш|вішає|вішаємо|вішаєте|вішають', 'повісив|повісила|повісили', 'повішу|повісиш|повісить|повісимо|повісите|повісять', 'пальто на гачок'],
    ['suchen', 'den verlorenen Schlüssel', 'шукати', 'шукаю|шукаєш|шукає|шукаємо|шукаєте|шукають', 'шукав|шукала|шукали', 'пошукаю|пошукаєш|пошукає|пошукаємо|пошукаєте|пошукають', 'загублений ключ'],
    ['finden', 'eine passende Wohnung', 'знаходити', 'знаходжу|знаходиш|знаходить|знаходимо|знаходите|знаходять', 'знайшов|знайшла|знайшли', 'знайду|знайдеш|знайде|знайдемо|знайдете|знайдуть', 'відповідну квартиру'],
    ['verlieren', 'den Überblick über die Ausgaben', 'втрачати', 'втрачаю|втрачаєш|втрачає|втрачаємо|втрачаєте|втрачають', 'втратив|втратила|втратили', 'втрачу|втратиш|втратить|втратимо|втратите|втратять', 'уявлення про обсяг витрат'],
    ['vergessen', 'die genaue Adresse', 'забувати', 'забуваю|забуваєш|забуває|забуваємо|забуваєте|забувають', 'забув|забула|забули', 'забуду|забудеш|забуде|забудемо|забудете|забудуть', 'точну адресу'],
    ['lesen', 'einen Artikel über Berlin', 'читати', 'читаю|читаєш|читає|читаємо|читаєте|читають', 'прочитав|прочитала|прочитали', 'прочитаю|прочитаєш|прочитає|прочитаємо|прочитаєте|прочитають', 'статтю про Берлін'],
    ['schreiben', 'eine E-Mail an die Lehrerin', 'писати', 'пишу|пишеш|пише|пишемо|пишете|пишуть', 'написав|написала|написали', 'напишу|напишеш|напише|напишемо|напишете|напишуть', 'електронного листа вчительці'],
    ['hören', 'einen Podcast auf Deutsch', 'слухати', 'слухаю|слухаєш|слухає|слухаємо|слухаєте|слухають', 'прослухав|прослухала|прослухали', 'прослухаю|прослухаєш|прослухає|прослухаємо|прослухаєте|прослухають', 'подкаст німецькою мовою'],
    ['sehen', 'einen Film mit Untertiteln', 'дивитися', 'дивлюся|дивишся|дивиться|дивимося|дивитеся|дивляться', 'подивився|подивилася|подивилися', 'подивлюся|подивишся|подивиться|подивимося|подивитеся|подивляться', 'фільм із субтитрами'],
    ['lernen', 'zwanzig neue Wörter', 'вчити', 'вчу|вчиш|вчить|вчимо|вчите|вчать', 'вивчив|вивчила|вивчили', 'вивчу|вивчиш|вивчить|вивчимо|вивчите|вивчать', 'двадцять нових слів'],
    ['üben', 'die Aussprache der Umlaute', 'відпрацьовувати', 'відпрацьовую|відпрацьовуєш|відпрацьовує|відпрацьовуємо|відпрацьовуєте|відпрацьовують', 'відпрацював|відпрацювала|відпрацювали', 'відпрацюю|відпрацюєш|відпрацює|відпрацюємо|відпрацюєте|відпрацюють', 'вимову умлаутів'],
    ['wiederholen', 'die wichtigsten Grammatikregeln', 'повторювати', 'повторюю|повторюєш|повторює|повторюємо|повторюєте|повторюють', 'повторив|повторила|повторили', 'повторю|повториш|повторить|повторимо|повторите|повторять', 'найважливіші граматичні правила'],
    ['erklären', 'dem Kollegen die Aufgabe', 'пояснювати', 'пояснюю|пояснюєш|пояснює|пояснюємо|пояснюєте|пояснюють', 'пояснив|пояснила|пояснили', 'поясню|поясниш|пояснить|пояснимо|поясните|пояснять', 'колезі завдання'],
    ['verstehen', 'die Anweisungen der Lehrerin', 'розуміти', 'розумію|розумієш|розуміє|розуміємо|розумієте|розуміють', 'зрозумів|зрозуміла|зрозуміли', 'зрозумію|зрозумієш|зрозуміє|зрозуміємо|зрозумієте|зрозуміють', 'вказівки вчительки'],
    ['übersetzen', 'den Text ins Ukrainische', 'перекладати', 'перекладаю|перекладаєш|перекладає|перекладаємо|перекладаєте|перекладають', 'переклав|переклала|переклали', 'перекладу|перекладеш|перекладе|перекладемо|перекладете|перекладуть', 'текст українською мовою'],
    ['prüfen', 'die Angaben im Formular', 'перевіряти', 'перевіряю|перевіряєш|перевіряє|перевіряємо|перевіряєте|перевіряють', 'перевірив|перевірила|перевірили', 'перевірю|перевіриш|перевірить|перевіримо|перевірите|перевірять', 'дані у формулярі'],
    ['korrigieren', 'die Fehler im Bericht', 'виправляти', 'виправляю|виправляєш|виправляє|виправляємо|виправляєте|виправляють', 'виправив|виправила|виправили', 'виправлю|виправиш|виправить|виправимо|виправите|виправлять', 'помилки у звіті'],
    ['planen', 'einen Ausflug an den See', 'планувати', 'планую|плануєш|планує|плануємо|плануєте|планують', 'спланував|спланувала|спланували', 'спланую|сплануєш|спланує|сплануємо|сплануєте|спланують', 'поїздку до озера'],
    ['buchen', 'einen Flug nach Wien', 'бронювати', 'бронюю|бронюєш|бронює|бронюємо|бронюєте|бронюють', 'забронював|забронювала|забронювали', 'забронюю|забронюєш|забронює|забронюємо|забронюєте|забронюють', 'авіаквиток до Відня'],
    ['reservieren', 'einen Tisch für vier Personen', 'резервувати', 'резервую|резервуєш|резервує|резервуємо|резервуєте|резервують', 'зарезервував|зарезервувала|зарезервували', 'зарезервую|зарезервуєш|зарезервує|зарезервуємо|зарезервуєте|зарезервують', 'столик на чотирьох осіб'],
    ['packen', 'den Koffer für die Reise', 'пакувати', 'пакую|пакуєш|пакує|пакуємо|пакуєте|пакують', 'спакував|спакувала|спакували', 'спакую|спакуєш|спакує|спакуємо|спакуєте|спакують', 'валізу для подорожі'],
    ['besuchen', 'die Großeltern auf dem Land', 'відвідувати', 'відвідую|відвідуєш|відвідує|відвідуємо|відвідуєте|відвідують', 'відвідав|відвідала|відвідали', 'відвідаю|відвідаєш|відвідає|відвідаємо|відвідаєте|відвідають', 'бабусю й дідуся в селі'],
    ['treffen', 'einen alten Freund im Café', 'зустрічати', 'зустрічаю|зустрічаєш|зустрічає|зустрічаємо|зустрічаєте|зустрічають', 'зустрів|зустріла|зустріли', 'зустріну|зустрінеш|зустріне|зустрінемо|зустрінете|зустрінуть', 'давнього друга в кав’ярні'],
    ['einladen', 'die Nachbarn zum Abendessen', 'запрошувати', 'запрошую|запрошуєш|запрошує|запрошуємо|запрошуєте|запрошують', 'запросив|запросила|запросили', 'запрошу|запросиш|запросить|запросимо|запросите|запросять', 'сусідів на вечерю'],
    ['anrufen', 'die Arztpraxis', 'телефонувати', 'телефоную|телефонуєш|телефонує|телефонуємо|телефонуєте|телефонують', 'зателефонував|зателефонувала|зателефонували', 'зателефоную|зателефонуєш|зателефонує|зателефонуємо|зателефонуєте|зателефонують', 'до лікарської практики'],
    ['antworten', 'auf die Nachricht der Vermieterin', 'відповідати', 'відповідаю|відповідаєш|відповідає|відповідаємо|відповідаєте|відповідають', 'відповів|відповіла|відповіли', 'відповім|відповіси|відповість|відповімо|відповісте|відповідять', 'на повідомлення орендодавиці'],
    ['fragen', 'den Mitarbeiter nach dem Weg', 'розпитувати', 'розпитую|розпитуєш|розпитує|розпитуємо|розпитуєте|розпитують', 'розпитав|розпитала|розпитали', 'розпитаю|розпитаєш|розпитає|розпитаємо|розпитаєте|розпитають', 'працівника про дорогу'],
    ['erzählen', 'den Kindern eine Geschichte', 'розповідати', 'розповідаю|розповідаєш|розповідає|розповідаємо|розповідаєте|розповідають', 'розповів|розповіла|розповіли', 'розповім|розповіси|розповість|розповімо|розповісте|розповідять', 'дітям історію'],
    ['zeigen', 'der Ärztin den Ausschlag', 'показувати', 'показую|показуєш|показує|показуємо|показуєте|показують', 'показав|показала|показали', 'покажу|покажеш|покаже|покажемо|покажете|покажуть', 'лікарці висип'],
    ['schicken', 'das Paket an die Schwester', 'надсилати', 'надсилаю|надсилаєш|надсилає|надсилаємо|надсилаєте|надсилають', 'надіслав|надіслала|надіслали', 'надішлю|надішлеш|надішле|надішлемо|надішлете|надішлють', 'посилку сестрі'],
    ['liefern', 'die Möbel an die neue Adresse', 'доставляти', 'доставляю|доставляєш|доставляє|доставляємо|доставляєте|доставляють', 'доставив|доставила|доставили', 'доставлю|доставиш|доставить|доставимо|доставите|доставлять', 'меблі на нову адресу'],
    ['bekommen', 'eine Antwort von der Versicherung', 'отримувати', 'отримую|отримуєш|отримує|отримуємо|отримуєте|отримують', 'отримав|отримала|отримали', 'отримаю|отримаєш|отримає|отримаємо|отримаєте|отримають', 'відповідь від страхової компанії'],
    ['nehmen', 'den Bus zum Flughafen', 'обирати', 'обираю|обираєш|обирає|обираємо|обираєте|обирають', 'обрав|обрала|обрали', 'оберу|обереш|обере|оберемо|оберете|оберуть', 'автобус для поїздки в аеропорт'],
    ['geben', 'dem Kind ein Glas Wasser', 'давати', 'даю|даєш|дає|даємо|даєте|дають', 'дав|дала|дали', 'дам|даси|дасть|дамо|дасте|дадуть', 'дитині склянку води'],
    ['helfen', 'der Nachbarin beim Umzug', 'допомагати', 'допомагаю|допомагаєш|допомагає|допомагаємо|допомагаєте|допомагають', 'допоміг|допомогла|допомогли', 'допоможу|допоможеш|допоможе|допоможемо|допоможете|допоможуть', 'сусідці з переїздом'],
    ['danken', 'dem Kollegen für die Hilfe', 'дякувати', 'дякую|дякуєш|дякує|дякуємо|дякуєте|дякують', 'подякував|подякувала|подякували', 'подякую|подякуєш|подякує|подякуємо|подякуєте|подякують', 'колезі за допомогу'],
    ['empfehlen', 'der Freundin ein gutes Restaurant', 'рекомендувати', 'рекомендую|рекомендуєш|рекомендує|рекомендуємо|рекомендуєте|рекомендують', 'порекомендував|порекомендувала|порекомендували', 'порекомендую|порекомендуєш|порекомендує|порекомендуємо|порекомендуєте|порекомендують', 'подрузі хороший ресторан'],
    ['unterschreiben', 'den neuen Mietvertrag', 'підписувати', 'підписую|підписуєш|підписує|підписуємо|підписуєте|підписують', 'підписав|підписала|підписали', 'підпишу|підпишеш|підпише|підпишемо|підпишете|підпишуть', 'новий договір оренди'],
    ['ausfüllen', 'das Formular für die Anmeldung', 'заповнювати', 'заповнюю|заповнюєш|заповнює|заповнюємо|заповнюєте|заповнюють', 'заповнив|заповнила|заповнили', 'заповню|заповниш|заповнить|заповнимо|заповните|заповнять', 'формуляр для реєстрації'],
    ['beantragen', 'einen neuen Reisepass', 'подавати', 'подаю|подаєш|подає|подаємо|подаєте|подають', 'подав|подала|подали', 'подам|подаси|подасть|подамо|подасте|подадуть', 'заяву на новий закордонний паспорт'],
    ['abgeben', 'den Antrag am Schalter', 'подавати', 'подаю|подаєш|подає|подаємо|подаєте|подають', 'подав|подала|подали', 'подам|подаси|подасть|подамо|подасте|подадуть', 'заяву у віконце обслуговування'],
    ['abholen', 'das Paket bei der Post', 'забирати', 'забираю|забираєш|забирає|забираємо|забираєте|забирають', 'забрав|забрала|забрали', 'заберу|забереш|забере|заберемо|заберете|заберуть', 'посилку на пошті'],
    ['einreichen', 'die Unterlagen beim Bürgeramt', 'подавати', 'подаю|подаєш|подає|подаємо|подаєте|подають', 'подав|подала|подали', 'подам|подаси|подасть|подамо|подасте|подадуть', 'документи до центру обслуговування громадян'],
    ['ausdrucken', 'die Bestätigung der Buchung', 'роздруковувати', 'роздруковую|роздруковуєш|роздруковує|роздруковуємо|роздруковуєте|роздруковують', 'роздрукував|роздрукувала|роздрукували', 'роздрукую|роздрукуєш|роздрукує|роздрукуємо|роздрукуєте|роздрукують', 'підтвердження бронювання'],
    ['kopieren', 'die wichtigen Dokumente', 'копіювати', 'копіюю|копіюєш|копіює|копіюємо|копіюєте|копіюють', 'скопіював|скопіювала|скопіювали', 'скопіюю|скопіюєш|скопіює|скопіюємо|скопіюєте|скопіюють', 'важливі документи'],
    ['speichern', 'die Datei auf dem Computer', 'зберігати', 'зберігаю|зберігаєш|зберігає|зберігаємо|зберігаєте|зберігають', 'зберіг|зберегла|зберегли', 'збережу|збережеш|збереже|збережемо|збережете|збережуть', 'файл на комп’ютері'],
    ['löschen', 'die alte Telefonnummer', 'видаляти', 'видаляю|видаляєш|видаляє|видаляємо|видаляєте|видаляють', 'видалив|видалила|видалили', 'видалю|видалиш|видалить|видалимо|видалите|видалять', 'старий номер телефону'],
    ['installieren', 'die neue Lern-App', 'встановлювати', 'встановлюю|встановлюєш|встановлює|встановлюємо|встановлюєте|встановлюють', 'встановив|встановила|встановили', 'встановлю|встановиш|встановить|встановимо|встановите|встановлять', 'новий навчальний застосунок'],
    ['aktualisieren', 'die Adresse im Kundenkonto', 'оновлювати', 'оновлюю|оновлюєш|оновлює|оновлюємо|оновлюєте|оновлюють', 'оновив|оновила|оновили', 'оновлю|оновиш|оновить|оновимо|оновите|оновлять', 'адресу в особистому кабінеті'],
    ['einschalten', 'den Computer im Büro', 'вмикати', 'вмикаю|вмикаєш|вмикає|вмикаємо|вмикаєте|вмикають', 'увімкнув|увімкнула|увімкнули', 'увімкну|увімкнеш|увімкне|увімкнемо|увімкнете|увімкнуть', 'комп’ютер в офісі'],
    ['ausschalten', 'das Licht im Flur', 'вимикати', 'вимикаю|вимикаєш|вимикає|вимикаємо|вимикаєте|вимикають', 'вимкнув|вимкнула|вимкнули', 'вимкну|вимкнеш|вимкне|вимкнемо|вимкнете|вимкнуть', 'світло в коридорі'],
    ['aufmachen', 'das Fenster im Schlafzimmer', 'відчиняти', 'відчиняю|відчиняєш|відчиняє|відчиняємо|відчиняєте|відчиняють', 'відчинив|відчинила|відчинили', 'відчиню|відчиниш|відчинить|відчинимо|відчините|відчинять', 'вікно у спальні'],
    ['zumachen', 'die Haustür', 'зачиняти', 'зачиняю|зачиняєш|зачиняє|зачиняємо|зачиняєте|зачиняють', 'зачинив|зачинила|зачинили', 'зачиню|зачиниш|зачинить|зачинимо|зачините|зачинять', 'вхідні двері'],
    ['aufräumen', 'das Kinderzimmer', 'прибирати', 'прибираю|прибираєш|прибирає|прибираємо|прибираєте|прибирають', 'прибрав|прибрала|прибрали', 'приберу|прибереш|прибере|приберемо|приберете|приберуть', 'дитячу кімнату'],
    ['einkaufen', 'frisches Gemüse auf dem Markt', 'закуповувати', 'закуповую|закуповуєш|закуповує|закуповуємо|закуповуєте|закуповують', 'закупив|закупила|закупили', 'закуплю|закупиш|закупить|закупимо|закупите|закуплять', 'свіжі овочі на ринку'],
    ['vorbereiten', 'die Präsentation für das Treffen', 'готувати', 'готую|готуєш|готує|готуємо|готуєте|готують', 'підготував|підготувала|підготували', 'підготую|підготуєш|підготує|підготуємо|підготуєте|підготують', 'презентацію для зустрічі'],
    ['mitbringen', 'einen Salat zur Feier', 'приносити', 'приношу|приносиш|приносить|приносимо|приносите|приносять', 'приніс|принесла|принесли', 'принесу|принесеш|принесе|принесемо|принесете|принесуть', 'із собою салат на свято'],
    ['mitnehmen', 'einen Regenschirm auf den Ausflug', 'брати', 'беру|береш|бере|беремо|берете|беруть', 'взяв|взяла|взяли', 'візьму|візьмеш|візьме|візьмемо|візьмете|візьмуть', 'із собою парасольку на екскурсію'],
    ['zurückgeben', 'das Buch in der Bibliothek', 'повертати', 'повертаю|повертаєш|повертає|повертаємо|повертаєте|повертають', 'повернув|повернула|повернули', 'поверну|повернеш|поверне|повернемо|повернете|повернуть', 'книжку в бібліотеці'],
    ['umtauschen', 'die zu kleine Jacke', 'обмінювати', 'обмінюю|обмінюєш|обмінює|обмінюємо|обмінюєте|обмінюють', 'обміняв|обміняла|обміняли', 'обміняю|обміняєш|обміняє|обміняємо|обміняєте|обміняють', 'замалу куртку'],
    ['auswählen', 'ein Geschenk für die Mutter', 'вибирати', 'вибираю|вибираєш|вибирає|вибираємо|вибираєте|вибирають', 'вибрав|вибрала|вибрали', 'виберу|вибереш|вибере|виберемо|виберете|виберуть', 'подарунок для мами'],
    ['anfangen', 'mit den Hausaufgaben', 'починати', 'починаю|починаєш|починає|починаємо|починаєте|починають', 'почав|почала|почали', 'почну|почнеш|почне|почнемо|почнете|почнуть', 'виконувати домашнє завдання'],
    ['beginnen', 'mit der Arbeit am Bericht', 'починати', 'починаю|починаєш|починає|починаємо|починаєте|починають', 'почав|почала|почали', 'почну|почнеш|почне|почнемо|почнете|почнуть', 'працювати над звітом'],
    ['beenden', 'die Arbeit am Projekt', 'завершувати', 'завершую|завершуєш|завершує|завершуємо|завершуєте|завершують', 'завершив|завершила|завершили', 'завершу|завершиш|завершить|завершимо|завершите|завершать', 'роботу над проєктом'],
    ['aufstehen', 'früh am Morgen', 'вставати', 'встаю|встаєш|встає|встаємо|встаєте|встають', 'встав|встала|встали', 'встану|встанеш|встане|встанемо|встанете|встануть', 'рано вранці'],
    ['aufwachen', 'durch den Lärm', 'прокидатися', 'прокидаюся|прокидаєшся|прокидається|прокидаємося|прокидаєтеся|прокидаються', 'прокинувся|прокинулася|прокинулися', 'прокинуся|прокинешся|прокинеться|прокинемося|прокинетеся|прокинуться', 'від шуму'],
    ['ankommen', 'am Hauptbahnhof', 'прибувати', 'прибуваю|прибуваєш|прибуває|прибуваємо|прибуваєте|прибувають', 'прибув|прибула|прибули', 'прибуду|прибудеш|прибуде|прибудемо|прибудете|прибудуть', 'на головний вокзал'],
    ['abfahren', 'mit dem ersten Zug', 'вирушати', 'вирушаю|вирушаєш|вирушає|вирушаємо|вирушаєте|вирушають', 'вирушив|вирушила|вирушили', 'вирушу|вирушиш|вирушить|вирушимо|вирушите|вирушать', 'першим потягом'],
    ['einsteigen', 'in den Zug nach Hamburg', 'сідати', 'сідаю|сідаєш|сідає|сідаємо|сідаєте|сідають', 'сів|сіла|сіли', 'сяду|сядеш|сяде|сядемо|сядете|сядуть', 'у потяг до Гамбурга'],
    ['aussteigen', 'an der nächsten Haltestelle', 'виходити', 'виходжу|виходиш|виходить|виходимо|виходите|виходять', 'вийшов|вийшла|вийшли', 'вийду|вийдеш|вийде|вийдемо|вийдете|вийдуть', 'на наступній зупинці'],
    ['umsteigen', 'in Hannover', 'пересідати', 'пересідаю|пересідаєш|пересідає|пересідаємо|пересідаєте|пересідають', 'пересів|пересіла|пересіли', 'пересяду|пересядеш|пересяде|пересядемо|пересядете|пересядуть', 'на інший транспорт у Ганновері'],
    ['zurückkommen', 'von der Dienstreise', 'повертатися', 'повертаюся|повертаєшся|повертається|повертаємося|повертаєтеся|повертаються', 'повернувся|повернулася|повернулися', 'повернуся|повернешся|повернеться|повернемося|повернетеся|повернуться', 'з відрядження'],
    ['gehen', 'zum Arzt', 'йти', 'йду|йдеш|йде|йдемо|йдете|йдуть', 'пішов|пішла|пішли', 'піду|підеш|піде|підемо|підете|підуть', 'до лікаря'],
    ['fahren', 'mit dem Bus ins Stadtzentrum', 'їхати', 'їду|їдеш|їде|їдемо|їдете|їдуть', 'поїхав|поїхала|поїхали', 'поїду|поїдеш|поїде|поїдемо|поїдете|поїдуть', 'автобусом до центру міста'],
    ['fliegen', 'nach München', 'летіти', 'лечу|летиш|летить|летимо|летите|летять', 'полетів|полетіла|полетіли', 'полечу|полетиш|полетить|полетимо|полетите|полетять', 'до Мюнхена'],
    ['laufen', 'bis zum Bahnhof', 'бігти', 'біжу|біжиш|біжить|біжимо|біжите|біжать', 'добіг|добігла|добігли', 'добіжу|добіжиш|добіжить|добіжимо|добіжите|добіжать', 'до вокзалу'],
    ['reisen', 'nach Österreich', 'подорожувати', 'подорожую|подорожуєш|подорожує|подорожуємо|подорожуєте|подорожують', 'вирушив|вирушила|вирушили', 'вирушу|вирушиш|вирушить|вирушимо|вирушите|вирушать', 'до Австрії'],
    ['umziehen', 'in eine größere Wohnung', 'переїжджати', 'переїжджаю|переїжджаєш|переїжджає|переїжджаємо|переїжджаєте|переїжджають', 'переїхав|переїхала|переїхали', 'переїду|переїдеш|переїде|переїдемо|переїдете|переїдуть', 'до більшої квартири'],
    ['einziehen', 'in das neue Haus', 'вселятися', 'вселяюся|вселяєшся|вселяється|вселяємося|вселяєтеся|вселяються', 'вселився|вселилася|вселилися', 'вселюся|вселишся|вселиться|вселимося|вселитеся|вселяться', 'в новий будинок'],
    ['ausziehen', 'aus der alten Wohnung', 'виселятися', 'виселяюся|виселяєшся|виселяється|виселяємося|виселяєтеся|виселяються', 'виселився|виселилася|виселилися', 'виселюся|виселишся|виселиться|виселимося|виселитеся|виселяться', 'зі старої квартири'],
    ['messen', 'den Blutdruck', 'вимірювати', 'вимірюю|вимірюєш|вимірює|вимірюємо|вимірюєте|вимірюють', 'виміряв|виміряла|виміряли', 'виміряю|виміряєш|виміряє|виміряємо|виміряєте|виміряють', 'артеріальний тиск'],
    ['untersuchen', 'den verletzten Arm', 'оглядати', 'оглядаю|оглядаєш|оглядає|оглядаємо|оглядаєте|оглядають', 'оглянув|оглянула|оглянули', 'огляну|оглянеш|огляне|оглянемо|оглянете|оглянуть', 'травмовану руку'],
    ['vereinbaren', 'einen Termin beim Zahnarzt', 'узгоджувати', 'узгоджую|узгоджуєш|узгоджує|узгоджуємо|узгоджуєте|узгоджують', 'узгодив|узгодила|узгодили', 'узгоджу|узгодиш|узгодить|узгодимо|узгодите|узгодять', 'час прийому в стоматолога'],
    ['versorgen', 'die kleine Wunde', 'обробляти', 'обробляю|обробляєш|обробляє|обробляємо|обробляєте|обробляють', 'обробив|обробила|обробили', 'оброблю|обробиш|обробить|обробимо|обробите|оброблять', 'невелику рану'],
    ['überweisen', 'die Miete auf das Konto des Vermieters', 'переказувати', 'переказую|переказуєш|переказує|переказуємо|переказуєте|переказують', 'переказав|переказала|переказали', 'перекажу|перекажеш|перекаже|перекажемо|перекажете|перекажуть', 'орендну плату на рахунок орендодавця'],
    ['ausgeben', 'fünf Euro für das Mittagessen', 'витрачати', 'витрачаю|витрачаєш|витрачає|витрачаємо|витрачаєте|витрачають', 'витратив|витратила|витратили', 'витрачу|витратиш|витратить|витратимо|витратите|витратять', 'п’ять євро на обід'],
    ['essen', 'eine Portion Reis', 'їсти', 'їм|їси|їсть|їмо|їсте|їдять', 'з’їв|з’їла|з’їли', 'з’їм|з’їси|з’їсть|з’їмо|з’їсте|з’їдять', 'порцію рису'],
    ['trinken', 'eine Tasse Kräutertee', 'пити', 'п’ю|п’єш|п’є|п’ємо|п’єте|п’ють', 'випив|випила|випили', 'вип’ю|вип’єш|вип’є|вип’ємо|вип’єте|вип’ють', 'чашку трав’яного чаю']
  ];

  function add(id, sentence, answers, row, translation, level, explanation, alternatives) {
    const [inf, tail, ukrainianInfinitive, , , , ukrainianTail] = row;
    const exercise = {
      sentence, answers, answer: answers.join(' '),
      infinitive: `${inf} · ${tail}`, ua_infinitiv: `${ukrainianInfinitive} ${ukrainianTail}`,
      ua_sentence: translation, level, explanation
    };
    if (alternatives && alternatives.length) exercise.alternatives = alternatives;
    result[id].push(exercise);
  }
  for (const row of rows) {
    const [inf, tail, ukrainianInfinitive, present, past, future, ukrainianTail] = row;
    const verb = verbs[inf];
    const ukPresent = split(present), ukPast = split(past), ukFuture = split(future);
    const usesBe = verb.auxiliary === 'sein';
    for (let person = 0; person < 6; person++) {
      const subject = subjects[person], ukSubject = ukrainianSubjects[person];
      const pastTranslation = person < 2 ? `${ukPast[0]}/${ukPast[1]}` : person === 2 ? ukPast[0] : ukPast[2];
      const prefixBlanks = verb.prefix ? ' ___' : '';
      const finiteAnswers = form => verb.prefix ? [form, verb.prefix] : [form];
      const personNote = person === 5 ? ' Sie тут означає «вони» (множина).' : person === 4 ? ' Ihr тут означає «ви» (неформальна множина).' : '';
      const genderNote = person < 2 ? ' У перекладі минулого часу через / наведено чоловічу та жіночу форми.' : '';
      const prefixNote = verb.prefix ? ` Відокремлюваний префікс ${verb.prefix} стоїть у кінці головного речення.` : '';
      const presentAlts = (verb.presentAlternatives?.[person] || []).map(finiteAnswers);
      const pastAlts = (verb.pastAlternatives?.[person] || []).map(finiteAnswers);
      add('praesens', `${subject} ___ ${tail}${prefixBlanks}.`, finiteAnswers(verb.present[person]), row,
        `${ukSubject} ${ukPresent[person]} ${ukrainianTail}.`, 'A1',
        `Präsens: ${subject.toLowerCase()} ${verb.present[person]}${verb.prefix ? ' … ' + verb.prefix : ''}.${prefixNote}${personNote}`, presentAlts);
      add('perfekt', `${subject} ___ ${tail} ___.`, [(usesBe ? be : have)[person], verb.participle], row,
        `${ukSubject} ${pastTranslation} ${ukrainianTail}.`, 'A2',
        `Perfekt: ${verb.auxiliary} у Präsens + Partizip II (${verb.participle}).${personNote}${genderNote}`);
      add('praeteritum', `${subject} ___ ${tail}${prefixBlanks}.`, finiteAnswers(verb.past[person]), row,
        `${ukSubject} ${pastTranslation} ${ukrainianTail}.`, 'B1',
        `Präteritum: ${subject.toLowerCase()} ${verb.past[person]}${verb.prefix ? ' … ' + verb.prefix : ''}.${prefixNote}${personNote}${genderNote}`, pastAlts);
      add('plusquamperfekt', `${subject} ___ schon ${tail} ___, als der Tag zu Ende ging.`, [(usesBe ? was : had)[person], verb.participle], row,
        `${ukSubject} вже ${pastTranslation} ${ukrainianTail}, коли день добігав кінця.`, 'B1',
        `Plusquamperfekt: ${verb.auxiliary} у Präteritum + ${verb.participle}; дія передувала вказаному моменту в минулому.${personNote}${genderNote}`);
      add('futur1', `${subject} ___ ${tail} ___.`, [will[person], inf], row,
        `${ukSubject} ${['буду', 'будеш', 'буде', 'будемо', 'будете', 'будуть'][person]} ${ukrainianInfinitive} ${ukrainianTail}.`, 'B1',
        `Futur I: werden у відповідній особі + інфінітив ${inf} у кінці речення.${personNote}`);
      add('futur2', `${subject} ___ bis morgen Abend ${tail} ___ ___.`, [will[person], verb.participle, verb.auxiliary], row,
        `${ukSubject} до завтрашнього вечора вже ${ukFuture[person]} ${ukrainianTail}.`, 'B2',
        `Futur II: werden + ${verb.participle} + ${verb.auxiliary}. Дія завершиться до завтрашнього вечора.${personNote}`);
    }
  }
  return result;
})();
