import { atom, selectorFamily } from 'recoil';
import { PageInfo } from './types/PageInfo';
import { Order } from './types/Order';
import { Filtering } from './types/Filtering';
import { SortableColumn } from './types/SortableColumn';
import { SortDirection } from './types/SortDirection';

export const paginationState = atom<PageInfo>({
    key: '[nalezy] page info',
    default: { index: 0, size: 20 },
});

export const sortingState = atom<Order[]>({
    key: '[nalezy] sorting',
    default: [],
});

export const filteringState = atom<Filtering>({
    key: '[nalezy] filtering',
    default: {},
});

export const columnSortingDirection = selectorFamily({
    key: '[nalezy] sort direction for given column',
    get:
        (column: SortableColumn) =>
        ({ get }): SortDirection => {
            const values = get(sortingState);
            const current = values.find(o => o.column === column);
            if (!current) return undefined;

            return current.direction;
        },
});
