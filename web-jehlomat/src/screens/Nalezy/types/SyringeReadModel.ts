import {Syringe} from "./Syringe";

export interface SyringeReadModel {
    syringeList: Syringe[];
    pageInfo: {
        index: number;
        size: number;
        hasMore: boolean;
    };
}
