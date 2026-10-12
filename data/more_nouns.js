/*
 * 200 additional nouns, explicitly inflected in German and Ukrainian.
 * Each theme uses contexts appropriate to its objects; no random noun/verb pairs.
 * Variants checked against Duden: /rechtschreibung/{Visum,Monitor,Laptop,Labor,Schal}
 * and /deklination/substantive/Wagen. Visa is an explicit dative-plural exception.
 */
const more_nouns = (() => {
  const result = {
    case_nominativ: [], case_akkusativ: [], case_dativ: [], case_genitiv: [],
    noun_plurals: [], noun_declension: [], nomen: []
  };
  const articles = {
    m: { nom: 'der', akk: 'den', dat: 'dem', gen: 'des' },
    f: { nom: 'die', akk: 'die', dat: 'der', gen: 'der' },
    n: { nom: 'das', akk: 'das', dat: 'dem', gen: 'des' }
  };
  // gender | lemma | plural(s) | genitive(s) | UA nom | UA acc | UA gen | UA instr
  // Optional final object: weak form, alternate gender, explicit dative plurals.
  // A vertical bar separates accepted forms; it is never displayed as an answer.
  const vocabulary = {
    documents: [
      ['m', 'Pass', 'Pässe', 'Passes', 'паспорт', 'паспорт', 'паспорта', 'паспортом'],
      ['m', 'Ausweis', 'Ausweise', 'Ausweises', 'посвідчення', 'посвідчення', 'посвідчення', 'посвідченням'],
      ['m', 'Führerschein', 'Führerscheine', 'Führerscheins|Führerscheines', 'посвідчення водія', 'посвідчення водія', 'посвідчення водія', 'посвідченням водія'],
      ['m', 'Reisepass', 'Reisepässe', 'Reisepasses', 'закордонний паспорт', 'закордонний паспорт', 'закордонного паспорта', 'закордонним паспортом'],
      ['m', 'Personalausweis', 'Personalausweise', 'Personalausweises', 'посвідчення особи', 'посвідчення особи', 'посвідчення особи', 'посвідченням особи'],
      ['m', 'Vertrag', 'Verträge', 'Vertrags|Vertrages', 'договір', 'договір', 'договору', 'договором'],
      ['m', 'Arbeitsvertrag', 'Arbeitsverträge', 'Arbeitsvertrags|Arbeitsvertrages', 'трудовий договір', 'трудовий договір', 'трудового договору', 'трудовим договором'],
      ['m', 'Mietvertrag', 'Mietverträge', 'Mietvertrags|Mietvertrages', 'договір оренди', 'договір оренди', 'договору оренди', 'договором оренди'],
      ['m', 'Antrag', 'Anträge', 'Antrags|Antrages', 'заява', 'заяву', 'заяви', 'заявою'],
      ['m', 'Bescheid', 'Bescheide', 'Bescheids|Bescheides', 'офіційне рішення', 'офіційне рішення', 'офіційного рішення', 'офіційним рішенням'],
      ['m', 'Brief', 'Briefe', 'Briefs|Briefes', 'лист', 'лист', 'листа', 'листом'],
      ['f', 'Rechnung', 'Rechnungen', 'Rechnung', 'рахунок', 'рахунок', 'рахунку', 'рахунком'],
      ['f', 'Quittung', 'Quittungen', 'Quittung', 'квитанція', 'квитанцію', 'квитанції', 'квитанцією'],
      ['f', 'Bescheinigung', 'Bescheinigungen', 'Bescheinigung', 'довідка', 'довідку', 'довідки', 'довідкою'],
      ['f', 'Urkunde', 'Urkunden', 'Urkunde', 'свідоцтво', 'свідоцтво', 'свідоцтва', 'свідоцтвом'],
      ['n', 'Zeugnis', 'Zeugnisse', 'Zeugnisses', 'атестат', 'атестат', 'атестата', 'атестатом'],
      ['n', 'Formular', 'Formulare', 'Formulars', 'бланк', 'бланк', 'бланка', 'бланком'],
      ['n', 'Zertifikat', 'Zertifikate', 'Zertifikats|Zertifikates', 'сертифікат', 'сертифікат', 'сертифіката', 'сертифікатом'],
      ['n', 'Ticket', 'Tickets', 'Tickets', 'квиток', 'квиток', 'квитка', 'квитком'],
      ['n', 'Visum', 'Visa|Visen', 'Visums', 'віза', 'візу', 'візи', 'візою', { dativePlurals: ['Visa', 'Visen'] }]
    ],
    technology: [
      ['m', 'Computer', 'Computer', 'Computers', 'комп’ютер', 'комп’ютер', 'комп’ютера', 'комп’ютером'],
      ['m', 'Laptop', 'Laptops', 'Laptops', 'ноутбук', 'ноутбук', 'ноутбука', 'ноутбуком', { otherGender: 'n' }],
      ['m', 'Drucker', 'Drucker', 'Druckers', 'принтер', 'принтер', 'принтера', 'принтером'],
      ['m', 'Bildschirm', 'Bildschirme', 'Bildschirms|Bildschirmes', 'екран', 'екран', 'екрана', 'екраном'],
      ['m', 'Monitor', 'Monitore|Monitoren', 'Monitors', 'монітор', 'монітор', 'монітора', 'монітором'],
      ['m', 'Scanner', 'Scanner', 'Scanners', 'сканер', 'сканер', 'сканера', 'сканером'],
      ['m', 'Beamer', 'Beamer', 'Beamers', 'проєктор', 'проєктор', 'проєктора', 'проєктором'],
      ['m', 'Router', 'Router', 'Routers', 'маршрутизатор', 'маршрутизатор', 'маршрутизатора', 'маршрутизатором'],
      ['m', 'Server', 'Server', 'Servers', 'сервер', 'сервер', 'сервера', 'сервером'],
      ['m', 'Sensor', 'Sensoren', 'Sensors', 'датчик', 'датчик', 'датчика', 'датчиком'],
      ['m', 'Motor', 'Motoren', 'Motors', 'двигун', 'двигун', 'двигуна', 'двигуном'],
      ['m', 'Schalter', 'Schalter', 'Schalters', 'вимикач', 'вимикач', 'вимикача', 'вимикачем'],
      ['m', 'Stecker', 'Stecker', 'Steckers', 'штекер', 'штекер', 'штекера', 'штекером'],
      ['m', 'Akku', 'Akkus', 'Akkus', 'акумулятор', 'акумулятор', 'акумулятора', 'акумулятором'],
      ['m', 'Lautsprecher', 'Lautsprecher', 'Lautsprechers', 'гучномовець', 'гучномовець', 'гучномовця', 'гучномовцем'],
      ['m', 'Kopfhörer', 'Kopfhörer', 'Kopfhörers', 'навушник', 'навушник', 'навушника', 'навушником'],
      ['n', 'Mikrofon', 'Mikrofone', 'Mikrofons', 'мікрофон', 'мікрофон', 'мікрофона', 'мікрофоном'],
      ['n', 'Gerät', 'Geräte', 'Geräts|Gerätes', 'прилад', 'прилад', 'приладу', 'приладом'],
      ['n', 'Kabel', 'Kabel', 'Kabels', 'кабель', 'кабель', 'кабелю', 'кабелем'],
      ['n', 'Netzteil', 'Netzteile', 'Netzteils|Netzteiles', 'блок живлення', 'блок живлення', 'блока живлення', 'блоком живлення']
    ],
    tools: [
      ['m', 'Hammer', 'Hämmer', 'Hammers', 'молоток', 'молоток', 'молотка', 'молотком'],
      ['m', 'Schraubendreher', 'Schraubendreher', 'Schraubendrehers', 'викрутка', 'викрутку', 'викрутки', 'викруткою'],
      ['m', 'Schraubenschlüssel', 'Schraubenschlüssel', 'Schraubenschlüssels', 'гайковий ключ', 'гайковий ключ', 'гайкового ключа', 'гайковим ключем'],
      ['m', 'Bohrer', 'Bohrer', 'Bohrers', 'свердло', 'свердло', 'свердла', 'свердлом'],
      ['m', 'Pinsel', 'Pinsel', 'Pinsels', 'пензель', 'пензель', 'пензля', 'пензлем'],
      ['m', 'Besen', 'Besen', 'Besens', 'віник', 'віник', 'віника', 'віником'],
      ['m', 'Staubsauger', 'Staubsauger', 'Staubsaugers', 'пилосос', 'пилосос', 'пилососа', 'пилососом'],
      ['m', 'Föhn', 'Föhne', 'Föhns', 'фен', 'фен', 'фена', 'феном'],
      ['m', 'Mixer', 'Mixer', 'Mixers', 'міксер', 'міксер', 'міксера', 'міксером'],
      ['m', 'Toaster', 'Toaster', 'Toasters', 'тостер', 'тостер', 'тостера', 'тостером'],
      ['m', 'Wasserkocher', 'Wasserkocher', 'Wasserkochers', 'електрочайник', 'електрочайник', 'електрочайника', 'електрочайником'],
      ['m', 'Rasenmäher', 'Rasenmäher', 'Rasenmähers', 'газонокосарка', 'газонокосарку', 'газонокосарки', 'газонокосаркою'],
      ['n', 'Bügeleisen', 'Bügeleisen', 'Bügeleisens', 'праска', 'праску', 'праски', 'праскою'],
      ['n', 'Messer', 'Messer', 'Messers', 'ніж', 'ніж', 'ножа', 'ножем'],
      ['n', 'Lineal', 'Lineale', 'Lineals', 'лінійка', 'лінійку', 'лінійки', 'лінійкою'],
      ['n', 'Werkzeug', 'Werkzeuge', 'Werkzeugs|Werkzeuges', 'інструмент', 'інструмент', 'інструмента', 'інструментом'],
      ['f', 'Schere', 'Scheren', 'Schere', 'ножиці', 'ножиці', 'ножиць', 'ножицями'],
      ['f', 'Zange', 'Zangen', 'Zange', 'кліщі', 'кліщі', 'кліщів', 'кліщами'],
      ['f', 'Säge', 'Sägen', 'Säge', 'пилка', 'пилку', 'пилки', 'пилкою'],
      ['f', 'Taschenlampe', 'Taschenlampen', 'Taschenlampe', 'ліхтарик', 'ліхтарик', 'ліхтарика', 'ліхтариком']
    ],
    kitchen: [
      ['m', 'Teller', 'Teller', 'Tellers', 'тарілка', 'тарілку', 'тарілки', 'тарілкою'],
      ['m', 'Becher', 'Becher', 'Bechers', 'кухоль', 'кухоль', 'кухля', 'кухлем'],
      ['m', 'Löffel', 'Löffel', 'Löffels', 'ложка', 'ложку', 'ложки', 'ложкою'],
      ['m', 'Topf', 'Töpfe', 'Topfs|Topfes', 'каструля', 'каструлю', 'каструлі', 'каструлею'],
      ['m', 'Deckel', 'Deckel', 'Deckels', 'кришка', 'кришку', 'кришки', 'кришкою'],
      ['m', 'Krug', 'Krüge', 'Krugs|Kruges', 'глечик', 'глечик', 'глечика', 'глечиком'],
      ['m', 'Eimer', 'Eimer', 'Eimers', 'відро', 'відро', 'відра', 'відром'],
      ['m', 'Behälter', 'Behälter', 'Behälters', 'контейнер', 'контейнер', 'контейнера', 'контейнером'],
      ['f', 'Tasse', 'Tassen', 'Tasse', 'чашка', 'чашку', 'чашки', 'чашкою'],
      ['f', 'Gabel', 'Gabeln', 'Gabel', 'виделка', 'виделку', 'виделки', 'виделкою'],
      ['f', 'Pfanne', 'Pfannen', 'Pfanne', 'сковорода', 'сковороду', 'сковороди', 'сковородою'],
      ['f', 'Schüssel', 'Schüsseln', 'Schüssel', 'миска', 'миску', 'миски', 'мискою'],
      ['f', 'Flasche', 'Flaschen', 'Flasche', 'пляшка', 'пляшку', 'пляшки', 'пляшкою'],
      ['f', 'Dose', 'Dosen', 'Dose', 'бляшанка', 'бляшанку', 'бляшанки', 'бляшанкою'],
      ['f', 'Kanne', 'Kannen', 'Kanne', 'чайник для заварювання', 'чайник для заварювання', 'чайника для заварювання', 'чайником для заварювання'],
      ['f', 'Serviette', 'Servietten', 'Serviette', 'серветка', 'серветку', 'серветки', 'серветкою'],
      ['f', 'Schale', 'Schalen', 'Schale', 'піала', 'піалу', 'піали', 'піалою'],
      ['n', 'Glas', 'Gläser', 'Glases', 'склянка', 'склянку', 'склянки', 'склянкою'],
      ['n', 'Brett', 'Bretter', 'Bretts|Brettes', 'дошка', 'дошку', 'дошки', 'дошкою'],
      ['n', 'Sieb', 'Siebe', 'Siebs|Siebes', 'сито', 'сито', 'сита', 'ситом']
    ],
    clothing: [
      ['m', 'Mantel', 'Mäntel', 'Mantels', 'пальто', 'пальто', 'пальта', 'пальтом'],
      ['m', 'Pullover', 'Pullover', 'Pullovers', 'светр', 'светр', 'светра', 'светром'],
      ['m', 'Anzug', 'Anzüge', 'Anzugs|Anzuges', 'костюм', 'костюм', 'костюма', 'костюмом'],
      ['m', 'Schuh', 'Schuhe', 'Schuhs|Schuhes', 'черевик', 'черевик', 'черевика', 'черевиком'],
      ['m', 'Stiefel', 'Stiefel', 'Stiefels', 'чобіт', 'чобіт', 'чобота', 'чоботом'],
      ['m', 'Hut', 'Hüte', 'Huts|Hutes', 'капелюх', 'капелюх', 'капелюха', 'капелюхом'],
      ['m', 'Schal', 'Schals|Schale', 'Schals|Schales', 'шарф', 'шарф', 'шарфа', 'шарфом'],
      ['m', 'Gürtel', 'Gürtel', 'Gürtels', 'ремінь', 'ремінь', 'ременя', 'ременем'],
      ['m', 'Rock', 'Röcke', 'Rocks|Rockes', 'спідниця', 'спідницю', 'спідниці', 'спідницею'],
      ['m', 'Handschuh', 'Handschuhe', 'Handschuhs|Handschuhes', 'рукавичка', 'рукавичку', 'рукавички', 'рукавичкою'],
      ['f', 'Jacke', 'Jacken', 'Jacke', 'куртка', 'куртку', 'куртки', 'курткою'],
      ['f', 'Hose', 'Hosen', 'Hose', 'штани', 'штани', 'штанів', 'штанами'],
      ['f', 'Bluse', 'Blusen', 'Bluse', 'блузка', 'блузку', 'блузки', 'блузкою'],
      ['f', 'Mütze', 'Mützen', 'Mütze', 'шапка', 'шапку', 'шапки', 'шапкою'],
      ['f', 'Socke', 'Socken', 'Socke', 'шкарпетка', 'шкарпетку', 'шкарпетки', 'шкарпеткою'],
      ['f', 'Weste', 'Westen', 'Weste', 'жилет', 'жилет', 'жилета', 'жилетом'],
      ['f', 'Krawatte', 'Krawatten', 'Krawatte', 'краватка', 'краватку', 'краватки', 'краваткою'],
      ['f', 'Uniform', 'Uniformen', 'Uniform', 'уніформа', 'уніформу', 'уніформи', 'уніформою'],
      ['n', 'Kleid', 'Kleider', 'Kleids|Kleides', 'сукня', 'сукню', 'сукні', 'сукнею'],
      ['n', 'Hemd', 'Hemden', 'Hemds|Hemdes', 'сорочка', 'сорочку', 'сорочки', 'сорочкою']
    ],
    places: [
      ['n', 'Büro', 'Büros', 'Büros', 'офіс', 'офіс', 'офісу', 'офісом'],
      ['n', 'Geschäft', 'Geschäfte', 'Geschäfts|Geschäftes', 'магазин', 'магазин', 'магазину', 'магазином'],
      ['n', 'Kino', 'Kinos', 'Kinos', 'кінотеатр', 'кінотеатр', 'кінотеатру', 'кінотеатром'],
      ['n', 'Theater', 'Theater', 'Theaters', 'театр', 'театр', 'театру', 'театром'],
      ['n', 'Restaurant', 'Restaurants', 'Restaurants', 'ресторан', 'ресторан', 'ресторану', 'рестораном'],
      ['n', 'Café', 'Cafés', 'Cafés', 'кав’ярня', 'кав’ярню', 'кав’ярні', 'кав’ярнею'],
      ['n', 'Schwimmbad', 'Schwimmbäder', 'Schwimmbads|Schwimmbades', 'басейн', 'басейн', 'басейну', 'басейном'],
      ['n', 'Stadion', 'Stadien', 'Stadions', 'стадіон', 'стадіон', 'стадіону', 'стадіоном'],
      ['n', 'Labor', 'Labore|Labors', 'Labors', 'лабораторія', 'лабораторію', 'лабораторії', 'лабораторією'],
      ['n', 'Gebäude', 'Gebäude', 'Gebäudes', 'будівля', 'будівлю', 'будівлі', 'будівлею'],
      ['f', 'Werkstatt', 'Werkstätten', 'Werkstatt', 'майстерня', 'майстерню', 'майстерні', 'майстернею'],
      ['f', 'Bäckerei', 'Bäckereien', 'Bäckerei', 'пекарня', 'пекарню', 'пекарні', 'пекарнею'],
      ['f', 'Metzgerei', 'Metzgereien', 'Metzgerei', 'м’ясна крамниця', 'м’ясну крамницю', 'м’ясної крамниці', 'м’ясною крамницею'],
      ['f', 'Buchhandlung', 'Buchhandlungen', 'Buchhandlung', 'книгарня', 'книгарню', 'книгарні', 'книгарнею'],
      ['f', 'Sporthalle', 'Sporthallen', 'Sporthalle', 'спортивна зала', 'спортивну залу', 'спортивної зали', 'спортивною залою'],
      ['f', 'Tankstelle', 'Tankstellen', 'Tankstelle', 'автозаправка', 'автозаправку', 'автозаправки', 'автозаправкою'],
      ['f', 'Bankfiliale', 'Bankfilialen', 'Bankfiliale', 'відділення банку', 'відділення банку', 'відділення банку', 'відділенням банку'],
      ['f', 'Polizeiwache', 'Polizeiwachen', 'Polizeiwache', 'поліцейський відділок', 'поліцейський відділок', 'поліцейського відділку', 'поліцейським відділком'],
      ['f', 'Postfiliale', 'Postfilialen', 'Postfiliale', 'поштове відділення', 'поштове відділення', 'поштового відділення', 'поштовим відділенням'],
      ['f', 'Bahnhofshalle', 'Bahnhofshallen', 'Bahnhofshalle', 'зала вокзалу', 'залу вокзалу', 'зали вокзалу', 'залою вокзалу']
    ],
    transport: [
      ['m', 'Bus', 'Busse', 'Busses', 'автобус', 'автобус', 'автобуса', 'автобусом'],
      ['m', 'Zug', 'Züge', 'Zugs|Zuges', 'поїзд', 'поїзд', 'поїзда', 'поїздом'],
      ['m', 'Lastwagen', 'Lastwagen', 'Lastwagens', 'вантажівка', 'вантажівку', 'вантажівки', 'вантажівкою'],
      ['m', 'Kleinwagen', 'Kleinwagen', 'Kleinwagens', 'малолітражний автомобіль', 'малолітражний автомобіль', 'малолітражного автомобіля', 'малолітражним автомобілем'],
      ['m', 'Traktor', 'Traktoren', 'Traktors', 'трактор', 'трактор', 'трактора', 'трактором'],
      ['m', 'Anhänger', 'Anhänger', 'Anhängers', 'причіп', 'причіп', 'причепа', 'причепом'],
      ['m', 'Transporter', 'Transporter', 'Transporters', 'фургон', 'фургон', 'фургона', 'фургоном'],
      ['m', 'Wagen', 'Wagen|Wägen', 'Wagens', 'автівка', 'автівку', 'автівки', 'автівкою'],
      ['m', 'Krankenwagen', 'Krankenwagen', 'Krankenwagens', 'автомобіль швидкої допомоги', 'автомобіль швидкої допомоги', 'автомобіля швидкої допомоги', 'автомобілем швидкої допомоги'],
      ['m', 'Lieferwagen', 'Lieferwagen', 'Lieferwagens', 'розвізний фургон', 'розвізний фургон', 'розвізного фургона', 'розвізним фургоном'],
      ['n', 'Fahrrad', 'Fahrräder', 'Fahrrads|Fahrrades', 'велосипед', 'велосипед', 'велосипеда', 'велосипедом'],
      ['n', 'Auto', 'Autos', 'Autos', 'автомобіль', 'автомобіль', 'автомобіля', 'автомобілем'],
      ['n', 'Motorrad', 'Motorräder', 'Motorrads|Motorrades', 'мотоцикл', 'мотоцикл', 'мотоцикла', 'мотоциклом'],
      ['n', 'Flugzeug', 'Flugzeuge', 'Flugzeugs|Flugzeuges', 'літак', 'літак', 'літака', 'літаком'],
      ['n', 'Schiff', 'Schiffe', 'Schiffs|Schiffes', 'корабель', 'корабель', 'корабля', 'кораблем'],
      ['n', 'Boot', 'Boote', 'Boots|Bootes', 'човен', 'човен', 'човна', 'човном'],
      ['n', 'Taxi', 'Taxis', 'Taxis', 'таксі', 'таксі', 'таксі', 'таксі'],
      ['n', 'Segelboot', 'Segelboote', 'Segelboots|Segelbootes', 'вітрильний човен', 'вітрильний човен', 'вітрильного човна', 'вітрильним човном'],
      ['f', 'Straßenbahn', 'Straßenbahnen', 'Straßenbahn', 'трамвай', 'трамвай', 'трамвая', 'трамваєм'],
      ['f', 'Fähre', 'Fähren', 'Fähre', 'пором', 'пором', 'порома', 'поромом']
    ],
    body: [
      ['m', 'Arm', 'Arme', 'Arms|Armes', 'рука', 'руку', 'руки', 'рукою'],
      ['m', 'Finger', 'Finger', 'Fingers', 'палець руки', 'палець руки', 'пальця руки', 'пальцем руки'],
      ['m', 'Fuß', 'Füße', 'Fußes', 'ступня', 'ступню', 'ступні', 'ступнею'],
      ['m', 'Kopf', 'Köpfe', 'Kopfs|Kopfes', 'голова', 'голову', 'голови', 'головою'],
      ['m', 'Hals', 'Hälse', 'Halses', 'шия', 'шию', 'шиї', 'шиєю'],
      ['m', 'Zahn', 'Zähne', 'Zahns|Zahnes', 'зуб', 'зуб', 'зуба', 'зубом'],
      ['m', 'Rücken', 'Rücken', 'Rückens', 'спина', 'спину', 'спини', 'спиною'],
      ['m', 'Bauch', 'Bäuche', 'Bauchs|Bauches', 'живіт', 'живіт', 'живота', 'животом'],
      ['m', 'Daumen', 'Daumen', 'Daumens', 'великий палець руки', 'великий палець руки', 'великого пальця руки', 'великим пальцем руки'],
      ['m', 'Ellbogen', 'Ellbogen', 'Ellbogens', 'лікоть', 'лікоть', 'ліктя', 'ліктем'],
      ['m', 'Knöchel', 'Knöchel', 'Knöchels', 'щиколотка', 'щиколотку', 'щиколотки', 'щиколоткою'],
      ['m', 'Magen', 'Mägen', 'Magens', 'шлунок', 'шлунок', 'шлунка', 'шлунком'],
      ['m', 'Muskel', 'Muskeln', 'Muskels', 'м’яз', 'м’яз', 'м’яза', 'м’язом'],
      ['m', 'Knochen', 'Knochen', 'Knochens', 'кістка', 'кістку', 'кістки', 'кісткою'],
      ['n', 'Auge', 'Augen', 'Auges', 'око', 'око', 'ока', 'оком'],
      ['n', 'Ohr', 'Ohren', 'Ohrs|Ohres', 'вухо', 'вухо', 'вуха', 'вухом'],
      ['n', 'Bein', 'Beine', 'Beins|Beines', 'нога', 'ногу', 'ноги', 'ногою'],
      ['n', 'Knie', 'Knie', 'Knies', 'коліно', 'коліно', 'коліна', 'коліном'],
      ['f', 'Hand', 'Hände', 'Hand', 'кисть руки', 'кисть руки', 'кисті руки', 'кистю руки'],
      ['f', 'Schulter', 'Schultern', 'Schulter', 'плече', 'плече', 'плеча', 'плечем']
    ],
    time: [
      ['m', 'Termin', 'Termine', 'Termins', 'призначена зустріч', 'призначену зустріч', 'призначеної зустрічі', 'призначеною зустріччю'],
      ['m', 'Monat', 'Monate', 'Monats|Monates', 'місяць', 'місяць', 'місяця', 'місяцем'],
      ['m', 'Tag', 'Tage', 'Tags|Tages', 'день', 'день', 'дня', 'днем'],
      ['m', 'Abend', 'Abende', 'Abends|Abendes', 'вечір', 'вечір', 'вечора', 'вечором'],
      ['m', 'Morgen', 'Morgen', 'Morgens', 'ранок', 'ранок', 'ранку', 'ранком'],
      ['m', 'Sommer', 'Sommer', 'Sommers', 'літо', 'літо', 'літа', 'літом'],
      ['m', 'Winter', 'Winter', 'Winters', 'зима', 'зиму', 'зими', 'зимою'],
      ['m', 'Herbst', 'Herbste', 'Herbsts|Herbstes', 'осінь', 'осінь', 'осені', 'осінню'],
      ['m', 'Frühling', 'Frühlinge', 'Frühlings', 'весна', 'весну', 'весни', 'весною'],
      ['m', 'Urlaub', 'Urlaube', 'Urlaubs|Urlaubes', 'відпустка', 'відпустку', 'відпустки', 'відпусткою'],
      ['m', 'Geburtstag', 'Geburtstage', 'Geburtstags|Geburtstages', 'день народження', 'день народження', 'дня народження', 'днем народження'],
      ['m', 'Arbeitstag', 'Arbeitstage', 'Arbeitstags|Arbeitstages', 'робочий день', 'робочий день', 'робочого дня', 'робочим днем'],
      ['m', 'Kurs', 'Kurse', 'Kurses', 'навчальний курс', 'навчальний курс', 'навчального курсу', 'навчальним курсом'],
      ['m', 'Unterrichtstag', 'Unterrichtstage', 'Unterrichtstags|Unterrichtstages', 'навчальний день', 'навчальний день', 'навчального дня', 'навчальним днем'],
      ['m', 'Feiertag', 'Feiertage', 'Feiertags|Feiertages', 'святковий день', 'святковий день', 'святкового дня', 'святковим днем'],
      ['m', 'Ausflug', 'Ausflüge', 'Ausflugs|Ausfluges', 'екскурсія', 'екскурсію', 'екскурсії', 'екскурсією'],
      ['m', 'Besuch', 'Besuche', 'Besuchs|Besuches', 'візит', 'візит', 'візиту', 'візитом'],
      ['m', 'Aufenthalt', 'Aufenthalte', 'Aufenthalts|Aufenthaltes', 'перебування', 'перебування', 'перебування', 'перебуванням'],
      ['n', 'Wochenende', 'Wochenenden', 'Wochenendes', 'кінець тижня', 'кінець тижня', 'кінця тижня', 'кінцем тижня'],
      ['n', 'Treffen', 'Treffen', 'Treffens', 'зустріч', 'зустріч', 'зустрічі', 'зустріччю']
    ],
    people: [
      ['m', 'Chef', 'Chefs', 'Chefs', 'керівник', 'керівника', 'керівника', 'керівником'],
      ['f', 'Chefin', 'Chefinnen', 'Chefin', 'керівниця', 'керівницю', 'керівниці', 'керівницею'],
      ['m', 'Mitarbeiter', 'Mitarbeiter', 'Mitarbeiters', 'співробітник', 'співробітника', 'співробітника', 'співробітником'],
      ['f', 'Mitarbeiterin', 'Mitarbeiterinnen', 'Mitarbeiterin', 'співробітниця', 'співробітницю', 'співробітниці', 'співробітницею'],
      ['m', 'Ingenieur', 'Ingenieure', 'Ingenieurs', 'інженер', 'інженера', 'інженера', 'інженером'],
      ['f', 'Ingenieurin', 'Ingenieurinnen', 'Ingenieurin', 'інженерка', 'інженерку', 'інженерки', 'інженеркою'],
      ['m', 'Mechaniker', 'Mechaniker', 'Mechanikers', 'механік', 'механіка', 'механіка', 'механіком'],
      ['f', 'Mechanikerin', 'Mechanikerinnen', 'Mechanikerin', 'механікиня', 'механікиню', 'механікині', 'механікинею'],
      ['m', 'Bäcker', 'Bäcker', 'Bäckers', 'пекар', 'пекаря', 'пекаря', 'пекарем'],
      ['f', 'Bäckerin', 'Bäckerinnen', 'Bäckerin', 'пекарка', 'пекарку', 'пекарки', 'пекаркою'],
      ['m', 'Koch', 'Köche', 'Kochs|Koches', 'кухар', 'кухаря', 'кухаря', 'кухарем'],
      ['f', 'Köchin', 'Köchinnen', 'Köchin', 'кухарка', 'кухарку', 'кухарки', 'кухаркою'],
      ['m', 'Kunde', 'Kunden', 'Kunden', 'клієнт', 'клієнта', 'клієнта', 'клієнтом', { weak: 'Kunden' }],
      ['f', 'Kundin', 'Kundinnen', 'Kundin', 'клієнтка', 'клієнтку', 'клієнтки', 'клієнткою'],
      ['m', 'Patient', 'Patienten', 'Patienten', 'пацієнт', 'пацієнта', 'пацієнта', 'пацієнтом', { weak: 'Patienten' }],
      ['f', 'Patientin', 'Patientinnen', 'Patientin', 'пацієнтка', 'пацієнтку', 'пацієнтки', 'пацієнткою'],
      ['m', 'Polizist', 'Polizisten', 'Polizisten', 'поліцейський', 'поліцейського', 'поліцейського', 'поліцейським', { weak: 'Polizisten' }],
      ['f', 'Polizistin', 'Polizistinnen', 'Polizistin', 'поліцейська', 'поліцейську', 'поліцейської', 'поліцейською'],
      ['m', 'Fotograf', 'Fotografen', 'Fotografen', 'фотограф', 'фотографа', 'фотографа', 'фотографом', { weak: 'Fotografen' }],
      ['f', 'Fotografin', 'Fotografinnen', 'Fotografin', 'фотографка', 'фотографку', 'фотографки', 'фотографкою']
    ]
  };

  const upper = value => value.charAt(0).toUpperCase() + value.slice(1);
  // Each pair contains a German template and its Ukrainian translation.
  // Placeholders are intentionally explicit, so noun blanks cannot erase article blanks.
  const contexts = {
    documents: (ua, acc, gen) => ({
      nom: ['{a} {n} liegt in der Mappe.', `${upper(ua)} лежить у папці.`],
      akk: ['Bitte kopiere {a} {n} für mich.', `Будь ласка, скопіюй для мене ${acc}.`],
      dat: ['Ich brauche eine Kopie von {a} {n}.', `Мені потрібна копія ${gen}.`],
      gen: ['Eine Kopie {a} {n} liegt im Archiv.', `Копія ${gen} лежить в архіві.`]
    }),
    technology: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} funktioniert wieder.', `${upper(ua)} знову працює.`],
      akk: ['Die Technikerin prüft {a} {n}.', `Технікиня перевіряє ${acc}.`],
      dat: ['Es gibt ein Problem mit {a} {n}.', `Є проблема з ${ins}.`],
      gen: ['Die Funktion {a} {n} wird geprüft.', `Перевіряють роботу ${gen}.`]
    }),
    tools: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} fehlt noch auf der Einkaufsliste.', `У списку покупок ще немає ${gen}.`],
      akk: ['Ich kaufe {a} {n} im Fachgeschäft.', `Я купую ${acc} у спеціалізованому магазині.`],
      dat: ['Ich bin mit {a} {n} zufrieden.', `Я задоволений/задоволена ${ins}.`],
      gen: ['Die Verpackung {a} {n} ist aus Karton.', `Паковання ${gen} виготовлене з картону.`]
    }),
    kitchen: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} gehört in die Küche.', `Місце ${gen} — на кухні.`],
      akk: ['Ich brauche {a} {n} in der Küche.', `На кухні я потребую ${gen}.`],
      dat: ['Was machen wir mit {a} {n}?', `Що ми робитимемо з ${ins}?`],
      gen: ['Die Farbe {a} {n} gefällt mir.', `Мені подобається колір ${gen}.`]
    }),
    clothing: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} ist im Schaufenster zu sehen.', `У вітрині можна побачити ${acc}.`],
      akk: ['Im Geschäft probiere ich {a} {n} an.', `У магазині я приміряю ${acc}.`],
      dat: ['Ich bin mit {a} {n} zufrieden.', `Я задоволений/задоволена ${ins}.`],
      gen: ['Das Material {a} {n} fühlt sich weich an.', `Матеріал ${gen} м’який на дотик.`]
    }),
    places: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} liegt nicht weit vom Bahnhof.', `${upper(ua)} розташовується неподалік вокзалу.`],
      akk: ['Wir suchen {a} {n} auf dem Stadtplan.', `Ми шукаємо ${acc} на плані міста.`],
      dat: ['Wir treffen uns vor {a} {n}.', `Ми зустрінемося перед ${ins}.`],
      gen: ['Der Eingang {a} {n} ist auf der anderen Seite.', `Вхід до ${gen} розташований з іншого боку.`]
    }),
    transport: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} wird regelmäßig gewartet.', `${upper(acc)} регулярно обслуговують.`],
      akk: ['Die Mechanikerin repariert {a} {n}.', `Механікиня ремонтує ${acc}.`],
      dat: ['Es gibt ein technisches Problem mit {a} {n}.', `Є технічна проблема з ${ins}.`],
      gen: ['Die Reparatur {a} {n} dauert zwei Tage.', `Ремонт ${gen} триває два дні.`]
    }),
    body: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} tut mir weh.', `У мене болить ${ua}.`],
      akk: ['Die Ärztin untersucht {a} {n}.', `Лікарка оглядає ${acc}.`],
      dat: ['Mit {a} {n} stimmt etwas nicht.', `Із ${ins} щось не так.`],
      gen: ['Die Untersuchung {a} {n} dauert zehn Minuten.', `Обстеження ${gen} триває десять хвилин.`]
    }),
    time: (ua, acc, gen) => ({
      nom: ['{a} {n} ist schon vorbei.', `Час ${gen} уже минув.`],
      akk: ['Ich freue mich auf {a} {n}.', `Я з радістю чекаю на ${acc}.`],
      dat: ['Ich erzähle dir von {a} {n}.', `Я розповім тобі про ${acc}.`],
      gen: ['Ich erinnere mich an den Anfang {a} {n}.', `Я пам’ятаю початок ${gen}.`]
    }),
    people: (ua, acc, gen, ins) => ({
      nom: ['{a} {n} kommt heute später.', `${upper(ua)} сьогодні прийде пізніше.`],
      akk: ['Ich rufe {a} {n} morgen an.', `Я зателефоную завтра до ${gen}.`],
      dat: ['Ich spreche mit {a} {n} über den Termin.', `Я розмовляю з ${ins} про час зустрічі.`],
      gen: ['Die Telefonnummer {a} {n} steht in meinem Kalender.', `Номер телефону ${gen} записано в моєму календарі.`]
    })
  };
  const caseIds = { nom: 'case_nominativ', akk: 'case_akkusativ', dat: 'case_dativ', gen: 'case_genitiv' };
  const explanations = {
    nom: 'Підмет стоїть у Nominativ: der / die / das.',
    akk: 'Akkusativ: den / die / das. Чоловічий рід має артикль den.',
    dat: 'Dativ: dem / der / dem. Врахуй керування прийменника.',
    gen: 'Genitiv: des / der / des. Іменники чоловічого й середнього роду зазвичай додають -(e)s.'
  };
  const add = (id, sentence, forms, noun, ua, translation, level, explanation) => {
    const uniqueForms = [...new Set(forms)];
    const answers = [uniqueForms[0]];
    const item = { sentence, answers, answer: answers.join(' '), infinitive: noun,
      ua_infinitiv: ua, ua_sentence: translation, level, explanation };
    if (uniqueForms.length > 1) item.alternatives = uniqueForms.slice(1).map(form => [form]);
    result[id].push(item);
  };
  const render = (template, article, noun) => template.replace('{a}', article).replace('{n}', noun);

  for (const [theme, rows] of Object.entries(vocabulary)) {
    for (const [gender, noun, pluralText, genitiveText, ua, acc, gen, ins, options = {}] of rows) {
      const pluralForms = pluralText.split('|');
      const genitiveForms = genitiveText.split('|');
      const oblique = options.weak || noun;
      const caseForms = { nom: noun, akk: oblique, dat: oblique, gen: genitiveForms[0] };
      const phrases = contexts[theme](ua, acc, gen, ins);
      const basicLevel = ['clothing', 'kitchen', 'body', 'people'].includes(theme) ? 'A1' : 'A2';
      for (const [grammaticalCase, [template, translation]] of Object.entries(phrases)) {
        const article = articles[gender][grammaticalCase];
        const atStart = template.startsWith('{a}');
        const articleForms = [atStart ? upper(article) : article];
        if (options.otherGender) {
          const alternate = articles[options.otherGender][grammaticalCase];
          articleForms.push(atStart ? upper(alternate) : alternate);
        }
        let explanation = explanations[grammaticalCase];
        if (noun === 'Laptop') explanation += ' Laptop допускає обидва роди: der Laptop і das Laptop.';
        if (theme === 'time' && grammaticalCase === 'akk') explanation += ' Sich freuen auf + Akkusativ: чекати на щось із радістю.';
        if (theme === 'places' && grammaticalCase === 'dat') explanation += ' Vor + Dativ позначає місце зустрічі: де?';
        const level = grammaticalCase === 'gen' ? 'B1' : grammaticalCase === 'dat' ? 'A2' : basicLevel;
        add(caseIds[grammaticalCase], render(template, '___', caseForms[grammaticalCase]), articleForms,
          noun, ua, translation, level, explanation);
        if (grammaticalCase === 'nom' || grammaticalCase === 'akk') {
          add('nomen', render(template, atStart ? upper(article) : article, '___'), [caseForms[grammaticalCase]],
            noun, ua, translation, options.weak && grammaticalCase === 'akk' ? 'A2' : basicLevel,
            options.weak && grammaticalCase === 'akk'
              ? `${noun} належить до слабкого відмінювання: Akkusativ den ${oblique}.`
              : `Іменник: ${articles[gender].nom} ${noun}; множина: die ${pluralForms.join(' / ')}.`);
        }
      }
      add('noun_plurals', `${noun} → die ___`, pluralForms, noun, ua,
        `Утвори множину слова «${ua}».`, basicLevel,
        `Множина: die ${pluralForms.join(' / ')}. ${noun === 'Wagen' ? 'Wägen — також нормативний південнонімецький та австрійський варіант.' : 'Запам’ятовуй форму разом з іменником.'}`);
      const [genTemplate, genTranslation] = phrases.gen;
      add('noun_declension', render(genTemplate, articles[gender].gen, '___'), genitiveForms,
        noun, ua, genTranslation, 'B1',
        options.weak ? `Слабке відмінювання: des ${genitiveForms[0]}.`
          : gender === 'f' ? 'У Genitiv однини іменник жіночого роду не додає закінчення; артикль змінюється на der.'
            : `Genitiv: des ${genitiveForms.join(' / ')}.`);
      const dativePlurals = options.dativePlurals || pluralForms.map(form => /[ns]$/u.test(form) ? form : form + 'n');
      add('noun_declension', `Nominativ: die ${pluralForms.join(' / ')} → Dativ: den ___`, dativePlurals,
        noun, ua, `Утвори Dativ множини слова «${ua}».`, 'A2',
        noun === 'Visum' ? 'Латинська множина Visa не додає -n: den Visa. Для варіанта Visen: den Visen.'
          : 'Dativ множини додає -n, якщо форма ще не закінчується на -n або -s.');
      if (options.weak) {
        for (const grammaticalCase of ['akk', 'dat']) {
          const [template, translation] = phrases[grammaticalCase];
          add('noun_declension', render(template, articles[gender][grammaticalCase], '___'), [oblique],
            noun, ua, translation, 'A2', `${noun}: слабке відмінювання, форма ${oblique} в Akkusativ і Dativ.`);
        }
      }
    }
  }
  return result;
})();
