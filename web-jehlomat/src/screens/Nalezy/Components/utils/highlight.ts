import { Syringe } from '../../types/Syringe';

const HIGHLIGHT_DEFAULT_COLOR = 'rgba(217, 217, 217, 1)';
const HIGHLIGHT_WAITING_COLOR = 'rgba(254, 171, 13, 1)';

const highlight = (syringe: Syringe) => {
    if (!syringe.demolished && !syringe.reservedBy) return HIGHLIGHT_WAITING_COLOR;

    return HIGHLIGHT_DEFAULT_COLOR;
};

export default highlight;
