import { useEffect } from 'react';
import { LINKS } from 'routes';

import { useResetRecoilState } from 'recoil';
import { mapPositionState, newSyringeInfoState, newSyringeStepState } from 'screens/Nalezy/NovyNalez/components/store';
import { useHistory } from 'react-router-dom';

const NovyNalezInit = () => {
    const resetCurrentStep = useResetRecoilState(newSyringeStepState);
    const resetSyringeInfo = useResetRecoilState(newSyringeInfoState);
    const resetMapPosition = useResetRecoilState(mapPositionState);
    const history = useHistory();

    useEffect(() => {
        resetCurrentStep();
        resetSyringeInfo();
        resetMapPosition();
        history.replace(LINKS.NEW_FIND);
    }, []);

    return null;
};

export default NovyNalezInit;
