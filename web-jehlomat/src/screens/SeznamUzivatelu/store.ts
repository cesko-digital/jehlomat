import { atom, selectorFamily } from 'recoil';
import { ITeam, IUser } from 'types';

export type SortableColumn = 'username' | 'teamName' | 'email';
export type SortDirection = 'ASC' | 'DESC' | undefined;

export interface Order {
    column: SortableColumn;
    direction: 'ASC' | 'DESC';
}

export const sortingState = atom<Order[]>({
    key: '[uzivatele] sorting',
    default: [],
});

export const columnSortingDirection = selectorFamily({
    key: '[uzivatele] sort direction for given column',
    get:
        (column: SortableColumn) =>
        ({ get }): SortDirection => {
            const values = get(sortingState);
            const current = values.find(o => o.column === column);
            if (!current) return undefined;

            return current.direction;
        },
});

interface EnrichedUser {
    id: number;
    email: string;
    username: string;
    organizationId: number;
    teamId: number | undefined;
    teamName: string | undefined;
    isAdmin: boolean;
    verified?: boolean;
}

export const sortUsers = (users: IUser[], teams: ITeam[], ordering: Order[]): IUser[] => {
    const sorted: EnrichedUser[] = users.map(user => {
        return {
            ...user,
            teamName: teams.find(t => t.id === user.teamId)?.name,
        };
    });
    sorted.sort((a, b) => {
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

    return sorted;
};
