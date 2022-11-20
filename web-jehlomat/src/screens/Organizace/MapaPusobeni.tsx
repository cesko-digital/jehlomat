import BasicMap from 'Components/BasicMap/BasicMap';
import { ILocation, ITeam } from 'types';

interface MapaPusobeniPrps {
    data: ITeam[] | null | undefined;
}

const MapaPusobeni: React.FC<MapaPusobeniPrps> = ({ data }) => {
    const locations: ILocation[] = [];
    data?.forEach((team: ITeam) => {
        team.locations.forEach(location => {
            if (location.mestkaCast) {
                locations.push({ id: location.mestkaCast, type: 'MC' });
            } else if (location.obec) {
                locations.push({ id: location.obec, type: 'OBEC' });
            } else if (location.okres) {
                locations.push({ id: location.okres, type: 'OKRES' });
            }
        });
    });

    return <BasicMap borderRadius={10} location={locations} />;
};

export default MapaPusobeni;
