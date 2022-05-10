import { Syringe } from './Syringe';
import { PageInfo } from './PageInfo';

export interface SyringeReadModel {
    syringeList: Syringe[];
    pageInfo: PageInfo;
}
