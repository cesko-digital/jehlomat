export const BREAKPOINTS = {
    XS: 320,
    SM: 599,
    MD: 868,
    LG: 1024,
    XL: 1440,
    XXL: 1600,
    mobile: 0,
    tablet: 0,
    laptop: 1280,
};

BREAKPOINTS.mobile = BREAKPOINTS.SM;
BREAKPOINTS.tablet = BREAKPOINTS.LG;

export const media = {
    gt: (key: keyof typeof BREAKPOINTS) => `(min-width: ${BREAKPOINTS[key] + 1}px)`,
    lte: (key: keyof typeof BREAKPOINTS) => `(max-width: ${BREAKPOINTS[key]}px)`,
};
