import { atom, selectorFamily } from 'recoil';
import { IOrganizace } from 'types';

export type SortableColumn = 'name' | 'verified';
export type SortDirection = 'ASC' | 'DESC' | undefined;

export interface Order {
    column: SortableColumn;
    direction: 'ASC' | 'DESC';
}

export const sortingState = atom<Order[]>({
    key: '[organizace] sorting',
    default: [],
});

export const columnSortingDirection = selectorFamily({
    key: '[ogranizace] sort direction for given column',
    get:
        (column: SortableColumn) =>
        ({ get }): SortDirection => {
            const values = get(sortingState);
            const current = values.find(o => o.column === column);
            if (!current) return undefined;

            return current.direction;
        },
});

export const sortOrganizations = (organizations: IOrganizace[], ordering: Order[]): IOrganizace[] => {
    return organizations.sort((a, b) => {
        for (const order of ordering) {
            const direction = order.direction === 'ASC' ? 1 : -1;
            const aValue = a[order.column];
            const bValue = b[order.column];
            if (!aValue) return -1;
            if (!bValue) return 1;
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
        }

        return 0;
    });
};
