import { assertUnreachable } from './errors';

// colors
export const primary = '#26A69A';
export const primaryLight = '#64D8CB';
export const primaryDark = '#0e766c';

export const secondary = '#FEAB0D';
export const secondaryLight = '#FFDD4F';
export const secondaryDark = '#C57C00';

export const white = '#fff';
export const black = '#000';
export const grey = '#787878';
export const greyLight = '#E0E0E0';
export const darkGrey = '#787878';

// text
export const textPrimary = black;
export const textSecondary = black;
export const textGold = '#FEAB0D';
export const textSubTitles = '#0E766C';

export function secondaryColorVariant(variant: 'light' | 'regular' | 'dark' | 'full') {
    switch (variant) {
        case 'light':
            return '#2FA69A29';
        case 'regular':
            return '#2FA69A3D';
        case 'dark':
            return '#2FA69A52';
        case 'full':
            return '#2FA69A';
        default:
            assertUnreachable(variant);
    }
}
