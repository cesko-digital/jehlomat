import Layout from './Components/Layout/Layout';
import { lazy, ComponentType, LazyExoticComponent } from 'react';
import ZapomenuteHeslo from 'screens/ZapomenuteHeslo/zapomenuteHeslo';
import ZapomenuteHesloPotvrzeni from 'screens/ZapomenuteHeslo/zapomenuteHesloPotvrzeni';

const Prihlaseni = lazy(() => import('./screens/Prihlaseni/Prihlaseni'));
const Welcome = lazy(() => import('./screens/Prihlaseni/Welcome')); // Temp welcome
const Profil = lazy(() => import('./screens/Profil/Profil'));
const NovyNalez = lazy(() => import('screens/Nalezy/NovyNalez/NalezContainer'));
const NovyNalezInit = lazy(() => import('screens/Nalezy/NovyNalez/NovyNalezInit'));
const Organizace = lazy(() => import('./screens/Organizace/Organizace'));
const Nalezy = lazy(() => import('./screens/Nalezy/Nalezy'));
const Detail = lazy(() => import('./screens/Nalezy/Detail'));
const EditNalez = lazy(() => import('./screens/Nalezy/Edit'));
const NahlasitNalezPolicii = lazy(() => import('./screens/Navody/NotifyPolice'));
const DekujemeOrganizace = lazy(() => import('./screens/RegistraceOrganizace/Dekujeme'));
const RegistraceOrganizace = lazy(() => import('./screens/RegistraceOrganizace/RegistraceOrganizace'));
const CekaniNaSchvaleni = lazy(() => import('./screens/RegistraceOrganizace/CekaniNaSchvaleni'));
const RegistraceUzivatele = lazy(() => import('./screens/RegistraceUzivatele/RegistraceUzivatele'));
const OrganizationVerification = lazy(() => import('./screens/OrganizationVerification/OrganizationVerification'));
const OvereniEmailu = lazy(() => import('./screens/RegistraceUzivatele/OvereniEmailu'));
const SetNewPassword = lazy(() => import('./screens/SetNewPassword/SetNewPassword'));
const Team = lazy(() => import('./screens/Team/Team'));
const DekujemeUzivatel = lazy(() => import('./screens/RegistraceUzivatele/Dekujeme'));
const SeznamUzivatelu = lazy(() => import('./screens/SeznamUzivatelu/SeznamUzivatelu'));
const EditaceUzivatele = lazy(() => import('./screens/EditaceUzivatele/EditaceUzivatele'));
const PridatUzivatele = lazy(() => import('./screens/RegistraceUzivatele/PridatUzivatele'));
const ErrorPage = lazy(() => import('./screens/ErrorPage/ErrorPage'));
const TrackovaniNalezu = lazy(() => import('./screens/TrackovaniNalezu/TrackovaniNalezu'));
const LandingPage = lazy(() => import('./screens/LandingPage'));
const NavodLikvidace = lazy(() => import('./screens/Navody/NavodLikvidace'));
const About = lazy(() => import('./screens/AboutPage'));
const Contact = lazy(() => import('./screens/ContactPage'));
const FAQPage = lazy(() => import('./screens/FAQ'));
const OrganizationAdminVerification = lazy(() => import('./screens/OrganizationAdminVerification/OrganizationAdminVerification'));
const SeznamOrganizaci = lazy(() => import('./screens/OrganizaceSeznam/OrganizaceSeznam'));

export enum Routes {
    HOME = 'HOME',
    LOGIN = 'LOGIN',
    USER = 'USER',
    USER_NEW = 'USER_NEW',
    USER_EDIT = 'USER_EDIT',
    USER_VALIDATION = 'USER_VALIDATION',
    USER_REGISTRATION = 'USER_REGISTRATION',
    USER_THANK_YOU = 'USER_THANK_YOU',
    USER_SET_NEW_PASSWORD = 'USER_SET_NEW_PASSWORD',
    ORGANIZATION = 'ORGANIZATION',
    ORGANIZATION_REGISTRATION = 'ORGANIZATION_REGISTRATION',
    ORGANIZATION_WAITING_FOR_APPROVAL = 'ORGANIZATION_WAIT_FOR_APPROVAL',
    ORGANIZATION_THANK_YOU = 'ORGANIZATION_THANK_YOU',
    ORGANIZATIONS = 'ORGANIZATIONS',
    PROFILE = 'PROFILE',
    NEW_FIND_INIT = 'NEW_FIND_INIT',
    NEW_FIND = 'NEW_FIND',
    FINDINGS = 'FINDINGS',
    FINDINGS_MAPA = 'FINDINGS_MAPA',
    FINDING_DETAILS = 'FINDING_DETAILS',
    FINDINGS_NOTIFY_POLICE = 'FINDINGS_NOTIFY_POLICE',
    EDIT_FINDING = 'EDIT_FINDING',
    ERROR = 'ERROR',
    TRACKING_FIND = 'TRACKING_FIND',
    WELCOME = 'WELCOME',
    DISPOSAL_INSTRUCTIONS = 'DISPOSAL_INSTRUCTIONS',
    FORGOTTEN_PASSWORD = 'FORGOTTEN_PASSWORD',
    FORGOTTEN_PASSWORD_SUCCESS = 'FORGOTTEN_PASSWORD_SUCCESS',
    ABOUT = 'ABOUT',
    FAQ = 'FAQ',
    CONTACT = 'CONTACT',
    ORGANIZATION_CONFIRMATION = 'ORGANIZATION_CONFIRMATION',
    ORGANIZATION_ADMIN_CONFIRMATION = 'ORGANIZATION_ADMIN_CONFIRMATION',
    ORGANIZATION_EDIT = 'ORGANIZATION_EDIT',
    TEAM = 'TEAM',
}

interface Route {
    id: Routes;
    Component: LazyExoticComponent<any>;
    AdditionalComponents?: ComponentType;
    path: string | Function;
    protectedRoute?: boolean;
    exact?: boolean;
    title?: string;
    /*
     * In case of protectedRoute, remembers previous URL
     * and redirects to it after successfull login
     * Valid if protectedRoute is truthy
     */
    from?: boolean;
    redirectOnLogout?: boolean;
    redirectOnLogoutPath?: string;
}

const USER_URL_PATH_ = 'uzivatel';
export const ORGANIZATION_URL_PATH = 'organizace';
const FINDINGS_URL_PATH = 'nalezy';
export const LOGIN_URL_PATH = 'prihlaseni';
export const TEAM_URL_PATH = 'team';
export const HOME_PATH = '/';

export const routes: Route[] = [
    {
        id: Routes.LOGIN,
        Component: Prihlaseni,
        path: `/${LOGIN_URL_PATH}`,
    },
    {
        id: Routes.USER_SET_NEW_PASSWORD,
        Component: SetNewPassword,
        path: `/${USER_URL_PATH_}/heslo`,
    },
    {
        id: Routes.USER_NEW,
        Component: PridatUzivatele,
        path: `/${USER_URL_PATH_}/novy`,
        protectedRoute: true,
        title: 'Přidat uživatele',
    },
    {
        id: Routes.USER_EDIT,
        Component: EditaceUzivatele,
        path: `/${USER_URL_PATH_}/upravit/:userId`,
        protectedRoute: true,
        title: 'Editace uživatele',
        AdditionalComponents: Layout,
    },
    {
        id: Routes.USER_VALIDATION,
        Component: OvereniEmailu,
        path: `/${USER_URL_PATH_}/validace/:email`,
    },
    {
        id: Routes.USER_REGISTRATION,
        Component: RegistraceUzivatele,
        path: `/${USER_URL_PATH_}/registrace`,
        from: true,
    },
    {
        id: Routes.USER_THANK_YOU,
        Component: DekujemeUzivatel,
        path: `/${USER_URL_PATH_}/dekujeme`,
    },
    {
        id: Routes.USER,
        Component: SeznamUzivatelu,
        path: `/${USER_URL_PATH_}`,
        protectedRoute: true,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.ORGANIZATION_REGISTRATION,
        Component: RegistraceOrganizace,
        path: `/${ORGANIZATION_URL_PATH}/registrace`,
    },
    {
        id: Routes.ORGANIZATION_THANK_YOU,
        Component: DekujemeOrganizace,
        path: `/${ORGANIZATION_URL_PATH}/dekujeme`,
        redirectOnLogout: true,
    },
    {
        id: Routes.ORGANIZATION_WAITING_FOR_APPROVAL,
        Component: CekaniNaSchvaleni,
        path: `/${ORGANIZATION_URL_PATH}/cekani-na-schvaleni`,
        redirectOnLogout: true,
    },
    {
        id: Routes.ORGANIZATION_CONFIRMATION,
        Component: OrganizationVerification,
        path: `/${ORGANIZATION_URL_PATH}/povoleni/:orgId?`,
        protectedRoute: true,
        from: true,
    },
    {
        id: Routes.ORGANIZATION_ADMIN_CONFIRMATION,
        Component: OrganizationAdminVerification,
        path: `/${ORGANIZATION_URL_PATH}/admin/povoleni/`,
    },
    {
        id: Routes.ORGANIZATIONS,
        Component: SeznamOrganizaci,
        path: `/${ORGANIZATION_URL_PATH}/seznam`,
        protectedRoute: true,
        from: true,
        exact: true,
    },
    {
        id: Routes.ORGANIZATION,
        Component: Organizace,
        path: `/${ORGANIZATION_URL_PATH}/:orgId?`,
        protectedRoute: true,
        from: true,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.TEAM,
        Component: Team,
        path: `/${TEAM_URL_PATH}/novy`,
        protectedRoute: true,
        from: true,
    },
    {
        id: Routes.TEAM,
        Component: Team,
        path: `/${TEAM_URL_PATH}/edit/:teamId?`,
        protectedRoute: true,
        from: true,
    },
    {
        id: Routes.PROFILE,
        Component: Profil,
        path: '/profil',
        AdditionalComponents: Layout,
    },
    {
        id: Routes.NEW_FIND_INIT,
        Component: NovyNalezInit,
        path: `/${FINDINGS_URL_PATH}/novy-nalez-init`,
    },
    {
        id: Routes.NEW_FIND,
        Component: NovyNalez,
        path: `/${FINDINGS_URL_PATH}/novy-nalez`,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.TRACKING_FIND,
        Component: TrackovaniNalezu,
        path: `/${FINDINGS_URL_PATH}/trackovani-nalezu/:trackId?`,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.TRACKING_FIND,
        Component: TrackovaniNalezu,
        path: `/${FINDINGS_URL_PATH}/trackovani-nalezu`,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.FINDING_DETAILS,
        Component: Detail,
        path: `/${FINDINGS_URL_PATH}/detail/:id`,
        exact: true,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.EDIT_FINDING,
        Component: EditNalez,
        path: `/${FINDINGS_URL_PATH}/edit/:id`,
        exact: true,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.FINDINGS_MAPA,
        Component: Nalezy,
        path: `/${FINDINGS_URL_PATH}/mapa`,
        exact: true,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.FINDINGS,
        Component: Nalezy,
        path: `/${FINDINGS_URL_PATH}`,
        AdditionalComponents: Layout,
    },
    {
        id: Routes.ERROR,
        Component: ErrorPage,
        path: '/error',
    },
    {
        id: Routes.DISPOSAL_INSTRUCTIONS,
        Component: NavodLikvidace,
        path: '/navod-likvidace',
    },
    {
        id: Routes.FINDINGS_NOTIFY_POLICE,
        Component: NahlasitNalezPolicii,
        path: `/nahlasit-nalez-policii`,
    },
    {
        id: Routes.FORGOTTEN_PASSWORD,
        Component: LandingPage,
        path: '/zapomenute-heslo',
        AdditionalComponents: ZapomenuteHeslo,
    },
    {
        id: Routes.FORGOTTEN_PASSWORD_SUCCESS,
        Component: LandingPage,
        path: '/zapomenute-heslo-potvrzeni',
        AdditionalComponents: ZapomenuteHesloPotvrzeni,
    },
    {
        id: Routes.USER_THANK_YOU,
        Component: Welcome,
        path: '/vitejte',
    },
    {
        id: Routes.ABOUT,
        Component: About,
        path: '/o-jehlomatu',
    },
    {
        id: Routes.FAQ,
        Component: FAQPage,
        path: '/faq',
    },
    {
        id: Routes.CONTACT,
        Component: Contact,
        path: '/kontakt',
    },
    {
        id: Routes.HOME,
        Component: LandingPage,
        path: '/',
    },
];

export type Links = {
    [key in keyof typeof Routes]: Route['path'];
};

export const routesById = routes.reduce<Partial<Record<Routes, Route>>>((obj, route) => {
    obj[route.id] = route;
    return obj;
}, {});

// USE this to get url to some page
// i.e. LINKS.LOGIN
export const LINKS = Object.values(Routes).reduce<Record<Routes, string>>((obj, key) => {
    const route = routesById[key];
    if (route) {
        obj[key] = typeof route?.path == 'string' ? route?.path : '';
    } else {
        obj[key] = '';
    }
    return obj;
}, {} as Record<Routes, string>);

export const LINKS_WITH_PARAMS = routes.reduce<Partial<Record<Routes, Function>>>((obj, { id, path }) => {
    if (typeof path === 'function') obj[id] = path;
    return obj;
}, {});
