export const sizeUnit = 4;
export const units = 'px';

export function size(value: number, displayUnits = true) {
    const multipliedValue = value * sizeUnit;
    if (displayUnits) {
        return multipliedValue + units;
    } else {
        return multipliedValue;
    }
}

export function spaceY(x: number | string) {
    const value = typeof x === 'number' ? size(x) : x;
    return {
        '& > :not(style) ~ *:not(style)': { marginTop: value },
    };
}

export function spaceX(x: number | string) {
    const value = typeof x === 'number' ? size(x) : x;
    return {
        '& > :not(style) ~ *:not(style)': { marginLeft: value },
    };
}

export function space(x: number | string, y: number | string) {
    const xVal = typeof x === 'number' ? size(x) : x;
    const yVal = typeof y === 'number' ? size(y) : y;
    return {
        '& > :not(style) ~ *:not(style)': { marginTop: yVal, marginLeft: xVal },
    };
}
