import { styled } from '@mui/system';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = styled(MapContainer)({
    flexGrow: 1,
    height: '100%',
    outline: 'none',
    zIndex: 0,
    position: 'relative',
});

export default LeafletMap;
