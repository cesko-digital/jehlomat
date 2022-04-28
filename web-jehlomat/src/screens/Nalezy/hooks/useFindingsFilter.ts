import { useCallback, useState } from 'react';
import { GridFilter } from 'screens/Nalezy/types/GridFilter';
import { RangeKind } from 'screens/Nalezy/types/RangeKind';
import { Range } from 'screens/Nalezy/types/Range';
import { ReporterType } from 'screens/Nalezy/types/ReporterType';
import { SyringeState } from 'screens/Nalezy/types/SyringeState';

const useFindings = () => {
    const [filter, setFilter] = useState<GridFilter>({
        ordering: [],
        pageInfo: { index: 0, size: 20 },
        filter: {},
    });

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

    const reload = useCallback(() => {
        setFilter(state => ({ ...state }));
    }, []);

    return {
        filter,
        filterByRange,
        resetByRange,
        filterByReporter,
        resetByReporter,
        filterByState,
        resetByState,
        reload,
    };
};

export default useFindings;
