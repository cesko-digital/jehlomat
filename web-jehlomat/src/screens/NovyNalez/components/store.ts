import { atom } from 'recoil';
import { LatLngExpression } from 'leaflet';
import dayjs from 'dayjs';
import { JehlaState } from 'screens/NovyNalez/components/types';
import { StepsEnum } from 'screens/NovyNalez/components/types';
import { DEFAULT_POSITION } from 'screens/NovyNalez/constants';

export const mapUserPositionState = atom<LatLngExpression | null>({
    key: 'mapUserPosition',
    default: null,
});

export const mapPositionState = atom<LatLngExpression>({
    key: 'mapPosition',
    default: DEFAULT_POSITION,
});

export const newSyringeStepState = atom<StepsEnum>({
    key: 'newSyringeStep',
    default: StepsEnum.Start,
});

export const newSyringeInfoState = atom<JehlaState>({
    key: 'newSyringeInfo',
    default: { lat: undefined, lng: undefined, info: '', datetime: dayjs().unix(), count: undefined, photo: undefined },
});
