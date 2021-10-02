import { FC, Fragment } from "react";
import ZadatNalezMapa from "./ZadatNalezMapa";

interface INovyNalez {}

const NovyNalez: FC<INovyNalez> = ({}) => {
  return (
    <Fragment>
      <div>NovyNalez</div>
      <ZadatNalezMapa />
    </Fragment>
  );
};

export default NovyNalez;
