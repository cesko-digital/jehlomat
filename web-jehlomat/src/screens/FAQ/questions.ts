export type TQuestion = {
    question: string;
    answer: string; // html
};

export const questions: TQuestion[] = [
    {
        question: 'Co když někde najdu odhozenou injekční stříkačku?',
        answer: 'Zadejte její polohu, případně i s fotkou, na Jehlomat.cz. Jestliže v dané lokalitě terénní pracovníci ani městská policie Jehlomat.cz nepoužívá, zavolejte strážníky telefonicky (156). ',
    },
    {
        question: 'Co když se na stejném místě vyskytují stříkačky často?',
        answer: 'Exponovaná místa kontrolují pracovníci pravidelně. Není však v jejich možnostech monitorovat daná místa nonstop.',
    },
    {
        question: 'Mám čekat na příjezd terénního pracovníka?',
        answer: 'Jestliže jste nález zadali na webu Jehlomat.cz, tak nemusíte. Pracovníci se o něm dozví díky tomuto online nástroji.',
    },
    {
        question: 'Jak se dozvím že stříkačka byla bezpečně zlikvidována?',
        answer: 'Po zadání na Jehlomat.cz se vám zobrazí trackovací kód, pomocí kterého si můžete zpětně ověřit, zdali je již nález injekční stříkačky zlikvidován.',
    },
    {
        question: 'Co když najdu víčko, nebo jiné příslušenství?',
        answer: 'Samotné víčko či další věci, které se používají při injekční aplikaci, nejsou nijak nebezpečné.',
    },
    {
        question: 'Co dělat, poraním-li se o pohozenou injekční stříkačku?',
        answer: `
      <ol>
        <li>Zachovejte klid. Riziko nákazy je velmi malé.</li>
        <li>Bezprostředně po poranění nechte ranku volně krvácet (krvácení sníží dávku případného viru). Ranku nemačkejte!</li>
        <li>Po zastavení krvácení ranku důkladně vymyjte vodou a mýdlem a ošetřete dezinfekčním roztokem – nejlépe Jodisolem. Tento roztok má antiseptický a protivirový účinek.</li>
        <li>Co nejdříve vyhledejte praktického lékaře, lékaře hygienické stanice či nejbližší infekční oddělení nemocnice.</li>
      </ol>
      <p>Lékař provede vyšetření krve na virové žloutenky typu A, B a C a vyšetření na infekci virem HIV.</p>
      <p>Poté zhodnotí váš imunitní stav a v odůvodněných případech zajistí očkování proti žloutence typu A i B v souladu s platnou legislativou (proti žloutence typu C není dosud očkovací látka k dispozici). Podle charakteru poranění vám může být nabídnuto krátkodobé preventivní (profylaktické) podávání léků s cílem omezit riziko infekce virem HIV (proti viru HIV není též očkovací látka k dispozici).</p>
    `,
    },
    {
        question: 'Můžu stříkačku vyhodit do koše?',
        answer: `
      <p>Injekční stříkačka spadá do kategorie nebezpečný (ostrý) odpad.</p>
      <p>Do popelnice na komunální odpad nepatří, ale v případě, že není jiná možnost, je lepší zajištěnou stříkačku (v neprodyšném obalu) vyhodit do koše, než nechat ležet na ulici. Lépe je však využít speciální kontejnery <a href="https://www.progressive-os.cz/fixpoint/#mapa">Fixpoint</a> (Praha) či sběrné dvory nebo K-centra.</p>
      <p>Všechna tato místa lze nalézt na webu <a href="https://www.kamsnim.cz/categories/jehly">Kam s ním</a>?</p>
    `,
    },
    {
        question: 'Jak stříkačku v případě nouze bezpečně zlikvidovat?',
        answer: `
      <p>Likvidaci nechte na odbornících.<br/>Když však není vyhnutí, postupujte dle těchto kroků:</p>
      <ol>
        <li>Připravte si neprodyšnou nádobu (lahev, sklenici, plechovku).</li>
        <li>Uchopte injekční stříkačku pomocí jednorázového papírového kapesníku na druhém konci než je jehla.</li>
        <li>Vložte injekční stříkačku jehlou napřed do otevřené nádoby.</li>
        <li>Zavíčkujte lahev/sklenici (sešlápněte plechovku).</li>
        <li>Zajištěnou stříkačku odneste do nejbližšího <a href="https://www.drogy-info.cz/mapa-pomoci/?t=2&r=#result">kontaktního centra</a>, na služebnu městské policie či do sběrného dvoru. V krajním případě vyhoďte do koše.</li>
        <li>U injekčních stříkaček neulamujte jehly. Mohlo by dojít k náhodnému poranění.</li>
      </ol>
    `,
    },
];
