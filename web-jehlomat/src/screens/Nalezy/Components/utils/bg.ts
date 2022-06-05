import { Syringe } from '../../types/Syringe';

const BG_WAITING_COLOR = 'rgba(254, 171, 13, 0.1)';

const bg = (syringe: Syringe) => {
    if (!syringe.demolished && !syringe.reservedTill) return BG_WAITING_COLOR;

    return 'transparent';
};

export default bg;
