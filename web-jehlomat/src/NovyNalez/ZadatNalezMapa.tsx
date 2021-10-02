import { FC, Fragment, useEffect, useState } from "react";
import ZapnoutPolohu from "./fragments/ZapnoutPolohu";
import Mapa from "./fragments/Mapa";

function getUsersGeolocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => console.log(position),
    (positionError) => console.log(positionError)
  );
}

interface IZadatNalezMapa {}

const ZadatNalezMapa: FC<IZadatNalezMapa> = () => {
  const [geoAvailible, setGeoAvailible] = useState<boolean | null>(null);
  useEffect(() => {
    if ("geolocation" in navigator) {
      setGeoAvailible(true);
      console.log("Available");
      // getUsersGeolocation();
    } else {
      setGeoAvailible(false);
      console.log("Not Available");
    }
  }, []);
  return (
    <Fragment>
      <div>
        <ZapnoutPolohu />
        <Mapa />
      </div>
    </Fragment>
  );
};

export default ZadatNalezMapa;
