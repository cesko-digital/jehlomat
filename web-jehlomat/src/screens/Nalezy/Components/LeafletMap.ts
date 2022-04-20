import {styled} from "@mui/system";
import {MapContainer} from "react-leaflet";

const LeafletMap = styled(MapContainer)({
    flexGrow: 1,
    outline: 'none',
});

export default LeafletMap;
