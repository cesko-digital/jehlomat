import L, { Icon } from 'leaflet';
import { SyringeState } from 'screens/Nalezy/types/SyringeState';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import gray from 'assets/pins/pin-gray.svg';
import green from 'assets/pins/pin-green.svg';
import yellow from 'assets/pins/pin-yellow.svg';

const map: Record<SyringeState, Icon | null> = {
    RESERVED: L.icon({
        iconUrl: green,
        iconAnchor: [30, 60],
    }),
    DEMOLISHED: L.icon({
        iconUrl: gray,
        iconAnchor: [30, 60],
    }),
    WAITING: L.icon({
        iconUrl: yellow,
        iconAnchor: [30, 60],
    }),
    '': null,
};

const deriveStateOf = (syringe: Syringe): SyringeState => {
    if (syringe.demolishedAt && syringe.demolished) {
        return 'DEMOLISHED';
    }

    if (syringe.reservedBy) {
        return 'RESERVED';
    }

    return 'WAITING';
};

const pin = (syringe: Syringe): Icon | null => {
    const state = deriveStateOf(syringe);

    return map[state];
};

export default pin;
