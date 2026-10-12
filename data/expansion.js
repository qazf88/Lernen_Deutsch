/*
 * Додаткові вправи: кожна відповідь відповідає рівно одному пропуску ___.
 * Парадигми та українські форми задано явно: випадкових комбінацій немає.
 * Рівень визначає граматична конструкція, а не порядковий номер вправи.
 */
const extra_exercises = (() => {
  const article = {
    m: { nom: 'der', akk: 'den', dat: 'dem', gen: 'des' },
    f: { nom: 'die', akk: 'die', dat: 'der', gen: 'der' },
    n: { nom: 'das', akk: 'das', dat: 'dem', gen: 'des' }
  };

  // gender | singular | plural | genitive | Ukrainian nominative |
  // Ukrainian accusative | Ukrainian genitive | Ukrainian instrumental |
  // optional German accusative/dative (weak nouns).
  const vocabulary = {
    people: [
      ['m', 'Mann', 'Männer', 'Mannes', 'чоловік', 'чоловіка', 'чоловіка', 'чоловіком'],
      ['f', 'Frau', 'Frauen', 'Frau', 'жінка', 'жінку', 'жінки', 'жінкою'],
      ['n', 'Kind', 'Kinder', 'Kindes', 'дитина', 'дитину', 'дитини', 'дитиною'],
      ['m', 'Vater', 'Väter', 'Vaters', 'батько', 'батька', 'батька', 'батьком'],
      ['f', 'Mutter', 'Mütter', 'Mutter', 'мати', 'матір', 'матері', 'матір’ю'],
      ['m', 'Sohn', 'Söhne', 'Sohnes', 'син', 'сина', 'сина', 'сином'],
      ['f', 'Tochter', 'Töchter', 'Tochter', 'донька', 'доньку', 'доньки', 'донькою'],
      ['m', 'Bruder', 'Brüder', 'Bruders', 'брат', 'брата', 'брата', 'братом'],
      ['f', 'Schwester', 'Schwestern', 'Schwester', 'сестра', 'сестру', 'сестри', 'сестрою'],
      ['m', 'Großvater', 'Großväter', 'Großvaters', 'дідусь', 'дідуся', 'дідуся', 'дідусем'],
      ['f', 'Großmutter', 'Großmütter', 'Großmutter', 'бабуся', 'бабусю', 'бабусі', 'бабусею'],
      ['m', 'Freund', 'Freunde', 'Freundes', 'друг', 'друга', 'друга', 'другом'],
      ['f', 'Freundin', 'Freundinnen', 'Freundin', 'подруга', 'подругу', 'подруги', 'подругою'],
      ['m', 'Lehrer', 'Lehrer', 'Lehrers', 'учитель', 'учителя', 'учителя', 'учителем'],
      ['f', 'Lehrerin', 'Lehrerinnen', 'Lehrerin', 'учителька', 'учительку', 'учительки', 'учителькою'],
      ['m', 'Arzt', 'Ärzte', 'Arztes', 'лікар', 'лікаря', 'лікаря', 'лікарем'],
      ['f', 'Ärztin', 'Ärztinnen', 'Ärztin', 'лікарка', 'лікарку', 'лікарки', 'лікаркою'],
      ['m', 'Student', 'Studenten', 'Studenten', 'студент', 'студента', 'студента', 'студентом', 'Studenten'],
      ['f', 'Studentin', 'Studentinnen', 'Studentin', 'студентка', 'студентку', 'студентки', 'студенткою'],
      ['m', 'Nachbar', 'Nachbarn', 'Nachbarn', 'сусід', 'сусіда', 'сусіда', 'сусідом', 'Nachbarn'],
      ['f', 'Nachbarin', 'Nachbarinnen', 'Nachbarin', 'сусідка', 'сусідку', 'сусідки', 'сусідкою'],
      ['m', 'Kollege', 'Kollegen', 'Kollegen', 'колега', 'колегу', 'колеги', 'колегою', 'Kollegen'],
      ['f', 'Kollegin', 'Kolleginnen', 'Kollegin', 'колега', 'колегу', 'колеги', 'колегою'],
      ['m', 'Junge', 'Jungen', 'Jungen', 'хлопчик', 'хлопчика', 'хлопчика', 'хлопчиком', 'Jungen'],
      ['n', 'Mädchen', 'Mädchen', 'Mädchens', 'дівчинка', 'дівчинку', 'дівчинки', 'дівчинкою'],
      ['m', 'Verkäufer', 'Verkäufer', 'Verkäufers', 'продавець', 'продавця', 'продавця', 'продавцем'],
      ['f', 'Verkäuferin', 'Verkäuferinnen', 'Verkäuferin', 'продавчиня', 'продавчиню', 'продавчині', 'продавчинею'],
      ['m', 'Fahrer', 'Fahrer', 'Fahrers', 'водій', 'водія', 'водія', 'водієм'],
      ['f', 'Fahrerin', 'Fahrerinnen', 'Fahrerin', 'водійка', 'водійку', 'водійки', 'водійкою'],
      ['m', 'Gast', 'Gäste', 'Gastes', 'гість', 'гостя', 'гостя', 'гостем']
    ],
    furniture: [
      ['m', 'Tisch', 'Tische', 'Tisches', 'стіл', 'стіл', 'столу', 'столом'],
      ['m', 'Stuhl', 'Stühle', 'Stuhles', 'стілець', 'стілець', 'стільця', 'стільцем'],
      ['m', 'Sessel', 'Sessel', 'Sessels', 'крісло', 'крісло', 'крісла', 'кріслом'],
      ['n', 'Sofa', 'Sofas', 'Sofas', 'диван', 'диван', 'дивана', 'диваном'],
      ['m', 'Schrank', 'Schränke', 'Schrankes', 'шафа', 'шафу', 'шафи', 'шафою'],
      ['n', 'Regal', 'Regale', 'Regals', 'стелаж', 'стелаж', 'стелажа', 'стелажем'],
      ['n', 'Bett', 'Betten', 'Bettes', 'ліжко', 'ліжко', 'ліжка', 'ліжком'],
      ['f', 'Kommode', 'Kommoden', 'Kommode', 'комод', 'комод', 'комода', 'комодом'],
      ['m', 'Schreibtisch', 'Schreibtische', 'Schreibtisches', 'письмовий стіл', 'письмовий стіл', 'письмового столу', 'письмовим столом'],
      ['n', 'Bücherregal', 'Bücherregale', 'Bücherregals', 'книжковий стелаж', 'книжковий стелаж', 'книжкового стелажа', 'книжковим стелажем'],
      ['f', 'Lampe', 'Lampen', 'Lampe', 'лампа', 'лампу', 'лампи', 'лампою'],
      ['m', 'Spiegel', 'Spiegel', 'Spiegels', 'дзеркало', 'дзеркало', 'дзеркала', 'дзеркалом'],
      ['m', 'Teppich', 'Teppiche', 'Teppichs', 'килим', 'килим', 'килима', 'килимом'],
      ['m', 'Vorhang', 'Vorhänge', 'Vorhangs', 'штора', 'штору', 'штори', 'шторою'],
      ['n', 'Kissen', 'Kissen', 'Kissens', 'подушка', 'подушку', 'подушки', 'подушкою'],
      ['f', 'Decke', 'Decken', 'Decke', 'ковдра', 'ковдру', 'ковдри', 'ковдрою'],
      ['f', 'Matratze', 'Matratzen', 'Matratze', 'матрац', 'матрац', 'матраца', 'матрацом'],
      ['m', 'Hocker', 'Hocker', 'Hockers', 'табурет', 'табурет', 'табурета', 'табуретом'],
      ['f', 'Bank', 'Bänke', 'Bank', 'лава', 'лаву', 'лави', 'лавою'],
      ['m', 'Nachttisch', 'Nachttische', 'Nachttisches', 'приліжковий столик', 'приліжковий столик', 'приліжкового столика', 'приліжковим столиком']
    ],
    places: [
      ['m', 'Bahnhof', 'Bahnhöfe', 'Bahnhofs', 'вокзал', 'вокзал', 'вокзалу', 'вокзалом'],
      ['m', 'Flughafen', 'Flughäfen', 'Flughafens', 'аеропорт', 'аеропорт', 'аеропорту', 'аеропортом'],
      ['m', 'Supermarkt', 'Supermärkte', 'Supermarktes', 'супермаркет', 'супермаркет', 'супермаркету', 'супермаркетом'],
      ['m', 'Laden', 'Läden', 'Ladens', 'крамниця', 'крамницю', 'крамниці', 'крамницею'],
      ['m', 'Markt', 'Märkte', 'Marktes', 'ринок', 'ринок', 'ринку', 'ринком'],
      ['m', 'Park', 'Parks', 'Parks', 'парк', 'парк', 'парку', 'парком'],
      ['m', 'Garten', 'Gärten', 'Gartens', 'сад', 'сад', 'саду', 'садом'],
      ['m', 'Kindergarten', 'Kindergärten', 'Kindergartens', 'дитячий садок', 'дитячий садок', 'дитячого садка', 'дитячим садком'],
      ['f', 'Schule', 'Schulen', 'Schule', 'школа', 'школу', 'школи', 'школою'],
      ['f', 'Universität', 'Universitäten', 'Universität', 'університет', 'університет', 'університету', 'університетом'],
      ['f', 'Bibliothek', 'Bibliotheken', 'Bibliothek', 'бібліотека', 'бібліотеку', 'бібліотеки', 'бібліотекою'],
      ['f', 'Apotheke', 'Apotheken', 'Apotheke', 'аптека', 'аптеку', 'аптеки', 'аптекою'],
      ['f', 'Kirche', 'Kirchen', 'Kirche', 'церква', 'церкву', 'церкви', 'церквою'],
      ['f', 'Brücke', 'Brücken', 'Brücke', 'міст', 'міст', 'мосту', 'мостом'],
      ['f', 'Straße', 'Straßen', 'Straße', 'вулиця', 'вулицю', 'вулиці', 'вулицею'],
      ['n', 'Haus', 'Häuser', 'Hauses', 'будинок', 'будинок', 'будинку', 'будинком'],
      ['n', 'Hotel', 'Hotels', 'Hotels', 'готель', 'готель', 'готелю', 'готелем'],
      ['n', 'Museum', 'Museen', 'Museums', 'музей', 'музей', 'музею', 'музеєм'],
      ['n', 'Krankenhaus', 'Krankenhäuser', 'Krankenhauses', 'лікарня', 'лікарню', 'лікарні', 'лікарнею'],
      ['n', 'Rathaus', 'Rathäuser', 'Rathauses', 'ратуша', 'ратушу', 'ратуші', 'ратушею']
    ],
    food: [
      ['m', 'Apfel', 'Äpfel', 'Apfels', 'яблуко', 'яблуко', 'яблука', 'яблуком'],
      ['f', 'Birne', 'Birnen', 'Birne', 'груша', 'грушу', 'груші', 'грушею'],
      ['f', 'Banane', 'Bananen', 'Banane', 'банан', 'банан', 'банана', 'бананом'],
      ['f', 'Orange', 'Orangen', 'Orange', 'апельсин', 'апельсин', 'апельсина', 'апельсином'],
      ['f', 'Zitrone', 'Zitronen', 'Zitrone', 'лимон', 'лимон', 'лимона', 'лимоном'],
      ['f', 'Kartoffel', 'Kartoffeln', 'Kartoffel', 'картоплина', 'картоплину', 'картоплини', 'картоплиною'],
      ['f', 'Tomate', 'Tomaten', 'Tomate', 'помідор', 'помідор', 'помідора', 'помідором'],
      ['f', 'Gurke', 'Gurken', 'Gurke', 'огірок', 'огірок', 'огірка', 'огірком'],
      ['f', 'Karotte', 'Karotten', 'Karotte', 'морквина', 'морквину', 'морквини', 'морквиною'],
      ['f', 'Zwiebel', 'Zwiebeln', 'Zwiebel', 'цибулина', 'цибулину', 'цибулини', 'цибулиною'],
      ['n', 'Ei', 'Eier', 'Eies', 'яйце', 'яйце', 'яйця', 'яйцем'],
      ['n', 'Brot', 'Brote', 'Brotes', 'буханець хліба', 'буханець хліба', 'буханця хліба', 'буханцем хліба'],
      ['n', 'Brötchen', 'Brötchen', 'Brötchens', 'булочка', 'булочку', 'булочки', 'булочкою'],
      ['m', 'Kuchen', 'Kuchen', 'Kuchens', 'пиріг', 'пиріг', 'пирога', 'пирогом'],
      ['m', 'Keks', 'Kekse', 'Kekses', 'печиво', 'печиво', 'печива', 'печивом'],
      ['m', 'Pfirsich', 'Pfirsiche', 'Pfirsichs', 'персик', 'персик', 'персика', 'персиком'],
      ['f', 'Erdbeere', 'Erdbeeren', 'Erdbeere', 'полуниця', 'полуницю', 'полуниці', 'полуницею'],
      ['f', 'Nuss', 'Nüsse', 'Nuss', 'горіх', 'горіх', 'горіха', 'горіхом'],
      ['m', 'Pilz', 'Pilze', 'Pilzes', 'гриб', 'гриб', 'гриба', 'грибом'],
      ['f', 'Pflaume', 'Pflaumen', 'Pflaume', 'слива', 'сливу', 'сливи', 'сливою']
    ],
    animals: [
      ['m', 'Hund', 'Hunde', 'Hundes', 'собака', 'собаку', 'собаки', 'собакою'],
      ['f', 'Katze', 'Katzen', 'Katze', 'кішка', 'кішку', 'кішки', 'кішкою'],
      ['n', 'Pferd', 'Pferde', 'Pferdes', 'кінь', 'коня', 'коня', 'конем'],
      ['f', 'Kuh', 'Kühe', 'Kuh', 'корова', 'корову', 'корови', 'коровою'],
      ['n', 'Schaf', 'Schafe', 'Schafes', 'вівця', 'вівцю', 'вівці', 'вівцею'],
      ['f', 'Ziege', 'Ziegen', 'Ziege', 'коза', 'козу', 'кози', 'козою'],
      ['n', 'Schwein', 'Schweine', 'Schweines', 'свиня', 'свиню', 'свині', 'свинею'],
      ['n', 'Huhn', 'Hühner', 'Huhnes', 'курка', 'курку', 'курки', 'куркою'],
      ['f', 'Ente', 'Enten', 'Ente', 'качка', 'качку', 'качки', 'качкою'],
      ['f', 'Gans', 'Gänse', 'Gans', 'гуска', 'гуску', 'гуски', 'гускою'],
      ['m', 'Esel', 'Esel', 'Esels', 'осел', 'осла', 'осла', 'ослом'],
      ['n', 'Kaninchen', 'Kaninchen', 'Kaninchens', 'кролик', 'кролика', 'кролика', 'кроликом'],
      ['m', 'Hamster', 'Hamster', 'Hamsters', 'хом’як', 'хом’яка', 'хом’яка', 'хом’яком'],
      ['f', 'Maus', 'Mäuse', 'Maus', 'миша', 'мишу', 'миші', 'мишею'],
      ['f', 'Ratte', 'Ratten', 'Ratte', 'пацюк', 'пацюка', 'пацюка', 'пацюком'],
      ['f', 'Schildkröte', 'Schildkröten', 'Schildkröte', 'черепаха', 'черепаху', 'черепахи', 'черепахою'],
      ['m', 'Vogel', 'Vögel', 'Vogels', 'птах', 'птаха', 'птаха', 'птахом'],
      ['m', 'Fisch', 'Fische', 'Fisches', 'риба', 'рибу', 'риби', 'рибою'],
      ['m', 'Hase', 'Hasen', 'Hasen', 'заєць', 'зайця', 'зайця', 'зайцем', 'Hasen'],
      ['m', 'Löwe', 'Löwen', 'Löwen', 'лев', 'лева', 'лева', 'левом', 'Löwen']
    ]
  };

  const result = [];
  const addSet = (id, name, group, desc) => {
    const set = { id, name, group, desc, data: [] };
    result.push(set);
    return set.data;
  };
  const add = (data, sentence, answers, infinitive, ua_infinitiv, ua_sentence, level, explanation, alternatives) => {
    const exercise = { sentence, answers, answer: answers.join(' '), infinitive, ua_infinitiv, ua_sentence, level, explanation };
    if (alternatives) exercise.alternatives = alternatives;
    data.push(exercise);
  };
  const cases = {
    nom: addSet('case_nominativ', 'Nominativ · хто? що?', 'Відмінки', 'Впиши означений артикль: der, die або das. Іменник є підметом у називному відмінку.'),
    akk: addSet('case_akkusativ', 'Akkusativ · кого? що?', 'Відмінки', 'Впиши означений артикль в Akkusativ. Зверни увагу на чоловічий рід.'),
    dat: addSet('case_dativ', 'Dativ · кому? чому?', 'Відмінки', 'Впиши означений артикль у Dativ. Звертай увагу на керування дієслова чи прийменника.'),
    gen: addSet('case_genitiv', 'Genitiv · чий? кого?', 'Відмінки', 'Впиши означений артикль у Genitiv: des або der. Відмінену форму іменника вже наведено.')
  };
  const plurals = addSet('noun_plurals', 'Множина іменників', 'Іменники та словник', 'Запиши лише форму множини поданого іменника. Усі слова в цій вправі вживаються з die.');
  const explanations = {
    nom: 'Підмет стоїть у Nominativ. Означені артиклі: чоловічий рід der, жіночий die, середній das.',
    akk: 'Прямий додаток стоїть в Akkusativ. Означені артиклі: чоловічий рід den, жіночий die, середній das.',
    dat: 'Після mit, nach і von вживається Dativ. Означені артиклі: чоловічий і середній рід dem, жіночий der.',
    gen: 'Genitiv виражає належність або зв’язок. Артиклі: чоловічий і середній рід des, жіночий der.'
  };
  const upper = text => text.charAt(0).toUpperCase() + text.slice(1);

  for (const [category, entries] of Object.entries(vocabulary)) {
    for (const [gender, noun, plural, genitive, ua, uaAkk, uaGen, uaIns, weak] of entries) {
      const oblique = weak || noun;
      let sentences;
      if (category === 'people') {
        sentences = {
          nom: [`___ ${noun} wartet vor dem Haus.`, `${upper(ua)} чекає перед будинком.`],
          akk: [`Ich sehe ___ ${oblique} vor dem Haus.`, `Я бачу ${uaAkk} перед будинком.`],
          dat: [`Ich spreche mit ___ ${oblique}.`, `Я розмовляю з ${uaIns}.`],
          gen: [`Das ist die Tasche ___ ${genitive}.`, `Це сумка ${uaGen}.`]
        };
      } else if (category === 'furniture') {
        sentences = {
          nom: [`___ ${noun} gefällt mir.`, `Мені подобається ${ua}.`],
          akk: [`Wir kaufen ___ ${noun} für unsere Wohnung.`, `Ми купуємо ${uaAkk} для нашої квартири.`],
          dat: [`Wir suchen nach ___ ${noun}.`, `Ми шукаємо ${uaAkk}.`],
          gen: [`Der Preis ___ ${genitive} ist niedrig.`, `Ціна ${uaGen} низька.`]
        };
      } else if (category === 'places') {
        sentences = {
          nom: [`___ ${noun} ist in unserer Stadt.`, `У нашому місті є ${ua}.`],
          akk: [`Auf dem Stadtplan finden wir ___ ${noun}.`, `На плані міста ми знаходимо ${uaAkk}.`],
          dat: [`Wir machen ein Foto von ___ ${noun}.`, `Ми робимо фото ${uaGen}.`],
          gen: [`Das ist ein Foto ___ ${genitive}.`, `Це фото ${uaGen}.`]
        };
      } else if (category === 'food') {
        sentences = {
          nom: [`___ ${noun} ist auf dem Foto zu sehen.`, `На фото можна побачити ${uaAkk}.`],
          akk: [`Ich kaufe ___ ${noun} auf dem Markt.`, `Я купую ${uaAkk} на ринку.`],
          dat: [`Ich mache ein Foto von ___ ${noun}.`, `Я роблю фото ${uaGen}.`],
          gen: [`Der Geschmack ___ ${genitive} gefällt mir.`, `Мені подобається смак ${uaGen}.`]
        };
      } else {
        sentences = {
          nom: [`___ ${noun} ist auf dem Foto zu sehen.`, `На фото можна побачити ${uaAkk}.`],
          akk: [`Auf dem Foto sehe ich ___ ${oblique}.`, `На фото я бачу ${uaAkk}.`],
          dat: [`Ich sehe ein Foto mit ___ ${oblique}.`, `Я бачу фото з ${uaIns}.`],
          gen: [`Das ist ein Foto ___ ${genitive}.`, `Це фото ${uaGen}.`]
        };
      }
      for (const [grammaticalCase, [sentence, translation]] of Object.entries(sentences)) {
        const answer = grammaticalCase === 'nom' ? upper(article[gender].nom) : article[gender][grammaticalCase];
        add(cases[grammaticalCase], sentence, [answer], noun, ua, translation,
          grammaticalCase === 'gen' ? 'B1' : grammaticalCase === 'dat' ? 'A2' : 'A1', explanations[grammaticalCase]);
      }
      add(plurals, `${noun} → die ___`, [plural], noun, ua,
        `Утвори множину слова «${ua}».`, 'A1', `Множина: die ${plural}. Запам’ятовуй слово разом з артиклем і формою множини.`);
    }
  }

  // Explicitly written contexts train forms beyond choosing an article.
  const prepositions = addSet('prepositions_cases', 'Прийменники та відмінки', 'Прийменники', 'Впиши означені артиклі. Для Wechselpräpositionen розрізняй місце (wo? → Dativ) і напрямок (wohin? → Akkusativ). В останніх реченнях є кілька пропусків.');
  const prepRows = [
    ['Ich stelle die Tasse auf ___ Tisch.', ['den'], 'auf · Tisch', 'на стіл', 'Я ставлю чашку на стіл.', 'A2', 'Куди? auf + Akkusativ: auf den Tisch.'],
    ['Die Tasse steht auf ___ Tisch.', ['dem'], 'auf · Tisch', 'на столі', 'Чашка стоїть на столі.', 'A2', 'Де? auf + Dativ: auf dem Tisch.'],
    ['Ich hänge das Bild an ___ Wand.', ['die'], 'an · Wand', 'на стіну', 'Я вішаю картину на стіну.', 'A2', 'Розміщення в новому місці: an + Akkusativ.'],
    ['Das Bild hängt an ___ Wand.', ['der'], 'an · Wand', 'на стіні', 'Картина висить на стіні.', 'A2', 'Місце: an + Dativ.'],
    ['Ich lege das Buch in ___ Schrank.', ['den'], 'in · Schrank', 'у шафу', 'Я кладу книжку в шафу.', 'A2', 'Куди? in den Schrank.'],
    ['Das Buch liegt in ___ Schrank.', ['dem'], 'in · Schrank', 'у шафі', 'Книжка лежить у шафі.', 'A2', 'Де? in dem Schrank. У цій вправі прийменник уже написано, тож впиши лише артикль.'],
    ['Die Katze läuft unter ___ Stuhl.', ['den'], 'unter · Stuhl', 'під стілець', 'Кішка забігає під стілець.', 'A2', 'Переклад задає напрямок під стілець: Akkusativ.'],
    ['Die Katze schläft unter ___ Stuhl.', ['dem'], 'unter · Stuhl', 'під стільцем', 'Кішка спить під стільцем.', 'A2', 'Місце перебування: Dativ.'],
    ['Wir hängen die Lampe über ___ Tisch.', ['den'], 'über · Tisch', 'над столом — розміщення', 'Ми вішаємо лампу над столом.', 'A2', 'Лампу переміщують у нове положення: über + Akkusativ.'],
    ['Die Lampe hängt über ___ Tisch.', ['dem'], 'über · Tisch', 'над столом — місце', 'Лампа висить над столом.', 'A2', 'Лампа вже перебуває в цьому місці: über + Dativ.'],
    ['Ich stelle den Koffer vor ___ Tür.', ['die'], 'vor · Tür', 'перед дверима — розміщення', 'Я ставлю валізу перед дверима.', 'A2', 'Куди ставлю? vor + Akkusativ.'],
    ['Der Koffer steht vor ___ Tür.', ['der'], 'vor · Tür', 'перед дверима — місце', 'Валіза стоїть перед дверима.', 'A2', 'Де стоїть? vor + Dativ.'],
    ['Wir fahren das Auto hinter ___ Haus.', ['das'], 'hinter · Haus', 'за будинок', 'Ми заїжджаємо автомобілем за будинок.', 'A2', 'Напрямок до нового місця: hinter + Akkusativ.'],
    ['Das Auto steht hinter ___ Haus.', ['dem'], 'hinter · Haus', 'за будинком', 'Автомобіль стоїть за будинком.', 'A2', 'Місце: hinter + Dativ.'],
    ['Ich lege den Teppich neben ___ Bett.', ['das'], 'neben · Bett', 'біля ліжка — розміщення', 'Я кладу килим біля ліжка.', 'A2', 'Куди кладу? neben + Akkusativ.'],
    ['Der Teppich liegt neben ___ Bett.', ['dem'], 'neben · Bett', 'біля ліжка — місце', 'Килим лежить біля ліжка.', 'A2', 'Де лежить? neben + Dativ.'],
    ['Wir stellen den Tisch zwischen ___ Sessel.', ['die'], 'zwischen · Sessel (Plural)', 'між кріслами — розміщення', 'Ми ставимо стіл між кріслами.', 'A2', 'Куди? Akkusativ множини: zwischen die Sessel.'],
    ['Der Tisch steht zwischen ___ Sesseln.', ['den'], 'zwischen · Sessel (Plural)', 'між кріслами — місце', 'Стіл стоїть між кріслами.', 'A2', 'Де? Dativ множини: den Sesseln, із додатковим -n в іменнику.'],
    ['Ich fahre mit ___ Bus zur Arbeit.', ['dem'], 'mit · Bus', 'автобусом', 'Я їду на роботу автобусом.', 'A1', 'mit завжди вимагає Dativ.'],
    ['Sie kommt aus ___ Schule.', ['der'], 'aus · Schule', 'зі школи', 'Вона йде зі школи.', 'A1', 'aus завжди вимагає Dativ.'],
    ['Wir wohnen bei ___ Großeltern.', ['den'], 'bei · Großeltern (Plural)', 'у дідуся та бабусі', 'Ми живемо в дідуся та бабусі.', 'A1', 'bei + Dativ; артикль множини den.'],
    ['Der Brief ist von ___ Lehrerin.', ['der'], 'von · Lehrerin', 'від учительки', 'Лист від учительки.', 'A1', 'von + Dativ; жіночий рід der.'],
    ['Seit ___ Sommer lerne ich Deutsch.', ['dem'], 'seit · Sommer', 'з літа', 'Я вивчаю німецьку з літа.', 'A2', 'seit вимагає Dativ.'],
    ['Nach ___ Prüfung fahren wir ans Meer.', ['der'], 'nach · Prüfung', 'після іспиту', 'Після іспиту ми їдемо на море.', 'A2', 'nach вимагає Dativ.'],
    ['Das Geschenk ist für ___ Kind.', ['das'], 'für · Kind', 'для дитини', 'Подарунок для дитини.', 'A1', 'für завжди вимагає Akkusativ.'],
    ['Ohne ___ Schlüssel kann ich die Tür nicht öffnen.', ['den'], 'ohne · Schlüssel', 'без ключа', 'Без ключа я не можу відчинити двері.', 'A2', 'ohne + Akkusativ; der Schlüssel → den Schlüssel.'],
    ['Wir gehen durch ___ Park.', ['den'], 'durch · Park', 'через парк', 'Ми йдемо через парк.', 'A1', 'durch завжди вимагає Akkusativ.'],
    ['Der Ball fliegt gegen ___ Wand.', ['die'], 'gegen · Wand', 'у стіну', 'М’яч летить у стіну.', 'A2', 'gegen завжди вимагає Akkusativ.'],
    ['Die Kinder laufen um ___ Haus.', ['das'], 'um · Haus', 'навколо будинку', 'Діти бігають навколо будинку.', 'A2', 'um завжди вимагає Akkusativ.'],
    ['Während ___ Unterrichts sprechen wir Deutsch.', ['des'], 'während · Unterricht', 'під час уроку', 'Під час уроку ми говоримо німецькою.', 'B1', 'У нормативному письмовому мовленні während вживається з Genitiv.'],
    ['Wegen ___ Regens bleiben wir zu Hause.', ['des'], 'wegen · Regen', 'через дощ', 'Через дощ ми залишаємося вдома.', 'B1', 'У цій вправі використовуємо письмову норму: wegen + Genitiv.'],
    ['Trotz ___ Kälte gehen wir spazieren.', ['der'], 'trotz · Kälte', 'попри холод', 'Попри холод ми йдемо гуляти.', 'B1', 'У цій вправі trotz + Genitiv; жіночий рід der.'],
    ['Außerhalb ___ Stadt ist es ruhiger.', ['der'], 'außerhalb · Stadt', 'за межами міста', 'За межами міста тихіше.', 'B1', 'außerhalb + Genitiv.'],
    ['Innerhalb ___ Hauses darf man nicht rauchen.', ['des'], 'innerhalb · Haus', 'усередині будинку', 'Усередині будинку не можна курити.', 'B1', 'innerhalb + Genitiv.'],
    ['Statt ___ Autos benutzen wir heute das Fahrrad.', ['des'], 'statt · Auto', 'замість автомобіля', 'Сьогодні замість автомобіля ми користуємося велосипедом.', 'B1', 'statt + Genitiv.'],
    ['Ich gehe in ___ Küche, nehme die Tasse aus ___ Schrank und stelle sie auf ___ Tisch.', ['die', 'dem', 'den'], 'Küche · Schrank · Tisch', 'кухня · шафа · стіл', 'Я йду на кухню, беру чашку із шафи й ставлю її на стіл.', 'B1', 'in die Küche — напрямок; aus dem Schrank — aus + Dativ; auf den Tisch — напрямок.'],
    ['Die Jacke hängt an ___ Tür, die Schuhe stehen unter ___ Bank und die Tasche liegt neben ___ Stuhl.', ['der', 'der', 'dem'], 'Tür · Bank · Stuhl', 'двері · лава · стілець', 'Куртка висить на дверях, взуття стоїть під лавою, а сумка лежить біля стільця.', 'B1', 'Усі три частини відповідають на питання wo?, тому потрібен Dativ.'],
    ['Ich fahre mit ___ Zug zu ___ Freunden.', ['dem', 'den'], 'Zug · Freunde (Plural)', 'потяг · друзі', 'Я їду потягом до друзів.', 'A2', 'mit і zu вимагають Dativ; множина: zu den Freunden.']
  ];
  prepRows.forEach(row => add(prepositions, ...row));

  const adjectives = addSet('adjective_endings', 'Прикметники · закінчення', 'Прикметники', 'Впиши повну відмінену форму прикметника. Зважай на артикль, рід, число та відмінок; у змішаних реченнях слова подано в порядку пропусків.');
  const adjectiveRows = [
    ['Der ___ Hund schläft.', ['kleine'], 'klein', 'маленький', 'Маленький собака спить.', 'A2', 'Після der у Nominativ однини прикметник має -e.'],
    ['Die ___ Tasche ist teuer.', ['rote'], 'rot', 'червоний', 'Червона сумка дорога.', 'A2', 'Після die у Nominativ жіночого роду: -e.'],
    ['Das ___ Auto gehört mir.', ['neue'], 'neu', 'новий', 'Новий автомобіль належить мені.', 'A2', 'Після das у Nominativ середнього роду: -e.'],
    ['Die ___ Kinder spielen draußen.', ['kleinen'], 'klein', 'маленький', 'Маленькі діти граються надворі.', 'A2', 'Після означеного артикля у множині: -en.'],
    ['Ich sehe den ___ Mann.', ['alten'], 'alt', 'літній', 'Я бачу літнього чоловіка.', 'A2', 'Після den в Akkusativ чоловічого роду: -en.'],
    ['Wir besuchen die ___ Schule.', ['neue'], 'neu', 'новий', 'Ми відвідуємо нову школу.', 'A2', 'Після die в Akkusativ жіночого роду: -e.'],
    ['Er liest das ___ Buch.', ['spannende'], 'spannend', 'захопливий', 'Він читає захопливу книжку.', 'A2', 'Після das в Akkusativ середнього роду: -e.'],
    ['Ich helfe dem ___ Kind.', ['müden'], 'müde', 'втомлений', 'Я допомагаю втомленій дитині.', 'A2', 'helfen вимагає Dativ; після dem закінчення -en.'],
    ['Sie spricht mit der ___ Nachbarin.', ['freundlichen'], 'freundlich', 'привітний', 'Вона розмовляє з привітною сусідкою.', 'A2', 'mit + Dativ; після der закінчення -en.'],
    ['Wir spielen mit den ___ Hunden.', ['jungen'], 'jung', 'молодий', 'Ми граємося з молодими собаками.', 'A2', 'Dativ множини з означеним артиклем: -en.'],
    ['Das ist ein ___ Tag.', ['schöner'], 'schön', 'гарний', 'Це гарний день.', 'A2', 'Після ein без закінчення рід позначає прикметник: schöner.'],
    ['Hier steht eine ___ Lampe.', ['alte'], 'alt', 'старий', 'Тут стоїть стара лампа.', 'A2', 'Після eine у Nominativ жіночого роду: -e.'],
    ['Das ist ein ___ Zimmer.', ['helles'], 'hell', 'світлий', 'Це світла кімната.', 'A2', 'Після ein у Nominativ середнього роду: -es.'],
    ['Ich brauche einen ___ Mantel.', ['warmen'], 'warm', 'теплий', 'Мені потрібне тепле пальто.', 'A2', 'Після einen в Akkusativ чоловічого роду: -en.'],
    ['Sie kauft eine ___ Jacke.', ['blaue'], 'blau', 'синій', 'Вона купує синю куртку.', 'A2', 'Після eine в Akkusativ жіночого роду: -e.'],
    ['Wir suchen ein ___ Hotel.', ['günstiges'], 'günstig', 'недорогий', 'Ми шукаємо недорогий готель.', 'A2', 'Після ein в Akkusativ середнього роду: -es.'],
    ['Er wohnt in einem ___ Haus.', ['kleinen'], 'klein', 'маленький', 'Він живе в маленькому будинку.', 'A2', 'Місце: in + Dativ; після einem прикметник має -en.'],
    ['Ich fahre mit einer ___ Freundin.', ['guten'], 'gut', 'хороший', 'Я їду з хорошою подругою.', 'A2', 'Після einer у Dativ прикметник має -en.'],
    ['___ Kaffee schmeckt mir.', ['Frischer'], 'frisch', 'свіжий', 'Мені смакує свіжа кава.', 'B1', 'Без артикля в Nominativ чоловічого роду потрібне сильне закінчення -er.'],
    ['___ Milch steht im Kühlschrank.', ['Kalte'], 'kalt', 'холодний', 'Холодне молоко стоїть у холодильнику.', 'B1', 'Без артикля в Nominativ жіночого роду: -e.'],
    ['___ Brot duftet gut.', ['Frisches'], 'frisch', 'свіжий', 'Свіжий хліб гарно пахне.', 'B1', 'Без артикля в Nominativ середнього роду: -es.'],
    ['Ich trinke ___ Tee.', ['heißen'], 'heiß', 'гарячий', 'Я п’ю гарячий чай.', 'B1', 'Без артикля в Akkusativ чоловічого роду: -en.'],
    ['Sie kauft ___ Äpfel.', ['frische'], 'frisch', 'свіжий', 'Вона купує свіжі яблука.', 'B1', 'Без артикля в Akkusativ множини: -e.'],
    ['Ich trinke Wasser mit ___ Saft.', ['frischem'], 'frisch', 'свіжий', 'Я п’ю воду зі свіжим соком.', 'B1', 'Без артикля у Dativ чоловічого роду: -em.'],
    ['Das Brot schmeckt mit ___ Butter gut.', ['frischer'], 'frisch', 'свіжий', 'Хліб смакує зі свіжим маслом.', 'B1', 'Без артикля у Dativ жіночого роду: -er.'],
    ['Die Kinder spielen mit ___ Wasser.', ['warmem'], 'warm', 'теплий', 'Діти граються теплою водою.', 'B1', 'Без артикля у Dativ середнього роду: -em.'],
    ['Wir kochen mit ___ Zutaten.', ['frischen'], 'frisch', 'свіжий', 'Ми готуємо зі свіжих інгредієнтів.', 'B1', 'Без артикля у Dativ множини: -en.'],
    ['Wegen des ___ Wetters bleiben wir hier.', ['schlechten'], 'schlecht', 'поганий', 'Через погану погоду ми залишаємося тут.', 'B1', 'Після des у Genitiv прикметник має -en.'],
    ['Die Fenster der ___ Wohnung sind groß.', ['neuen'], 'neu', 'новий', 'Вікна нової квартири великі.', 'B1', 'Genitiv жіночого роду з означеним артиклем: der neuen Wohnung.'],
    ['Trotz ___ Regens gehen wir spazieren.', ['starken'], 'stark', 'сильний', 'Попри сильний дощ ми йдемо гуляти.', 'B2', 'Genitiv чоловічого роду без артикля зазвичай має -en: starken Regens.'],
    ['Dank ___ Vorbereitung hat sie bestanden.', ['guter'], 'gut', 'хороший', 'Завдяки хорошій підготовці вона склала іспит.', 'B2', 'У жіночому роді без артикля форма тут guter Vorbereitung; вона однакова в Dativ і Genitiv.'],
    ['Mein ___ Bruder wohnt in Berlin.', ['älterer'], 'älter', 'старший', 'Мій старший брат живе в Берліні.', 'B1', 'Після mein без закінчення: älterer Bruder.'],
    ['Ich besuche meine ___ Schwester.', ['jüngere'], 'jünger', 'молодший', 'Я відвідую свою молодшу сестру.', 'B1', 'Після meine в Akkusativ жіночого роду: -e.'],
    ['Unser ___ Auto steht draußen.', ['neues'], 'neu', 'новий', 'Наш новий автомобіль стоїть надворі.', 'A2', 'Після unser без закінчення в середньому роді: neues.'],
    ['Er hat keine ___ Schuhe.', ['sauberen'], 'sauber', 'чистий', 'У нього немає чистого взуття.', 'B1', 'Після keine у множині прикметник має -en.'],
    ['Sie trägt einen ___ Pullover.', ['teuren'], 'teuer', 'дорогий', 'Вона носить дорогий светр.', 'B1', 'У teuer перед закінченням випадає e: teuren.'],
    ['Wir wohnen in einem ___ Gebäude.', ['hohen'], 'hoch', 'високий', 'Ми живемо у високій будівлі.', 'B1', 'hoch перед закінченням змінює основу: hohen.'],
    ['Ich wünsche dir ein ___ Wochenende.', ['schönes'], 'schön', 'гарний', 'Бажаю тобі гарних вихідних.', 'A2', 'ein Wochenende — середній рід, Akkusativ; schönes.'],
    ['Der ___ Mann kauft eine ___ Tasche und ein ___ Buch.', ['junge', 'rote', 'neues'], 'jung · rot · neu', 'молодий · червоний · новий', 'Молодий чоловік купує червону сумку та нову книжку.', 'B1', 'der junge — Nominativ; eine rote — Akkusativ жіночого роду; ein neues — Akkusativ середнього роду.'],
    ['Mit ___ Brot, ___ Butter und ___ Äpfeln machen wir ein Picknick.', ['frischem', 'weicher', 'roten'], 'frisch · weich · rot', 'свіжий · м’який · червоний', 'Ми влаштовуємо пікнік зі свіжим хлібом, м’яким маслом та червоними яблуками.', 'B1', 'Усі три іменники стоять після mit у Dativ без артикля: -em, -er, -en.']
  ];
  adjectiveRows.forEach(row => add(adjectives, ...row));

  const personal = addSet('personal_pronouns_cases', 'Особові займенники · відмінки', 'Займенники у відмінках', 'Впиши особовий займенник у потрібному відмінку. Особу задає українська підказка; звертай увагу на керування дієслова.');
  const pronouns = [
    ['ich', 'mich', 'mir', 'я', 'мене', 'мені', 'bin'],
    ['du', 'dich', 'dir', 'ти', 'тебе', 'тобі', 'bist'],
    ['er', 'ihn', 'ihm', 'він', 'його', 'йому', 'ist'],
    ['sie', 'sie', 'ihr', 'вона', 'її', 'їй', 'ist'],
    ['es', 'es', 'ihm', 'воно', 'його (воно)', 'йому (воно)', 'ist'],
    ['wir', 'uns', 'uns', 'ми', 'нас', 'нам', 'sind'],
    ['ihr', 'euch', 'euch', 'ви (неформально, кілька осіб)', 'вас (неформально)', 'вам (неформально)', 'seid'],
    ['sie', 'sie', 'ihnen', 'вони', 'їх', 'їм', 'sind'],
    ['Sie', 'Sie', 'Ihnen', 'Ви (ввічливо)', 'Вас (ввічливо)', 'Вам (ввічливо)', 'sind']
  ];
  for (const [nom, akk, dat, uaNom, uaAkk, uaDat, verb] of pronouns) {
    add(personal, `___ ${verb} heute hier.`, [upper(nom)], nom, uaNom, `${upper(uaNom)} сьогодні тут.`, 'A1', 'Підмет: Nominativ.');
    add(personal, 'Die Lehrerin sieht ___.', [akk], nom, uaAkk, `Учителька бачить ${uaAkk}.`, 'A1', 'sehen вимагає Akkusativ: mich, dich, ihn, sie, es, uns, euch, sie, Sie.');
    add(personal, 'Der Lehrer hilft ___.', [dat], nom, uaDat, `Учитель допомагає ${uaDat}.`, 'A2', 'helfen вимагає Dativ: mir, dir, ihm, ihr, ihm, uns, euch, ihnen, Ihnen.');
  }
  [
    ['Ich gebe ___ das Buch und sehe ___ morgen.', ['dir', 'dich'], 'du', 'тобі · тебе', 'Я даю тобі книжку й побачу тебе завтра.', 'A2', 'Одержувач після geben — Dativ; додаток після sehen — Akkusativ.'],
    ['Das Geschenk ist für ___.', ['mich'], 'ich', 'мене', 'Цей подарунок для мене.', 'A1', 'für + Akkusativ.'],
    ['Er spricht mit ___.', ['uns'], 'wir', 'нами', 'Він розмовляє з нами.', 'A1', 'mit + Dativ.'],
    ['Ohne ___ gehen wir nicht.', ['euch'], 'ihr', 'вас (неформально)', 'Без вас ми не підемо.', 'A2', 'ohne + Akkusativ.'],
    ['Ich wasche ___ die Hände.', ['mir'], 'ich', 'собі', 'Я мию собі руки.', 'A2', 'die Hände — Akkusativ, тому зворотний займенник mir стоїть у Dativ.'],
    ['Du putzt ___ die Zähne.', ['dir'], 'du', 'собі', 'Ти чистиш собі зуби.', 'A2', 'die Zähne — Akkusativ; зворотний займенник dir — Dativ.'],
    ['Ich erinnere ___ an den Urlaub.', ['mich'], 'ich', 'себе', 'Я згадую відпустку.', 'A2', 'sich erinnern вимагає зворотного займенника в Akkusativ.'],
    ['Wir freuen ___ auf die Reise.', ['uns'], 'wir', 'себе (ми)', 'Ми радіємо майбутній подорожі.', 'A2', 'sich freuen auf + Akkusativ; зворотний займенник uns.']
  ].forEach(row => add(personal, ...row));

  const possessives = addSet('possessive_pronouns_cases', 'Присвійні слова · відмінювання', 'Займенники у відмінках', 'Впиши повну форму присвійного слова. Власника вказано в підказці, а закінчення залежить від роду й відмінка іменника.');
  const owners = [
    ['mein', 'мій', 'мого', 'моєю'], ['dein', 'твій', 'твого', 'твоєю'],
    ['sein', 'його', 'його', 'його'], ['ihr', 'її', 'її', 'її'],
    ['unser', 'наш', 'нашого', 'нашою'], ['euer', 'ваш (неформально)', 'вашого', 'вашою']
  ];
  for (const [stem, ua, uaGen, uaIns] of owners) {
    const base = stem === 'euer' ? 'eur' : stem;
    add(possessives, '___ Bruder wohnt hier.', [upper(stem)], stem, ua, `${upper(ua)} брат живе тут.`, 'A1', 'Nominativ чоловічого роду: без закінчення.');
    add(possessives, 'Ich sehe ___ Bruder.', [base + 'en'], stem, ua, `Я бачу ${uaGen} брата.`, 'A2', 'Akkusativ чоловічого роду: -en.');
    add(possessives, 'Ich spreche mit ___ Schwester.', [base + 'er'], stem, ua, `Я розмовляю з ${uaIns} сестрою.`, 'A2', 'Dativ жіночого роду: -er.');
    add(possessives, 'Das ist das Fahrrad ___ Bruders.', [base + 'es'], stem, ua, `Це велосипед ${uaGen} брата.`, 'B1', 'Genitiv чоловічого роду: -es; Bruders також має закінчення -s.');
    add(possessives, 'Wir helfen ___ Kindern.', [base + 'en'], stem, ua, `Ми допомагаємо дітям; власник: ${ua}.`, 'A2', 'Dativ множини: -en, також Kindern з -n.');
  }

  const declension = addSet('noun_declension', 'Іменники · форми відмінків', 'Іменники та словник', 'Впиши відмінену форму іменника. Тренуємо n-Deklination, Genitiv та закінчення -n у Dativ множини.');
  for (const entry of Object.values(vocabulary).flat()) {
    const [gender, noun, plural, genitive, ua, uaAkk, uaGen, uaIns, weak] = entry;
    if (weak) {
      add(declension, 'Ich sehe den ___.', [weak], noun, ua, `Я бачу ${uaAkk}.`, 'A2', 'Слабкі іменники чоловічого роду мають -(e)n в Akkusativ, Dativ і Genitiv.');
      add(declension, 'Das ist ein Foto des ___.', [genitive], noun, ua, `Це фото ${uaGen}.`, 'B1', 'Слабке відмінювання: Genitiv des + іменник із -(e)n.');
    }
    if (gender !== 'f' && !weak) {
      // Both common -s/-es genitives are accepted for these nouns.
      const short = genitive.endsWith('es') && noun + 'es' === genitive && !/[sßxz]$/u.test(noun) ? noun + 's' : null;
      add(declension, `Das ist ein Foto ${article[gender].gen} ___.`, [genitive], noun, ua, `Це фото ${uaGen}.`, 'B1', 'Чоловічий і середній рід у Genitiv зазвичай мають закінчення -(e)s.', short ? [[short]] : undefined);
    }
    const dativePlural = /[ns]$/u.test(plural) ? plural : plural + 'n';
    add(declension, 'Nominativ: die ' + plural + ' → Dativ: den ___', [dativePlural], noun, ua, `Утвори Dativ множини слова «${ua}».`, 'A2', 'Dativ множини додає -n, якщо множина ще не закінчується на -n або -s.');
  }
  const indefinite = addSet('indefinite_articles', 'Неозначені артиклі · ein / kein', 'Відмінки', 'Впиши форму ein або kein відповідно до українського перекладу. У множині неозначеного артикля немає, але заперечне kein відмінюється.');
  [
    ['Das ist ___ Tisch.', 'ein', 'Tisch', 'стіл', 'Це стіл.', 'A1'],
    ['Hier steht ___ Lampe.', 'eine', 'Lampe', 'лампа', 'Тут стоїть лампа.', 'A1'],
    ['Das ist ___ Fenster.', 'ein', 'Fenster', 'вікно', 'Це вікно.', 'A1'],
    ['Ich kaufe ___ Stuhl.', 'einen', 'Stuhl', 'стілець', 'Я купую стілець.', 'A1'],
    ['Sie braucht ___ Tasche.', 'eine', 'Tasche', 'сумка', 'Їй потрібна сумка.', 'A1'],
    ['Wir suchen ___ Hotel.', 'ein', 'Hotel', 'готель', 'Ми шукаємо готель.', 'A1'],
    ['Er spricht mit ___ Lehrer.', 'einem', 'Lehrer', 'учитель', 'Він розмовляє з учителем.', 'A2'],
    ['Ich fahre mit ___ Freundin.', 'einer', 'Freundin', 'подруга', 'Я їду з подругою.', 'A2'],
    ['Sie spielt mit ___ Kind.', 'einem', 'Kind', 'дитина', 'Вона грається з дитиною.', 'A2'],
    ['Das ist der Name ___ Mannes.', 'eines', 'Mann', 'чоловік', 'Це ім’я одного чоловіка.', 'B1'],
    ['Das ist die Tasche ___ Frau.', 'einer', 'Frau', 'жінка', 'Це сумка однієї жінки.', 'B1'],
    ['Das ist das Zimmer ___ Kindes.', 'eines', 'Kind', 'дитина', 'Це кімната однієї дитини.', 'B1'],
    ['___ Hund bellt draußen.', 'Ein', 'Hund', 'собака', 'Надворі гавкає якийсь собака.', 'A1'],
    ['___ Katze schläft hier.', 'Eine', 'Katze', 'кішка', 'Тут спить якась кішка.', 'A1'],
    ['___ Auto steht vor dem Haus.', 'Ein', 'Auto', 'автомобіль', 'Перед будинком стоїть якийсь автомобіль.', 'A1'],
    ['Wir lesen ___ Roman.', 'einen', 'Roman', 'роман', 'Ми читаємо роман.', 'A1'],
    ['Er isst ___ Banane.', 'eine', 'Banane', 'банан', 'Він їсть банан.', 'A1'],
    ['Sie bestellt ___ Brot.', 'ein', 'Brot', 'хліб', 'Вона замовляє одну хлібину.', 'A1'],
    ['Das Paket ist von ___ Freund.', 'einem', 'Freund', 'друг', 'Посилка від одного друга.', 'A2'],
    ['Wir wohnen bei ___ Familie.', 'einer', 'Familie', 'родина', 'Ми живемо в одній родині.', 'A2'],
    ['Ich lese von ___ Museum.', 'einem', 'Museum', 'музей', 'Я читаю про один музей.', 'A2'],
    ['Hier ist das Foto ___ Gartens.', 'eines', 'Garten', 'сад', 'Ось фото одного саду.', 'B1'],
    ['Das ist die Adresse ___ Schule.', 'einer', 'Schule', 'школа', 'Це адреса однієї школи.', 'B1'],
    ['Wir sehen die Fenster ___ Hauses.', 'eines', 'Haus', 'будинок', 'Ми бачимо вікна одного будинку.', 'B1'],
    ['Das ist ___ Tisch, sondern ein Schrank.', 'kein', 'Tisch', 'не стіл', 'Це не стіл, а шафа.', 'A1'],
    ['Hier ist ___ Küche, sondern ein Bad.', 'keine', 'Küche', 'не кухня', 'Тут не кухня, а ванна кімната.', 'A1'],
    ['Ich habe ___ Auto.', 'kein', 'Auto', 'немає автомобіля', 'У мене немає автомобіля.', 'A1'],
    ['Er hat ___ Bruder.', 'keinen', 'Bruder', 'немає брата', 'У нього немає брата.', 'A1'],
    ['Wir haben ___ Haustiere.', 'keine', 'Haustiere', 'немає домашніх тварин', 'У нас немає домашніх тварин.', 'A1'],
    ['Ich spreche mit ___ Fremden.', 'keinem', 'Fremder (Singular)', 'ні з яким незнайомцем', 'Я не розмовляю з жодним незнайомцем.', 'A2']
  ].forEach(([sentence, answer, infinitive, ua, translation, level]) => {
    add(indefinite, sentence, [answer], infinitive, ua, translation, level,
      'ein / kein: Nominativ — ein/kein, eine/keine, ein/kein; Akkusativ чоловічого роду — einen/keinen; Dativ — einem/keinem, einer/keiner; Genitiv — eines/keines, einer/keiner.');
  });
  return result;
})();
