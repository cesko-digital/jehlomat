export const PAGE_TITLE = 'O Jehlomatu';

export const STATISTICS = [
    {
        icon: 'user' as const,
        number: '18',
        text: 'Organizací',
    },
    {
        icon: 'syringe' as const,
        number: '13 000',
        text: 'Nalezených stříkaček',
    },
    {
        icon: 'users' as const,
        number: '22',
        text: 'Týmů',
    },
];

export const GENERAL_INFORMATION = {
    title: 'Základní informace',
    text: `
    <p>Jehlomat.cz vznikl v roce 2014 jako <b>nástroj pro evidenci a následnou analýzu dat
    o nálezech injekčních stříkaček pro terénní pracovníky.</b></p>

    <p>Vznikl pod záštitou neziskové organizace <a href="http://magdalena-ops.eu/cz/">Magdaléna o.p.s.</a>,
    která již více než 23 let poskytuje systém služeb v oblasti prevence
    a léčby různých typů závislostí.</p>
    
    <p>Ve spolupráci s vývojáři a designéry <a href="https://cesko.digital/projects/jehlomat">Česko.Digital</a> jsme na začátku
    roku 2022 spustili aktualizovaný web Jehlomat.cz. Nyní slouží terénním pracovníkům,
    ale i široké veřejnosti. A každý tak může jednoduše nahlásit nález odhozené injekční stříkačky.</p>
  `,
};

export const ANONYMOUS_REPORTING = {
    title: 'Anonymní hlášení nálezů odhozených stříkaček',
    text: `
    <p>Kdokoliv může anonymně nahlásit nález odhozené injekční stříkačky na Jehlomat.cz,
    lokalizovat ho a sdílet jeho fotografii v reálném čase.</p>

    <p>Tím šetří čas terénním pracovníkům při jeho likvidaci, a
    pomáhá ke zvyšování bezpečí ve svém okolí.</p>
  `,
};

export const JEHLOMAT_FOR_ORGANIZATION = {
    title: 'Uživatelský profil organizace na Jehlomat.cz',
    text: `
    <p>Na Jehlomat.cz se mohou registrovat organizace působící v oblasti prevence
    a léčby různých typů závislostí a Městská policie. Po registraci vaší organizace
    můžete vytvářet účty pro terénní pracovníky a jejich týmy.</p>
    
    <p>Díky registraci na Jehlomat.cz získáte:</p>

    <p>1) Evidenci míst, kde dochází k nálezům včetně mapové vizualizace</p>
    <p>2) Možnost reagovat na podněty veřejnosti</p>
    <p>3) Možnost koordinace sběru nálezů ve stejné lokalitě mezi organizacemi</p>
  `,
};
