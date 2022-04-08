import { useCallback, useState } from 'react';
import { GridFilter } from 'screens/Nalezy/types/GridFilter';
import { SortableColumn } from 'screens/Nalezy/types/SortableColumn';
import sort from 'screens/Nalezy/hooks/utils/sort';
import { RangeKind } from 'screens/Nalezy/types/RangeKind';
import { Range } from 'screens/Nalezy/types/Range';
import { ReporterType } from 'screens/Nalezy/types/ReporterType';
import { SyringeState } from 'screens/Nalezy/types/SyringeState';
import { SortDirection } from 'screens/Nalezy/types/SortDirection';

const useFindings = () => {
    const [filter, setFilter] = useState<GridFilter>({
        ordering: [],
        pageInfo: { index: 0, size: 20 },
        filter: {},
    });

    const direction = (column: SortableColumn): SortDirection => {
        const current = filter.ordering.find(o => o.column === column);
        if (!current) return undefined;

        return current.direction;
    };

    const handleSort = useCallback(
        (column: SortableColumn) => () => {
            setFilter(state => {
                const ordering = sort(state.ordering, column);

                console.log(">>> handle sort", ordering, state);
                return { ...state, ordering };
            });
        },
        [],
    );

    const filterByRange = useCallback((kind: RangeKind, range: Range) => {
        setFilter((state: GridFilter) => {
            const filter = { ...state.filter };
            delete filter.createdAt;
            delete filter.demolishedAt;

            if (kind === 'DEMOLISH') {
                return {
                    ...state,
                    filter: {
                        ...filter,
                        demolishedAt: range,
                    },
                };
            }

            if (kind === 'FIND') {
                return {
                    ...state,
                    filter: {
                        ...filter,
                        createdAt: range,
                    },
                };
            }

            return state;
        });
    }, []);
    const resetByRange = useCallback(() => {
        setFilter(state => {
            const filter = { ...state.filter };
            delete filter.createdAt;
            delete filter.demolishedAt;

            return { ...state, filter };
        });
    }, []);

    const filterByReporter = useCallback((type: ReporterType, id: number) => {
        setFilter((state: GridFilter) => {
            const filter = {
                ...state.filter,
                createdBy: { type, id },
            };

            return { ...state, filter };
        });
    }, []);
    const resetByReporter = useCallback(() => {
        setFilter(state => {
            const filter = { ...state.filter };
            delete filter.createdBy;

            return { ...state, filter };
        });
    }, []);

    const filterByState = useCallback((status: SyringeState) => {
        setFilter((state: GridFilter) => {
            const filter = {
                ...state.filter,
                status,
            };

            return { ...state, filter };
        });
    }, []);
    const resetByState = useCallback(() => {
        setFilter(state => {
            const filter = { ...state.filter };
            delete filter.status;

            return { ...state, filter };
        });
    }, []);

    return {
        filter,
        handleSort,
        filterByRange,
        resetByRange,
        filterByReporter,
        resetByReporter,
        filterByState,
        resetByState,
        direction,
    };
};

export default useFindings;
