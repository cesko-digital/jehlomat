import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from 'store/user';
import { Filter } from './Filter';
import Select from './Select';
import loadUsers, { User } from './utils/loadUsers';
import loadTeams, { Team } from './utils/loadTeams';
import { ReporterType } from '../types/ReporterType';
import { filteringState } from '../store';
import { Filtering } from '../types/Filtering';

interface SelectData {
    users: Array<User>;
    teams: Array<Team>;
}

const FilterByReporter: FunctionComponent = () => {
    const [items, setItems] = useState<SelectData>({ users: [], teams: [] });
    const [type, setType] = useState<ReporterType | ''>('');
    const [id, setId] = useState<number | undefined>();

    const user = useRecoilValue(userState);
    const setFilter = useSetRecoilState(filteringState);

    const filters = useCallback((type: ReporterType, id: number) => {
        setFilter((state: Filtering) => ({ ...state, createdBy: { type, id } }));
    }, [setFilter]);
    const reset = useCallback(() => {
        setFilter(state => {
            const filter = { ...state };
            delete filter.createdBy;

            return filter;
        });
    }, [setFilter]);

    useEffect(() => {
        if (!user || !user.isAdmin) return;

        Promise.all([loadUsers(user.organizationId), loadTeams(user.organizationId)]).then(
            ([users, teams]) => setItems({ users, teams }),
            () => console.warn('Loading failed'),
        );
    }, [user]);

    useEffect(() => {
        if (!type || !id) return;

        filters(type as ReporterType, id);
    }, [filters, type, id]);

    const handleReset = () => {
        setType('');
        setId(undefined);

        reset();
    };

    if (user && !user.isAdmin) {
        return null;
    }

    const hasTeams = type === 'TEAM' && items.teams.length > 0;
    const hasUsers = type === 'USER' && items.users.length > 0;

    return (
        <Filter title="Zadavatel nálezu" onReset={handleReset}>
            <Select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as ReporterType)}>
                <option value="">&nbsp;</option>
                <option value="TEAM">Tým</option>
                <option value="USER">Jednotlivec</option>
            </Select>
            <Select value={id} disabled={!type || !(hasTeams || hasUsers)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setId(+e.target.value)}>
                {type === 'TEAM' && (
                    <>
                        <option value="">&nbsp;</option>
                        {items.teams.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </>
                )}
                {type === 'USER' && (
                    <>
                        <option value="">&nbsp;</option>
                        {items.users.map(({ id, username }) => (
                            <option key={id} value={id}>
                                {username}
                            </option>
                        ))}
                    </>
                )}
            </Select>
        </Filter>
    );
};

export default FilterByReporter;
