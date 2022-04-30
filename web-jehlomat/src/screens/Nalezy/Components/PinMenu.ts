import { styled } from '@mui/system';
import { Popup } from 'react-leaflet';

export const PinMenu = styled(Popup)({
    '& > .leaflet-popup-content-wrapper': {
        overflow: 'hidden',
        padding: 0,
    },

    '& > .leaflet-popup-content-wrapper > .leaflet-popup-content': {
        margin: 0,
        overflow: 'hidden',
    },
});

export const Info = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '24px 24px',
    background: 'rgba(47, 166, 154, 0.1)',
});

export const Location = styled('div')({
    alignSelf: 'end',
    gridColumn: '1',
    gridRow: '1',
    justifySelf: 'start',
    padding: '0 8px',
});

export const Time = styled('div')({
    alignSelf: 'end',
    gridColumn: '2',
    gridRow: '1',
    justifySelf: 'end',
    padding: '0 8px',
});

export const State = styled('div')({
    alignSelf: 'center',
    gridColumn: '1 / span 2',
    gridRow: '2',
    justifySelf: 'start',
    padding: '0 8px',
});
