import { Range } from './Range';
import { ReporterType } from './ReporterType';

export interface Filtering {
    createdAt?: Range;
    createdBy?: {
        id: number;
        type: ReporterType;
    };
    demolishedAt?: Range;
    status?: string;
}
