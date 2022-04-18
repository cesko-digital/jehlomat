import { Filtering } from './Filtering';
import { PageInfo } from './PageInfo';
import { Order } from './Order';

export interface GridFilter {
    pageInfo: PageInfo;
    ordering: Order[];
    filter: Filtering;
}
